import {
  ApiService,
  DefaultValueAccessor,
  FormBuilder,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  SharedModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-M46NA7XZ.js";
import {
  ActivatedRoute,
  Component,
  DatePipe,
  Injectable,
  NgModule,
  Router,
  RouterModule,
  Subject,
  Subscription,
  ViewChild,
  __spreadProps,
  __spreadValues,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpropertyInterpolate1,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-VXZGM27X.js";

// src/app/modules/chat/services/chat.service.ts
var ChatService = class _ChatService {
  constructor(api) {
    this.api = api;
  }
  getRooms() {
    return this.api.get("/chat/rooms");
  }
  getHistory(room, limit = 50) {
    return this.api.get(`/chat/${room}/messages`, { limit });
  }
  static {
    this.\u0275fac = function ChatService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ChatService)(\u0275\u0275inject(ApiService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ChatService, factory: _ChatService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChatService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: ApiService }], null);
})();

// src/app/modules/chat/components/chat-join/chat-join.component.ts
var _forTrack0 = ($index, $item) => $item.name;
function ChatJoinComponent_Conditional_19_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 13);
    \u0275\u0275listener("click", function ChatJoinComponent_Conditional_19_For_5_Template_li_click_0_listener() {
      const r_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.selectRoom(r_r2.name));
    });
    \u0275\u0275elementStart(1, "span", 14);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 15);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_11_0;
    const r_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("selected", ((tmp_11_0 = ctx_r2.form.get("room")) == null ? null : tmp_11_0.value) === r_r2.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("# ", r_r2.name, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", r_r2.connected_users, " online");
  }
}
function ChatJoinComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "h3");
    \u0275\u0275text(2, "Active rooms");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ul");
    \u0275\u0275repeaterCreate(4, ChatJoinComponent_Conditional_19_For_5_Template, 5, 4, "li", 12, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.rooms());
  }
}
var ChatJoinComponent = class _ChatJoinComponent {
  constructor(fb, router, chat) {
    this.fb = fb;
    this.router = router;
    this.chat = chat;
    this.rooms = signal([]);
    this.loading = signal(false);
  }
  ngOnInit() {
    this.form = this.fb.group({
      author: ["", [Validators.required, Validators.maxLength(100)]],
      room: ["", [Validators.required, Validators.maxLength(100)]]
    });
    this.loadRooms();
  }
  loadRooms() {
    this.chat.getRooms().subscribe({
      next: (res) => this.rooms.set(res.rooms),
      error: () => {
      }
    });
  }
  selectRoom(name) {
    this.form.patchValue({ room: name });
  }
  onJoin() {
    if (this.form.invalid)
      return;
    const { author, room } = this.form.value;
    this.router.navigate(["/chat", room.trim()], {
      queryParams: { author: author.trim() }
    });
  }
  static {
    this.\u0275fac = function ChatJoinComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ChatJoinComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ChatService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChatJoinComponent, selectors: [["app-chat-join"]], standalone: false, decls: 20, vars: 3, consts: [[1, "join-page"], [1, "join-card"], [1, "join-icon"], [1, "subtitle"], [3, "ngSubmit", "formGroup"], [1, "field"], ["for", "author"], ["id", "author", "type", "text", "formControlName", "author", "placeholder", "e.g. Alice", "autocomplete", "off"], ["for", "room"], ["id", "room", "type", "text", "formControlName", "room", "placeholder", "e.g. general", "autocomplete", "off"], ["type", "submit", 1, "btn", "btn-primary", "btn-join", 3, "disabled"], [1, "active-rooms"], [3, "selected"], [3, "click"], [1, "room-name"], [1, "room-users"]], template: function ChatJoinComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275text(3, "\u{1F4AC}");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "h1");
        \u0275\u0275text(5, "Chat Rooms");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "p", 3);
        \u0275\u0275text(7, "Pick a username and enter a room to start chatting.");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "form", 4);
        \u0275\u0275listener("ngSubmit", function ChatJoinComponent_Template_form_ngSubmit_8_listener() {
          return ctx.onJoin();
        });
        \u0275\u0275elementStart(9, "div", 5)(10, "label", 6);
        \u0275\u0275text(11, "Your name");
        \u0275\u0275elementEnd();
        \u0275\u0275element(12, "input", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "div", 5)(14, "label", 8);
        \u0275\u0275text(15, "Room name");
        \u0275\u0275elementEnd();
        \u0275\u0275element(16, "input", 9);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "button", 10);
        \u0275\u0275text(18, " Join Room \u2192 ");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(19, ChatJoinComponent_Conditional_19_Template, 6, 0, "div", 11);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(8);
        \u0275\u0275property("formGroup", ctx.form);
        \u0275\u0275advance(9);
        \u0275\u0275property("disabled", ctx.form.invalid);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx.rooms().length > 0 ? 19 : -1);
      }
    }, dependencies: [\u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], styles: ["\n\n.join-page[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: calc(100vh - 52px);\n  padding: 2rem 1rem;\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n}\n.join-card[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 1rem;\n  padding: 2.5rem 2rem;\n  width: 100%;\n  max-width: 440px;\n  color: #f1f5f9;\n}\n.join-icon[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  text-align: center;\n  margin-bottom: 0.5rem;\n}\nh1[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 1.6rem;\n  font-weight: 700;\n  margin: 0 0 0.4rem;\n}\n.subtitle[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #94a3b8;\n  font-size: 0.875rem;\n  margin: 0 0 1.75rem;\n}\n.field[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.4rem;\n  margin-bottom: 1rem;\n}\n.field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  font-weight: 600;\n  color: #94a3b8;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n.field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  background: #0f172a;\n  border: 1px solid #334155;\n  border-radius: 0.5rem;\n  padding: 0.6rem 0.875rem;\n  color: #f1f5f9;\n  font-size: 0.9rem;\n  outline: none;\n  transition: border-color 0.15s;\n}\n.field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder {\n  color: #475569;\n}\n.field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  border-color: #3b82f6;\n}\n.btn-join[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: 0.5rem;\n  padding: 0.7rem;\n  font-size: 1rem;\n}\n.active-rooms[_ngcontent-%COMP%] {\n  margin-top: 1.75rem;\n  border-top: 1px solid #334155;\n  padding-top: 1.25rem;\n}\n.active-rooms[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: #64748b;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  margin: 0 0 0.75rem;\n}\n.active-rooms[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.35rem;\n}\n.active-rooms[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0.55rem 0.75rem;\n  border-radius: 0.5rem;\n  cursor: pointer;\n  transition: background 0.12s;\n}\n.active-rooms[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover {\n  background: #0f172a;\n}\n.active-rooms[_ngcontent-%COMP%]   li.selected[_ngcontent-%COMP%] {\n  background: #1d4ed8;\n}\n.active-rooms[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .room-name[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 500;\n}\n.active-rooms[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .room-users[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: #64748b;\n}\n.active-rooms[_ngcontent-%COMP%]   li.selected[_ngcontent-%COMP%]   .room-users[_ngcontent-%COMP%] {\n  color: #bfdbfe;\n}\n/*# sourceMappingURL=chat-join.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChatJoinComponent, [{
    type: Component,
    args: [{ standalone: false, selector: "app-chat-join", template: `<div class="join-page">
  <div class="join-card">
    <div class="join-icon">\u{1F4AC}</div>
    <h1>Chat Rooms</h1>
    <p class="subtitle">Pick a username and enter a room to start chatting.</p>

    <form [formGroup]="form" (ngSubmit)="onJoin()">
      <div class="field">
        <label for="author">Your name</label>
        <input
          id="author"
          type="text"
          formControlName="author"
          placeholder="e.g. Alice"
          autocomplete="off"
        />
      </div>

      <div class="field">
        <label for="room">Room name</label>
        <input
          id="room"
          type="text"
          formControlName="room"
          placeholder="e.g. general"
          autocomplete="off"
        />
      </div>

      <button type="submit" class="btn btn-primary btn-join" [disabled]="form.invalid">
        Join Room \u2192
      </button>
    </form>

    @if (rooms().length > 0) {
      <div class="active-rooms">
        <h3>Active rooms</h3>
        <ul>
          @for (r of rooms(); track r.name) {
            <li (click)="selectRoom(r.name)" [class.selected]="form.get('room')?.value === r.name">
              <span class="room-name"># {{ r.name }}</span>
              <span class="room-users">{{ r.connected_users }} online</span>
            </li>
          }
        </ul>
      </div>
    }
  </div>
</div>
`, styles: ["/* src/app/modules/chat/components/chat-join/chat-join.component.scss */\n.join-page {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: calc(100vh - 52px);\n  padding: 2rem 1rem;\n  background:\n    linear-gradient(\n      135deg,\n      #1e293b 0%,\n      #0f172a 100%);\n}\n.join-card {\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 1rem;\n  padding: 2.5rem 2rem;\n  width: 100%;\n  max-width: 440px;\n  color: #f1f5f9;\n}\n.join-icon {\n  font-size: 2.5rem;\n  text-align: center;\n  margin-bottom: 0.5rem;\n}\nh1 {\n  text-align: center;\n  font-size: 1.6rem;\n  font-weight: 700;\n  margin: 0 0 0.4rem;\n}\n.subtitle {\n  text-align: center;\n  color: #94a3b8;\n  font-size: 0.875rem;\n  margin: 0 0 1.75rem;\n}\n.field {\n  display: flex;\n  flex-direction: column;\n  gap: 0.4rem;\n  margin-bottom: 1rem;\n}\n.field label {\n  font-size: 0.8rem;\n  font-weight: 600;\n  color: #94a3b8;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n.field input {\n  background: #0f172a;\n  border: 1px solid #334155;\n  border-radius: 0.5rem;\n  padding: 0.6rem 0.875rem;\n  color: #f1f5f9;\n  font-size: 0.9rem;\n  outline: none;\n  transition: border-color 0.15s;\n}\n.field input::placeholder {\n  color: #475569;\n}\n.field input:focus {\n  border-color: #3b82f6;\n}\n.btn-join {\n  width: 100%;\n  margin-top: 0.5rem;\n  padding: 0.7rem;\n  font-size: 1rem;\n}\n.active-rooms {\n  margin-top: 1.75rem;\n  border-top: 1px solid #334155;\n  padding-top: 1.25rem;\n}\n.active-rooms h3 {\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: #64748b;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  margin: 0 0 0.75rem;\n}\n.active-rooms ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.35rem;\n}\n.active-rooms li {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0.55rem 0.75rem;\n  border-radius: 0.5rem;\n  cursor: pointer;\n  transition: background 0.12s;\n}\n.active-rooms li:hover {\n  background: #0f172a;\n}\n.active-rooms li.selected {\n  background: #1d4ed8;\n}\n.active-rooms li .room-name {\n  font-size: 0.9rem;\n  font-weight: 500;\n}\n.active-rooms li .room-users {\n  font-size: 0.75rem;\n  color: #64748b;\n}\n.active-rooms li.selected .room-users {\n  color: #bfdbfe;\n}\n/*# sourceMappingURL=chat-join.component.css.map */\n"] }]
  }], () => [{ type: FormBuilder }, { type: Router }, { type: ChatService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChatJoinComponent, { className: "ChatJoinComponent", filePath: "src/app/modules/chat/components/chat-join/chat-join.component.ts", lineNumber: 13 });
})();

