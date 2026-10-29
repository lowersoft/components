import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { a as i, n as a, t as o } from "./motion-CFWhFfc_.js";
import { $ as s, F as c, I as l, N as u, Tt as ee, t as te, yt as ne } from "./lucide-BVbUPHVq.js";
//#region src/components/bento-grid/bento-grid.scss?inline
var d = ":host{--_accent:var(--lw-bento-grid-accent,var(--lightningcss-light,#2563eb)var(--lightningcss-dark,#60a5fa));width:100%;max-width:56rem;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);display:block}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.grid{perspective:1400px;grid-template-columns:repeat(6,minmax(0,1fr));grid-auto-rows:176px;gap:12px;display:grid;position:relative}:host([data-narrow]) .grid{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-flow:dense}.slots{width:calc(100% + 12px);height:calc(100% + 12px);fill:var(--lw-color-ring);pointer-events:none;position:absolute;top:-6px;left:-6px;overflow:visible}.slots[hidden]{display:none}.cell{grid-column:span var(--_span,2);-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;transition:opacity .2s ease-out;position:relative}:host([data-narrow]) .cell{grid-column:span var(--_span-n,1)}.cell[data-dimmed]{opacity:.45}.cell[data-lifted]{z-index:20}.surface{border:1px solid var(--lw-color-border);background:var(--lw-color-background);transform-origin:0 0;pointer-events:none;border-radius:1rem;transition:border-color .2s ease-out;position:absolute;inset:0}[data-lifted]>.surface{border-color:var(--lw-color-ring)}.shadow{border-radius:inherit;opacity:0;position:absolute;inset:0;box-shadow:0 24px 48px -16px #00000038,0 8px 16px -8px #0000001f}.inner{box-sizing:border-box;flex-direction:column;height:100%;padding:.75rem 1rem 1rem;display:flex;position:relative}.head{flex:none;align-items:center;gap:.5rem;height:1.75rem;margin-bottom:.5rem;display:flex}.icon{color:var(--lw-color-muted-foreground);display:grid}.name{text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-muted-foreground);font-size:13px;font-weight:500;overflow:hidden}button{font:inherit;color:var(--lw-color-muted-foreground);background:0 0;border:0;outline:none;padding:0}.grip{border-radius:var(--lw-radius-sm);cursor:grab;touch-action:none;width:1.75rem;height:1.75rem;transition:background-color var(--lw-duration-fast) ease-out, color var(--lw-duration-fast) ease-out;flex:none;place-items:center;margin:0 -.5rem 0 auto;display:grid}.grip:hover,.grip[aria-pressed=true]{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.grip[aria-pressed=true]{cursor:grabbing}.grip:focus-visible{box-shadow:0 0 0 2px var(--_accent)}.resize{box-sizing:border-box;cursor:ew-resize;touch-action:none;opacity:0;width:1.75rem;height:1.75rem;transition:opacity var(--lw-duration-fast) ease-out;border-bottom-right-radius:1rem;justify-content:flex-end;align-items:flex-end;padding:.375rem;display:flex;position:absolute;bottom:0;right:0}.cell:hover .resize,.resize:focus-visible{opacity:1}@media (hover:none){.resize{opacity:.7}}.resize:hover{color:var(--lw-color-foreground)}.resize:focus-visible{color:var(--_accent)}.resize svg{fill:currentColor;width:.625rem;height:.625rem}.body{flex:1;min-height:0;position:relative}.view{font-size:var(--lw-text-xs);position:absolute;inset:0}p{margin:0}.muted{color:var(--lw-color-muted-foreground)}.stack{flex-direction:column;gap:.75rem;height:100%;display:flex}.stack.end{justify-content:flex-end;gap:.5rem}.stack.between{justify-content:space-between;gap:.5rem}.inline{align-items:baseline;gap:.5rem;display:flex}.fill{flex:1;min-height:0}.split{grid-template-columns:1.4fr 1fr;gap:1.5rem;height:100%;display:grid}.split>.stack{min-width:0}.value{font-variant-numeric:tabular-nums;letter-spacing:-.02em;font-size:1.5rem;font-weight:600}.value.big{font-size:1.875rem}.title{font-size:var(--lw-text-sm);font-weight:500}.note{margin-top:.25rem}.up{color:var(--_accent);font-weight:500}.spark{width:100%;height:2.5rem;overflow:visible}.spark polyline{fill:none;stroke:var(--_accent);stroke-width:1.75px;stroke-linecap:round;stroke-linejoin:round}.rows{flex-direction:column;justify-content:flex-end;gap:.375rem;margin:0;display:flex}.rows div{border-bottom:1px solid var(--lw-color-muted);justify-content:space-between;align-items:baseline;padding-bottom:.375rem;display:flex}.rows div:last-child{border:0;padding-bottom:0}.rows dt{color:var(--lw-color-muted-foreground)}.rows dd{font-variant-numeric:tabular-nums;margin:0;font-weight:500}.bars{flex-direction:column;gap:.25rem;height:100%;min-height:0;display:flex}.columns,.labels{gap:.25rem;display:flex}.columns>*,.labels>*{flex:1}.columns{flex:1;align-items:flex-end;min-height:0}.columns span{background:var(--lw-color-border);border-radius:3px}.columns span.on{background:var(--_accent)}.labels span{text-align:center;color:var(--lw-color-muted-foreground);font-size:10px;line-height:.75rem}.timeline{flex-direction:column;justify-content:flex-end;height:100%;margin:0;padding:0;list-style:none;display:flex}.timeline li{gap:.75rem;padding-bottom:.5rem;line-height:1.25rem;display:flex}.timeline li:last-child{padding-bottom:0}.rail{flex:none;justify-content:center;width:.5rem;padding-top:.375rem;display:flex;position:relative}.dot{box-sizing:border-box;border:1px solid var(--lw-color-ring);background:var(--lw-color-background);border-radius:50%;width:.5rem;height:.5rem}.dot.on{border-color:var(--_accent);background:var(--_accent)}.line{background:var(--lw-color-border);width:1px;position:absolute;top:1rem;bottom:-6px}.event{flex:1;min-width:0;display:grid}.text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.time{font-variant-numeric:tabular-nums;flex:none}.meter{border-radius:var(--lw-radius-full);background:var(--lw-color-muted);height:.25rem;overflow:hidden}.meter span{border-radius:inherit;background:var(--_accent);height:100%;display:block}.todo{align-content:end;gap:.5rem 1.5rem;height:100%;margin:0;padding:0;list-style:none;display:grid}.todo.two{grid-template-columns:1fr 1fr}.todo li{align-items:center;gap:.5rem;min-width:0;display:flex}.todo .done .text{color:var(--lw-color-muted-foreground);text-decoration:line-through}.box{box-sizing:border-box;border:1px solid var(--lw-color-ring);border-radius:4px;flex:none;place-items:center;width:.875rem;height:.875rem;display:grid}.done .box{border-color:var(--_accent);background:var(--_accent);color:var(--lw-color-background)}.box svg{fill:none;stroke:currentColor;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round;width:.625rem;height:.625rem}.ticks{gap:3px;height:1.75rem;display:flex}.ticks span{background:var(--lw-color-border);border-radius:2px;flex:1}.ticks span.on{background:var(--_accent)}.segments{border-radius:var(--lw-radius-full);background:var(--lw-color-muted);gap:1px;height:.375rem;display:flex;overflow:hidden}.segments span{height:100%}.accent{background:var(--_accent)}.strong{background:var(--lw-color-muted-foreground)}.soft{background:var(--lw-color-border)}.legend{flex-wrap:wrap;gap:.25rem 1rem;margin:0;padding:0;list-style:none;display:flex}.legend li{align-items:center;gap:.375rem;display:flex}.swatch{border-radius:50%;width:.5rem;height:.5rem}", f = [
	31,
	34,
	33,
	36,
	35,
	39,
	38,
	41,
	40,
	43,
	42,
	45,
	44,
	48
], p = `<svg class="spark" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true"><polyline points="${f.map((e, t) => `${Math.round(t / (f.length - 1) * 1e3) / 10},${Math.round((1 - (e - 30) / 19) * 300) / 10 + 1}`).join(" ")}" vector-effect="non-scaling-stroke"/></svg>`, m = (e, t) => `<p class="note"><span class="up">${e}</span><span class="muted"> ${t}</span></p>`, re = (e) => {
	let t = `<div><p class="value ${e === "s" ? "" : "big"}">$48,210</p>${m("+12.4%", "vs last month")}</div>`;
	return e === "s" ? `<div class="stack end">${t}</div>` : e === "m" ? `<div class="stack between">${t}${p}</div>` : `<div class="split"><div class="stack between">${t}${p}</div><dl class="rows">${[
		["New", "$6,140"],
		["Expansion", "$2,380"],
		["Churned", "−$1,190"]
	].map(([e, t]) => `<div><dt>${e}</dt><dd>${t}</dd></div>`).join("")}</dl></div>`;
}, h = [
	1820,
	1960,
	2010,
	1890,
	2240,
	1450,
	1380,
	2120,
	2380,
	2290,
	2510,
	2640,
	1720,
	2841
], g = [
	"M",
	"T",
	"W",
	"T",
	"F",
	"S",
	"S"
], _ = (e, t) => {
	let n = Math.max(...e);
	return `<div class="bars"><div class="columns">${e.map((t, r) => `<span class="${r === e.length - 1 ? "on" : ""}" style="height: ${Math.round(t / n * 100)}%"></span>`).join("")}</div><div class="labels">${t.map((e) => `<span>${e}</span>`).join("")}</div></div>`;
}, v = (e) => {
	if (e === "s") return `<div class="stack end"><p class="value">2,841</p>${m("+6.2%", "today")}</div>`;
	let t = e === "m" ? _(h.slice(-7), g) : _(h, [...g, ...g]);
	return `<div class="stack"><div class="inline"><p class="value">2,841</p>${m("+6.2%", "active today")}</div><div class="fill">${t}</div></div>`;
}, y = [
	["09:41", "lower 0.9.2 promoted to stable"],
	["09:12", "Nightly build passed on 6 targets"],
	["08:55", "New teammate joined Runtime"],
	["Mon", "Symbol server backup verified"]
], b = (e) => {
	let t = y.slice(0, {
		s: 1,
		m: 3,
		l: 4
	}[e]);
	return `<ol class="timeline">${t.map(([n, r], i) => `<li><span class="rail"><span class="dot${i === 0 ? " on" : ""}"></span>${i < t.length - 1 ? "<span class=\"line\"></span>" : ""}</span><span class="event"><span class="text">${r}</span>${e === "s" ? `<span class="muted">Today, ${n}</span>` : ""}</span>${e === "s" ? "" : `<span class="muted time">${n}</span>`}</li>`).join("")}</ol>`;
}, x = [
	["Profile the cold start", !0],
	["Review the allocator patch", !0],
	["Bisect the ARM regression", !0],
	["Book the release review", !1],
	["Write the 0.9 notes", !1]
], S = x.filter(([, e]) => e).length, ie = (e) => {
	if (e === "s") return `<div class="stack end"><p class="title">Q4 planning</p><p class="muted">${S} of ${x.length} done</p><div class="meter"><span style="width: ${S / x.length * 100}%"></span></div></div>`;
	let t = e === "m" ? x.slice(2) : x;
	return `<ul class="todo${e === "l" ? " two" : ""}">${t.map(([e, t]) => `<li class="${t ? "done" : ""}"><span class="box">${t ? "<svg viewBox=\"0 0 10 10\" aria-hidden=\"true\"><path d=\"M2 5.2 4.1 7.2 8 3\"/></svg>" : ""}</span><span class="text">${e}</span></li>`).join("")}</ul>`;
}, C = 18, w = (e) => {
	let t = e === "l" ? 45 : 30, n = `<div class="ticks">${Array.from({ length: t }, (e, n) => `<span class="${n === t - C ? "on" : ""}"></span>`).join("")}</div>`;
	return `<div class="stack end"><div class="inline"><p class="value">99.98%</p>${e === "s" ? "" : `<p class="muted">last ${t} days</p>`}</div>${e === "s" ? "<p class=\"muted\">All systems normal</p>" : n}${e === "l" ? `<p class="muted">One incident ${C} days ago: slower API responses for 4 minutes.</p>` : ""}</div>`;
}, T = [
	[
		"Media",
		182,
		"accent"
	],
	[
		"Documents",
		96,
		"strong"
	],
	[
		"Backups",
		64,
		"soft"
	]
], E = 500, D = T.reduce((e, [, t]) => e + t, 0), O = [
	{
		id: "revenue",
		title: "Revenue",
		icon: ne,
		span: 2,
		render: re
	},
	{
		id: "users",
		title: "Active users",
		icon: ee,
		span: 4,
		render: v
	},
	{
		id: "activity",
		title: "Activity",
		icon: l,
		span: 3,
		render: b
	},
	{
		id: "notes",
		title: "Notes",
		icon: s,
		span: 3,
		render: ie
	},
	{
		id: "uptime",
		title: "Uptime",
		icon: te,
		span: 4,
		render: w
	},
	{
		id: "storage",
		title: "Storage",
		icon: c,
		span: 2,
		render: (e) => {
			let t = e === "s" ? [[
				"Used",
				D,
				"accent"
			]] : T, n = e === "s" ? "" : `<ul class="legend">${T.map(([t, n, r]) => `<li><span class="swatch ${r}"></span><span class="muted">${t}</span>${e === "l" ? `<span>${n} GB</span>` : ""}</li>`).join("")}</ul>`;
			return `<div class="stack end"><p class="inline"><span class="value">${D} GB</span><span class="muted">of ${E}</span></p><div class="segments">${t.map(([, e, t]) => `<span class="${t}" style="width: ${e / E * 100}%"></span>`).join("")}</div>${n}</div>`;
		}
	}
], k = 6, A = 2, j = 2, M = 12, N = 576, P = 350, F = 8, ae = 18, oe = 7, I = 1 / 120, L = {
	s: "small",
	m: "medium",
	l: "large"
}, R = "cubic-bezier(0.23, 1, 0.32, 1)", z = (e, t) => ({
	k: e,
	c: 2 * Math.sqrt(e) * t
}), B = z(420, .76), V = z(520, .82), H = z(260, .6), U = (e, t = !1) => t ? e <= j ? "s" : "m" : e <= 2 ? "s" : e <= 4 ? "m" : "l", W = (e) => Math.min(k, Math.max(j, Math.round(e))), G = (e) => e <= j ? 1 : 2, K = (e, t, n) => {
	let r = e.slice();
	return r.splice(n, 0, ...r.splice(t, 1)), r;
}, q = (e, t, n) => t >= e.x && t <= e.x + e.w && n >= e.y && n <= e.y + e.h, J = (e) => Math.round(e * 100) / 100, Y = (e) => Math.round(e * 1e3) / 1e3, X = (e) => Math.max(-7, Math.min(oe, e)), se = () => ({
	ox: 0,
	oy: 0,
	vx: 0,
	vy: 0,
	sx: 1,
	sy: 1,
	vsx: 0,
	vsy: 0,
	lift: 0,
	vlift: 0,
	liftTarget: 0,
	rx: 0,
	ry: 0,
	vrx: 0,
	vry: 0,
	pvx: 0,
	pvy: 0,
	hold: 0,
	pinned: !1
}), Z = (e, t, n, r, i) => {
	e[n] += (-i.k * (e[t] - r) - i.c * e[n]) * I, e[t] += e[n] * I;
}, ce = (e) => {
	Z(e, "ry", "vry", e.pinned ? X(e.pvx * 9) : 0, H), Z(e, "rx", "vrx", e.pinned ? X(-e.pvy * 9) : 0, H), Z(e, "lift", "vlift", e.liftTarget, V), e.pvx *= Math.exp(-.08333333333333333), e.pvy *= Math.exp(-.08333333333333333), e.hold > 0 ? e.hold -= I : (e.pinned || (Z(e, "ox", "vx", 0, B), Z(e, "oy", "vy", 0, B)), Z(e, "sx", "vsx", 1, B), Z(e, "sy", "vsy", 1, B));
}, Q = (e, t, n, r) => Math.abs(e - n) < r && Math.abs(t) < r * 10, le = (e) => !e.pinned && e.hold <= 0 && Q(e.ox, e.vx, 0, .2) && Q(e.oy, e.vy, 0, .2) && Q(e.sx, e.vsx, 1, .001) && Q(e.sy, e.vsy, 1, .001) && Q(e.lift, e.vlift, e.liftTarget, .002) && Q(e.rx, e.vrx, 0, .02) && Q(e.ry, e.vry, 0, .02), ue = (e) => {
	e.pinned || Object.assign(e, {
		ox: 0,
		oy: 0
	}), Object.assign(e, {
		vx: 0,
		vy: 0,
		sx: 1,
		sy: 1,
		vsx: 0,
		vsy: 0,
		lift: e.liftTarget,
		vlift: 0,
		rx: 0,
		ry: 0,
		vrx: 0,
		vry: 0,
		hold: 0
	});
}, de = "<svg viewBox=\"0 0 10 10\" aria-hidden=\"true\"><circle cx=\"8.5\" cy=\"3.5\" r=\"1.1\"/><circle cx=\"6\" cy=\"6\" r=\"1.1\"/><circle cx=\"3.5\" cy=\"8.5\" r=\"1.1\"/></svg>", $ = class extends e {
	static styles = d;
	static props = {
		items: {
			type: Object,
			default: O
		},
		layout: {
			type: Object,
			default: null
		},
		rowHeight: {
			type: Number,
			default: 176
		}
	};
	#e = [];
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Map();
	#i = !1;
	#a = null;
	#o = null;
	#s = null;
	#c = null;
	#l = !1;
	#u = o(I, {
		step: () => this.#n.forEach((e) => ce(e)),
		render: () => this.#w()
	});
	render() {
		return "<div class=\"wrap\"><div class=\"grid\"><svg class=\"slots\" aria-hidden=\"true\"></svg></div><p class=\"visually-hidden\" id=\"instructions\">Press Space to pick up. Use the arrow keys to move, Space to drop and Escape to cancel. With a pointer, press and hold a widget, then drag it.</p><p class=\"visually-hidden\" aria-live=\"assertive\"></p></div>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".grid");
		t.addEventListener("pointerdown", (e) => this.#j(e), e), t.addEventListener("keydown", (e) => this.#K(e), e), t.addEventListener("focusin", (e) => e.target.matches(":focus-visible") && this.#O(e.target.closest(".cell")?.dataset.id), e), t.addEventListener("focusout", (e) => this.#k(e), e), t.addEventListener("pointerover", (e) => e.pointerType === "mouse" && this.#O(e.target.closest(".cell")?.dataset.id), e), t.addEventListener("pointerleave", () => this.#O(null), e), t.addEventListener("contextmenu", (e) => (this.#a || e.pointerType === "touch") && e.preventDefault(), e), t.addEventListener("touchmove", (e) => (this.#a?.mode === "pointer" || this.#s) && e.preventDefault(), {
			...e,
			passive: !1
		});
		let n = new ResizeObserver(() => this.#y());
		n.observe(this.query(".wrap")), this.signal.addEventListener("abort", () => {
			n.disconnect(), this.#u.stop(), this.#N(), this.#R(!1), this.#U();
		});
	}
	updated(e) {
		e.has("rowHeight") && (this.query(".grid").style.gridAutoRows = `${this.rowHeight}px`), e.has("items") && this.#p(), (e.has("items") || e.has("layout") && this.layout !== this.#e) && this.#_(this.#f(this.layout ?? []), null);
	}
	get #d() {
		return new Map(this.items.map((e) => [e.id, e]));
	}
	#f(e) {
		let t = this.#d, n = /* @__PURE__ */ new Set(), r = [];
		for (let { id: i, span: a } of e) t.has(i) && !n.has(i) && (n.add(i), r.push({
			id: i,
			span: W(a)
		}));
		for (let e of this.items) n.has(e.id) || r.push({
			id: e.id,
			span: W(e.span ?? j)
		});
		return r;
	}
	#p() {
		for (let e of this.#t.values()) e.remove();
		this.#t.clear(), this.#n.clear();
		for (let e of this.items) {
			let t = document.createElement("div");
			t.className = "cell", t.dataset.id = e.id, t.innerHTML = `<div class="surface"><div class="shadow"></div></div><div class="inner"><div class="head"><span class="icon" aria-hidden="true">${e.icon ? r(e.icon, 14) : ""}</span><span class="name">${n(e.title)}</span><button class="grip" type="button" aria-describedby="instructions" aria-pressed="false">${r(u)}</button></div><div class="body"></div></div><button class="resize" type="button">${de}</button>`, this.#t.set(e.id, t), this.#n.set(e.id, se());
		}
	}
	#m(e) {
		return this.#d.get(e)?.title ?? e;
	}
	#h(e) {
		return `position ${this.#e.findIndex((t) => t.id === e) + 1} of ${this.#e.length}`;
	}
	#g(e) {
		let t = this.query("[aria-live]");
		t.textContent = t.textContent === e ? `${e} ` : e;
	}
	#_(e, t) {
		let n = new Map(this.#r), r = this.shadowRoot.activeElement;
		this.#e = e, this.layout = e, this.#i = this.query(".wrap").clientWidth < N && this.query(".wrap").clientWidth > 0, this.toggleAttribute("data-narrow", this.#i);
		let i = this.query(".grid");
		e.forEach(({ id: e, span: t }, n) => {
			let r = this.#t.get(e), a = i.children[n + 1];
			a !== r && i.insertBefore(r, a ?? null), r.style.setProperty("--_span", t), r.style.setProperty("--_span-n", G(t)), this.#b(e, t);
		}), r && this.shadowRoot.activeElement !== r && r.focus({ preventScroll: !0 }), this.#x(), t && this.#S(n, t), this.#E(), this.#D();
	}
	#v(e, t) {
		this.#_(e, t), this.emit("change", { layout: e });
	}
	#y() {
		this.#e.length && (this.query(".wrap").clientWidth < N === this.#i ? (this.#x(), this.#E()) : this.#_(this.#e, null));
	}
	#b(e, t) {
		let n = this.#t.get(e), r = this.#d.get(e), i = U(t, this.#i), o = this.#i ? A : k, s = this.#a?.id === e;
		n.querySelector(".grip").ariaLabel = `Move ${r.title} (${L[i]})`, n.querySelector(".grip").ariaPressed = String(s), n.querySelector(".resize").ariaLabel = `Resize ${r.title}, ${this.#i ? G(t) : t} of ${o} columns`, n.toggleAttribute("data-lifted", s);
		let c = n.querySelector(".body");
		if (c.dataset.size === i) return;
		let l = !c.dataset.size;
		c.dataset.size = i;
		let u = document.createElement("div");
		u.className = "view", u.innerHTML = r.render?.(i) ?? "";
		for (let e of c.querySelectorAll(".view")) l || a.matches ? e.remove() : e.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: 220,
			easing: R
		}).finished.then(() => e.remove(), () => e.remove());
		c.append(u), !l && !a.matches && u.animate([{ opacity: 0 }, { opacity: 1 }], {
			duration: 220,
			easing: R
		});
	}
	#x() {
		this.#r = new Map([...this.#t].map(([e, t]) => [e, {
			x: t.offsetLeft,
			y: t.offsetTop,
			w: t.offsetWidth,
			h: t.offsetHeight
		}]));
	}
	#S(e, t) {
		let n = this.#r.get(t), r = n ? n.x + n.w / 2 : 0, i = n ? n.y + n.h / 2 : 0, a = this.#a?.mode === "pointer" ? this.#a.id : null;
		for (let [n, o] of this.#r) {
			let s = e.get(n);
			if (!s || n === a || !o.w) continue;
			let c = this.#n.get(n), l = Math.abs(s.x - o.x) > .5 || Math.abs(s.y - o.y) > .5 || s.w !== o.w;
			c.ox += s.x - o.x, c.oy += s.y - o.y, c.sx = s.w * c.sx / o.w, c.sy = s.h * c.sy / o.h, l && n !== t && (c.hold = Math.min(.1, Math.hypot(o.x + o.w / 2 - r, o.y + o.h / 2 - i) * 16e-5)), this.#C(n);
		}
		this.#u.wake();
	}
	#C(e) {
		let t = this.#t.get(e), n = this.#n.get(e), r = !n.ox && !n.oy && !n.lift && !n.rx && !n.ry;
		t.style.transform = r ? "" : `translate3d(${J(n.ox)}px, ${J(n.oy)}px, ${J(n.lift * ae)}px) rotateX(${J(n.rx)}deg) rotateY(${J(n.ry)}deg)`;
		let i = t.firstElementChild;
		i.style.transform = n.sx === 1 && n.sy === 1 ? "" : `scale(${Y(n.sx)}, ${Y(n.sy)})`, i.firstElementChild.style.opacity = String(J(Math.max(0, Math.min(1, n.lift))));
	}
	#w() {
		let e = !1;
		for (let [t, n] of this.#n) a.matches || le(n) ? ue(n) : e = !0, this.#C(t);
		return e;
	}
	#T(e, t) {
		let n = this.query(".grid").getBoundingClientRect();
		return {
			x: e - n.left,
			y: t - n.top
		};
	}
	#E() {
		let e = this.#a, t = e && this.#r.get(e.id);
		if (!t || e.mode !== "pointer") return;
		let n = this.#T(e.lastX, e.lastY), r = this.#n.get(e.id);
		r.ox = n.x - e.grabX - t.x, r.oy = n.y - e.grabY - t.y, this.#C(e.id), this.#u.wake();
	}
	#D() {
		let e = this.query(".slots"), t = !!(this.#a || this.#s);
		if (e.hidden = !t, !t) return;
		let n = this.query(".grid"), r = this.#i ? A : k, i = Math.max(1, Math.round((n.offsetHeight + M) / (this.rowHeight + M))), a = "";
		for (let e = 0; e <= r; e++) for (let t = 0; t <= i; t++) a += `<circle cx="${e / r * 100}%" cy="${t / i * 100}%" r="1.5"/>`;
		e.innerHTML = a;
	}
	#O(e) {
		this.#c = e ?? null, this.#A();
	}
	#k(e) {
		let t = e.target.closest(".cell");
		t && !t.contains(e.relatedTarget) && this.#c === t.dataset.id && this.#O(null), this.#a?.mode === "keyboard" && e.target.matches(".grip") && !this.#l && this.#R(!1);
	}
	#A() {
		let e = this.#a?.id ?? this.#s?.id ?? this.#c;
		for (let [t, n] of this.#t) n.toggleAttribute("data-dimmed", e !== null && e !== t);
	}
	#j(e) {
		if (e.button !== 0) return;
		let t = e.target.closest(".cell");
		if (!t || this.#a || this.#s) return;
		let n = t.dataset.id;
		e.target.closest(".resize") ? (e.preventDefault(), this.#H(e, n)) : e.target.closest(".grip") ? (e.preventDefault(), this.#N(), this.#F(n, e)) : this.#M(e, n);
	}
	#M(e, t) {
		this.#N();
		let n = new AbortController(), r = {
			id: t,
			pointerId: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
			x: e.clientX,
			y: e.clientY,
			listening: n
		};
		r.timer = setTimeout(() => {
			this.#N(), this.#F(t, {
				pointerId: r.pointerId,
				clientX: r.x,
				clientY: r.y
			});
		}, P), this.#o = r;
		let i = { signal: n.signal };
		window.addEventListener("pointermove", (e) => {
			e.pointerId === r.pointerId && (r.x = e.clientX, r.y = e.clientY, Math.hypot(e.clientX - r.startX, e.clientY - r.startY) > F && this.#N());
		}, i);
		for (let e of ["pointerup", "pointercancel"]) window.addEventListener(e, () => this.#N(), i);
	}
	#N() {
		this.#o &&= (clearTimeout(this.#o.timer), this.#o.listening.abort(), null);
	}
	#P(e, t) {
		this.#a = {
			id: e,
			skipId: null,
			snapshot: this.#e,
			listening: new AbortController(),
			...t
		};
		let n = this.#n.get(e);
		n.liftTarget = 1, this.#u.wake(), this.#b(e, this.#e.find((t) => t.id === e).span), this.#A(), this.#D();
	}
	#F(e, { pointerId: t, clientX: n, clientY: r }) {
		let a = this.#r.get(e);
		if (!a || this.#a) return;
		let o = this.#n.get(e), s = this.#T(n, r);
		Object.assign(o, {
			pinned: !0,
			hold: 0,
			vx: 0,
			vy: 0,
			pvx: 0,
			pvy: 0
		}), this.#P(e, {
			mode: "pointer",
			pointerId: t,
			grabX: s.x - (a.x + o.ox),
			grabY: s.y - (a.y + o.oy),
			lastX: n,
			lastY: r,
			lastT: performance.now()
		}), this.#g(`${this.#m(e)} lifted, ${this.#h(e)}.`), i(8);
		let c = { signal: this.#a.listening.signal };
		window.addEventListener("pointermove", (e) => this.#I(e), c);
		for (let e of ["pointerup", "pointercancel"]) window.addEventListener(e, (e) => e.pointerId === this.#a?.pointerId && this.#R(!1), c);
		window.addEventListener("keydown", (e) => e.key === "Escape" && (e.preventDefault(), this.#R(!0)), c);
	}
	#I(e) {
		let t = this.#a;
		if (t?.mode !== "pointer" || e.pointerId !== t.pointerId) return;
		let n = performance.now(), r = Math.max(1, n - t.lastT), i = this.#n.get(t.id);
		i.pvx += ((e.clientX - t.lastX) / r - i.pvx) * .35, i.pvy += ((e.clientY - t.lastY) / r - i.pvy) * .35, Object.assign(t, {
			lastX: e.clientX,
			lastY: e.clientY,
			lastT: n
		}), this.#E();
		let a = this.#T(e.clientX, e.clientY);
		this.#L(a.x, a.y);
	}
	#L(e, t) {
		let n = this.#a;
		if (n.skipId) {
			let r = this.#r.get(n.skipId);
			if (r && q(r, e, t)) return;
			n.skipId = null;
		}
		let r = this.#e, i = r.findIndex((e) => e.id === n.id), a = r.findIndex((r) => r.id !== n.id && q(this.#r.get(r.id), e, t));
		a < 0 || (n.skipId = r[a].id, this.#v(K(r, i, a), n.id), this.#g(`${this.#m(n.id)} moved to position ${a + 1} of ${r.length}.`));
	}
	#R(e) {
		let t = this.#a;
		if (!t) return;
		t.listening.abort();
		let n = this.#n.get(t.id);
		t.mode === "pointer" && Object.assign(n, {
			vx: n.pvx * 400,
			vy: n.pvy * 400
		}), n.pinned = !1, n.liftTarget = 0, this.#a = null, e && this.#v(t.snapshot, t.id), this.#u.wake(), this.#b(t.id, this.#e.find((e) => e.id === t.id).span), this.#A(), this.#D();
		let r = this.#m(t.id);
		e ? this.#g(`Move cancelled. ${r} returned to position ${t.snapshot.findIndex((e) => e.id === t.id) + 1} of ${t.snapshot.length}.`) : this.#g(`${r} dropped at ${this.#h(t.id)}.`);
	}
	#z(e) {
		return `${this.#i ? G(e) : e} of ${this.#i ? A : k} columns, ${L[U(e, this.#i)]}`;
	}
	#B(e, t) {
		let n = this.#e.find((t) => t.id === e);
		n && n.span !== t && (this.#v(this.#e.map((n) => n.id === e ? {
			...n,
			span: t
		} : n), e), this.#g(`${this.#m(e)} resized to ${this.#z(t)}.`));
	}
	#V(e) {
		let t = this.#s, n = this.#i ? A : k, r = Math.round((e - t.x) / ((this.query(".grid").clientWidth + M) / n));
		return this.#i ? Math.max(1, Math.min(2, G(t.span) + r)) === 1 ? j : Math.max(3, t.span) : W(t.span + r);
	}
	#H(e, t) {
		this.#N(), this.#s = {
			id: t,
			x: e.clientX,
			span: this.#e.find((e) => e.id === t).span,
			listening: new AbortController()
		};
		let n = { signal: this.#s.listening.signal };
		window.addEventListener("pointermove", (e) => this.#B(t, this.#V(e.clientX)), n);
		for (let e of ["pointerup", "pointercancel"]) window.addEventListener(e, () => this.#U(), n);
		this.#A(), this.#D();
	}
	#U() {
		this.#s && (this.#s.listening.abort(), this.#s = null, this.#A(), this.#D());
	}
	#W(e, t) {
		let n = this.#r.get(e), r = -1, i = Infinity, a = Infinity, o = n.x + n.w / 2;
		return this.#e.forEach((e, s) => {
			let c = this.#r.get(e.id);
			if (!(t ? c.y + c.h <= n.y + 1 : c.y >= n.y + n.h - 1)) return;
			let l = Math.abs(c.y - n.y), u = Math.abs(c.x + c.w / 2 - o);
			(l < i - 1 || Math.abs(l - i) <= 1 && u < a) && ([r, i, a] = [
				s,
				l,
				u
			]);
		}), r;
	}
	#G(e, t) {
		let n = this.#e.findIndex((t) => t.id === e);
		if (t === "ArrowLeft") return Math.max(0, n - 1);
		if (t === "ArrowRight") return Math.min(this.#e.length - 1, n + 1);
		if (t === "ArrowUp" || t === "ArrowDown") {
			let r = this.#W(e, t === "ArrowUp");
			return r < 0 ? n : r;
		}
		return null;
	}
	#K(e) {
		let t = e.target.closest(".cell");
		if (!t) return;
		let n = t.dataset.id;
		if (e.target.matches(".resize")) {
			this.#q(e, n);
			return;
		}
		if (!e.target.matches(".grip")) return;
		let r = this.#a;
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault(), r?.id === n ? this.#R(!1) : r || (this.#P(n, { mode: "keyboard" }), this.#g(`${this.#m(n)} lifted, ${this.#h(n)}. Arrow keys move it, Space drops it, Escape cancels.`));
			return;
		}
		if (r?.id !== n || r.mode !== "keyboard") return;
		if (e.key === "Escape") {
			e.preventDefault(), this.#l = !0, this.#R(!0), this.#l = !1;
			return;
		}
		let i = this.#G(n, e.key);
		if (i === null) return;
		e.preventDefault();
		let a = this.#e.findIndex((e) => e.id === n);
		i === a ? this.#g(`${this.#m(n)} is at ${this.#h(n)}.`) : (this.#l = !0, this.#v(K(this.#e, a, i), n), this.#l = !1, this.#g(`${this.#m(n)} moved to position ${i + 1} of ${this.#e.length}.`));
	}
	#q(e, t) {
		let n = this.#e.find((e) => e.id === t), r = {
			ArrowRight: 1,
			ArrowUp: 1,
			ArrowLeft: -1,
			ArrowDown: -1
		}[e.key];
		if (!r) return;
		e.preventDefault();
		let i = W(n.span + r);
		this.#i && (i = r > 0 ? Math.max(3, n.span) : j), this.#B(t, i);
	}
};
//#endregion
//#region src/components/bento-grid/index.js
t("bento-grid", $);
//#endregion
export { $ as t };
