import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { i, n as a, r as o } from "./motion-CFWhFfc_.js";
import { a as s } from "./theme-D-ctQQvB.js";
import { n as c, t as l } from "./rolling-VjfpUD4B.js";
import { t as u } from "./visibility--H4IXDjD.js";
import { i as d, it as f, tt as p } from "./lucide-BVbUPHVq.js";
import { t as m } from "./canvas-zoeWnk3A.js";
//#region src/components/globe-hero/globe.js
var h = 64, g = .06, _ = .16, v = 4, y = (e) => e * Math.PI / 180, b = (e, t) => [
	Math.cos(e) * Math.cos(t),
	Math.cos(e) * Math.sin(t),
	Math.sin(e)
], x = (e, t) => {
	let [n, r, i] = b(e.lat, e.lon), [a, o, s] = b(t.lat, t.lon);
	return Math.acos(Math.min(1, Math.max(-1, n * a + r * o + i * s)));
}, S = (e, t) => {
	let n = x(e, t), [r, i, a] = b(e.lat, e.lon), [o, s, c] = b(t.lat, t.lon), l = Math.sin(n) || 1, u = Math.min(g, n * .05), d = /* @__PURE__ */ new Float32Array(195);
	for (let e = 0; e <= h; e++) {
		let t = e / h, f = Math.sin((1 - t) * n) / l, p = Math.sin(t * n) / l, m = f * r + p * o, g = f * i + p * s, _ = f * a + p * c;
		d[e * 3] = Math.atan2(_, Math.hypot(m, g)), d[e * 3 + 1] = Math.atan2(g, m), d[e * 3 + 2] = Math.sin(Math.PI * t) * u;
	}
	return d;
}, C = (e, t, n, r, i) => {
	let a = n - e.lon, o = Math.cos(t), s = o * Math.sin(a), c = Math.cos(e.lat) * Math.sin(t) - Math.sin(e.lat) * o * Math.cos(a), l = Math.sin(e.lat) * Math.sin(t) + Math.cos(e.lat) * o * Math.cos(a), u = e.r * (1 + r);
	return i.x = e.cx + s * u, i.y = e.cy - c * u, i.z = l, i.visible = l > 0 || Math.hypot(s, c) * (1 + r) > 1, i;
}, w = {
	x: 0,
	y: 0,
	z: 0,
	visible: !1
}, T = (e, t, n, r) => {
	e.strokeStyle = r, e.fillStyle = r, e.lineWidth = 1, e.globalAlpha = .16, e.beginPath(), e.arc(t.cx, t.cy, t.r, 0, Math.PI * 2), e.stroke(), e.globalAlpha = .12, e.beginPath(), e.ellipse(t.cx + t.r * .06, t.cy - t.r * .04, t.r * 1.08, t.r * .98, -.25, Math.PI * 1.05, Math.PI * 1.95), e.stroke();
	let i = Array.from({ length: v }, () => new Path2D()), a = Math.max(.9, t.r / 300);
	for (let e = 0; e < n.length; e += 2) {
		if (C(t, n[e], n[e + 1], 0, w), w.z <= 0) continue;
		let r = i[Math.min(3, Math.floor(w.z * v))];
		r.moveTo(w.x + a, w.y), r.arc(w.x, w.y, a, 0, Math.PI * 2);
	}
	i.forEach((t, n) => {
		e.globalAlpha = .25 + .6 * (n + 1) / v, e.fill(t);
	}), e.globalAlpha = 1;
}, E = (e, t, n, r, i) => {
	let a = n.length / 3 - 1, o = Math.max(0, Math.floor(r * a)), s = Math.min(a, Math.ceil(i * a)), c = !1;
	e.beginPath();
	for (let r = o; r <= s; r++) C(t, n[r * 3], n[r * 3 + 1], n[r * 3 + 2], w), w.visible ? (c ? e.lineTo(w.x, w.y) : e.moveTo(w.x, w.y), c = !0) : c = !1;
	e.stroke();
}, D = (e, t, n, r, i, a) => {
	e.strokeStyle = r, e.lineCap = "round";
	for (let r of n) {
		if (e.globalAlpha = r.dim ? .1 : .32, e.lineWidth = 1, E(e, t, r.points, 0, 1), a <= 0 || r.dim) continue;
		let n = (i * a + r.phase) % 1;
		e.globalAlpha = .95, e.lineWidth = 2, E(e, t, r.points, Math.max(0, n - _), n);
	}
	e.globalAlpha = 1;
}, O = (e, t, n, r) => {
	e.strokeStyle = r, e.fillStyle = r;
	for (let r of n) {
		if (C(t, r.lat, r.lon, 0, w), w.z <= .02) continue;
		let n = Math.min(1, w.z * 5);
		e.globalAlpha = n, e.beginPath(), e.arc(w.x, w.y, 2.5, 0, Math.PI * 2), e.fill(), e.lineWidth = r.selected ? 2 : 1.25, e.globalAlpha = n * (r.selected ? 1 : .8), e.beginPath(), e.arc(w.x, w.y, 7, 0, Math.PI * 2), e.stroke();
	}
	e.globalAlpha = 1;
}, k = (e, t, n, r, i) => {
	let a = null, o = i;
	for (let i of t) {
		C(e, i.lat, i.lon, 0, w);
		let t = Math.hypot(w.x - n, w.y - r);
		w.z > .02 && t < o && (a = i, o = t);
	}
	return a;
}, A = [
	[
		[-168, 66],
		[-162, 70],
		[-140, 70],
		[-120, 72],
		[-95, 72],
		[-80, 73],
		[-62, 66],
		[-55, 52],
		[-66, 45],
		[-70, 42],
		[-76, 35],
		[-81, 31],
		[-80, 25],
		[-82, 28],
		[-84, 30],
		[-90, 29],
		[-97, 27],
		[-97, 22],
		[-92, 18],
		[-87, 21],
		[-88, 16],
		[-83, 10],
		[-78, 8],
		[-80, 7],
		[-85, 11],
		[-92, 15],
		[-105, 20],
		[-112, 30],
		[-117, 33],
		[-124, 40],
		[-124, 48],
		[-130, 55],
		[-140, 60],
		[-152, 58],
		[-165, 60]
	],
	[
		[-52, 60],
		[-43, 60],
		[-22, 70],
		[-18, 77],
		[-30, 83],
		[-60, 82],
		[-72, 78],
		[-55, 70]
	],
	[
		[-24, 64],
		[-14, 64],
		[-15, 66],
		[-22, 66]
	],
	[
		[-80, 8],
		[-72, 12],
		[-62, 10],
		[-50, 0],
		[-35, -5],
		[-38, -13],
		[-40, -22],
		[-48, -26],
		[-53, -33],
		[-58, -38],
		[-65, -42],
		[-68, -52],
		[-72, -50],
		[-74, -40],
		[-71, -30],
		[-70, -18],
		[-76, -14],
		[-81, -5],
		[-80, 0]
	],
	[
		[-10, 36],
		[-9, 43],
		[-2, 44],
		[-5, 48],
		[2, 51],
		[8, 54],
		[10, 57],
		[5, 62],
		[15, 69],
		[28, 71],
		[40, 68],
		[60, 70],
		[70, 73],
		[80, 73],
		[100, 77],
		[115, 73],
		[130, 71],
		[150, 71],
		[170, 70],
		[180, 68],
		[180, 65],
		[170, 60],
		[162, 58],
		[156, 51],
		[142, 53],
		[140, 47],
		[132, 43],
		[128, 38],
		[126, 35],
		[121, 31],
		[122, 25],
		[110, 21],
		[106, 17],
		[109, 12],
		[105, 9],
		[100, 13],
		[100, 6],
		[103, 1],
		[98, 8],
		[94, 16],
		[90, 22],
		[86, 21],
		[80, 15],
		[77, 8],
		[73, 17],
		[70, 22],
		[66, 25],
		[57, 26],
		[56, 24],
		[59, 22],
		[52, 16],
		[43, 13],
		[39, 20],
		[35, 28],
		[33, 31],
		[35, 36],
		[27, 37],
		[26, 40],
		[23, 36],
		[20, 40],
		[16, 38],
		[18, 40],
		[13, 45],
		[12, 44],
		[16, 41],
		[10, 44],
		[3, 43],
		[-1, 37],
		[-6, 36]
	],
	[
		[-6, 50],
		[2, 51],
		[0, 53],
		[-2, 57],
		[-5, 58],
		[-6, 56],
		[-3, 54],
		[-5, 52]
	],
	[
		[-17, 21],
		[-13, 28],
		[-6, 36],
		[10, 37],
		[11, 33],
		[20, 31],
		[32, 31],
		[34, 28],
		[39, 20],
		[43, 12],
		[51, 12],
		[48, 5],
		[40, -3],
		[40, -15],
		[35, -24],
		[32, -28],
		[26, -34],
		[18, -34],
		[15, -27],
		[12, -17],
		[13, -6],
		[9, -1],
		[9, 4],
		[4, 6],
		[-8, 4],
		[-14, 9],
		[-17, 14]
	],
	[
		[44, -25],
		[47, -25],
		[50, -15],
		[49, -12],
		[44, -17]
	],
	[
		[130, 31],
		[135, 34],
		[140, 35],
		[142, 40],
		[141, 45],
		[139, 42],
		[136, 37],
		[131, 34]
	],
	[
		[95, 5],
		[106, -6],
		[102, -5],
		[96, 2]
	],
	[
		[109, 1],
		[117, 7],
		[119, 1],
		[116, -4],
		[110, -3]
	],
	[
		[131, -1],
		[141, -3],
		[150, -10],
		[141, -9],
		[133, -4]
	],
	[
		[114, -22],
		[122, -18],
		[130, -12],
		[137, -12],
		[142, -11],
		[146, -19],
		[153, -26],
		[150, -37],
		[141, -38],
		[135, -35],
		[129, -32],
		[115, -34]
	],
	[
		[166, -46],
		[174, -41],
		[178, -38],
		[173, -35],
		[172, -41]
	]
], j = (e, t, n) => {
	let r = !1;
	for (let i = 0, a = n.length - 1; i < n.length; a = i++) {
		let [o, s] = n[i], [c, l] = n[a];
		s > t != l > t && e < (c - o) * (t - s) / (l - s) + o && (r = !r);
	}
	return r;
}, M = (e, t) => A.some((n) => j(e, t, n)), N = (e) => {
	let t = [];
	for (let n = -58; n <= 82; n += e) {
		let r = e / Math.max(.1, Math.cos(n * Math.PI / 180));
		for (let e = -180; e < 180; e += r) M(e, n) && t.push(n * Math.PI / 180, e * Math.PI / 180);
	}
	return new Float32Array(t);
}, P = ":host{--_ink:var(--lw-color-foreground);--_muted:var(--lw-color-muted-foreground);--_shade:color-mix(in oklab, var(--lw-color-foreground) 7%, var(--lw-color-background));box-sizing:border-box;background:var(--lw-color-background);width:100%;min-height:600px;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);background:var(--lw-color-background);justify-content:flex-start;align-items:center;padding:4.5rem clamp(1.5rem,5vw,4rem);display:flex;position:relative;overflow:hidden}@media not (min-width:896px){:host{align-items:flex-start;padding-bottom:92vw}}canvas{touch-action:pan-y;outline:none;width:100%;height:100%;position:absolute;inset:0;-webkit-mask-image:linear-gradient(#000 55%,#0000 96%);mask-image:linear-gradient(#000 55%,#0000 96%)}@media not (min-width:896px){canvas{-webkit-mask-image:linear-gradient(#000 80%,#0000);mask-image:linear-gradient(#000 80%,#0000)}}@media (prefers-reduced-motion:no-preference){canvas{animation:.7s ease-out lw-fade-in}}@keyframes lw-fade-in{0%{opacity:0}}canvas:focus-visible{box-shadow:inset 0 0 0 2px var(--lw-color-ring)}:host([data-dragging]) canvas{cursor:grabbing}.shade{background:linear-gradient(to top, var(--_shade), transparent);pointer-events:none;height:45%;position:absolute;inset:auto 0 0}.probe{color:var(--_ink);display:none}.container{pointer-events:none;flex-direction:column;justify-content:center;align-self:stretch;width:100%;max-width:72rem;margin-inline:auto;display:flex;position:relative}.copy{pointer-events:none;flex-direction:column;align-items:flex-start;max-width:32rem;display:flex;position:relative}.brand{font-size:var(--lw-text-md);color:var(--_muted);margin:0;font-weight:500}::slotted([slot=eyebrow]),.actions{pointer-events:auto}.title{letter-spacing:-.045em;text-wrap:balance;background:linear-gradient(to bottom, var(--_ink) 50%, color-mix(in oklab, var(--_ink) 70%, transparent));color:#0000;-webkit-background-clip:text;background-clip:text;margin:1.25rem 0 0;font-size:clamp(2.75rem,6.5vw,5rem);font-weight:600;line-height:1}.description{max-width:28rem;font-size:var(--lw-text-lg);text-wrap:pretty;color:var(--_muted);margin:1.5rem 0 0;line-height:1.6}.actions{flex-wrap:wrap;align-items:center;gap:.75rem;margin-top:2.25rem;display:flex}.deploy::part(button),.network::part(button){border-radius:var(--lw-radius-full)}.labels{pointer-events:none;position:absolute;inset:0}.label{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--lw-color-background) 88%, transparent);box-shadow:var(--lw-shadow-sm);font:var(--lw-text-xs) var(--lw-font-mono);white-space:nowrap;color:var(--_muted);align-items:baseline;gap:.375rem;padding:.25rem .5rem;display:none;position:absolute;top:0;left:0;transform:translate(.875rem,-50%)}.label[data-shown]{display:flex}.label[data-selected]{border-color:var(--_ink)}.label .code{color:var(--_ink)}.pause{position:absolute;bottom:2rem;right:max(clamp(1.5rem,5vw,4rem),50% - 36rem)}.pause::part(button){border:1px solid var(--lw-color-border);border-radius:50%}", F = 1.25, I = 896, L = .06, R = 2500, z = 1.05, B = .2, V = 4, H = 14, U = .22, W = 2, G = 1400, K = o(.7, .05), q = .12, J = {
	w: 96,
	h: 26
}, Y = [
	{
		id: "sfo1",
		name: "San Francisco",
		lat: 37.7,
		lon: -122.4,
		ms: 12
	},
	{
		id: "iad1",
		name: "Washington",
		lat: 38.9,
		lon: -77.4,
		ms: 10
	},
	{
		id: "gru1",
		name: "São Paulo",
		lat: -23.5,
		lon: -46.6,
		ms: 20
	},
	{
		id: "lhr1",
		name: "London",
		lat: 51.5,
		lon: -.1,
		ms: 8
	},
	{
		id: "fra1",
		name: "Frankfurt",
		lat: 50.1,
		lon: 8.7,
		ms: 6
	},
	{
		id: "cpt1",
		name: "Cape Town",
		lat: -33.9,
		lon: 18.4,
		ms: 18
	},
	{
		id: "bom1",
		name: "Mumbai",
		lat: 19.1,
		lon: 72.9,
		ms: 14
	},
	{
		id: "sin1",
		name: "Singapore",
		lat: 1.35,
		lon: 103.8,
		ms: 9
	},
	{
		id: "hnd1",
		name: "Tokyo",
		lat: 35.6,
		lon: 139.8,
		ms: 7
	},
	{
		id: "syd1",
		name: "Sydney",
		lat: -33.9,
		lon: 151.2,
		ms: 11
	}
], X = [
	["iad1", "gru1"],
	["iad1", "lhr1"],
	["sfo1", "iad1"],
	["lhr1", "fra1"],
	["fra1", "cpt1"],
	["fra1", "bom1"],
	["bom1", "sin1"],
	["sin1", "hnd1"],
	["sin1", "syd1"],
	["sfo1", "hnd1"]
], Z = (e) => Math.atan2(Math.sin(e), Math.cos(e)), Q = class extends e {
	static styles = [c, P];
	static props = {
		brand: { default: "lower Build Farm" },
		heading: { default: "Every build runs next door." },
		description: { default: "Push once and the build runs in the closest of 38 regions. The object cache follows you, so no link step waits on an ocean." },
		regions: {
			type: Object,
			default: Y
		},
		routes: {
			type: Object,
			default: X
		},
		region: { default: "" },
		paused: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = null;
	#t = N(F);
	#n = {
		cx: 0,
		cy: 0,
		r: 0,
		lon: y(-58),
		lat: y(6)
	};
	#r = [];
	#i = [];
	#a = "";
	#o = 0;
	#s = 0;
	#c = null;
	#l = null;
	#u = 0;
	#d = 0;
	#f = 0;
	#p = !1;
	#m = 0;
	render() {
		return `<canvas tabindex="0" role="img"></canvas><div class="shade" aria-hidden="true"></div><div class="labels" aria-hidden="true"></div><span class="probe"></span>
<div class="container"><div class="copy"><slot name="eyebrow"><p class="brand"></p></slot><h1 class="title"></h1><p class="description"></p>
<div class="actions"><slot name="actions"><lw-button class="deploy">Start building<span slot="end">${r(d, 16)}</span></lw-button><lw-button class="network" variant="ghost">See the regions</lw-button></slot></div></div>
</div><lw-button class="pause" variant="ghost" icon-only aria-pressed="false"></lw-button>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query("canvas");
		this.#e = t.getContext("2d");
		let n = new ResizeObserver(() => this.#_());
		n.observe(this), this.signal.addEventListener("abort", () => {
			n.disconnect(), cancelAnimationFrame(this.#u), this.#u = 0, clearInterval(this.#m), this.#l?.();
		}), u(this, (e) => {
			this.#p = e, this.#C();
		}, this.signal), s(() => {
			this.#a = getComputedStyle(this.query(".probe")).color, this.#y();
		}, this.signal), t.addEventListener("pointerdown", (e) => this.#k(e), e), t.addEventListener("pointermove", (e) => this.#A(e), e);
		for (let n of ["pointerup", "pointercancel"]) t.addEventListener(n, (e) => this.#j(e), e);
		t.addEventListener("keydown", (e) => this.#M(e), e), this.query(".pause").addEventListener("click", () => this.paused = !this.paused, e), this.#m = setInterval(() => this.#S(), G);
	}
	updated(e) {
		if (this.query(".brand").textContent = this.brand ?? "", this.query(".title").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", (e.has("regions") || e.has("routes")) && this.#h(), (e.has("region") || e.has("regions") || e.has("routes")) && this.#g(this.region), e.has("paused")) {
			let e = this.query(".pause");
			e.innerHTML = r(this.paused ? f : p, 16), e.ariaLabel = this.paused ? "Play the globe" : "Pause the globe", e.setAttribute("aria-pressed", String(!!this.paused)), this.#C();
		}
		this.#y();
	}
	#h() {
		this.#r = this.regions.map((e) => ({
			...e,
			lat: y(e.lat),
			lon: y(e.lon),
			base: e.ms ?? 10,
			selected: !1
		}));
		let e = new Map(this.#r.map((e) => [e.id, e]));
		this.#i = this.routes.map(([t, n], r) => ({
			from: e.get(t),
			to: e.get(n),
			phase: r * .37 % 1,
			dim: !1
		})).filter(({ from: e, to: t }) => e && t).map((e) => ({
			...e,
			points: S(e.from, e.to)
		})), this.query(".labels").innerHTML = this.#r.map((e) => `<span class="label"><span class="code">${n(e.id)}</span><span class="ms rolling"></span><span class="unit">ms</span></span>`).join(""), this.#x(), this.query("canvas").ariaLabel = `Globe of ${this.#r.length} regions: ${this.#r.map((e) => e.name).join(", ")}. Drag or use the arrow keys to turn it.`;
	}
	#g(e) {
		let t = this.#r.find((t) => t.id === e);
		for (let e of this.#r) e.selected = e === t;
		for (let e of this.#i) e.dim = !!t && e.from !== t && e.to !== t;
		t && this.#E(t);
	}
	#_() {
		let e = this.query("canvas"), { width: t, height: n } = m(e, this.#e);
		if (t >= I) {
			let t = this.query(".container").getBoundingClientRect(), r = t.left - e.getBoundingClientRect().left, i = Math.min(n * .46, t.width * .34);
			Object.assign(this.#n, {
				cx: r + t.width - i,
				cy: n * .54,
				r: i
			});
		} else {
			let e = t * .62;
			Object.assign(this.#n, {
				cx: t * .55,
				cy: n - e * .4,
				r: e
			});
		}
		this.#a = getComputedStyle(this.query(".probe")).color, this.#y();
	}
	get #v() {
		return !this.paused && !a.matches;
	}
	#y() {
		let e = this.#e, t = this.#n;
		if (!e || !t.r) return;
		let n = this.query("canvas");
		e.clearRect(0, 0, n.width, n.height), T(e, t, this.#t, this.#a), D(e, t, this.#i, this.#a, this.#f, a.matches ? 0 : U), O(e, t, this.#r, this.#a), this.#b();
	}
	#b() {
		let e = this.query(".labels").children, t = {
			x: 0,
			y: 0,
			z: 0,
			visible: !1
		}, n = [], r = this.#r.map((e, n) => ({
			place: e,
			i: n,
			z: C(this.#n, e.lat, e.lon, 0, t).z
		})).sort((e, t) => t.z - e.z);
		for (let { place: i, i: a } of r) {
			C(this.#n, i.lat, i.lon, 0, t);
			let r = e[a], o = {
				x: t.x,
				y: t.y
			}, s = !n.some((e) => Math.abs(e.x - o.x) < J.w && Math.abs(e.y - o.y) < J.h), c = t.z > q && (s || i.selected);
			r.toggleAttribute("data-shown", c), r.toggleAttribute("data-selected", i.selected), c && (n.push(o), r.style.translate = `${t.x.toFixed(1)}px ${t.y.toFixed(1)}px`, r.style.opacity = String(Math.min(1, (t.z - q) * 4)));
		}
	}
	#x() {
		let e = this.query(".labels").children;
		this.#r.forEach((t, n) => l(e[n].querySelector(".ms"), String(t.ms ?? t.base)));
	}
	#S() {
		if (this.#p && this.#v) {
			for (let e of this.#r) e.ms = Math.max(1, e.base + Math.round((Math.random() * 2 - 1) * W));
			this.#x();
		}
	}
	#C() {
		this.#u || !this.#p || !this.#v || (this.#d = performance.now(), this.#u = requestAnimationFrame((e) => this.#w(e)));
	}
	#w(e) {
		if (this.#u = 0, !this.#p) return;
		let t = Math.min((e - this.#d) / 1e3, .05);
		this.#d = e;
		let n = this.#n;
		this.#v && (this.#f += t, !this.#c && !this.#l && (this.#o *= Math.exp(-2.8 * t), n.lon += this.#o * t, e > this.#s && !this.region && (n.lon += L * t))), this.#y(), this.#v && (this.#u = requestAnimationFrame((e) => this.#w(e)));
	}
	#T() {
		this.#s = performance.now() + R;
	}
	#E(e) {
		this.#l?.();
		let t = this.#n, n = {
			lon: t.lon,
			lat: t.lat
		}, r = Z(e.lon - n.lon), o = Math.max(-1.05, Math.min(z, e.lat)) - n.lat;
		this.#o = 0;
		let s = () => {
			this.#l = null, this.#T(), this.#y();
		};
		a.matches ? (Object.assign(t, {
			lon: n.lon + r,
			lat: n.lat + o
		}), s()) : this.#l = i(0, 1, {
			...K,
			update: (e) => {
				t.lon = n.lon + r * e, t.lat = n.lat + o * e, this.#u || this.#y();
			},
			done: s
		});
	}
	#D(e) {
		e !== this.region && (this.region = e, this.emit("select", { region: this.regions.find((t) => t.id === e) ?? null }));
	}
	#O(e) {
		let t = e.currentTarget.getBoundingClientRect(), n = this.#n;
		return Math.hypot(e.clientX - t.left - n.cx, e.clientY - t.top - n.cy) <= n.r * 1.04;
	}
	#k(e) {
		if (!e.isPrimary || e.button !== 0 || !this.#n.r || !this.#O(e)) return;
		e.currentTarget.setPointerCapture(e.pointerId), this.#l?.(), this.#l = null;
		let t = this.#n;
		this.#c = {
			x: e.clientX,
			y: e.clientY,
			lon: t.lon,
			lat: t.lat,
			moved: !1,
			lastX: e.clientX,
			lastT: e.timeStamp
		}, this.#o = 0, this.toggleAttribute("data-dragging", !0);
	}
	#A(e) {
		let t = this.#c;
		if (!t) return;
		let n = this.#n, r = e.clientX - t.x, i = e.clientY - t.y;
		Math.hypot(r, i) > V && (t.moved = !0), n.lon = t.lon - r / n.r, n.lat = Math.max(-1.05, Math.min(z, t.lat + i / n.r));
		let a = (e.timeStamp - t.lastT) / 1e3;
		a > 0 && (this.#o = -(e.clientX - t.lastX) / n.r / a), t.lastX = e.clientX, t.lastT = e.timeStamp, this.#T(), this.#u || this.#y();
	}
	#j(e) {
		let t = this.#c;
		if (!t || (this.#c = null, this.toggleAttribute("data-dragging", !1), this.#T(), e.timeStamp - t.lastT > 80 && (this.#o = 0), t.moved)) return;
		this.#o = 0;
		let n = e.currentTarget.getBoundingClientRect(), r = k(this.#n, this.#r, e.clientX - n.left, e.clientY - n.top, H);
		this.#D(r?.id ?? "");
	}
	#M(e) {
		let t = this.#n, n = {
			ArrowLeft: [B, 0],
			ArrowRight: [-.2, 0],
			ArrowUp: [0, -.2],
			ArrowDown: [0, B]
		}[e.key];
		e.key === "Escape" && this.#D(""), n && (e.preventDefault(), this.#l?.(), this.#l = null, t.lon += n[0], t.lat = Math.max(-1.05, Math.min(z, t.lat + n[1])), this.#T(), this.#y());
	}
};
//#endregion
//#region src/components/globe-hero/index.js
t("globe-hero", Q);
//#endregion
export { Q as t };
