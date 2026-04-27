"""Content extraction.

The design document specifies Apache Tika as the extraction engine. To keep the
PAM stack self-contained (no Docker sidecar, no external dependency), this MVP
extractor reads plain-text MIME types directly. Files outside the textual MIME
allow-list, or above the configured size threshold, are indexed metadata-only.
The interface is the same as the doc's Tika wrapper, so swapping in
`tika-python` later is a one-file change.
"""

from typing import BinaryIO, Optional
import logging

logger = logging.getLogger(__name__)


TEXTUAL_MIME_PREFIXES = ("text/",)
TEXTUAL_MIME_TYPES = {
    "application/json",
    "application/xml",
    "application/javascript",
    "application/x-yaml",
    "application/yaml",
    "application/sql",
    "application/x-sh",
    "application/toml",
    "application/x-python",
    "image/svg+xml",
}
TEXTUAL_EXTENSIONS = {
    "txt", "md", "markdown", "rst", "csv", "tsv", "log",
    "json", "xml", "yaml", "yml", "toml", "ini", "cfg", "conf",
    "py", "js", "ts", "jsx", "tsx", "java", "c", "h", "cpp", "hpp",
    "cs", "go", "rb", "rs", "php", "swift", "kt", "scala",
    "html", "htm", "css", "scss", "sass", "less",
    "sh", "bash", "zsh", "ps1", "bat", "cmd",
    "sql", "graphql", "proto", "dockerfile",
}


def is_textual(mime_type: Optional[str], extension: Optional[str]) -> bool:
    if mime_type:
        if any(mime_type.startswith(p) for p in TEXTUAL_MIME_PREFIXES):
            return True
        if mime_type in TEXTUAL_MIME_TYPES:
            return True
    if extension and extension.lower() in TEXTUAL_EXTENSIONS:
        return True
    return False


def extract_text(
    stream: BinaryIO,
    mime_type: Optional[str],
    extension: Optional[str] = None,
    max_chars: int = 5_000_000,
) -> Optional[str]:
    """Read a text stream and return its decoded content (truncated to max_chars).

    Returns None for non-textual files. Binary formats like PDF/DOCX/XLSX are
    detected and skipped — wire in a Tika HTTP client here when available.
    """
    if not is_textual(mime_type, extension):
        return None

    try:
        raw = stream.read(max_chars)
    except OSError as exc:
        logger.warning("Failed to read stream: %s", exc)
        return None

    for encoding in ("utf-8", "utf-16", "latin-1"):
        try:
            return raw.decode(encoding, errors="strict")
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="replace")
