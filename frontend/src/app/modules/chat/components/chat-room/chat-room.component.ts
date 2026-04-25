import {
  Component, OnInit, OnDestroy, signal, ViewChild,
  ElementRef, AfterViewChecked,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { ChatWsService } from '../../services/chat-ws.service';
import { ChatMessage } from '../../models/message.model';

@Component({
  standalone: false,
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageList') private messageList!: ElementRef<HTMLUListElement>;

  room   = '';
  author = '';

  messages    = signal<ChatMessage[]>([]);
  status      = signal<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  onlineUsers = signal(0);
  loadingHistory = signal(true);

  inputCtrl = new FormControl('', [Validators.required, Validators.maxLength(2000)]);

  private subs = new Subscription();
  private shouldScroll = false;

  constructor(
    private route:  ActivatedRoute,
    private router: Router,
    private chat:   ChatService,
    private ws:     ChatWsService,
  ) {}

  ngOnInit(): void {
    this.room   = this.route.snapshot.paramMap.get('room') ?? '';
    this.author = this.route.snapshot.queryParamMap.get('author') ?? '';

    if (!this.room || !this.author) {
      this.router.navigate(['/chat']);
      return;
    }

    this.loadHistory();
    this.connectWs();
  }

  private loadHistory(): void {
    this.chat.getHistory(this.room).subscribe({
      next: msgs => {
        this.messages.set(msgs.map(m => ({ ...m, type: 'message' as const })));
        this.loadingHistory.set(false);
        this.shouldScroll = true;
      },
      error: () => this.loadingHistory.set(false),
    });
  }

  private connectWs(): void {
    this.ws.connect(this.room, this.author);

    this.subs.add(
      this.ws.status().subscribe(s => {
        this.status.set(s === 'connected' ? 'connected' : s === 'error' ? 'error' : 'disconnected');
      })
    );

    this.subs.add(
      this.ws.messages().subscribe(msg => {
        if (msg.users !== undefined) this.onlineUsers.set(msg.users);
        this.messages.update(list => [...list, msg]);
        this.shouldScroll = true;
      })
    );
  }

  send(): void {
    const text = this.inputCtrl.value?.trim();
    if (!text || this.inputCtrl.invalid) return;
    this.ws.send(text);
    this.inputCtrl.reset();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  isOwn(msg: ChatMessage): boolean {
    return msg.author === this.author;
  }

  leaveRoom(): void {
    this.ws.close();
    this.router.navigate(['/chat']);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom(): void {
    try {
      const el = this.messageList?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch { /* ignore */ }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.ws.close();
  }
}
