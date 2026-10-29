import { n as e, t } from "./core-WcEz9YgG.js";
import { n } from "./dom-Dlk1FlsZ.js";
import { r, t as i } from "./footer-CGqCsKWA.js";
//#region src/components/sitemap-footer/sitemap-footer.scss?inline
var a = ":host{border-top:1px solid var(--lw-color-border);background:var(--lw-color-background);font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block;container-type:inline-size}.container{box-sizing:border-box;width:100%;max-width:72rem;margin-inline:auto;padding:4rem clamp(1.5rem,5vw,3rem) 2.5rem;position:relative}h2,p,ul{margin:0}a{color:inherit;outline:none;text-decoration:none}a:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;border-radius:2px}.brand{font-size:var(--lw-text-lg);letter-spacing:-.01em;align-items:center;gap:.625rem;font-weight:600;display:inline-flex}.brand-tile{background:var(--lw-color-foreground);width:1.75rem;height:1.75rem;font-size:var(--lw-text-sm);color:var(--lw-color-background);border-radius:.5rem;place-items:center;font-weight:700;display:grid}.column-title{font-size:var(--lw-text-sm);margin-bottom:1.25rem;font-weight:500}.links{gap:.875rem;padding:0;list-style:none;display:grid}.link{color:var(--lw-color-muted-foreground);align-items:center;gap:.5rem;display:inline-flex}@media (prefers-reduced-motion:no-preference){.link{transition:color .15s ease-out,opacity .2s ease-out}}.link:hover{color:var(--lw-color-foreground)}.badge{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-sm);color:var(--lw-color-muted-foreground);padding:.0625rem .375rem;font-size:.6875rem}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.top{border-bottom:1px solid var(--lw-color-border);flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1.5rem;padding-bottom:2.5rem;display:flex}.jump{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-lg);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));cursor:text;align-items:center;gap:.5rem;width:18rem;max-width:100%;padding:0 .5rem 0 .875rem;display:flex}@media (prefers-reduced-motion:no-preference){.jump{transition:border-color .15s ease-out}}.jump:focus-within{border-color:color-mix(in oklab, var(--lw-color-foreground) 35%, transparent)}.query{min-width:0;height:2.5rem;font:var(--lw-text-sm) var(--lw-font-sans);color:var(--lw-color-foreground);background:0 0;border:0;outline:none;flex:1;padding:0}.query::placeholder{color:var(--lw-color-muted-foreground)}.query::-webkit-search-cancel-button{display:none}.key{--_edge:color-mix(in oklab, var(--lw-color-foreground) 22%, var(--lw-color-background));border:1px solid var(--_edge);border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--lw-color-foreground) 8%, var(--lw-color-background));min-width:1.5rem;height:1.5rem;box-shadow:0 2px 0 0 var(--_edge);color:inherit;font:inherit;justify-content:center;align-items:center;padding-inline:.375rem;font-size:.6875rem;line-height:1;display:inline-flex}@media (prefers-reduced-motion:no-preference){.key{transition:translate var(--lw-duration-fast) var(--lw-ease-out), box-shadow var(--lw-duration-fast) var(--lw-ease-out)}}.key[data-pressed]{box-shadow:none;transition-duration:75ms;translate:0 2px}.key{color:var(--lw-color-muted-foreground)}.jump:focus-within .key{opacity:0}.columns{grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:2.5rem 2rem;padding-top:2.5rem;display:grid}@media (prefers-reduced-motion:no-preference){.column-title{transition:opacity .2s ease-out}}:host([data-filtering]) .link:not([data-match]){opacity:.3}:host([data-filtering]) .column:not([data-match]) .column-title{opacity:.4}mark{background:color-mix(in oklab, var(--lw-color-foreground) 18%, transparent);color:var(--lw-color-foreground);border-radius:2px}.note{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);margin-top:3.5rem}", o = [
	{
		title: "Product",
		links: [
			{ label: "Overview" },
			{
				label: "Profiler",
				badge: "New"
			},
			{ label: "Debugger" },
			{ label: "Integrations" },
			{ label: "Pricing" },
			{ label: "Changelog" }
		]
	},
	{
		title: "Developers",
		links: [
			{ label: "Documentation" },
			{ label: "API reference" },
			{ label: "SDKs" },
			{ label: "CLI" },
			{ label: "Examples" },
			{ label: "Status" }
		]
	},
	{
		title: "Solutions",
		links: [
			{ label: "Embedded" },
			{ label: "Game engines" },
			{ label: "Databases" },
			{ label: "Trading systems" },
			{ label: "Agencies" }
		]
	},
	{
		title: "Resources",
		links: [
			{ label: "Blog" },
			{ label: "Guides" },
			{ label: "Customers" },
			{ label: "Templates" },
			{ label: "Events" }
		]
	},
	{
		title: "Company",
		links: [
			{ label: "About" },
			{
				label: "Careers",
				badge: "4 open"
			},
			{ label: "Press kit" },
			{ label: "Contact" },
			{ label: "Privacy" },
			{ label: "Terms" }
		]
	}
], s = class extends e {
	static styles = a;
	static props = {
		brand: { default: "Lower" },
		href: { default: "/" },
		columns: {
			type: Object,
			default: o
		},
		note: {}
	};
	render() {
		return "<footer class=\"container\"><div class=\"top\"><span class=\"brand-slot\"></span>\n<label class=\"jump\"><span class=\"visually-hidden\">Jump to a page</span><input class=\"query\" type=\"search\" placeholder=\"Jump to…\" autocomplete=\"off\" spellcheck=\"false\" aria-describedby=\"found\"><kbd class=\"key\" aria-hidden=\"true\">/</kbd></label></div>\n<p class=\"found visually-hidden\" id=\"found\" aria-live=\"polite\"></p><div class=\"columns\"></div><p class=\"note\"></p></footer>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".query");
		t.addEventListener("input", () => this.#t(), e), t.addEventListener("keydown", (e) => this.#n(e), e), document.addEventListener("keydown", (e) => {
			e.key !== "/" || e.defaultPrevented || n(e) || e.metaKey || e.ctrlKey || e.altKey || (e.preventDefault(), t.focus());
		}, e);
	}
	updated(e) {
		(e.has("brand") || e.has("href")) && (this.query(".brand-slot").innerHTML = i(this.brand, this.href)), e.has("columns") && (this.query(".columns").innerHTML = r(this.columns), this.#t()), this.query(".note").textContent = this.note ?? `© ${(/* @__PURE__ */ new Date()).getFullYear()} ${this.brand ?? ""}. All rights reserved.`;
	}
	get #e() {
		return [...this.shadowRoot.querySelectorAll(".columns .link")];
	}
	#t() {
		let e = this.query(".query").value.trim().toLowerCase();
		this.toggleAttribute("data-filtering", !!e);
		let t = 0;
		for (let n of this.#e) {
			let r = n.querySelector(".link-label"), i = r.textContent, a = e ? i.toLowerCase().indexOf(e) : -1;
			if (n.toggleAttribute("data-match", a >= 0), r.replaceChildren(i), a < 0) continue;
			t++;
			let o = Object.assign(document.createElement("mark"), { textContent: i.slice(a, a + e.length) });
			r.replaceChildren(i.slice(0, a), o, i.slice(a + e.length));
		}
		for (let e of this.shadowRoot.querySelectorAll(".column")) e.toggleAttribute("data-match", !!e.querySelector("[data-match]"));
		this.query(".found").textContent = e ? `${t} ${t === 1 ? "page" : "pages"} found` : "";
	}
	#n(e) {
		let t = e.target;
		if (e.key === "Escape" && t.value) {
			e.preventDefault(), t.value = "", this.#t();
			return;
		}
		let n = this.#e.find((e) => e.hasAttribute("data-match"));
		n && (e.key === "Enter" ? (e.preventDefault(), n.click()) : e.key === "ArrowDown" && (e.preventDefault(), n.focus()));
	}
};
//#endregion
//#region src/components/sitemap-footer/index.js
t("sitemap-footer", s);
//#endregion
export { s as t };
