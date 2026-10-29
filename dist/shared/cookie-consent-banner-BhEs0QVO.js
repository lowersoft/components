import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { U as i } from "./lucide-BVbUPHVq.js";
import { n as a } from "./banner-DyZRwpIp.js";
//#region src/components/cookie-consent-banner/cookie-consent-banner.scss?inline
var o = ":host{font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block;overflow:hidden;container-type:inline-size}:host([hidden]){display:none}p{margin:0}a,button{font:inherit;color:inherit;outline:none}a:focus-visible,button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.close,.icon-button{border-radius:var(--lw-radius-md);width:2rem;height:2rem;color:var(--lw-color-muted-foreground);cursor:pointer;background:0 0;border:0;flex:none;place-items:center;padding:0;display:grid}.close:hover,.icon-button:hover{color:var(--lw-color-foreground)}:host{width:26rem;max-width:100%}h2{margin:0}.card{border:1px solid var(--lw-color-border);background:var(--lw-color-background);box-shadow:var(--lw-shadow-md);border-radius:1.25rem;padding:1.5rem}.head{justify-content:space-between;align-items:baseline;gap:1rem;display:flex}.title{font-size:var(--lw-text-lg);font-weight:600}.policy{font-size:var(--lw-text-sm);white-space:nowrap;color:var(--lw-color-muted-foreground);text-underline-offset:.25em;text-decoration:underline;text-decoration-thickness:1px}.policy:hover{color:var(--lw-color-foreground)}.description{color:var(--lw-color-muted-foreground);margin-top:.75rem;line-height:1.6}.categories{border:1px solid var(--lw-color-border);border-radius:1rem;margin:1.25rem 0 0;padding:0;list-style:none;overflow:hidden}.category{align-items:center;gap:1rem;padding:.875rem 1rem;display:flex}.category+.category{border-top:1px solid var(--lw-color-border)}.about{flex:1;min-width:0}.name{align-items:baseline;gap:.5rem;font-weight:500;display:flex}.count{font:var(--lw-text-xs) var(--lw-font-mono);color:var(--lw-color-muted-foreground)}.what{color:var(--lw-color-muted-foreground);margin-top:.25rem}.choice::part(label){clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.always{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);flex:none;align-items:center;gap:.375rem;display:inline-flex}.actions{grid-template-columns:repeat(3,auto);justify-content:end;gap:.5rem;margin-top:1.25rem;display:grid}@container (width<=22rem){.actions{grid-template-columns:1fr}.actions lw-button::part(button){width:100%}}", s = [
	{
		id: "necessary",
		name: "Necessary",
		count: "3 cookies",
		description: "Sign-in, security and your settings",
		required: !0
	},
	{
		id: "analytics",
		name: "Analytics",
		count: "4 cookies",
		description: "Which pages you visit and how fast they load"
	},
	{
		id: "marketing",
		name: "Marketing",
		count: "7 vendors",
		description: "Ads for us on other sites you visit"
	}
], c = class extends e {
	static styles = o;
	static props = {
		heading: { default: "Cookies on this site" },
		description: { default: "We need a few to keep you signed in. The rest only run if you say so." },
		policyHref: { default: "#" },
		storageKey: {},
		categories: {
			type: Object,
			default: s
		}
	};
	render() {
		return "<section class=\"card\" aria-labelledby=\"cookies-title\"><header class=\"head\"><h2 class=\"title\" id=\"cookies-title\"></h2><a class=\"policy\">Cookie policy</a></header><p class=\"description\"></p>\n<ul class=\"categories\"></ul><div class=\"actions\"><lw-button class=\"reject\" variant=\"ghost\">Reject all</lw-button><lw-button class=\"save\" variant=\"outline\">Save choices</lw-button><lw-button class=\"accept\">Accept all</lw-button></div></section>";
	}
	connected() {
		if (this.#e) {
			this.hidden = !0;
			return;
		}
		let e = { signal: this.signal };
		this.query(".reject").addEventListener("click", () => this.#t(!1), e), this.query(".accept").addEventListener("click", () => this.#t(!0), e), this.query(".save").addEventListener("click", () => this.#t(null), e);
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", this.query(".policy").href = this.policyHref ?? "#", e.has("categories") && (this.query(".categories").innerHTML = (this.categories ?? []).map((e) => {
			let t = e.required ? `<span class="always">${r(i, 15)}Always on</span>` : `<lw-switch class="choice" data-id="${n(e.id)}">${n(e.name)}</lw-switch>`;
			return `<li class="category"><div class="about"><p class="name">${n(e.name)}${e.count ? `<span class="count">${n(e.count)}</span>` : ""}</p><p class="what">${n(e.description)}</p></div>${t}</li>`;
		}).join(""));
	}
	get #e() {
		if (!this.storageKey) return null;
		try {
			return JSON.parse(localStorage.getItem(this.storageKey));
		} catch {
			return null;
		}
	}
	#t(e) {
		let t = {};
		for (let n of this.categories ?? []) {
			let r = this.query(`.choice[data-id="${CSS.escape(n.id)}"]`);
			t[n.id] = n.required || (e ?? !!r?.checked);
		}
		if (this.storageKey) try {
			localStorage.setItem(this.storageKey, JSON.stringify(t));
		} catch {}
		this.emit("consent", { choices: t }), a(this);
	}
};
//#endregion
//#region src/components/cookie-consent-banner/index.js
t("cookie-consent-banner", c);
//#endregion
export { c as t };
