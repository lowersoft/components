import { n as e, t } from "./core-WcEz9YgG.js";
import { n } from "./motion-CFWhFfc_.js";
import { t as r } from "./visibility--H4IXDjD.js";
import { n as i } from "./text-C4ocnqBV.js";
//#region src/components/plucked-text/plucked-text.scss?inline
var a = ":host{--_string:var(--lw-color-muted-foreground);line-height:1;display:inline-block}:host([data-grabbing]) .stage{cursor:grabbing}.live{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.stage{cursor:grab;touch-action:none;-webkit-user-select:none;user-select:none;padding:.7em .5em;display:block;position:relative}.letters{white-space:pre;display:block;position:relative}.letter{transform-origin:50% 100%;will-change:transform;display:inline-block}.probe{width:0;height:0;display:inline-block}.string,.peg{top:var(--_baseline,1.56em);pointer-events:none;position:absolute}.string{fill:none;width:calc(100% - .5em);height:1px;stroke:var(--_string);stroke-width:1.5px;stroke-linecap:round;left:.25em;overflow:visible}.ghost{opacity:.3}.peg{background:var(--_string);border-radius:50%;width:.12em;height:.12em;left:.25em;translate:-50% -50%}.peg.end{left:auto;right:.25em;translate:50% -50%}", o = 24, s = 22, c = 1500, l = .9, u = .012, d = (e, t, n = []) => {
	let r = c * t / (2 * e), i = Math.max(4, Math.min(o, Math.floor(s / r)));
	return Array.from({ length: i }, (e, i) => {
		let a = i + 1, o = 2 * Math.PI * r * a, s = (l + u * a * a) * Math.sqrt(t);
		return {
			q: n[i]?.q ?? 0,
			v: n[i]?.v ?? 0,
			omega: o,
			gamma: s,
			damped: Math.sqrt(Math.max(o * o - s * s, 1))
		};
	});
}, f = (e, t) => {
	let { q: n, v: r, omega: i, gamma: a, damped: o } = e, s = Math.exp(-a * t), c = Math.cos(o * t), l = Math.sin(o * t);
	e.q = s * (n * c + (r + a * n) / o * l), e.v = s * (r * c - (i * i * n + a * r) / o * l);
}, p = (e, t, n, r) => {
	let i = Math.min(Math.max(n, 1), t - 1);
	e.forEach((e, n) => {
		let a = n + 1;
		e.q = 2 * r * t * t / (a * a * Math.PI * Math.PI * i * (t - i)) * Math.sin(a * Math.PI * i / t), e.v = 0;
	});
}, m = (e, t, n) => Float64Array.from(e, (e, r) => Math.sin((r + 1) * Math.PI * n / t)), h = (e, t, n) => Float64Array.from(e, (e, r) => {
	let i = (r + 1) * Math.PI / t;
	return i * Math.cos(i * n);
}), g = (e, t) => {
	let n = 0;
	for (let r = 0; r < e.length; r++) n += e[r].q * t[r];
	return n;
}, _ = (e) => e.reduce((e, { q: t, v: n, omega: r }) => e + n * n + r * r * t * t, 0), v = (e, t) => t * Math.tanh(e / t), y = 6, b = .6, x = .55, S = 2400, C = .02, w = .85, T = 260, E = class extends e {
	static styles = a;
	static props = {
		text: {},
		tension: {
			type: Number,
			default: 1
		},
		noStrum: { type: Boolean }
	};
	#e = [];
	#t = [];
	#n = 0;
	#r = 0;
	#i = [];
	#a = [];
	#o = "";
	#s = 0;
	#c = 0;
	#l = !1;
	#u = !1;
	#d = null;
	#f = null;
	#p = null;
	render() {
		return "<span class=\"live\"></span><span class=\"stage\" part=\"base\"><span class=\"letters\" aria-hidden=\"true\"></span><svg class=\"string\" part=\"string\" aria-hidden=\"true\"><path class=\"ghost\"></path><path class=\"line\"></path></svg><span class=\"peg\"></span><span class=\"peg end\"></span></span>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".stage"), i = new MutationObserver(() => this.#m());
		i.observe(this, {
			childList: !0,
			subtree: !0,
			characterData: !0
		});
		let a = new ResizeObserver(() => this.#h());
		a.observe(t), document.fonts?.ready.then(() => this.isConnected && this.#h()), r(this, (e) => {
			this.#l = e, e && (!this.#u && !n.matches && this.#n && p(this.#t, this.#n, this.#n * .3, -this.#r * .5), this.#u = !0, this.#y());
		}, this.signal), t.addEventListener("pointerdown", (e) => this.#C(e), e), t.addEventListener("pointermove", (e) => this.#w(e), e), t.addEventListener("pointerup", (e) => this.#T(e), e), t.addEventListener("pointercancel", (e) => this.#T(e), e), t.addEventListener("pointerleave", () => this.#p = null, e), this.signal.addEventListener("abort", () => {
			i.disconnect(), a.disconnect(), cancelAnimationFrame(this.#s), this.#s = 0, this.#d = null, this.#f = null;
		}), this.#m();
	}
	updated(e) {
		e.has("text") ? this.#m() : e.has("tension") && this.#h();
	}
	#m() {
		if (!this.isConnected) return;
		let e = this.text ?? this.textContent.trim();
		this.query(".live").textContent = e;
		let t = i(e).map((e) => Object.assign(document.createElement("span"), {
			className: "letter",
			textContent: e
		})), n = Object.assign(document.createElement("span"), { className: "probe" });
		this.query(".letters").replaceChildren(...t, n), this.#e = t, this.#h();
	}
	#h() {
		let e = this.query(".stage"), t = this.query(".letters"), n = t.lastElementChild;
		e.style.setProperty("--_baseline", `${t.offsetTop + n.offsetTop + n.offsetHeight}px`);
		let r = this.query(".string").getBoundingClientRect(), i = r.width;
		if (this.#n = i, i < 2) {
			this.#i = [], this.#a = [];
			return;
		}
		this.#r = Number.parseFloat(getComputedStyle(e).fontSize) * b;
		let a = d(i, this.tension > 0 ? this.tension : 1, this.#t);
		this.#t = a;
		let o = Math.ceil(i / y) + 1;
		this.#i = Array.from({ length: o }, (e, t) => m(a, i, Math.min(t * y, i)));
		let s = t.getBoundingClientRect().left - r.left;
		this.#a = this.#e.map((e) => {
			let t = s + e.offsetLeft + e.offsetWidth / 2;
			return {
				shape: m(a, i, t),
				slope: h(a, i, t)
			};
		}), this.#_();
	}
	#g(e) {
		return v(g(this.#t, m(this.#t, this.#n, e)), this.#r);
	}
	#_() {
		let e = this.#t, t = this.#r, n = "";
		this.#i.forEach((r, i) => {
			let a = Math.min(i * y, this.#n);
			n += `${i === 0 ? "M" : "L"}${a.toFixed(1)} ${v(g(e, r), t).toFixed(2)}`;
		}), this.query(".ghost").setAttribute("d", this.#o || n), this.query(".line").setAttribute("d", n), this.#o = n, this.#a.forEach(({ shape: n, slope: r }, i) => {
			let a = g(e, n), o = Math.tanh(a / t), s = Math.atan(g(e, r) * (1 - o * o)) * w;
			this.#e[i].style.transform = `translate3d(0, ${v(a, t).toFixed(2)}px, 0) rotate(${s.toFixed(4)}rad)`;
		});
	}
	#v() {
		this.#t.forEach((e) => {
			e.q = 0, e.v = 0;
		});
	}
	#y() {
		this.#s || !this.#l || !this.isConnected || (this.#c = 0, this.#s = requestAnimationFrame(this.#b));
	}
	#b = (e) => {
		if (this.#s = 0, !this.#l) return;
		let t = this.#c ? Math.min((e - this.#c) / 1e3, 1 / 30) : 1 / 60;
		this.#c = e, this.#f ? this.#x(e) : this.#d || this.#t.forEach((e) => f(e, t)), this.#_(), this.#d || this.#f || _(this.#t) > C ? this.#s = requestAnimationFrame(this.#b) : (this.#v(), this.#_(), this.query(".ghost").setAttribute("d", this.query(".line").getAttribute("d")));
	};
	#x(e) {
		let { from: t, start: n } = this.#f, r = Math.min((e - n) / T, 1), i = (1 - r) ** 3;
		this.#t.forEach((e, n) => e.q = t[n] * i), !(r < 1) && (this.#f = null, this.#v());
	}
	#S(e) {
		let t = this.query(".string").getBoundingClientRect();
		return {
			x: e.clientX - t.left,
			y: e.clientY - t.top
		};
	}
	#C(e) {
		if (this.#d || e.button !== 0 || this.#n < 2) return;
		let t = this.#S(e);
		t.x < 0 || t.x > this.#n || (e.preventDefault(), e.currentTarget.setPointerCapture(e.pointerId), this.#f = null, this.#d = { id: e.pointerId }, this.toggleAttribute("data-grabbing", !0), p(this.#t, this.#n, t.x, this.#g(t.x)), this.#y());
	}
	#w(e) {
		let t = this.#S(e);
		if (this.#d?.id === e.pointerId) {
			let e = Math.min(Math.max(t.x, 0), this.#n);
			p(this.#t, this.#n, e, v(t.y, this.#r * 1.6)), this.#y();
			return;
		}
		if (this.noStrum || e.pointerType !== "mouse" || n.matches || this.#n < 2) {
			this.#p = null;
			return;
		}
		let r = e.timeStamp, i = this.#p;
		if (this.#p = {
			...t,
			t: r
		}, !i || t.x < 0 || t.x > this.#n) return;
		let a = i.y - this.#g(i.x), o = t.y - this.#g(t.x);
		if (a * o >= 0) return;
		let s = Math.max(r - i.t, 8) / 1e3, c = Math.max(-2400, Math.min(S, (t.y - i.y) / s)), l = i.x + (t.x - i.x) * (a / (a - o));
		this.#t.forEach((e, t) => {
			let n = t + 1;
			e.v += x * c * 80 / this.#n * Math.sin(n * Math.PI * l / this.#n) * Math.exp(-((n / 14) ** 2));
		}), this.#y();
	}
	#T(e) {
		this.#d?.id === e.pointerId && (this.#d = null, this.removeAttribute("data-grabbing"), n.matches && (this.#f = {
			from: Float64Array.from(this.#t, ({ q: e }) => e),
			start: performance.now()
		}), this.#y());
	}
};
//#endregion
//#region src/components/plucked-text/index.js
t("plucked-text", E);
//#endregion
export { E as t };
