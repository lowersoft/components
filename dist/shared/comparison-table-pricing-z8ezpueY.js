import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { d as i } from "./lucide-BVbUPHVq.js";
//#region src/components/comparison-table-pricing/comparison-table-pricing.scss?inline
var a = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);--_lit:color-mix(in oklab, var(--lw-color-foreground) 4%, transparent);--_accent:var(--lightningcss-light,#ea580c)var(--lightningcss-dark,#fb923c);font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block;container-type:inline-size}h2,p{margin:0}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.head{flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:1rem 2rem;margin-bottom:2rem;display:flex}.title{letter-spacing:-.03em;font-size:clamp(1.5rem,4vw,2rem);font-weight:600}.description{font-size:var(--lw-text-md);color:var(--_muted);margin-top:.5rem}.only{color:var(--_muted)}.scroller{border:1px solid var(--_line);overscroll-behavior-x:contain;overflow-x:auto}.table{border-collapse:collapse;table-layout:fixed;width:100%;min-width:46rem}.table th,.table td{border-bottom:1px solid var(--_line);text-align:left;vertical-align:middle;padding:1.125rem 1.25rem;font-weight:400}.table [data-col]{border-left:1px solid var(--_line)}@media (prefers-reduced-motion:no-preference){.table [data-col]{transition:background-color .15s ease-out}}.table [data-col][data-lit]{background:var(--_lit)}.corner,.feature{z-index:1;background:var(--lw-color-background);width:28%;position:sticky;left:0}@container (width<=46rem){.corner,.feature{width:8.5rem}}.feature{color:var(--_muted)}.table thead th{vertical-align:top;border-bottom-width:2px;position:relative}.table thead th[data-featured]:before,.table thead th[data-featured]:after{content:\"\";border:0 solid var(--_accent);border-top-width:1.5px;width:.625rem;height:.625rem;position:absolute;top:.5rem}.table thead th[data-featured]:before{border-left-width:1.5px;left:.5rem}.table thead th[data-featured]:after{border-right-width:1.5px;right:.5rem}.plan{flex-direction:column;align-items:flex-start;height:100%;padding-top:.5rem;display:flex}.plan-name{font-size:var(--lw-text-md);font-weight:500}.price{letter-spacing:-.04em;margin-top:1rem;font-size:2rem;font-weight:700;line-height:1}.per{font-size:var(--lw-text-xs);color:var(--_muted);margin-top:.375rem}.blurb{color:var(--_muted);flex:1;margin:1rem 0 1.5rem;line-height:1.5}.action,.action::part(button){width:100%}.section-row th{font-size:var(--lw-text-md);padding-top:2rem;font-weight:500}.section[hidden],.row[hidden]{display:none}@media (prefers-reduced-motion:no-preference){.row{animation:.25s ease-out row-in}}@keyframes row-in{0%{opacity:0}}.yes svg{display:block}[data-featured]>.yes svg{color:var(--_accent)}.no{border-top:1px solid color-mix(in oklab, var(--lw-color-foreground) 25%, transparent);width:.75rem;display:block}.term{text-underline-offset:.3em;cursor:help;border-radius:2px;outline:none;-webkit-text-decoration:underline dotted;text-decoration:underline dotted;position:relative}.term:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.tooltip{z-index:2;border:1px solid var(--_line);border-radius:var(--lw-radius-md);background:var(--lw-color-background);width:16rem;box-shadow:var(--lw-shadow-md);font-size:var(--lw-text-xs);color:var(--lw-color-foreground);opacity:0;pointer-events:none;margin-top:1.75rem;margin-left:-6rem;padding:.5rem .75rem;line-height:1.5;position:absolute;translate:0 -.25rem}@media (prefers-reduced-motion:no-preference){.tooltip{transition:opacity .15s ease-out,translate .15s ease-out}}.term:is(:hover,:focus-visible)+.tooltip{opacity:1;translate:0}.shared{font-size:var(--lw-text-xs);color:var(--_muted);margin-top:1rem}.shared:empty{display:none}", o = [
	{
		id: "hobby",
		name: "Hobby",
		price: "$0",
		per: "free forever",
		blurb: "For side projects and trying things out.",
		action: "Start for free"
	},
	{
		id: "pro",
		name: "Pro",
		price: "$20",
		per: "per month",
		blurb: "For individuals shipping real work.",
		action: "Upgrade to Pro",
		featured: !0
	},
	{
		id: "team",
		name: "Team",
		price: "$48",
		per: "per user / month",
		blurb: "For teams that build together.",
		action: "Start trial"
	},
	{
		id: "enterprise",
		name: "Enterprise",
		price: "Custom",
		per: "billed annually",
		blurb: "For organizations with advanced needs.",
		action: "Contact sales"
	}
], s = [
	{
		title: "Usage",
		rows: [
			{
				label: "Projects",
				values: [
					"3",
					"Unlimited",
					"Unlimited",
					"Unlimited"
				]
			},
			{
				label: "Storage",
				values: [
					"1 GB",
					"10 GB",
					"100 GB",
					"Custom"
				]
			},
			{
				label: "Bandwidth",
				hint: "Data served to your visitors each month. Going over never cuts you off; we write first.",
				values: [
					"10 GB",
					"100 GB",
					"1 TB",
					"Custom"
				]
			},
			{
				label: "API requests",
				hint: "Calls to the public API each month, across every key in the workspace.",
				values: [
					"10k",
					"1M",
					"10M",
					"Unlimited"
				]
			},
			{
				label: "Custom domains",
				values: [
					!1,
					!0,
					!0,
					!0
				]
			}
		]
	},
	{
		title: "Collaboration",
		rows: [
			{
				label: "Team members",
				values: [
					"1",
					"1",
					"Up to 25",
					"Unlimited"
				]
			},
			{
				label: "Comments and mentions",
				values: [
					!0,
					!0,
					!0,
					!0
				]
			},
			{
				label: "Roles and permissions",
				hint: "Owner, admin, editor and viewer, set per project.",
				values: [
					!1,
					!1,
					!0,
					!0
				]
			},
			{
				label: "Shared workspaces",
				values: [
					!1,
					!1,
					"3",
					"Unlimited"
				]
			}
		]
	},
	{
		title: "Security",
		rows: [
			{
				label: "Two-factor authentication",
				values: [
					!0,
					!0,
					!0,
					!0
				]
			},
			{
				label: "SAML SSO",
				hint: "Sign in through your identity provider, such as Okta or Entra ID.",
				values: [
					!1,
					!1,
					!1,
					!0
				]
			},
			{
				label: "Audit log",
				values: [
					!1,
					!1,
					!0,
					!0
				]
			}
		]
	}
], c = (e) => e.values.some((t) => t !== e.values[0]), l = class extends e {
	static styles = a;
	static props = {
		heading: { default: "Compare plans" },
		description: { default: "Everything included in each plan, side by side." },
		differences: {
			type: Boolean,
			reflect: !0
		},
		plans: {
			type: Object,
			default: o
		},
		sections: {
			type: Object,
			default: s
		}
	};
	render() {
		return "<header class=\"head\"><div><h2 class=\"title\"></h2><p class=\"description\"></p></div><lw-switch class=\"only\" size=\"sm\">Show differences only</lw-switch></header>\n<div class=\"scroller\"><table class=\"table\"><thead></thead></table></div><p class=\"shared\" aria-live=\"polite\"></p>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".only");
		t.addEventListener("change", () => {
			this.differences = t.checked;
		}, e);
		let n = this.query(".table");
		n.addEventListener("click", (e) => {
			let t = e.target.closest(".action");
			t && this.emit("choose", { plan: t.dataset.id });
		}, e), n.addEventListener("pointerover", (e) => this.#n(e.target.closest("[data-col]")?.dataset.col), e), n.addEventListener("pointerleave", () => this.#n(), e);
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", this.query(".only").checked = this.differences, (e.has("plans") || e.has("sections")) && this.#e(), this.#t();
	}
	#e() {
		let e = this.plans ?? [], t = (t, n, r = "td", i = "") => `<${r} data-col="${t}"${e[t]?.featured ? " data-featured" : ""}${i}>${n}</${r}>`, a = e.map((e, r) => t(r, `<div class="plan"><span class="plan-name">${n(e.name)}</span><span class="price">${n(e.price)}</span><span class="per">${n(e.per)}</span><span class="blurb">${n(e.blurb)}</span><lw-button class="action" data-id="${n(e.id)}" variant="${e.featured ? "primary" : "outline"}">${n(e.action)}</lw-button></div>`, "th", " scope=\"col\"")).join(""), o = (e, a) => e === !0 ? t(a, `${r(i, 16)}<span class="visually-hidden">Included</span>`, "td", " class=\"yes\"") : e === !1 || e == null || e === "" ? t(a, "<span class=\"no\" aria-hidden=\"true\"></span><span class=\"visually-hidden\">Not included</span>") : t(a, n(e)), s = 0, l = (this.sections ?? []).map((t) => `<tbody class="section"><tr class="section-row"><th colspan="${e.length + 1}" scope="colgroup">${n(t.title)}</th></tr>${t.rows.map((e) => {
			let t = e.hint ? `<span class="term" tabindex="0" aria-describedby="hint-${s}">${n(e.label)}</span><span class="tooltip" role="tooltip" id="hint-${s++}">${n(e.hint)}</span>` : n(e.label);
			return `<tr class="row"${c(e) ? "" : " data-same"}><th scope="row" class="feature">${t}</th>${e.values.map(o).join("")}</tr>`;
		}).join("")}</tbody>`).join(""), u = this.query(".table");
		u.querySelectorAll("tbody").forEach((e) => e.remove()), u.querySelector("thead").innerHTML = `<tr><td class="corner"></td>${a}</tr>`, u.insertAdjacentHTML("beforeend", l);
	}
	#t() {
		let e = 0;
		for (let t of this.shadowRoot.querySelectorAll(".row")) t.hidden = this.differences && t.hasAttribute("data-same"), t.hidden && e++;
		for (let e of this.shadowRoot.querySelectorAll(".section")) e.hidden = !e.querySelector(".row:not([hidden])");
		this.query(".shared").textContent = e ? `${e} ${e === 1 ? "feature" : "features"} every plan shares ${e === 1 ? "is" : "are"} hidden.` : "";
	}
	#n(e) {
		for (let t of this.shadowRoot.querySelectorAll("[data-col]")) t.toggleAttribute("data-lit", t.dataset.col === e);
	}
};
//#endregion
//#region src/components/comparison-table-pricing/index.js
t("comparison-table-pricing", l);
//#endregion
export { l as t };
