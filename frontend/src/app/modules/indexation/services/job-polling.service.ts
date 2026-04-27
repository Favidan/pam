import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { catchError, shareReplay, switchMap, takeWhile } from 'rxjs/operators';
import { JobSummary } from '../models/indexation.model';
import { IndexationApiService } from './indexation-api.service';

@Injectable({ providedIn: 'root' })
export class JobPollingService {
  constructor(private api: IndexationApiService) {}

  watchJob(id: number): Observable<JobSummary> {
    return timer(0, 2000).pipe(
      switchMap(() => this.api.getJob(id).pipe(catchError(() => of(null as unknown as JobSummary)))),
      takeWhile(j => !!j && j.status === 'running', true),
      shareReplay(1),
    );
  }

  watchLatest(): Observable<JobSummary | null> {
    return timer(0, 2000).pipe(
      switchMap(() =>
        this.api
          .listJobs(1)
          .pipe(catchError(() => of([] as JobSummary[]))),
      ),
      switchMap(list => of(list[0] ?? null)),
      shareReplay(1),
    );
  }
}
