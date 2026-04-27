import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IndexationApiService } from '../../services/indexation-api.service';
import { FileDetail } from '../../models/indexation.model';

@Component({
  standalone: false,
  selector: 'app-indexation-file-detail',
  templateUrl: './file-detail-page.component.html',
  styleUrls: ['./file-detail-page.component.scss'],
})
export class FileDetailPageComponent implements OnInit {
  file = signal<FileDetail | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: IndexationApiService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('Invalid file id');
      return;
    }
    this.loading.set(true);
    this.api.getFile(id).subscribe({
      next: f => {
        this.file.set(f);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.message || 'Failed to load file');
        this.loading.set(false);
      },
    });
  }

  back(): void {
    this.router.navigate(['/indexation/search']);
  }

  downloadUrl(): string | null {
    const f = this.file();
    return f ? this.api.downloadUrl(f.id) : null;
  }
}
