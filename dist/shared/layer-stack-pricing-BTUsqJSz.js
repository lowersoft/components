import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { n as r } from "./rolling-VjfpUD4B.js";
import { n as i, t as a } from "./swap-BK53XQML.js";
import { a as o, c as s, i as c, l, n as u, o as d, r as f, s as p, t as m } from "./pricing-gtu3N0Z1.js";
//#region src/components/layer-stack-pricing/layer-stack-pricing.scss?inline
var h = ":host{--_ease:cubic-bezier(.23, 1, .32, 1);--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);--_raised:color-mix(in oklab, var(--lw-color-foreground) 4%, var(--lw-color-background))}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:-2px}.head{flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:1.5rem 3rem;margin-bottom:2.5rem;display:flex}.title{letter-spacing:-.04em;text-wrap:balance;max-width:26rem;font-size:clamp(2rem,5vw,2.75rem);font-weight:700;line-height:1.05}.description{font-size:var(--lw-text-md);color:var(--_muted);margin-top:.75rem}.switch{flex-wrap:wrap;align-items:center;gap:.5rem 1rem;display:flex}.note{font-size:var(--lw-text-xs);color:var(--_muted)}.frame{border:1px solid var(--_line);display:grid}@container (width>=50rem){.frame{grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr)}}.stage{border-bottom:1px solid var(--_line);flex-direction:column;min-height:22rem;margin:0;padding:1.5rem;display:flex}@container (width>=50rem){.stage{border-right:1px solid var(--_line);border-bottom:0}}.stack{flex:1;width:100%;max-width:23rem;margin:auto;display:block;overflow:visible}.layer{cursor:pointer}@media (prefers-reduced-motion:no-preference){.layer .lift{transition:translate .5s var(--_ease), opacity .4s ease-out}}.layer[data-above] .lift{opacity:.12;translate:0 -2.5rem}.layer[data-above]:hover .lift{opacity:.3}.top{fill:var(--lightningcss-light,#fff)var(--lightningcss-dark,#f4f4f5);stroke:var(--lightningcss-light,#d4d4d8)var(--lightningcss-dark,#e4e4e7);stroke-width:1px}.side{stroke:var(--lightningcss-light,#d4d4d8)var(--lightningcss-dark,#0000);stroke-width:1px}.side.left{fill:var(--lightningcss-light,#e4e4e7)var(--lightningcss-dark,#d4d4d8)}.side.right{fill:var(--lightningcss-light,#d4d4d8)var(--lightningcss-dark,#a1a1aa)}.label{font:10px var(--lw-font-sans);fill:#52525b}[data-current] .label{fill:#dc2626}.caption{font:var(--lw-text-xs) var(--lw-font-mono);color:var(--_muted);justify-content:space-between;display:flex}.plans{border-bottom:1px solid var(--_line);display:grid}.plan{text-align:left;cursor:pointer;background:0 0;border:0;align-items:center;gap:1rem;padding:1.125rem 1.5rem;display:flex}@media (prefers-reduced-motion:no-preference){.plan{transition:background-color .2s ease-out}}.plan+.plan{border-top:1px solid var(--_line)}.plan[aria-checked=true]{background:var(--_raised)}.plan:hover:not([aria-checked=true]){background:color-mix(in oklab, var(--_raised) 50%, transparent)}.radio{border:1px solid color-mix(in oklab, var(--lw-color-foreground) 35%, transparent);border-radius:50%;flex:none;place-items:center;width:1rem;height:1rem;display:grid}.radio:after{content:\"\";background:var(--lw-color-foreground);border-radius:50%;width:.5rem;height:.5rem;scale:0}@media (prefers-reduced-motion:no-preference){.radio:after{transition:scale .25s var(--_ease)}}[aria-checked=true]>.radio:after{scale:1}.plan-text{flex:1;gap:.25rem;min-width:0;display:grid}.plan-name{align-items:baseline;gap:.5rem;font-weight:600;display:flex}.index{font:.625rem var(--lw-font-mono);color:var(--_muted);font-weight:400}.blurb,.plan-price{color:var(--_muted)}.plan-price b{color:var(--lw-color-foreground);font-weight:600}.summary{gap:1.5rem;padding:1.5rem;display:grid}.cost{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;display:flex}.price{align-items:baseline;gap:.375rem;display:flex}.amount{letter-spacing:-.05em;font-size:clamp(2.75rem,7vw,3.5rem);font-weight:700;line-height:1}.per,.billed{color:var(--_muted)}.billed{font-size:var(--lw-text-xs);margin-top:.5rem}.stats{border:1px solid var(--_line);border-radius:var(--lw-radius-md);background:var(--_line);grid-template-columns:repeat(auto-fit,minmax(6.5rem,1fr));gap:1px;margin:0;display:grid;overflow:hidden}.stat{background:var(--lw-color-background);gap:.25rem;padding:.625rem .75rem;display:grid}.stat dt{font-size:var(--lw-text-xs);color:var(--_muted)}.stat dd{margin:0;font-weight:600}.adds{padding:0;list-style:none;display:grid}.add{border-top:1px solid var(--_line);grid-template-columns:1.5rem 7rem minmax(0,1fr);align-items:baseline;gap:.75rem;padding:.875rem 0;display:grid}@media (prefers-reduced-motion:no-preference){.add{transition:opacity .3s ease-out}}.add[data-above]{opacity:.35}@container (width<=30rem){.add{grid-template-columns:1.5rem minmax(0,1fr)}.add .add-items{grid-column:2}}.add-title{color:var(--_muted)}.add-items{flex-wrap:wrap;gap:.25rem 1rem;display:flex}", [g, _, v] = m, y = [
	{
		...g,
		stats: {
			Projects: "3",
			"Events / mo": "1,000",
			History: "7 days",
			Seats: "1"
		},
		adds: [
			"Unlimited viewers",
			"Shareable dashboards",
			"Community support"
		]
	},
	{
		..._,
		stats: {
			Projects: "Unlimited",
			"Events / mo": "50,000",
			History: "90 days",
			Seats: "3"
		},
		adds: [
			"Custom domains",
			"API access",
			"Email support"
		]
	},
	{
		...v,
		stats: {
			Projects: "Unlimited",
			"Events / mo": "500,000",
			History: "1 year",
			Seats: "10"
		},
		adds: [
			"Roles and permissions",
			"Audit log",
			"Priority support"
		]
	}
], b = 130, x = 75, S = 20, C = 58, w = {
	width: 300,
	height: 420
}, T = (e) => String(e).padStart(2, "0"), E = (e, t, r, i) => {
	let [a, o, s] = [
		b,
		x,
		S
	], c = (e) => e.map(([e, t]) => `${e},${t}`).join(" ");
	return `<g class="layer" data-index="${t}"><g class="lift">
<polygon class="side left" points="${c([
		[r - a, i],
		[r, i + o],
		[r, i + o + s],
		[r - a, i + s]
	])}"/>
<polygon class="side right" points="${c([
		[r, i + o],
		[r + a, i],
		[r + a, i + s],
		[r, i + o + s]
	])}"/>
<polygon class="top" points="${c([
		[r, i - o],
		[r + a, i],
		[r, i + o],
		[r - a, i]
	])}"/>
<text class="label" transform="translate(${r - a + 12} ${i + 15}) skewY(30)">${T(t + 1)} ${n(e.name)}</text></g></g>`;
}, D = class extends e {
	static styles = [
		r,
		i,
		l,
		h
	];
	static props = {
		heading: { default: "Build up to the plan you need." },
		description: { default: "Each plan is a layer on the one below. Stop where it fits." },
		billing: {
			default: "monthly",
			reflect: !0
		},
		note: { default: "2 months free on yearly" },
		value: {
			default: "team",
			reflect: !0
		},
		layers: {
			type: Object,
			default: y
		}
	};
	render() {
		return `<header class="head"><div><h2 class="title"></h2><p class="description"></p></div><div class="switch">${u()}<span class="note"></span></div></header>
<div class="frame"><figure class="stage"><svg class="stack" viewBox="0 0 ${w.width} ${w.height}" aria-hidden="true"></svg><figcaption class="caption"><span class="position"></span><span class="swap current"></span></figcaption></figure>
<div class="panel"><div class="plans" role="radiogroup" aria-label="Plan"></div>
<div class="summary"><div class="cost"><div><p class="price">${p()}<span class="per">/ month</span></p><p class="billed"></p></div><lw-button class="action"></lw-button></div>
<dl class="stats"></dl><ol class="adds"></ol></div></div></div>`;
	}
	connected() {
		s(this);
		let e = { signal: this.signal }, t = this.query(".plans");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".plan");
			t && this.#r(t.dataset.id);
		}, e), t.addEventListener("keydown", (e) => {
			let t = {
				ArrowDown: -1,
				ArrowRight: -1,
				ArrowUp: 1,
				ArrowLeft: 1
			}[e.key];
			if (!t) return;
			e.preventDefault();
			let n = this.layers[Math.min(this.layers.length - 1, Math.max(0, this.#e + t))];
			this.#r(n.id), this.query(`.plan[data-id="${CSS.escape(n.id)}"]`).focus();
		}, e), this.query(".stack").addEventListener("click", (e) => {
			let t = e.target.closest(".layer");
			t && this.#r(this.layers[Number(t.dataset.index)].id);
		}, e), this.query(".action").addEventListener("click", () => {
			let e = this.layers[this.#e];
			this.emit("choose", {
				plan: e.id,
				billing: this.billing,
				price: c(e.monthly, this.billing)
			});
		}, e);
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", this.query(".note").textContent = this.note ?? "", e.has("layers") && this.#t(), o(this), this.#n();
	}
	get #e() {
		return Math.max(0, (this.layers ?? []).findIndex((e) => e.id === this.value));
	}
	#t() {
		let e = this.layers ?? [], t = w.width / 2, r = w.height / 2 + (e.length - 1) * C / 2 + 10;
		this.query(".stack").innerHTML = e.map((e, n) => E(e, n, t, r - n * C)).join(""), this.query(".plans").innerHTML = e.map((e, t) => `<button class="plan" type="button" role="radio" data-id="${n(e.id)}"><span class="radio" aria-hidden="true"></span><span class="plan-text"><span class="plan-name"><span class="index">${T(t + 1)}</span>${n(e.name)}</span><span class="blurb">${n(e.blurb)}</span></span><span class="plan-price"></span></button>`).reverse().join(""), this.query(".stats").innerHTML = Object.keys(e[0]?.stats ?? {}).map((e) => `<div class="stat"><dt>${n(e)}</dt><dd class="swap" data-stat="${n(e)}"></dd></div>`).join(""), this.query(".adds").innerHTML = e.map((e, t) => `<li class="add" data-index="${t}"><span class="index">${T(t + 1)}</span><span class="add-title">${t ? `Added in ${n(e.name)}` : `From ${n(e.name)}`}</span><span class="add-items">${e.adds.map((e) => `<span>${n(e)}</span>`).join("")}</span></li>`).join("");
	}
	#n() {
		let e = this.layers ?? [], t = this.#e, n = e[t];
		if (!n) return;
		for (let e of this.shadowRoot.querySelectorAll(".layer")) {
			let n = Number(e.dataset.index);
			e.toggleAttribute("data-above", n > t), e.toggleAttribute("data-current", n === t);
		}
		for (let t of this.shadowRoot.querySelectorAll(".plan")) {
			let r = e.find((e) => e.id === t.dataset.id), i = r === n;
			t.ariaChecked = String(i), t.tabIndex = i ? 0 : -1, t.querySelector(".plan-price").innerHTML = `<b>${f(c(r.monthly, this.billing))}</b>/mo`;
		}
		for (let e of this.shadowRoot.querySelectorAll(".add")) e.toggleAttribute("data-above", Number(e.dataset.index) > t);
		this.query(".position").textContent = `Layer ${T(t + 1)} of ${T(e.length)}`, a(this.query(".current"), n.name);
		let r = c(n.monthly, this.billing);
		d(this.query(".amount"), r);
		let i = this.billing === "yearly";
		this.query(".billed").textContent = n.monthly ? i ? `Billed yearly · ${f(r * 12)} a year` : `Billed monthly · ${f(c(n.monthly, "yearly"))}/mo on yearly` : "Free forever", this.query(".action").textContent = `Choose ${n.name}`;
		for (let e of this.shadowRoot.querySelectorAll("[data-stat]")) a(e, n.stats[e.dataset.stat] ?? "—");
	}
	#r(e) {
		e !== this.value && (this.value = e, this.emit("select", { plan: e }));
	}
};
//#endregion
//#region src/components/layer-stack-pricing/index.js
t("layer-stack-pricing", D);
//#endregion
export { D as t };
