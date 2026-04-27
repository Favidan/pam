import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiskIssueListComponent } from './components/risk-issue-list/risk-issue-list.component';

const routes: Routes = [{ path: '', component: RiskIssueListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RisksIssuesRoutingModule {}
