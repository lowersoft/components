import { n as e } from "./core-WcEz9YgG.js";
import { n as t, t as n } from "./form-QHOiInAj.js";
//#region src/core/toggle.js
var r = class extends n(e) {
	static shadowOptions = {
		mode: "open",
		delegatesFocus: !0
	};
	static role = null;
	static props = {
		checked: {
			type: Boolean,
			reflect: !0
		},
		value: { default: "on" },
		name: {},
		description: {},
		required: {
			type: Boolean,
			reflect: !0
		},
		disabled: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = null;
	#t = !1;
	render() {
		return `<label class="toggle" part="base"><input class="control" type="checkbox"${this.constructor.role ? ` role="${this.constructor.role}"` : ""} aria-describedby="description"><span class="visual" part="control" aria-hidden="true">${this.renderVisual()}</span><span class="text"><span class="label" part="label"><slot></slot></span><span class="description" id="description" part="description"></span></span></label>`;
	}
	renderVisual() {
		return "";
	}
	get control() {
		return this.query(".control");
	}
	connected() {
		let e = this.control;
		e.addEventListener("change", () => {
			this.checked = e.checked, this.changed(), this.sync(), this.dispatchEvent(new Event("change", { bubbles: !0 }));
		}, { signal: this.signal });
	}
	updated(e) {
		this.#e ??= !!this.checked;
		let t = this.control;
		if (e.has("description")) {
			let e = this.query(".description");
			e.textContent = this.description ?? "", e.hidden = !this.description;
		}
		t.checked = this.checked, t.required = this.required, t.disabled = this.disabled || this.#t, this.toggleAttribute("data-disabled", t.disabled), this.sync();
	}
	changed() {}
	formResetCallback() {
		this.checked = this.#e ?? !1;
	}
	formDisabledCallback(e) {
		this.#t = e, this.control.disabled = this.disabled || e, this.toggleAttribute("data-disabled", this.control.disabled);
	}
	formStateRestoreCallback(e) {
		this.checked = e !== null;
	}
	focus(e) {
		this.control.focus(e);
	}
	sync() {
		let e = this.control;
		this[t].setFormValue(this.checked ? this.value ?? "on" : null), this[t].setValidity(e.validity, e.validationMessage, e);
	}
};
//#endregion
export { r as t };
