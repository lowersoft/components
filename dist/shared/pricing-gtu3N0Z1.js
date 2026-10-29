import { t as e } from "./rolling-VjfpUD4B.js";
import { n as t } from "./highlight-BSyGT8bg.js";
//#region src/styles/pricing.scss?inline
var n = ":host{--_ink:var(--lw-color-foreground);--_paper:var(--lw-color-background);font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block;container-type:inline-size}h2,h3,p,ul{margin:0}.billing{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-lg);background:color-mix(in oklab, var(--lw-color-foreground) 4%, var(--lw-color-background));padding:.25rem;display:inline-flex;position:relative}.billing-pill{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.billing-pill{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.billing-pill.visible{opacity:1}.billing-pill{border-radius:var(--lw-radius-md);background:var(--lw-color-background);box-shadow:0 0 0 1px var(--lw-color-border), var(--lw-shadow-sm)}.billing-option{border-radius:var(--lw-radius-md);font:500 var(--lw-text-sm) var(--lw-font-sans);white-space:nowrap;color:var(--lw-color-muted-foreground);cursor:pointer;background:0 0;border:0;outline:none;padding:.375rem .875rem;position:relative}@media (prefers-reduced-motion:no-preference){.billing-option{transition:color .2s ease-out}}.billing-option[aria-checked=true],.billing-option:hover{color:var(--lw-color-foreground)}.billing-option:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", r = [
	{
		id: "hobby",
		name: "Hobby",
		blurb: "For side projects and trying things out.",
		monthly: 0
	},
	{
		id: "pro",
		name: "Pro",
		blurb: "For makers shipping something every week.",
		monthly: 36
	},
	{
		id: "team",
		name: "Team",
		blurb: "For teams that need roles, audit and scale.",
		monthly: 96
	}
], i = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }), a = new Intl.NumberFormat("en-US", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
}), o = (e, t = !Number.isInteger(e)) => `${e < 0 ? "−" : ""}$${(t ? a : i).format(Math.abs(e))}`, s = (e, t) => t === "yearly" ? Math.round(e * 10 / 12) : e, c = (e = {
	monthly: "Monthly",
	yearly: "Yearly"
}) => `<div class="billing" role="radiogroup" aria-label="Billing"><span class="billing-pill"></span>${Object.entries(e).map(([e, t]) => `<button class="billing-option" type="button" role="radio" data-billing="${e}">${t}</button>`).join("")}</div>`, l = (e) => {
	let t = e.query(".billing"), n = (t) => {
		t !== e.billing && (e.billing = t, e.emit("change", { billing: t }));
	};
	t.addEventListener("click", (e) => {
		let t = e.target.closest(".billing-option");
		t && n(t.dataset.billing);
	}, { signal: e.signal }), t.addEventListener("keydown", (r) => {
		let i = {
			ArrowLeft: -1,
			ArrowUp: -1,
			ArrowRight: 1,
			ArrowDown: 1
		}[r.key];
		if (!i) return;
		r.preventDefault();
		let a = [...t.querySelectorAll(".billing-option")].map((e) => e.dataset.billing);
		n(a[(a.indexOf(e.billing) + i + a.length) % a.length]), t.querySelector("[aria-checked=\"true\"]").focus();
	}, { signal: e.signal });
	let r = new ResizeObserver(() => u(e));
	r.observe(t), e.signal.addEventListener("abort", () => r.disconnect());
}, u = (e) => {
	let n = [...e.shadowRoot.querySelectorAll(".billing-option")];
	for (let t of n) {
		let n = t.dataset.billing === e.billing;
		t.ariaChecked = String(n), t.tabIndex = n ? 0 : -1;
	}
	let r = n.find((e) => e.ariaChecked === "true");
	r?.offsetWidth && t(e.query(".billing-pill"), r);
}, d = (e = "amount") => `<span class="${e}"><span class="visually-hidden"></span><span class="rolling" aria-hidden="true"></span></span>`, f = (t, n, r) => {
	let i = typeof n == "number" ? o(n, r) : n;
	t.querySelector(".visually-hidden").textContent = i, e(t.querySelector(".rolling"), i);
};
//#endregion
export { u as a, l as c, s as i, n as l, c as n, f as o, o as r, d as s, r as t };
