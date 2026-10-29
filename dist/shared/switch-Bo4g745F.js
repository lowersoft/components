import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./toggle-TbS2nWfw.js";
import { t as n } from "./toggle-DDcGdK2q.js";
//#region src/components/switch/switch.scss?inline
var r = ":host{--_width:2.25rem;--_size:1.25rem;--_gap:2px}:host([size=sm]){--_width:1.75rem;--_size:1rem}.visual{width:var(--_width);height:var(--_size);border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-foreground) 18%, transparent);place-items:center start;transition:background-color .2s ease-out}:host([checked]) .visual{background:var(--lw-color-primary)}.thumb{width:calc(var(--_size) - var(--_gap) * 2);height:calc(var(--_size) - var(--_gap) * 2);margin-left:var(--_gap);background:var(--lw-color-background);border-radius:50%;box-shadow:0 1px 2px #0003}@media (prefers-reduced-motion:no-preference){.thumb{transition:translate .22s var(--lw-ease-spring), scale .15s ease-out}}:host([checked]) .thumb{translate:calc(var(--_width) - var(--_size)) 0}.toggle:active .thumb{scale:.9}", i = class extends n {
	static styles = [t, r];
	static role = "switch";
	static props = {
		...n.props,
		size: {
			default: "md",
			reflect: !0
		}
	};
	renderVisual() {
		return "<span class=\"thumb\"></span>";
	}
};
//#endregion
//#region src/components/switch/index.js
e("switch", i);
//#endregion
export { i as t };
