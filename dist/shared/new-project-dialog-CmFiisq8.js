import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./dom-Dlk1FlsZ.js";
import { n, t as r } from "./modal-DvPYHqbK.js";
//#region src/components/new-project-dialog/new-project-dialog.scss?inline
var i = ".modal{--_width:38rem;container-type:inline-size}.templates{grid-template-columns:repeat(2,minmax(0,1fr));gap:.625rem;margin:1.5rem 0;display:grid}@container (width>=32rem){.templates{grid-template-columns:repeat(4,minmax(0,1fr))}}.template{border:1px solid var(--_line);text-align:left;cursor:pointer;background:0 0;border-radius:1rem;gap:.25rem;padding:.5rem .5rem .875rem;display:grid}@media (prefers-reduced-motion:no-preference){.template{transition:border-color .15s ease-out,box-shadow .15s ease-out,translate .2s ease-out}}.template:hover{border-color:color-mix(in oklab, var(--lw-color-foreground) 30%, transparent);translate:0 -1px}.template[aria-checked=true]{border-color:var(--lw-color-foreground);box-shadow:0 0 0 1px var(--lw-color-foreground)}.frame{background:var(--_raised);background-image:linear-gradient(var(--_muted), var(--_muted)), linear-gradient(var(--_muted), var(--_muted)), linear-gradient(var(--_muted), var(--_muted)), linear-gradient(var(--_muted), var(--_muted)), linear-gradient(var(--_muted), var(--_muted)), linear-gradient(var(--_muted), var(--_muted)), linear-gradient(var(--_muted), var(--_muted)), linear-gradient(var(--_muted), var(--_muted));background-position:.25rem .25rem,.25rem .25rem,calc(100% - .25rem) .25rem,calc(100% - .25rem) .25rem,.25rem calc(100% - .25rem),.25rem calc(100% - .25rem),calc(100% - .25rem) calc(100% - .25rem),calc(100% - .25rem) calc(100% - .25rem);background-repeat:no-repeat;background-size:.5rem 1px,1px .5rem,.5rem 1px,1px .5rem,.5rem 1px,1px .5rem,.5rem 1px,1px .5rem;border-radius:.625rem;margin-bottom:.5rem;padding:.375rem;display:block;position:relative}.frame svg{width:100%;height:auto;fill:color-mix(in oklab, var(--lw-color-foreground) 40%, transparent);display:block}.frame svg .soft{fill:color-mix(in oklab, var(--lw-color-foreground) 14%, transparent)}.template-name{font-size:var(--lw-text-md);padding-inline:.25rem;font-weight:500}.template-detail{color:var(--_muted);padding-inline:.25rem}.name{width:100%}.address{font:var(--lw-text-xs) var(--lw-font-mono);overflow-wrap:anywhere;margin-top:.625rem}.address[data-empty]{color:var(--_muted)}", a = {
	cli: "<rect x=\"10\" y=\"10\" width=\"100\" height=\"44\" rx=\"4\" class=\"soft\"/><rect x=\"18\" y=\"20\" width=\"10\" height=\"4\" rx=\"2\"/><rect x=\"32\" y=\"20\" width=\"40\" height=\"4\" rx=\"2\" class=\"soft\"/><rect x=\"18\" y=\"30\" width=\"56\" height=\"4\" rx=\"2\" class=\"soft\"/><rect x=\"18\" y=\"40\" width=\"30\" height=\"4\" rx=\"2\" class=\"soft\"/>",
	daemon: "<rect x=\"12\" y=\"12\" width=\"20\" height=\"40\" rx=\"3\"/><rect x=\"40\" y=\"12\" width=\"30\" height=\"8\" rx=\"2\" class=\"soft\"/><rect x=\"40\" y=\"26\" width=\"68\" height=\"8\" rx=\"2\" class=\"soft\"/><rect x=\"40\" y=\"40\" width=\"50\" height=\"12\" rx=\"2\" class=\"soft\"/>",
	library: "<rect x=\"12\" y=\"12\" width=\"44\" height=\"40\" rx=\"3\" class=\"soft\"/><rect x=\"64\" y=\"12\" width=\"44\" height=\"40\" rx=\"3\" class=\"soft\"/><rect x=\"20\" y=\"20\" width=\"24\" height=\"4\" rx=\"2\"/><rect x=\"72\" y=\"20\" width=\"24\" height=\"4\" rx=\"2\"/>",
	blank: "<rect x=\"48\" y=\"29\" width=\"24\" height=\"6\" rx=\"3\" class=\"soft\"/>"
}, o = [
	{
		id: "cli",
		name: "CLI tool",
		detail: "Args, man page"
	},
	{
		id: "daemon",
		name: "Daemon",
		detail: "Service, logs"
	},
	{
		id: "library",
		name: "Library",
		detail: "Headers, tests"
	},
	{
		id: "blank",
		name: "Blank",
		detail: "One file"
	}
], s = (e) => e.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40), c = class extends r {
	static styles = [n, i];
	static props = {
		...r.props,
		template: {
			default: "cli",
			reflect: !0
		},
		workspace: { default: "northwind" },
		domain: { default: "lowersoft.dev" },
		templates: {
			type: Object,
			default: o
		}
	};
	renderBody() {
		return "<div class=\"body\"><h2 class=\"title\" id=\"modal-title\">New project</h2><p class=\"lead\">Pick a starting point. You can change everything later.</p>\n<div class=\"templates\" role=\"radiogroup\" aria-label=\"Template\"></div><lw-text-input class=\"name\" label=\"Name\" placeholder=\"Billing daemon\" autocomplete=\"off\"></lw-text-input><p class=\"address\"></p></div>\n<footer class=\"foot\"><lw-button class=\"cancel\" variant=\"ghost\">Cancel</lw-button><lw-button class=\"create\" disabled>Create project</lw-button></footer>";
	}
	connected() {
		super.connected();
		let e = { signal: this.signal }, t = this.query(".templates");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".template");
			t && (this.template = t.dataset.id);
		}, e), t.addEventListener("dblclick", (e) => e.target.closest(".template") && this.query(".name").focus(), e), t.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				e.preventDefault(), this.query(".name").focus();
				return;
			}
			let n = {
				ArrowRight: 1,
				ArrowDown: 1,
				ArrowLeft: -1,
				ArrowUp: -1
			}[e.key];
			if (!n) return;
			e.preventDefault();
			let r = this.templates.findIndex((e) => e.id === this.template);
			this.template = this.templates[(r + n + this.templates.length) % this.templates.length].id, t.querySelector(`[data-id="${CSS.escape(this.template)}"]`).focus();
		}, e);
		let n = this.query(".name");
		n.addEventListener("input", () => this.#t(), e), n.addEventListener("keydown", (e) => e.key === "Enter" && (e.preventDefault(), this.#n()), e), this.query(".cancel").addEventListener("click", () => this.hide("cancel"), e), this.query(".create").addEventListener("click", () => this.#n(), e);
	}
	opened() {
		requestAnimationFrame(() => this.query(".template[aria-checked=\"true\"]")?.focus());
	}
	updated(e) {
		super.updated(e), e.has("templates") && (this.query(".templates").innerHTML = this.templates.map((e) => `<button class="template" type="button" role="radio" data-id="${t(e.id)}"><span class="frame"><svg viewBox="0 0 120 64" aria-hidden="true">${a[e.id] ?? a.blank}</svg></span><span class="template-name">${t(e.name)}</span><span class="template-detail">${t(e.detail)}</span></button>`).join(""));
		for (let e of this.shadowRoot.querySelectorAll(".template")) {
			let t = e.dataset.id === this.template;
			e.ariaChecked = String(t), e.tabIndex = t ? 0 : -1;
		}
		this.#t();
	}
	get #e() {
		return `${s(this.query(".name").value) || "your-project"}-${s(this.workspace ?? "")}.${this.domain}`;
	}
	#t() {
		let e = !!this.query(".name").value.trim(), t = this.query(".address");
		t.textContent = this.#e, t.toggleAttribute("data-empty", !e), this.query(".create").disabled = !e;
	}
	#n() {
		let e = this.query(".name").value.trim();
		e && (this.emit("create", {
			template: this.template,
			name: e,
			address: this.#e
		}), this.hide("create"));
	}
};
//#endregion
//#region src/components/new-project-dialog/index.js
e("new-project-dialog", c);
//#endregion
export { c as t };
