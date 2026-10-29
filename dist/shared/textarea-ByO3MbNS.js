import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./field-DZ1QAD5P.js";
import { t as n } from "./field-_etHxN_N.js";
//#region src/components/textarea/textarea.scss?inline
var r = ".field{padding:0;display:flex}.control{padding:.5rem var(--_padding);resize:vertical;scrollbar-width:thin;flex:1;line-height:1.5}:host([resize=none]) .control,:host([autosize]) .control{resize:none}", i = class extends n {
	static styles = [t, r];
	static props = {
		...n.props,
		rows: {
			type: Number,
			default: 3
		},
		autosize: {
			type: Boolean,
			reflect: !0
		},
		maxRows: {
			type: Number,
			default: 8
		},
		resize: {
			default: "vertical",
			reflect: !0
		}
	};
	renderControl() {
		return "<textarea id=\"control\" class=\"control\" part=\"textarea\"></textarea>";
	}
	connected() {
		super.connected(), this.control.addEventListener("keydown", (e) => {
			e.key === "Enter" && (e.ctrlKey || e.metaKey) && this.form && (e.preventDefault(), this.form.requestSubmit());
		}, { signal: this.signal });
	}
	updated(e) {
		super.updated(e), this.control.rows = Math.max(1, this.rows || 1), this.#e();
	}
	typed() {
		super.typed(), this.#e();
	}
	#e() {
		let e = this.control;
		if (!this.autosize) {
			e.style.height = "";
			return;
		}
		let t = getComputedStyle(e), n = Number.parseFloat(t.lineHeight), r = Number.parseFloat(t.paddingTop) + Number.parseFloat(t.paddingBottom), i = n * Math.max(1, this.rows || 1) + r, a = n * Math.max(this.rows || 1, this.maxRows || 1) + r;
		e.style.height = "auto";
		let o = Math.min(Math.max(e.scrollHeight, i), a);
		e.style.height = `${o}px`, e.style.overflowY = e.scrollHeight > a ? "auto" : "hidden";
	}
};
//#endregion
//#region src/components/textarea/index.js
e("textarea", i);
//#endregion
export { i as t };
