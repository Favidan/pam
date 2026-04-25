import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { RoomInfo } from '../../models/message.model';

@Component({
  standalone: false,
  selector: 'app-chat-join',
  templateUrl: './chat-join.component.html',
  styleUrls: ['./chat-join.component.scss'],
})
export class ChatJoinComponent implements OnInit {
  form!: FormGroup;
  rooms  = signal<RoomInfo[]>([]);
  loading = signal(false);

  constructor(
    private fb:     FormBuilder,
    private router: Router,
    private chat:   ChatService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      author: ['', [Validators.required, Validators.maxLength(100)]],
      room:   ['', [Validators.required, Validators.maxLength(100)]],
    });
    this.loadRooms();
  }

  loadRooms(): void {
    this.chat.getRooms().subscribe({
      next: res => this.rooms.set(res.rooms),
      error: ()  => {},
    });
  }

  selectRoom(name: string): void {
    this.form.patchValue({ room: name });
  }

  onJoin(): void {
    if (this.form.invalid) return;
    const { author, room } = this.form.value;
    this.router.navigate(['/chat', room.trim()], {
      queryParams: { author: author.trim() },
    });
  }
}
