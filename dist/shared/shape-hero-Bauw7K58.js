import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { n as r } from "./motion-CFWhFfc_.js";
import { t as i } from "./visibility--H4IXDjD.js";
//#region src/components/shape-hero/pile.js
var a = 1 / 120, o = 2600, s = 16, c = .5, l = .4, u = .3, d = 3200, f = 18, p = 9, m = 40, h = 30, g = .28, _ = (e) => {
	if (e.half === 0) return [[e.x, e.y]];
	let t = Math.cos(e.a) * e.half, n = Math.sin(e.a) * e.half;
	return [[e.x - t, e.y - n], [e.x + t, e.y + n]];
}, v = (e, [t, n = t]) => {
	let r = n[0] - t[0], i = n[1] - t[1], a = r * r + i * i, o = a === 0 ? 0 : Math.min(Math.max(((e[0] - t[0]) * r + (e[1] - t[1]) * i) / a, 0), 1);
	return [t[0] + r * o, t[1] + i * o];
}, y = (e, t, n, r, i, a, o) => ({
	a: e,
	b: t,
	nx: n,
	ny: r,
	rax: i - e.x,
	ray: a - e.y,
	rbx: t ? i - t.x : 0,
	rby: t ? a - t.y : 0,
	depth: o,
	correct: !0,
	target: 0,
	kn: 0,
	kt: 0,
	jn: 0,
	jt: 0
}), b = (e, t) => {
	let n = null;
	for (let r of e) r.correct = !1, (!n || r.depth > n.depth) && (n = r), t.push(r);
	n && (n.correct = !0);
}, x = (e, t, n) => {
	let r = e.r + t.r, i = _(e), a = _(t), o = [], s = (n, i, a) => {
		let s = a ? i[0] - n[0] : n[0] - i[0], c = a ? i[1] - n[1] : n[1] - i[1], l = Math.hypot(s, c);
		if (l >= r + .5) return;
		let u = l > 1e-6 ? s / l : 0, d = l > 1e-6 ? c / l : -1, [f, p] = a ? i : n, m = e.r - (r - l) / 2;
		o.push(y(e, t, u, d, f - u * m, p - d * m, r - l));
	};
	for (let e of i) s(e, v(e, a), !1);
	for (let e of a) s(e, v(e, i), !0);
	if (!o.length) {
		let e = v([t.x, t.y], i);
		s(e, v(e, a), !1);
	}
	b(o, n);
}, S = (e, t, n, r) => {
	let i = [];
	for (let [r, a] of _(e)) a + e.r - n > -.5 && i.push(y(e, null, 0, -1, r, n, a + e.r - n)), e.r - r > -.5 && i.push(y(e, null, 1, 0, 0, a, e.r - r)), r + e.r - t > -.5 && i.push(y(e, null, -1, 0, t, a, r + e.r - t));
	b(i, r);
}, C = ({ a: e, b: t, rax: n, ray: r, rbx: i, rby: a }) => {
	let o = e.vx - e.w * r, s = e.vy + e.w * n;
	return t && (o -= t.vx - t.w * a, s -= t.vy + t.w * i), [o, s];
}, w = (e, t, n) => {
	let { a: r, b: i } = e;
	r.vx += t * r.invMass, r.vy += n * r.invMass, r.w += r.invInertia * (e.rax * n - e.ray * t), i && (i.vx -= t * i.invMass, i.vy -= n * i.invMass, i.w -= i.invInertia * (e.rbx * n - e.rby * t));
}, T = (e, t, n) => {
	let { a: r, b: i } = e, a = e.rax * n - e.ray * t, o = r.invMass + r.invInertia * a * a;
	if (i) {
		let r = e.rbx * n - e.rby * t;
		o += i.invMass + i.invInertia * r * r;
	}
	return o;
}, E = (e) => {
	e.kn = T(e, e.nx, e.ny), e.kt = T(e, -e.ny, e.nx);
	let [t, n] = C(e), r = t * e.nx + n * e.ny;
	e.target = e.depth < 0 ? e.depth / a : r < -140 ? -.22 * r : 0;
}, D = (e) => {
	let [t, n] = C(e), r = t * e.nx + n * e.ny, i = Math.max(e.jn + (e.target - r) / e.kn, 0), a = i - e.jn;
	e.jn = i, w(e, e.nx * a, e.ny * a), [t, n] = C(e);
	let o = -e.ny, s = e.nx, l = c * e.jn, u = Math.min(Math.max(e.jt - (t * o + n * s) / e.kt, -l), l), d = u - e.jt;
	e.jt = u, w(e, o * d, s * d);
}, O = (e) => {
	if (!e.correct || e.depth <= l) return;
	let { a: t, b: n } = e, r = (e.depth - l) * u / (t.invMass + (n ? n.invMass : 0));
	t.x += e.nx * r * t.invMass, t.y += e.ny * r * t.invMass, n && (n.x -= e.nx * r * n.invMass, n.y -= e.ny * r * n.invMass);
}, k = (e) => {
	let { body: t } = e, n = Math.cos(t.a), r = Math.sin(t.a), i = e.lx * n - e.ly * r, o = e.lx * r + e.ly * n, s = y(t, null, 0, 0, t.x + i, t.y + o, 0), [c] = C(s);
	w(s, ((e.tx - t.x - i) / a * g - c) / T(s, 1, 0), 0);
	let [, l] = C(s);
	w(s, 0, ((e.ty - t.y - o) / a * g - l) / T(s, 0, 1)), t.w *= .96;
}, A = (e) => {
	let t = Math.hypot(e.vx, e.vy);
	t > d && (e.vx *= d / t, e.vy *= d / t), e.w = Math.min(Math.max(e.w, -18), f);
}, j = (e) => {
	let { bodies: t, width: n, height: r, drag: i } = e;
	for (let e of t) e.vy += o * a, e.vx *= .999, e.w *= .995;
	i && k(i);
	let c = [];
	for (let e = 0; e < t.length; e++) {
		let i = t[e];
		S(i, n, r, c);
		for (let n = e + 1; n < t.length; n++) {
			let e = t[n], r = i.half + i.r + e.half + e.r;
			Math.abs(i.x - e.x) < r && Math.abs(i.y - e.y) < r && x(i, e, c);
		}
	}
	for (let e of c) E(e);
	for (let e = 0; e < s; e++) for (let e of c) D(e);
	let l = 0;
	for (let e of t) A(e), e !== i?.body && Math.hypot(e.vx, e.vy) + Math.abs(e.w) * e.r < h && (e.vx *= .8, e.vy *= .8, e.w *= .8), e.x += e.vx * a, e.y += e.vy * a, e.a += e.w * a, l = Math.max(l, Math.hypot(e.vx, e.vy) + Math.abs(e.w) * (e.half + e.r));
	for (let e of c) O(e);
	return e.still = l < p && !i ? e.still + 1 : 0, e.still > m;
}, M = (e) => Math.sin(e * 12.9898) * 43758.5453 % 1, N = (e, t, n, r) => {
	let i = [], a = 0;
	return e.forEach((e, o) => {
		let s = e.offsetWidth, c = e.offsetHeight, l = a + s * c <= t * n * r;
		if (e.style.visibility = l ? "visible" : "hidden", !l) return;
		a += s * c;
		let u = s * c / 1e3;
		i.push({
			x: t * (.2 + .6 * Math.abs(M(o + 1))),
			y: -c - o * 64,
			a: M(o + 7) * .9,
			vx: M(o + 3) * 120,
			vy: 0,
			w: M(o + 5) * 2,
			half: Math.max(s - c, 0) / 2,
			r: Math.min(s, c) / 2,
			invMass: 1 / u,
			invInertia: 12 / (u * (s * s + c * c)),
			width: s,
			height: c,
			el: e
		});
	}), i;
}, P = (e, t, n) => {
	for (let r = e.length - 1; r >= 0; r--) {
		let i = e[r], [a, o] = v([t, n], _(i));
		if (Math.hypot(t - a, n - o) <= i.r) return i;
	}
	return null;
}, F = (e) => {
	for (let t of e) t.el.style.transform = `translate3d(${(t.x - t.width / 2).toFixed(2)}px, ${(t.y - t.height / 2).toFixed(2)}px, 0) rotate(${t.a.toFixed(4)}rad)`;
}, I = ":host{--_accent:#f97316;box-sizing:border-box;background:var(--lw-color-background);width:100%;min-height:720px;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);flex-direction:column;justify-content:flex-start;align-items:center;padding:6rem 1.5rem;display:flex;position:relative;overflow:hidden}.copy{text-align:center;flex-direction:column;align-items:center;gap:1rem;max-width:36rem;padding:0 1.5rem;display:flex;position:relative}.title{letter-spacing:-.025em;text-wrap:balance;margin:0;font-size:clamp(2.25rem,5vw,3rem);font-weight:600;line-height:1.1}.description{max-width:24rem;font-size:var(--lw-text-md);text-wrap:pretty;color:var(--lw-color-muted-foreground);margin:0;line-height:1.5}.copy{pointer-events:none;gap:0;max-width:42rem}.title{font-size:clamp(2.25rem,7vw,3.75rem)}.description{max-width:28rem;margin-top:1.25rem;font-size:clamp(1rem,2vw,1.125rem)}.description[hidden]{display:none}::slotted([slot=eyebrow]){pointer-events:auto;margin-bottom:1.5rem}.actions{pointer-events:auto;flex-wrap:wrap;justify-content:center;align-items:center;gap:.75rem;margin-top:2rem;display:flex}.layer{touch-action:pan-y;-webkit-user-select:none;user-select:none;position:absolute;inset:0}.shape{box-sizing:border-box;border-radius:var(--lw-radius-full);height:3.5rem;font-size:var(--lw-text-lg);letter-spacing:-.015em;white-space:nowrap;visibility:hidden;cursor:grab;touch-action:none;will-change:transform;justify-content:center;align-items:center;padding:0 1.75rem;font-weight:500;display:flex;position:absolute;top:0;left:0}.shape[style*=width]{padding:0}.shape[data-tone=solid]{background:var(--lw-color-primary);color:var(--lw-color-primary-foreground)}.shape[data-tone=outline]{border:1px solid var(--lw-color-border);background:var(--lw-color-background)}.shape[data-tone=accent]{background:var(--_accent);color:#fff}:host([data-dragging]) .shape{cursor:grabbing}", L = 2400, R = (e, t, n) => ({
	id: e,
	label: t,
	tone: n
}), z = (e, t, n) => ({
	id: e,
	size: t,
	tone: n
}), B = [
	R("clip-trimmer", "Clip Trimmer", "solid"),
	R("detent-dial", "Detent Dial", "outline"),
	z("dot-1", 64, "accent"),
	R("liquid-gauge", "Liquid Gauge", "outline"),
	R("scss", "SCSS", "accent"),
	R("card-flip", "Card Flip", "outline"),
	z("dot-2", 48, "solid"),
	R("notification-stack", "Notification Stack", "outline"),
	R("dot-field", "Dot Field", "solid"),
	z("dot-3", 80, "outline"),
	R("synced-transcript", "Synced Transcript", "outline"),
	R("web-components", "Web Components", "outline"),
	R("shadow-dom", "Shadow DOM", "solid"),
	z("dot-4", 56, "outline"),
	R("vanilla-js", "Vanilla JS", "outline"),
	R("zero-deps", "Zero deps", "outline"),
	R("photo-straighten", "Photo Straighten", "solid"),
	z("dot-5", 48, "accent"),
	R("background-paths", "Background Paths", "outline"),
	R("receipt-printer", "Receipt Printer", "outline"),
	z("dot-6", 64, "solid"),
	R("custom-elements", "Custom Elements", "outline")
], V = class extends e {
	static styles = I;
	static props = {
		heading: { default: "Components with a little gravity" },
		description: { default: "Animated Web Components built with SCSS and vanilla JavaScript. Grab a shape and throw it." },
		shapes: {
			type: Object,
			default: B
		},
		fill: {
			type: Number,
			default: .3
		}
	};
	#e = {
		bodies: [],
		width: 0,
		height: 0,
		drag: null,
		still: 0
	};
	#t = !1;
	#n = !1;
	#r = 0;
	#i = 0;
	#a = 0;
	render() {
		return "<div class=\"layer\" aria-hidden=\"true\"></div>\n<div class=\"copy\"><slot name=\"eyebrow\"></slot><h1 class=\"title\"></h1><p class=\"description\"></p><div class=\"actions\"><slot name=\"actions\"><lw-button>Browse components</lw-button><lw-button variant=\"outline\">Read the docs</lw-button></slot></div></div>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".layer"), n = new ResizeObserver(() => {
			this.#e.width = t.clientWidth, this.#e.height = t.clientHeight, this.#s();
		});
		n.observe(t), this.signal.addEventListener("abort", () => {
			n.disconnect(), cancelAnimationFrame(this.#r), this.#r = 0;
		}), i(this, (e) => {
			this.#n = e, e && document.fonts.ready.then(() => this.#o()), this.#s();
		}, this.signal), t.addEventListener("pointerdown", (e) => this.#u(e), e), t.addEventListener("pointermove", (e) => this.#d(e), e);
		for (let n of ["pointerup", "pointercancel"]) t.addEventListener(n, (e) => this.#f(e), e);
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "";
		let t = this.query(".description");
		t.textContent = this.description ?? "", t.hidden = !this.description, (e.has("shapes") || e.has("fill")) && (this.query(".layer").innerHTML = this.shapes.map(({ id: e, label: t, size: r, tone: i }) => `<div class="shape" data-id="${n(e)}" data-tone="${n(i ?? "outline")}"${r ? ` style="width: ${Number(r)}px; height: ${Number(r)}px"` : ""}>${n(t ?? "")}</div>`).join(""), this.#t && (this.#t = !1, this.#o()));
	}
	#o() {
		if (this.#t || !this.isConnected) return;
		this.#t = !0;
		let e = this.#e;
		if (e.drag = null, e.bodies = N([...this.shadowRoot.querySelectorAll(".shape")], e.width, e.height, this.fill), r.matches) for (let t = 0; t < L && !j(e); t++);
		F(e.bodies), this.#s();
	}
	#s() {
		this.#e.still = 0, !(this.#r || !this.#t || !this.#n || r.matches) && (this.#i = performance.now(), this.#r = requestAnimationFrame((e) => this.#c(e)));
	}
	#c(e) {
		this.#r = 0, this.#a += Math.min((e - this.#i) / 1e3, .05), this.#i = e;
		let t = !1;
		for (; this.#a >= a;) t = j(this.#e), this.#a -= a;
		F(this.#e.bodies), !t && this.#n && (this.#r = requestAnimationFrame((e) => this.#c(e)));
	}
	#l(e) {
		let t = this.query(".layer").getBoundingClientRect();
		return [e.clientX - t.left, e.clientY - t.top];
	}
	#u(e) {
		let t = this.#e;
		if (!this.#t || t.drag || e.button !== 0) return;
		let [n, r] = this.#l(e), i = P(t.bodies, n, r);
		if (!i) return;
		e.preventDefault();
		let a = n - i.x, o = r - i.y, s = Math.cos(-i.a), c = Math.sin(-i.a);
		t.drag = {
			body: i,
			lx: a * s - o * c,
			ly: a * c + o * s,
			tx: n,
			ty: r,
			id: e.pointerId
		}, e.currentTarget.setPointerCapture(e.pointerId), this.toggleAttribute("data-dragging", !0), this.#s();
	}
	#d(e) {
		let t = this.#e.drag;
		t?.id === e.pointerId && ([t.tx, t.ty] = this.#l(e), this.#s());
	}
	#f(e) {
		this.#e.drag?.id === e.pointerId && (this.#e.drag = null, this.toggleAttribute("data-dragging", !1), this.#s());
	}
};
//#endregion
//#region src/components/shape-hero/index.js
t("shape-hero", V);
//#endregion
export { V as t };
