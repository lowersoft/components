import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./form-QHOiInAj.js";
import { t as i } from "./field-DZ1QAD5P.js";
import { t as a } from "./toggle-TbS2nWfw.js";
//#region src/components/radio-group/radio.scss?inline
var o = ":host{--_size:1rem;outline:none}.visual{width:var(--_size);height:var(--_size);border:1px solid color-mix(in oklab, var(--lw-color-foreground) 30%, transparent);background:var(--lw-color-background);border-radius:50%;transition:border-color .15s ease-out}.toggle:hover .visual{border-color:color-mix(in oklab, var(--lw-color-foreground) 55%, transparent)}:host([checked]) .visual{border-color:var(--lw-color-primary)}:host(:focus-visible) .visual{outline:2px solid var(--lw-color-ring);outline-offset:2px}.dot{background:var(--lw-color-primary);border-radius:50%;width:.5rem;height:.5rem;scale:0}@media (prefers-reduced-motion:no-preference){.dot{transition:scale .2s var(--lw-ease-spring)}}:host([checked]) .dot{scale:1}", s = class extends e {
	static styles = [a, o];
	static props = {
		value: { default: "" },
		checked: {
			type: Boolean,
			reflect: !0
		},
		disabled: {
			type: Boolean,
			reflect: !0
		},
		description: {}
	};
	#e = this.attachInternals();
	render() {
		return "<span class=\"toggle\" part=\"base\"><span class=\"visual\" part=\"control\" aria-hidden=\"true\"><span class=\"dot\"></span></span><span class=\"text\"><span class=\"label\" part=\"label\"><slot></slot></span><span class=\"description\" part=\"description\"></span></span></span>";
	}
	connected() {
		this.#e.role = "radio";
	}
	updated(e) {
		if (e.has("description")) {
			let e = this.query(".description");
			e.textContent = this.description ?? "", e.hidden = !this.description, this.#e.ariaDescription = this.description ?? null;
		}
		this.#e.ariaChecked = String(!!this.checked), this.#e.ariaDisabled = this.disabled ? "true" : null, this.toggleAttribute("data-disabled", !!this.disabled);
	}
}, c = ":host{width:auto}.options{flex-direction:column;gap:.75rem;display:flex}:host([orientation=horizontal]) .options{flex-flow:wrap;gap:.75rem 1.5rem}::slotted([data-group-disabled]){pointer-events:none;opacity:.5}::slotted(lw-radio[disabled]){pointer-events:none}", l = class extends r(e) {
	static styles = [i, c];
	static props = {
		value: { default: "" },
		label: {},
		hint: {},
		name: {},
		required: {
			type: Boolean,
			reflect: !0
		},
		disabled: {
			type: Boolean,
			reflect: !0
		},
		orientation: {
			default: "vertical",
			reflect: !0
		}
	};
	#e = null;
	#t = !1;
	#n = !1;
	render() {
		return "<span class=\"label\" id=\"label\" part=\"label\"></span><div class=\"options\" part=\"options\"><slot></slot></div><div class=\"below\"><p class=\"hint\"></p><p class=\"error\" aria-live=\"polite\"></p></div>";
	}
	connected() {
		let e = { signal: this.signal };
		this[n].role = "radiogroup", this.addEventListener("click", (e) => this.#s(e.target.closest("lw-radio"), !0), e), this.addEventListener("keydown", (e) => this.#c(e), e), this.addEventListener("focusout", (e) => !this.contains(e.relatedTarget) && this.#l(), e), this.addEventListener("invalid", () => this.#l(), e), this.query("slot").addEventListener("slotchange", () => this.#u(), e);
	}
	updated(e) {
		this.#e ??= this.value, e.has("label") && (this.query(".label").textContent = this.label ?? "", this.query(".label").hidden = !this.label, this[n].ariaLabel = this.label ?? null), e.has("hint") && (this.query(".hint").textContent = this.hint ?? ""), this[n].ariaRequired = this.required ? "true" : null, this[n].ariaOrientation = this.orientation === "horizontal" ? "horizontal" : "vertical", this.#u();
	}
	formResetCallback() {
		this.value = this.#e ?? "", this.#n = !1;
	}
	formDisabledCallback(e) {
		this.#t = e, this.#u();
	}
	formStateRestoreCallback(e) {
		this.value = e ?? "";
	}
	focus(e) {
		this.#o?.focus(e);
	}
	get #r() {
		return [...this.querySelectorAll(":scope > lw-radio")];
	}
	#i(e) {
		return this.disabled || this.#t || e.disabled;
	}
	get #a() {
		return this.#r.filter((e) => !this.#i(e));
	}
	get #o() {
		return this.#a.find((e) => e.value === this.value) ?? this.#a[0];
	}
	#s(e, t = !1) {
		e && !this.#i(e) && (e.focus(), e.value !== this.value && (this.value = e.value, this.#u(), t && (this.dispatchEvent(new Event("input", {
			bubbles: !0,
			composed: !0
		})), this.dispatchEvent(new Event("change", { bubbles: !0 })))));
	}
	#c(e) {
		let t = this.#a, n = t.indexOf(e.target.closest("lw-radio"));
		if (n < 0) return;
		let r = {
			ArrowDown: 1,
			ArrowRight: 1,
			ArrowUp: -1,
			ArrowLeft: -1
		}[e.key];
		r ? (e.preventDefault(), this.#s(t[(n + r + t.length) % t.length], !0)) : e.key === " " && (e.preventDefault(), this.#s(t[n], !0));
	}
	#l() {
		this.#n = !0, this.#u();
	}
	#u() {
		let e = this.#o;
		for (let t of this.#r) t.checked = t.value === this.value, t.tabIndex = t === e ? 0 : -1, t.toggleAttribute("data-group-disabled", this.disabled || this.#t);
		this.toggleAttribute("data-disabled", this.disabled || this.#t);
		let t = this.#r.some((e) => e.value === this.value && e.checked) ? this.value : "";
		this[n].setFormValue(t || null);
		let r = this.required && !t;
		r ? this[n].setValidity({ valueMissing: !0 }, "Please choose one of these options.", e ?? void 0) : this[n].setValidity({});
		let i = r && this.#n;
		this.toggleAttribute("data-invalid", i), this.query(".error").textContent = i ? this.validationMessage : "";
	}
};
t("radio", s), t("radio-group", l);
//#endregion
export { s as n, l as t };
