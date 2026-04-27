import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  {
    path: 'todos',
    loadChildren: () => import('./modules/todos/todos.module').then(m => m.TodosModule),
  },
  {
    path: 'chat',
    loadChildren: () => import('./modules/chat/chat.module').then(m => m.ChatModule),
  },
  {
    path: 'risks-issues',
    loadChildren: () => import('./modules/risks-issues/risks-issues.module').then(m => m.RisksIssuesModule),
  },
  { path: '**', redirectTo: 'todos' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
