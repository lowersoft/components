import { n as e } from "./core-WcEz9YgG.js";
import { n as t, t as n } from "./form-QHOiInAj.js";
//#region src/core/field.js
var r = class extends n(e) {
	static shadowOptions = {
		mode: "open",
		delegatesFocus: !0
	};
	static props = {
		value: { default: "" },
		label: {},
		hint: {},
		error: {},
		placeholder: {},
		name: {},
		required: {
			type: Boolean,
			reflect: !0
		},
		disabled: {
			type: Boolean,
			reflect: !0
		},
		readonly: {
			type: Boolean,
			reflect: !0
		},
		minlength: { type: Number },
		maxlength: { type: Number },
		autocomplete: {},
		counter: { type: Boolean }
	};
	static nativeAttributes = [
		"placeholder",
		"autocomplete",
		"minlength",
		"maxlength"
	];
	#e = null;
	#t = !1;
	#n = !1;
	render() {
		return `<label class="label" for="control" part="label"></label><div class="field" part="field">${this.renderControl()}</div><div class="below"><p class="hint" id="hint"></p><p class="error" id="error" aria-live="polite"></p><span class="count" aria-hidden="true"></span></div>`;
	}
	renderControl() {
		return "";
	}
	get control() {
		return this.query(".control");
	}
	connected() {
		let e = { signal: this.signal }, t = this.control;
		t.setAttribute("aria-describedby", "hint error"), t.addEventListener("input", () => this.typed(), e), t.addEventListener("change", () => this.dispatchEvent(new Event("change", { bubbles: !0 })), e), t.addEventListener("blur", () => this.#i(), e), this.query(".field").addEventListener("pointerdown", (e) => e.target !== t && !this.isDisabled && (e.preventDefault(), t.focus()), e), this.addEventListener("invalid", () => this.#i(), e);
	}
	updated(e) {
		this.#e ??= this.value;
		let t = this.control;
		e.has("label") && (this.query(".label").textContent = this.label ?? "", this.query(".label").hidden = !this.label), e.has("hint") && (this.query(".hint").textContent = this.hint ?? "");
		for (let n of this.constructor.nativeAttributes) {
			if (!e.has(n)) continue;
			let r = this[n];
			r == null || Number.isNaN(r) ? t.removeAttribute(n) : t.setAttribute(n, r);
		}
		t.required = this.required, t.readOnly = this.readonly, this.#r(), e.has("value") && t.value !== this.value && (t.value = this.value ?? ""), this.sync();
	}
	formResetCallback() {
		this.value = this.#e ?? "", this.#n = !1;
	}
	formDisabledCallback(e) {
		this.#t = e, this.#r();
	}
	formStateRestoreCallback(e) {
		this.value = e;
	}
	focus(e) {
		this.control.focus(e);
	}
	select() {
		this.control.select();
	}
	get isDisabled() {
		return !!(this.disabled || this.#t);
	}
	#r() {
		this.control.disabled = this.isDisabled, this.toggleAttribute("data-disabled", this.isDisabled);
	}
	typed() {
		this.value = this.control.value, this.sync();
	}
	#i() {
		this.#n = !0, this.sync();
	}
	customValidity() {
		return "";
	}
	sync() {
		let e = this.control;
		this[t].setFormValue(this.value ?? "");
		let n = e.validity.valid ? this.customValidity() : "", r = this.error || n;
		r ? this[t].setValidity({ customError: !0 }, r, e) : this[t].setValidity(e.validity, e.validationMessage, e);
		let i = !!this.error || this.#n && !this[t].validity.valid;
		this.toggleAttribute("data-invalid", i), e.ariaInvalid = i ? "true" : null, this.query(".error").textContent = i ? r || e.validationMessage : "";
		let a = this.query(".count");
		a.hidden = !(this.counter && this.maxlength > 0), a.hidden || (a.textContent = `${(this.value ?? "").length} / ${this.maxlength}`);
	}
};
//#endregion
export { r as t };
