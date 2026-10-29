import { n as e, t } from "./core-WcEz9YgG.js";
import { n } from "./motion-CFWhFfc_.js";
import { a as r } from "./theme-D-ctQQvB.js";
import { t as i } from "./visibility--H4IXDjD.js";
import { t as a } from "./canvas-zoeWnk3A.js";
import { t as o } from "./noise-BjLE81N6.js";
//#region src/components/dot-field/membrane.js
var s = 240, c = .07, l = 3, u = 340, d = 2.4, f = 72, p = 14, m = 2600, h = .45, g = 620, _ = 34, v = 5200, y = 1.3, b = 3, x = 10, S = 2, C = .15, w = (e) => Math.ceil((e - 1) / l) + 1, T = (e, t, n) => {
	let r = Math.ceil(e / n) + 3, i = Math.ceil(t / n) + 3, a = r * i;
	return {
		cols: r,
		rows: i,
		spacing: n,
		originX: (e - (r - 1) * n) / 2,
		originY: (t - (i - 1) * n) / 2,
		tone: new Float32Array(a),
		coarse: new Float32Array(w(r) * w(i)),
		ox: new Float32Array(a),
		oy: new Float32Array(a),
		vx: new Float32Array(a),
		vy: new Float32Array(a),
		ax: new Float32Array(a),
		ay: new Float32Array(a)
	};
}, E = (e, t, n) => {
	let { cols: r, rows: i, spacing: a, originX: o, originY: u, tone: d, coarse: f } = e, p = n * c, m = a * l, h = w(r), g = w(i);
	for (let e = 0; e < g; e++) {
		let n = (u + e * m) / s;
		for (let r = 0; r < h; r++) {
			let i = (o + r * m) / s, a = t(i, n, p) * .75 + t(i * 2.1 + 9.3, n * 2.1 + 3.7, p * 1.3) * .25;
			f[e * h + r] = Math.min(1, Math.max(0, .5 + a * 1.1));
		}
	}
	for (let e = 0; e < i; e++) {
		let t = Math.min(Math.floor(e / l), g - 2), n = e / l - t;
		for (let i = 0; i < r; i++) {
			let a = Math.min(Math.floor(i / l), h - 2), o = i / l - a, s = t * h + a, c = f[s] + (f[s + 1] - f[s]) * o, u = f[s + h] + (f[s + h + 1] - f[s + h]) * o;
			d[e * r + i] = c + (u - c) * n;
		}
	}
}, D = (e, { cols: t, rows: n }, r, i) => {
	let a = i * t + r;
	return (r > 0 ? e[a - 1] : 0) + (r < t - 1 ? e[a + 1] : 0) + (i > 0 ? e[a - t] : 0) + (i < n - 1 ? e[a + t] : 0);
}, O = ({ cols: e, rows: t, spacing: n, originX: r, originY: i }, a, o, s, c) => ({
	i0: Math.max(0, Math.floor((a - r) / n)),
	i1: Math.min(e - 1, Math.ceil((s - r) / n)),
	j0: Math.max(0, Math.floor((o - i) / n)),
	j1: Math.min(t - 1, Math.ceil((c - i) / n))
}), k = (e, t) => {
	let { cols: n, spacing: r, originX: i, originY: a, ax: o, ay: s } = e;
	for (let c of t) {
		let t = c.age * g, l = 1 - c.age / y, u = v * l * l, d = t + _, f = Math.max(0, t - _), { i0: p, i1: m, j0: h, j1: b } = O(e, c.x - d, c.y - d, c.x + d, c.y + d);
		for (let e = h; e <= b; e++) {
			let l = a + e * r - c.y;
			for (let a = p; a <= m; a++) {
				let p = i + a * r - c.x, m = Math.hypot(p, l);
				if (m < f || m > d || m === 0) continue;
				let h = 1 - Math.abs(m - t) / _, g = e * n + a;
				o[g] += p / m * u * h, s[g] += l / m * u * h;
			}
		}
	}
}, A = (e, t, n) => {
	let r = t.x - t.lastX, i = t.y - t.lastY;
	t.lastX = t.x, t.lastY = t.y;
	let a = Math.hypot(r, i);
	if (!t.inside || a < .5 || n <= 0) return !1;
	let o = Math.min(a / n, m), s = r / a * o, c = i / a * o, { cols: l, spacing: u, originX: d, originY: g, vx: _, vy: v } = e, y = t.x - r, b = t.y - i, { i0: x, i1: S, j0: C, j1: w } = O(e, Math.min(y, t.x) - f, Math.min(b, t.y) - f, Math.max(y, t.x) + f, Math.max(b, t.y) + f), T = a * a, E = Math.min(1, p * n);
	for (let e = C; e <= w; e++) {
		let t = g + e * u;
		for (let n = x; n <= S; n++) {
			let a = d + n * u, p = Math.min(1, Math.max(0, ((a - y) * r + (t - b) * i) / T)), m = a - y - r * p, g = t - b - i * p, x = Math.hypot(m, g);
			if (x >= f) continue;
			let S = 1 - x / f, C = e * l + n, w = E * S * S, D = x > 0 ? o * h / x : 0;
			_[C] += (s + m * D - _[C]) * w, v[C] += (c + g * D - v[C]) * w;
		}
	}
	return !0;
}, j = (e, t, n) => {
	let { cols: r, rows: i, ox: a, oy: o, vx: s, vy: c, ax: l, ay: f } = e;
	l.fill(0), f.fill(0), k(e, t);
	for (let t = 0; t < i; t++) for (let n = 0; n < r; n++) {
		let i = t * r + n;
		l[i] += -26 * a[i] + u * (D(a, e, n, t) - 4 * a[i]) - d * s[i], f[i] += -26 * o[i] + u * (D(o, e, n, t) - 4 * o[i]) - d * c[i];
	}
	let p = !1;
	for (let e = 0; e < a.length; e++) s[e] += l[e] * n, c[e] += f[e] * n, a[e] += s[e] * n, o[e] += c[e] * n, p ||= Math.abs(s[e]) > S || Math.abs(c[e]) > S || Math.abs(a[e]) > C || Math.abs(o[e]) > C;
	return p;
}, M = ({ ox: e, oy: t, vx: n, vy: r }) => {
	for (let i of [
		e,
		t,
		n,
		r
	]) i.fill(0);
}, N = ({ cols: e, rows: t, spacing: n, ox: r, oy: i }, a, o) => {
	let s = o * e + a, c = a > 0 ? r[s - 1] : 0, l = a < e - 1 ? r[s + 1] : 0, u = o > 0 ? i[s - e] : 0, d = o < t - 1 ? i[s + e] : 0;
	return -(l - c + d - u) / (2 * n);
}, P = (e, t, { width: n, height: r, color: i }, a) => {
	let { cols: o, rows: s, spacing: c, originX: l, originY: u, tone: d, ox: f, oy: p } = t, m = c * .42, h = Array.from({ length: x }, () => new Path2D()), g = new Uint8Array(x);
	for (let e = 0; e < s; e++) for (let n = 0; n < o; n++) {
		let r = e * o + n, i = .12 + .6 * d[r];
		a && (i *= 1 + b * N(t, n, e));
		let s = Math.round(Math.min(1, Math.max(0, i)) * 9);
		if (s === 0) continue;
		let _ = m * s / 9, v = l + n * c + f[r], y = u + e * c + p[r];
		h[s].moveTo(v + _, y), h[s].arc(v, y, _, 0, Math.PI * 2), g[s] = 1;
	}
	e.clearRect(0, 0, n, r), e.fillStyle = i;
	for (let t = 1; t < x; t++) g[t] && (e.globalAlpha = .2 + .32 * t / 9, e.fill(h[t]));
	e.globalAlpha = 1;
}, F = ":host{box-sizing:border-box;background:var(--lw-color-background);width:100%;min-height:560px;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);justify-content:center;align-items:center;display:flex;position:relative;overflow:hidden}.copy{text-align:center;flex-direction:column;align-items:center;gap:1rem;max-width:36rem;padding:0 1.5rem;display:flex;position:relative}.title{letter-spacing:-.025em;text-wrap:balance;margin:0;font-size:clamp(2.25rem,5vw,3rem);font-weight:600;line-height:1.1}.description{max-width:24rem;font-size:var(--lw-text-md);text-wrap:pretty;color:var(--lw-color-muted-foreground);margin:0;line-height:1.5}.layer{pointer-events:none;position:absolute;inset:0}canvas{width:100%;height:100%;display:block;-webkit-mask-image:radial-gradient(75% 70%,#000 40%,#0000 100%),radial-gradient(34% 22%,#00000059,#000 100%);mask-image:radial-gradient(75% 70%,#000 40%,#0000 100%),radial-gradient(34% 22%,#00000059,#000 100%);-webkit-mask-composite:source-in;mask-composite:intersect}@media (prefers-reduced-motion:no-preference){canvas{animation:.5s ease-out lw-fade-in}}@keyframes lw-fade-in{0%{opacity:0}}", I = 1 / 120, L = 33, R = 3, z = "a, button, input, textarea, select, label, [role='button']", B = class extends e {
	static styles = F;
	static props = {
		heading: { default: "Leave a mark" },
		description: { default: "A halftone membrane. Swipe fast to leave a wake, click to send a shockwave through it." },
		spacing: {
			type: Number,
			default: 16
		},
		seed: {
			type: Number,
			default: 7
		},
		still: { type: Boolean }
	};
	#e = null;
	#t = null;
	#n = T(0, 0, 16);
	#r = {
		width: 0,
		height: 0,
		color: ""
	};
	#i = {
		x: 0,
		y: 0,
		lastX: 0,
		lastY: 0,
		inside: !1
	};
	#a = [];
	#o = 0;
	#s = 0;
	#c = 0;
	#l = 0;
	#u = !1;
	#d = !1;
	#f = 0;
	#p = !1;
	render() {
		return "<div class=\"layer\" aria-hidden=\"true\"><canvas></canvas></div><slot><div class=\"copy\"><h1 class=\"title\"></h1><p class=\"description\"></p></div></slot>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query("canvas");
		this.#e = t.getContext("2d");
		let n = new ResizeObserver(() => this.#h());
		n.observe(t), this.signal.addEventListener("abort", () => {
			n.disconnect(), cancelAnimationFrame(this.#f), this.#f = 0;
		}), i(this, (e) => {
			this.#p = e, this.#_();
		}, this.signal), r(() => {
			this.#r.color = getComputedStyle(t).color, this.#g(!1);
		}, this.signal), this.addEventListener("pointermove", (e) => this.#S(e), e), this.addEventListener("pointerleave", () => this.#i.inside = !1, e), this.addEventListener("pointerdown", (e) => this.#C(e), e);
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", e.has("seed") && (this.#t = o(this.seed)), (e.has("seed") || e.has("spacing")) && this.#h();
	}
	get #m() {
		return !this.still && !n.matches;
	}
	#h() {
		if (!this.#e) return;
		let { width: e, height: t } = a(this.query("canvas"), this.#e);
		Object.assign(this.#r, {
			width: e,
			height: t,
			color: getComputedStyle(this.query("canvas")).color
		}), this.#n = T(e, t, Math.max(6, this.spacing)), E(this.#n, this.#t, this.#o), this.#d = !1, this.#g(!1);
	}
	#g(e) {
		this.#e && P(this.#e, this.#n, this.#r, e);
	}
	#_() {
		this.#f || !this.#p || n.matches || (this.#s = 0, this.#f = requestAnimationFrame((e) => this.#y(e)));
	}
	#v() {
		this.#d || (this.#d = !0, this.#l = 0, this.#u = !0), this.#_();
	}
	#y(e) {
		if (this.#f = 0, !this.#p) return;
		let t = this.#s ? Math.min((e - this.#s) / 1e3, .05) : 0;
		this.#s = e, this.#o += t;
		let n = this.#d;
		n && this.#b(t);
		let r = e - this.#c >= L;
		r && (E(this.#n, this.#t, this.#o), this.#c = e), (n || r) && this.#g(n), this.#f = requestAnimationFrame((e) => this.#y(e));
	}
	#b(e) {
		let t = A(this.#n, this.#i, e);
		for (this.#l = Math.min(this.#l + e, I * 6); this.#l >= I;) {
			this.#l -= I;
			for (let e of this.#a) e.age += I;
			for (; this.#a[0]?.age > y;) this.#a.shift();
			this.#u = j(this.#n, this.#a, I);
		}
		t || this.#u || this.#a.length || (M(this.#n), this.#d = !1);
	}
	#x(e) {
		let t = this.query("canvas").getBoundingClientRect();
		return {
			x: e.clientX - t.left,
			y: e.clientY - t.top
		};
	}
	#S(e) {
		if (!this.#m) return;
		let t = this.#i, { x: n, y: r } = this.#x(e);
		t.inside || Object.assign(t, {
			lastX: n,
			lastY: r,
			inside: !0
		}), Object.assign(t, {
			x: n,
			y: r
		}), (Math.abs(n - t.lastX) > .5 || Math.abs(r - t.lastY) > .5) && this.#v();
	}
	#C(e) {
		if (!this.#m || e.button !== 0 || e.target.closest?.(z)) return;
		let { x: t, y: n } = this.#x(e);
		Object.assign(this.#i, {
			x: t,
			y: n,
			lastX: t,
			lastY: n,
			inside: !0
		}), this.#a.push({
			x: t,
			y: n,
			age: 0
		}), this.#a.length > R && this.#a.shift(), this.#v();
	}
};
//#endregion
//#region src/components/dot-field/index.js
t("dot-field", B);
//#endregion
export { B as t };
