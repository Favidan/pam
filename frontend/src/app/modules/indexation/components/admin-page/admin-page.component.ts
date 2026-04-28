import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { IndexationApiService } from '../../services/indexation-api.service';
import { JobPollingService } from '../../services/job-polling.service';
import {
  IndexationStats,
  JobSummary,
  SourceConfig,
  SourceType,
} from '../../models/indexation.model';

@Component({
  standalone: false,
  selector: 'app-indexation-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit, OnDestroy {
  jobs = signal<JobSummary[]>([]);
  latest = signal<JobSummary | null>(null);
  stats = signal<IndexationStats | null>(null);
  sources = signal<SourceConfig[]>([]);
  /** True from click until the 202 response arrives (prevents double-click) */
  triggering = signal(false);
  error = signal<string | null>(null);

  // Add-source form state
  showAddForm = signal(false);
  newName = '';
  newType: SourceType = 'local';
  newRoot = '';

  private latestSub?: Subscription;

  constructor(
    private api: IndexationApiService,
    private polling: JobPollingService,
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.latestSub = this.polling.watchLatest().subscribe(j => {
      this.latest.set(j);
      // Once the server confirms a running job, clear the "Starting…" state
      if (j?.status === 'running') {
        this.triggering.set(false);
      }
      // Refresh full list and stats whenever a job finishes
      if (j && j.status !== 'running') {
        this.triggering.set(false);
        this.loadJobs();
        this.loadStats();
      }
    });
  }

  ngOnDestroy(): void {
    this.latestSub?.unsubscribe();
  }

  /** Returns true when a job is actively running on the server */
  isRunning(): boolean {
    return this.latest()?.status === 'running';
  }

  loadAll(): void {
    this.loadJobs();
    this.loadStats();
    this.loadSources();
  }

  loadJobs(): void {
    this.api.listJobs(50).subscribe({
      next: list => this.jobs.set(list),
      error: err => this.error.set(err?.message || 'Failed to load jobs'),
    });
  }

  loadStats(): void {
    this.api.getStats().subscribe(s => this.stats.set(s));
  }

  loadSources(): void {
    this.api.listSources().subscribe(s => this.sources.set(s));
  }

  triggerJob(): void {
    if (this.triggering() || this.isRunning()) return;  // guard against double-click
    this.triggering.set(true);
    this.error.set(null);
    this.api.triggerJob().subscribe({
      next: () => {
        // 202 received — job is queued. Keep triggering=true until polling
        // confirms the job is running (handled in the subscription above).
        // Refresh the jobs list so the new row appears quickly.
        this.loadJobs();
      },
      error: err => {
        this.triggering.set(false);
        this.error.set(err?.error?.detail || err?.message || 'Trigger failed');
      },
    });
  }

  toggleSource(s: SourceConfig): void {
    this.api.updateSource(s.id, { enabled: !s.enabled }).subscribe(updated => {
      this.sources.update(list =>
        list.map(item => (item.id === updated.id ? updated : item)),
      );
    });
  }

  deleteSource(s: SourceConfig): void {
    if (!confirm(`Delete source "${s.name}"? Indexed files for this source remain.`)) return;
    this.api.deleteSource(s.id).subscribe(() => this.loadSources());
  }

  showAdd(): void {
    this.showAddForm.set(true);
    this.newName = '';
    this.newType = 'local';
    this.newRoot = '';
  }

  cancelAdd(): void {
    this.showAddForm.set(false);
  }

  submitAdd(): void {
    if (!this.newName.trim() || !this.newRoot.trim()) {
      this.error.set('Name and root path are required');
      return;
    }
    this.api
      .createSource({
        source_type: this.newType,
        name: this.newName.trim(),
        config: { root_path: this.newRoot.trim() },
      })
      .subscribe({
        next: () => {
          this.showAddForm.set(false);
          this.loadSources();
        },
        error: err => this.error.set(err?.message || 'Create failed'),
      });
  }

  jobDuration(job: JobSummary): string {
    if (!job.finished_at) return 'running...';
    const start = new Date(job.started_at).getTime();
    const end = new Date(job.finished_at).getTime();
    const seconds = Math.max(0, Math.round((end - start) / 1000));
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const rem = seconds % 60;
    return `${minutes}m ${rem}s`;
  }

  formatDate(value: string | null): string {
    if (!value) return '—';
    return new Date(value).toLocaleString();
  }
}
