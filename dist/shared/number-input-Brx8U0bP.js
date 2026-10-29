import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./field-DZ1QAD5P.js";
import { t as n } from "./field-_etHxN_N.js";
//#region src/components/number-input/number-input.scss?inline
var r = ":host{width:200px}.field{align-items:center;height:2.5rem;padding:0 .25rem;display:flex}.control{font-variant-numeric:tabular-nums;text-align:center;appearance:textfield;flex:1;height:100%}.control::-webkit-inner-spin-button{appearance:none;margin:0}.control::-webkit-outer-spin-button{appearance:none;margin:0}.step{border-radius:var(--lw-radius-sm);width:2rem;height:2rem;color:var(--lw-color-muted-foreground);cursor:pointer;background:0 0;border:0;flex:none;place-items:center;padding:0;transition:color .15s ease-out,background-color .15s ease-out;display:grid}.step svg{width:1rem;height:1rem}.step:hover:not(:disabled){background:var(--lw-color-muted);color:var(--lw-color-foreground)}.step:active:not(:disabled){scale:.92}.step:disabled{cursor:not-allowed;opacity:.35}", i = 400, a = 60, o = class extends n {
	static styles = [t, r];
	static props = {
		...n.props,
		min: { type: Number },
		max: { type: Number },
		step: { type: Number }
	};
	static nativeAttributes = [
		...n.nativeAttributes,
		"min",
		"max",
		"step"
	];
	#e = 0;
	renderControl() {
		return "<button class=\"step\" type=\"button\" tabindex=\"-1\" data-step=\"-1\" aria-label=\"Decrease\"><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M3.5 8h9\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></button><input id=\"control\" class=\"control\" type=\"number\" inputmode=\"decimal\" part=\"input\"><button class=\"step\" type=\"button\" tabindex=\"-1\" data-step=\"1\" aria-label=\"Increase\"><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M3.5 8h9M8 3.5v9\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></button>";
	}
	connected() {
		super.connected();
		let e = { signal: this.signal };
		for (let t of this.shadowRoot.querySelectorAll(".step")) t.addEventListener("pointerdown", (e) => e.button === 0 && this.#t(Number(t.dataset.step)), e);
		for (let t of [
			"pointerup",
			"pointerleave",
			"pointercancel"
		]) this.shadowRoot.addEventListener(t, () => this.#n(), e);
		this.signal.addEventListener("abort", () => this.#n());
	}
	sync() {
		super.sync();
		let e = Number(this.value), t = this.isDisabled || this.readonly, [n, r] = this.shadowRoot.querySelectorAll(".step");
		n.disabled = t || Number.isFinite(this.min) && this.value !== "" && e <= this.min, r.disabled = t || Number.isFinite(this.max) && this.value !== "" && e >= this.max;
	}
	#t(e) {
		this.#n(), this.#r(e);
		let t = () => {
			this.#r(e), this.#e = setTimeout(t, a);
		};
		this.#e = setTimeout(t, i);
	}
	#n() {
		this.#e && (clearTimeout(this.#e), this.#e = 0, this.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	#r(e) {
		let t = this.control;
		if (this.isDisabled || this.readonly) return;
		let n = t.value;
		e > 0 ? t.stepUp() : t.stepDown(), t.value === n ? this.#n() : (this.typed(), this.dispatchEvent(new Event("input", {
			bubbles: !0,
			composed: !0
		})));
	}
};
//#endregion
//#region src/components/number-input/index.js
e("number-input", o);
//#endregion
export { o as t };
