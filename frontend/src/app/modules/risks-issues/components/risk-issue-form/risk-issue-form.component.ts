import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RisksIssuesService } from '../../services/risks-issues.service';
import { RiskIssue } from '../../models/risk-issue.model';

@Component({
  standalone: false,
  selector: 'app-risk-issue-form',
  templateUrl: './risk-issue-form.component.html',
  styleUrls: ['./risk-issue-form.component.scss'],
})
export class RiskIssueFormComponent implements OnInit {
  @Input() item: RiskIssue | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;
  submitting = false;
  error: string | null = null;

  readonly priorities = ['low', 'medium', 'high', 'critical'];
  readonly probabilities = ['low', 'medium', 'high'];
  readonly impacts = ['low', 'medium', 'high', 'critical'];
  readonly statuses = ['open', 'in_progress', 'resolved', 'closed'];

  constructor(private fb: FormBuilder, private service: RisksIssuesService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      type: [this.item?.type ?? 'risk', Validators.required],
      title: [this.item?.title ?? '', [Validators.required, Validators.maxLength(255)]],
      description: [this.item?.description ?? ''],
      status: [this.item?.status ?? 'open', Validators.required],
      priority: [this.item?.priority ?? 'medium', Validators.required],
      probability: [this.item?.probability ?? ''],
      impact: [this.item?.impact ?? ''],
      owner: [this.item?.owner ?? ''],
      due_date: [this.item?.due_date ?? ''],
    });
  }

  get isEdit(): boolean {
    return this.item !== null;
  }

  get isRisk(): boolean {
    return this.form.get('type')?.value === 'risk';
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.error = null;

    const raw = this.form.value;
    const payload = {
      ...raw,
      probability: raw.probability || null,
      impact: raw.impact || null,
      owner: raw.owner || null,
      due_date: raw.due_date || null,
      description: raw.description || null,
    };

    const request$ = this.isEdit
      ? this.service.update(this.item!.id, payload)
      : this.service.create(payload);

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
