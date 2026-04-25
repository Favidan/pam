import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TodosRoutingModule } from './todos-routing.module';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';

@NgModule({
  declarations: [TodoListComponent, TodoFormComponent],
  imports: [SharedModule, TodosRoutingModule],
})
export class TodosModule {}
