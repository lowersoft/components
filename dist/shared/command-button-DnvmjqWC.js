import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./button-CQIqPjy6.js";
//#region src/components/command-button/command-button.scss?inline
var n = ".button{gap:.75rem;padding-inline-end:calc(var(--_padding) / 2)}", r = class extends t {
	static styles = [...t.styles, n];
	static props = {
		...t.props,
		shortcut: { default: "mod+k" }
	};
};
//#endregion
//#region src/components/command-button/index.js
e("command-button", r);
//#endregion
export { r as t };
