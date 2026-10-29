import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./icons-HWomdoMw.js";
import { t as n } from "./icons-Dv1KN71n.js";
import { t as r } from "./toggle-TbS2nWfw.js";
import { t as i } from "./toggle-DDcGdK2q.js";
//#region src/components/checkbox/checkbox.scss?inline
var a = ":host{--_size:1rem}.visual{width:var(--_size);height:var(--_size);border:1px solid color-mix(in oklab, var(--lw-color-foreground) 30%, transparent);background:var(--lw-color-background);color:var(--lw-color-primary-foreground);border-radius:.25rem;transition:background-color .15s ease-out,border-color .15s ease-out}.toggle:hover .visual{border-color:color-mix(in oklab, var(--lw-color-foreground) 55%, transparent)}:host(:is([checked],[indeterminate])) .visual{border-color:var(--lw-color-primary);background:var(--lw-color-primary)}.visual .check,.visual .dash{display:none;position:absolute}.visual .check{width:.75rem;height:.75rem}:host([checked]:not([indeterminate])) .visual .check{display:block}.visual .dash{background:currentColor;border-radius:1px;width:.5rem;height:2px}:host([indeterminate]) .visual .dash{display:block}", o = class extends i {
	static styles = [
		t,
		r,
		a
	];
	static props = {
		...i.props,
		indeterminate: {
			type: Boolean,
			reflect: !0
		}
	};
	renderVisual() {
		return `${n}<span class="dash"></span>`;
	}
	updated(e) {
		super.updated(e), this.control.indeterminate = this.indeterminate;
	}
	changed() {
		this.indeterminate = !1;
	}
};
//#endregion
//#region src/components/checkbox/index.js
e("checkbox", o);
//#endregion
export { o as t };
