import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { Todo, TodoCreate, TodoFilter, TodoListResponse, TodoUpdate } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly path = '/todos';

  constructor(private api: ApiService) {}

  getAll(filter: TodoFilter = {}): Observable<TodoListResponse> {
    const params: Record<string, string | number | boolean> = {};
    if (filter.page !== undefined) params['page'] = filter.page;
    if (filter.size !== undefined) params['size'] = filter.size;
    if (filter.completed !== undefined) params['completed'] = filter.completed;
    return this.api.get<TodoListResponse>(this.path, params);
  }

  getById(id: number): Observable<Todo> {
    return this.api.get<Todo>(`${this.path}/${id}`);
  }

  create(payload: TodoCreate): Observable<Todo> {
    return this.api.post<Todo>(this.path, payload);
  }

  update(id: number, payload: TodoUpdate): Observable<Todo> {
    return this.api.patch<Todo>(`${this.path}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.path}/${id}`);
  }

  toggleComplete(todo: Todo): Observable<Todo> {
    return this.update(todo.id, { completed: !todo.completed });
  }
}
