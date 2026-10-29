import { n as e, t } from "./core-WcEz9YgG.js";
import { n } from "./motion-CFWhFfc_.js";
import { t as r } from "./visibility--H4IXDjD.js";
//#region src/components/glitch-text/glitch-text.scss?inline
var i = ":host{--_accent:var(--lw-glitch-accent,#f92434);--_echo:var(--lw-glitch-echo,#00cfe0);display:inline-block}@supports (color:lab(0% 0 0)){:host{--_accent:var(--lw-glitch-accent,lab(54.625% 76.1472 49.2233));--_echo:var(--lw-glitch-echo,lab(75.6843% -41.2868 -21.9984))}}.live{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.stage{display:inline-grid}.stage>*{grid-area:1/1}.channel,.band{opacity:0;pointer-events:none;-webkit-user-select:none;user-select:none}.accent{color:var(--_accent)}.echo{color:var(--_echo)}", a = {
	subtle: {
		bands: 3,
		shift: .05,
		split: 1,
		frames: 5,
		frame: 55
	},
	medium: {
		bands: 4,
		shift: .12,
		split: 2,
		frames: 6,
		frame: 55
	},
	strong: {
		bands: 5,
		shift: .18,
		split: 3,
		frames: 7,
		frame: 50
	}
}, o = Math.max(...Object.values(a).map(({ bands: e }) => e)), s = .3, c = 1200, l = 4e3, u = 9e3, d = "steps(1, end)", f = "inset(0 -25% 0 -25%)", p = (e, t) => e + Math.random() * (t - e), m = (e) => p(-e, e), h = (e) => {
	let t = [
		-50,
		...Array.from({ length: e - 1 }, () => p(8, 92)).sort((e, t) => e - t),
		150
	];
	return Array.from({ length: e }, (e, n) => `inset(${t[n]}% -25% ${100 - t[n + 1]}% -25%)`);
}, g = class extends e {
	static styles = i;
	static props = {
		text: {},
		trigger: { default: "idle" },
		intensity: { default: "medium" }
	};
	#e = null;
	#t = !1;
	#n = 0;
	#r = null;
	render() {
		return `<span class="live"></span><span class="stage" part="text" aria-hidden="true"><span class="base"></span><span class="channel accent"></span><span class="channel echo"></span>${"<span class=\"band\"></span>".repeat(o)}</span>`;
	}
	connected() {
		let e = { signal: this.signal }, t = new MutationObserver(() => this.#a());
		t.observe(this, {
			childList: !0,
			subtree: !0,
			characterData: !0
		}), r(this, (e) => {
			e !== this.#t && (this.#t = e, this.#o(c));
		}, this.signal), this.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && this.#i(), e), this.addEventListener("pointerdown", (e) => e.pointerType !== "mouse" && this.#i(), e), this.signal.addEventListener("abort", () => {
			t.disconnect(), clearTimeout(this.#n), this.#c();
		}), this.#a();
	}
	updated(e) {
		e.has("text") && this.#a(), e.has("trigger") && this.#o(c);
	}
	glitch() {
		!this.#r && this.#e !== null && this.#l(this.#e, this.#e);
	}
	#i() {
		this.trigger === "hover" && this.glitch();
	}
	#a() {
		if (!this.isConnected) return;
		let e = this.text ?? this.textContent.trim();
		if (e === this.#e) return;
		let t = this.#e;
		this.#e = e, this.query(".live").textContent = e, this.query(".base").textContent = e, t === null || !this.#t ? this.#s(e) : this.#l(t, e);
	}
	#o(e) {
		clearTimeout(this.#n), this.trigger === "idle" && this.#t && (this.#n = setTimeout(() => {
			this.glitch(), this.#o(p(l, u));
		}, e));
	}
	#s(e) {
		this.shadowRoot.querySelectorAll(".channel, .band").forEach((t) => t.textContent = e);
	}
	#c() {
		this.#r && (clearTimeout(this.#r.swap), this.#r.animations.forEach((e) => e.cancel()), this.#r = null, this.#s(this.#e));
	}
	#l(e, t) {
		if (this.#c(), !this.isConnected || n.matches) {
			this.#s(t);
			return;
		}
		let { bands: r, shift: i, split: o, frames: c, frame: l } = a[this.intensity] ?? a.medium, u = c * l, g = Array.from({ length: c }, (e, t) => t > 0 && Math.random() < s ? null : h(r)), _ = {
			duration: u,
			easing: "linear"
		}, v = {
			opacity: 0,
			transform: "none",
			clipPath: f
		}, y = [...this.shadowRoot.querySelectorAll(".band")].slice(0, r).map((e, t) => {
			let n = g.map((e) => e ? {
				opacity: 1,
				transform: `translateX(${m(i)}em)`,
				clipPath: e[t],
				easing: d
			} : {
				opacity: +(t === 0),
				transform: "none",
				clipPath: f,
				easing: d
			});
			return e.animate([...n, v], _);
		}), b = [...this.shadowRoot.querySelectorAll(".channel")].map((e, t) => {
			let n = t === 0 ? -1 : 1, r = g.map((e) => ({
				opacity: e ? .85 : 0,
				transform: `translateX(${n * o * p(.5, 1.5)}px)`,
				easing: d
			}));
			return e.animate([...r, {
				opacity: 0,
				transform: "none"
			}], _);
		}), x = this.query(".base").animate({ opacity: [0, 0] }, _), S = {
			animations: [
				x,
				...b,
				...y
			],
			swap: 0
		};
		this.#s(e), e !== t && (S.swap = setTimeout(() => this.#s(t), Math.floor(c / 2) * l)), x.onfinish = () => {
			this.#r === S && (this.#r = null, this.#s(this.#e));
		}, this.#r = S;
	}
};
//#endregion
//#region src/components/glitch-text/index.js
t("glitch-text", g);
//#endregion
export { g as t };
