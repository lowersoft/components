import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./form-QHOiInAj.js";
import { a as i, n as a, t as o } from "./motion-CFWhFfc_.js";
import { t as s } from "./visibility--H4IXDjD.js";
var c = 1 / 120, l = 34, u = 2600, d = 30, f = 2.4, p = 22, m = 16, h = 900, g = 2.6, _ = 14, v = .55, y = 220, b = 26, x = .02, S = (e, t, n) => Math.min(Math.max(e, t), n), C = (e) => e.toFixed(2), w = Array.from({ length: l }, (e, t) => 84 + t / 33 * 112), T = w.map((e) => {
	let t = (e - 140) / 56;
	return 9 * Math.sqrt(Math.max(0, 1 - t * t));
}), E = (e) => 312 - e * 192, D = (e, t, n) => Math.min(e + t[n] + T[n], 312 + T[n]), O = (e, t) => {
	let n = "", r = "", i = "";
	for (let a = 0; a < l; a++) {
		n += `${a === 0 ? "M" : "L"}${C(w[a])} ${C(Math.min(e + t[a] - T[a], 312))}`;
		let o = `${C(w[a])} ${C(D(e, t, a))}`;
		r += `${a === 0 ? "M" : "L"}${o}`, a > 0 && a < 33 && (i += `${a === 1 ? "M" : "L"}${o}`);
	}
	let a = "";
	for (let n = 33; n >= 0; n--) a += `L${C(w[n])} ${C(D(e, t, n))}`;
	return {
		surface: `${n}${a}Z`,
		body: `${r}L196 312 A56 9 0 0 1 84 312Z`,
		lip: i
	};
}, k = class {
	heights = new Float64Array(l);
	speeds = new Float64Array(l);
	#e = new Float64Array(l);
	level = 0;
	levelSpeed = 0;
	target = 0;
	bubbles = [];
	energy = 0;
	held = !1;
	px = 0;
	py = 0;
	pvx = 0;
	#t = 1;
	#n() {
		return this.#t = this.#t * 16807 % 2147483647, this.#t / 2147483647;
	}
	get settled() {
		return !this.held && this.energy < x && Math.abs(this.target - this.level) < 5e-4 && Math.abs(this.levelSpeed) < .001 && this.bubbles.length === 0;
	}
	rest() {
		this.level = this.target, this.levelSpeed = 0, this.heights.fill(0), this.speeds.fill(0), this.bubbles.length = 0, this.energy = 0;
	}
	drop(e) {
		this.speeds[Math.floor(l / 2)] += e ? -90 : 90;
	}
	step() {
		this.#r(), this.#i(), this.#a();
	}
	#r() {
		this.levelSpeed += ((this.target - this.level) * y - this.levelSpeed * b) * c, this.level += this.levelSpeed * c, this.levelSpeed > .5 && this.bubbles.length < 14 && this.#n() < this.levelSpeed * .05 && this.bubbles.push({
			x: 94 + this.#n() * 92,
			y: 314,
			r: 1.2 + this.#n() * 2,
			speed: 40 + this.#n() * 50,
			phase: this.#n() * Math.PI * 2
		});
	}
	#i() {
		let { heights: e, speeds: t } = this, n = this.#e, r = E(this.level);
		for (let i = 0; i < l; i++) {
			let a = i === 0 ? 0 : i - 1, o = i === 33 ? i : i + 1, s = u * (e[a] + e[o] - 2 * e[i]) + p * (t[a] + t[o] - 2 * t[i]) - d * e[i] - f * t[i];
			if (this.held) {
				let t = (w[i] - this.px) / (112 / l), n = Math.exp(-(t * t) / (g * g));
				s += h * S(this.py - (r + e[i]), -14, _) * n * .05, s -= v * this.pvx * ((i - 33 / 2) / l) * 60;
			}
			n[i] = s;
		}
		let i = 0;
		for (let r = 0; r < l; r++) t[r] += n[r] * c, e[r] = S(e[r] + t[r] * c, -16, m), i += e[r];
		i /= l;
		let a = 0;
		for (let n = 0; n < l; n++) e[n] -= i, a += Math.abs(e[n]) + Math.abs(t[n]) * c;
		this.energy = a / l;
	}
	#a() {
		let e = E(this.level);
		for (let t = this.bubbles.length - 1; t >= 0; t--) {
			let n = this.bubbles[t];
			if (n.y -= n.speed * c, n.phase += c * 9, n.y > e + this.#o(n.x) + 1) continue;
			let r = Math.round((n.x - 84) / 112 * 33);
			this.speeds[S(r, 0, 33)] -= 30 * n.r, this.bubbles.splice(t, 1);
		}
	}
	#o(e) {
		let t = S((e - 84) / 112, 0, 1) * 33, n = Math.floor(t), r = Math.min(n + 1, 33);
		return this.heights[n] + (this.heights[r] - this.heights[n]) * (t - n);
	}
}, A = ":host{--_liquid:var(--lw-liquid-slider-color,#0ea5e9);--_line:color-mix(in oklab, var(--lw-color-foreground) 22%, transparent);font-family:var(--lw-font-sans);color:var(--lw-color-foreground);-webkit-user-select:none;user-select:none;display:inline-block}:host([disabled]){opacity:.5}.slider{border:1px solid var(--lw-color-border);background:var(--lw-color-background);border-radius:1.5rem;outline:none;width:280px;height:360px;position:relative;overflow:hidden}.slider:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.readout{pointer-events:none;padding:1.5rem;position:absolute;inset:0 0 auto}.label{font-size:var(--lw-text-sm);color:var(--lw-color-muted-foreground);margin:0}.value{font-variant-numeric:tabular-nums;letter-spacing:-.02em;margin:.125rem 0 0;font-size:1.5rem;font-weight:500}.unit{font-size:var(--lw-text-md);color:var(--lw-color-muted-foreground);margin-left:.25rem;font-weight:400}.glass{cursor:grab;touch-action:none;width:100%;height:100%;position:absolute;inset:0}:host([data-grabbing]) .glass{cursor:grabbing}[aria-disabled]>.glass{cursor:not-allowed}.back{fill:color-mix(in oklab, var(--lw-color-foreground) 3%, transparent)}.floor{fill:none;stroke:var(--lw-color-border)}.body{fill:var(--_liquid)}.surface{fill:var(--lightningcss-light,color-mix(in oklab, var(--_liquid) 55%, #fff))var(--lightningcss-dark,color-mix(in oklab, var(--_liquid) 75%, #fff))}.lip{fill:none;stroke:#fff9;stroke-linecap:round}.bubble{fill:#ffffff40;stroke:#ffffffb3;stroke-width:.75px;opacity:0}.mark{stroke:var(--_line)}.mark-label{font-variant-numeric:tabular-nums;fill:var(--lw-color-muted-foreground);font-size:10px}.rim,.wall{fill:none;stroke:var(--_line);stroke-width:1.5px}.shine{stroke:var(--lightningcss-light,#ffffff80)var(--lightningcss-dark,#ffffff1a);stroke-linecap:round;stroke-width:3px}", j = "M84 104L196 104L196 312A56 9 0 0 1 84 312Z", M = "M84 104A56 9 0 0 1 196 104L196 312A56 9 0 0 1 84 312Z", N = "M84 104L84 312A56 9 0 0 0 196 312L196 104", P = [
	0,
	.25,
	.5,
	.75,
	1
], F = `<svg class="glass" viewBox="0 0 280 360" aria-hidden="true">
<defs><clipPath id="glass"><path d="${j}"/></clipPath></defs>
<path class="back" d="${M}"/>
<path class="floor" d="M84 312A56 9 0 0 1 196 312"/>
<g clip-path="url(#glass)"><path class="body"/>${"<circle class=\"bubble\" r=\"1\"/>".repeat(14)}<path class="surface"/><path class="lip"/></g>
${P.map((e) => {
	let t = Math.round(E(e) + 4.95);
	return `<line class="mark" x1="182" x2="192" y1="${t}" y2="${t}"/><text class="mark-label" x="204" y="${t}" dominant-baseline="middle"></text>`;
}).join("")}
<ellipse class="rim" cx="140" cy="104" rx="56" ry="9"/>
<path class="wall" d="${N}"/>
<line class="shine" x1="93" x2="93" y1="126" y2="298"/>
</svg>`, I = (e, t, n) => Math.min(Math.max(e, t), n), L = class extends r(e) {
	static styles = A;
	static props = {
		value: {
			type: Number,
			default: 1250
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 2e3
		},
		step: {
			type: Number,
			default: 50
		},
		unit: { default: "ml" },
		label: { default: "Water today" },
		name: {},
		disabled: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = new k();
	#t = o(c, {
		step: () => this.#e.step(),
		render: () => this.#g()
	});
	#n = !1;
	#r = null;
	#i = !1;
	#a = null;
	#o = null;
	#s = !1;
	render() {
		return `<div class="slider" part="base" role="slider" aria-orientation="vertical" aria-labelledby="label"><div class="readout"><p class="label" id="label"></p><p class="value"><span class="number"></span><span class="unit"></span></p></div>${F}</div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".glass");
		this.#o ??= {
			body: t.querySelector(".body"),
			surface: t.querySelector(".surface"),
			lip: t.querySelector(".lip"),
			bubbles: [...t.querySelectorAll(".bubble")]
		}, t.addEventListener("pointerdown", (e) => this.#y(e), e), t.addEventListener("pointermove", (e) => this.#a && this.#b(e), e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, () => this.#x(), e);
		this.query(".slider").addEventListener("keydown", (e) => this.#S(e), e), s(this, (e) => {
			this.#n = e, e ? this.#h() : this.#t.stop();
		}, this.signal), this.signal.addEventListener("abort", () => {
			this.#t.stop(), this.#a = null, this.#e.held = !1;
		});
	}
	updated(e) {
		this.#r ??= this.value, e.has("label") && (this.query(".label").textContent = this.label), e.has("disabled") && this.#l();
		let t = this.#u(this.value), n = this.#d(t);
		(e.has("min") || e.has("max") || !this.#i) && this.query(".glass").querySelectorAll(".mark-label").forEach((e, t) => e.textContent = this.#f(this.min + P[t] * (this.max - this.min))), this.#p(t);
		let r = this.#e;
		this.#i ? !r.held && Math.abs(r.target - n) > 1e-6 && (r.target = n, this.#h()) : (r.target = n, r.rest(), this.#_(), this.#i = !0);
	}
	formResetCallback() {
		this.value = this.#u(this.#r);
	}
	formDisabledCallback(e) {
		this.#s = e, this.#l();
	}
	get #c() {
		return !this.disabled && !this.#s;
	}
	#l() {
		let e = this.query(".slider");
		e.tabIndex = this.#c ? 0 : -1, e.ariaDisabled = this.#c ? null : "true";
	}
	#u(e) {
		return I(Number((Math.round((e - this.min) / this.step) * this.step + this.min).toFixed(10)), this.min, this.max);
	}
	#d(e) {
		return this.max - this.min > 0 ? (e - this.min) / (this.max - this.min) : 0;
	}
	#f(e) {
		return this.formatValue ? this.formatValue(e) : e.toLocaleString("en-US");
	}
	#p(e) {
		let t = this.#f(e);
		this.query(".number").textContent = t, this.query(".unit").textContent = this.unit ?? "", Object.assign(this.query(".slider"), {
			ariaValueNow: String(e),
			ariaValueMin: String(this.min),
			ariaValueMax: String(this.max),
			ariaValueText: `${t} ${this.unit ?? ""}`.trim()
		}), this[n].setFormValue(this.name ? String(e) : null);
	}
	#m(e) {
		let t = this.#u(e);
		if (t === this.value) return;
		let n = (this.max - this.min) / 4;
		Math.floor((t - this.min) / n) !== Math.floor((this.value - this.min) / n) && i(4), this.value = t, this.#p(t), this.emit("change", { value: t });
	}
	#h() {
		a.matches ? (this.#e.rest(), this.#_()) : this.#n && this.#t.wake();
	}
	#g() {
		let e = this.#e;
		return e.pvx *= .85, e.settled ? (e.rest(), this.#_(), !1) : (this.#_(), !0);
	}
	#_() {
		let e = this.#e, { body: t, surface: n, lip: r, bubbles: i } = this.#o, a = O(E(e.level), e.heights);
		t.setAttribute("d", a.body), n.setAttribute("d", a.surface), r.setAttribute("d", a.lip), i.forEach((t, n) => {
			let r = e.bubbles[n];
			t.style.opacity = r ? "1" : "0", r && (t.setAttribute("cx", (r.x + Math.sin(r.phase) * 1.6).toFixed(2)), t.setAttribute("cy", r.y.toFixed(2)), t.setAttribute("r", r.r.toFixed(2)));
		});
	}
	#v(e) {
		let t = this.query(".glass").getBoundingClientRect();
		return {
			x: (e.clientX - t.left) / t.width * 280,
			y: (e.clientY - t.top) / t.height * 360
		};
	}
	#y(e) {
		!this.#c || this.#a || e.pointerType === "mouse" && e.button !== 0 || (e.preventDefault(), this.query(".slider").focus({ preventScroll: !0 }), e.currentTarget.setPointerCapture(e.pointerId), this.#a = {
			lastX: 0,
			lastT: 0
		}, Object.assign(this.#e, {
			held: !0,
			pvx: 0
		}), this.toggleAttribute("data-grabbing", !0), this.#b(e));
	}
	#b(e) {
		let t = this.#e, n = this.#a, r = this.#v(e), i = e.timeStamp;
		if (n.lastT && i > n.lastT) {
			let e = (r.x - n.lastX) / (i - n.lastT) * 1e3;
			t.pvx = t.pvx * .6 + I(e, -900, 900) * .4;
		}
		n.lastX = r.x, n.lastT = i, t.px = I(r.x, 84, 196), t.py = I(r.y, 120, 312);
		let a = I((312 - r.y) / 192, 0, 1);
		t.target = a, this.#m(this.min + a * (this.max - this.min)), this.#h();
	}
	#x() {
		this.#a && (this.#a = null, this.#e.held = !1, this.removeAttribute("data-grabbing"), this.#e.target = this.#d(this.value), this.#h());
	}
	#S(e) {
		if (!this.#c) return;
		let { min: t, max: n, step: r, value: i } = this, o = Math.max(r, (n - t) / 10), s = {
			ArrowUp: i + r,
			ArrowRight: i + r,
			ArrowDown: i - r,
			ArrowLeft: i - r,
			PageUp: i + o,
			PageDown: i - o,
			Home: t,
			End: n
		};
		if (!(e.key in s)) return;
		e.preventDefault();
		let c = s[e.key];
		this.#m(c), a.matches || this.#e.drop(c > i), this.#e.target = this.#d(this.value), this.#h();
	}
};
//#endregion
//#region src/components/liquid-slider/index.js
t("liquid-slider", L);
//#endregion
export { L as t };
