import { Component, OnInit, signal } from '@angular/core';
import { RisksIssuesService } from '../../services/risks-issues.service';
import { RiskIssue, RiskIssueListResponse, ItemType, Status } from '../../models/risk-issue.model';

@Component({
  standalone: false,
  selector: 'app-risk-issue-list',
  templateUrl: './risk-issue-list.component.html',
  styleUrls: ['./risk-issue-list.component.scss'],
})
export class RiskIssueListComponent implements OnInit {
  items = signal<RiskIssue[]>([]);
  alerts = signal<RiskIssue[]>([]);
  total = signal(0);
  page = signal(1);
  size = signal(20);
  filterType = signal<ItemType | undefined>(undefined);
  filterStatus = signal<Status | undefined>(undefined);
  loading = signal(false);
  error = signal<string | null>(null);

  showForm = signal(false);
  editingItem = signal<RiskIssue | null>(null);

  constructor(private service: RisksIssuesService) {}

  ngOnInit(): void {
    this.load();
    this.loadAlerts();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service
      .getAll({ page: this.page(), size: this.size(), type: this.filterType(), status: this.filterStatus() })
      .subscribe({
        next: (res: RiskIssueListResponse) => {
          this.items.set(res.items);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: (err: Error) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }

  loadAlerts(): void {
    this.service.getAlerts(7).subscribe({
      next: (items) => this.alerts.set(items),
      error: () => this.alerts.set([]),
    });
  }

  onDelete(id: number): void {
    if (!confirm('Delete this item?')) return;
    this.service.delete(id).subscribe(() => {
      this.load();
      this.loadAlerts();
    });
  }

  onEdit(item: RiskIssue): void {
    this.editingItem.set(item);
    this.showForm.set(true);
  }

  onNew(): void {
    this.editingItem.set(null);
    this.showForm.set(true);
  }

  onSaved(): void {
    this.showForm.set(false);
    this.editingItem.set(null);
    this.load();
    this.loadAlerts();
  }

  onCancel(): void {
    this.showForm.set(false);
    this.editingItem.set(null);
  }

  setTypeFilter(type: ItemType | undefined): void {
    this.filterType.set(type);
    this.page.set(1);
    this.load();
  }

  setStatusFilter(status: Status | undefined): void {
    this.filterStatus.set(status);
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

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  deadlineLabel(item: RiskIssue): string {
    if (item.days_until_due === null) return '';
    if (item.is_overdue) return `Overdue by ${Math.abs(item.days_until_due)} day(s)`;
    if (item.days_until_due === 0) return 'Due today';
    return `Due in ${item.days_until_due} day(s)`;
  }
}
