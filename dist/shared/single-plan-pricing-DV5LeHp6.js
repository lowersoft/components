import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./rolling-VjfpUD4B.js";
import { n as a, t as o } from "./people-C_zYMoEl.js";
import { d as s, i as c } from "./lucide-BVbUPHVq.js";
import { a as l, c as u, l as d, n as f, o as p, r as m, s as h } from "./pricing-gtu3N0Z1.js";
//#region src/components/single-plan-pricing/single-plan-pricing.scss?inline
var g = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));border-radius:1.75rem;width:60rem;max-width:100%;padding:.5rem}.head{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.75rem 1.5rem;padding:.75rem 1rem 1rem;display:flex}.product{font-size:var(--lw-text-md);font-weight:500}.proof{color:var(--_muted);align-items:center;gap:.75rem;display:flex}.faces{display:flex}.face{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));width:1.625rem;height:1.625rem;box-shadow:0 0 0 2px var(--lw-color-background);border-radius:50%;place-items:center;font-size:.5625rem;font-weight:600;display:grid}.face+.face{margin-left:-.375rem}.card{border:1px solid var(--_line);background:var(--lw-color-background);border-radius:1.25rem;display:grid}@container (width>=46rem){.card{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr)}}.buy{border-bottom:1px solid var(--_line);flex-direction:column;align-items:flex-start;padding:1.5rem;display:flex}@container (width>=46rem){.buy{border-right:1px solid var(--_line);border-bottom:0}}.billing{background:0 0;border:0;padding:0}.billing-pill{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-foreground) 9%, transparent);box-shadow:none}.billing-option{border-radius:var(--lw-radius-full);font-size:var(--lw-text-md);padding:.5rem .875rem;font-weight:400}.save{color:var(--_muted)}.price{margin-top:1.75rem}.amount{letter-spacing:-.05em;font-size:clamp(3.5rem,9vw,4.5rem);font-weight:700;line-height:1}.billed{color:var(--_muted);margin-top:1rem}.description{max-width:22rem;font-size:var(--lw-text-md);margin:1.25rem 0 2.5rem;line-height:1.6}.action{border-radius:var(--lw-radius-full);background:var(--lw-color-primary);width:100%;font:500 var(--lw-text-md) var(--lw-font-sans);color:var(--lw-color-primary-foreground);cursor:pointer;border:0;outline:none;justify-content:space-between;align-items:center;margin-top:auto;padding:.375rem .375rem .375rem 1.25rem;display:flex}.action:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.action:active{scale:.99}.arrow{background:color-mix(in oklab, var(--lw-color-primary-foreground) 8%, transparent);border-radius:50%;place-items:center;width:2.25rem;height:2.25rem;display:grid}@media (prefers-reduced-motion:no-preference){.arrow{transition:translate .2s ease-out}}.action:hover .arrow{translate:3px}.guarantee{font-size:var(--lw-text-xs);color:var(--_muted);align-self:center;margin-top:.875rem}.included{padding:1.5rem}.included-title{font-size:var(--lw-text-md);margin-bottom:1.5rem;font-weight:500}.features{grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));gap:1.5rem;padding:0;list-style:none;display:grid}.features li{gap:.75rem;display:flex}.features li>svg{color:var(--_muted);flex:none;margin-top:.125rem}.feature,.detail{line-height:1.5;display:block}.feature{font-size:var(--lw-text-md)}.detail{color:var(--_muted);margin-top:.25rem}", _ = {
	monthly: 12,
	yearly: 96,
	lifetime: 199
}, v = [
	{ title: "Unlimited profiling sessions" },
	{
		title: "Full trace toolkit",
		detail: "Flame graphs, allocations, locks and syscalls"
	},
	{
		title: "Shareable trace links",
		detail: "Set links to expire after a day, a week or never"
	},
	{ title: "Remote symbol server" },
	{ title: "Turn a hot path into a benchmark" },
	{ title: "Custom shortcuts and presets" },
	{
		title: "Use on up to 3 machines",
		detail: "Add more seats any time"
	},
	{
		title: "Priority email support",
		detail: "Replies within one business day"
	}
], y = [
	"Mia Tanaka",
	"Tom Green",
	"Rosa Silva",
	"Leo Vance"
], b = class extends e {
	static styles = [
		i,
		d,
		g
	];
	static props = {
		product: { default: "Lower Pro" },
		description: { default: "Profile, trace and fix native code without leaving your editor." },
		billing: {
			default: "yearly",
			reflect: !0
		},
		prices: {
			type: Object,
			default: _
		},
		features: {
			type: Object,
			default: v
		},
		team: {
			type: Object,
			default: y
		},
		proof: { default: "Used by 2,400 teams" },
		action: { default: "Start 14-day trial" },
		guarantee: { default: "30-day money-back guarantee" }
	};
	render() {
		let { monthly: e, yearly: t, lifetime: n } = this.prices ?? {}, i = {};
		return e != null && (i.monthly = "Monthly"), t != null && (i.yearly = e ? `Yearly <span class="save">−${Math.round((1 - t / (e * 12)) * 100)}%</span>` : "Yearly"), n != null && (i.lifetime = "Lifetime"), `<header class="head"><h2 class="product"></h2><p class="proof"><span class="faces"></span><span class="proof-text"></span></p></header>
<div class="card"><div class="buy">${f(i)}<p class="price">${h()}</p><p class="billed"></p><p class="description"></p>
<button class="action" type="button"><span class="action-text"></span><span class="arrow">${r(c, 16)}</span></button><p class="guarantee"></p></div>
<section class="included" aria-labelledby="included-title"><h3 class="included-title" id="included-title">Everything included</h3><ul class="features"></ul></section></div>`;
	}
	connected() {
		u(this), this.query(".action").addEventListener("click", () => this.emit("choose", {
			billing: this.billing,
			price: this.prices[this.billing]
		}), { signal: this.signal });
	}
	updated(e) {
		this.query(".product").textContent = this.product ?? "", this.query(".description").textContent = this.description ?? "", this.query(".proof-text").textContent = this.proof ?? "", this.query(".guarantee").textContent = this.guarantee ?? "", e.has("team") && (this.query(".faces").innerHTML = (this.team ?? []).map((e) => `<span class="face" style="--_hue: ${o(e)}" title="${n(e)}">${n(a(e))}</span>`).join("")), e.has("features") && (this.query(".features").innerHTML = (this.features ?? []).map((e) => `<li>${r(s, 16)}<span><span class="feature">${n(e.title)}</span>${e.detail ? `<span class="detail">${n(e.detail)}</span>` : ""}</span></li>`).join("")), l(this), this.#e();
	}
	#e() {
		let e = this.prices ?? {}, t = this.billing in e ? this.billing : Object.keys(e)[0], n = e[t], r = t === "yearly" ? Math.round(n / 12) : n;
		p(this.query(".amount"), r), this.query(".billed").textContent = {
			monthly: "per month, billed monthly",
			yearly: `per month, billed ${m(n)} yearly`,
			lifetime: "once, yours for good"
		}[t], this.query(".action-text").textContent = t === "lifetime" ? `Buy once for ${m(n)}` : this.action ?? "";
	}
};
//#endregion
//#region src/components/single-plan-pricing/index.js
t("single-plan-pricing", b);
//#endregion
export { b as t };
