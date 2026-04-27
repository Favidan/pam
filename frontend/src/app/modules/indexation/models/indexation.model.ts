export type SourceType = 'local' | 'onedrive';
export type JobStatus = 'running' | 'success' | 'failed' | 'cancelled';
export type JobTrigger = 'cron' | 'manual';
export type SearchSort = 'relevance' | 'modified_desc' | 'name_asc';

export interface FacetBucket {
  value: string;
  count: number;
}

export interface FileSearchItem {
  id: number;
  filename: string;
  full_path: string;
  source_type: SourceType;
  extension: string | null;
  size_bytes: number | null;
  modified_at_source: string | null;
  rank: number;
  snippet: string | null;
}

export interface FileSearchResponse {
  total: number;
  page: number;
  page_size: number;
  items: FileSearchItem[];
  facets: { [key: string]: FacetBucket[] };
}

export interface FileDetail {
  id: number;
  source_type: SourceType;
  source_id: string;
  filename: string;
  full_path: string;
  extension: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  created_at_source: string | null;
  modified_at_source: string | null;
  last_indexed_at: string | null;
  content_hash: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  extracted_text: string | null;
  language: string | null;
}

export interface JobSummary {
  id: number;
  triggered_by: JobTrigger;
  triggered_by_user_id: number | null;
  status: JobStatus;
  started_at: string;
  finished_at: string | null;
  sources_scanned: unknown;
  files_added: number;
  files_updated: number;
  files_deleted: number;
  files_failed: number;
  error_message: string | null;
}

export interface JobRunResponse {
  job_id: number;
  status: JobStatus;
}

export interface SourceConfig {
  id: number;
  source_type: SourceType;
  name: string;
  enabled: boolean;
  config: Record<string, unknown>;
  last_run_token: string | null;
  last_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SourceConfigCreate {
  source_type: SourceType;
  name: string;
  enabled?: boolean;
  config?: Record<string, unknown>;
}

export interface SourceConfigUpdate {
  name?: string;
  enabled?: boolean;
  config?: Record<string, unknown>;
}

export interface IndexationStats {
  total_files: number;
  total_deleted: number;
  total_size_bytes: number;
  by_source: Record<string, number>;
  by_extension: Record<string, number>;
  last_job: JobSummary | null;
}

export interface SearchQuery {
  text: string;
  sources: SourceType[];
  extensions: string[];
  modifiedAfter: Date | null;
  modifiedBefore: Date | null;
  page: number;
  pageSize: number;
  sort: SearchSort;
}

export const initialSearchQuery: SearchQuery = {
  text: '',
  sources: [],
  extensions: [],
  modifiedAfter: null,
  modifiedBefore: null,
  page: 1,
  pageSize: 20,
  sort: 'relevance',
};
