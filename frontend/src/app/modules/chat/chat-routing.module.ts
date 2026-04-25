import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatJoinComponent } from './components/chat-join/chat-join.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';

const routes: Routes = [
  { path: '',       component: ChatJoinComponent },
  { path: ':room',  component: ChatRoomComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
