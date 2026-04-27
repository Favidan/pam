export type ItemType = 'risk' | 'issue';
export type Status = 'open' | 'in_progress' | 'resolved' | 'closed';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Probability = 'low' | 'medium' | 'high';
export type Impact = 'low' | 'medium' | 'high' | 'critical';

export interface RiskIssue {
  id: number;
  type: ItemType;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  probability: Probability | null;
  impact: Impact | null;
  owner: string | null;
  due_date: string | null;
  is_overdue: boolean;
  days_until_due: number | null;
  created_at: string;
  updated_at: string;
}

export interface RiskIssueCreate {
  type: ItemType;
  title: string;
  description?: string | null;
  status?: Status;
  priority?: Priority;
  probability?: Probability | null;
  impact?: Impact | null;
  owner?: string | null;
  due_date?: string | null;
}

export interface RiskIssueUpdate {
  title?: string;
  description?: string | null;
  status?: Status;
  priority?: Priority;
  probability?: Probability | null;
  impact?: Impact | null;
  owner?: string | null;
  due_date?: string | null;
}

export interface RiskIssueListResponse {
  total: number;
  page: number;
  size: number;
  items: RiskIssue[];
}

export interface RiskIssueFilter {
  page?: number;
  size?: number;
  type?: ItemType;
  status?: Status;
}
