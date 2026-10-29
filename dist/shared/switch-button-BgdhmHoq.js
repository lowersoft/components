import { r as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./button-CQIqPjy6.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { a, r as o, t as s } from "./theme-D-ctQQvB.js";
//#region src/components/switch-button/reveal.scss?inline
var c = ":root[data-lw-reveal]::view-transition-old(root){mix-blend-mode:normal;animation:none}:root[data-lw-reveal]::view-transition-new(root){mix-blend-mode:normal;animation:none}", l = ".button{gap:.5rem;line-height:1}:host([icon-only]) .labels{display:none}.icon{pointer-events:none;flex:none;width:1.15em;height:1.15em;overflow:visible}.bite{translate:10px -10px}.disc,.ray{transform-box:view-box;transform-origin:12px 12px}:host([theme=dark]) .bite{translate:0}:host([theme=dark]) .disc{scale:1.8}:host([theme=dark]) .ray{opacity:0;scale:.5}.labels{display:grid}.label{grid-area:1/1}:host([theme=dark]) .label-light,:host(:not([theme=dark])) .label-dark{opacity:0;filter:blur(3px)}@media (prefers-reduced-motion:no-preference){.bite{transition:translate .38s var(--lw-ease-in-out)}.disc{transition:scale .38s var(--lw-ease-out)}.ray{transition:scale .26s var(--lw-ease-out), opacity .26s var(--lw-ease-out);transition-delay:calc(.14s + var(--i) * 22ms)}.label{transition:opacity .24s var(--lw-ease-out), filter .24s var(--lw-ease-out)}:host([theme=dark]) .bite{transition-delay:60ms}:host([theme=dark]) .disc{transition-delay:40ms}:host([theme=dark]) .ray{transition-delay:calc(var(--i) * 18ms)}}", u = "data-lw-reveal", d = 500, f = "cubic-bezier(0.4, 0, 0.2, 1)", p = document.documentElement, m = `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><mask id="moon"><rect x="-4" y="-4" width="32" height="32" fill="white"/><circle class="bite" cx="17" cy="7" r="7.5" fill="black"/></mask><g mask="url(#moon)"><circle class="disc" cx="12" cy="12" r="4.75" fill="currentColor"/></g><g stroke="currentColor" stroke-width="2" stroke-linecap="round">${[
	0,
	45,
	90,
	135,
	180,
	225,
	270,
	315
].map((e, t) => {
	let n = e * Math.PI / 180, r = (e) => [12 + e * Math.cos(n), 12 + e * Math.sin(n)].map((e) => e.toFixed(2)), [i, a] = r(7.5), [o, s] = r(10);
	return `<line class="ray" style="--i: ${t}" x1="${i}" y1="${a}" x2="${o}" y2="${s}"/>`;
}).join("")}</g></svg>`, h = !1, g = (t, n) => {
	if (!document.startViewTransition || i.matches || h) {
		n();
		return;
	}
	let { left: r, top: a, width: o, height: s } = t.getBoundingClientRect(), l = r + o / 2, m = a + s / 2, g = Math.hypot(Math.max(l, innerWidth - l), Math.max(m, innerHeight - m));
	e(c), p.toggleAttribute(u, !0), h = !0;
	let _ = document.startViewTransition(n);
	_.ready.then(() => p.animate({ clipPath: [`circle(0 at ${l}px ${m}px)`, `circle(${g}px at ${l}px ${m}px)`] }, {
		duration: d,
		easing: f,
		pseudoElement: "::view-transition-new(root)"
	}), () => {}), _.finished.finally(() => {
		p.removeAttribute(u), h = !1;
	}).catch(() => {});
}, _ = class extends r {
	static styles = [n, l];
	static props = {
		...r.props,
		noReveal: { type: Boolean },
		lightLabel: { default: "Light" },
		darkLabel: { default: "Dark" }
	};
	render() {
		return `<button class="button" part="button">${m}<span class="labels" aria-hidden="true"><span class="label label-light"></span><span class="label label-dark"></span></span></button>`;
	}
	connected() {
		super.connected();
		let e = () => {
			let e = s();
			this.setAttribute("theme", e), this.query("button").setAttribute("aria-pressed", String(e === "dark"));
		};
		e(), a(e, this.signal);
	}
	updated(e) {
		super.updated(e), e.has("lightLabel") && (this.query(".label-light").textContent = this.lightLabel), e.has("darkLabel") && (this.query(".label-dark").textContent = this.darkLabel, this.query("button").ariaLabel = this.darkLabel);
	}
	handleClick(e) {
		super.handleClick(e);
		let t = s() === "dark" ? "light" : "dark";
		if (!this.emit("theme-change", { theme: t })) return;
		let n = () => o(t);
		this.noReveal ? n() : g(this.query("button"), n);
	}
};
//#endregion
//#region src/components/switch-button/index.js
t("switch-button", _);
//#endregion
export { _ as t };
