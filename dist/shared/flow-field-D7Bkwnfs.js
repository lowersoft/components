import { n as e, t } from "./core-WcEz9YgG.js";
import { n } from "./motion-CFWhFfc_.js";
import { a as r } from "./theme-D-ctQQvB.js";
import { t as i } from "./visibility--H4IXDjD.js";
import { t as a } from "./canvas-zoeWnk3A.js";
import { t as o } from "./noise-BjLE81N6.js";
//#region src/components/flow-field/wind.js
var s = 64, c = 340, l = 1.15, u = 64, d = 150, f = 42, p = 30, m = .62 * Math.PI * 30, h = 1.1, g = .5, _ = 1600, v = 1300, y = .62, b = 560, x = 4, S = [
	.18,
	.34,
	.54,
	.8
], C = 18, w = .05, T = {
	x: 0,
	y: 0
}, E = (e) => s * (e > 0 ? e : 1), D = (e, t) => ({
	noise: e,
	time: 0,
	wind: E(t),
	disc: {
		x: 0,
		y: 0,
		targetX: 0,
		targetY: 0,
		vx: 0,
		vy: 0,
		amount: 0,
		on: !1,
		lastShed: 0,
		side: 1
	},
	vortices: [],
	gusts: [],
	now: 0
}), ee = ({ disc: e, vortices: t, gusts: n }) => e.on || e.amount > 0 || t.length > 0 || n.length > 0, O = (e, t, n) => {
	let r = e.time, i = e.noise((t - r * s * .6) / c, n / c, r * .06) * l;
	T.x = Math.cos(i) * e.wind, T.y = Math.sin(i) * e.wind;
}, k = (e, t, n) => {
	let r = u * e.amount, i = t - e.x, a = n - e.y, o = Math.max(i * i + a * a, r * r), s = r * r / (o * o), c = T.x - e.vx, l = T.y - e.vy, d = i * i - a * a, f = -2 * i * a;
	T.x -= s * (c * d - l * f), T.y += s * (c * f + l * d);
}, A = (e, t, n) => {
	for (let r of e) {
		let e = t - r.x, i = n - r.y, a = e * e + i * i + 1, o = 900 * (1 + r.age / g), s = r.gamma * Math.exp(-r.age / h) / (2 * Math.PI * a) * (1 - Math.exp(-a / o));
		T.x -= s * i, T.y += s * e;
	}
}, j = (e, t, n, r) => {
	for (let i of e) {
		let e = t - i.start, a = n - i.x, o = r - i.y, s = Math.hypot(a, o) + .001, c = s - e * y, l = 1 - e / v, u = b * l * l * Math.exp(-(c * c) / 8192);
		T.x += u * a / s, T.y += u * o / s;
	}
}, M = (e, t, n) => {
	O(e, t, n), e.disc.amount > .002 && k(e.disc, t, n), e.vortices.length && A(e.vortices, t, n), e.gusts.length && j(e.gusts, e.now, t, n);
}, N = (e, t, n) => {
	let { disc: r, vortices: i } = e, a = r.x, o = r.y, s = 1 - Math.exp(-18 * t);
	r.x += (r.targetX - r.x) * s, r.y += (r.targetY - r.y) * s, r.amount += (+!!r.on - r.amount) * (1 - Math.exp(-7 * t)), r.amount < .002 && !r.on && (r.amount = 0);
	let c = 1 - Math.exp(-14 * t);
	r.vx += ((r.x - a) / t - r.vx) * c, r.vy += ((r.y - o) / t - r.vy) * c;
	let l = Math.hypot(r.vx, r.vy);
	if (l < d || r.amount < .5 || n - r.lastShed < f) return;
	r.lastShed = n, r.side = -r.side;
	let h = r.vx / l, g = r.vy / l, v = u * r.amount;
	i.push({
		x: r.x - h * v * .9 - g * r.side * v * .55,
		y: r.y - g * v * .9 + h * r.side * v * .55,
		gamma: r.side * m * Math.min(l, _),
		age: 0
	}), i.length > p && i.shift();
}, P = (e, t) => {
	for (let n of e.vortices) O(e, n.x, n.y), n.x += T.x * .85 * t, n.y += T.y * .85 * t, n.age += t;
	for (; e.vortices[0]?.age > h * 3.5;) e.vortices.shift();
	for (; e.gusts.length && e.now - e.gusts[0].start > v;) e.gusts.shift();
}, F = (e, t, n, r) => {
	e.gusts.push({
		x: t,
		y: n,
		start: r
	}), e.gusts.length > x && e.gusts.shift();
}, I = class {
	count = 0;
	width = 0;
	height = 0;
	resize(e, t, n) {
		if (e === this.count) {
			let r = this.width > 0 ? t / this.width : 1, i = this.height > 0 ? n / this.height : 1;
			for (let t = 0; t < e; t++) this.x[t] *= r, this.y[t] *= i;
			this.width = t, this.height = n;
		} else {
			Object.assign(this, {
				width: t,
				height: n,
				count: e
			});
			for (let t of [
				"x",
				"y",
				"vx",
				"vy",
				"life",
				"maxLife",
				"pace"
			]) this[t] = new Float32Array(e);
			for (let t = 0; t < e; t++) this.spawn(t), this.life[t] = Math.random() * this.maxLife[t];
		}
	}
	spawn(e) {
		this.x[e] = Math.random() * this.width, this.y[e] = Math.random() * this.height, this.vx[e] = 0, this.vy[e] = 0, this.life[e] = 0, this.maxLife[e] = 3 + Math.random() * 5, this.pace[e] = .75 + Math.random() * .5;
	}
}, L = (e, t) => Math.min(1, e / .6, (t - e) / .6), R = (e) => Math.max(0, Math.min(S.length - 1, Math.floor(e * 4))), z = (e, t) => e < -8 ? e + t + 16 : e > t + 8 ? e - t - 16 : e, B = (e, t, n) => {
	if (n.amount === 0) return;
	let r = u * n.amount, i = e.x[t] - n.x, a = e.y[t] - n.y, o = i * i + a * a;
	if (o >= r * r || o < 1e-4) return;
	let s = Math.sqrt(o);
	e.x[t] = n.x + i / s * r, e.y[t] = n.y + a / s * r;
}, V = (e, t) => {
	t.forEach((t, n) => {
		e.globalAlpha = S[n], e.stroke(t);
	}), e.globalAlpha = 1;
}, H = (e, t, n, r) => {
	let i = S.map(() => new Path2D()), a = 1 - Math.exp(-9 * r);
	for (let e = 0; e < n.count; e++) {
		if (n.life[e] += r, n.life[e] > n.maxLife[e]) {
			n.spawn(e);
			continue;
		}
		let o = n.x[e], s = n.y[e];
		M(t, o, s), n.vx[e] += (T.x * n.pace[e] - n.vx[e]) * a, n.vy[e] += (T.y * n.pace[e] - n.vy[e]) * a, n.x[e] = z(o + n.vx[e] * r, n.width), n.y[e] = z(s + n.vy[e] * r, n.height), B(n, e, t.disc);
		let c = n.x[e] - o, l = n.y[e] - s;
		if (c * c + l * l > 1600) continue;
		let u = Math.hypot(n.vx[e], n.vy[e]) / (t.wind * 2.4 + 1), d = i[R(L(n.life[e], n.maxLife[e]) * Math.min(1, .4 + u))];
		d.moveTo(o, s), d.lineTo(n.x[e], n.y[e]);
	}
	V(e, i);
}, U = (e, t, n, r, i) => {
	let a = S.map(() => new Path2D());
	for (let e = 0; e < i; e++) {
		let e = Math.random() * n, i = Math.random() * r;
		for (let n = 0; n < C; n++) {
			O(t, e, i);
			let r = e + T.x * w, o = i + T.y * w, s = a[R(n / C * .75)];
			s.moveTo(e, i), s.lineTo(r, o), e = r, i = o;
		}
	}
	V(e, a);
}, W = ":host{box-sizing:border-box;background:var(--lw-color-background);width:100%;min-height:560px;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);justify-content:center;align-items:center;display:flex;position:relative;overflow:hidden}.copy{text-align:center;flex-direction:column;align-items:center;gap:1rem;max-width:36rem;padding:0 1.5rem;display:flex;position:relative}.title{letter-spacing:-.025em;text-wrap:balance;margin:0;font-size:clamp(2.25rem,5vw,3rem);font-weight:600;line-height:1.1}.description{max-width:24rem;font-size:var(--lw-text-md);text-wrap:pretty;color:var(--lw-color-muted-foreground);margin:0;line-height:1.5}.layer{pointer-events:none;position:absolute;inset:0}canvas{width:100%;height:100%;display:block}@media (prefers-reduced-motion:no-preference){canvas{animation:.7s ease-out lw-fade-in}}@keyframes lw-fade-in{0%{opacity:0}}", G = 700, K = 520, q = 340, J = 7, Y = .22, X = 1e3, Z = .24, Q = "a, button, input, textarea, select, label, [role='button']", $ = class extends e {
	static styles = W;
	static props = {
		heading: { default: "Go with the flow" },
		description: { default: "Streamlines of wind that part around the cursor, swirl in its wake and scatter on click." },
		density: {
			type: Number,
			default: 1
		},
		speed: {
			type: Number,
			default: 1
		},
		still: { type: Boolean }
	};
	#e = null;
	#t = D(o(J), 1);
	#n = new I();
	#r = 0;
	#i = 0;
	#a = "";
	#o = 0;
	#s = 0;
	#c = 0;
	#l = !1;
	render() {
		return "<div class=\"layer\" aria-hidden=\"true\"><canvas></canvas></div><slot><div class=\"copy\"><h1 class=\"title\"></h1><p class=\"description\"></p></div></slot>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query("canvas");
		this.#e = t.getContext("2d");
		let n = new ResizeObserver(() => this.#f());
		n.observe(t), this.signal.addEventListener("abort", () => {
			n.disconnect(), this.#h();
		}), i(this, (e) => {
			this.#l = e, this.#m();
		}, this.signal), r(() => {
			this.#a = getComputedStyle(t).color, this.#u && this.#p();
		}, this.signal), this.addEventListener("pointermove", (e) => this.#y(e), e), this.addEventListener("pointerleave", () => this.#t.disc.on = !1, e), this.addEventListener("pointerup", (e) => e.pointerType === "touch" && (this.#t.disc.on = !1), e), this.addEventListener("pointercancel", () => this.#t.disc.on = !1, e), this.addEventListener("pointerdown", (e) => this.#b(e), e);
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", e.has("speed") && (this.#t.wind = E(this.speed)), (e.has("speed") || e.has("density")) && (this.#h(), this.#f(), this.#m());
	}
	get #u() {
		return this.speed <= 0 || n.matches;
	}
	get #d() {
		return Math.round(G * Math.max(this.density, 0) * (this.#r < K ? .6 : 1));
	}
	#f() {
		if (!this.#e) return;
		let e = this.query("canvas");
		({width: this.#r, height: this.#i} = a(e, this.#e)), this.#e.lineCap = "butt", this.#e.lineWidth = 1.2, this.#a = getComputedStyle(e).color, this.#n.resize(this.#d, this.#r, this.#i), this.#u && this.#p();
	}
	#p() {
		let e = this.#e;
		e.clearRect(0, 0, this.#r, this.#i), e.strokeStyle = this.#a, U(e, this.#t, this.#r, this.#i, Math.round(this.#d * q / G));
	}
	#m() {
		this.#o || !this.#l || this.#u || (this.#s = 0, this.#o = requestAnimationFrame((e) => this.#g(e)));
	}
	#h() {
		cancelAnimationFrame(this.#o), this.#o = 0;
	}
	#g(e) {
		if (this.#o = 0, !this.#l) return;
		this.#o = requestAnimationFrame((e) => this.#g(e));
		let t = this.#t;
		if (!ee(t) && e - this.#s < 29) return;
		let n = this.#s ? Math.min((e - this.#s) / 1e3, .05) : 1 / 60;
		this.#s = e, t.now = e, t.time += n * this.speed, N(t, n, e), P(t, n), this.#_(n, e), this.#e.strokeStyle = this.#a, H(this.#e, t, this.#n, n);
	}
	#_(e, t) {
		let n = this.#e;
		n.globalCompositeOperation = "destination-out", n.fillStyle = "#000", n.globalAlpha = 1 - Math.exp(-e / Y), n.fillRect(0, 0, this.#r, this.#i), e < .025 && t - this.#c > X && (this.#c = t, n.globalAlpha = Z, n.fillRect(0, 0, this.#r, this.#i)), n.globalAlpha = 1, n.globalCompositeOperation = "source-over";
	}
	#v(e) {
		let t = this.query("canvas").getBoundingClientRect();
		return [e.clientX - t.left, e.clientY - t.top];
	}
	#y(e) {
		if (this.still || this.#u || e.pointerType === "touch" && e.buttons === 0) return;
		let [t, n] = this.#v(e), r = this.#t.disc;
		r.amount < .05 && Object.assign(r, {
			x: t,
			y: n,
			vx: 0,
			vy: 0
		}), Object.assign(r, {
			targetX: t,
			targetY: n,
			on: !0
		}), this.#m();
	}
	#b(e) {
		if (this.still || this.#u || e.button !== 0 || e.target.closest?.(Q)) return;
		let [t, n] = this.#v(e);
		F(this.#t, t, n, performance.now()), this.#y(e);
	}
};
//#endregion
//#region src/components/flow-field/index.js
t("flow-field", $);
//#endregion
export { $ as t };
