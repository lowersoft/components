import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./rolling-VjfpUD4B.js";
import { n as a } from "./highlight-BSyGT8bg.js";
import { Y as o, at as s, d as c } from "./lucide-BVbUPHVq.js";
import { l, o as u, r as d, s as f } from "./pricing-gtu3N0Z1.js";
//#region src/components/agency-services-pricing/agency-services-pricing.scss?inline
var p = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);--_raised:color-mix(in oklab, var(--lw-color-foreground) 4%, var(--lw-color-background))}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.title{letter-spacing:-.03em;font-size:clamp(1.75rem,4vw,2.25rem);font-weight:600}.description{font-size:var(--lw-text-md);color:var(--_muted);margin-top:.75rem}.frame{border:1px solid var(--_line);margin-top:2.5rem}.services{display:grid}@container (width>=54rem){.services{grid-template-columns:repeat(3,minmax(0,1fr))}}.service{border-bottom:1px solid var(--_line);flex-direction:column;padding:2rem;display:flex}@container (width>=54rem){.service+.service{border-left:1px solid var(--_line)}}.service[data-featured]{background:var(--_raised);box-shadow:inset 0 2px 0 var(--lw-color-foreground)}.name{font-size:var(--lw-text-md);font-weight:500}.price{align-items:baseline;gap:.5rem;margin-top:1.25rem;display:flex}.from,.price .per{font-size:var(--lw-text-md);color:var(--_muted)}.figure{letter-spacing:-.04em;font-size:2.25rem;font-weight:700}.blurb{max-width:22rem;font-size:var(--lw-text-md);color:var(--_muted);margin-top:1rem;line-height:1.5}.weeks{color:var(--_muted);margin-top:.75rem}.features{border-top:1px solid var(--_line);gap:.875rem;margin:1.75rem 0 2.25rem;padding:1.75rem 0 0;list-style:none;display:grid}.features li{font-size:var(--lw-text-md);align-items:center;gap:.75rem;display:flex}.features li svg{color:var(--_muted);flex:none}.action{margin-top:auto}.action::part(button){width:100%;height:2.75rem}.estimate{display:grid}@container (width>=54rem){.estimate{grid-template-columns:minmax(0,2fr) minmax(0,1fr)}}.build,.result{padding:2rem}.result{border-top:1px solid var(--_line);background:var(--_raised);flex-direction:column;align-items:flex-start;display:flex}@container (width>=54rem){.result{border-top:0;border-left:1px solid var(--_line)}}.estimate-title{font-size:var(--lw-text-md);font-weight:500}.label{font-size:var(--lw-text-sm);color:var(--_muted)}.build .label{margin:1.5rem 0 .75rem}.starts{border:1px solid var(--_line);border-radius:var(--lw-radius-lg);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;padding:.25rem;display:grid;position:relative}.start-pill{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.start-pill{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.start-pill.visible{opacity:1}.start-pill{background:color-mix(in oklab, var(--lw-color-foreground) 8%, transparent)}.start{border-radius:var(--lw-radius-md);font-size:var(--lw-text-md);color:var(--_muted);cursor:pointer;background:0 0;border:0;padding:.625rem;position:relative}.start[aria-checked=true]{color:var(--lw-color-foreground)}.extras{margin-top:1.25rem;padding:0;list-style:none;display:grid}.extra{border-bottom:1px solid var(--_line);align-items:center;gap:1rem;min-height:2.75rem;display:flex}.extra-label{flex:1;min-width:0}.extra-label::part(label){font-weight:400}.cost{font-variant-numeric:tabular-nums;color:var(--_muted)}[data-on]>.cost{color:var(--lw-color-foreground)}.counter{border:1px solid var(--_line);border-radius:var(--lw-radius-md);align-items:center;display:flex}.step{border-radius:var(--lw-radius-md);width:1.75rem;height:1.75rem;color:var(--_muted);cursor:pointer;background:0 0;border:0;place-items:center;padding:0;display:grid}.step:hover:not(:disabled){color:var(--lw-color-foreground)}.step:disabled{cursor:default;opacity:.35}.count{font-variant-numeric:tabular-nums;text-align:center;min-width:1.5rem}.total{align-items:baseline;gap:.375rem;margin-top:.5rem;display:flex}.total .per{color:var(--_muted)}.amount{letter-spacing:-.05em;font-size:clamp(2.5rem,6vw,3.25rem);font-weight:700;line-height:1}.delivery{font-size:var(--lw-text-md);margin-top:.75rem}.note{font-size:var(--lw-text-xs);color:var(--_muted);margin:.5rem 0 1.75rem;line-height:1.5}.book{margin-top:auto}", m = [
	{
		id: "audit",
		name: "Performance audit",
		short: "Audit",
		price: 4800,
		from: !0,
		weeks: [2, 3],
		blurb: "Find where the time goes in one hot path, and fix the worst of it.",
		action: "Start an audit",
		features: [
			"Profiling on your real workload",
			"Flame graphs and a written report",
			"The top three fixes, merged",
			"Benchmarks to keep it fast",
			"Handover call and docs"
		]
	},
	{
		id: "port",
		name: "Native port",
		short: "Port",
		price: 12e3,
		from: !0,
		weeks: [5, 7],
		blurb: "Move a slow service or tool to hand-tuned C, with the same behaviour.",
		action: "Start a port",
		featured: !0,
		features: [
			"Up to 8 modules and a test suite",
			"SIMD where it counts",
			"Three review rounds",
			"Fuzzing and sanitizer pass",
			"30 days of post-launch fixes"
		]
	},
	{
		id: "retainer",
		name: "Monthly retainer",
		short: "Retainer",
		price: 6500,
		monthly: !0,
		weeks: [1, 2],
		start: "First release in",
		blurb: "An embedded systems team on your codebase, one request at a time.",
		action: "Book an intro call",
		features: [
			"Unlimited requests, one at a time",
			"Profiling and fixes in one team",
			"Shared Slack channel",
			"Weekly check-in call",
			"Pause or cancel any month"
		]
	}
], h = [
	{
		id: "targets",
		label: "Extra platform target",
		price: 2400,
		weeks: 1,
		max: 6
	},
	{
		id: "fuzz",
		label: "Continuous fuzzing harness",
		price: 1800
	},
	{
		id: "bench",
		label: "Benchmark dashboard",
		price: 1200
	},
	{
		id: "rush",
		label: "Rush delivery",
		percent: 25,
		faster: .3
	}
], g = ([e, t]) => e === t ? `${e} ${e === 1 ? "week" : "weeks"}` : `${e}–${t} weeks`, _ = class extends e {
	static styles = [
		i,
		l,
		p
	];
	static props = {
		heading: { default: "Studio pricing" },
		description: { default: "Fixed-scope work or an ongoing team. Every project starts with a free 30-minute call." },
		value: {
			default: "port",
			reflect: !0
		},
		services: {
			type: Object,
			default: m
		},
		extras: {
			type: Object,
			default: h
		}
	};
	#e = /* @__PURE__ */ new Map();
	render() {
		return `<header class="head"><h2 class="title"></h2><p class="description"></p></header>
<div class="frame"><div class="services"></div>
<section class="estimate" aria-labelledby="estimate-title"><div class="build"><h3 class="estimate-title" id="estimate-title">Build an estimate</h3>
<p class="label" id="start-label">Start from</p><div class="starts" role="radiogroup" aria-labelledby="start-label"><span class="start-pill"></span></div><ul class="extras"></ul></div>
<div class="result"><p class="label">Estimated total</p><p class="total">${f()}<span class="per"></span></p><p class="delivery"></p><p class="note">A starting point. We confirm scope and price on the intro call.</p><lw-button class="book">Book an intro call</lw-button></div></section></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".services").addEventListener("click", (e) => {
			let t = e.target.closest(".action");
			t && (this.value = t.dataset.id, this.emit("choose", this.#a));
		}, e);
		let t = this.query(".starts");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".start");
			t && (this.value = t.dataset.id);
		}, e), t.addEventListener("keydown", (e) => {
			let n = {
				ArrowRight: 1,
				ArrowDown: 1,
				ArrowLeft: -1,
				ArrowUp: -1
			}[e.key];
			if (!n) return;
			e.preventDefault();
			let r = this.services.indexOf(this.#t);
			this.value = this.services[(r + n + this.services.length) % this.services.length].id, t.querySelector(`[data-id="${CSS.escape(this.value)}"]`).focus();
		}, e);
		let n = this.query(".extras");
		n.addEventListener("change", (e) => {
			let t = e.target.closest("lw-checkbox");
			if (!t) return;
			let n = this.extras.find((e) => e.id === t.dataset.id);
			this.#e.set(n.id, +!!t.checked), this.#s();
		}, e), n.addEventListener("click", (e) => {
			let t = e.target.closest(".step");
			if (!t) return;
			let n = this.extras.find((e) => e.id === t.dataset.id);
			this.#e.set(n.id, Math.min(n.max, Math.max(0, (this.#e.get(n.id) ?? 0) + Number(t.dataset.step)))), this.#s();
		}, e), this.query(".book").addEventListener("click", () => this.emit("choose", this.#a), e);
		let r = new ResizeObserver(() => this.#o());
		r.observe(t), this.signal.addEventListener("abort", () => r.disconnect());
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", e.has("services") && this.#n(), e.has("extras") && this.#r(), this.#s();
	}
	get #t() {
		return this.services.find((e) => e.id === this.value) ?? this.services[0];
	}
	#n() {
		this.query(".services").innerHTML = this.services.map((e) => `<article class="service"${e.featured ? " data-featured" : ""}><h3 class="name">${n(e.name)}</h3>
<p class="price">${e.from ? "<span class=\"from\">from</span>" : ""}<span class="figure">${d(e.price)}</span>${e.monthly ? "<span class=\"per\">/ month</span>" : ""}</p>
<p class="blurb">${n(e.blurb)}</p><p class="weeks">${n(e.start ? `${e.start} ${g(e.weeks)}` : g(e.weeks))}</p>
<ul class="features">${e.features.map((e) => `<li>${r(c, 16)}<span>${n(e)}</span></li>`).join("")}</ul>
<lw-button class="action" data-id="${n(e.id)}" variant="${e.featured ? "primary" : "outline"}">${n(e.action)}</lw-button></article>`).join("");
		let e = this.query(".starts");
		e.querySelectorAll(".start").forEach((e) => e.remove()), e.insertAdjacentHTML("beforeend", this.services.map((e) => `<button class="start" type="button" role="radio" data-id="${n(e.id)}">${n(e.short ?? e.name)}</button>`).join(""));
	}
	#r() {
		this.query(".extras").innerHTML = (this.extras ?? []).map((e) => {
			let t = e.percent ? `+${e.percent}%` : `+${d(e.price)}${e.max ? " each" : ""}`, i = e.max ? `<span class="extra-label">${n(e.label)}</span><span class="counter" role="group" aria-label="${n(e.label)}"><button class="step" type="button" data-id="${n(e.id)}" data-step="-1" aria-label="Fewer">${r(o, 14)}</button><output class="count"></output><button class="step" type="button" data-id="${n(e.id)}" data-step="1" aria-label="More">${r(s, 14)}</button></span>` : `<lw-checkbox class="extra-label" data-id="${n(e.id)}">${n(e.label)}</lw-checkbox>`;
			return `<li class="extra" data-id="${n(e.id)}">${i}<span class="cost">${t}</span></li>`;
		}).join("");
	}
	get #i() {
		let e = this.#t, t = e.price, [n, r] = e.weeks, i = 0, a = 0;
		for (let e of this.extras ?? []) {
			let o = this.#e.get(e.id) ?? 0;
			o && (t += (e.price ?? 0) * o, n += (e.weeks ?? 0) * o, r += (e.weeks ?? 0) * o, i += e.percent ?? 0, a += e.faster ?? 0);
		}
		t = Math.round(t * (1 + i / 100));
		let o = [Math.max(1, Math.round(n * (1 - a))), Math.max(1, Math.round(r * (1 - a)))];
		return {
			total: t,
			weeks: o
		};
	}
	get #a() {
		let { total: e, weeks: t } = this.#i;
		return {
			service: this.#t.id,
			extras: Object.fromEntries([...this.#e].filter(([, e]) => e)),
			total: e,
			weeks: t
		};
	}
	#o() {
		let e = null;
		for (let t of this.shadowRoot.querySelectorAll(".start")) {
			let n = t.dataset.id === this.#t.id;
			t.ariaChecked = String(n), t.tabIndex = n ? 0 : -1, n && (e = t);
		}
		e?.offsetWidth && a(this.query(".start-pill"), e);
	}
	#s() {
		let e = this.#t;
		this.#o();
		for (let e of this.extras ?? []) {
			let t = this.#e.get(e.id) ?? 0, n = this.query(`.extra[data-id="${CSS.escape(e.id)}"]`);
			n.toggleAttribute("data-on", t > 0), e.max ? (n.querySelector(".count").value = String(t), n.querySelector("[data-step=\"-1\"]").disabled = t <= 0, n.querySelector("[data-step=\"1\"]").disabled = t >= e.max) : n.querySelector("lw-checkbox").checked = t > 0;
		}
		let { total: t, weeks: n } = this.#i;
		u(this.query(".amount"), t), this.query(".result .per").textContent = e.monthly ? "/ month" : "", this.query(".delivery").textContent = e.monthly ? `First release in ${g(n)}` : `Delivered in ${g(n)}`;
	}
};
//#endregion
//#region src/components/agency-services-pricing/index.js
t("agency-services-pricing", _);
//#endregion
export { _ as t };
