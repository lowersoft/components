import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { n as a } from "./motion-CFWhFfc_.js";
import { i as o } from "./menu-BCEGADW6.js";
import { n as s } from "./highlight-BSyGT8bg.js";
import { n as c } from "./swap-BK53XQML.js";
import { n as l, t as u } from "./people-C_zYMoEl.js";
import { a as d, f, t as p } from "./dates-Cwd3k25x.js";
import { a as m, n as h } from "./lucide-BVbUPHVq.js";
import { n as g, t as _ } from "./picker-CFtn-7gY.js";
//#region src/components/view-toggle-toolbar/view-toggle-toolbar.scss?inline
var v = ".picker-trigger{border-radius:var(--lw-radius-md);font:inherit;color:var(--lw-color-foreground);cursor:pointer;background:0 0;border:0;outline:none;align-items:center;gap:.375rem;padding:.375rem .5rem;display:inline-flex}.picker-trigger:hover,.picker-trigger[aria-expanded=true]{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent)}.picker-trigger:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.picker-trigger>svg{color:var(--lw-color-muted-foreground);flex:none}.picker-label{color:var(--lw-color-muted-foreground)}:host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:56rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:0;display:block;overflow:hidden;container-type:inline-size}h2,h3,ul{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.bar{border-bottom:1px solid var(--_line);flex-wrap:wrap;align-items:center;gap:.75rem 1.25rem;padding:.875rem 1rem .875rem 1.25rem;display:flex}.title{font-size:var(--lw-text-lg);flex:1;font-weight:500}.total{color:var(--_muted);margin-left:.25rem;font-weight:400}.views{border-radius:var(--lw-radius-lg);background:color-mix(in oklab, var(--lw-color-foreground) 5%, transparent);padding:.25rem;display:flex;position:relative}.view-pill{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.view-pill{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.view-pill.visible{opacity:1}.view-pill{background:color-mix(in oklab, var(--lw-color-foreground) 10%, var(--lw-color-background));box-shadow:var(--lw-shadow-sm)}.view{border-radius:var(--lw-radius-md);color:var(--_muted);cursor:pointer;background:0 0;border:0;align-items:center;gap:.5rem;padding:.375rem .75rem;display:inline-flex;position:relative}.view[aria-checked=true]{color:var(--lw-color-foreground)}@container (width<=34rem){.view span{display:none}}.tools{align-items:center;gap:.25rem;display:flex}.tool{border-radius:var(--lw-radius-md);width:2rem;height:2rem;color:var(--_muted);cursor:pointer;background:0 0;border:0;place-items:center;padding:0;display:grid}.tool:hover,.tool[aria-pressed=true]{color:var(--lw-color-foreground)}.tool[aria-pressed=true]{background:color-mix(in oklab, var(--lw-color-foreground) 8%, transparent)}.content{padding:1rem}.name{min-width:0;font-size:var(--lw-text-md);align-items:center;gap:.625rem;font-weight:500;display:inline-flex}.swatch,.dot{border-radius:3px;flex:none;width:.625rem;height:.625rem}.dot{border-radius:50%;width:.5rem;height:.5rem}.progress{color:var(--_muted);align-items:center;gap:.5rem;display:inline-flex}.track{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-foreground) 12%, transparent);width:4rem;height:.25rem;overflow:hidden}.fill{border-radius:inherit;background:var(--_color);height:100%;display:block}.percent{font-variant-numeric:tabular-nums;min-width:2.25rem}.due{font-variant-numeric:tabular-nums;color:var(--_muted)}.owner{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));border-radius:50%;flex:none;place-items:center;width:1.625rem;height:1.625rem;font-size:.5625rem;font-weight:600;display:grid}.board{gap:1rem;display:grid}@container (width>=40rem){.board{grid-auto-columns:minmax(0,1fr);grid-auto-flow:column}}.column{align-content:start;gap:.625rem;display:grid}.column-title{font-size:var(--lw-text-md);align-items:center;gap:.5rem;padding:.25rem .25rem .375rem;font-weight:500;display:flex}.column-count{color:var(--_muted);font-weight:400}.card{border:1px solid var(--_line);border-radius:1rem;gap:1rem;padding:1rem;display:grid}.meta{align-items:center;gap:.75rem;display:flex}.meta .due{margin-left:auto}.list{padding:0;list-style:none}.row{grid-template-columns:minmax(0,1fr) auto 3.5rem auto;align-items:center;gap:1.25rem;padding:.75rem .5rem;display:grid}.row+.row{border-top:1px solid var(--_line)}.table{border-collapse:collapse;width:100%}.table th,.table td{border-bottom:1px solid var(--_line);text-align:left;padding:.625rem .5rem;font-weight:400}.table thead th{font-size:var(--lw-text-xs);color:var(--_muted)}.table tbody tr:last-child>*{border-bottom:0}", y = [
	{
		id: "board",
		label: "Board",
		icon: "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><path d=\"M9 3v18M15 3v18\"/>"
	},
	{
		id: "list",
		label: "List",
		icon: "<path d=\"M3 6h.01M3 12h.01M3 18h.01M8 6h13M8 12h13M8 18h13\"/>"
	},
	{
		id: "table",
		label: "Table",
		icon: "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><path d=\"M3 9h18M9 21V9\"/>"
	}
], b = [
	{
		id: "planned",
		label: "Planned",
		color: "#8b8d98"
	},
	{
		id: "active",
		label: "Active",
		color: "#3b82f6"
	},
	{
		id: "shipped",
		label: "Shipped",
		color: "#30a46c"
	}
], x = [
	{
		value: "updated",
		label: "Last updated"
	},
	{
		value: "due",
		label: "Due date"
	},
	{
		value: "progress",
		label: "Progress"
	},
	{
		value: "name",
		label: "Name"
	}
], S = "<path d=\"M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4\"/>", C = [
	{
		name: "Team seats",
		color: "#0ea5e9",
		stage: "planned",
		progress: 8,
		due: 43,
		owner: "Leo Martins",
		updated: 5
	},
	{
		name: "Onboarding checklist",
		color: "#60a5fa",
		stage: "planned",
		progress: 0,
		due: 30,
		owner: "Priya Raman",
		updated: 2
	},
	{
		name: "Profiler v2",
		color: "#d946ef",
		stage: "active",
		progress: 64,
		due: 16,
		owner: "Maya Chen",
		updated: 0
	},
	{
		name: "Crash grouping",
		color: "#a78bfa",
		stage: "active",
		progress: 82,
		due: 9,
		owner: "Jonas Weber",
		updated: 1
	},
	{
		name: "ARM release builds",
		color: "#f59e0b",
		stage: "active",
		progress: 37,
		due: 23,
		owner: "Theo Park",
		updated: 3
	},
	{
		name: "Symbol server",
		color: "#10b981",
		stage: "shipped",
		progress: 100,
		due: -10,
		owner: "Priya Raman",
		updated: 6
	}
], w = (e) => d(p(f(), e), "en-US", {
	month: "short",
	day: "numeric"
}), T = class extends e {
	static styles = [
		r,
		o,
		c,
		v
	];
	static props = {
		view: {
			default: "board",
			reflect: !0
		},
		sort: { default: "updated" },
		descending: {
			type: Boolean,
			default: !0
		},
		hideShipped: { type: Boolean },
		projects: {
			type: Object,
			default: C
		}
	};
	#e;
	render() {
		return `<header class="bar"><h2 class="title">Projects <span class="total"></span></h2><div class="views" role="radiogroup" aria-label="View"><span class="view-pill"></span>${y.map((e) => `<button class="view" type="button" role="radio" data-view="${e.id}">${i(e.icon, 16)}<span>${e.label}</span></button>`).join("")}</div>
<div class="tools">${g("sort-menu", { label: "Sort" })}<button class="tool order" type="button"></button><button class="tool shipped" type="button" aria-label="Hide shipped projects">${i(S, 16)}</button></div></header><div class="content"></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.#e = _(this.query(".picker"), this.signal, (e) => this.#t({ sort: e }));
		let t = this.query(".views");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".view");
			t && this.#t({ view: t.dataset.view });
		}, e), t.addEventListener("keydown", (e) => {
			let n = {
				ArrowRight: 1,
				ArrowLeft: -1
			}[e.key];
			if (!n) return;
			e.preventDefault();
			let r = y.findIndex((e) => e.id === this.view);
			this.#t({ view: y[(r + n + y.length) % y.length].id }), t.querySelector(`[data-view="${this.view}"]`).focus();
		}, e), this.query(".order").addEventListener("click", () => this.#t({ descending: !this.descending }), e), this.query(".shipped").addEventListener("click", () => this.hideShipped = !this.hideShipped, e);
		let n = new ResizeObserver(() => this.#n());
		n.observe(t), this.signal.addEventListener("abort", () => n.disconnect());
	}
	updated(e) {
		this.#e?.set(x, this.sort);
		let t = this.query(".order");
		t.innerHTML = i(this.descending ? h : m, 16), t.ariaLabel = this.descending ? "Descending; change to ascending" : "Ascending; change to descending";
		let n = this.query(".shipped");
		n.ariaPressed = String(!!this.hideShipped), this.#n(), this.#i(e.has("view") && !e.has("projects"));
	}
	#t(e) {
		Object.assign(this, e), this.emit("change", {
			view: this.view,
			sort: this.sort,
			descending: this.descending
		});
	}
	#n() {
		let e = null;
		for (let t of this.shadowRoot.querySelectorAll(".view")) {
			let n = t.dataset.view === this.view;
			t.ariaChecked = String(n), t.tabIndex = n ? 0 : -1, n && (e = t);
		}
		e?.offsetWidth && s(this.query(".view-pill"), e);
	}
	get #r() {
		let e = {
			updated: (e) => -e.updated,
			due: (e) => e.due,
			progress: (e) => e.progress,
			name: (e) => e.name.toLowerCase()
		}[this.sort] ?? ((e) => e.updated), t = this.projects.filter((e) => !(this.hideShipped && e.stage === "shipped")).sort((t, n) => e(t) < e(n) ? -1 : +(e(t) > e(n)));
		return this.descending ? t.reverse() : t;
	}
	#i(e) {
		let t = this.#r;
		this.query(".total").textContent = String(t.length);
		let r = (e) => `<span class="progress" style="--_color: ${e.color}"><span class="track"><span class="fill" style="width: ${e.progress}%"></span></span><span class="percent">${e.progress}%</span></span>`, i = (e) => `<span class="owner" style="--_hue: ${u(e.owner)}" title="${n(e.owner)}">${n(l(e.owner))}</span>`, o = (e) => `<span class="name"><span class="swatch" style="background: ${e.color}"></span>${n(e.name)}</span>`, s;
		s = this.view === "board" ? `<div class="board">${b.filter((e) => !(this.hideShipped && e.id === "shipped")).map((e) => {
			let n = t.filter((t) => t.stage === e.id);
			return `<section class="column"><h3 class="column-title"><span class="dot" style="background: ${e.color}"></span>${e.label}<span class="column-count">${n.length}</span></h3>${n.map((e) => `<article class="card">${o(e)}<div class="meta">${r(e)}<span class="due">${w(e.due)}</span>${i(e)}</div></article>`).join("")}</section>`;
		}).join("")}</div>` : this.view === "list" ? `<ul class="list">${t.map((e) => `<li class="row">${o(e)}${r(e)}<span class="due">${w(e.due)}</span>${i(e)}</li>`).join("")}</ul>` : `<table class="table"><thead><tr><th scope="col">Project</th><th scope="col">Stage</th><th scope="col">Progress</th><th scope="col">Due</th><th scope="col">Owner</th></tr></thead><tbody>${t.map((e) => `<tr><th scope="row">${o(e)}</th><td>${b.find((t) => t.id === e.stage)?.label}</td><td>${r(e)}</td><td>${w(e.due)}</td><td>${i(e)}</td></tr>`).join("")}</tbody></table>`;
		let c = this.query(".content");
		c.innerHTML = s, e && !a.matches && c.animate({
			opacity: [0, 1],
			translate: ["0 0.375rem", "0 0"]
		}, {
			duration: 250,
			easing: "ease-out"
		});
	}
};
//#endregion
//#region src/components/view-toggle-toolbar/index.js
t("view-toggle-toolbar", T);
//#endregion
export { T as t };
