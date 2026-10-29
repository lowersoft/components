import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./icons-HWomdoMw.js";
import { a as r, i, n as a, r as o } from "./theme-D-ctQQvB.js";
//#region src/components/theme-toggle-button/theme-toggle-button.scss?inline
var s = ":host{--_size:2rem;vertical-align:middle;display:inline-flex}:host([size=sm]){--_size:1.75rem}:host([size=lg]){--_size:2.25rem}.track{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-full);background:var(--lw-color-muted);padding:.1875rem;display:inline-flex;position:relative}.thumb{width:var(--_size);height:var(--_size);border-radius:var(--lw-radius-full);background:var(--lw-color-background);box-shadow:var(--lw-shadow-sm);position:absolute;top:.1875rem;left:.1875rem}@media (prefers-reduced-motion:no-preference){.thumb{transition:translate .3s var(--lw-ease-spring)}}:host([value=system]) .thumb{translate:100%}:host([value=dark]) .thumb{translate:200%}.option{width:var(--_size);height:var(--_size);border-radius:var(--lw-radius-full);color:var(--lw-color-muted-foreground);cursor:pointer;transition:color var(--lw-duration-fast) var(--lw-ease-out);background:0 0;border:0;justify-content:center;align-items:center;padding:0;display:inline-flex;position:relative}.option:hover,.option[aria-checked=true]{color:var(--lw-color-foreground)}.option:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.screen{fill:none;transition:fill var(--lw-duration-normal) var(--lw-ease-out)}:host([system=dark]) .screen{fill:currentColor}", c = (e) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, l = [
	{
		value: "light",
		label: "lightLabel",
		icon: c("<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\"/>")
	},
	{
		value: "system",
		label: "systemLabel",
		icon: c("<rect class=\"screen\" x=\"2\" y=\"3\" width=\"20\" height=\"14\" rx=\"2\"/><path d=\"M8 21h8M12 17v4\"/>")
	},
	{
		value: "dark",
		label: "darkLabel",
		icon: c("<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\"/>")
	}
], u = class extends e {
	static styles = [n, s];
	static props = {
		value: {
			default: "system",
			reflect: !0
		},
		size: {
			default: "md",
			reflect: !0
		},
		label: { default: "Theme" },
		lightLabel: { default: "Light" },
		systemLabel: { default: "System" },
		darkLabel: { default: "Dark" }
	};
	render() {
		return `<div class="track" part="track" role="radiogroup"><span class="thumb" aria-hidden="true"></span>${l.map(({ value: e, icon: t }) => `<button class="option" type="button" role="radio" data-value="${e}">${t}</button>`).join("")}</div>`;
	}
	connected() {
		let e = this.query(".track"), t = { signal: this.signal };
		e.addEventListener("click", (e) => this.#t(e.target.closest(".option")?.dataset.value), t), e.addEventListener("keydown", this.#n, t);
		let n = () => {
			this.value = i(), this.setAttribute("system", a.matches ? "dark" : "light");
		};
		n(), r(n, this.signal);
	}
	updated(e) {
		let t = this.#e;
		e.has("label") && (this.query(".track").ariaLabel = this.label);
		for (let [n, { value: r, label: i }] of l.entries()) {
			let a = t[n];
			if (e.has(i) && (a.ariaLabel = this[i], a.title = this[i]), e.has("value")) {
				let e = r === this.value;
				a.ariaChecked = String(e), a.tabIndex = e ? 0 : -1;
			}
		}
	}
	get #e() {
		return [...this.shadowRoot.querySelectorAll(".option")];
	}
	#t(e, t = !1) {
		e && (e !== this.value && this.emit("change", { value: e }) && (this.value = e, o(e)), t && this.#e.find((e) => e.dataset.value === this.value)?.focus());
	}
	#n = (e) => {
		let t = l.findIndex((e) => e.value === this.value), n = l.length - 1, r = {
			ArrowRight: t + 1,
			ArrowDown: t + 1,
			ArrowLeft: t - 1,
			ArrowUp: t - 1,
			Home: 0,
			End: n
		};
		if (!(e.key in r)) return;
		e.preventDefault();
		let i = (r[e.key] + l.length) % l.length;
		this.#t(l[i].value, !0);
	};
};
//#endregion
//#region src/components/theme-toggle-button/index.js
t("theme-toggle-button", u);
//#endregion
export { u as t };
