import {
  ApiService,
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  SharedModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-M46NA7XZ.js";
import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  NgModule,
  Output,
  RouterModule,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
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
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-VXZGM27X.js";

// src/app/modules/todos/services/todo.service.ts
var TodoService = class _TodoService {
  constructor(api) {
    this.api = api;
    this.path = "/todos";
  }
  getAll(filter = {}) {
    const params = {};
    if (filter.page !== void 0)
      params["page"] = filter.page;
    if (filter.size !== void 0)
      params["size"] = filter.size;
    if (filter.completed !== void 0)
      params["completed"] = filter.completed;
    return this.api.get(this.path, params);
  }
  getById(id) {
    return this.api.get(`${this.path}/${id}`);
  }
  create(payload) {
    return this.api.post(this.path, payload);
  }
  update(id, payload) {
    return this.api.patch(`${this.path}/${id}`, payload);
  }
  delete(id) {
    return this.api.delete(`${this.path}/${id}`);
  }
  toggleComplete(todo) {
    return this.update(todo.id, { completed: !todo.completed });
  }
  static {
    this.\u0275fac = function TodoService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TodoService)(\u0275\u0275inject(ApiService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TodoService, factory: _TodoService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TodoService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: ApiService }], null);
})();

// src/app/modules/todos/components/todo-form/todo-form.component.ts
function TodoFormComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error);
  }
}
function TodoFormComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 7);
    \u0275\u0275text(1, "Title is required");
    \u0275\u0275elementEnd();
  }
}
function TodoFormComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "input", 14);
    \u0275\u0275elementStart(2, "label", 15);
    \u0275\u0275text(3, "Mark as completed");
    \u0275\u0275elementEnd()();
  }
}
var TodoFormComponent = class _TodoFormComponent {
  constructor(fb, todoService) {
    this.fb = fb;
    this.todoService = todoService;
    this.todo = null;
    this.saved = new EventEmitter();
    this.cancelled = new EventEmitter();
    this.submitting = false;
    this.error = null;
  }
  ngOnInit() {
    this.form = this.fb.group({
      title: [this.todo?.title ?? "", [Validators.required, Validators.maxLength(255)]],
      description: [this.todo?.description ?? ""],
      completed: [this.todo?.completed ?? false]
    });
  }
  get isEdit() {
    return this.todo !== null;
  }
  onSubmit() {
    if (this.form.invalid)
      return;
    this.submitting = true;
    this.error = null;
    const payload = this.form.value;
    const request$ = this.isEdit ? this.todoService.update(this.todo.id, payload) : this.todoService.create(payload);
    request$.subscribe({
      next: () => {
        this.submitting = false;
        this.saved.emit();
      },
      error: (err) => {
        this.error = err.message;
        this.submitting = false;
      }
    });
  }
  static {
    this.\u0275fac = function TodoFormComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TodoFormComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(TodoService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TodoFormComponent, selectors: [["app-todo-form"]], inputs: { todo: "todo" }, outputs: { saved: "saved", cancelled: "cancelled" }, standalone: false, decls: 22, vars: 9, consts: [[1, "form-card"], [1, "form-error"], [3, "ngSubmit", "formGroup"], [1, "field"], ["for", "title"], [1, "required"], ["id", "title", "type", "text", "formControlName", "title", "placeholder", "What needs to be done?"], [1, "field-error"], ["for", "description"], ["id", "description", "formControlName", "description", "placeholder", "Optional details...", "rows", "3"], [1, "field", "field-inline"], [1, "form-actions"], ["type", "button", 1, "btn", 3, "click"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["id", "completed", "type", "checkbox", "formControlName", "completed"], ["for", "completed"]], template: function TodoFormComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "h2");
        \u0275\u0275text(2);
        \u0275\u0275elementEnd();
        \u0275\u0275template(3, TodoFormComponent_Conditional_3_Template, 2, 1, "div", 1);
        \u0275\u0275elementStart(4, "form", 2);
        \u0275\u0275listener("ngSubmit", function TodoFormComponent_Template_form_ngSubmit_4_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275elementStart(5, "div", 3)(6, "label", 4);
        \u0275\u0275text(7, "Title ");
        \u0275\u0275elementStart(8, "span", 5);
        \u0275\u0275text(9, "*");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(10, "input", 6);
        \u0275\u0275template(11, TodoFormComponent_Conditional_11_Template, 2, 0, "span", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "div", 3)(13, "label", 8);
        \u0275\u0275text(14, "Description");
        \u0275\u0275elementEnd();
        \u0275\u0275element(15, "textarea", 9);
        \u0275\u0275elementEnd();
        \u0275\u0275template(16, TodoFormComponent_Conditional_16_Template, 4, 0, "div", 10);
        \u0275\u0275elementStart(17, "div", 11)(18, "button", 12);
        \u0275\u0275listener("click", function TodoFormComponent_Template_button_click_18_listener() {
          return ctx.cancelled.emit();
        });
        \u0275\u0275text(19, "Cancel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "button", 13);
        \u0275\u0275text(21);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        let tmp_3_0;
        let tmp_4_0;
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.isEdit ? "Edit Todo" : "New Todo");
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.error ? 3 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("formGroup", ctx.form);
        \u0275\u0275advance(6);
        \u0275\u0275classProp("invalid", ((tmp_3_0 = ctx.form.get("title")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx.form.get("title")) == null ? null : tmp_3_0.touched));
        \u0275\u0275advance();
        \u0275\u0275conditional(((tmp_4_0 = ctx.form.get("title")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["required"]) && ((tmp_4_0 = ctx.form.get("title")) == null ? null : tmp_4_0.touched) ? 11 : -1);
        \u0275\u0275advance(5);
        \u0275\u0275conditional(ctx.isEdit ? 16 : -1);
        \u0275\u0275advance(4);
        \u0275\u0275property("disabled", ctx.form.invalid || ctx.submitting);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.submitting ? "Saving..." : ctx.isEdit ? "Update" : "Create", " ");
      }
    }, dependencies: [\u0275NgNoValidate, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], styles: ["\n\n.form-card[_ngcontent-%COMP%] {\n  background: #f9fafb;\n  border: 1px solid #e5e7eb;\n  border-radius: 0.75rem;\n  padding: 1.5rem;\n  margin-bottom: 1.5rem;\n}\n.form-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 1.25rem;\n  font-size: 1.1rem;\n  font-weight: 600;\n}\n.form-error[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #dc2626;\n  padding: 0.6rem 0.875rem;\n  border-radius: 0.375rem;\n  margin-bottom: 1rem;\n  font-size: 0.875rem;\n}\n.field[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.3rem;\n  margin-bottom: 1rem;\n}\n.field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #374151;\n}\n.field[_ngcontent-%COMP%]   input[type=text][_ngcontent-%COMP%], \n.field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  border: 1px solid #d1d5db;\n  border-radius: 0.375rem;\n  padding: 0.5rem 0.75rem;\n  font-size: 0.9rem;\n  outline: none;\n  transition: border-color 0.15s;\n}\n.field[_ngcontent-%COMP%]   input[type=text][_ngcontent-%COMP%]:focus, \n.field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);\n}\n.field[_ngcontent-%COMP%]   input[type=text].invalid[_ngcontent-%COMP%], \n.field[_ngcontent-%COMP%]   textarea.invalid[_ngcontent-%COMP%] {\n  border-color: #ef4444;\n}\n.field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.field-inline[_ngcontent-%COMP%] {\n  flex-direction: row;\n  align-items: center;\n  gap: 0.5rem;\n}\n.field-inline[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%] {\n  width: 1rem;\n  height: 1rem;\n  cursor: pointer;\n}\n.field-error[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: #ef4444;\n}\n.required[_ngcontent-%COMP%] {\n  color: #ef4444;\n}\n.form-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  margin-top: 1.25rem;\n}\n/*# sourceMappingURL=todo-form.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TodoFormComponent, [{
    type: Component,
    args: [{ standalone: false, selector: "app-todo-form", template: `<div class="form-card">
  <h2>{{ isEdit ? 'Edit Todo' : 'New Todo' }}</h2>

  @if (error) {
    <div class="form-error">{{ error }}</div>
  }

  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <div class="field">
      <label for="title">Title <span class="required">*</span></label>
      <input
        id="title"
        type="text"
        formControlName="title"
        placeholder="What needs to be done?"
        [class.invalid]="form.get('title')?.invalid && form.get('title')?.touched"
      />
      @if (form.get('title')?.errors?.['required'] && form.get('title')?.touched) {
        <span class="field-error">Title is required</span>
      }
    </div>

    <div class="field">
      <label for="description">Description</label>
      <textarea
        id="description"
        formControlName="description"
        placeholder="Optional details..."
        rows="3"
      ></textarea>
    </div>

    @if (isEdit) {
      <div class="field field-inline">
        <input id="completed" type="checkbox" formControlName="completed" />
        <label for="completed">Mark as completed</label>
      </div>
    }

    <div class="form-actions">
      <button type="button" class="btn" (click)="cancelled.emit()">Cancel</button>
      <button type="submit" class="btn btn-primary" [disabled]="form.invalid || submitting">
        {{ submitting ? 'Saving...' : isEdit ? 'Update' : 'Create' }}
      </button>
    </div>
  </form>
</div>
`, styles: ["/* src/app/modules/todos/components/todo-form/todo-form.component.scss */\n.form-card {\n  background: #f9fafb;\n  border: 1px solid #e5e7eb;\n  border-radius: 0.75rem;\n  padding: 1.5rem;\n  margin-bottom: 1.5rem;\n}\n.form-card h2 {\n  margin: 0 0 1.25rem;\n  font-size: 1.1rem;\n  font-weight: 600;\n}\n.form-error {\n  background: #fee2e2;\n  color: #dc2626;\n  padding: 0.6rem 0.875rem;\n  border-radius: 0.375rem;\n  margin-bottom: 1rem;\n  font-size: 0.875rem;\n}\n.field {\n  display: flex;\n  flex-direction: column;\n  gap: 0.3rem;\n  margin-bottom: 1rem;\n}\n.field label {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #374151;\n}\n.field input[type=text],\n.field textarea {\n  border: 1px solid #d1d5db;\n  border-radius: 0.375rem;\n  padding: 0.5rem 0.75rem;\n  font-size: 0.9rem;\n  outline: none;\n  transition: border-color 0.15s;\n}\n.field input[type=text]:focus,\n.field textarea:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);\n}\n.field input[type=text].invalid,\n.field textarea.invalid {\n  border-color: #ef4444;\n}\n.field textarea {\n  resize: vertical;\n}\n.field-inline {\n  flex-direction: row;\n  align-items: center;\n  gap: 0.5rem;\n}\n.field-inline input[type=checkbox] {\n  width: 1rem;\n  height: 1rem;\n  cursor: pointer;\n}\n.field-error {\n  font-size: 0.75rem;\n  color: #ef4444;\n}\n.required {\n  color: #ef4444;\n}\n.form-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n  margin-top: 1.25rem;\n}\n/*# sourceMappingURL=todo-form.component.css.map */\n"] }]
  }], () => [{ type: FormBuilder }, { type: TodoService }], { todo: [{
    type: Input
  }], saved: [{
    type: Output
  }], cancelled: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TodoFormComponent, { className: "TodoFormComponent", filePath: "src/app/modules/todos/components/todo-form/todo-form.component.ts", lineNumber: 12 });
})();

