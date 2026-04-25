import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  standalone: false,
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent implements OnInit {
  @Input() todo: Todo | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;
  submitting = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private todoService: TodoService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.todo?.title ?? '', [Validators.required, Validators.maxLength(255)]],
      description: [this.todo?.description ?? ''],
      completed: [this.todo?.completed ?? false],
    });
  }

  get isEdit(): boolean {
    return this.todo !== null;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.error = null;

    const payload = this.form.value;
    const request$ = this.isEdit
      ? this.todoService.update(this.todo!.id, payload)
      : this.todoService.create(payload);

    request$.subscribe({
      next: () => {
        this.submitting = false;
        this.saved.emit();
      },
      error: (err: Error) => {
        this.error = err.message;
        this.submitting = false;
      },
    });
  }
}
