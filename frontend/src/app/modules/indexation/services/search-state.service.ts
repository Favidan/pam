import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, shareReplay, switchMap } from 'rxjs/operators';
import {
  FileSearchResponse,
  SearchQuery,
  initialSearchQuery,
} from '../models/indexation.model';
import { IndexationApiService } from './indexation-api.service';

const emptyResult: FileSearchResponse = {
  total: 0,
  page: 1,
  page_size: 20,
  items: [],
  facets: { source_type: [], extension: [] },
};

@Injectable({ providedIn: 'root' })
export class SearchStateService {
  private readonly _query$ = new BehaviorSubject<SearchQuery>(initialSearchQuery);
  readonly query$ = this._query$.asObservable();

  readonly results$: Observable<FileSearchResponse> = this.query$.pipe(
    debounceTime(300),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    switchMap(q =>
      this.api.search(q).pipe(catchError(() => of(emptyResult))),
    ),
    shareReplay(1),
  );

  constructor(private api: IndexationApiService) {}

  get value(): SearchQuery {
    return this._query$.value;
  }

  update(patch: Partial<SearchQuery>): void {
    const next = { ...this._query$.value, ...patch };
    // Reset pagination if anything other than page changed
    const onlyPageChanged =
      Object.keys(patch).length === 1 && Object.prototype.hasOwnProperty.call(patch, 'page');
    if (!onlyPageChanged) {
      next.page = 1;
    }
    this._query$.next(next);
  }

  reset(): void {
    this._query$.next(initialSearchQuery);
  }
}
