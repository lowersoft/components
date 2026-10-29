import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./highlight-BSyGT8bg.js";
import { n as a, t as o } from "./swap-BK53XQML.js";
import { t as s } from "./clipboard-BCkfa02P.js";
import { b as c, d as l } from "./lucide-BVbUPHVq.js";
//#region src/components/install-headline/install-headline.scss?inline
var u = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);font-family:var(--lw-font-sans);color:var(--lw-color-foreground);text-align:center;display:block}h2,p{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.title{letter-spacing:-.04em;text-wrap:balance;max-width:40rem;margin:0 auto;font-size:clamp(2.25rem,6.5vw,4rem);font-weight:500;line-height:1.05}.description{max-width:34rem;font-size:var(--lw-text-lg);color:var(--_muted);text-wrap:pretty;margin:1.5rem auto 0;line-height:1.6}.install{text-align:left;max-width:34rem;margin:3rem auto 0}.tabs{gap:.125rem;margin-bottom:.5rem;display:flex;position:relative}.tab-pill{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.tab-pill{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.tab-pill.visible{opacity:1}.tab-pill{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-foreground) 8%, transparent)}.tab{border-radius:var(--lw-radius-full);font-size:var(--lw-text-md);color:var(--_muted);cursor:pointer;background:0 0;border:0;padding:.375rem .875rem;position:relative}.tab[aria-selected=true],.tab:hover{color:var(--lw-color-foreground)}.command{border:1px solid var(--_line);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));font:var(--lw-text-md) var(--lw-font-mono);border-radius:1.25rem;align-items:center;gap:.625rem;padding:.5rem .5rem .5rem 1rem;display:flex}.dollar{color:var(--_muted)}:host([data-prompt]) .dollar{display:none}.text{white-space:nowrap;flex:1;min-width:0;overflow:hidden}:host([data-prompt]) .text{font-family:var(--lw-font-sans)}.text span{text-overflow:ellipsis;overflow:hidden}.copy{border-radius:var(--lw-radius-md);width:2.25rem;height:2.25rem;color:var(--_muted);cursor:pointer;background:0 0;border:0;flex:none;place-items:center;padding:0;display:grid}.copy:hover{color:var(--lw-color-foreground)}.note{font-size:var(--lw-text-sm);color:var(--_muted);margin:.75rem 1rem 0;display:flex}", d = 1600, f = [
	{
		id: "bun",
		label: "bun",
		command: "bun add @lowersoft/lw",
		note: "Adds the package; import only the elements you use."
	},
	{
		id: "npm",
		label: "npm",
		command: "npm install @lowersoft/lw",
		note: "Adds the package; import only the elements you use."
	},
	{
		id: "pnpm",
		label: "pnpm",
		command: "pnpm add @lowersoft/lw",
		note: "Adds the package; import only the elements you use."
	},
	{
		id: "agent",
		label: "Agent",
		command: "Add @lowersoft/lw and use <lw-button> for every button",
		prompt: !0,
		note: "Paste into your coding agent; it installs the package and wires it up."
	}
], p = class extends e {
	static styles = [a, u];
	static props = {
		heading: { default: "A web toolkit your users won't wait for" },
		description: { default: "Buttons, inputs and whole sections as plain custom elements. No framework, no runtime, nothing to hydrate." },
		method: {
			default: "bun",
			reflect: !0
		},
		methods: {
			type: Object,
			default: f
		}
	};
	#e = 0;
	render() {
		return `<header class="intro"><h2 class="title"></h2><p class="description"></p></header>
<div class="install"><div class="tabs" role="tablist" aria-label="Install with"><span class="tab-pill"></span></div>
<div class="command" role="tabpanel"><span class="dollar" aria-hidden="true">$</span><code class="swap text"></code><button class="copy" type="button" aria-label="Copy the command">${r(c, 16)}</button><span class="visually-hidden copied" aria-live="polite"></span></div><p class="swap note"></p></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".tabs");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".tab");
			t && this.#i(t.dataset.id);
		}, e), t.addEventListener("keydown", (e) => {
			let n = {
				ArrowRight: 1,
				ArrowLeft: -1
			}[e.key];
			if (!n) return;
			e.preventDefault();
			let r = this.methods.indexOf(this.#t), i = this.methods[(r + n + this.methods.length) % this.methods.length];
			this.#i(i.id), t.querySelector(`[data-id="${CSS.escape(i.id)}"]`).focus();
		}, e), this.query(".copy").addEventListener("click", () => this.#r(), e);
		let n = new ResizeObserver(() => this.#n());
		n.observe(t), this.signal.addEventListener("abort", () => n.disconnect());
	}
	updated(e) {
		if (this.query(".title").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", e.has("methods")) {
			let e = this.query(".tabs");
			e.querySelectorAll(".tab").forEach((e) => e.remove()), e.insertAdjacentHTML("beforeend", this.methods.map((e) => `<button class="tab" type="button" role="tab" data-id="${n(e.id)}">${n(e.label)}</button>`).join(""));
		}
		let t = this.#t;
		this.#n(), this.toggleAttribute("data-prompt", !!t.prompt), o(this.query(".text"), t.command), o(this.query(".note"), t.note ?? "");
	}
	get #t() {
		return this.methods.find((e) => e.id === this.method) ?? this.methods[0];
	}
	#n() {
		let e = null;
		for (let t of this.shadowRoot.querySelectorAll(".tab")) {
			let n = t.dataset.id === this.#t.id;
			t.ariaSelected = String(n), t.tabIndex = n ? 0 : -1, n && (e = t);
		}
		e?.offsetWidth && i(this.query(".tab-pill"), e);
	}
	async #r() {
		try {
			await s(this.#t.command);
		} catch {
			return;
		}
		let e = this.query(".copy");
		e.innerHTML = r(l, 16), this.query(".copied").textContent = "Copied", clearTimeout(this.#e), this.#e = setTimeout(() => {
			e.innerHTML = r(c, 16), this.query(".copied").textContent = "";
		}, d);
	}
	#i(e) {
		e !== this.method && (this.method = e, this.emit("change", { method: e }));
	}
};
//#endregion
//#region src/components/install-headline/index.js
t("install-headline", p);
//#endregion
export { p as t };
