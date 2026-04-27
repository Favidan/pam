import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiService } from '@core/services/api.service';
import {
  FileDetail,
  FileSearchResponse,
  IndexationStats,
  JobRunResponse,
  JobSummary,
  SearchQuery,
  SourceConfig,
  SourceConfigCreate,
  SourceConfigUpdate,
} from '../models/indexation.model';

@Injectable({ providedIn: 'root' })
export class IndexationApiService {
  private readonly path = '/indexation';
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private api: ApiService) {}

  search(q: SearchQuery): Observable<FileSearchResponse> {
    let params = new HttpParams()
      .set('q', q.text)
      .set('page', q.page)
      .set('page_size', q.pageSize)
      .set('sort', q.sort);
    q.sources.forEach(s => (params = params.append('source', s)));
    q.extensions.forEach(e => (params = params.append('ext', e)));
    if (q.modifiedAfter) params = params.set('modified_after', q.modifiedAfter.toISOString());
    if (q.modifiedBefore) params = params.set('modified_before', q.modifiedBefore.toISOString());
    return this.http.get<FileSearchResponse>(`${this.baseUrl}${this.path}/files/search`, { params });
  }

  getFile(id: number): Observable<FileDetail> {
    return this.api.get<FileDetail>(`${this.path}/files/${id}`);
  }

  downloadUrl(id: number): string {
    return `${this.baseUrl}${this.path}/files/${id}/download`;
  }

  listJobs(limit = 50): Observable<JobSummary[]> {
    return this.api.get<JobSummary[]>(`${this.path}/jobs`, { limit });
  }

  getJob(id: number): Observable<JobSummary> {
    return this.api.get<JobSummary>(`${this.path}/jobs/${id}`);
  }

  triggerJob(sources?: string[]): Observable<JobRunResponse> {
    return this.api.post<JobRunResponse>(`${this.path}/jobs/run`, { sources: sources ?? null });
  }

  listSources(): Observable<SourceConfig[]> {
    return this.api.get<SourceConfig[]>(`${this.path}/sources`);
  }

  createSource(payload: SourceConfigCreate): Observable<SourceConfig> {
    return this.api.post<SourceConfig>(`${this.path}/sources`, payload);
  }

  updateSource(id: number, payload: SourceConfigUpdate): Observable<SourceConfig> {
    return this.api.patch<SourceConfig>(`${this.path}/sources/${id}`, payload);
  }

  deleteSource(id: number): Observable<void> {
    return this.api.delete<void>(`${this.path}/sources/${id}`);
  }

  getStats(): Observable<IndexationStats> {
    return this.api.get<IndexationStats>(`${this.path}/stats`);
  }
}
