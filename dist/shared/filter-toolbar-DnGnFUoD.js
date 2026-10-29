import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./dom-Dlk1FlsZ.js";
import { t as i } from "./icons-HWomdoMw.js";
import { r as a } from "./icons-Dv1KN71n.js";
import { i as o } from "./menu-BCEGADW6.js";
import { n as s } from "./swap-BK53XQML.js";
import { Dt as c, at as l, ct as u } from "./lucide-BVbUPHVq.js";
import { a as d, c as f, i as p, n as m, o as h, r as g, s as _, t as v } from "./issues-C8uSFb36.js";
import { n as y, t as b } from "./picker-CFtn-7gY.js";
//#region src/components/filter-toolbar/filter-toolbar.scss?inline
var x = ".picker-trigger{border-radius:var(--lw-radius-md);font:inherit;color:var(--lw-color-foreground);cursor:pointer;background:0 0;border:0;outline:none;align-items:center;gap:.375rem;padding:.375rem .5rem;display:inline-flex}.picker-trigger:hover,.picker-trigger[aria-expanded=true]{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent)}.picker-trigger:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.picker-trigger>svg{color:var(--lw-color-muted-foreground);flex:none}.picker-label{color:var(--lw-color-muted-foreground)}.status-icon{color:var(--lw-color-muted-foreground);flex:none}.status-icon[data-status=progress]{color:#f5a524}.status-icon[data-status=review]{color:#8e4ec6}.status-icon[data-status=done]{color:#30a46c}.priority-icon{flex:none}.priority-icon rect{fill:color-mix(in oklab, var(--lw-color-foreground) 22%, transparent)}.priority-icon rect[data-on]{fill:var(--lw-color-muted-foreground)}.priority-icon[data-priority=urgent] rect{fill:#e5484d}.label-chip{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-full);font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);flex:none;align-items:center;gap:.375rem;padding:.125rem .5rem;display:inline-flex}.label-chip:before{content:\"\";background:var(--_label);border-radius:50%;width:.375rem;height:.375rem}.assignee{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));border-radius:50%;flex:none;place-items:center;width:1.5rem;height:1.5rem;font-size:.5625rem;font-weight:600;display:grid}.assignee[data-none]{border:1px dashed var(--lw-color-muted-foreground);background:0 0}:host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:46rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:0;display:block;overflow:hidden}p,ul{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.bar{align-items:center;gap:.75rem;padding:.75rem 1rem .5rem;display:flex}.search{min-width:0;color:var(--_muted);flex:1;align-items:center;gap:.5rem;display:flex}.query{min-width:0;height:2rem;font:var(--lw-text-md) var(--lw-font-sans);color:var(--lw-color-foreground);background:0 0;border:0;outline:none;flex:1}.query::placeholder{color:var(--_muted)}.query::-webkit-search-cancel-button{display:none}kbd{--_edge:color-mix(in oklab, var(--lw-color-foreground) 22%, var(--lw-color-background));border:1px solid var(--_edge);border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--lw-color-foreground) 8%, var(--lw-color-background));min-width:1.5rem;height:1.5rem;box-shadow:0 2px 0 0 var(--_edge);color:inherit;font:inherit;justify-content:center;align-items:center;padding-inline:.375rem;font-size:.6875rem;line-height:1;display:inline-flex}@media (prefers-reduced-motion:no-preference){kbd{transition:translate var(--lw-duration-fast) var(--lw-ease-out), box-shadow var(--lw-duration-fast) var(--lw-ease-out)}}kbd[data-pressed]{box-shadow:none;transition-duration:75ms;translate:0 2px}.search:focus-within kbd{opacity:0}.add-filter .picker-label{color:var(--lw-color-foreground)}.count{border-left:1px solid var(--_line);white-space:nowrap;color:var(--_muted);padding-left:.75rem}.count b{color:var(--lw-color-foreground);font-weight:600}.chips{border-bottom:1px solid var(--_line);flex-wrap:wrap;align-items:center;gap:.5rem;padding:.25rem 1rem .75rem;display:flex}.chip-list{display:contents}.chip{border:1px solid var(--_line);border-radius:var(--lw-radius-md);align-items:stretch;display:inline-flex;overflow:hidden}@media (prefers-reduced-motion:no-preference){.chip{animation:.2s ease-out chip-in}}.chip>*+*{border-left:1px solid var(--_line)}.chip .picker-trigger{border-radius:0;gap:.375rem;height:100%;font-weight:500}.chip .picker-trigger>svg:last-child{display:none}@keyframes chip-in{0%{opacity:0;scale:.95}}.field{color:var(--_muted);align-items:center;padding:0 .625rem;display:inline-flex}.op,.remove{cursor:pointer;background:0 0;border:0;padding:.25rem .5rem}.op:hover,.remove:hover{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent)}.remove{color:var(--_muted);place-items:center;display:grid}.add-more .picker-trigger{color:var(--_muted)}.clear{color:var(--_muted);cursor:pointer;background:0 0;border:0;margin-left:auto;padding:.25rem .5rem}.clear:hover{color:var(--lw-color-foreground)}[data-empty]>.clear{visibility:hidden}.issues{max-height:22rem;padding:.375rem;list-style:none;overflow-y:auto}.issue{border-radius:var(--lw-radius-md);align-items:center;gap:.75rem;padding:.5rem .625rem;display:flex}@media (prefers-reduced-motion:no-preference){.issue{animation:.2s ease-out chip-in}}.issue:hover{background:color-mix(in oklab, var(--lw-color-foreground) 5%, transparent)}.id{width:4.5rem;font:var(--lw-text-xs) var(--lw-font-mono);color:var(--_muted);flex:none}.title{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.empty{text-align:center;color:var(--_muted);padding:1.5rem}.empty[hidden]{display:none}", S = "<path d=\"M3 6h18M7 12h10M10 18h4\"/>", C = {
	status: {
		label: "Status",
		values: () => p.map((e) => ({
			value: e.id,
			label: e.label
		}))
	},
	priority: {
		label: "Priority",
		values: () => g.map((e) => ({
			value: e.id,
			label: e.label
		}))
	},
	label: {
		label: "Label",
		values: () => Object.keys(m).map((e) => ({
			value: e,
			label: e
		}))
	},
	assignee: {
		label: "Assignee",
		values: (e) => [...new Set(e.map((e) => e.assignee))].map((e) => ({
			value: e,
			label: e || "Nobody"
		}))
	}
}, w = class extends e {
	static styles = [
		i,
		o,
		s,
		x
	];
	static props = {
		issues: {
			type: Object,
			default: v
		},
		filters: {
			type: Object,
			default: [{
				field: "status",
				op: "is",
				value: "progress"
			}]
		}
	};
	#e = null;
	render() {
		return `<div class="bar"><label class="search">${a(u, 16)}<input class="query" type="search" placeholder="Search issues" aria-label="Search issues" autocomplete="off"><kbd aria-hidden="true">/</kbd></label>
<span class="add-filter">${y("field-menu", {
			icon: a(S, 16),
			label: "Filter"
		})}</span><span class="count" aria-live="polite"></span></div>
<div class="chips"><div class="chip-list"></div><span class="add-more">${y("add-menu", {
			icon: a(l, 14),
			label: "Add"
		})}</span><button class="clear" type="button">Clear</button></div><ul class="issues"></ul><p class="empty" hidden>No issues match. Loosen a filter.</p>`;
	}
	connected() {
		let e = { signal: this.signal }, t = Object.entries(C).map(([e, t]) => ({
			value: e,
			label: t.label
		}));
		for (let e of [this.query(".add-filter"), this.query(".add-more")]) b(e, this.signal, (e) => this.#t(e)).set(t, ""), e.querySelector(".picker-value").remove();
		this.query(".query").addEventListener("input", () => this.#i(), e), this.query(".clear").addEventListener("click", () => {
			this.query(".query").value = "", this.#n([]);
		}, e), this.query(".chip-list").addEventListener("click", (e) => {
			let t = Number(e.target.closest(".chip")?.dataset.index);
			e.target.closest(".op") ? this.#n(this.filters.map((e, n) => n === t ? {
				...e,
				op: e.op === "is" ? "is not" : "is"
			} : e)) : e.target.closest(".remove") && this.#n(this.filters.filter((e, n) => n !== t));
		}, e), document.addEventListener("keydown", (e) => {
			e.key !== "/" || n(e) || e.defaultPrevented || (e.preventDefault(), this.query(".query").focus());
		}, e);
	}
	updated(e) {
		(e.has("filters") || e.has("issues")) && this.#r(), this.#i();
	}
	#t(e) {
		let t = C[e].values(this.issues)[0]?.value ?? "";
		this.#n([...this.filters, {
			field: e,
			op: "is",
			value: t
		}]), requestAnimationFrame(() => this.query(".chip:last-child .picker-trigger")?.focus());
	}
	#n(e) {
		this.filters = e;
	}
	#r() {
		this.#e?.abort(), this.#e = new AbortController();
		let e = AbortSignal.any([this.signal, this.#e.signal]), t = this.query(".chip-list");
		t.innerHTML = this.filters.map((e, t) => `<span class="chip" data-index="${t}"><span class="field">${r(C[e.field]?.label ?? e.field)}</span><button class="op" type="button" aria-label="${r(e.op)}, change">${r(e.op)}</button>${y(`value-menu-${t}`)}<button class="remove" type="button" aria-label="Remove filter">${a(c, 13)}</button></span>`).join(""), this.filters.forEach((n, r) => {
			let i = t.children[r], a = C[n.field]?.values(this.issues) ?? [];
			b(i, e, (e) => this.#n(this.filters.map((t, n) => n === r ? {
				...t,
				value: e
			} : t))).set(a, n.value), n.field === "status" && i.querySelector(".picker-trigger").insertAdjacentHTML("afterbegin", f(n.value));
		}), this.query(".chips").toggleAttribute("data-empty", !this.filters.length);
	}
	#i() {
		let e = this.query(".query").value.trim().toLowerCase(), t = this.issues.filter((t) => this.filters.every((e) => t[e.field] === e.value == (e.op === "is")) && (!e || t.title.toLowerCase().includes(e) || t.id.toLowerCase().includes(e)));
		this.query(".count").innerHTML = `<b>${t.length}</b> of ${this.issues.length} issues`, this.query(".issues").innerHTML = t.map((e) => `<li class="issue">${_(e.priority)}<span class="id">${r(e.id)}</span>${f(e.status)}<span class="title">${r(e.title)}</span>${h(e.label)}${d(e.assignee)}</li>`).join(""), this.query(".empty").hidden = t.length > 0, this.emit("change", {
			filters: this.filters,
			query: e,
			count: t.length
		});
	}
};
//#endregion
//#region src/components/filter-toolbar/index.js
t("filter-toolbar", w);
//#endregion
export { w as t };
