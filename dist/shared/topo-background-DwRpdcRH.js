import { n as e, t } from "./core-WcEz9YgG.js";
import { n } from "./motion-CFWhFfc_.js";
import { a as r } from "./theme-D-ctQQvB.js";
import { t as i } from "./visibility--H4IXDjD.js";
import { t as a } from "./canvas-zoeWnk3A.js";
import { t as o } from "./noise-BjLE81N6.js";
var s = 5, c = 210, l = 500, u = 20, d = .16, f = Math.PI / 3, p = "500 10px ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", sans-serif", m = (e, t, { x0: n, y0: r, x1: i, y1: a }, { top: o, right: s, bottom: c, left: l }) => {
	let u = (t, n, r, i) => {
		e.moveTo(t, n), e.lineTo(r, i);
	};
	switch (t) {
		case 1:
		case 14:
			u(n, l, c, a);
			break;
		case 2:
		case 13:
			u(c, a, i, s);
			break;
		case 3:
		case 12:
			u(n, l, i, s);
			break;
		case 4:
		case 11:
			u(o, r, i, s);
			break;
		case 6:
		case 9:
			u(o, r, c, a);
			break;
		case 7:
		case 8:
			u(n, l, o, r);
			break;
		case 5:
			u(n, l, o, r), u(c, a, i, s);
			break;
		case 10: u(o, r, i, s), u(n, l, c, a);
	}
}, h = (e, t) => {
	let { x: n, y: r } = t;
	if (r < e.height * d || r > e.height * .84 || n < 24 || n > e.width - 24 || e.avoid.some((e) => n > e.x0 && n < e.x1 && r > e.y0 && r < e.y1)) return;
	let i = Math.floor(r / c), a = n + e.drift + i % 2 * (c / 2), o = Math.floor(a / c), s = (a - (o + .5) * c) ** 2 + (r - (i + .5) * c) ** 2;
	if (s > (c * .32) ** 2) return;
	let l = i * 1e5 + o, u = e.best.get(l);
	(!u || s < u.score) && e.best.set(l, {
		...t,
		score: s
	});
}, g = (e, [t, n, r, i], a, o, s, c) => {
	let l = n - t + r - i, u = i - t + r - n, d = l / 24, p = u / 24, m = d * d + p * p, g = m > 0 ? (c - (t + n + r + i) / 4) / m : 0, _ = Math.max(-6, Math.min(6, g * d)), v = Math.max(-6, Math.min(6, g * p)), y = Math.atan2(l, -u);
	y > Math.PI / 2 ? y -= Math.PI : y < -Math.PI / 2 && (y += Math.PI), !(Math.abs(y) > f) && h(e, {
		x: a + 6 + _,
		y: o + 6 + v,
		angle: y,
		level: s
	});
}, _ = (e, t, n, r, i, a, o) => {
	for (let c = 0; c < n - 1; c++) for (let n = 0; n < t - 1; n++) {
		let l = e[c * t + n], u = e[c * t + n + 1], d = e[(c + 1) * t + n + 1], f = e[(c + 1) * t + n], p = Math.ceil(Math.min(l, u, d, f) / r), h = Math.floor(Math.max(l, u, d, f) / r);
		if (p > h) continue;
		let _ = n * 12, v = c * 12, y = {
			x0: _,
			y0: v,
			x1: _ + 12,
			y1: v + 12
		};
		for (let e = p; e <= h; e++) {
			let t = e * r, n = (l > t ? 8 : 0) | (u > t ? 4 : 0) | (d > t ? 2 : 0) | f > t;
			if (n === 0 || n === 15) continue;
			let c = e % s === 0;
			m(c ? a : i, n, y, {
				top: _ + 12 * ((t - l) / (u - l)),
				right: v + 12 * ((t - u) / (d - u)),
				bottom: _ + 12 * ((t - f) / (d - f)),
				left: v + 12 * ((t - l) / (f - l))
			}), c && o && n !== 5 && n !== 10 && g(o, [
				l,
				u,
				d,
				f
			], _, v, e, t);
		}
	}
}, v = (e, t) => {
	e.font = p, e.textAlign = "center", e.textBaseline = "middle";
	for (let n of t) {
		let t = String(l + n.level * u), r = e.measureText(t).width + 8;
		e.save(), e.translate(Math.round(n.x), Math.round(n.y)), e.rotate(n.angle), e.globalCompositeOperation = "destination-out", e.globalAlpha = 1, e.fillRect(-r / 2, -6, r, 12), e.globalCompositeOperation = "source-over", e.globalAlpha = .5, e.fillText(t, 0, .5), e.restore();
	}
}, y = ":host{box-sizing:border-box;background:var(--lw-color-background);width:100%;min-height:560px;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);justify-content:center;align-items:center;display:flex;position:relative;overflow:hidden}.copy{text-align:center;flex-direction:column;align-items:center;gap:1rem;max-width:36rem;padding:0 1.5rem;display:flex;position:relative}.title{letter-spacing:-.025em;text-wrap:balance;margin:0;font-size:clamp(2.25rem,5vw,3rem);font-weight:600;line-height:1.1}.description{max-width:24rem;font-size:var(--lw-text-md);text-wrap:pretty;color:var(--lw-color-muted-foreground);margin:0;line-height:1.5}.layer{pointer-events:none;position:absolute;inset:0}canvas{width:100%;height:100%;display:block;-webkit-mask-image:linear-gradient(#0000,#000 18% 82%,#0000);mask-image:linear-gradient(#0000,#000 18% 82%,#0000)}@media (prefers-reduced-motion:no-preference){canvas{animation:.5s ease-out lw-fade-in}}@keyframes lw-fade-in{0%{opacity:0}}", b = 360, x = 6, S = .5, C = 1800, w = .24, T = .2, E = 96, D = 4, O = 33, k = 16, A = 12, j = "a, button, input, textarea", M = class extends e {
	static styles = y;
	static props = {
		heading: { default: "Find your footing" },
		description: { default: "A living contour map. Move the cursor to raise a hill, click to send a ripple across it." },
		interval: {
			type: Number,
			default: .07
		},
		speed: {
			type: Number,
			default: 1
		},
		seed: {
			type: Number,
			default: 26
		},
		plain: { type: Boolean },
		still: { type: Boolean }
	};
	#e = null;
	#t = null;
	#n = 0;
	#r = 0;
	#i = 0;
	#a = 0;
	#o = /* @__PURE__ */ new Float32Array();
	#s = "";
	#c = {
		x: 0,
		y: 0,
		targetX: 0,
		targetY: 0,
		amount: 0,
		on: !1
	};
	#l = [];
	#u = {
		drift: 0,
		width: 0,
		height: 0,
		best: /* @__PURE__ */ new Map(),
		avoid: []
	};
	#d = 0;
	#f = 0;
	#p = 0;
	#m = 0;
	#h = !1;
	render() {
		return "<div class=\"layer\" aria-hidden=\"true\"><canvas></canvas></div><slot><div class=\"copy\"><h1 class=\"title\"></h1><p class=\"description\"></p></div></slot>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query("canvas");
		this.#e = t.getContext("2d");
		let n = new ResizeObserver(() => this.#_());
		n.observe(t), this.signal.addEventListener("abort", () => {
			n.disconnect(), cancelAnimationFrame(this.#m), this.#m = 0;
		}), i(this, (e) => {
			this.#h = e, this.#x();
		}, this.signal), r(() => {
			this.#s = getComputedStyle(t).color, this.#b(performance.now());
		}, this.signal), this.query("slot").addEventListener("slotchange", () => this.#v(), e), this.addEventListener("pointermove", (e) => this.#T(e), e), this.addEventListener("pointerleave", () => {
			this.#c.on = !1, this.#x();
		}, e), this.addEventListener("pointerdown", (e) => this.#E(e), e);
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", e.has("seed") && (this.#t = o(this.seed)), this.#v(), this.#b(performance.now()), this.#x();
	}
	get #g() {
		return !this.still && !n.matches;
	}
	#_() {
		let e = this.query("canvas");
		({width: this.#n, height: this.#r} = a(e, this.#e)), this.#i = Math.ceil(this.#n / 12) + 1, this.#a = Math.ceil(this.#r / 12) + 1, this.#o = new Float32Array(this.#i * this.#a), this.#s = getComputedStyle(e).color, this.#v(), this.#b(performance.now());
	}
	#v() {
		let e = this.query("canvas").getBoundingClientRect();
		this.#u.avoid = this.query("slot").assignedElements({ flatten: !0 }).map((e) => e.getBoundingClientRect()).map((t) => ({
			x0: t.left - e.left - k,
			y0: t.top - e.top - A,
			x1: t.right - e.left + k,
			y1: t.bottom - e.top + A
		}));
	}
	#y(e) {
		let t = this.#i, n = this.#d * .05, r = this.#d * x, i = this.#c, a = i.amount > .001;
		for (let o = 0; o < this.#a; o++) {
			let s = o * 12;
			for (let c = 0; c < t; c++) {
				let l = c * 12, u = (l + r) / b, d = s / b, f = this.#t(u, d, n) * .78 + this.#t(u * 2.3 + 17.1, d * 2.3 + 4.7, n * 1.4) * .22;
				if (a) {
					let e = l - i.x, t = s - i.y;
					f += S * i.amount * Math.exp(-(e * e + t * t) / 28800);
				}
				for (let t of this.#l) {
					let n = e - t.start, r = Math.hypot(l - t.x, s - t.y) - n * w, i = 1 - n / C;
					f += T * i * i * Math.exp(-(r * r) / 3528) * Math.cos(r / E * Math.PI * 2);
				}
				this.#o[o * t + c] = f;
			}
		}
	}
	#b(e) {
		let t = this.#e;
		if (!t || !this.#t || !this.#i) return;
		this.#y(e);
		let n = new Path2D(), r = new Path2D(), i = this.#u;
		i.best.clear(), Object.assign(i, {
			drift: this.#d * x,
			width: this.#n,
			height: this.#r
		}), _(this.#o, this.#i, this.#a, this.interval, n, r, this.plain ? null : i), t.clearRect(0, 0, this.#n, this.#r), t.strokeStyle = this.#s, t.fillStyle = this.#s, t.lineCap = "round", t.globalAlpha = .16, t.lineWidth = .75, t.stroke(n), t.globalAlpha = .34, t.lineWidth = 1.1, t.stroke(r), this.plain || v(t, i.best.values()), t.globalAlpha = 1;
	}
	#x() {
		this.#m || !this.#h || n.matches || (this.#f = 0, this.#m = requestAnimationFrame((e) => this.#C(e)));
	}
	#S(e) {
		let t = this.#c, n = 1 - Math.exp(-9 * e);
		t.x += (t.targetX - t.x) * n, t.y += (t.targetY - t.y) * n;
		let r = +!!t.on;
		return t.amount += (r - t.amount) * (1 - Math.exp(-5 * e)), Math.abs(t.targetX - t.x) > .5 || Math.abs(t.targetY - t.y) > .5 || Math.abs(r - t.amount) > .002;
	}
	#C(e) {
		if (this.#m = 0, !this.#h) return;
		let t = this.#f ? Math.min((e - this.#f) / 1e3, .05) : 0;
		this.#f = e;
		let n = this.#S(t);
		for (; this.#l.length && e - this.#l[0].start > C;) this.#l.shift();
		let r = n || this.#l.length > 0;
		this.#d += t * this.speed, (r || e - this.#p >= O) && (this.#b(e), this.#p = e), (this.speed > 0 || r) && (this.#m = requestAnimationFrame((e) => this.#C(e)));
	}
	#w(e) {
		let t = this.query("canvas").getBoundingClientRect();
		return {
			x: e.clientX - t.left,
			y: e.clientY - t.top
		};
	}
	#T(e) {
		if (!this.#g || e.pointerType !== "mouse") return;
		let { x: t, y: n } = this.#w(e), r = this.#c;
		r.on || Object.assign(r, {
			x: t,
			y: n
		}), Object.assign(r, {
			targetX: t,
			targetY: n,
			on: !0
		}), this.#x();
	}
	#E(e) {
		this.#g && !e.target.closest?.(j) && (this.#l.push({
			...this.#w(e),
			start: performance.now()
		}), this.#l.length > D && this.#l.shift(), this.#x());
	}
};
//#endregion
//#region src/components/topo-background/index.js
t("topo-background", M);
//#endregion
export { M as t };
