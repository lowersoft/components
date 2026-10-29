import { t as e } from "./core-WcEz9YgG.js";
import { n as t, t as n } from "./button-CQIqPjy6.js";
//#region src/components/slide-text-button/slide-text-button.scss?inline
var r = ":host([animate-in]){transition:opacity .2s var(--lw-ease-out)}@starting-style{:host([animate-in]){opacity:0}}@media (prefers-reduced-motion:no-preference){:host([animate-in]){transition:opacity .2s var(--lw-ease-out), translate .2s var(--lw-ease-out)}@starting-style{:host([animate-in]){translate:.5rem}}}.button{text-decoration:none;overflow:hidden}.track{justify-items:center;display:grid}@media (prefers-reduced-motion:no-preference){.track{transition:translate .2s var(--lw-ease-in-out)}}.text{transition:opacity .2s var(--lw-ease-in-out);grid-area:1/1}.hover{opacity:0;translate:0 100%}.button:is(:hover,:focus-visible) .track{translate:0 -100%}.button:is(:hover,:focus-visible) .text{opacity:0}.button:is(:hover,:focus-visible) .hover{opacity:1}", i = (e, t, n) => n == null ? e.removeAttribute(t) : e.setAttribute(t, n), a = class extends n {
	static styles = [t, r];
	static props = {
		...n.props,
		hoverText: {},
		href: {},
		target: {},
		animateIn: {
			type: Boolean,
			reflect: !0
		}
	};
	render() {
		let e = this.href == null ? "button" : "a";
		return `<${e} class="button" part="button"><slot name="start"></slot><span class="track"><span class="text"><slot></slot></span><span class="text hover" aria-hidden="true"></span></span><slot name="end"></slot></${e}>`;
	}
	connected() {
		super.connected(), this.query("slot:not([name])").addEventListener("slotchange", () => this.#e(), { signal: this.signal });
	}
	updated(e) {
		super.updated(e), e.has("hoverText") && this.#e();
		let t = this.query("a");
		t && (e.has("href") && i(t, "href", this.href), e.has("target") && i(t, "target", this.target), e.has("disabled") && (i(t, "aria-disabled", this.disabled ? "true" : null), i(t, "tabindex", this.disabled ? "-1" : null)));
	}
	#e() {
		let e = this.query("slot:not([name])").assignedNodes().map((e) => e.textContent).join("");
		this.query(".hover").textContent = this.hoverText ?? e.trim();
	}
};
//#endregion
//#region src/components/slide-text-button/index.js
e("slide-text-button", a);
//#endregion
export { a as t };
