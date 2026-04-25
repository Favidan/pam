export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TodoCreate {
  title: string;
  description?: string | null;
  completed?: boolean;
}

export interface TodoUpdate {
  title?: string;
  description?: string | null;
  completed?: boolean;
}

export interface TodoListResponse {
  total: number;
  page: number;
  size: number;
  items: Todo[];
}

export interface TodoFilter {
  page?: number;
  size?: number;
  completed?: boolean;
}
