import { t as e } from "./core-WcEz9YgG.js";
import { n as t, t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { o as i, s as a } from "./shortcut-kjm7vAXW.js";
import { ct as o } from "./lucide-BVbUPHVq.js";
import { n as s, t as c } from "./modal-DvPYHqbK.js";
//#region src/components/shortcuts-dialog/shortcuts-dialog.scss?inline
var l = ".modal{--_width:44rem;container-type:inline-size}.head{border-bottom:1px solid var(--_line);padding-bottom:1.25rem}.search{border-radius:var(--lw-radius-lg);background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent);color:var(--_muted);align-items:center;gap:.625rem;margin-top:1.25rem;padding:0 .875rem;display:flex}.search:focus-within{box-shadow:0 0 0 1px color-mix(in oklab, var(--lw-color-foreground) 30%, transparent)}.query{min-width:0;height:2.75rem;font-size:var(--lw-text-md);color:var(--lw-color-foreground);background:0 0;border:0;flex:1}.query:focus-visible{outline:none}.query::placeholder{color:var(--_muted)}.query::-webkit-search-cancel-button{display:none}.count{font-variant-numeric:tabular-nums}.groups{gap:1.5rem 2.5rem;max-height:24rem;padding:1.5rem;display:grid;overflow-y:auto}@container (width>=34rem){.groups{grid-template-columns:1fr 1fr}}.group[hidden],.item[hidden],.none[hidden]{display:none}.group-title{font-size:var(--lw-text-sm);color:var(--_muted);margin-bottom:.75rem;font-weight:400}.group ul{gap:.25rem;padding:0;list-style:none;display:grid}.item{border-radius:var(--lw-radius-md);font-size:var(--lw-text-md);justify-content:space-between;align-items:center;gap:1rem;margin:0 -.5rem;padding:.375rem .5rem;display:flex}@media (prefers-reduced-motion:no-preference){.item{transition:background-color .3s ease-out}}.item[data-found]{background:color-mix(in oklab, var(--lw-color-foreground) 12%, transparent);transition-duration:0s}.item[data-found] kbd{border-color:var(--lw-color-foreground)}.caps{flex:none;align-items:center;gap:.25rem;display:inline-flex}kbd{--_edge:color-mix(in oklab, var(--lw-color-foreground) 22%, var(--lw-color-background));border:1px solid var(--_edge);border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--lw-color-foreground) 8%, var(--lw-color-background));min-width:1.5rem;height:1.5rem;box-shadow:0 2px 0 0 var(--_edge);color:inherit;font:inherit;justify-content:center;align-items:center;padding-inline:.375rem;font-size:.6875rem;line-height:1;display:inline-flex}@media (prefers-reduced-motion:no-preference){kbd{transition:translate var(--lw-duration-fast) var(--lw-ease-out), box-shadow var(--lw-duration-fast) var(--lw-ease-out)}}kbd[data-pressed]{box-shadow:none;transition-duration:75ms;translate:0 2px}kbd{min-width:1.75rem;height:1.75rem;font:var(--lw-text-sm) var(--lw-font-sans)}.then{font-size:var(--lw-text-sm);color:var(--_muted);margin:0 .25rem}.none{color:var(--_muted);padding:0 1.5rem 1.5rem}", u = 1e3, d = 1600, f = [
	{
		title: "General",
		items: [
			{
				label: "Search",
				keys: "mod+k"
			},
			{
				label: "Command menu",
				keys: "mod+shift+p"
			},
			{
				label: "Show shortcuts",
				keys: "shift+/",
				caps: ["?"]
			},
			{
				label: "Close panel",
				keys: "escape"
			}
		]
	},
	{
		title: "Navigation",
		items: [
			{
				label: "Go to builds",
				keys: "g b"
			},
			{
				label: "Go to crashes",
				keys: "g c"
			},
			{
				label: "Next item",
				keys: "j"
			},
			{
				label: "Previous item",
				keys: "k"
			}
		]
	},
	{
		title: "Editing",
		items: [
			{
				label: "Undo",
				keys: "mod+z"
			},
			{
				label: "Redo",
				keys: "mod+shift+z"
			},
			{
				label: "Duplicate",
				keys: "mod+d"
			},
			{
				label: "Rename",
				keys: "f2"
			}
		]
	},
	{
		title: "View",
		items: [
			{
				label: "Toggle sidebar",
				keys: "mod+."
			},
			{
				label: "Full screen",
				keys: "mod+shift+f"
			},
			{
				label: "Switch theme",
				keys: "mod+shift+l"
			},
			{
				label: "Zoom to fit",
				keys: "shift+1"
			}
		]
	}
], p = (e) => e.map((e) => `<kbd>${n(e)}</kbd>`).join(""), m = class extends c {
	static styles = [s, l];
	static props = {
		...c.props,
		groups: {
			type: Object,
			default: f
		}
	};
	#e = null;
	#t = 0;
	#n = 0;
	renderBody() {
		return `<div class="body head"><h2 class="title" id="modal-title">Keyboard shortcuts</h2><p class="lead">Press any of them to find it here.</p>
<label class="search">${r(o, 18)}<input class="query" type="search" placeholder="Search" aria-label="Search shortcuts" autocomplete="off"><span class="count"></span></label></div>
<div class="groups"></div><p class="none" hidden>No shortcuts match.</p><p class="live visually-hidden" aria-live="polite"></p>`;
	}
	connected() {
		super.connected();
		let e = { signal: this.signal };
		this.query(".query").addEventListener("input", () => this.#r(), e), this.dialog.addEventListener("keydown", (e) => this.#i(e), e), this.signal.addEventListener("abort", () => {
			clearTimeout(this.#t), clearTimeout(this.#n);
		});
	}
	opened() {
		requestAnimationFrame(() => this.query(".query").focus());
	}
	updated(e) {
		super.updated(e), e.has("groups") && (this.query(".groups").innerHTML = this.groups.map((e) => `<section class="group"><h3 class="group-title">${n(e.title)}</h3><ul>${e.items.map((e) => {
			let t = e.keys.split(" ").map(i), r = e.caps ? p(e.caps) : t.map((e) => p(e.labels)).join("<span class=\"then\">then</span>");
			return `<li class="item" data-keys="${n(e.keys)}"><span class="label">${n(e.label)}</span><span class="caps" aria-label="${n(t.map((e) => e.aria).join(" then "))}">${r}</span></li>`;
		}).join("")}</ul></section>`).join(""), this.#r());
	}
	#r() {
		let e = this.query(".query").value.trim().toLowerCase(), t = 0;
		for (let n of this.shadowRoot.querySelectorAll(".item")) n.hidden = !!e && !n.querySelector(".label").textContent.toLowerCase().includes(e), n.hidden || t++;
		for (let e of this.shadowRoot.querySelectorAll(".group")) e.hidden = !e.querySelector(".item:not([hidden])");
		this.query(".count").textContent = String(t), this.query(".none").hidden = t > 0;
	}
	#i(e) {
		let n = a(e);
		if (!n || n === "escape" || n === "tab" || n === "shift+tab" || !/(mod|ctrl|alt)\+/.test(n) && t(e)) return;
		let r = this.#e ? `${this.#e} ${n}` : n, i = [...this.shadowRoot.querySelectorAll(".item")], o = i.find((e) => e.dataset.keys === r);
		if (clearTimeout(this.#t), this.#e = null, o) return e.preventDefault(), this.#a(o);
		i.some((e) => e.dataset.keys.startsWith(`${n} `)) && (e.preventDefault(), this.#e = n, this.#t = setTimeout(() => this.#e = null, u));
	}
	#a(e) {
		this.query(".query").value = "", this.#r();
		for (let e of this.shadowRoot.querySelectorAll(".item[data-found]")) e.removeAttribute("data-found");
		e.toggleAttribute("data-found", !0), e.scrollIntoView({ block: "nearest" }), this.query(".live").textContent = e.querySelector(".label").textContent, clearTimeout(this.#n), this.#n = setTimeout(() => e.removeAttribute("data-found"), d);
	}
};
//#endregion
//#region src/components/shortcuts-dialog/index.js
e("shortcuts-dialog", m);
//#endregion
export { m as t };
