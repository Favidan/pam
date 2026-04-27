import {
  BrowserModule,
  Component,
  HTTP_INTERCEPTORS,
  HttpClientModule,
  Injectable,
  NgModule,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
  catchError,
  platformBrowser,
  setClassMetadata,
  throwError,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-VXZGM27X.js";

// src/app/app-routing.module.ts
var routes = [
  { path: "", redirectTo: "todos", pathMatch: "full" },
  {
    path: "todos",
    loadChildren: () => import("./chunk-4H4UQQ77.js").then((m) => m.TodosModule)
  },
  {
    path: "chat",
    loadChildren: () => import("./chunk-NQ4V7SL2.js").then((m) => m.ChatModule)
  },
  {
    path: "risks-issues",
    loadChildren: () => import("./chunk-7H55CN4G.js").then((m) => m.RisksIssuesModule)
  },
  { path: "**", redirectTo: "todos" }
];
var AppRoutingModule = class _AppRoutingModule {
  static {
    this.\u0275fac = function AppRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AppRoutingModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AppRoutingModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forRoot(routes), RouterModule] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppRoutingModule, [{
    type: NgModule,
    args: [{
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule]
    }]
  }], null, null);
})();

// src/app/app.component.ts
var AppComponent = class _AppComponent {
  static {
    this.\u0275fac = function AppComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AppComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], standalone: false, decls: 11, vars: 0, consts: [[1, "navbar"], [1, "brand"], ["routerLink", "/todos", "routerLinkActive", "active"], ["routerLink", "/chat", "routerLinkActive", "active"], ["routerLink", "/risks-issues", "routerLinkActive", "active"], [1, "main-content"]], template: function AppComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "nav", 0)(1, "span", 1);
        \u0275\u0275text(2, "TodoApp");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "a", 2);
        \u0275\u0275text(4, "Todos");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "a", 3);
        \u0275\u0275text(6, "Chat");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "a", 4);
        \u0275\u0275text(8, "Risks & Issues");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(9, "main", 5);
        \u0275\u0275element(10, "router-outlet");
        \u0275\u0275elementEnd();
      }
    }, dependencies: [RouterOutlet, RouterLink, RouterLinkActive], styles: ["\n\n.navbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1.5rem;\n  padding: 0.875rem 2rem;\n  background: #1e293b;\n  color: #f1f5f9;\n}\n.navbar[_ngcontent-%COMP%]   .brand[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 1.1rem;\n  margin-right: auto;\n}\n.navbar[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #94a3b8;\n  text-decoration: none;\n  font-size: 0.9rem;\n  transition: color 0.15s;\n}\n.navbar[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, \n.navbar[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%] {\n  color: #f1f5f9;\n}\n.main-content[_ngcontent-%COMP%] {\n  min-height: calc(100vh - 52px);\n  background: #f8fafc;\n}\n/*# sourceMappingURL=app.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppComponent, [{
    type: Component,
    args: [{ standalone: false, selector: "app-root", template: '<nav class="navbar">\n  <span class="brand">TodoApp</span>\n  <a routerLink="/todos" routerLinkActive="active">Todos</a>\n  <a routerLink="/chat"  routerLinkActive="active">Chat</a>\n  <a routerLink="/risks-issues" routerLinkActive="active">Risks &amp; Issues</a>\n</nav>\n<main class="main-content">\n  <router-outlet></router-outlet>\n</main>\n', styles: ["/* src/app/app.component.scss */\n.navbar {\n  display: flex;\n  align-items: center;\n  gap: 1.5rem;\n  padding: 0.875rem 2rem;\n  background: #1e293b;\n  color: #f1f5f9;\n}\n.navbar .brand {\n  font-weight: 700;\n  font-size: 1.1rem;\n  margin-right: auto;\n}\n.navbar a {\n  color: #94a3b8;\n  text-decoration: none;\n  font-size: 0.9rem;\n  transition: color 0.15s;\n}\n.navbar a:hover,\n.navbar a.active {\n  color: #f1f5f9;\n}\n.main-content {\n  min-height: calc(100vh - 52px);\n  background: #f8fafc;\n}\n/*# sourceMappingURL=app.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 9 });
})();

// src/app/core/interceptors/http-error.interceptor.ts
var HttpErrorInterceptor = class _HttpErrorInterceptor {
  intercept(req, next) {
    return next.handle(req).pipe(catchError((error) => {
      const message = error.error?.detail ?? error.message ?? "An unexpected error occurred";
      console.error(`[HTTP Error] ${error.status}: ${message}`);
      return throwError(() => new Error(message));
    }));
  }
  static {
    this.\u0275fac = function HttpErrorInterceptor_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _HttpErrorInterceptor)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HttpErrorInterceptor, factory: _HttpErrorInterceptor.\u0275fac });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HttpErrorInterceptor, [{
    type: Injectable
  }], null, null);
})();

// src/app/app.module.ts
var AppModule = class _AppModule {
  static {
    this.\u0275fac = function AppModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AppModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AppModule, bootstrap: [AppComponent] });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ providers: [
      { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
    ], imports: [BrowserModule, HttpClientModule, AppRoutingModule] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppModule, [{
    type: NgModule,
    args: [{
      declarations: [AppComponent],
      imports: [BrowserModule, HttpClientModule, AppRoutingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
      ],
      bootstrap: [AppComponent]
    }]
  }], null, null);
})();

// src/main.ts
platformBrowser().bootstrapModule(AppModule).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
