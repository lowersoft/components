import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./field-DZ1QAD5P.js";
import { t as n } from "./field-_etHxN_N.js";
//#region src/components/text-input/text-input.scss?inline
var r = ":host{--_height:2.5rem}:host([size=sm]){--_height:2rem;--_padding:.625rem;--_text:var(--lw-text-xs)}:host([size=lg]){--_height:2.875rem;--_padding:.875rem;--_text:var(--lw-text-md)}.field{height:var(--_height);padding:0 var(--_padding);align-items:center;gap:.5rem;display:flex}.control{flex:1;height:100%}.control::-webkit-search-cancel-button{appearance:none}slot{color:var(--lw-color-muted-foreground);flex:none;align-items:center;display:none}slot[data-filled]{display:flex}::slotted(svg){width:1rem;height:1rem}", i = /* @__PURE__ */ new Set([
	"text",
	"email",
	"url",
	"search",
	"tel",
	"password"
]), a = class extends n {
	static styles = [t, r];
	static props = {
		...n.props,
		type: { default: "text" },
		pattern: {},
		inputmode: {},
		size: {
			default: "md",
			reflect: !0
		}
	};
	static nativeAttributes = [
		...n.nativeAttributes,
		"pattern",
		"inputmode"
	];
	renderControl() {
		return "<slot name=\"start\"></slot><input id=\"control\" class=\"control\" part=\"input\"><slot name=\"end\"></slot>";
	}
	connected() {
		super.connected();
		for (let e of ["start", "end"]) {
			let t = this.query(`slot[name="${e}"]`);
			t.addEventListener("slotchange", () => t.toggleAttribute("data-filled", t.assignedNodes().length > 0), { signal: this.signal });
		}
	}
	updated(e) {
		e.has("type") && (this.control.type = i.has(this.type) ? this.type : "text"), super.updated(e);
	}
};
//#endregion
//#region src/components/text-input/index.js
e("text-input", a);
//#endregion
export { a as t };
