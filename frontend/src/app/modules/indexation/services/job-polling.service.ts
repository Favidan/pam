import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  takeWhile,
} from 'rxjs/operators';
import { JobSummary } from '../models/indexation.model';
import { IndexationApiService } from './indexation-api.service';

@Injectable({ providedIn: 'root' })
export class JobPollingService {
  constructor(private api: IndexationApiService) {}

  /**
   * Poll a specific job every 2 s until it is no longer 'running'.
   * Emits the final non-running state once before completing.
   */
  watchJob(id: number): Observable<JobSummary> {
    return timer(0, 2000).pipe(
      switchMap(() =>
        this.api.getJob(id).pipe(catchError(() => of(null as unknown as JobSummary))),
      ),
      takeWhile(j => !!j && j.status === 'running', /* inclusive */ true),
    );
  }

  /**
   * Poll GET /jobs?limit=1 every 2 s.
   * Emits the latest job (or null when no jobs exist).
   * Uses distinctUntilChanged on (id + status) to avoid redundant updates
   * while a job is idle, but still emits live counter updates while running.
   */
  watchLatest(): Observable<JobSummary | null> {
    return timer(0, 2000).pipe(
      switchMap(() =>
        this.api
          .listJobs(1)
          .pipe(catchError(() => of([] as JobSummary[]))),
      ),
      map(list => list[0] ?? null),
      // Suppress re-emissions when nothing meaningful changed (idle state)
      distinctUntilChanged((a, b) => {
        if (a === b) return true;
        if (!a || !b) return false;
        // Always let running-job updates through (counters change each poll)
        if (a.status === 'running' || b.status === 'running') return false;
        // For finished jobs only suppress if id + status haven't changed
        return a.id === b.id && a.status === b.status;
      }),
      shareReplay(1),
    );
  }
}
