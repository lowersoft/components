import { n as e, t } from "./core-WcEz9YgG.js";
import { n } from "./motion-CFWhFfc_.js";
import { a as r } from "./theme-D-ctQQvB.js";
import { t as i } from "./visibility--H4IXDjD.js";
import { t as a } from "./canvas-zoeWnk3A.js";
//#region src/components/background-paths/background-paths.scss?inline
var o = ":host{box-sizing:border-box;background:var(--lw-color-background);width:100%;min-height:560px;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);justify-content:center;align-items:center;display:flex;position:relative;overflow:hidden}.copy{text-align:center;flex-direction:column;align-items:center;gap:1rem;max-width:36rem;padding:0 1.5rem;display:flex;position:relative}.title{letter-spacing:-.025em;text-wrap:balance;margin:0;font-size:clamp(2.25rem,5vw,3rem);font-weight:600;line-height:1.1}.description{max-width:24rem;font-size:var(--lw-text-md);text-wrap:pretty;color:var(--lw-color-muted-foreground);margin:0;line-height:1.5}.layer{pointer-events:none;position:absolute;inset:0;-webkit-mask-image:linear-gradient(#0000,#000 15% 85%,#0000),radial-gradient(40% 32%,#0000004d,#000);mask-image:linear-gradient(#0000,#000 15% 85%,#0000),radial-gradient(40% 32%,#0000004d,#000);-webkit-mask-composite:source-in;mask-composite:intersect}canvas{width:100%;height:100%;display:block}", s = 64, c = 1400, l = 40, u = 56, d = 40, f = [
	{
		width: 1,
		opacity: .16,
		phase: .6,
		pace: .7,
		part: .45
	},
	{
		width: 1.25,
		opacity: .26,
		phase: .3,
		pace: .85,
		part: .75
	},
	{
		width: 1.5,
		opacity: .4,
		phase: 0,
		pace: 1,
		part: 1
	}
], p = (e) => 1 - (1 - e) ** 3, m = class extends e {
	static styles = o;
	static props = {
		heading: { default: "Calm by default" },
		description: { default: "A ribbon of lines that keeps flowing in one colour, at any size. Move the cursor through it and the lines part around you." },
		count: {
			type: Number,
			default: 42
		},
		spread: {
			type: Number,
			default: 1
		},
		angle: {
			type: Number,
			default: -8
		},
		speed: {
			type: Number,
			default: 1
		},
		still: { type: Boolean }
	};
	#e = null;
	#t = 0;
	#n = 0;
	#r = "";
	#i = d;
	#a = [];
	#o = {
		x: 0,
		y: 0,
		amount: 0,
		on: !1
	};
	#s = 0;
	#c = 0;
	#l = 0;
	#u = !1;
	render() {
		return "<div class=\"layer\" aria-hidden=\"true\"><canvas></canvas></div><slot><div class=\"copy\"><h1 class=\"title\"></h1><p class=\"description\"></p></div></slot>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query("canvas");
		this.#e = t.getContext("2d"), this.#r = getComputedStyle(t).color;
		let n = new ResizeObserver(() => {
			({width: this.#t, height: this.#n} = a(t, this.#e)), this.#_();
		});
		n.observe(t), this.signal.addEventListener("abort", () => {
			n.disconnect(), cancelAnimationFrame(this.#l), this.#l = 0;
		}), i(this, (e) => {
			this.#u = e, this.#p();
		}, this.signal), r(() => {
			this.#r = getComputedStyle(t).color, this.#_();
		}, this.signal), this.addEventListener("pointermove", (e) => {
			if (e.pointerType !== "mouse" || !this.#f) return;
			let n = t.getBoundingClientRect();
			Object.assign(this.#o, {
				x: e.clientX - n.left,
				y: e.clientY - n.top,
				on: !0
			}), this.#p();
		}, e), this.addEventListener("pointerleave", () => {
			this.#o.on = !1, this.#p();
		}, e);
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", e.has("count") && (this.#a = Array(this.#d * f.length).fill(+!!n.matches), this.#s = 0), this.#_(), this.#p();
	}
	get #d() {
		return Math.max(1, Math.round(this.count / f.length));
	}
	get #f() {
		return !this.still && !n.matches;
	}
	#p() {
		this.#l || !this.#u || n.matches || (this.#c = performance.now(), this.#l = requestAnimationFrame((e) => this.#m(e)));
	}
	#m(e) {
		this.#l = 0, this.#s ||= e, this.#i += Math.min((e - this.#c) / 1e3, .05) * this.speed, this.#c = e;
		let t = e - this.#s, n = this.#d, r = !1;
		this.#a.forEach((e, i) => {
			e >= 1 || (this.#a[i] = p(Math.min(Math.max((t - i % n * l) / c, 0), 1)), r = !0);
		});
		let i = this.#o;
		i.amount += (+!!i.on - i.amount) * .08, this.#_(), this.#u && (this.speed > 0 || r || i.on || i.amount > .001) && (this.#l = requestAnimationFrame((e) => this.#m(e)));
	}
	#h(e, t, n, r, i) {
		let a = this.#i * n.pace, o = this.#n * .5 + i * (t * this.#t - this.#t / 2) + r * .1 * Math.sin(Math.PI * 2 * (.75 * t + .1) + n.phase + a * .35), s = .22 + .09 * Math.sin(a * .21 + n.phase), c = .3 * Math.sin(a * .5 + e * 4 + n.phase), l = Math.cos(Math.PI * (t - s) + e * (.6 + c) + n.phase);
		return o + e * this.spread * r * l;
	}
	#g(e, t, n) {
		let { x: r, y: i, amount: a } = this.#o;
		if (a < .001) return t;
		let o = e - r, s = t - i, c = Math.exp(-(o * o + s * s) / 22500);
		return t + s / (Math.abs(s) + 24) * c * u * n * a;
	}
	#_() {
		let e = this.#e;
		if (!e || !this.#a.length) return;
		let t = this.#t;
		e.clearRect(0, 0, t, this.#n), e.strokeStyle = this.#r, e.lineCap = "round", e.lineJoin = "round";
		let n = Math.min(this.#n, t * 1.1), r = Math.tan(this.angle * Math.PI / 180), i = this.#d, a = this.#f, o = /* @__PURE__ */ new Float32Array(65), c = /* @__PURE__ */ new Float32Array(65);
		f.forEach((l, u) => {
			e.lineWidth = l.width;
			for (let d = 0; d < i; d++) {
				let f = this.#a[u * i + d] ?? 1;
				if (f <= 0) continue;
				let p = i === 1 ? 0 : d / (i - 1) - .5, m = Math.max(1, Math.ceil(s * f));
				for (let e = 0; e <= m; e++) {
					let i = -.06 + e / s * 1.12, u = this.#h(p, i, l, n, r);
					o[e] = i * t, c[e] = a ? this.#g(o[e], u, l.part) : u;
				}
				e.globalAlpha = l.opacity * (.45 + .55 * (1 - Math.abs(p) * 2)), e.beginPath(), e.moveTo(o[0], c[0]);
				for (let t = 1; t < m; t++) e.quadraticCurveTo(o[t], c[t], (o[t] + o[t + 1]) / 2, (c[t] + c[t + 1]) / 2);
				e.lineTo(o[m], c[m]), e.stroke();
			}
		}), e.globalAlpha = 1;
	}
};
//#endregion
//#region src/components/background-paths/index.js
t("background-paths", m);
//#endregion
export { m as t };
