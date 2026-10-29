import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./rolling-VjfpUD4B.js";
import { Y as a, at as o, d as s } from "./lucide-BVbUPHVq.js";
import { a as c, c as l, i as u, l as d, n as f, o as p, r as m, s as h, t as g } from "./pricing-gtu3N0Z1.js";
//#region src/components/three-tier-pricing/three-tier-pricing.scss?inline
var _ = ".head{flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:1.5rem 3rem;margin-bottom:3.5rem;display:flex}.title{letter-spacing:-.045em;text-wrap:balance;max-width:34rem;font-size:clamp(2.25rem,6vw,3.75rem);font-weight:700;line-height:1}.description{max-width:26rem;font-size:var(--lw-text-lg);color:var(--lw-color-muted-foreground);margin-top:1.25rem;line-height:1.5}.switch{flex-wrap:wrap;align-items:center;gap:.5rem 1rem;display:flex}.note{color:var(--lw-color-muted-foreground)}.tiers{gap:1rem;display:grid}@container (width>=52rem){.tiers{border:1px solid var(--lw-color-border);grid-template-columns:repeat(3,minmax(0,1fr));gap:0}}.tier{border:1px solid var(--lw-color-border);flex-direction:column;padding:2rem;display:flex}@container (width>=52rem){.tier{border:0}.tier+.tier{border-left:1px solid var(--lw-color-border)}}.tier[data-featured]{--lw-color-background:var(--_ink);--lw-color-foreground:var(--_paper);--lw-color-muted:color-mix(in oklab, var(--_paper) 10%, var(--_ink));--lw-color-muted-foreground:color-mix(in oklab, var(--_paper) 62%, var(--_ink));--lw-color-border:color-mix(in oklab, var(--_paper) 16%, var(--_ink));--lw-color-primary:var(--_paper);--lw-color-primary-foreground:var(--_ink);--lw-color-secondary:color-mix(in oklab, var(--_paper) 10%, var(--_ink));--lw-color-secondary-foreground:var(--_paper);background:var(--_ink);color:var(--_paper);box-shadow:var(--lw-shadow-md);border-color:#0000;border-radius:2px}@container (width>=52rem){.tier[data-featured]{margin:-1.5rem 0;padding-block:3.5rem}}.tier[data-featured]+.tier{border-left:0}.tier-head{justify-content:space-between;align-items:baseline;gap:1rem;display:flex}.name{font-size:var(--lw-text-lg);font-weight:500}.badge{font:var(--lw-text-xs) var(--lw-font-mono);color:var(--lw-color-destructive)}.blurb{max-width:18rem;min-height:3em;font-size:var(--lw-text-md);color:var(--lw-color-muted-foreground);margin-top:.5rem;line-height:1.5}.price{align-items:baseline;gap:.5rem;margin-top:2.5rem;display:flex}.amount{letter-spacing:-.05em;font-size:clamp(3rem,6vw,4rem);font-weight:700;line-height:1}.per{font-size:var(--lw-text-md);color:var(--lw-color-muted-foreground)}.terms{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.5rem 1rem;min-height:2.5rem;margin-top:1rem;display:flex}.billed{color:var(--lw-color-muted-foreground)}.seats{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);align-items:center;display:flex}.step{border-radius:var(--lw-radius-md);width:2.25rem;height:2.25rem;color:var(--lw-color-muted-foreground);cursor:pointer;background:0 0;border:0;outline:none;place-items:center;padding:0;display:grid}.step:hover:not(:disabled){color:var(--lw-color-foreground)}.step:active:not(:disabled){scale:.92}.step:disabled{cursor:default;opacity:.35}.step:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.seat-count{font-variant-numeric:tabular-nums;text-align:center;min-width:1.75rem}.action{margin-top:1.5rem}.action::part(button){width:100%;height:2.75rem}.features{border-top:1px solid var(--lw-color-border);margin-top:2rem;padding-top:2rem}.features ul{gap:.875rem;padding:0;list-style:none;display:grid}.features li{font-size:var(--lw-text-md);align-items:center;gap:.75rem;display:flex}.features li svg{color:var(--lw-color-muted-foreground);flex:none}.includes{font-size:var(--lw-text-md);color:var(--lw-color-muted-foreground);margin-bottom:1rem}", [v, y, b] = g, x = [
	{
		...v,
		action: "Start for free",
		features: [
			"Up to 3 projects",
			"1,000 events a month",
			"7-day history",
			"Community support"
		]
	},
	{
		...y,
		action: "Start 14-day trial",
		featured: !0,
		includes: "Everything in Hobby, plus:",
		features: [
			"Unlimited projects",
			"50,000 events a month",
			"90-day history",
			"Custom domains",
			"Email support"
		]
	},
	{
		...b,
		monthly: 18,
		perSeat: !0,
		seats: 5,
		action: "Choose Team",
		includes: "Everything in Pro, plus:",
		features: [
			"500,000 events a month",
			"Roles and permissions",
			"Audit log",
			"Priority support"
		]
	}
], S = 100, C = class extends e {
	static styles = [
		i,
		d,
		_
	];
	static props = {
		heading: { default: "Start free. Pay as your team grows." },
		description: { default: "Every plan includes unlimited viewers and a 14-day trial of Pro." },
		billing: {
			default: "monthly",
			reflect: !0
		},
		note: { default: "2 months free on yearly" },
		badge: { default: "Most picked" },
		tiers: {
			type: Object,
			default: x
		}
	};
	#e = /* @__PURE__ */ new Map();
	render() {
		return `<header class="head"><div><h2 class="title"></h2><p class="description"></p></div><div class="switch">${f()}<span class="note"></span></div></header><div class="tiers"></div>`;
	}
	connected() {
		l(this), this.query(".tiers").addEventListener("click", (e) => {
			let t = e.target.closest(".tier");
			if (!t) return;
			let n = this.tiers.find((e) => e.id === t.dataset.id), r = e.target.closest(".step");
			if (r) return this.#r(n, this.#n(n) + Number(r.dataset.step));
			e.target.closest(".action") && this.emit("choose", {
				plan: n.id,
				billing: this.billing,
				seats: n.perSeat ? this.#n(n) : void 0,
				total: this.#i(n)
			});
		}, { signal: this.signal });
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", this.query(".note").textContent = this.note ?? "", (e.has("tiers") || e.has("badge")) && this.#t(), c(this), this.#a();
	}
	#t() {
		this.query(".tiers").innerHTML = (this.tiers ?? []).map((e) => {
			let t = e.perSeat ? `<div class="seats" role="group" aria-label="Seats"><button class="step" type="button" data-step="-1" aria-label="Remove a seat">${r(a, 16)}</button><output class="seat-count" aria-live="polite"></output><button class="step" type="button" data-step="1" aria-label="Add a seat">${r(o, 16)}</button></div>` : "", i = e.featured && this.badge ? `<span class="badge">${n(this.badge)}</span>` : "";
			return `<article class="tier"${e.featured ? " data-featured" : ""} data-id="${n(e.id)}" aria-labelledby="tier-${n(e.id)}">
<div class="tier-head"><h3 class="name" id="tier-${n(e.id)}">${n(e.name)}</h3>${i}</div><p class="blurb">${n(e.blurb)}</p>
<p class="price">${h()}<span class="per">/ month</span></p><div class="terms"><span class="billed"></span>${t}</div>
<lw-button class="action" variant="${e.featured ? "primary" : "outline"}">${n(e.action)}</lw-button>
<div class="features">${e.includes ? `<p class="includes">${n(e.includes)}</p>` : ""}<ul>${e.features.map((e) => `<li>${r(s, 16)}<span>${n(e)}</span></li>`).join("")}</ul></div></article>`;
		}).join("");
	}
	#n(e) {
		return this.#e.get(e.id) ?? e.seats ?? 1;
	}
	#r(e, t) {
		this.#e.set(e.id, Math.min(S, Math.max(1, t))), this.#a();
	}
	#i(e) {
		return u(e.monthly, this.billing) * (e.perSeat ? this.#n(e) : 1);
	}
	#a() {
		let e = this.billing === "yearly";
		for (let t of this.shadowRoot.querySelectorAll(".tier")) {
			let n = this.tiers.find((e) => e.id === t.dataset.id);
			p(t.querySelector(".amount"), this.#i(n));
			let r = e ? "billed yearly" : "billed monthly", i = n.monthly ? `${r[0].toUpperCase()}${r.slice(1)}${e ? ` · ${m(this.#i(n) * 12)} a year` : ""}` : "Free forever";
			if (n.perSeat) {
				let e = this.#n(n);
				i = `${m(u(n.monthly, this.billing))} / seat · ${r}`, t.querySelector(".seat-count").value = String(e), t.querySelector("[data-step=\"-1\"]").disabled = e <= 1, t.querySelector("[data-step=\"1\"]").disabled = e >= S;
			}
			t.querySelector(".billed").textContent = i;
		}
	}
};
//#endregion
//#region src/components/three-tier-pricing/index.js
t("three-tier-pricing", C);
//#endregion
export { C as t };
