import {
  ApiService,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  RadioControlValueAccessor,
  SelectControlValueAccessor,
  SharedModule,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-M46NA7XZ.js";
import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  NgModule,
  Output,
  RouterModule,
  TitleCasePipe,
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
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
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

// src/app/modules/risks-issues/services/risks-issues.service.ts
var RisksIssuesService = class _RisksIssuesService {
  constructor(api) {
    this.api = api;
    this.path = "/risks-issues";
  }
  getAll(filter = {}) {
    const params = {};
    if (filter.page !== void 0)
      params["page"] = filter.page;
    if (filter.size !== void 0)
      params["size"] = filter.size;
    if (filter.type !== void 0)
      params["type"] = filter.type;
    if (filter.status !== void 0)
      params["status"] = filter.status;
    return this.api.get(this.path, params);
  }
  getById(id) {
    return this.api.get(`${this.path}/${id}`);
  }
  getAlerts(daysAhead = 7) {
    return this.api.get(`${this.path}/alerts`, { days_ahead: daysAhead });
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
  static {
    this.\u0275fac = function RisksIssuesService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RisksIssuesService)(\u0275\u0275inject(ApiService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RisksIssuesService, factory: _RisksIssuesService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RisksIssuesService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: ApiService }], null);
})();

// src/app/modules/risks-issues/components/risk-issue-form/risk-issue-form.component.ts
function RiskIssueFormComponent_Conditional_4_Template(rf, ctx) {
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
function RiskIssueFormComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1, "Title is required");
    \u0275\u0275elementEnd();
  }
}
function RiskIssueFormComponent_Conditional_60_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "label", 37);
    \u0275\u0275text(2, "Probability");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 38)(4, "option", 29);
    \u0275\u0275text(5, "\u2014 None \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "option", 23);
    \u0275\u0275text(7, "Low");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "option", 24);
    \u0275\u0275text(9, "Medium");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "option", 25);
    \u0275\u0275text(11, "High");
    \u0275\u0275elementEnd()()();
  }
}
var RiskIssueFormComponent = class _RiskIssueFormComponent {
  constructor(fb, service) {
    this.fb = fb;
    this.service = service;
    this.item = null;
    this.saved = new EventEmitter();
    this.cancelled = new EventEmitter();
    this.submitting = false;
    this.error = null;
    this.priorities = ["low", "medium", "high", "critical"];
    this.probabilities = ["low", "medium", "high"];
    this.impacts = ["low", "medium", "high", "critical"];
    this.statuses = ["open", "in_progress", "resolved", "closed"];
  }
  ngOnInit() {
    this.form = this.fb.group({
      type: [this.item?.type ?? "risk", Validators.required],
      title: [this.item?.title ?? "", [Validators.required, Validators.maxLength(255)]],
      description: [this.item?.description ?? ""],
      status: [this.item?.status ?? "open", Validators.required],
      priority: [this.item?.priority ?? "medium", Validators.required],
      probability: [this.item?.probability ?? ""],
      impact: [this.item?.impact ?? ""],
      owner: [this.item?.owner ?? ""],
      due_date: [this.item?.due_date ?? ""]
    });
  }
  get isEdit() {
    return this.item !== null;
  }
  get isRisk() {
    return this.form.get("type")?.value === "risk";
  }
  onSubmit() {
    if (this.form.invalid)
      return;
    this.submitting = true;
    this.error = null;
    const raw = this.form.value;
    const payload = __spreadProps(__spreadValues({}, raw), {
      probability: raw.probability || null,
      impact: raw.impact || null,
      owner: raw.owner || null,
      due_date: raw.due_date || null,
      description: raw.description || null
    });
    const request$ = this.isEdit ? this.service.update(this.item.id, payload) : this.service.create(payload);
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
    this.\u0275fac = function RiskIssueFormComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RiskIssueFormComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(RisksIssuesService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RiskIssueFormComponent, selectors: [["app-risk-issue-form"]], inputs: { item: "item" }, outputs: { saved: "saved", cancelled: "cancelled" }, standalone: false, decls: 89, vars: 11, consts: [[1, "form-card"], [1, "form-error"], [3, "ngSubmit", "formGroup"], [1, "form-row"], [1, "field"], [1, "required"], [1, "radio-group"], [1, "radio-label"], ["type", "radio", "formControlName", "type", "value", "risk"], ["type", "radio", "formControlName", "type", "value", "issue"], ["for", "title"], ["id", "title", "type", "text", "formControlName", "title", "placeholder", "Describe the risk or issue..."], [1, "field-error"], ["for", "description"], ["id", "description", "formControlName", "description", "placeholder", "Provide additional context...", "rows", "3"], ["for", "status"], ["id", "status", "formControlName", "status"], ["value", "open"], ["value", "in_progress"], ["value", "resolved"], ["value", "closed"], ["for", "priority"], ["id", "priority", "formControlName", "priority"], ["value", "low"], ["value", "medium"], ["value", "high"], ["value", "critical"], ["for", "impact"], ["id", "impact", "formControlName", "impact"], ["value", ""], ["for", "owner"], ["id", "owner", "type", "text", "formControlName", "owner", "placeholder", "Responsible person..."], ["for", "due_date"], ["id", "due_date", "type", "date", "formControlName", "due_date"], [1, "form-actions"], ["type", "button", 1, "btn", 3, "click"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["for", "probability"], ["id", "probability", "formControlName", "probability"]], template: function RiskIssueFormComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "h2");
        \u0275\u0275text(2);
        \u0275\u0275pipe(3, "titlecase");
        \u0275\u0275elementEnd();
        \u0275\u0275template(4, RiskIssueFormComponent_Conditional_4_Template, 2, 1, "div", 1);
        \u0275\u0275elementStart(5, "form", 2);
        \u0275\u0275listener("ngSubmit", function RiskIssueFormComponent_Template_form_ngSubmit_5_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275elementStart(6, "div", 3)(7, "div", 4)(8, "label");
        \u0275\u0275text(9, "Type ");
        \u0275\u0275elementStart(10, "span", 5);
        \u0275\u0275text(11, "*");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "div", 6)(13, "label", 7);
        \u0275\u0275element(14, "input", 8);
        \u0275\u0275text(15, " Risk ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "label", 7);
        \u0275\u0275element(17, "input", 9);
        \u0275\u0275text(18, " Issue ");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(19, "div", 4)(20, "label", 10);
        \u0275\u0275text(21, "Title ");
        \u0275\u0275elementStart(22, "span", 5);
        \u0275\u0275text(23, "*");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(24, "input", 11);
        \u0275\u0275template(25, RiskIssueFormComponent_Conditional_25_Template, 2, 0, "span", 12);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(26, "div", 4)(27, "label", 13);
        \u0275\u0275text(28, "Description");
        \u0275\u0275elementEnd();
        \u0275\u0275element(29, "textarea", 14);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(30, "div", 3)(31, "div", 4)(32, "label", 15);
        \u0275\u0275text(33, "Status ");
        \u0275\u0275elementStart(34, "span", 5);
        \u0275\u0275text(35, "*");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(36, "select", 16)(37, "option", 17);
        \u0275\u0275text(38, "Open");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(39, "option", 18);
        \u0275\u0275text(40, "In Progress");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(41, "option", 19);
        \u0275\u0275text(42, "Resolved");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(43, "option", 20);
        \u0275\u0275text(44, "Closed");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(45, "div", 4)(46, "label", 21);
        \u0275\u0275text(47, "Priority ");
        \u0275\u0275elementStart(48, "span", 5);
        \u0275\u0275text(49, "*");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(50, "select", 22)(51, "option", 23);
        \u0275\u0275text(52, "Low");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(53, "option", 24);
        \u0275\u0275text(54, "Medium");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(55, "option", 25);
        \u0275\u0275text(56, "High");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(57, "option", 26);
        \u0275\u0275text(58, "Critical");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(59, "div", 3);
        \u0275\u0275template(60, RiskIssueFormComponent_Conditional_60_Template, 12, 0, "div", 4);
        \u0275\u0275elementStart(61, "div", 4)(62, "label", 27);
        \u0275\u0275text(63, "Impact");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(64, "select", 28)(65, "option", 29);
        \u0275\u0275text(66, "\u2014 None \u2014");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(67, "option", 23);
        \u0275\u0275text(68, "Low");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(69, "option", 24);
        \u0275\u0275text(70, "Medium");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(71, "option", 25);
        \u0275\u0275text(72, "High");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(73, "option", 26);
        \u0275\u0275text(74, "Critical");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(75, "div", 3)(76, "div", 4)(77, "label", 30);
        \u0275\u0275text(78, "Owner");
        \u0275\u0275elementEnd();
        \u0275\u0275element(79, "input", 31);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(80, "div", 4)(81, "label", 32);
        \u0275\u0275text(82, "Due Date");
        \u0275\u0275elementEnd();
        \u0275\u0275element(83, "input", 33);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(84, "div", 34)(85, "button", 35);
        \u0275\u0275listener("click", function RiskIssueFormComponent_Template_button_click_85_listener() {
          return ctx.cancelled.emit();
        });
        \u0275\u0275text(86, "Cancel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(87, "button", 36);
        \u0275\u0275text(88);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        let tmp_3_0;
        let tmp_4_0;
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.isEdit ? "Edit " + \u0275\u0275pipeBind1(3, 9, ctx.item == null ? null : ctx.item.type) : "New Risk / Issue");
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx.error ? 4 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("formGroup", ctx.form);
        \u0275\u0275advance(19);
        \u0275\u0275classProp("invalid", ((tmp_3_0 = ctx.form.get("title")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx.form.get("title")) == null ? null : tmp_3_0.touched));
        \u0275\u0275advance();
        \u0275\u0275conditional(((tmp_4_0 = ctx.form.get("title")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["required"]) && ((tmp_4_0 = ctx.form.get("title")) == null ? null : tmp_4_0.touched) ? 25 : -1);
        \u0275\u0275advance(35);
        \u0275\u0275conditional(ctx.isRisk ? 60 : -1);
        \u0275\u0275advance(27);
        \u0275\u0275property("disabled", ctx.form.invalid || ctx.submitting);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.submitting ? "Saving..." : ctx.isEdit ? "Update" : "Create", " ");
      }
    }, dependencies: [\u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, TitleCasePipe], styles: ["\n\n.form-card[_ngcontent-%COMP%] {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  padding: 1.5rem;\n  margin-bottom: 1.5rem;\n}\n.form-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 1.25rem;\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.form-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n@media (max-width: 600px) {\n  .form-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.field[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.35rem;\n  margin-bottom: 1rem;\n}\n.field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.field[_ngcontent-%COMP%]   input[type=text][_ngcontent-%COMP%], \n.field[_ngcontent-%COMP%]   input[type=date][_ngcontent-%COMP%], \n.field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  padding: 0.5rem 0.75rem;\n  border: 1px solid var(--border);\n  border-radius: 6px;\n  background: var(--bg);\n  color: var(--text-primary);\n  font-size: 0.95rem;\n  transition: border-color 0.15s;\n}\n.field[_ngcontent-%COMP%]   input[type=text][_ngcontent-%COMP%]:focus, \n.field[_ngcontent-%COMP%]   input[type=date][_ngcontent-%COMP%]:focus, \n.field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: var(--primary);\n}\n.field[_ngcontent-%COMP%]   input[type=text].invalid[_ngcontent-%COMP%], \n.field[_ngcontent-%COMP%]   input[type=date].invalid[_ngcontent-%COMP%], \n.field[_ngcontent-%COMP%]   textarea.invalid[_ngcontent-%COMP%], \n.field[_ngcontent-%COMP%]   select.invalid[_ngcontent-%COMP%] {\n  border-color: var(--danger);\n}\n.radio-group[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1.5rem;\n  padding-top: 0.25rem;\n}\n.radio-label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  cursor: pointer;\n  font-size: 0.95rem;\n  color: var(--text-primary);\n}\n.required[_ngcontent-%COMP%] {\n  color: var(--danger);\n}\n.field-error[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  color: var(--danger);\n}\n.form-error[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #b91c1c;\n  padding: 0.5rem 0.75rem;\n  border-radius: 6px;\n  font-size: 0.875rem;\n  margin-bottom: 1rem;\n}\n.form-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.75rem;\n  margin-top: 0.5rem;\n}\n/*# sourceMappingURL=risk-issue-form.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RiskIssueFormComponent, [{
    type: Component,
    args: [{ standalone: false, selector: "app-risk-issue-form", template: `<div class="form-card">
  <h2>{{ isEdit ? 'Edit ' + (item?.type | titlecase) : 'New Risk / Issue' }}</h2>

  @if (error) {
    <div class="form-error">{{ error }}</div>
  }

  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <div class="form-row">
      <div class="field">
        <label>Type <span class="required">*</span></label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" formControlName="type" value="risk" /> Risk
          </label>
          <label class="radio-label">
            <input type="radio" formControlName="type" value="issue" /> Issue
          </label>
        </div>
      </div>
    </div>

    <div class="field">
      <label for="title">Title <span class="required">*</span></label>
      <input
        id="title"
        type="text"
        formControlName="title"
        placeholder="Describe the risk or issue..."
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
        placeholder="Provide additional context..."
        rows="3"
      ></textarea>
    </div>

    <div class="form-row">
      <div class="field">
        <label for="status">Status <span class="required">*</span></label>
        <select id="status" formControlName="status">
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div class="field">
        <label for="priority">Priority <span class="required">*</span></label>
        <select id="priority" formControlName="priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
    </div>

    <div class="form-row">
      @if (isRisk) {
        <div class="field">
          <label for="probability">Probability</label>
          <select id="probability" formControlName="probability">
            <option value="">\u2014 None \u2014</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      }

      <div class="field">
        <label for="impact">Impact</label>
        <select id="impact" formControlName="impact">
          <option value="">\u2014 None \u2014</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
    </div>

    <div class="form-row">
      <div class="field">
        <label for="owner">Owner</label>
        <input id="owner" type="text" formControlName="owner" placeholder="Responsible person..." />
      </div>

      <div class="field">
        <label for="due_date">Due Date</label>
        <input id="due_date" type="date" formControlName="due_date" />
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn" (click)="cancelled.emit()">Cancel</button>
      <button type="submit" class="btn btn-primary" [disabled]="form.invalid || submitting">
        {{ submitting ? 'Saving...' : isEdit ? 'Update' : 'Create' }}
      </button>
    </div>
  </form>
</div>
`, styles: ["/* src/app/modules/risks-issues/components/risk-issue-form/risk-issue-form.component.scss */\n.form-card {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  padding: 1.5rem;\n  margin-bottom: 1.5rem;\n}\n.form-card h2 {\n  margin: 0 0 1.25rem;\n  font-size: 1.1rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.form-row {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n@media (max-width: 600px) {\n  .form-row {\n    grid-template-columns: 1fr;\n  }\n}\n.field {\n  display: flex;\n  flex-direction: column;\n  gap: 0.35rem;\n  margin-bottom: 1rem;\n}\n.field label {\n  font-size: 0.85rem;\n  font-weight: 500;\n  color: var(--text-secondary);\n}\n.field input[type=text],\n.field input[type=date],\n.field textarea,\n.field select {\n  padding: 0.5rem 0.75rem;\n  border: 1px solid var(--border);\n  border-radius: 6px;\n  background: var(--bg);\n  color: var(--text-primary);\n  font-size: 0.95rem;\n  transition: border-color 0.15s;\n}\n.field input[type=text]:focus,\n.field input[type=date]:focus,\n.field textarea:focus,\n.field select:focus {\n  outline: none;\n  border-color: var(--primary);\n}\n.field input[type=text].invalid,\n.field input[type=date].invalid,\n.field textarea.invalid,\n.field select.invalid {\n  border-color: var(--danger);\n}\n.radio-group {\n  display: flex;\n  gap: 1.5rem;\n  padding-top: 0.25rem;\n}\n.radio-label {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  cursor: pointer;\n  font-size: 0.95rem;\n  color: var(--text-primary);\n}\n.required {\n  color: var(--danger);\n}\n.field-error {\n  font-size: 0.78rem;\n  color: var(--danger);\n}\n.form-error {\n  background: #fee2e2;\n  color: #b91c1c;\n  padding: 0.5rem 0.75rem;\n  border-radius: 6px;\n  font-size: 0.875rem;\n  margin-bottom: 1rem;\n}\n.form-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.75rem;\n  margin-top: 0.5rem;\n}\n/*# sourceMappingURL=risk-issue-form.component.css.map */\n"] }]
  }], () => [{ type: FormBuilder }, { type: RisksIssuesService }], { item: [{
    type: Input
  }], saved: [{
    type: Output
  }], cancelled: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RiskIssueFormComponent, { className: "RiskIssueFormComponent", filePath: "src/app/modules/risks-issues/components/risk-issue-form/risk-issue-form.component.ts", lineNumber: 12 });
})();

