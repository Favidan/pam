import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatJoinComponent } from './components/chat-join/chat-join.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';

@NgModule({
  declarations: [ChatJoinComponent, ChatRoomComponent],
  imports: [SharedModule, ChatRoutingModule],
})
export class ChatModule {}
