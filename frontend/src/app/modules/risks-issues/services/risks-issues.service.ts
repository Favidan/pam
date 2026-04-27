import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import {
  RiskIssue,
  RiskIssueCreate,
  RiskIssueFilter,
  RiskIssueListResponse,
  RiskIssueUpdate,
} from '../models/risk-issue.model';

@Injectable({ providedIn: 'root' })
export class RisksIssuesService {
  private readonly path = '/risks-issues';

  constructor(private api: ApiService) {}

  getAll(filter: RiskIssueFilter = {}): Observable<RiskIssueListResponse> {
    const params: Record<string, string | number> = {};
    if (filter.page !== undefined) params['page'] = filter.page;
    if (filter.size !== undefined) params['size'] = filter.size;
    if (filter.type !== undefined) params['type'] = filter.type;
    if (filter.status !== undefined) params['status'] = filter.status;
    return this.api.get<RiskIssueListResponse>(this.path, params);
  }

  getById(id: number): Observable<RiskIssue> {
    return this.api.get<RiskIssue>(`${this.path}/${id}`);
  }

  getAlerts(daysAhead: number = 7): Observable<RiskIssue[]> {
    return this.api.get<RiskIssue[]>(`${this.path}/alerts`, { days_ahead: daysAhead });
  }

  create(payload: RiskIssueCreate): Observable<RiskIssue> {
    return this.api.post<RiskIssue>(this.path, payload);
  }

  update(id: number, payload: RiskIssueUpdate): Observable<RiskIssue> {
    return this.api.patch<RiskIssue>(`${this.path}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.path}/${id}`);
  }
}
