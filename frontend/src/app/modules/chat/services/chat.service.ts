import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { ChatMessage, RoomListResponse } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private api: ApiService) {}

  getRooms(): Observable<RoomListResponse> {
    return this.api.get<RoomListResponse>('/chat/rooms');
  }

  getHistory(room: string, limit = 50): Observable<ChatMessage[]> {
    return this.api.get<ChatMessage[]>(`/chat/${room}/messages`, { limit });
  }
}