// src/app/modules/risks-issues/components/risk-issue-list/risk-issue-list.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function RiskIssueListComponent_Conditional_6_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span", 13);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 14);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const a_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classMap("badge-" + a_r1.type);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(a_r1.type);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(a_r1.title);
    \u0275\u0275advance();
    \u0275\u0275classProp("overdue", a_r1.is_overdue);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.deadlineLabel(a_r1), " ");
  }
}
function RiskIssueListComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "strong");
    \u0275\u0275text(2, "\u26A0 Deadline Alert");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementStart(4, "ul", 12);
    \u0275\u0275repeaterCreate(5, RiskIssueListComponent_Conditional_6_For_6_Template, 7, 7, "li", null, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" \u2014 ", ctx_r1.alerts().length, " item(s) due within 7 days or overdue: ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.alerts());
  }
}
function RiskIssueListComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-risk-issue-form", 15);
    \u0275\u0275listener("saved", function RiskIssueListComponent_Conditional_7_Template_app_risk_issue_form_saved_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSaved());
    })("cancelled", function RiskIssueListComponent_Conditional_7_Template_app_risk_issue_form_cancelled_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onCancel());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("item", ctx_r1.editingItem());
  }
}
function RiskIssueListComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275text(1, "Loading...");
    \u0275\u0275elementEnd();
  }
}
function RiskIssueListComponent_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function RiskIssueListComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275text(1, "No items found. Create your first risk or issue!");
    \u0275\u0275elementEnd();
  }
}
function RiskIssueListComponent_Conditional_34_For_22_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r6.description);
  }
}
function RiskIssueListComponent_Conditional_34_For_22_Conditional_19_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r6 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("overdue", item_r6.is_overdue);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.deadlineLabel(item_r6), " ");
  }
}
function RiskIssueListComponent_Conditional_34_For_22_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, RiskIssueListComponent_Conditional_34_For_22_Conditional_19_Conditional_3_Template, 2, 3, "span", 29);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.due_date);
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r6.days_until_due !== null && item_r6.status !== "resolved" && item_r6.status !== "closed" ? 3 : -1);
  }
}
function RiskIssueListComponent_Conditional_34_For_22_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u2014 ");
  }
}
function RiskIssueListComponent_Conditional_34_For_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 13);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 21)(5, "div", 22);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, RiskIssueListComponent_Conditional_34_For_22_Conditional_7_Template, 2, 1, "div", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td")(9, "span", 24);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td")(12, "span", 25);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275template(19, RiskIssueListComponent_Conditional_34_For_22_Conditional_19_Template, 4, 2, "div", 26)(20, RiskIssueListComponent_Conditional_34_For_22_Conditional_20_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td", 27)(22, "button", 8);
    \u0275\u0275listener("click", function RiskIssueListComponent_Conditional_34_For_22_Template_button_click_22_listener() {
      const item_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onEdit(item_r6));
    });
    \u0275\u0275text(23, "Edit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "button", 28);
    \u0275\u0275listener("click", function RiskIssueListComponent_Conditional_34_For_22_Template_button_click_24_listener() {
      const item_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onDelete(item_r6.id));
    });
    \u0275\u0275text(25, "Delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_21_0;
    let tmp_22_0;
    const item_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("row-overdue", item_r6.is_overdue)("row-warning", !item_r6.is_overdue && item_r6.days_until_due !== null && item_r6.days_until_due <= 7);
    \u0275\u0275advance(2);
    \u0275\u0275classMap("badge-" + item_r6.type);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r6.type);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r6.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r6.description ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classMap("status-" + item_r6.status);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatStatus(item_r6.status), " ");
    \u0275\u0275advance(2);
    \u0275\u0275classMap("priority-" + item_r6.priority);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r6.priority);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_21_0 = item_r6.impact) !== null && tmp_21_0 !== void 0 ? tmp_21_0 : "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_22_0 = item_r6.owner) !== null && tmp_22_0 !== void 0 ? tmp_22_0 : "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(item_r6.due_date ? 19 : 20);
  }
}
function RiskIssueListComponent_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "table", 17)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Title");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Priority");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Impact");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Owner");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Due Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th");
    \u0275\u0275text(19, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "tbody");
    \u0275\u0275repeaterCreate(21, RiskIssueListComponent_Conditional_34_For_22_Template, 26, 18, "tr", 18, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "div", 19)(24, "button", 20);
    \u0275\u0275listener("click", function RiskIssueListComponent_Conditional_34_Template_button_click_24_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.prevPage());
    });
    \u0275\u0275text(25, "Prev");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "button", 20);
    \u0275\u0275listener("click", function RiskIssueListComponent_Conditional_34_Template_button_click_28_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.nextPage());
    });
    \u0275\u0275text(29, "Next");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(21);
    \u0275\u0275repeater(ctx_r1.items());
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.page() === 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("Page ", ctx_r1.page(), " \u2014 ", ctx_r1.total(), " total");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.page() * ctx_r1.size() >= ctx_r1.total());
  }
}
var RiskIssueListComponent = class _RiskIssueListComponent {
  constructor(service) {
    this.service = service;
    this.items = signal([]);
    this.alerts = signal([]);
    this.total = signal(0);
    this.page = signal(1);
    this.size = signal(20);
    this.filterType = signal(void 0);
    this.filterStatus = signal(void 0);
    this.loading = signal(false);
    this.error = signal(null);
    this.showForm = signal(false);
    this.editingItem = signal(null);
  }
  ngOnInit() {
    this.load();
    this.loadAlerts();
  }
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.service.getAll({ page: this.page(), size: this.size(), type: this.filterType(), status: this.filterStatus() }).subscribe({
      next: (res) => {
        this.items.set(res.items);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
  loadAlerts() {
    this.service.getAlerts(7).subscribe({
      next: (items) => this.alerts.set(items),
      error: () => this.alerts.set([])
    });
  }
  onDelete(id) {
    if (!confirm("Delete this item?"))
      return;
    this.service.delete(id).subscribe(() => {
      this.load();
      this.loadAlerts();
    });
  }
  onEdit(item) {
    this.editingItem.set(item);
    this.showForm.set(true);
  }
  onNew() {
    this.editingItem.set(null);
    this.showForm.set(true);
  }
  onSaved() {
    this.showForm.set(false);
    this.editingItem.set(null);
    this.load();
    this.loadAlerts();
  }
  onCancel() {
    this.showForm.set(false);
    this.editingItem.set(null);
  }
  setTypeFilter(type) {
    this.filterType.set(type);
    this.page.set(1);
    this.load();
  }
  setStatusFilter(status) {
    this.filterStatus.set(status);
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
  formatStatus(status) {
    return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  deadlineLabel(item) {
    if (item.days_until_due === null)
      return "";
    if (item.is_overdue)
      return `Overdue by ${Math.abs(item.days_until_due)} day(s)`;
    if (item.days_until_due === 0)
      return "Due today";
    return `Due in ${item.days_until_due} day(s)`;
  }
  static {
    this.\u0275fac = function RiskIssueListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RiskIssueListComponent)(\u0275\u0275directiveInject(RisksIssuesService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RiskIssueListComponent, selectors: [["app-risk-issue-list"]], standalone: false, decls: 35, vars: 19, consts: [[1, "rim-page"], [1, "rim-header"], [1, "btn", "btn-primary", 3, "click"], [1, "alert-banner"], [3, "item"], [1, "filters"], [1, "filter-group"], [1, "filter-label"], [1, "btn", "btn-sm", 3, "click"], [1, "loading"], [1, "error"], [1, "empty"], [1, "alert-list"], [1, "badge"], [1, "deadline-label"], [3, "saved", "cancelled", "item"], [1, "rim-table-wrapper"], [1, "rim-table"], [3, "row-overdue", "row-warning"], [1, "pagination"], [1, "btn", "btn-sm", 3, "click", "disabled"], [1, "col-title"], [1, "title-text"], [1, "desc-text"], [1, "status-badge"], [1, "priority-badge"], [1, "due-cell"], [1, "col-actions"], [1, "btn", "btn-sm", "btn-danger", 3, "click"], [1, "deadline-label", 3, "overdue"]], template: function RiskIssueListComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1");
        \u0275\u0275text(3, "Risks & Issues");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "button", 2);
        \u0275\u0275listener("click", function RiskIssueListComponent_Template_button_click_4_listener() {
          return ctx.onNew();
        });
        \u0275\u0275text(5, "+ New");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(6, RiskIssueListComponent_Conditional_6_Template, 7, 1, "div", 3)(7, RiskIssueListComponent_Conditional_7_Template, 1, 1, "app-risk-issue-form", 4);
        \u0275\u0275elementStart(8, "div", 5)(9, "div", 6)(10, "span", 7);
        \u0275\u0275text(11, "Type:");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "button", 8);
        \u0275\u0275listener("click", function RiskIssueListComponent_Template_button_click_12_listener() {
          return ctx.setTypeFilter(void 0);
        });
        \u0275\u0275text(13, "All");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "button", 8);
        \u0275\u0275listener("click", function RiskIssueListComponent_Template_button_click_14_listener() {
          return ctx.setTypeFilter("risk");
        });
        \u0275\u0275text(15, "Risks");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "button", 8);
        \u0275\u0275listener("click", function RiskIssueListComponent_Template_button_click_16_listener() {
          return ctx.setTypeFilter("issue");
        });
        \u0275\u0275text(17, "Issues");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(18, "div", 6)(19, "span", 7);
        \u0275\u0275text(20, "Status:");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "button", 8);
        \u0275\u0275listener("click", function RiskIssueListComponent_Template_button_click_21_listener() {
          return ctx.setStatusFilter(void 0);
        });
        \u0275\u0275text(22, "All");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "button", 8);
        \u0275\u0275listener("click", function RiskIssueListComponent_Template_button_click_23_listener() {
          return ctx.setStatusFilter("open");
        });
        \u0275\u0275text(24, "Open");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(25, "button", 8);
        \u0275\u0275listener("click", function RiskIssueListComponent_Template_button_click_25_listener() {
          return ctx.setStatusFilter("in_progress");
        });
        \u0275\u0275text(26, "In Progress");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "button", 8);
        \u0275\u0275listener("click", function RiskIssueListComponent_Template_button_click_27_listener() {
          return ctx.setStatusFilter("resolved");
        });
        \u0275\u0275text(28, "Resolved");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(29, "button", 8);
        \u0275\u0275listener("click", function RiskIssueListComponent_Template_button_click_29_listener() {
          return ctx.setStatusFilter("closed");
        });
        \u0275\u0275text(30, "Closed");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(31, RiskIssueListComponent_Conditional_31_Template, 2, 0, "div", 9)(32, RiskIssueListComponent_Conditional_32_Template, 2, 1, "div", 10)(33, RiskIssueListComponent_Conditional_33_Template, 2, 0, "div", 11)(34, RiskIssueListComponent_Conditional_34_Template, 30, 4);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(6);
        \u0275\u0275conditional(ctx.alerts().length > 0 ? 6 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.showForm() ? 7 : -1);
        \u0275\u0275advance(5);
        \u0275\u0275classProp("active", ctx.filterType() === void 0);
        \u0275\u0275advance(2);
        \u0275\u0275classProp("active", ctx.filterType() === "risk");
        \u0275\u0275advance(2);
        \u0275\u0275classProp("active", ctx.filterType() === "issue");
        \u0275\u0275advance(5);
        \u0275\u0275classProp("active", ctx.filterStatus() === void 0);
        \u0275\u0275advance(2);
        \u0275\u0275classProp("active", ctx.filterStatus() === "open");
        \u0275\u0275advance(2);
        \u0275\u0275classProp("active", ctx.filterStatus() === "in_progress");
        \u0275\u0275advance(2);
        \u0275\u0275classProp("active", ctx.filterStatus() === "resolved");
        \u0275\u0275advance(2);
        \u0275\u0275classProp("active", ctx.filterStatus() === "closed");
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx.loading() ? 31 : ctx.error() ? 32 : ctx.items().length === 0 ? 33 : 34);
      }
    }, dependencies: [RiskIssueFormComponent], styles: ["\n\n.rim-page[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n.rim-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.25rem;\n}\n.rim-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--text-primary);\n}\n.alert-banner[_ngcontent-%COMP%] {\n  background: #fff7ed;\n  border: 1px solid #fed7aa;\n  border-left: 4px solid #ea580c;\n  border-radius: 6px;\n  padding: 0.85rem 1rem;\n  margin-bottom: 1.25rem;\n  font-size: 0.9rem;\n  color: #7c2d12;\n}\n.alert-banner[_ngcontent-%COMP%]   .alert-list[_ngcontent-%COMP%] {\n  margin: 0.5rem 0 0;\n  padding-left: 1.25rem;\n  list-style: disc;\n}\n.alert-banner[_ngcontent-%COMP%]   .alert-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-top: 0.25rem;\n}\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1.5rem;\n  flex-wrap: wrap;\n  margin-bottom: 1.25rem;\n}\n.filter-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n}\n.filter-label[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n  text-transform: uppercase;\n  letter-spacing: 0.03em;\n}\n.rim-table-wrapper[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n}\n.rim-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.9rem;\n}\n.rim-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background: var(--surface);\n  padding: 0.65rem 0.85rem;\n  text-align: left;\n  font-size: 0.78rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  color: var(--text-secondary);\n  border-bottom: 1px solid var(--border);\n}\n.rim-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 0.65rem 0.85rem;\n  border-bottom: 1px solid var(--border);\n  color: var(--text-primary);\n  vertical-align: top;\n}\n.rim-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n  border-bottom: none;\n}\n.rim-table[_ngcontent-%COMP%]   tr.row-overdue[_ngcontent-%COMP%] {\n  background: #fff1f2;\n}\n.rim-table[_ngcontent-%COMP%]   tr.row-warning[_ngcontent-%COMP%] {\n  background: #fffbeb;\n}\n.col-title[_ngcontent-%COMP%] {\n  max-width: 280px;\n}\n.title-text[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n.desc-text[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--text-secondary);\n  margin-top: 0.2rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: 260px;\n}\n.col-actions[_ngcontent-%COMP%] {\n  white-space: nowrap;\n  display: flex;\n  gap: 0.4rem;\n}\n.badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.15rem 0.55rem;\n  border-radius: 999px;\n  font-size: 0.72rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.badge.badge-risk[_ngcontent-%COMP%] {\n  background: #ede9fe;\n  color: #6d28d9;\n}\n.badge.badge-issue[_ngcontent-%COMP%] {\n  background: #dbeafe;\n  color: #1d4ed8;\n}\n.status-badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.15rem 0.55rem;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  font-weight: 500;\n}\n.status-badge.status-open[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n.status-badge.status-in_progress[_ngcontent-%COMP%] {\n  background: #fef9c3;\n  color: #92400e;\n}\n.status-badge.status-resolved[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #166534;\n}\n.status-badge.status-closed[_ngcontent-%COMP%] {\n  background: #f1f5f9;\n  color: #475569;\n}\n.priority-badge[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.priority-badge.priority-low[_ngcontent-%COMP%] {\n  color: #16a34a;\n}\n.priority-badge.priority-medium[_ngcontent-%COMP%] {\n  color: #d97706;\n}\n.priority-badge.priority-high[_ngcontent-%COMP%] {\n  color: #dc2626;\n}\n.priority-badge.priority-critical[_ngcontent-%COMP%] {\n  color: #7f1d1d;\n  font-weight: 700;\n}\n.due-cell[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n}\n.deadline-label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: #d97706;\n  font-weight: 500;\n}\n.deadline-label.overdue[_ngcontent-%COMP%] {\n  color: #b91c1c;\n  font-weight: 700;\n}\n.pagination[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n  margin-top: 1.25rem;\n  font-size: 0.875rem;\n  color: var(--text-secondary);\n}\n.loading[_ngcontent-%COMP%], \n.empty[_ngcontent-%COMP%], \n.error[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 3rem;\n  color: var(--text-secondary);\n  font-size: 0.95rem;\n}\n.error[_ngcontent-%COMP%] {\n  color: var(--danger);\n}\n/*# sourceMappingURL=risk-issue-list.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RiskIssueListComponent, [{
    type: Component,
    args: [{ standalone: false, selector: "app-risk-issue-list", template: `<div class="rim-page">
  <header class="rim-header">
    <h1>Risks &amp; Issues</h1>
    <button class="btn btn-primary" (click)="onNew()">+ New</button>
  </header>

  @if (alerts().length > 0) {
    <div class="alert-banner">
      <strong>&#9888; Deadline Alert</strong> \u2014 {{ alerts().length }} item(s) due within 7 days or overdue:
      <ul class="alert-list">
        @for (a of alerts(); track a.id) {
          <li>
            <span class="badge" [class]="'badge-' + a.type">{{ a.type }}</span>
            <strong>{{ a.title }}</strong>
            <span class="deadline-label" [class.overdue]="a.is_overdue">
              {{ deadlineLabel(a) }}
            </span>
          </li>
        }
      </ul>
    </div>
  }

  @if (showForm()) {
    <app-risk-issue-form
      [item]="editingItem()"
      (saved)="onSaved()"
      (cancelled)="onCancel()">
    </app-risk-issue-form>
  }

  <div class="filters">
    <div class="filter-group">
      <span class="filter-label">Type:</span>
      <button class="btn btn-sm" [class.active]="filterType() === undefined" (click)="setTypeFilter(undefined)">All</button>
      <button class="btn btn-sm" [class.active]="filterType() === 'risk'" (click)="setTypeFilter('risk')">Risks</button>
      <button class="btn btn-sm" [class.active]="filterType() === 'issue'" (click)="setTypeFilter('issue')">Issues</button>
    </div>
    <div class="filter-group">
      <span class="filter-label">Status:</span>
      <button class="btn btn-sm" [class.active]="filterStatus() === undefined" (click)="setStatusFilter(undefined)">All</button>
      <button class="btn btn-sm" [class.active]="filterStatus() === 'open'" (click)="setStatusFilter('open')">Open</button>
      <button class="btn btn-sm" [class.active]="filterStatus() === 'in_progress'" (click)="setStatusFilter('in_progress')">In Progress</button>
      <button class="btn btn-sm" [class.active]="filterStatus() === 'resolved'" (click)="setStatusFilter('resolved')">Resolved</button>
      <button class="btn btn-sm" [class.active]="filterStatus() === 'closed'" (click)="setStatusFilter('closed')">Closed</button>
    </div>
  </div>

  @if (loading()) {
    <div class="loading">Loading...</div>
  } @else if (error()) {
    <div class="error">{{ error() }}</div>
  } @else if (items().length === 0) {
    <div class="empty">No items found. Create your first risk or issue!</div>
  } @else {
    <div class="rim-table-wrapper">
      <table class="rim-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Impact</th>
            <th>Owner</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (item of items(); track item.id) {
            <tr [class.row-overdue]="item.is_overdue" [class.row-warning]="!item.is_overdue && item.days_until_due !== null && item.days_until_due <= 7">
              <td>
                <span class="badge" [class]="'badge-' + item.type">{{ item.type }}</span>
              </td>
              <td class="col-title">
                <div class="title-text">{{ item.title }}</div>
                @if (item.description) {
                  <div class="desc-text">{{ item.description }}</div>
                }
              </td>
              <td>
                <span class="status-badge" [class]="'status-' + item.status">
                  {{ formatStatus(item.status) }}
                </span>
              </td>
              <td>
                <span class="priority-badge" [class]="'priority-' + item.priority">{{ item.priority }}</span>
              </td>
              <td>{{ item.impact ?? '\u2014' }}</td>
              <td>{{ item.owner ?? '\u2014' }}</td>
              <td>
                @if (item.due_date) {
                  <div class="due-cell">
                    <span>{{ item.due_date }}</span>
                    @if (item.days_until_due !== null && item.status !== 'resolved' && item.status !== 'closed') {
                      <span class="deadline-label" [class.overdue]="item.is_overdue">
                        {{ deadlineLabel(item) }}
                      </span>
                    }
                  </div>
                } @else {
                  \u2014
                }
              </td>
              <td class="col-actions">
                <button class="btn btn-sm" (click)="onEdit(item)">Edit</button>
                <button class="btn btn-sm btn-danger" (click)="onDelete(item.id)">Delete</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button class="btn btn-sm" [disabled]="page() === 1" (click)="prevPage()">Prev</button>
      <span>Page {{ page() }} \u2014 {{ total() }} total</span>
      <button class="btn btn-sm" [disabled]="page() * size() >= total()" (click)="nextPage()">Next</button>
    </div>
  }
</div>
`, styles: ["/* src/app/modules/risks-issues/components/risk-issue-list/risk-issue-list.component.scss */\n.rim-page {\n  padding: 1.5rem;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n.rim-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.25rem;\n}\n.rim-header h1 {\n  margin: 0;\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--text-primary);\n}\n.alert-banner {\n  background: #fff7ed;\n  border: 1px solid #fed7aa;\n  border-left: 4px solid #ea580c;\n  border-radius: 6px;\n  padding: 0.85rem 1rem;\n  margin-bottom: 1.25rem;\n  font-size: 0.9rem;\n  color: #7c2d12;\n}\n.alert-banner .alert-list {\n  margin: 0.5rem 0 0;\n  padding-left: 1.25rem;\n  list-style: disc;\n}\n.alert-banner .alert-list li {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-top: 0.25rem;\n}\n.filters {\n  display: flex;\n  gap: 1.5rem;\n  flex-wrap: wrap;\n  margin-bottom: 1.25rem;\n}\n.filter-group {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n}\n.filter-label {\n  font-size: 0.8rem;\n  font-weight: 600;\n  color: var(--text-secondary);\n  text-transform: uppercase;\n  letter-spacing: 0.03em;\n}\n.rim-table-wrapper {\n  overflow-x: auto;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n}\n.rim-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 0.9rem;\n}\n.rim-table th {\n  background: var(--surface);\n  padding: 0.65rem 0.85rem;\n  text-align: left;\n  font-size: 0.78rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  color: var(--text-secondary);\n  border-bottom: 1px solid var(--border);\n}\n.rim-table td {\n  padding: 0.65rem 0.85rem;\n  border-bottom: 1px solid var(--border);\n  color: var(--text-primary);\n  vertical-align: top;\n}\n.rim-table tr:last-child td {\n  border-bottom: none;\n}\n.rim-table tr.row-overdue {\n  background: #fff1f2;\n}\n.rim-table tr.row-warning {\n  background: #fffbeb;\n}\n.col-title {\n  max-width: 280px;\n}\n.title-text {\n  font-weight: 500;\n}\n.desc-text {\n  font-size: 0.8rem;\n  color: var(--text-secondary);\n  margin-top: 0.2rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: 260px;\n}\n.col-actions {\n  white-space: nowrap;\n  display: flex;\n  gap: 0.4rem;\n}\n.badge {\n  display: inline-block;\n  padding: 0.15rem 0.55rem;\n  border-radius: 999px;\n  font-size: 0.72rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n.badge.badge-risk {\n  background: #ede9fe;\n  color: #6d28d9;\n}\n.badge.badge-issue {\n  background: #dbeafe;\n  color: #1d4ed8;\n}\n.status-badge {\n  display: inline-block;\n  padding: 0.15rem 0.55rem;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  font-weight: 500;\n}\n.status-badge.status-open {\n  background: #fee2e2;\n  color: #b91c1c;\n}\n.status-badge.status-in_progress {\n  background: #fef9c3;\n  color: #92400e;\n}\n.status-badge.status-resolved {\n  background: #dcfce7;\n  color: #166534;\n}\n.status-badge.status-closed {\n  background: #f1f5f9;\n  color: #475569;\n}\n.priority-badge {\n  font-size: 0.78rem;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.priority-badge.priority-low {\n  color: #16a34a;\n}\n.priority-badge.priority-medium {\n  color: #d97706;\n}\n.priority-badge.priority-high {\n  color: #dc2626;\n}\n.priority-badge.priority-critical {\n  color: #7f1d1d;\n  font-weight: 700;\n}\n.due-cell {\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n}\n.deadline-label {\n  font-size: 0.75rem;\n  color: #d97706;\n  font-weight: 500;\n}\n.deadline-label.overdue {\n  color: #b91c1c;\n  font-weight: 700;\n}\n.pagination {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n  margin-top: 1.25rem;\n  font-size: 0.875rem;\n  color: var(--text-secondary);\n}\n.loading,\n.empty,\n.error {\n  text-align: center;\n  padding: 3rem;\n  color: var(--text-secondary);\n  font-size: 0.95rem;\n}\n.error {\n  color: var(--danger);\n}\n/*# sourceMappingURL=risk-issue-list.component.css.map */\n"] }]
  }], () => [{ type: RisksIssuesService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RiskIssueListComponent, { className: "RiskIssueListComponent", filePath: "src/app/modules/risks-issues/components/risk-issue-list/risk-issue-list.component.ts", lineNumber: 11 });
})();

// src/app/modules/risks-issues/risks-issues-routing.module.ts
var routes = [{ path: "", component: RiskIssueListComponent }];
var RisksIssuesRoutingModule = class _RisksIssuesRoutingModule {
  static {
    this.\u0275fac = function RisksIssuesRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RisksIssuesRoutingModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _RisksIssuesRoutingModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forChild(routes), RouterModule] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RisksIssuesRoutingModule, [{
    type: NgModule,
    args: [{
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
    }]
  }], null, null);
})();

// src/app/modules/risks-issues/risks-issues.module.ts
var RisksIssuesModule = class _RisksIssuesModule {
  static {
    this.\u0275fac = function RisksIssuesModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RisksIssuesModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _RisksIssuesModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [SharedModule, RisksIssuesRoutingModule] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RisksIssuesModule, [{
    type: NgModule,
    args: [{
      declarations: [RiskIssueListComponent, RiskIssueFormComponent],
      imports: [SharedModule, RisksIssuesRoutingModule]
    }]
  }], null, null);
})();
export {
  RisksIssuesModule
};
//# sourceMappingURL=chunk-7H55CN4G.js.map
