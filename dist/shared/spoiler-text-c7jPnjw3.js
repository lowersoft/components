import { n as e, t } from "./core-WcEz9YgG.js";
import { n } from "./motion-CFWhFfc_.js";
import { t as r } from "./visibility--H4IXDjD.js";
//#region src/components/spoiler-text/specks.js
var i = 1 / 6, a = 2400, o = 7, s = 360, c = 70, l = ({ x: e, y: t }, n, r) => Math.max(Math.hypot(e, t), Math.hypot(n - e, t), Math.hypot(e, r - t), Math.hypot(n - e, r - t)), u = (e, t, n, r) => {
	let i = [...n.getClientRects()];
	if (i.length === 0) return null;
	let a = Math.min(...i.map((e) => e.left)), o = Math.min(...i.map((e) => e.top)), s = Math.max(...i.map((e) => e.right)) - a, c = Math.max(...i.map((e) => e.bottom)) - o, l = r.getBoundingClientRect();
	Object.assign(e.style, {
		left: `${a - l.left}px`,
		top: `${o - l.top}px`,
		width: `${s}px`,
		height: `${c}px`
	});
	let u = Math.min(devicePixelRatio || 1, 2);
	return e.width = Math.round(s * u), e.height = Math.round(c * u), t.setTransform(u, 0, 0, u, 0, 0), {
		width: s,
		height: c,
		boxes: i.map((e) => ({
			left: e.left - a,
			top: e.top - o,
			right: e.right - a,
			bottom: e.bottom - o
		}))
	};
}, d = (e) => {
	let t = e.reduce((e, t) => e + (t.right - t.left) * (t.bottom - t.top), 0), n = Math.min(1, a / Math.max(1, t * i));
	return e.flatMap((e, t) => {
		let r = e.right - e.left, a = e.bottom - e.top;
		return Array.from({ length: Math.round(r * a * i * n) }, () => {
			let n = Math.random() * Math.PI * 2, i = o * (.3 + Math.random() * .7);
			return {
				x: e.left + Math.random() * r,
				y: e.top + Math.random() * a,
				vx: Math.cos(n) * i,
				vy: Math.sin(n) * i,
				phase: Math.random(),
				rate: .35 + Math.random() * .9,
				size: Math.random() < .18 ? 1.5 : 1,
				box: t,
				hit: 0
			};
		});
	});
}, f = (e, { now: t, dt: n, wave: r, radius: i, boxes: a, still: o }) => {
	let l = e;
	if (r && !l.hit && Math.hypot(l.x - r.x, l.y - r.y) <= i) {
		l.hit = t;
		let e = l.x - r.x, n = l.y - r.y, i = Math.hypot(e, n) || 1, a = c * (.5 + Math.random());
		l.vx += e / i * a, l.vy += n / i * a;
	}
	let u = l.hit ? 1 - (t - l.hit) / s : 1;
	if (u <= 0) return 0;
	(!o || l.hit) && (l.x += l.vx * n, l.y += l.vy * n, l.phase = (l.phase + l.rate * n) % 1);
	let d = l.hit ? null : a[l.box];
	return d && ((l.x < d.left || l.x > d.right) && (l.vx = -l.vx, l.x = Math.min(d.right, Math.max(d.left, l.x))), (l.y < d.top || l.y > d.bottom) && (l.vy = -l.vy, l.y = Math.min(d.bottom, Math.max(d.top, l.y)))), (.35 + .65 * Math.abs(Math.sin(l.phase * Math.PI))) * u * .9;
}, p = (e, t, n) => {
	let r = 0;
	for (let i of t) {
		let t = f(i, n);
		t <= 0 || (r += 1, e.globalAlpha = t, e.fillRect(i.x, i.y, i.size, i.size));
	}
	return e.globalAlpha = 1, r;
}, m = ":host{-webkit-box-decoration-break:clone;box-decoration-break:clone;border-radius:3px;display:inline}:host(:not([revealed])){background:color-mix(in oklab, currentcolor 6%, transparent);cursor:pointer;outline:none}@media (prefers-reduced-motion:no-preference){:host(:not([revealed])){transition:background-color .15s}}:host(:not([revealed]):hover){background:color-mix(in oklab, currentcolor 10%, transparent)}:host(:not([revealed]):focus-visible){outline:2px solid var(--lw-color-ring);outline-offset:2px}.text{transition:opacity .45s cubic-bezier(.23,1,.32,1)}@media (prefers-reduced-motion:no-preference){.text{transition-property:opacity,filter}}:host(:not([revealed])) .text{opacity:0;filter:blur(6px);-webkit-user-select:none;user-select:none}.anchor{width:0;height:0;display:inline-block;position:relative}.specks{pointer-events:none;position:absolute}.specks[hidden]{display:none}", h = 520, g = (e) => 1 - (1 - e) ** 3, _ = class extends e {
	static styles = m;
	static props = {
		revealed: {
			type: Boolean,
			reflect: !0
		},
		label: { default: "Hidden text. Activate to reveal." }
	};
	#e = this.attachInternals();
	#t = null;
	#n = [];
	#r = [];
	#i = {
		width: 0,
		height: 0
	};
	#a = "currentColor";
	#o = null;
	#s = 0;
	#c = 0;
	#l = !1;
	render() {
		return "<span class=\"anchor\"><canvas class=\"specks\" part=\"specks\" aria-hidden=\"true\"></canvas></span><span class=\"text\" part=\"text\"><slot></slot></span>";
	}
	connected() {
		let e = { signal: this.signal };
		this.#t ??= this.query(".specks").getContext("2d"), this.addEventListener("click", (e) => e.detail === 0 ? this.#d() : this.#d(e.clientX, e.clientY), e), this.addEventListener("keydown", (e) => {
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.#d());
		}, e), this.query("slot").addEventListener("slotchange", () => this.#f(), e);
		let t = new ResizeObserver(() => this.#f());
		t.observe(this.parentElement ?? this), r(this, (e) => {
			this.#l = e, this.#p();
		}, this.signal), n.addEventListener("change", () => this.#p(), e), this.signal.addEventListener("abort", () => {
			t.disconnect(), cancelAnimationFrame(this.#s), this.#s = 0, this.#o = null;
		});
	}
	updated(e) {
		if (e.has("revealed")) {
			let e = !this.revealed;
			this.#e.role = e ? "button" : null, this.#e.ariaLabel = e ? this.label : null, this.query(".text").ariaHidden = e ? "true" : null, e ? this.tabIndex = 0 : this.removeAttribute("tabindex"), e && (this.#o = null), this.#f();
		} else e.has("label") && !this.revealed && (this.#e.ariaLabel = this.label);
	}
	get #u() {
		return !this.revealed || this.#o !== null;
	}
	#d(e, t) {
		if (this.revealed || !this.emit("reveal")) return;
		let n = this.query(".specks").getBoundingClientRect(), r = this.query(".text").getClientRects()[0], i = e ?? (r ? r.left + 4 : n.left), a = t ?? (r ? r.top + r.height / 2 : n.top);
		this.#l && (this.#o = {
			x: i - n.left,
			y: a - n.top,
			start: performance.now()
		}), this.revealed = !0;
	}
	#f() {
		let e = this.query(".specks");
		if (e.hidden = !this.#u, !this.isConnected || e.hidden || this.#o) return;
		let t = u(e, this.#t, this.query(".text"), this.query(".anchor"));
		t && (this.#i = {
			width: t.width,
			height: t.height
		}, this.#r = t.boxes, this.#n = d(t.boxes), this.#a = getComputedStyle(this).color, this.#p());
	}
	#p() {
		cancelAnimationFrame(this.#s), this.#s = 0, this.#c = 0, this.#l && this.#u && (this.#s = requestAnimationFrame(this.#m));
	}
	#m = (e) => {
		this.#s = 0;
		let t = this.#t, { width: r, height: i } = this.#i, a = this.#c ? Math.min(.05, (e - this.#c) / 1e3) : 0;
		this.#c = e, t.clearRect(0, 0, r, i), t.fillStyle = this.#a;
		let o = this.#o, s = o ? l(o, r, i) * g(Math.min(1, (e - o.start) / h)) : -1, c = n.matches, u = p(t, this.#n, {
			now: e,
			dt: a,
			wave: o,
			radius: s,
			boxes: this.#r,
			still: c
		});
		o && u === 0 ? (this.#o = null, this.query(".specks").hidden = !0) : (!c || o) && this.#l && (this.#s = requestAnimationFrame(this.#m));
	};
};
//#endregion
//#region src/components/spoiler-text/index.js
t("spoiler-text", _);
//#endregion
export { _ as t };
