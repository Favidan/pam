import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SearchStateService } from '../../services/search-state.service';
import { FileSearchResponse, SearchSort, SourceType } from '../../models/indexation.model';

@Component({
  standalone: false,
  selector: 'app-indexation-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit, OnDestroy {
  results = signal<FileSearchResponse | null>(null);
  loading = signal(false);
  text = '';
  selectedSources = signal<Set<SourceType>>(new Set());
  selectedExtensions = signal<Set<string>>(new Set());
  sort = signal<SearchSort>('relevance');

  private sub?: Subscription;

  constructor(public state: SearchStateService, private router: Router) {}

  ngOnInit(): void {
    this.text = this.state.value.text;
    this.selectedSources.set(new Set(this.state.value.sources));
    this.selectedExtensions.set(new Set(this.state.value.extensions));
    this.sort.set(this.state.value.sort);

    this.loading.set(true);
    this.sub = this.state.results$.subscribe(res => {
      this.results.set(res);
      this.loading.set(false);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onTextChange(value: string): void {
    this.text = value;
    this.state.update({ text: value });
  }

  toggleSource(source: SourceType): void {
    const next = new Set(this.selectedSources());
    if (next.has(source)) next.delete(source); else next.add(source);
    this.selectedSources.set(next);
    this.state.update({ sources: Array.from(next) });
  }

  toggleExtension(ext: string): void {
    const next = new Set(this.selectedExtensions());
    if (next.has(ext)) next.delete(ext); else next.add(ext);
    this.selectedExtensions.set(next);
    this.state.update({ extensions: Array.from(next) });
  }

  setSort(value: SearchSort): void {
    this.sort.set(value);
    this.state.update({ sort: value });
  }

  nextPage(): void {
    const r = this.results();
    if (!r) return;
    if (r.page * r.page_size < r.total) {
      this.state.update({ page: r.page + 1 });
    }
  }

  prevPage(): void {
    const r = this.results();
    if (!r || r.page <= 1) return;
    this.state.update({ page: r.page - 1 });
  }

  openFile(id: number): void {
    this.router.navigate(['/indexation/files', id]);
  }

  formatBytes(bytes: number | null): string {
    if (bytes === null || bytes === undefined) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
  }

  formatDate(value: string | null): string {
    if (!value) return '';
    return new Date(value).toLocaleString();
  }

  totalPages(total: number, pageSize: number): number {
    if (total <= 0) return 1;
    return Math.ceil(total / pageSize);
  }
}