// src/app/modules/chat/services/chat-ws.service.ts
var ChatWsService = class _ChatWsService {
  constructor() {
    this.ws = null;
    this.messages$ = new Subject();
    this.status$ = new Subject();
  }
  get wsBase() {
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.__WS_HOST__ ?? "localhost:8000";
    return `${proto}//${host}/api/v1`;
  }
  messages() {
    return this.messages$.asObservable();
  }
  status() {
    return this.status$.asObservable();
  }
  connect(room, author) {
    this.close();
    const url = `${this.wsBase}/chat/${room}/ws?author=${encodeURIComponent(author)}`;
    this.ws = new WebSocket(url);
    this.ws.onopen = () => this.status$.next("connected");
    this.ws.onclose = () => this.status$.next("disconnected");
    this.ws.onerror = () => this.status$.next("error");
    this.ws.onmessage = ({ data }) => {
      try {
        this.messages$.next(JSON.parse(data));
      } catch {
      }
    };
  }
  send(text) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(text);
    }
  }
  close() {
    this.ws?.close();
    this.ws = null;
  }
  ngOnDestroy() {
    this.close();
  }
  static {
    this.\u0275fac = function ChatWsService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ChatWsService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ChatWsService, factory: _ChatWsService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChatWsService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/modules/chat/components/chat-room/chat-room.component.ts
var _c0 = ["messageList"];
function ChatRoomComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 21);
    \u0275\u0275text(1, "Loading history\u2026");
    \u0275\u0275elementEnd();
  }
}
function ChatRoomComponent_For_32_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const msg_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(msg_r2.content);
  }
}
function ChatRoomComponent_For_32_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const msg_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(msg_r2.author[0].toUpperCase());
  }
}
function ChatRoomComponent_For_32_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const msg_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(msg_r2.author);
  }
}
function ChatRoomComponent_For_32_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 31);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const msg_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(2, 1, msg_r2.created_at, "HH:mm"), " ");
  }
}
function ChatRoomComponent_For_32_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const msg_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(msg_r2.author[0].toUpperCase());
  }
}
function ChatRoomComponent_For_32_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 27);
    \u0275\u0275template(1, ChatRoomComponent_For_32_Conditional_1_Conditional_1_Template, 2, 1, "div", 13);
    \u0275\u0275elementStart(2, "div", 28);
    \u0275\u0275template(3, ChatRoomComponent_For_32_Conditional_1_Conditional_3_Template, 2, 1, "span", 29);
    \u0275\u0275elementStart(4, "div", 30);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, ChatRoomComponent_For_32_Conditional_1_Conditional_6_Template, 3, 4, "span", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, ChatRoomComponent_For_32_Conditional_1_Conditional_7_Template, 2, 1, "div", 32);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const msg_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("own", ctx_r2.isOwn(msg_r2));
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.isOwn(msg_r2) ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r2.isOwn(msg_r2) ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(msg_r2.content);
    \u0275\u0275advance();
    \u0275\u0275conditional(msg_r2.created_at ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.isOwn(msg_r2) ? 7 : -1);
  }
}
function ChatRoomComponent_For_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ChatRoomComponent_For_32_Conditional_0_Template, 2, 1, "li", 25)(1, ChatRoomComponent_For_32_Conditional_1_Template, 8, 7, "li", 26);
  }
  if (rf & 2) {
    const msg_r2 = ctx.$implicit;
    \u0275\u0275conditional(msg_r2.type === "system" ? 0 : 1);
  }
}
var ChatRoomComponent = class _ChatRoomComponent {
  constructor(route, router, chat, ws) {
    this.route = route;
    this.router = router;
    this.chat = chat;
    this.ws = ws;
    this.room = "";
    this.author = "";
    this.messages = signal([]);
    this.status = signal("connecting");
    this.onlineUsers = signal(0);
    this.loadingHistory = signal(true);
    this.inputCtrl = new FormControl("", [Validators.required, Validators.maxLength(2e3)]);
    this.subs = new Subscription();
    this.shouldScroll = false;
  }
  ngOnInit() {
    this.room = this.route.snapshot.paramMap.get("room") ?? "";
    this.author = this.route.snapshot.queryParamMap.get("author") ?? "";
    if (!this.room || !this.author) {
      this.router.navigate(["/chat"]);
      return;
    }
    this.loadHistory();
    this.connectWs();
  }
  loadHistory() {
    this.chat.getHistory(this.room).subscribe({
      next: (msgs) => {
        this.messages.set(msgs.map((m) => __spreadProps(__spreadValues({}, m), { type: "message" })));
        this.loadingHistory.set(false);
        this.shouldScroll = true;
      },
      error: () => this.loadingHistory.set(false)
    });
  }
  connectWs() {
    this.ws.connect(this.room, this.author);
    this.subs.add(this.ws.status().subscribe((s) => {
      this.status.set(s === "connected" ? "connected" : s === "error" ? "error" : "disconnected");
    }));
    this.subs.add(this.ws.messages().subscribe((msg) => {
      if (msg.users !== void 0)
        this.onlineUsers.set(msg.users);
      this.messages.update((list) => [...list, msg]);
      this.shouldScroll = true;
    }));
  }
  send() {
    const text = this.inputCtrl.value?.trim();
    if (!text || this.inputCtrl.invalid)
      return;
    this.ws.send(text);
    this.inputCtrl.reset();
  }
  onKeydown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
  isOwn(msg) {
    return msg.author === this.author;
  }
  leaveRoom() {
    this.ws.close();
    this.router.navigate(["/chat"]);
  }
  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }
  scrollToBottom() {
    try {
      const el = this.messageList?.nativeElement;
      if (el)
        el.scrollTop = el.scrollHeight;
    } catch {
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
    this.ws.close();
  }
  static {
    this.\u0275fac = function ChatRoomComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ChatRoomComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ChatService), \u0275\u0275directiveInject(ChatWsService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChatRoomComponent, selectors: [["app-chat-room"]], viewQuery: function ChatRoomComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c0, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.messageList = _t.first);
      }
    }, standalone: false, decls: 37, vars: 14, consts: [["messageList", ""], [1, "room-layout"], [1, "sidebar"], [1, "sidebar-header"], [1, "brand"], [1, "room-info"], [1, "room-name"], [1, "room-meta"], [1, "status-dot"], [1, "status-label"], [1, "online-count"], [1, "user-section"], [1, "user-tag"], [1, "avatar"], [1, "username"], [1, "btn", "btn-leave", 3, "click"], [1, "chat-main"], [1, "chat-header"], [1, "header-room"], [1, "header-meta"], [1, "message-list"], [1, "state-msg"], [1, "chat-input", 3, "ngSubmit"], ["rows", "1", 3, "keydown", "formControl", "placeholder"], ["type", "submit", 1, "btn", "btn-send", 3, "disabled"], [1, "msg-system"], [1, "msg-row", 3, "own"], [1, "msg-row"], [1, "bubble-group"], [1, "bubble-author"], [1, "bubble"], [1, "bubble-time"], [1, "avatar", "own"]], template: function ChatRoomComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "div", 1)(1, "aside", 2)(2, "div", 3)(3, "span", 4);
        \u0275\u0275text(4, "\u{1F4AC} Chat");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(5, "div", 5)(6, "div", 6);
        \u0275\u0275text(7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "div", 7);
        \u0275\u0275element(9, "span", 8);
        \u0275\u0275elementStart(10, "span", 9);
        \u0275\u0275text(11);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "div", 10);
        \u0275\u0275text(13);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(14, "div", 11)(15, "div", 12)(16, "span", 13);
        \u0275\u0275text(17);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "span", 14);
        \u0275\u0275text(19);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(20, "button", 15);
        \u0275\u0275listener("click", function ChatRoomComponent_Template_button_click_20_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.leaveRoom());
        });
        \u0275\u0275text(21, "\u2190 Leave room");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(22, "main", 16)(23, "header", 17)(24, "span", 18);
        \u0275\u0275text(25);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(26, "span", 19);
        \u0275\u0275text(27);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(28, "ul", 20, 0);
        \u0275\u0275template(30, ChatRoomComponent_Conditional_30_Template, 2, 0, "li", 21);
        \u0275\u0275repeaterCreate(31, ChatRoomComponent_For_32_Template, 2, 1, null, null, \u0275\u0275repeaterTrackByIndex);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(33, "form", 22);
        \u0275\u0275listener("ngSubmit", function ChatRoomComponent_Template_form_ngSubmit_33_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.send());
        });
        \u0275\u0275elementStart(34, "textarea", 23);
        \u0275\u0275listener("keydown", function ChatRoomComponent_Template_textarea_keydown_34_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onKeydown($event));
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(35, "button", 24);
        \u0275\u0275text(36, " Send ");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(7);
        \u0275\u0275textInterpolate1("# ", ctx.room, "");
        \u0275\u0275advance(2);
        \u0275\u0275classMap(ctx.status());
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.status());
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1("", ctx.onlineUsers(), " online");
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate(ctx.author[0].toUpperCase());
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.author);
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate1("# ", ctx.room, "");
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1("", ctx.onlineUsers(), " people online");
        \u0275\u0275advance(3);
        \u0275\u0275conditional(ctx.loadingHistory() ? 30 : -1);
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.messages());
        \u0275\u0275advance(3);
        \u0275\u0275propertyInterpolate1("placeholder", "Message #", ctx.room, "  (Enter to send)");
        \u0275\u0275property("formControl", ctx.inputCtrl);
        \u0275\u0275advance();
        \u0275\u0275property("disabled", ctx.inputCtrl.invalid || ctx.status() !== "connected");
      }
    }, dependencies: [\u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormControlDirective, DatePipe], styles: ['@charset "UTF-8";\n\n\n\n.room-layout[_ngcontent-%COMP%] {\n  display: flex;\n  height: calc(100vh - 52px);\n  overflow: hidden;\n  background: #0f172a;\n  color: #f1f5f9;\n}\n.sidebar[_ngcontent-%COMP%] {\n  width: 240px;\n  flex-shrink: 0;\n  display: flex;\n  flex-direction: column;\n  background: #1e293b;\n  border-right: 1px solid #334155;\n  padding: 0;\n}\n.sidebar-header[_ngcontent-%COMP%] {\n  padding: 1rem 1.25rem;\n  border-bottom: 1px solid #334155;\n}\n.sidebar-header[_ngcontent-%COMP%]   .brand[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 1rem;\n  color: #f1f5f9;\n}\n.room-info[_ngcontent-%COMP%] {\n  padding: 1.25rem;\n  border-bottom: 1px solid #334155;\n}\n.room-info[_ngcontent-%COMP%]   .room-name[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 600;\n  margin-bottom: 0.4rem;\n}\n.room-info[_ngcontent-%COMP%]   .room-meta[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  margin-bottom: 0.25rem;\n}\n.room-info[_ngcontent-%COMP%]   .status-dot[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: #64748b;\n}\n.room-info[_ngcontent-%COMP%]   .status-dot.connected[_ngcontent-%COMP%] {\n  background: #22c55e;\n}\n.room-info[_ngcontent-%COMP%]   .status-dot.connecting[_ngcontent-%COMP%] {\n  background: #f59e0b;\n}\n.room-info[_ngcontent-%COMP%]   .status-dot.disconnected[_ngcontent-%COMP%] {\n  background: #ef4444;\n}\n.room-info[_ngcontent-%COMP%]   .status-dot.error[_ngcontent-%COMP%] {\n  background: #ef4444;\n}\n.room-info[_ngcontent-%COMP%]   .status-label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: #94a3b8;\n  text-transform: capitalize;\n}\n.room-info[_ngcontent-%COMP%]   .online-count[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: #64748b;\n}\n.user-section[_ngcontent-%COMP%] {\n  padding: 1rem 1.25rem;\n  flex: 1;\n}\n.user-tag[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.6rem;\n}\n.user-tag[_ngcontent-%COMP%]   .avatar[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: #3b82f6;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.85rem;\n  font-weight: 700;\n  flex-shrink: 0;\n}\n.user-tag[_ngcontent-%COMP%]   .username[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #cbd5e1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.btn-leave[_ngcontent-%COMP%] {\n  margin: 1rem;\n  background: transparent;\n  border-color: #334155;\n  color: #94a3b8;\n  font-size: 0.8rem;\n}\n.btn-leave[_ngcontent-%COMP%]:hover {\n  background: #0f172a;\n  color: #f1f5f9;\n}\n.chat-main[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.chat-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0.875rem 1.5rem;\n  border-bottom: 1px solid #1e293b;\n  background: #0f172a;\n  flex-shrink: 0;\n}\n.chat-header[_ngcontent-%COMP%]   .header-room[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 1rem;\n}\n.chat-header[_ngcontent-%COMP%]   .header-meta[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: #64748b;\n}\n.message-list[_ngcontent-%COMP%] {\n  flex: 1;\n  overflow-y: auto;\n  padding: 1rem 1.5rem;\n  list-style: none;\n  margin: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.6rem;\n  scroll-behavior: smooth;\n}\n.message-list[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 6px;\n}\n.message-list[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n.message-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #334155;\n  border-radius: 3px;\n}\n.state-msg[_ngcontent-%COMP%] {\n  text-align: center;\n  color: #475569;\n  font-size: 0.8rem;\n  padding: 1rem 0;\n}\n.msg-system[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 0.75rem;\n  color: #475569;\n  padding: 0.15rem 0;\n  font-style: italic;\n}\n.msg-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-end;\n  gap: 0.6rem;\n}\n.msg-row.own[_ngcontent-%COMP%] {\n  flex-direction: row-reverse;\n}\n.msg-row.own[_ngcontent-%COMP%]   .bubble[_ngcontent-%COMP%] {\n  background: #1d4ed8;\n  color: #eff6ff;\n  border-radius: 1rem 1rem 0.25rem 1rem;\n}\n.msg-row.own[_ngcontent-%COMP%]   .bubble-group[_ngcontent-%COMP%] {\n  align-items: flex-end;\n}\n.msg-row.own[_ngcontent-%COMP%]   .bubble-time[_ngcontent-%COMP%] {\n  text-align: right;\n}\n.avatar[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: #475569;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.8rem;\n  font-weight: 700;\n  flex-shrink: 0;\n}\n.avatar.own[_ngcontent-%COMP%] {\n  background: #1d4ed8;\n}\n.bubble-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n  max-width: 60%;\n}\n.bubble-author[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n  color: #94a3b8;\n  padding-left: 0.25rem;\n}\n.bubble[_ngcontent-%COMP%] {\n  background: #1e293b;\n  border-radius: 1rem 1rem 1rem 0.25rem;\n  padding: 0.55rem 0.875rem;\n  font-size: 0.9rem;\n  line-height: 1.45;\n  word-break: break-word;\n  white-space: pre-wrap;\n}\n.bubble-time[_ngcontent-%COMP%] {\n  font-size: 0.68rem;\n  color: #475569;\n  padding: 0 0.25rem;\n}\n.chat-input[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n  align-items: flex-end;\n  padding: 1rem 1.5rem;\n  border-top: 1px solid #1e293b;\n  background: #0f172a;\n  flex-shrink: 0;\n}\n.chat-input[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  flex: 1;\n  resize: none;\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 0.75rem;\n  padding: 0.7rem 1rem;\n  color: #f1f5f9;\n  font-size: 0.9rem;\n  font-family: inherit;\n  outline: none;\n  max-height: 120px;\n  overflow-y: auto;\n  line-height: 1.4;\n  transition: border-color 0.15s;\n}\n.chat-input[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]::placeholder {\n  color: #475569;\n}\n.chat-input[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus {\n  border-color: #3b82f6;\n}\n.btn-send[_ngcontent-%COMP%] {\n  background: #3b82f6;\n  border-color: #3b82f6;\n  color: #fff;\n  padding: 0.65rem 1.25rem;\n  border-radius: 0.75rem;\n  flex-shrink: 0;\n}\n.btn-send[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #2563eb;\n}\n.btn-send[_ngcontent-%COMP%]:disabled {\n  opacity: 0.4;\n}\n/*# sourceMappingURL=chat-room.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChatRoomComponent, [{
    type: Component,
    args: [{ standalone: false, selector: "app-chat-room", template: `<div class="room-layout">

  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <span class="brand">\u{1F4AC} Chat</span>
    </div>
    <div class="room-info">
      <div class="room-name"># {{ room }}</div>
      <div class="room-meta">
        <span class="status-dot" [class]="status()"></span>
        <span class="status-label">{{ status() }}</span>
      </div>
      <div class="online-count">{{ onlineUsers() }} online</div>
    </div>
    <div class="user-section">
      <div class="user-tag">
        <span class="avatar">{{ author[0].toUpperCase() }}</span>
        <span class="username">{{ author }}</span>
      </div>
    </div>
    <button class="btn btn-leave" (click)="leaveRoom()">\u2190 Leave room</button>
  </aside>

  <!-- Main -->
  <main class="chat-main">

    <!-- Top bar -->
    <header class="chat-header">
      <span class="header-room"># {{ room }}</span>
      <span class="header-meta">{{ onlineUsers() }} people online</span>
    </header>

    <!-- Messages -->
    <ul class="message-list" #messageList>
      @if (loadingHistory()) {
        <li class="state-msg">Loading history\u2026</li>
      }

      @for (msg of messages(); track $index) {
        @if (msg.type === 'system') {
          <li class="msg-system">{{ msg.content }}</li>
        } @else {
          <li class="msg-row" [class.own]="isOwn(msg)">
            @if (!isOwn(msg)) {
              <div class="avatar">{{ msg.author[0].toUpperCase() }}</div>
            }
            <div class="bubble-group">
              @if (!isOwn(msg)) {
                <span class="bubble-author">{{ msg.author }}</span>
              }
              <div class="bubble">{{ msg.content }}</div>
              @if (msg.created_at) {
                <span class="bubble-time">
                  {{ msg.created_at | date:'HH:mm' }}
                </span>
              }
            </div>
            @if (isOwn(msg)) {
              <div class="avatar own">{{ msg.author[0].toUpperCase() }}</div>
            }
          </li>
        }
      }
    </ul>

    <!-- Input -->
    <form class="chat-input" (ngSubmit)="send()">
      <textarea
        [formControl]="inputCtrl"
        placeholder="Message #{{ room }}  (Enter to send)"
        rows="1"
        (keydown)="onKeydown($event)"
      ></textarea>
      <button type="submit" class="btn btn-send" [disabled]="inputCtrl.invalid || status() !== 'connected'">
        Send
      </button>
    </form>

  </main>
</div>
`, styles: ['@charset "UTF-8";\n\n/* src/app/modules/chat/components/chat-room/chat-room.component.scss */\n.room-layout {\n  display: flex;\n  height: calc(100vh - 52px);\n  overflow: hidden;\n  background: #0f172a;\n  color: #f1f5f9;\n}\n.sidebar {\n  width: 240px;\n  flex-shrink: 0;\n  display: flex;\n  flex-direction: column;\n  background: #1e293b;\n  border-right: 1px solid #334155;\n  padding: 0;\n}\n.sidebar-header {\n  padding: 1rem 1.25rem;\n  border-bottom: 1px solid #334155;\n}\n.sidebar-header .brand {\n  font-weight: 700;\n  font-size: 1rem;\n  color: #f1f5f9;\n}\n.room-info {\n  padding: 1.25rem;\n  border-bottom: 1px solid #334155;\n}\n.room-info .room-name {\n  font-size: 1rem;\n  font-weight: 600;\n  margin-bottom: 0.4rem;\n}\n.room-info .room-meta {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  margin-bottom: 0.25rem;\n}\n.room-info .status-dot {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: #64748b;\n}\n.room-info .status-dot.connected {\n  background: #22c55e;\n}\n.room-info .status-dot.connecting {\n  background: #f59e0b;\n}\n.room-info .status-dot.disconnected {\n  background: #ef4444;\n}\n.room-info .status-dot.error {\n  background: #ef4444;\n}\n.room-info .status-label {\n  font-size: 0.75rem;\n  color: #94a3b8;\n  text-transform: capitalize;\n}\n.room-info .online-count {\n  font-size: 0.75rem;\n  color: #64748b;\n}\n.user-section {\n  padding: 1rem 1.25rem;\n  flex: 1;\n}\n.user-tag {\n  display: flex;\n  align-items: center;\n  gap: 0.6rem;\n}\n.user-tag .avatar {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: #3b82f6;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.85rem;\n  font-weight: 700;\n  flex-shrink: 0;\n}\n.user-tag .username {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #cbd5e1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.btn-leave {\n  margin: 1rem;\n  background: transparent;\n  border-color: #334155;\n  color: #94a3b8;\n  font-size: 0.8rem;\n}\n.btn-leave:hover {\n  background: #0f172a;\n  color: #f1f5f9;\n}\n.chat-main {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.chat-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0.875rem 1.5rem;\n  border-bottom: 1px solid #1e293b;\n  background: #0f172a;\n  flex-shrink: 0;\n}\n.chat-header .header-room {\n  font-weight: 600;\n  font-size: 1rem;\n}\n.chat-header .header-meta {\n  font-size: 0.75rem;\n  color: #64748b;\n}\n.message-list {\n  flex: 1;\n  overflow-y: auto;\n  padding: 1rem 1.5rem;\n  list-style: none;\n  margin: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.6rem;\n  scroll-behavior: smooth;\n}\n.message-list::-webkit-scrollbar {\n  width: 6px;\n}\n.message-list::-webkit-scrollbar-track {\n  background: transparent;\n}\n.message-list::-webkit-scrollbar-thumb {\n  background: #334155;\n  border-radius: 3px;\n}\n.state-msg {\n  text-align: center;\n  color: #475569;\n  font-size: 0.8rem;\n  padding: 1rem 0;\n}\n.msg-system {\n  text-align: center;\n  font-size: 0.75rem;\n  color: #475569;\n  padding: 0.15rem 0;\n  font-style: italic;\n}\n.msg-row {\n  display: flex;\n  align-items: flex-end;\n  gap: 0.6rem;\n}\n.msg-row.own {\n  flex-direction: row-reverse;\n}\n.msg-row.own .bubble {\n  background: #1d4ed8;\n  color: #eff6ff;\n  border-radius: 1rem 1rem 0.25rem 1rem;\n}\n.msg-row.own .bubble-group {\n  align-items: flex-end;\n}\n.msg-row.own .bubble-time {\n  text-align: right;\n}\n.avatar {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: #475569;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.8rem;\n  font-weight: 700;\n  flex-shrink: 0;\n}\n.avatar.own {\n  background: #1d4ed8;\n}\n.bubble-group {\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n  max-width: 60%;\n}\n.bubble-author {\n  font-size: 0.72rem;\n  color: #94a3b8;\n  padding-left: 0.25rem;\n}\n.bubble {\n  background: #1e293b;\n  border-radius: 1rem 1rem 1rem 0.25rem;\n  padding: 0.55rem 0.875rem;\n  font-size: 0.9rem;\n  line-height: 1.45;\n  word-break: break-word;\n  white-space: pre-wrap;\n}\n.bubble-time {\n  font-size: 0.68rem;\n  color: #475569;\n  padding: 0 0.25rem;\n}\n.chat-input {\n  display: flex;\n  gap: 0.75rem;\n  align-items: flex-end;\n  padding: 1rem 1.5rem;\n  border-top: 1px solid #1e293b;\n  background: #0f172a;\n  flex-shrink: 0;\n}\n.chat-input textarea {\n  flex: 1;\n  resize: none;\n  background: #1e293b;\n  border: 1px solid #334155;\n  border-radius: 0.75rem;\n  padding: 0.7rem 1rem;\n  color: #f1f5f9;\n  font-size: 0.9rem;\n  font-family: inherit;\n  outline: none;\n  max-height: 120px;\n  overflow-y: auto;\n  line-height: 1.4;\n  transition: border-color 0.15s;\n}\n.chat-input textarea::placeholder {\n  color: #475569;\n}\n.chat-input textarea:focus {\n  border-color: #3b82f6;\n}\n.btn-send {\n  background: #3b82f6;\n  border-color: #3b82f6;\n  color: #fff;\n  padding: 0.65rem 1.25rem;\n  border-radius: 0.75rem;\n  flex-shrink: 0;\n}\n.btn-send:hover:not(:disabled) {\n  background: #2563eb;\n}\n.btn-send:disabled {\n  opacity: 0.4;\n}\n/*# sourceMappingURL=chat-room.component.css.map */\n'] }]
  }], () => [{ type: ActivatedRoute }, { type: Router }, { type: ChatService }, { type: ChatWsService }], { messageList: [{
    type: ViewChild,
    args: ["messageList"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChatRoomComponent, { className: "ChatRoomComponent", filePath: "src/app/modules/chat/components/chat-room/chat-room.component.ts", lineNumber: 18 });
})();

// src/app/modules/chat/chat-routing.module.ts
var routes = [
  { path: "", component: ChatJoinComponent },
  { path: ":room", component: ChatRoomComponent }
];
var ChatRoutingModule = class _ChatRoutingModule {
  static {
    this.\u0275fac = function ChatRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ChatRoutingModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _ChatRoutingModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forChild(routes), RouterModule] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChatRoutingModule, [{
    type: NgModule,
    args: [{
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
    }]
  }], null, null);
})();

// src/app/modules/chat/chat.module.ts
var ChatModule = class _ChatModule {
  static {
    this.\u0275fac = function ChatModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ChatModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _ChatModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [SharedModule, ChatRoutingModule] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChatModule, [{
    type: NgModule,
    args: [{
      declarations: [ChatJoinComponent, ChatRoomComponent],
      imports: [SharedModule, ChatRoutingModule]
    }]
  }], null, null);
})();
export {
  ChatModule
};
//# sourceMappingURL=chunk-NQ4V7SL2.js.map