// src/app/modules/todos/components/todo-list/todo-list.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function TodoListComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-todo-form", 9);
    \u0275\u0275listener("saved", function TodoListComponent_Conditional_13_Template_app_todo_form_saved_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSaved());
    })("cancelled", function TodoListComponent_Conditional_13_Template_app_todo_form_cancelled_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onCancel());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("todo", ctx_r1.editingTodo());
  }
}
function TodoListComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275text(1, "Loading...");
    \u0275\u0275elementEnd();
  }
}
function TodoListComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function TodoListComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1, "No todos yet. Create one!");
    \u0275\u0275elementEnd();
  }
}
function TodoListComponent_Conditional_17_For_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const todo_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(todo_r5.description);
  }
}
function TodoListComponent_Conditional_17_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 14)(1, "input", 15);
    \u0275\u0275listener("change", function TodoListComponent_Conditional_17_For_2_Template_input_change_1_listener() {
      const todo_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onToggle(todo_r5));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 16)(3, "span", 17);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, TodoListComponent_Conditional_17_For_2_Conditional_5_Template, 2, 1, "span", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 19)(7, "button", 20);
    \u0275\u0275listener("click", function TodoListComponent_Conditional_17_For_2_Template_button_click_7_listener() {
      const todo_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onEdit(todo_r5));
    });
    \u0275\u0275text(8, "Edit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 21);
    \u0275\u0275listener("click", function TodoListComponent_Conditional_17_For_2_Template_button_click_9_listener() {
      const todo_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onDelete(todo_r5.id));
    });
    \u0275\u0275text(10, "Delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const todo_r5 = ctx.$implicit;
    \u0275\u0275classProp("completed", todo_r5.completed);
    \u0275\u0275advance();
    \u0275\u0275property("checked", todo_r5.completed);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(todo_r5.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(todo_r5.description ? 5 : -1);
  }
}
function TodoListComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ul", 10);
    \u0275\u0275repeaterCreate(1, TodoListComponent_Conditional_17_For_2_Template, 11, 5, "li", 11, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 12)(4, "button", 13);
    \u0275\u0275listener("click", function TodoListComponent_Conditional_17_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.prevPage());
    });
    \u0275\u0275text(5, "Prev");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 13);
    \u0275\u0275listener("click", function TodoListComponent_Conditional_17_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nextPage());
    });
    \u0275\u0275text(9, "Next");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.todos());
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.page() === 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("Page ", ctx_r1.page(), " \u2014 ", ctx_r1.total(), " total");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.page() * ctx_r1.size() >= ctx_r1.total());
  }
}
var TodoListComponent = class _TodoListComponent {
  constructor(todoService) {
    this.todoService = todoService;
    this.todos = signal([]);
    this.total = signal(0);
    this.page = signal(1);
    this.size = signal(20);
    this.filterCompleted = signal(void 0);
    this.loading = signal(false);
    this.error = signal(null);
    this.showForm = signal(false);
    this.editingTodo = signal(null);
  }
  ngOnInit() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.todoService.getAll({ page: this.page(), size: this.size(), completed: this.filterCompleted() }).subscribe({
      next: (res) => {
        this.todos.set(res.items);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
  onToggle(todo) {
    this.todoService.toggleComplete(todo).subscribe(() => this.load());
  }
  onDelete(id) {
    if (!confirm("Delete this todo?"))
      return;
    this.todoService.delete(id).subscribe(() => this.load());
  }
  onEdit(todo) {
    this.editingTodo.set(todo);
    this.showForm.set(true);
  }
  onNew() {
    this.editingTodo.set(null);
    this.showForm.set(true);
  }
  onSaved() {
    this.showForm.set(false);
    this.editingTodo.set(null);
    this.load();
  }
  onCancel() {
    this.showForm.set(false);
    this.editingTodo.set(null);
  }
  setFilter(completed) {
    this.filterCompleted.set(completed);
    this.page.set(1);
    this.load();
  }
  nextPage() {
    if (this.page() * this.size() < this.total()) {
      this.page.update((p) => p + 1);
      this.load();
    }
  }
  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.load();
    }
  }
  static {
    this.\u0275fac = function TodoListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TodoListComponent)(\u0275\u0275directiveInject(TodoService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TodoListComponent, selectors: [["app-todo-list"]], standalone: false, decls: 18, vars: 8, consts: [[1, "todo-page"], [1, "todo-header"], [1, "btn", "btn-primary", 3, "click"], [1, "filters"], [1, "btn", 3, "click"], [3, "todo"], [1, "loading"], [1, "error"], [1, "empty"], [3, "saved", "cancelled", "todo"], [1, "todo-list"], [1, "todo-item", 3, "completed"], [1, "pagination"], [1, "btn", "btn-sm", 3, "click", "disabled"], [1, "todo-item"], ["type", "checkbox", 3, "change", "checked"], [1, "todo-content"], [1, "todo-title"], [1, "todo-description"], [1, "todo-actions"], [1, "btn", "btn-sm", 3, "click"], [1, "btn", "btn-sm", "btn-danger", 3, "click"]], template: function TodoListComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1");
        \u0275\u0275text(3, "Todo List");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "button", 2);
        \u0275\u0275listener("click", function TodoListComponent_Template_button_click_4_listener() {
          return ctx.onNew();
        });
        \u0275\u0275text(5, "+ New Todo");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(6, "div", 3)(7, "button", 4);
        \u0275\u0275listener("click", function TodoListComponent_Template_button_click_7_listener() {
          return ctx.setFilter(void 0);
        });
        \u0275\u0275text(8, "All");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "button", 4);
        \u0275\u0275listener("click", function TodoListComponent_Template_button_click_9_listener() {
          return ctx.setFilter(false);
        });
        \u0275\u0275text(10, "Active");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "button", 4);
        \u0275\u0275listener("click", function TodoListComponent_Template_button_click_11_listener() {
          return ctx.setFilter(true);
        });
        \u0275\u0275text(12, "Completed");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(13, TodoListComponent_Conditional_13_Template, 1, 1, "app-todo-form", 5)(14, TodoListComponent_Conditional_14_Template, 2, 0, "div", 6)(15, TodoListComponent_Conditional_15_Template, 2, 1, "div", 7)(16, TodoListComponent_Conditional_16_Template, 2, 0, "div", 8)(17, TodoListComponent_Conditional_17_Template, 10, 4);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(7);
        \u0275\u0275classProp("active", ctx.filterCompleted() === void 0);
        \u0275\u0275advance(2);
        \u0275\u0275classProp("active", ctx.filterCompleted() === false);
        \u0275\u0275advance(2);
        \u0275\u0275classProp("active", ctx.filterCompleted() === true);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx.showForm() ? 13 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.loading() ? 14 : ctx.error() ? 15 : ctx.todos().length === 0 ? 16 : 17);
      }
    }, dependencies: [TodoFormComponent], styles: ["\n\n.todo-page[_ngcontent-%COMP%] {\n  max-width: 720px;\n  margin: 2rem auto;\n  padding: 0 1rem;\n}\n.todo-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 1.5rem;\n}\n.todo-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 700;\n  margin: 0;\n}\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.5rem;\n  margin-bottom: 1.25rem;\n}\n.filters[_ngcontent-%COMP%]   .btn.active[_ngcontent-%COMP%] {\n  background: #3b82f6;\n  color: #fff;\n  border-color: #3b82f6;\n}\n.todo-list[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.todo-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 0.875rem 1rem;\n  background: #fff;\n  border: 1px solid #e5e7eb;\n  border-radius: 0.5rem;\n  transition: box-shadow 0.15s;\n}\n.todo-item[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n}\n.todo-item.completed[_ngcontent-%COMP%]   .todo-title[_ngcontent-%COMP%] {\n  text-decoration: line-through;\n  color: #9ca3af;\n}\n.todo-item[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%] {\n  width: 1.1rem;\n  height: 1.1rem;\n  cursor: pointer;\n  flex-shrink: 0;\n}\n.todo-content[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n  min-width: 0;\n}\n.todo-title[_ngcontent-%COMP%] {\n  font-weight: 500;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.todo-description[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #6b7280;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.todo-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.4rem;\n  flex-shrink: 0;\n}\n.pagination[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n  margin-top: 1.5rem;\n  font-size: 0.875rem;\n  color: #6b7280;\n}\n.loading[_ngcontent-%COMP%], \n.empty[_ngcontent-%COMP%], \n.error[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 3rem;\n  color: #6b7280;\n}\n.error[_ngcontent-%COMP%] {\n  color: #ef4444;\n}\n/*# sourceMappingURL=todo-list.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TodoListComponent, [{
    type: Component,
    args: [{ standalone: false, selector: "app-todo-list", template: '<div class="todo-page">\n  <header class="todo-header">\n    <h1>Todo List</h1>\n    <button class="btn btn-primary" (click)="onNew()">+ New Todo</button>\n  </header>\n\n  <div class="filters">\n    <button class="btn" [class.active]="filterCompleted() === undefined" (click)="setFilter(undefined)">All</button>\n    <button class="btn" [class.active]="filterCompleted() === false" (click)="setFilter(false)">Active</button>\n    <button class="btn" [class.active]="filterCompleted() === true" (click)="setFilter(true)">Completed</button>\n  </div>\n\n  @if (showForm()) {\n    <app-todo-form\n      [todo]="editingTodo()"\n      (saved)="onSaved()"\n      (cancelled)="onCancel()">\n    </app-todo-form>\n  }\n\n  @if (loading()) {\n    <div class="loading">Loading...</div>\n  } @else if (error()) {\n    <div class="error">{{ error() }}</div>\n  } @else if (todos().length === 0) {\n    <div class="empty">No todos yet. Create one!</div>\n  } @else {\n    <ul class="todo-list">\n      @for (todo of todos(); track todo.id) {\n        <li class="todo-item" [class.completed]="todo.completed">\n          <input\n            type="checkbox"\n            [checked]="todo.completed"\n            (change)="onToggle(todo)"\n          />\n          <div class="todo-content">\n            <span class="todo-title">{{ todo.title }}</span>\n            @if (todo.description) {\n              <span class="todo-description">{{ todo.description }}</span>\n            }\n          </div>\n          <div class="todo-actions">\n            <button class="btn btn-sm" (click)="onEdit(todo)">Edit</button>\n            <button class="btn btn-sm btn-danger" (click)="onDelete(todo.id)">Delete</button>\n          </div>\n        </li>\n      }\n    </ul>\n\n    <div class="pagination">\n      <button class="btn btn-sm" [disabled]="page() === 1" (click)="prevPage()">Prev</button>\n      <span>Page {{ page() }} \u2014 {{ total() }} total</span>\n      <button class="btn btn-sm" [disabled]="page() * size() >= total()" (click)="nextPage()">Next</button>\n    </div>\n  }\n</div>\n', styles: ["/* src/app/modules/todos/components/todo-list/todo-list.component.scss */\n.todo-page {\n  max-width: 720px;\n  margin: 2rem auto;\n  padding: 0 1rem;\n}\n.todo-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 1.5rem;\n}\n.todo-header h1 {\n  font-size: 1.75rem;\n  font-weight: 700;\n  margin: 0;\n}\n.filters {\n  display: flex;\n  gap: 0.5rem;\n  margin-bottom: 1.25rem;\n}\n.filters .btn.active {\n  background: #3b82f6;\n  color: #fff;\n  border-color: #3b82f6;\n}\n.todo-list {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.todo-item {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 0.875rem 1rem;\n  background: #fff;\n  border: 1px solid #e5e7eb;\n  border-radius: 0.5rem;\n  transition: box-shadow 0.15s;\n}\n.todo-item:hover {\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n}\n.todo-item.completed .todo-title {\n  text-decoration: line-through;\n  color: #9ca3af;\n}\n.todo-item input[type=checkbox] {\n  width: 1.1rem;\n  height: 1.1rem;\n  cursor: pointer;\n  flex-shrink: 0;\n}\n.todo-content {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n  min-width: 0;\n}\n.todo-title {\n  font-weight: 500;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.todo-description {\n  font-size: 0.8rem;\n  color: #6b7280;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.todo-actions {\n  display: flex;\n  gap: 0.4rem;\n  flex-shrink: 0;\n}\n.pagination {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n  margin-top: 1.5rem;\n  font-size: 0.875rem;\n  color: #6b7280;\n}\n.loading,\n.empty,\n.error {\n  text-align: center;\n  padding: 3rem;\n  color: #6b7280;\n}\n.error {\n  color: #ef4444;\n}\n/*# sourceMappingURL=todo-list.component.css.map */\n"] }]
  }], () => [{ type: TodoService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TodoListComponent, { className: "TodoListComponent", filePath: "src/app/modules/todos/components/todo-list/todo-list.component.ts", lineNumber: 11 });
})();

// src/app/modules/todos/todos-routing.module.ts
var routes = [{ path: "", component: TodoListComponent }];
var TodosRoutingModule = class _TodosRoutingModule {
  static {
    this.\u0275fac = function TodosRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TodosRoutingModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _TodosRoutingModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forChild(routes), RouterModule] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TodosRoutingModule, [{
    type: NgModule,
    args: [{
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
    }]
  }], null, null);
})();

// src/app/modules/todos/todos.module.ts
var TodosModule = class _TodosModule {
  static {
    this.\u0275fac = function TodosModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TodosModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _TodosModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [SharedModule, TodosRoutingModule] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TodosModule, [{
    type: NgModule,
    args: [{
      declarations: [TodoListComponent, TodoFormComponent],
      imports: [SharedModule, TodosRoutingModule]
    }]
  }], null, null);
})();
export {
  TodosModule
};
//# sourceMappingURL=chunk-4H4UQQ77.js.map
