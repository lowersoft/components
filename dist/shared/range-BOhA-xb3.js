import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./field-DZ1QAD5P.js";
import { t as n } from "./field-_etHxN_N.js";
//#region src/components/range/range.scss?inline
var r = ":host{--_track:.375rem;--_thumb:1.125rem}.field{cursor:default;background:0 0;border:0;grid-template-columns:1fr auto;align-items:center;gap:.75rem;padding:0;display:grid}.field:hover,.field:focus-within,:host([data-invalid]) .field,:host([data-invalid]) .field:focus-within{box-shadow:none;border:0}:host([data-disabled]) .field{background:0 0}.value{font-variant-numeric:tabular-nums;text-align:right;min-width:2.5rem;font-weight:500}.control{width:100%;height:var(--_thumb);cursor:pointer;appearance:none;background:0 0;margin:0}.control:disabled{cursor:not-allowed}.control::-webkit-slider-runnable-track{height:var(--_track);border-radius:var(--lw-radius-full);background:linear-gradient(to right, var(--lw-color-primary) var(--_fill), var(--lw-color-muted) var(--_fill))}.control::-moz-range-track{height:var(--_track);border-radius:var(--lw-radius-full);background:var(--lw-color-muted)}.control::-moz-range-progress{height:var(--_track);border-radius:var(--lw-radius-full);background:var(--lw-color-primary)}.control::-webkit-slider-thumb{width:var(--_thumb);height:var(--_thumb);margin-top:calc((var(--_track) - var(--_thumb)) / 2);border:2px solid var(--lw-color-primary);background:var(--lw-color-background);appearance:none;border-radius:50%;transition:scale .15s ease-out;box-shadow:0 1px 3px #00000026}.control::-moz-range-thumb{width:var(--_thumb);height:var(--_thumb);box-sizing:border-box;border:2px solid var(--lw-color-primary);background:var(--lw-color-background);border-radius:50%;box-shadow:0 1px 3px #00000026}.control:active::-webkit-slider-thumb{scale:1.12}.control:focus-visible::-webkit-slider-thumb{outline:2px solid var(--lw-color-ring);outline-offset:2px}.control:focus-visible::-moz-range-thumb{outline:2px solid var(--lw-color-ring);outline-offset:2px}", i = class extends n {
	static styles = [t, r];
	static props = {
		...n.props,
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 100
		},
		step: { type: Number },
		unit: { default: "" }
	};
	static nativeAttributes = [
		"min",
		"max",
		"step"
	];
	renderControl() {
		return "<input id=\"control\" class=\"control\" type=\"range\" part=\"range\"><output class=\"value\" for=\"control\" part=\"value\"></output>";
	}
	updated(e) {
		super.updated(e), this.value ||= this.control.value;
	}
	sync() {
		super.sync();
		let e = this.control, t = Number(e.min || 0), n = Number(e.max || 100), r = Number(e.value);
		e.style.setProperty("--_fill", `${n > t ? (r - t) / (n - t) * 100 : 0}%`);
		let i = this.formatValue ? this.formatValue(r) : `${r.toLocaleString()}${this.unit ?? ""}`;
		this.query(".value").textContent = i, e.ariaValueText = i;
	}
};
//#endregion
//#region src/components/range/index.js
e("range", i);
//#endregion
export { i as t };
