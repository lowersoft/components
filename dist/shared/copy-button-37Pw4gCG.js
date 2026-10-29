import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./icons-HWomdoMw.js";
import { t as n } from "./icons-Dv1KN71n.js";
import { n as r, t as i } from "./button-CQIqPjy6.js";
import { n as a } from "./motion-CFWhFfc_.js";
import { t as o } from "./clipboard-BCkfa02P.js";
//#region src/components/copy-button/copy-button.scss?inline
var s = ".button{justify-content:space-between;gap:.75rem}.value{font-family:var(--lw-font-mono);white-space:pre;text-overflow:ellipsis;min-width:0;font-size:.95em;font-weight:400;position:relative;overflow:hidden}.sweep{border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--_fg) 18%, transparent);opacity:0;pointer-events:none;position:absolute;inset:-.125rem -.25rem}.glyph{flex:none;display:grid}.glyph .icon{grid-area:1/1}@media (prefers-reduced-motion:no-preference){.glyph .icon{transition:opacity var(--lw-duration-fast) var(--lw-ease-out), scale var(--lw-duration-normal) var(--lw-ease-spring)}}.glyph .check,:host([copied]) .glyph .copy{opacity:0;scale:.6}:host([copied]) .glyph .check{opacity:1;scale:1}.live{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", c = "<svg class=\"icon copy\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>", l = 4, u = "•", d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", f = 450, p = [
	{
		clipPath: "inset(0 100% 0 0)",
		opacity: 1
	},
	{
		clipPath: "inset(0 0 0 0)",
		opacity: 1,
		offset: .4
	},
	{
		clipPath: "inset(0 0 0 0)",
		opacity: 0
	}
], m = 800, h = () => d[Math.floor(Math.random() * 62)], g = class extends i {
	static styles = [
		r,
		t,
		s
	];
	static props = {
		...i.props,
		value: { default: "" },
		secret: { type: Boolean },
		label: { default: "Copy" },
		copiedLabel: { default: "Copied" },
		resetAfter: {
			type: Number,
			default: 1600
		},
		copied: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = !1;
	#t = !1;
	#n = 0;
	#r = 0;
	render() {
		return `<button class="button" part="button" type="button"><span class="value"><span class="sweep"></span><span class="text"></span></span><span class="glyph">${c}${n}</span></button><span class="live" aria-live="polite"></span>`;
	}
	connected() {
		super.connected();
		let e = this.query(".button"), t = { signal: this.signal }, n = (e) => () => this.#l(e);
		e.addEventListener("pointerenter", n(!0), t), e.addEventListener("pointerleave", () => e.matches(":focus-visible") || this.#l(!1), t), e.addEventListener("focus", n(!0), t), e.addEventListener("blur", () => this.#t || this.#l(!1), t), e.addEventListener("keydown", this.#i, t), this.signal.addEventListener("abort", () => {
			cancelAnimationFrame(this.#n), clearTimeout(this.#r);
		});
	}
	updated(e) {
		super.updated(e), (e.has("value") || e.has("secret")) && this.#c(), [
			"value",
			"secret",
			"label"
		].some((t) => e.has(t)) && (this.query(".button").ariaLabel = this.secret || !this.value ? this.label : `${this.label}: ${this.value}`);
	}
	handleClick() {
		this.#a();
	}
	#i = (e) => {
		!e.metaKey && !e.ctrlKey || e.key.toLowerCase() !== "c" || getSelection()?.toString() || (e.preventDefault(), this.#a());
	};
	async #a() {
		this.#t = !0;
		try {
			await o(this.value);
		} catch (e) {
			this.emit("error", { error: e });
			return;
		} finally {
			this.#t = !1;
		}
		this.copied = !0, this.query(".live").textContent = this.copiedLabel, this.emit("copy", { value: this.value }), this.#o(), clearTimeout(this.#r), this.#r = setTimeout(() => {
			this.copied = !1, this.query(".live").textContent = "";
		}, this.resetAfter);
	}
	#o() {
		if (a.matches) return;
		let e = this.query(".sweep");
		e.getAnimations().forEach((e) => e.cancel()), e.animate(p, {
			duration: m,
			easing: "ease-out"
		});
		for (let e of this.query(".check path").getAnimations()) e.cancel(), e.play();
	}
	get #s() {
		let e = this.value.length;
		return e > 10 ? [l, e - l] : [0, e];
	}
	#c(e) {
		let [t, n] = this.#s, r = this.secret && !this.#e;
		this.query(".text").textContent = e ?? (r ? this.value.slice(0, t) + u.repeat(n - t) + this.value.slice(n) : this.value);
	}
	#l(e) {
		if (!this.secret || e === this.#e) return;
		if (this.#e = e, cancelAnimationFrame(this.#n), !e || a.matches) return this.#c();
		let [t, n] = this.#s, r = performance.now(), i = (e) => {
			let a = Math.min((e - r) / f, 1), o = t + Math.floor((n - t) * a), s = [...this.value].map((e, t) => t < o || t >= n ? e : h());
			this.#c(s.join("")), a < 1 && (this.#n = requestAnimationFrame(i));
		};
		this.#n = requestAnimationFrame(i);
	}
};
//#endregion
//#region src/components/copy-button/index.js
e("copy-button", g);
//#endregion
export { g as t };
