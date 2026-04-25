import { Component, OnInit, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoListResponse } from '../../models/todo.model';

@Component({
  standalone: false,
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  todos = signal<Todo[]>([]);
  total = signal(0);
  page = signal(1);
  size = signal(20);
  filterCompleted = signal<boolean | undefined>(undefined);
  loading = signal(false);
  error = signal<string | null>(null);

  showForm = signal(false);
  editingTodo = signal<Todo | null>(null);

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.todoService
      .getAll({ page: this.page(), size: this.size(), completed: this.filterCompleted() })
      .subscribe({
        next: (res: TodoListResponse) => {
          this.todos.set(res.items);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: (err: Error) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }

  onToggle(todo: Todo): void {
    this.todoService.toggleComplete(todo).subscribe(() => this.load());
  }

  onDelete(id: number): void {
    if (!confirm('Delete this todo?')) return;
    this.todoService.delete(id).subscribe(() => this.load());
  }

  onEdit(todo: Todo): void {
    this.editingTodo.set(todo);
    this.showForm.set(true);
  }

  onNew(): void {
    this.editingTodo.set(null);
    this.showForm.set(true);
  }

  onSaved(): void {
    this.showForm.set(false);
    this.editingTodo.set(null);
    this.load();
  }

  onCancel(): void {
    this.showForm.set(false);
    this.editingTodo.set(null);
  }

  setFilter(completed: boolean | undefined): void {
    this.filterCompleted.set(completed);
    this.page.set(1);
    this.load();
  }

  nextPage(): void {
    if (this.page() * this.size() < this.total()) {
      this.page.update(p => p + 1);
      this.load();
    }
  }

  prevPage(): void {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
      this.load();
    }
  }
}
