import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ChatMessage } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class ChatWsService implements OnDestroy {
  private ws: WebSocket | null = null;
  private messages$ = new Subject<ChatMessage>();
  private status$   = new Subject<'connected' | 'disconnected' | 'error'>();

  private get wsBase(): string {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host  = (window as Window & { __WS_HOST__?: string }).__WS_HOST__ ?? '127.0.0.1:8000';
    return `${proto}//${host}/api/v1`;
  }

  messages(): Observable<ChatMessage> {
    return this.messages$.asObservable();
  }

  status(): Observable<'connected' | 'disconnected' | 'error'> {
    return this.status$.asObservable();
  }

  connect(room: string, author: string): void {
    this.close();
    const url = `${this.wsBase}/chat/${room}/ws?author=${encodeURIComponent(author)}`;
    this.ws = new WebSocket(url);

    this.ws.onopen    = () => this.status$.next('connected');
    this.ws.onclose   = () => this.status$.next('disconnected');
    this.ws.onerror   = () => this.status$.next('error');
    this.ws.onmessage = ({ data }) => {
      try {
        this.messages$.next(JSON.parse(data) as ChatMessage);
      } catch {
        // ignore malformed frames
      }
    };
  }

  send(text: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(text);
    }
  }

  close(): void {
    this.ws?.close();
    this.ws = null;
  }

  ngOnDestroy(): void {
    this.close();
  }
}
