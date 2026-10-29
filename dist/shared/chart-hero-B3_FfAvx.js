import { n as e, t } from "./core-WcEz9YgG.js";
import { n } from "./motion-CFWhFfc_.js";
import { n as r, t as i } from "./rolling-VjfpUD4B.js";
import { n as a } from "./highlight-BSyGT8bg.js";
import { r as o, t as s } from "./hero-CAqTQjEL.js";
//#region src/components/chart-hero/chart-hero.scss?inline
var c = ":host{--_ink:var(--lw-color-foreground);--_muted:var(--lw-color-muted-foreground);--_accent:#f97316;--_gutter:clamp(1.5rem, 5vw, 4rem);--_edge:max(var(--_gutter), calc((100% - 72rem) / 2));box-sizing:border-box;background:var(--lw-color-background);width:100%;min-height:780px;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);justify-content:center;align-items:flex-start;padding:6rem clamp(1.5rem,5vw,4rem) 0;display:flex;position:relative;overflow:hidden;container-type:inline-size}@media not (min-width:896px){:host{padding-bottom:20rem}}.container{pointer-events:none;gap:2.5rem;width:100%;max-width:72rem;margin-inline:auto;display:grid;position:relative}@container (width>=56rem){.container{grid-template-columns:minmax(0,1fr) auto;align-items:start}}.copy{flex-direction:column;align-items:flex-start;max-width:34rem;display:flex}.brand{font-size:var(--lw-text-md);color:var(--_muted);margin:0;font-weight:500}.title{letter-spacing:-.05em;text-wrap:balance;margin:1.25rem 0 0;font-size:clamp(3rem,7vw,5.75rem);font-weight:600;line-height:.95}.description{max-width:28rem;font-size:var(--lw-text-lg);text-wrap:pretty;color:var(--_muted);margin:1.75rem 0 0;line-height:1.6}.actions{flex-wrap:wrap;align-items:center;gap:.75rem;margin-top:2rem;display:flex}.primary::part(button),.secondary::part(button){border-radius:var(--lw-radius-full)}::slotted([slot=eyebrow]),.actions,.side{pointer-events:auto}.side{justify-items:end;gap:1.75rem;display:grid}@container (width<=56rem){.side{justify-items:start}}.kpis{text-align:right;gap:2.5rem;margin:0;display:flex}.kpis div{flex-direction:column-reverse;gap:.25rem;display:flex}.kpis dd{font-variant-numeric:tabular-nums;letter-spacing:-.03em;margin:0;font-size:clamp(1.5rem,3vw,2rem);font-weight:600}.kpis dt{font-size:var(--lw-text-sm);color:var(--_muted)}.tabs{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-full);padding:.25rem;display:flex;position:relative}.highlight{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.highlight{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.highlight.visible{opacity:1}.highlight{border-radius:var(--lw-radius-full);background:var(--_ink)}.tab{border-radius:var(--lw-radius-full);min-width:3rem;font:500 var(--lw-text-sm) var(--lw-font-sans);color:var(--_muted);cursor:pointer;background:0 0;border:0;outline:none;padding:.5rem .875rem;position:relative}@media (prefers-reduced-motion:no-preference){.tab{transition:color .2s ease-out}}.tab[aria-checked=true]{color:var(--lw-color-background)}.tab:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.chart{position:absolute;inset:38% 0 0;-webkit-mask-image:linear-gradient(#000 55%,#0000 98%),linear-gradient(90deg,#0000 8%,#000 45%);mask-image:linear-gradient(#000 55%,#0000 98%),linear-gradient(90deg,#0000 8%,#000 45%);-webkit-mask-composite:source-in;mask-composite:intersect}@media not (min-width:896px){.chart{height:18rem;inset:auto 0 0;-webkit-mask-image:linear-gradient(#000 55%,#0000 98%);mask-image:linear-gradient(#000 55%,#0000 98%)}}.plot{width:100%;height:100%;position:absolute;inset:0;overflow:visible}.line{fill:none;stroke:var(--_ink);stroke-width:2px;stroke-linejoin:round}.area{fill:url(#area)}.area-top{stop-color:var(--_ink);stop-opacity:.1}.area-bottom{stop-color:var(--_ink);stop-opacity:0}.cross,.cross-dot,.tip{opacity:0}:host([data-scrubbing]) .cross,:host([data-scrubbing]) .cross-dot,:host([data-scrubbing]) .tip{opacity:1}.cross{stroke:color-mix(in oklab, var(--_ink) 35%, transparent);stroke-dasharray:3 4}.cross-dot{fill:var(--_ink);stroke:var(--lw-color-background);stroke-width:2px}.note-dot{fill:var(--_accent);stroke:var(--lw-color-background);stroke-width:2px;display:none}.note-dot[data-shown]{display:block}.ticks span{right:var(--_edge);border-bottom:1px solid var(--lw-color-border);font:var(--lw-text-xs) var(--lw-font-mono);text-align:right;color:var(--_muted);padding-bottom:.375rem;position:absolute;left:0;translate:0 -100%}.note{border:1px solid var(--lw-color-border);background:var(--lw-color-background);box-shadow:var(--lw-shadow-md);white-space:nowrap;pointer-events:none;border-radius:.625rem;padding:.625rem .875rem;display:none;position:absolute;top:0;left:0;transform:translate(calc(-100% - 1.75rem),-50%)}.note[data-shown]{display:block}.note:after{content:\"\";border-top:1px solid var(--_accent);width:1.75rem;position:absolute;top:50%;left:100%}.note-title,.note-meta{margin:0}.note-title{font-size:var(--lw-text-sm);font-weight:600}.note-meta{font-size:var(--lw-text-xs);color:var(--_muted)}.tip{border-radius:var(--lw-radius-md);background:var(--_ink);font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--lw-color-background);pointer-events:none;padding:.375rem .625rem;position:absolute;top:0;left:0;transform:translate(.75rem,calc(-100% - .75rem))}.tip[data-left]{transform:translate(calc(-100% - .75rem),calc(-100% - .75rem))}.scrub{cursor:crosshair;outline:none;position:absolute;inset:0}.scrub:focus-visible{box-shadow:inset 0 0 0 2px var(--lw-color-ring)}", l = [
	{
		id: "7D",
		days: 7
	},
	{
		id: "30D",
		days: 30
	},
	{
		id: "90D",
		days: 90
	},
	{
		id: "1Y",
		days: 365
	}
], u = 120, d = 650, f = 2.4, p = 864e5, m = Date.UTC(2026, 9, 15), h = 13, g = {
	title: "Released 0.9",
	jump: .34
}, _ = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	timeZone: "UTC"
}), v = new Intl.NumberFormat("en-US"), y = new Intl.NumberFormat("en-US", {
	notation: "compact",
	maximumFractionDigits: 2
}), b = (e) => 1 - (1 - e) ** 3, x = () => {
	let e = 11, t = () => (e = e * 16807 % 2147483647, e / 2147483647);
	return Array.from({ length: 365 }, (e, n) => {
		let r = 24e3 + 14e3 * (n / 364) ** 1.6, i = Math.sin(n / 7 * Math.PI * 2) * 1200, a = Math.sin(n / 9) * 1600, o = n - 351, s = o >= 0 ? r * g.jump * Math.exp(-o / 2.2) : 0;
		return Math.round(r + i + a + (t() - .5) * 1800 + s);
	});
}, S = (e) => Array.from({ length: u }, (t, n) => {
	let r = n / 119 * (e.length - 1), i = Math.floor(r), a = Math.min(e.length - 1, i + 1);
	return e[i] + (e[a] - e[i]) * (r - i);
}), C = (e) => e.reduce((t, [n, r], i) => {
	if (i === 0) return `M${n.toFixed(1)} ${r.toFixed(1)}`;
	let [a, o] = e[i - 2] ?? e[i - 1], [s, c] = e[i - 1], [l, u] = e[i + 1] ?? [n, r];
	return `${t} C${(s + (n - a) / 6).toFixed(1)} ${(c + (r - o) / 6).toFixed(1)} ${(n - (l - s) / 6).toFixed(1)} ${(r - (u - c) / 6).toFixed(1)} ${n.toFixed(1)} ${r.toFixed(1)}`;
}, ""), w = (e, t) => {
	let n = 10 ** Math.floor(Math.log10((t - e) / 2)), r = [
		1,
		2,
		5,
		10
	].map((e) => e * n).find((n) => (t - e) / n <= 4), i = [];
	for (let n = Math.ceil(e / r) * r; n <= t; n += r) i.push(n);
	return i.slice(-2);
}, T = class extends e {
	static styles = [r, c];
	static props = {
		brand: { default: "lower Insights" },
		heading: { default: "Watch every release land." },
		description: { default: "Installs of lower, day by day. Scrub any day, compare any range, and see exactly which release moved the line." },
		series: {
			type: Object,
			default: x()
		},
		end: { default: new Date(m).toISOString().slice(0, 10) },
		range: { default: "90D" },
		note: {
			type: Object,
			default: {
				daysAgo: h,
				title: g.title
			}
		}
	};
	#e = null;
	#t = 0;
	#n = 0;
	#r = 0;
	#i = -1;
	render() {
		return `<div class="chart"><svg class="plot" aria-hidden="true"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="area-top"/><stop offset="1" class="area-bottom"/></linearGradient></defs><path class="area"/><path class="line"/><line class="cross"/><circle class="cross-dot" r="4"/><circle class="note-dot" r="4"/></svg>
<div class="ticks" aria-hidden="true"></div><div class="note" aria-hidden="true"><p class="note-title"></p><p class="note-meta"></p></div><div class="tip" aria-hidden="true"></div>
<div class="scrub" tabindex="0" role="slider" aria-label="Daily installs" aria-valuemin="0" aria-valuemax="119"></div></div>
<div class="container"><div class="copy"><slot name="eyebrow"><p class="brand"></p></slot><h1 class="title"></h1><p class="description"></p>${s("Install lower", "Read the changelog")}</div>
<div class="side"><dl class="kpis"><div><dt>Avg. daily installs</dt><dd class="kpi-users rolling"></dd></div><div><dt>Builds</dt><dd class="kpi-sessions rolling"></dd></div><div><dt>Growth</dt><dd class="kpi-growth rolling"></dd></div></dl>
<div class="tabs" role="radiogroup" aria-label="Range"><span class="highlight"></span>${l.map((e) => `<button class="tab" type="button" role="radio" data-range="${e.id}">${e.id}</button>`).join("")}</div></div></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = new ResizeObserver(() => this.#u());
		t.observe(this.query(".chart")), this.signal.addEventListener("abort", () => {
			t.disconnect(), cancelAnimationFrame(this.#r);
		});
		let n = this.query(".tabs");
		n.addEventListener("click", (e) => {
			let t = e.target.closest(".tab");
			t && this.#g(t.dataset.range);
		}, e), n.addEventListener("keydown", (e) => {
			let t = {
				ArrowRight: 1,
				ArrowDown: 1,
				ArrowLeft: -1,
				ArrowUp: -1
			}[e.key];
			if (!t) return;
			e.preventDefault();
			let n = l[(l.findIndex((e) => e.id === this.range) + t + l.length) % l.length].id;
			this.#g(n), this.query(`.tab[data-range="${n}"]`).focus();
		}, e);
		let r = this.query(".scrub");
		r.addEventListener("pointermove", (e) => this.#m(e), e), r.addEventListener("pointerleave", () => this.#h(-1), e), r.addEventListener("keydown", (e) => {
			let t = {
				ArrowRight: 1,
				ArrowLeft: -1,
				Home: -120,
				End: u
			}[e.key];
			t !== void 0 && (e.preventDefault(), this.#h(Math.min(119, Math.max(0, (this.#i < 0 ? 119 : this.#i) + t * (e.shiftKey ? 10 : 1)))));
		}, e), r.addEventListener("blur", () => this.#h(-1), e);
	}
	updated(e) {
		o(this), this.query(".brand").textContent = this.brand ?? "", (e.has("range") || e.has("series") || e.has("end")) && this.#c(!e.has("series") && !!this.#e);
	}
	get #a() {
		return l.find((e) => e.id === this.range)?.days ?? 90;
	}
	get #o() {
		return this.series.slice(-this.#a);
	}
	#s(e) {
		let t = this.#o.length, n = Math.round(e / 119 * (t - 1));
		return /* @__PURE__ */ new Date(Date.parse(this.end) - (t - 1 - n) * p);
	}
	#c(e) {
		let t = this.#o, r = S(t), i = Math.min(...r), a = Math.max(...r), o = (a - i) * .12 || 1, s = {
			values: r,
			lo: i - o,
			hi: a + o
		};
		if (this.#l(t), cancelAnimationFrame(this.#r), !e || !this.#e || n.matches) {
			this.#e = s, this.#f();
			return;
		}
		let c = this.#e, l = performance.now(), u = (e) => {
			let t = b(Math.min(1, (e - l) / d)), n = (e, n) => e + (n - e) * t;
			this.#e = {
				values: c.values.map((e, t) => n(e, s.values[t])),
				lo: n(c.lo, s.lo),
				hi: n(c.hi, s.hi)
			}, this.#f(), t < 1 && (this.#r = requestAnimationFrame(u));
		};
		this.#r = requestAnimationFrame(u);
	}
	#l(e) {
		for (let e of this.shadowRoot.querySelectorAll(".tab")) {
			let t = e.dataset.range === this.range;
			e.ariaChecked = String(t), e.tabIndex = t ? 0 : -1;
		}
		requestAnimationFrame(() => a(this.query(".tabs .highlight"), this.query(".tab[aria-checked=\"true\"]")));
		let t = e.reduce((e, t) => e + t, 0) / e.length, n = Math.min(7, Math.max(1, Math.floor(e.length / 4))), r = (e) => e.reduce((e, t) => e + t, 0) / e.length, o = (r(e.slice(-n)) / r(e.slice(0, n)) - 1) * 100;
		i(this.query(".kpi-users"), v.format(Math.round(t))), i(this.query(".kpi-sessions"), y.format(t * e.length * f)), i(this.query(".kpi-growth"), `${o >= 0 ? "+" : "−"}${Math.abs(o).toFixed(1)}%`);
	}
	#u() {
		let e = this.query(".chart");
		this.#t = e.clientWidth, this.#n = e.clientHeight, this.query(".plot").setAttribute("viewBox", `0 0 ${this.#t} ${this.#n}`), this.#f();
	}
	#d(e, t) {
		let { lo: n, hi: r } = this.#e, i = this.#n * .12;
		return [e / 119 * this.#t, i + (1 - (t - n) / (r - n)) * (this.#n - i)];
	}
	#f() {
		if (!this.#e || !this.#t) return;
		let e = C(this.#e.values.map((e, t) => this.#d(t, e)));
		this.query(".line").setAttribute("d", e), this.query(".area").setAttribute("d", `${e} L${this.#t} ${this.#n} L0 ${this.#n} Z`), this.query(".ticks").innerHTML = w(this.#e.lo, this.#e.hi).map((e) => `<span style="top: ${this.#d(0, e)[1].toFixed(1)}px">${y.format(e).toLowerCase()}</span>`).join(""), this.#p(), this.#h(this.#i);
	}
	#p() {
		let e = this.query(".note"), t = this.query(".note-dot"), n = this.#o.length, r = this.note?.daysAgo, i = r !== void 0 && r < n - 1;
		if (e.toggleAttribute("data-shown", i), t.toggleAttribute("data-shown", i), !i) return;
		let a = (n - 1 - r) / (n - 1) * 119, o = Math.floor(a), s = this.#e.values[o] + (this.#e.values[Math.min(119, o + 1)] - this.#e.values[o]) * (a - o), [c, l] = this.#d(a, s);
		t.setAttribute("cx", c.toFixed(1)), t.setAttribute("cy", l.toFixed(1)), e.style.translate = `${c.toFixed(1)}px ${l.toFixed(1)}px`;
		let u = this.#o, d = n - 1 - r, f = u[d - 1] ? (u[d] / u[d - 1] - 1) * 100 : 0;
		this.query(".note-title").textContent = this.note.title ?? "", this.query(".note-meta").textContent = `${_.format(/* @__PURE__ */ new Date(Date.parse(this.end) - r * p))} · ${f >= 0 ? "+" : "−"}${Math.abs(f).toFixed(1)}% in a day`;
	}
	#m(e) {
		let t = this.query(".scrub").getBoundingClientRect();
		t.width && this.#h(Math.min(119, Math.max(0, Math.round((e.clientX - t.left) / t.width * 119))));
	}
	#h(e) {
		this.#i = e;
		let t = e >= 0 && this.#e;
		this.toggleAttribute("data-scrubbing", !!t);
		let n = this.query(".scrub");
		if (!t) {
			n.removeAttribute("aria-valuetext");
			return;
		}
		let r = this.#e.values[e], [i, a] = this.#d(e, r), o = this.query(".cross");
		o.setAttribute("x1", i.toFixed(1)), o.setAttribute("x2", i.toFixed(1)), o.setAttribute("y1", "0"), o.setAttribute("y2", String(this.#n));
		let s = this.query(".cross-dot");
		s.setAttribute("cx", i.toFixed(1)), s.setAttribute("cy", a.toFixed(1));
		let c = `${_.format(this.#s(e))} · ${v.format(Math.round(r))} installs`, l = this.query(".tip");
		l.textContent = c, l.style.translate = `${i.toFixed(1)}px ${a.toFixed(1)}px`, l.toggleAttribute("data-left", i > this.#t - 200), n.ariaValueNow = String(e), n.ariaValueText = c;
	}
	#g(e) {
		e !== this.range && (this.range = e, this.emit("change", { range: e }));
	}
};
//#endregion
//#region src/components/chart-hero/index.js
t("chart-hero", T);
//#endregion
export { T as t };
