import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RisksIssuesRoutingModule } from './risks-issues-routing.module';
import { RiskIssueListComponent } from './components/risk-issue-list/risk-issue-list.component';
import { RiskIssueFormComponent } from './components/risk-issue-form/risk-issue-form.component';

@NgModule({
  declarations: [RiskIssueListComponent, RiskIssueFormComponent],
  imports: [SharedModule, RisksIssuesRoutingModule],
})
export class RisksIssuesModule {}
