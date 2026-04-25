export type WsEventType = 'message' | 'system' | 'users_update';

export interface ChatMessage {
  type:       WsEventType;
  id?:        number;
  room:       string;
  author:     string;
  content:    string;
  created_at?: string;
  users?:     number;
}

export interface RoomInfo {
  name:            string;
  connected_users: number;
}

export interface RoomListResponse {
  rooms: RoomInfo[];
}
