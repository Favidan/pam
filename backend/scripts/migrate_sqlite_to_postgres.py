"""
One-shot migration: copy all rows from the legacy SQLite backup (pam.db)
into the configured Postgres database.

Run from the backend/ directory:
    python -m scripts.migrate_sqlite_to_postgres

Assumes Postgres tables already exist (created by app startup / init_db).
Existing rows in Postgres are NOT cleared — re-running may cause PK conflicts.
"""
from __future__ import annotations

import sys
from pathlib import Path

from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import Session

# Ensure backend/ is on sys.path when run as a script
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.core.config import settings  # noqa: E402
from app.core.database import Base  # noqa: E402

# Importing modules registers their models on Base.metadata
from app.modules.todos import models as _todos_models  # noqa: F401,E402
from app.modules.chat import models as _chat_models  # noqa: F401,E402
from app.modules.risks_issues import models as _risks_models  # noqa: F401,E402
from app.modules.indexation import models as _indexation_models  # noqa: F401,E402


SQLITE_URL = "sqlite:///./pam.db"


def to_sync_pg_url(url: str) -> str:
    # psycopg3 driver works for both sync and async; create_engine() is sync.
    if url.startswith("postgresql+psycopg://"):
        return url
    if url.startswith("postgresql+asyncpg://"):
        return url.replace("postgresql+asyncpg://", "postgresql+psycopg://", 1)
    return url


def main() -> int:
    pg_url = to_sync_pg_url(settings.DATABASE_URL)
    if not pg_url.startswith("postgresql"):
        print(f"Refusing to run: DATABASE_URL is not Postgres ({pg_url!r}).")
        return 2

    sqlite_path = ROOT / "pam.db"
    if not sqlite_path.exists():
        print(f"SQLite source not found at {sqlite_path}")
        return 2

    src = create_engine(SQLITE_URL, future=True)
    dst = create_engine(pg_url, future=True)

    tables = Base.metadata.sorted_tables  # dependency order (parents first)

    def sanitize(value):
        # Postgres text columns reject NUL bytes; SQLite tolerates them.
        if isinstance(value, str):
            return value.replace("\x00", "")
        if isinstance(value, (bytes, bytearray)):
            return bytes(value).replace(b"\x00", b"")
        return value

    total = 0
    with src.connect() as sconn, Session(dst) as dsess:
        for table in tables:
            rows = sconn.execute(select(table)).mappings().all()
            if not rows:
                print(f"  - {table.name}: 0 rows (skipped)")
                continue
            payload = [{k: sanitize(v) for k, v in dict(r).items()} for r in rows]
            try:
                dsess.execute(table.insert(), payload)
                dsess.commit()
                print(f"  - {table.name}: {len(payload)} rows")
                total += len(payload)
            except Exception as e:
                dsess.rollback()
                print(f"  ! {table.name}: FAILED ({e.__class__.__name__}: {e})")

        # Reset sequences for integer PKs so future inserts don't collide
        print("Resetting Postgres sequences...")
        for table in tables:
            for col in table.primary_key.columns:
                if col.autoincrement and str(col.type).upper().startswith(("INT", "BIG", "SMALL")):
                    seq_sql = text(
                        f"SELECT setval(pg_get_serial_sequence(:t, :c), "
                        f"COALESCE((SELECT MAX({col.name}) FROM {table.name}), 0) + 1, false)"
                    )
                    try:
                        dsess.execute(seq_sql, {"t": table.name, "c": col.name})
                        dsess.commit()
                    except Exception as e:
                        dsess.rollback()
                        print(f"    ! could not reset seq for {table.name}.{col.name}: {e}")

    print(f"Done. Migrated {total} rows across {len(tables)} tables.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
