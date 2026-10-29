import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { n as r } from "./rolling-VjfpUD4B.js";
import { a as i, c as a, i as o, l as s, n as c, o as l, s as u, t as d } from "./pricing-gtu3N0Z1.js";
//#region src/components/ticket-pricing/ticket-pricing.scss?inline
var f = ":host{--_notch:.75rem;--_ease:cubic-bezier(.23, 1, .32, 1)}.head{text-align:center;justify-items:center;gap:1rem;margin-bottom:3.5rem;display:grid}.title{letter-spacing:-.045em;font-size:clamp(2.25rem,6vw,3.5rem);font-weight:700;line-height:1}.description{max-width:26rem;font-size:var(--lw-text-lg);color:var(--lw-color-muted-foreground);margin-bottom:1rem;line-height:1.5}.note{font:var(--lw-text-xs) var(--lw-font-mono);color:var(--lw-color-muted-foreground)}.passes{grid-template-columns:repeat(auto-fit,minmax(16rem,1fr));gap:1.25rem;display:grid}.pass{--_face:color-mix(in oklab, var(--lw-color-foreground) 6%, var(--lw-color-background));cursor:pointer;border-radius:1rem;outline:none;flex-direction:column;display:flex}@media (prefers-reduced-motion:no-preference){.pass{transition:translate .3s var(--_ease)}}.pass:hover{translate:0 -3px}.pass:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.pass[aria-checked=true]{--lw-color-background:var(--_ink);--lw-color-foreground:var(--_paper);--lw-color-muted:color-mix(in oklab, var(--_paper) 10%, var(--_ink));--lw-color-muted-foreground:color-mix(in oklab, var(--_paper) 62%, var(--_ink));--lw-color-border:color-mix(in oklab, var(--_paper) 16%, var(--_ink));--lw-color-primary:var(--_paper);--lw-color-primary-foreground:var(--_ink);--lw-color-secondary:color-mix(in oklab, var(--_paper) 10%, var(--_ink));--lw-color-secondary-foreground:var(--_paper);background:var(--_ink);color:var(--_paper);--_face:var(--lw-color-background);background:0 0}.stub,.body{background:var(--_face);position:relative}.stub{-webkit-mask:radial-gradient(circle at 0 100%, transparent var(--_notch), #000 calc(var(--_notch) + .5px)) left/51% 100% no-repeat, radial-gradient(circle at 100% 100%, transparent var(--_notch), #000 calc(var(--_notch) + .5px)) right/51% 100% no-repeat;mask:radial-gradient(circle at 0 100%, transparent var(--_notch), #000 calc(var(--_notch) + .5px)) left/51% 100% no-repeat, radial-gradient(circle at 100% 100%, transparent var(--_notch), #000 calc(var(--_notch) + .5px)) right/51% 100% no-repeat;border-radius:1rem 1rem 0 0;justify-items:start;padding:1.75rem 1.75rem 2.25rem;display:grid}.body{-webkit-mask:radial-gradient(circle at 0 0, transparent var(--_notch), #000 calc(var(--_notch) + .5px)) left/51% 100% no-repeat, radial-gradient(circle at 100% 0, transparent var(--_notch), #000 calc(var(--_notch) + .5px)) right/51% 100% no-repeat;mask:radial-gradient(circle at 0 0, transparent var(--_notch), #000 calc(var(--_notch) + .5px)) left/51% 100% no-repeat, radial-gradient(circle at 100% 0, transparent var(--_notch), #000 calc(var(--_notch) + .5px)) right/51% 100% no-repeat;border-radius:0 0 1rem 1rem;flex-direction:column;flex:1;padding:2rem 1.75rem 1.5rem;display:flex}.body:before{content:\"\";top:0;right:calc(var(--_notch) + .5rem);left:calc(var(--_notch) + .5rem);border-top:1px dashed color-mix(in oklab, var(--lw-color-foreground) 30%, transparent);position:absolute}.stub-head{justify-content:space-between;align-items:flex-start;gap:1rem;width:100%;min-height:2rem;display:flex}.code{color:var(--lw-color-muted-foreground)}.stamp{border:1.5px solid var(--lw-color-destructive);font:var(--lw-text-xs) var(--lw-font-mono);color:var(--lw-color-destructive);border-radius:3px;padding:.25rem .5rem;rotate:-3deg}.name{letter-spacing:-.02em;margin-top:1.5rem;font-size:1.5rem;font-weight:500}.blurb{max-width:17rem;min-height:3em;font-size:var(--lw-text-md);color:var(--lw-color-muted-foreground);margin-top:.5rem;line-height:1.5}.price{align-items:baseline;gap:.5rem;margin-top:2.5rem;display:flex}.amount{letter-spacing:-.05em;font-size:clamp(3rem,6vw,4rem);font-weight:700;line-height:1}.per{font-size:var(--lw-text-md);color:var(--lw-color-muted-foreground)}.terms{font:var(--lw-text-xs) var(--lw-font-mono);color:var(--lw-color-muted-foreground);margin-top:1.25rem}.specs{font:var(--lw-text-sm) var(--lw-font-mono);gap:.75rem;padding:0;list-style:none;display:grid}.specs li{color:var(--lw-color-muted-foreground);align-items:baseline;gap:.75rem;display:flex}.leader{border-bottom:1px dotted color-mix(in oklab, var(--lw-color-foreground) 25%, transparent);flex:1;min-width:1rem}.value{color:var(--lw-color-foreground)}.code-strip{color:var(--lw-color-foreground);opacity:.85;margin-top:auto;padding-top:2rem}.barcode{fill:currentColor;width:85%;height:2rem;margin-inline:auto;display:block}", [p, m, h] = d, g = [
	{
		...p,
		code: "LW-01",
		terms: "no card needed",
		specs: [
			["Projects", "3"],
			["Events / mo", "1,000"],
			["History", "7 days"],
			["Custom domains", ""],
			["Roles & audit log", ""],
			["Support", "Community"]
		]
	},
	{
		...m,
		code: "LW-02",
		terms: "cancel any time",
		specs: [
			["Projects", "Unlimited"],
			["Events / mo", "50,000"],
			["History", "90 days"],
			["Custom domains", "Included"],
			["Roles & audit log", ""],
			["Support", "Email"]
		]
	},
	{
		...h,
		code: "LW-03",
		terms: "cancel any time",
		specs: [
			["Projects", "Unlimited"],
			["Events / mo", "500,000"],
			["History", "1 year"],
			["Custom domains", "Included"],
			["Roles & audit log", "Included"],
			["Support", "Priority"]
		]
	}
], _ = 160, v = (e) => {
	let t = [...e].reduce((e, t) => Math.imul(e ^ t.charCodeAt(0), 16777619), 2166136261), n = () => (t = Math.imul(t ^ t >>> 15, 2246822507), t = Math.imul(t ^ t >>> 13, 3266489909), ((t ^= t >>> 16) >>> 0) / 4294967296), r = 0, i = "";
	for (; r < _;) {
		let e = 1 + Math.floor(n() * 3);
		i += `<rect x="${r}" width="${Math.min(e, _ - r)}" height="24"/>`, r += e + 1 + Math.floor(n() * 2);
	}
	return `<svg class="barcode" viewBox="0 0 ${_} 24" preserveAspectRatio="none" aria-hidden="true">${i}</svg>`;
}, y = class extends e {
	static styles = [
		r,
		s,
		f
	];
	static props = {
		heading: { default: "Pick your pass" },
		description: { default: "Every pass includes unlimited viewers. Switch or cancel any time." },
		billing: {
			default: "monthly",
			reflect: !0
		},
		note: { default: "Yearly passes get 2 months free" },
		badge: { default: "Most picked" },
		featured: { default: "pro" },
		value: {
			default: "pro",
			reflect: !0
		},
		passes: {
			type: Object,
			default: g
		}
	};
	render() {
		return `<header class="head"><h2 class="title"></h2><p class="description"></p>${c()}<p class="note"></p></header><div class="passes" role="radiogroup" aria-label="Passes"></div>`;
	}
	connected() {
		a(this);
		let e = this.query(".passes"), t = { signal: this.signal };
		e.addEventListener("click", (e) => {
			let t = e.target.closest(".pass");
			t && this.#n(t.dataset.id);
		}, t), e.addEventListener("keydown", (t) => {
			let n = [...e.querySelectorAll(".pass")], r = n.indexOf(t.target.closest(".pass"));
			if (r < 0) return;
			if (t.key === " " || t.key === "Enter") return t.preventDefault(), this.#n(n[r].dataset.id);
			let i = {
				ArrowRight: 1,
				ArrowDown: 1,
				ArrowLeft: -1,
				ArrowUp: -1
			}[t.key];
			if (!i) return;
			t.preventDefault();
			let a = n[(r + i + n.length) % n.length];
			this.#n(a.dataset.id), a.focus();
		}, t);
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", this.query(".note").textContent = this.note ?? "", [
			"passes",
			"badge",
			"featured"
		].some((t) => e.has(t)) && this.#e(), i(this), this.#t();
	}
	#e() {
		this.query(".passes").innerHTML = (this.passes ?? []).map((e) => {
			let t = n(e.id), r = e.id === this.featured && this.badge ? `<span class="stamp">${n(this.badge)}</span>` : "", i = e.specs.map(([e, t]) => `<li><span>${n(e)}</span><span class="leader"></span><span class="value">${t ? n(t) : "<span aria-label=\"Not included\">—</span>"}</span></li>`).join("");
			return `<article class="pass" role="radio" tabindex="-1" data-id="${t}" aria-labelledby="pass-${t}">
<div class="stub"><div class="stub-head"><span class="code">${n(e.code)} · ${n(e.name)}</span>${r}</div><h3 class="name" id="pass-${t}">${n(e.name)}</h3><p class="blurb">${n(e.blurb)}</p>
<p class="price">${u()}<span class="per">/ month</span></p><p class="terms"></p></div>
<div class="body"><ul class="specs">${i}</ul><div class="code-strip"></div></div></article>`;
		}).join("");
	}
	#t() {
		let e = [...this.shadowRoot.querySelectorAll(".pass")], t = e.find((e) => e.dataset.id === this.value) ?? e[0];
		for (let n of e) {
			let e = this.passes.find((e) => e.id === n.dataset.id), r = n === t;
			n.ariaChecked = String(r), n.tabIndex = r ? 0 : -1, l(n.querySelector(".amount"), o(e.monthly, this.billing)), n.querySelector(".terms").textContent = e.monthly ? `Billed ${this.billing} · ${e.terms}` : `Free forever · ${e.terms}`, n.querySelector(".code-strip").innerHTML = v(`${e.code}:${this.billing}`);
		}
	}
	#n(e) {
		if (e === this.value) return;
		this.value = e;
		let t = this.passes.find((t) => t.id === e);
		this.emit("select", {
			plan: e,
			billing: this.billing,
			price: o(t.monthly, this.billing)
		});
	}
};
//#endregion
//#region src/components/ticket-pricing/index.js
t("ticket-pricing", y);
//#endregion
export { y as t };
