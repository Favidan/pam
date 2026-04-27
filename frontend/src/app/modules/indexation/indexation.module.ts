import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { IndexationRoutingModule } from './indexation-routing.module';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { FileDetailPageComponent } from './components/file-detail-page/file-detail-page.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { SafeSnippetPipe } from './pipes/safe-snippet.pipe';

@NgModule({
  declarations: [
    SearchPageComponent,
    FileDetailPageComponent,
    AdminPageComponent,
    SafeSnippetPipe,
  ],
  imports: [SharedModule, FormsModule, IndexationRoutingModule],
})
export class IndexationModule {}
