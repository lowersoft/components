import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./button-CQIqPjy6.js";
import { a as n } from "./motion-CFWhFfc_.js";
//#region src/components/push-button/push-button.scss?inline
var r = ":host{--_depth:4px;--_base:oklch(from var(--_bg) calc(l - .15) c h);padding-top:var(--_depth)}:host(:is([variant=outline],[variant=ghost])){--_base:var(--lw-color-border)}:host([size=sm]){--_depth:3px}:host([size=lg]){--_depth:5px}.button{box-shadow:0 var(--_depth) 0 0 var(--_base);translate:0 calc(var(--_depth) * -1);font-weight:600}@media (prefers-reduced-motion:no-preference){.button{transition:background-color var(--lw-duration-fast) var(--lw-ease-out), translate .12s var(--lw-ease-spring), box-shadow .12s var(--lw-ease-spring)}}.button:hover{box-shadow:0 calc(var(--_depth) + 1px) 0 0 var(--_base);translate:0 calc(var(--_depth) * -1 - 1px)}.button:active,.button[data-pressed]{box-shadow:0 0 0 0 var(--_base);transition-duration:60ms;transform:translate(0,0)}", i = /* @__PURE__ */ new Set(["Enter", " "]), a = class extends t {
	static styles = [...t.styles, r];
	connected() {
		super.connected();
		let e = this.query(".button"), t = { signal: this.signal }, r = () => e.removeAttribute("data-pressed");
		e.addEventListener("pointerdown", () => n(8), t), e.addEventListener("keydown", (t) => {
			i.has(t.key) && !t.repeat && (e.setAttribute("data-pressed", ""), n(8));
		}, t), e.addEventListener("keyup", (e) => i.has(e.key) && r(), t), e.addEventListener("blur", r, t);
	}
};
//#endregion
//#region src/components/push-button/index.js
e("push-button", a);
//#endregion
export { a as t };
