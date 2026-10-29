import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./motion-CFWhFfc_.js";
import { a as i } from "./theme-D-ctQQvB.js";
//#region src/components/activity-terrain/activity-terrain.scss?inline
var a = ":host{--_level-0:var(--lightningcss-light,#f4f4f5)var(--lightningcss-dark,#27272a);--_level-1:var(--lightningcss-light,#d4d4d8)var(--lightningcss-dark,#3f3f46);--_level-2:var(--lightningcss-light,#a1a1aa)var(--lightningcss-dark,#71717a);--_level-3:var(--lightningcss-light,#52525b)var(--lightningcss-dark,#a1a1aa);--_level-4:var(--lightningcss-light,#18181b)var(--lightningcss-dark,#f4f4f5);--_accent:var(--lw-activity-terrain-accent,var(--lightningcss-light,#10b981)var(--lightningcss-dark,#34d399));--_ground:var(--lightningcss-light,#a1a1aa)var(--lightningcss-dark,#71717a);border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:100%;max-width:42rem;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);-webkit-user-select:none;user-select:none;border-radius:1.5rem;display:block}p{margin:0}.top{justify-content:space-between;align-items:flex-start;gap:1rem;padding:1.25rem 1.25rem 0;display:flex}.titles{min-width:0}.heading{font-size:var(--lw-text-sm);font-weight:500}.readout{font-size:var(--lw-text-sm);font-variant-numeric:tabular-nums;text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-muted-foreground);margin-top:.125rem;overflow:hidden}.views{border-radius:var(--lw-radius-full);background:var(--lw-color-muted);flex:none;padding:2px;display:flex}.views button{border-radius:var(--lw-radius-full);font:500 var(--lw-text-xs) var(--lw-font-sans);color:var(--lw-color-muted-foreground);cursor:pointer;background:0 0;border:0;outline:none;padding:.25rem .75rem;transition:background-color .2s ease-out,color .2s ease-out}.views button:hover{color:var(--lw-color-foreground)}.views button[aria-pressed=true]{background:var(--lw-color-background);box-shadow:var(--lw-shadow-sm);color:var(--lw-color-foreground)}.views button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}canvas{cursor:grab;touch-action:pan-y;border-radius:0 0 1.5rem 1.5rem;outline:none;width:100%;height:18rem;display:block}canvas[data-dragging]{cursor:grabbing}canvas:focus-visible{box-shadow:inset 0 0 0 2px var(--lw-color-ring)}.legend{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);justify-content:flex-end;align-items:center;gap:.25rem;padding:0 1.25rem 1rem;display:flex}.legend>span:first-child{margin-right:.25rem}.legend>span:nth-child(7){margin-left:.25rem}.swatch{border-radius:3px;width:.625rem;height:.625rem}.level-0{background:var(--_level-0)}.level-1{background:var(--_level-1)}.level-2{background:var(--_level-2)}.level-3{background:var(--_level-3)}.level-4{background:var(--_level-4)}.accent{background:var(--_accent)}.ground{background:var(--_ground)}", o = 7, s = .18, c = 4.2, l = Math.PI / 180, u = 56 * l, d = 18 * l, f = 38 * l, p = 66 * l, m = .32 * l, h = .36 * l, g = .16, _ = d * Math.LN2 / g, v = 140, y = 2 * Math.sqrt(v), b = 180, x = 400, S = 2 * Math.sqrt(x) * .7, C = .45, w = .7, T = 5e-4, E = 1 / 120, D = [
	"Mon",
	"",
	"Wed",
	"",
	"Fri",
	"",
	""
], O = (e, t, n) => Math.min(n, Math.max(t, e)), k = (e) => {
	let t = e - 1;
	return 1 + 2.4 * t * t * t + 1.4 * t * t;
}, A = (e, t, n) => e < t ? t - .18 * (1 - Math.exp((e - t) / .18)) : e > n ? n + .18 * (1 - Math.exp((n - e) / .18)) : e, j = (e) => {
	let t = 7, n = () => (t = t * 16807 % 2147483647, t / 2147483647);
	return Array.from({ length: e * o }, (e, t) => {
		let r = t % o >= 5, i = .55 + .45 * Math.sin(t / 23), a = n() > .82 ? 2.2 : 1;
		return n() < (r ? .55 : .12) ? 0 : Math.round((r ? 3 : 9) * i * a * n());
	});
}, M = (e) => {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(Date.UTC(t, n - 1, r));
}, N = (e, t) => {
	let n = M(t), r = /* @__PURE__ */ new Date(n.getTime() - (e.length - 1) * 864e5), i = (r.getUTCDay() + 6) % 7, a = Math.max(1, ...e);
	return e.map((e, t) => {
		let n = t + i, s = e / a;
		return {
			index: t,
			col: Math.floor(n / o),
			row: n % o,
			count: e,
			level: e === 0 ? 0 : Math.ceil(s * 4),
			height: .06 + s ** .85 * c,
			date: new Date(r.getTime() + t * 864e5)
		};
	});
}, P = (e) => (e.match(/[\d.]+/g) ?? [
	"136",
	"136",
	"136"
]).slice(0, 3).map(Number), F = ([e, t, n], r) => `rgb(${Math.round(e * (1 - r))},${Math.round(t * (1 - r))},${Math.round(n * (1 - r))})`, I = (e, t, n, r) => {
	let i = Math.cos(e.yaw), a = Math.sin(e.yaw), o = t * i - r * a, s = t * a + r * i;
	return [e.cx + o * e.scale, e.cy + (s * Math.cos(e.pitch) - n * Math.sin(e.pitch)) * e.scale];
}, L = (e, t, n, r) => {
	let i = t + 1 - s, a = n + 1 - s, o = (t, n, r) => I(e, t, n, r), c = [], l = Math.sin(e.yaw);
	if (r > .02 && e.pitch > .01) {
		let s = Math.cos(e.yaw) > 0 ? a : n;
		if (c.push({
			points: [
				o(t, 0, s),
				o(i, 0, s),
				o(i, r, s),
				o(t, r, s)
			],
			tone: .22
		}), Math.abs(l) > .001) {
			let e = l > 0 ? i : t;
			c.push({
				points: [
					o(e, 0, n),
					o(e, 0, a),
					o(e, r, a),
					o(e, r, n)
				],
				tone: .38
			});
		}
	}
	return c.push({
		points: [
			o(t, r, n),
			o(i, r, n),
			o(i, r, a),
			o(t, r, a)
		],
		tone: 0
	}), c;
}, R = (e, t, n) => {
	let r = !1;
	for (let i = 0, a = e.length - 1; i < e.length; a = i++) {
		let [o, s] = e[i], [c, l] = e[a];
		s > n != l > n && t < (c - o) * (n - s) / (l - s) + o && (r = !r);
	}
	return r;
}, z = (e) => e.toLocaleDateString("en-US", {
	weekday: "short",
	month: "short",
	day: "numeric",
	timeZone: "UTC"
}), B = (e) => e.toLocaleDateString("en-US", {
	month: "short",
	timeZone: "UTC"
}), V = class extends e {
	static styles = a;
	static props = {
		data: {
			type: Object,
			default: j(26)
		},
		endDate: { default: "2026-10-11" },
		heading: { default: "Activity" },
		flat: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = [];
	#t = 1;
	#n = 0;
	#r = 0;
	#i = 0;
	#a = 0;
	#o = u;
	#s = /* @__PURE__ */ new Float64Array();
	#c = /* @__PURE__ */ new Float64Array();
	#l = -1;
	#u = {
		col: 0,
		row: 3
	};
	#d = {
		width: 0,
		height: 0,
		dpr: 1
	};
	#f = null;
	#p = !1;
	#m = !1;
	#h = null;
	#g = 0;
	#_ = r(E, {
		step: () => this.#w(),
		render: () => {
			this.#k();
			let e = !!this.#f || this.#g > T;
			return this.#g = 0, e;
		}
	});
	render() {
		return `<div class="top"><div class="titles"><p class="heading"></p><p class="readout" aria-live="polite"></p></div><div class="views"><button type="button" data-flat="true">Flat</button><button type="button" data-flat="false">Terrain</button></div></div>
<canvas role="img" tabindex="0"></canvas>
<div class="legend"><span>Less</span>${[
			0,
			1,
			2,
			3,
			4
		].map((e) => `<span class="swatch level-${e}"></span>`).join("")}<span>More</span><span class="accent" hidden></span><span class="ground" hidden></span></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query("canvas");
		t.addEventListener("pointerdown", (e) => this.#I(e), e), t.addEventListener("pointermove", (e) => this.#L(e), e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, (e) => this.#R(e), e);
		t.addEventListener("pointerleave", (e) => !this.#f && e.pointerType === "mouse" && this.#P(null), e), t.addEventListener("keydown", (e) => this.#z(e), e), this.query(".views").addEventListener("click", (e) => this.#N(e), e);
		let n = new ResizeObserver(() => this.#b());
		n.observe(t);
		let r = new IntersectionObserver(([e]) => {
			this.#p = e.isIntersecting, this.#x();
		});
		r.observe(t), document.addEventListener("visibilitychange", () => this.#x(), e), i(() => {
			this.#h = null, this.#k();
		}, this.signal), this.signal.addEventListener("abort", () => {
			n.disconnect(), r.disconnect(), this.#_.stop();
		});
	}
	updated(e) {
		(e.has("data") || e.has("endDate")) && (this.#e = N(this.data, this.endDate), this.#t = (this.#e.at(-1)?.col ?? 0) + 1, this.#s = new Float64Array(this.#e.length), this.#c = new Float64Array(this.#e.length), this.#l = -1), e.has("flat") && (this.#o = this.flat ? 0 : u);
		for (let e of this.shadowRoot.querySelectorAll(".views button")) e.ariaPressed = String(e.dataset.flat === "true" == !!this.flat);
		this.query(".heading").textContent = this.heading ?? "", this.query("canvas").ariaLabel = `${this.heading}: ${this.#v} contributions over ${this.#t} weeks. Use the arrow keys to read each day.`, this.#y(), this.#b(), this.#S();
	}
	get #v() {
		return this.data.reduce((e, t) => e + t, 0);
	}
	#y() {
		let e = this.#e[this.#l];
		this.query(".readout").textContent = e ? `${e.count} ${e.count === 1 ? "contribution" : "contributions"} on ${z(e.date)}` : `${this.#v.toLocaleString("en-US")} contributions in the last ${this.#t} weeks`;
	}
	#b() {
		let e = this.query("canvas"), t = Math.min(window.devicePixelRatio || 1, 2);
		this.#d = {
			width: e.clientWidth,
			height: e.clientHeight,
			dpr: t
		}, e.width = Math.round(this.#d.width * t), e.height = Math.round(this.#d.height * t), this.#k();
	}
	#x() {
		this.#p && !document.hidden ? (this.#m || (this.#m = !0, this.#o > 0 && this.#C()), this.#S()) : this.#_.stop();
	}
	#S() {
		n.matches ? (this.#i = this.#o, this.#o === 0 && (this.#n = 0), this.#n = O(this.#n, -f, f), this.#a = this.#r = 0, this.#s.fill(0), this.#k()) : this.#p && !document.hidden && this.#_.wake();
	}
	#C() {
		Math.abs(this.#n) > 2 * l || (n.matches ? this.#n = d : this.#r = _);
	}
	#w() {
		let e = 0;
		if (!this.#f) {
			this.#r *= .5 ** (E / g);
			let t = this.#o === 0 ? 0 : O(this.#n, -f, f);
			t !== this.#n && (this.#r += ((t - this.#n) * b - this.#r * 2 * Math.sqrt(b)) * E), this.#n += this.#r * E, this.#a += ((this.#o - this.#i) * v - this.#a * y) * E, this.#i += this.#a * E, e = Math.max(Math.abs(this.#r), Math.abs(t - this.#n), Math.abs(this.#a), Math.abs(this.#o - this.#i));
		}
		for (let t = 0; t < this.#s.length; t++) {
			let n = t === this.#l && this.#i > .1 ? C : 0;
			this.#c[t] += ((n - this.#s[t]) * x - this.#c[t] * S) * E, this.#s[t] += this.#c[t] * E, e = Math.max(e, Math.abs(this.#c[t]) * .1, Math.abs(n - this.#s[t]));
		}
		this.#g = Math.max(this.#g, e);
	}
	#T(e, t) {
		let n = Math.hypot(this.#t, o) || 1, r = Math.hypot(e.col - this.#u.col, e.row - this.#u.row) / n;
		return e.height * k(O(t * 1.7 - r * w, 0, 1)) + this.#s[e.index];
	}
	#E() {
		let e = O(this.#i / u, 0, 1.2), t = this.#t, n = {
			yaw: this.#n,
			pitch: this.#i,
			scale: 1,
			cx: 0,
			cy: 0
		}, [r, i, a, s] = [
			Infinity,
			-Infinity,
			Infinity,
			-Infinity
		];
		for (let [l, u] of [
			[0, 0],
			[t, 0],
			[0, o],
			[t, o]
		]) for (let d of [0, c * Math.min(e, 1)]) {
			let [e, c] = I(n, l - t / 2, d, u - o / 2);
			[r, i, a, s] = [
				Math.min(r, e),
				Math.max(i, e),
				Math.min(a, c),
				Math.max(s, c)
			];
		}
		let { width: l, height: d } = this.#d, f = Math.min((l - 56) / (i - r), (d - 56) / (s - a));
		return {
			yaw: this.#n,
			pitch: this.#i,
			scale: f,
			cx: l / 2 - (r + i) / 2 * f,
			cy: d / 2 - (a + s) / 2 * f + 6,
			lift: e
		};
	}
	#D(e) {
		let t = Math.sin(e.yaw), n = Math.cos(e.yaw), r = (e) => (e.col + .5 - this.#t / 2) * t + (e.row + .5 - o / 2) * n;
		return [...this.#e].sort((e, t) => r(e) - r(t));
	}
	get #O() {
		if (this.#h) return this.#h;
		let e = (e) => getComputedStyle(this.query(e)).backgroundColor;
		return this.#h = {
			levels: [
				0,
				1,
				2,
				3,
				4
			].map((t) => P(e(`.level-${t}`))),
			accent: P(e(".accent")),
			text: e(".ground"),
			font: getComputedStyle(this).fontFamily
		}, this.#h;
	}
	#k() {
		let { width: e, height: t, dpr: n } = this.#d, r = this.query("canvas").getContext("2d");
		if (!r || !e) return;
		let i = this.#O, a = this.#E();
		r.setTransform(n, 0, 0, n, 0, 0), r.clearRect(0, 0, e, t), this.#A(r, a, i), r.lineJoin = "round";
		for (let e of this.#D(a)) {
			let t = e.index === this.#l ? i.accent : i.levels[e.level];
			for (let n of L(a, e.col - this.#t / 2, e.row - o / 2, this.#T(e, a.lift))) {
				r.beginPath(), n.points.forEach(([e, t], n) => n ? r.lineTo(e, t) : r.moveTo(e, t)), r.closePath();
				let e = F(t, n.tone);
				r.fillStyle = e, r.fill(), r.strokeStyle = e, r.lineWidth = .6, r.stroke();
			}
		}
	}
	#A(e, t, n) {
		let r = O(1 - t.lift * 1.6, 0, 1);
		if (!r) return;
		let i = this.#t;
		e.globalAlpha = r, e.fillStyle = n.text, e.font = `11px ${n.font}`, e.textBaseline = "middle", e.textAlign = "left";
		let a = -1;
		for (let n of this.#e) {
			if (n.row !== 0 && n.index !== 0) continue;
			let r = n.date.getUTCMonth();
			if (r === a || n.col >= i - 1) continue;
			a = r;
			let [s, c] = I(t, n.col - i / 2, 0, -.75 - o / 2);
			e.fillText(B(n.date), s, c);
		}
		e.textAlign = "right", D.forEach((n, r) => {
			if (!n) return;
			let [a, s] = I(t, -.35 - i / 2, 0, r + .4 - o / 2);
			e.fillText(n, a, s);
		}), e.globalAlpha = 1;
	}
	#j(e, t) {
		let n = this.#E(), r = this.#D(n);
		for (let i = r.length - 1; i >= 0; i--) {
			let a = r[i];
			for (let r of L(n, a.col - this.#t / 2, a.row - o / 2, this.#T(a, n.lift))) if (R(r.points, e, t)) return a;
		}
		return null;
	}
	#M(e, t) {
		this.#u = t ?? {
			col: e ? this.#t : 0,
			row: 3
		}, this.#r = 0, e !== !!this.flat && (this.flat = e, this.emit("change", { flat: e })), this.#o = e ? 0 : u, e || this.#C(), this.#S();
	}
	#N(e) {
		let t = e.target.closest("button");
		t && this.#M(t.dataset.flat === "true");
	}
	#P(e) {
		let t = e ? e.index : -1;
		t !== this.#l && (this.#l = t, this.#y(), n.matches ? this.#k() : this.#S());
	}
	#F(e) {
		let t = this.query("canvas").getBoundingClientRect();
		return {
			x: e.clientX - t.left,
			y: e.clientY - t.top
		};
	}
	#I(e) {
		if (e.pointerType === "mouse" && e.button !== 0) return;
		let { x: t, y: n } = this.#F(e);
		e.currentTarget.setPointerCapture?.(e.pointerId);
		let r = this.#j(t, n);
		r && (this.#u = {
			col: r.col,
			row: r.row
		}), this.#f = {
			id: e.pointerId,
			x: e.clientX,
			y: e.clientY,
			yaw: this.#n,
			pitch: this.#i,
			moved: !1,
			samples: [{
				t: e.timeStamp,
				x: e.clientX,
				y: e.clientY
			}]
		}, this.#r = this.#a = 0, this.query("canvas").toggleAttribute("data-dragging", !0), this.#P(r), this.#S();
	}
	#L(e) {
		let t = this.#f;
		if (t?.id !== e.pointerId) {
			if (e.pointerType === "mouse") {
				let { x: t, y: n } = this.#F(e);
				this.#P(this.#j(t, n));
			}
			return;
		}
		let r = e.clientX - t.x, i = e.clientY - t.y;
		t.moved ||= Math.hypot(r, i) > 4, t.moved && (this.#n = A(t.yaw + r * m, -f, f), this.#i = A(t.pitch + i * h, 0, p), t.samples.push({
			t: e.timeStamp,
			x: e.clientX,
			y: e.clientY
		}), t.samples.length > 5 && t.samples.shift(), n.matches ? this.#k() : this.#S());
	}
	#R(e) {
		let t = this.#f;
		if (t?.id !== e.pointerId) return;
		if (this.#f = null, this.query("canvas").removeAttribute("data-dragging"), !t.moved) {
			this.#S();
			return;
		}
		let n = t.samples[0], r = t.samples.at(-1), i = Math.max((r.t - n.t) / 1e3, .016), a = e.timeStamp - r.t < 80;
		this.#r = a ? (r.x - n.x) / i * m : 0, this.#a = a ? (r.y - n.y) / i * h : 0;
		let o = this.#i + this.#a * .15 < u / 2;
		o !== !!this.flat && (this.flat = o, this.emit("change", { flat: o })), this.#o = o ? 0 : u, this.#S();
	}
	#z(e) {
		let t = {
			ArrowLeft: [-1, 0],
			ArrowRight: [1, 0],
			ArrowUp: [0, -1],
			ArrowDown: [0, 1]
		}[e.key];
		if (!t) return;
		e.preventDefault();
		let n = this.#e[this.#l] ?? this.#e.at(-1);
		n && this.#P(this.#e.find((e) => e.col === n.col + t[0] && e.row === n.row + t[1]) ?? n);
	}
};
//#endregion
//#region src/components/activity-terrain/index.js
t("activity-terrain", V);
//#endregion
export { V as t };
