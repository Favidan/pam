import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Renders snippets returned by the API which may contain <mark>...</mark> tags.
 * The backend already escapes everything else, so we only re-allow <mark>.
 */
@Pipe({ standalone: false, name: 'safeSnippet' })
export class SafeSnippetPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
