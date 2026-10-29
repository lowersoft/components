import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i, t as a } from "./rolling-VjfpUD4B.js";
import { n as o } from "./highlight-BSyGT8bg.js";
import { i as s } from "./lucide-BVbUPHVq.js";
//#region src/components/filter-headline/filter-headline.scss?inline
var c = ":host{--_muted:var(--lw-color-muted-foreground);font-family:var(--lw-font-sans);color:var(--lw-color-foreground);display:block}h2,p{margin:0}a,button{font:inherit;color:inherit;outline:none}a:focus-visible,button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.title{letter-spacing:-.04em;align-items:flex-start;gap:.75rem;font-size:clamp(2.5rem,7vw,4.5rem);font-weight:500;line-height:1.05;display:flex}.badge{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-foreground) 10%, transparent);font-size:var(--lw-text-md);letter-spacing:0;margin-top:.4em;padding:.125rem .5rem;font-weight:500;display:inline-flex}.description{max-width:28rem;font-size:var(--lw-text-lg);color:var(--_muted);margin-top:1.25rem;line-height:1.6}.row{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;margin-top:2.5rem;display:flex}.filters{flex-wrap:wrap;gap:.25rem;display:flex;position:relative}.filter-pill{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.filter-pill{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.filter-pill.visible{opacity:1}.filter-pill{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-foreground) 8%, transparent)}.filter{border-radius:var(--lw-radius-full);font-size:var(--lw-text-md);color:var(--_muted);cursor:pointer;background:0 0;border:0;align-items:baseline;gap:.5rem;padding:.5rem 1rem;display:inline-flex;position:relative}.filter[aria-checked=true],.filter:hover{color:var(--lw-color-foreground)}.filter-count{font-size:var(--lw-text-sm);font-variant-numeric:tabular-nums;opacity:.55}.all{font-size:var(--lw-text-md);border-radius:2px;align-items:center;gap:.375rem;text-decoration:none;display:inline-flex}@media (prefers-reduced-motion:no-preference){.all svg{transition:translate .2s ease-out}}.all:hover svg{translate:3px}", l = [
	{
		id: "runtime",
		label: "Runtime",
		count: 17
	},
	{
		id: "engineering",
		label: "Engineering",
		count: 14
	},
	{
		id: "performance",
		label: "Performance",
		count: 11
	},
	{
		id: "company",
		label: "Company",
		count: 6
	}
], u = class extends e {
	static styles = [i, c];
	static props = {
		heading: { default: "From the journal" },
		description: { default: "How we build the runtime, the decisions behind it and what we learned shipping it." },
		filter: {
			default: "",
			reflect: !0
		},
		filters: {
			type: Object,
			default: l
		},
		allHref: { default: "#" }
	};
	render() {
		return `<header class="intro"><h2 class="title"><span class="title-text"></span><span class="badge"><span class="visually-hidden count-text"></span><span class="rolling" aria-hidden="true"></span></span></h2><p class="description"></p></header>
<div class="row"><div class="filters" role="radiogroup" aria-label="Filter"><span class="filter-pill"></span></div><a class="all"><span>View all</span>${r(s, 16)}</a></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".filters");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".filter");
			t && this.#r(t.dataset.id);
		}, e), t.addEventListener("keydown", (e) => {
			let n = {
				ArrowRight: 1,
				ArrowDown: 1,
				ArrowLeft: -1,
				ArrowUp: -1
			}[e.key];
			if (!n) return;
			e.preventDefault();
			let r = [...t.querySelectorAll(".filter")], i = r[(r.findIndex((e) => e.ariaChecked === "true") + n + r.length) % r.length];
			this.#r(i.dataset.id), i.focus();
		}, e);
		let n = new ResizeObserver(() => this.#n());
		n.observe(t), this.signal.addEventListener("abort", () => n.disconnect());
	}
	updated(e) {
		if (this.query(".title-text").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", this.query(".all").href = this.allHref ?? "#", e.has("filters")) {
			let e = this.query(".filters");
			e.querySelectorAll(".filter").forEach((e) => e.remove()), e.insertAdjacentHTML("beforeend", [{
				id: "",
				label: "All",
				count: this.#e
			}, ...this.filters ?? []].map((e) => `<button class="filter" type="button" role="radio" data-id="${n(e.id)}">${n(e.label)}<span class="filter-count">${e.count}</span></button>`).join(""));
		}
		this.#n();
	}
	get #e() {
		return (this.filters ?? []).reduce((e, t) => e + t.count, 0);
	}
	get #t() {
		return this.filters.find((e) => e.id === this.filter)?.count ?? this.#e;
	}
	#n() {
		let e = null;
		for (let t of this.shadowRoot.querySelectorAll(".filter")) {
			let n = t.dataset.id === (this.filter ?? "");
			t.ariaChecked = String(n), t.tabIndex = n ? 0 : -1, n && (e = t);
		}
		e?.offsetWidth && o(this.query(".filter-pill"), e);
		let t = String(this.#t);
		this.query(".count-text").textContent = `, ${t}`, a(this.query(".badge .rolling"), t);
	}
	#r(e) {
		e !== (this.filter ?? "") && (this.filter = e, this.emit("change", {
			filter: e,
			count: this.#t
		}));
	}
};
//#endregion
//#region src/components/filter-headline/index.js
t("filter-headline", u);
//#endregion
export { u as t };
