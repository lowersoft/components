import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { q as a, u as o } from "./lucide-BVbUPHVq.js";
import { a as s, c, o as l, s as u } from "./issues-C8uSFb36.js";
//#region src/components/kanban-board/kanban-board.scss?inline
var d = ".status-icon{color:var(--lw-color-muted-foreground);flex:none}.status-icon[data-status=progress]{color:#f5a524}.status-icon[data-status=review]{color:#8e4ec6}.status-icon[data-status=done]{color:#30a46c}.priority-icon{flex:none}.priority-icon rect{fill:color-mix(in oklab, var(--lw-color-foreground) 22%, transparent)}.priority-icon rect[data-on]{fill:var(--lw-color-muted-foreground)}.priority-icon[data-priority=urgent] rect{fill:#e5484d}.label-chip{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-full);font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);flex:none;align-items:center;gap:.375rem;padding:.125rem .5rem;display:inline-flex}.label-chip:before{content:\"\";background:var(--_label);border-radius:50%;width:.375rem;height:.375rem}.assignee{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));border-radius:50%;flex:none;place-items:center;width:1.5rem;height:1.5rem;font-size:.5625rem;font-weight:600;display:grid}.assignee[data-none]{border:1px dashed var(--lw-color-muted-foreground);background:0 0}:host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block;container-type:inline-size}h2,h3,p,ol{margin:0}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.head{flex-wrap:wrap;align-items:flex-end;gap:1rem 1.5rem;margin-bottom:1.5rem;display:flex}.head>div{flex:1}.subtitle{color:var(--_muted)}.title{letter-spacing:-.02em;margin-top:.375rem;font-size:1.5rem;font-weight:600}.keys{color:var(--_muted)}.keys kbd{--_edge:color-mix(in oklab, var(--lw-color-foreground) 22%, var(--lw-color-background));border:1px solid var(--_edge);border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--lw-color-foreground) 8%, var(--lw-color-background));min-width:1.5rem;height:1.5rem;box-shadow:0 2px 0 0 var(--_edge);color:inherit;font:inherit;justify-content:center;align-items:center;padding-inline:.375rem;font-size:.6875rem;line-height:1;display:inline-flex}@media (prefers-reduced-motion:no-preference){.keys kbd{transition:translate var(--lw-duration-fast) var(--lw-ease-out), box-shadow var(--lw-duration-fast) var(--lw-ease-out)}}.keys kbd[data-pressed]{box-shadow:none;transition-duration:75ms;translate:0 2px}.keys kbd{font-family:var(--lw-font-sans);margin-right:.375rem}.progress{color:var(--_muted);align-items:center;gap:.75rem;display:flex}.bar{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-foreground) 12%, transparent);width:8rem;height:.375rem;overflow:hidden}.fill{border-radius:inherit;background:var(--lw-color-foreground);height:100%;display:block}@media (prefers-reduced-motion:no-preference){.fill{transition:width .4s cubic-bezier(.23,1,.32,1)}}.board{align-items:start;gap:1rem;display:grid}@container (width>=44rem){.board{grid-auto-columns:minmax(0,1fr);grid-auto-flow:column}}.column{border:1px solid var(--_line);background:color-mix(in oklab, var(--lw-color-foreground) 2%, var(--lw-color-background));border-radius:1.25rem;padding:.5rem}@media (prefers-reduced-motion:no-preference){.column{transition:background-color .15s ease-out}}.column[data-over]{background:color-mix(in oklab, var(--lw-color-foreground) 6%, var(--lw-color-background))}.column-head{font-size:var(--lw-text-md);align-items:center;gap:.625rem;padding:.5rem .75rem .75rem;font-weight:500;display:flex}.column-count{color:var(--_muted);font-weight:400}.cards{gap:.5rem;min-height:4rem;padding:0;list-style:none;display:grid}.card{border:1px solid var(--_line);background:var(--lw-color-background);cursor:grab;touch-action:none;-webkit-user-select:none;user-select:none;border-radius:1rem;outline:none;gap:.75rem;padding:.875rem 1rem;display:grid;position:relative}.card:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.card[data-done] .card-title,.card[data-done] code{color:var(--_muted)}.card[data-lifted]{z-index:3;box-shadow:var(--lw-shadow-md);cursor:grabbing;pointer-events:none;rotate:1.5deg}.card[data-held]{box-shadow:0 0 0 2px var(--lw-color-foreground), var(--lw-shadow-md)}.gap{border:1.5px dashed color-mix(in oklab, var(--lw-color-foreground) 25%, transparent);border-radius:1rem}.card-top{justify-content:space-between;align-items:center;display:flex}.card-top code{font-size:var(--lw-text-xs);color:var(--_muted)}.card-title{font-size:var(--lw-text-md);line-height:1.4}.card-foot{color:var(--_muted);flex-wrap:wrap;align-items:center;gap:.5rem .75rem;display:flex}.labels{flex:1;gap:.375rem;display:flex}.due,.comments{align-items:center;gap:.25rem;display:inline-flex}", f = 4, p = [
	{
		id: "backlog",
		label: "Backlog"
	},
	{
		id: "progress",
		label: "In progress"
	},
	{
		id: "done",
		label: "Done"
	}
], m = [
	{
		id: "LOW-153",
		title: "Rate-limit the public symbol endpoint",
		column: "backlog",
		priority: "high",
		labels: ["Build"],
		due: "Oct 21",
		comments: 2,
		assignee: "Dana Ortiz"
	},
	{
		id: "LOW-148",
		title: "Audit allocator stats for the dashboard",
		column: "backlog",
		priority: "medium",
		labels: ["Perf", "Docs"],
		due: "Oct 24",
		comments: 3,
		assignee: "Maya Chen"
	},
	{
		id: "LOW-151",
		title: "Add CSV export to the crash list",
		column: "backlog",
		priority: "low",
		labels: ["Feature"],
		comments: 1,
		assignee: "Jon Reyes"
	},
	{
		id: "LOW-150",
		title: "Flaky linker test on macOS ARM",
		column: "backlog",
		priority: "medium",
		labels: ["Bug"],
		comments: 0,
		assignee: ""
	},
	{
		id: "LOW-139",
		title: "Fix the deadlock in nested signal handlers",
		column: "progress",
		priority: "urgent",
		labels: ["Bug"],
		due: "Oct 17",
		comments: 6,
		assignee: "Sara Kim"
	},
	{
		id: "LOW-146",
		title: "Stream profiler samples over a pipe",
		column: "progress",
		priority: "high",
		labels: ["Feature"],
		due: "Oct 19",
		comments: 0,
		assignee: "Alex Lee"
	},
	{
		id: "LOW-142",
		title: "Empty states for the trace viewer",
		column: "progress",
		priority: "low",
		labels: ["Feature"],
		comments: 2,
		assignee: "Maya Chen"
	},
	{
		id: "LOW-131",
		title: "Ship the symbol server redirect",
		column: "done",
		priority: "medium",
		labels: ["Build"],
		comments: 4,
		assignee: "Jon Reyes"
	},
	{
		id: "LOW-134",
		title: "Replace the date parser with our own",
		column: "done",
		priority: "low",
		labels: ["Perf"],
		comments: 0,
		assignee: "Dana Ortiz"
	}
], h = class extends e {
	static styles = [r, d];
	static props = {
		heading: { default: "Sprint 24" },
		subtitle: { default: "Runtime · Oct 14 – Oct 28" },
		columns: {
			type: Object,
			default: p
		},
		cards: {
			type: Object,
			default: m
		}
	};
	#e = [];
	#t = null;
	#n = null;
	#r = null;
	render() {
		return "<header class=\"head\"><div><p class=\"subtitle\"></p><h2 class=\"title\"></h2></div><p class=\"keys\"><kbd>Space</kbd> to move with keys</p><p class=\"progress\"><span class=\"done-text\"></span><span class=\"bar\"><span class=\"fill\"></span></span></p></header>\n<div class=\"board\"></div><p id=\"move-help\" hidden>Space to pick up, arrow keys to move, Space to drop, Escape to cancel.</p><p class=\"live visually-hidden\" aria-live=\"assertive\"></p>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".board");
		t.addEventListener("pointerdown", (e) => {
			let t = e.target.closest(".card");
			t && e.button === 0 && (this.#t = {
				card: t,
				x: e.clientX,
				y: e.clientY,
				id: e.pointerId
			});
		}, e), t.addEventListener("pointermove", (e) => this.#l(e), e), t.addEventListener("pointerup", () => this.#u(), e), t.addEventListener("pointercancel", () => this.#u(), e), t.addEventListener("keydown", (e) => this.#p(e), e);
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", this.query(".subtitle").textContent = this.subtitle ?? "", (e.has("cards") || e.has("columns")) && (this.#e = this.cards.map((e) => ({ ...e })), this.#i());
	}
	#i(e) {
		let t = this.columns.at(-1)?.id;
		this.query(".board").innerHTML = this.columns.map((e) => {
			let r = this.#e.filter((t) => t.column === e.id);
			return `<section class="column" data-column="${n(e.id)}" aria-labelledby="col-${n(e.id)}"><h3 class="column-head" id="col-${n(e.id)}">${c(e.id === t ? "done" : e.id === "progress" ? "progress" : "backlog")}<span>${n(e.label)}</span><span class="column-count">${r.length}</span></h3>
<ol class="cards" role="list">${r.map((n) => this.#a(n, e.id === t)).join("")}</ol></section>`;
		}).join(""), this.#o(), e && this.query(`.card[data-id="${CSS.escape(e)}"]`)?.focus();
	}
	#a(e, t) {
		let r = e.labels.map(l).join("");
		return `<li class="card"${t ? " data-done" : ""} tabindex="0" data-id="${n(e.id)}" aria-roledescription="card" aria-describedby="move-help"><p class="card-top"><code>${n(e.id)}</code>${u(e.priority)}</p><p class="card-title">${n(e.title)}</p>
<p class="card-foot"><span class="labels">${r}</span>${e.due ? `<span class="due">${i(o, 14)}${n(e.due)}</span>` : ""}${e.comments ? `<span class="comments">${i(a, 14)}${e.comments}</span>` : ""}${s(e.assignee)}</p></li>`;
	}
	#o() {
		let e = this.columns.at(-1)?.id, t = this.#e.filter((t) => t.column === e).length;
		this.query(".done-text").textContent = `${t} of ${this.#e.length} done`, this.query(".fill").style.width = `${t / Math.max(1, this.#e.length) * 100}%`;
	}
	#s(e, t, n) {
		let r = this.#e.find((t) => t.id === e);
		this.#e = this.#e.filter((e) => e !== r), r.column = t;
		let i = this.#e.filter((e) => e.column === t), a = i[n];
		this.#e.splice(a ? this.#e.indexOf(a) : this.#e.length, 0, r), this.emit("move", {
			id: e,
			column: t,
			index: Math.min(n, i.length)
		});
	}
	#c(e) {
		let t = this.shadowRoot.elementFromPoint(e.clientX, e.clientY)?.closest(".column");
		if (!t) return null;
		let n = [...t.querySelectorAll(".card:not([data-lifted])")], r = n.findIndex((t) => e.clientY < t.getBoundingClientRect().top + t.offsetHeight / 2);
		return {
			column: t,
			index: r < 0 ? n.length : r,
			cards: n
		};
	}
	#l(e) {
		let t = this.#t;
		if (!t) return;
		if (!this.#n) {
			if (Math.hypot(e.clientX - t.x, e.clientY - t.y) < f) return;
			t.card.setPointerCapture(t.id), t.card.toggleAttribute("data-lifted", !0);
			let n = Object.assign(document.createElement("li"), { className: "gap" });
			n.style.height = `${t.card.offsetHeight}px`, t.card.after(n), this.#n = {
				...t,
				gap: n
			}, this.toggleAttribute("data-dragging", !0);
		}
		let n = this.#n;
		n.card.style.translate = `${e.clientX - n.x}px ${e.clientY - n.y}px`;
		let r = this.#c(e);
		if (!r) return;
		let i = r.column.querySelector(".cards"), a = r.cards[r.index];
		a ? i.insertBefore(n.gap, a) : i.append(n.gap);
		for (let e of this.shadowRoot.querySelectorAll(".column")) e.toggleAttribute("data-over", e === r.column);
	}
	#u() {
		let e = this.#n;
		if (this.#t = null, !e) return;
		this.#n = null, this.removeAttribute("data-dragging");
		let t = e.gap.closest(".column").dataset.column, n = [...e.gap.parentElement.querySelectorAll(".card:not([data-lifted]), .gap")].indexOf(e.gap);
		this.#s(e.card.dataset.id, t, n), this.#i(e.card.dataset.id);
	}
	#d(e) {
		this.query(".live").textContent = e;
	}
	#f(e) {
		let t = this.#e.find((t) => t.id === e), n = this.#e.filter((e) => e.column === t.column);
		return {
			card: t,
			column: t.column,
			index: n.indexOf(t),
			count: n.length
		};
	}
	#p(e) {
		let t = e.target.closest(".card");
		if (!t) return;
		let n = t.dataset.id, r = this.columns.map((e) => e.id), { card: i, column: a, index: o, count: s } = this.#f(n), c = (e) => this.columns.find((t) => t.id === e)?.label;
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault(), this.#r ? (this.#r = null, this.#i(n), this.#d(`${i.title} dropped in ${c(a)}, position ${o + 1}.`)) : (this.#r = {
				id: n,
				column: a,
				index: o
			}, t.toggleAttribute("data-held", !0), this.#d(`${i.title} picked up from ${c(a)}.`));
			return;
		}
		if (e.key === "Escape" && this.#r) {
			e.preventDefault();
			let t = this.#r;
			this.#r = null, this.#s(n, t.column, t.index), this.#i(n), this.#d("Move cancelled.");
			return;
		}
		let l = {
			ArrowLeft: -1,
			ArrowRight: 1
		}[e.key], u = {
			ArrowUp: -1,
			ArrowDown: 1
		}[e.key];
		if (!l && !u) return;
		if (e.preventDefault(), !this.#r) {
			let e = [...this.shadowRoot.querySelectorAll(`.column[data-column="${CSS.escape(a)}"] .card`)];
			u ? e[o + u]?.focus() : this.shadowRoot.querySelector(`.column[data-column="${CSS.escape(r[r.indexOf(a) + l] ?? "")}"] .card`)?.focus();
			return;
		}
		let d = l ? r[Math.max(0, Math.min(r.length - 1, r.indexOf(a) + l))] : a, f = l ? Math.min(o, this.#e.filter((e) => e.column === d && e.id !== n).length) : Math.max(0, Math.min(s - 1, o + u));
		this.#s(n, d, f), this.#i(n), this.query(`.card[data-id="${CSS.escape(n)}"]`)?.toggleAttribute("data-held", !0), this.#d(`${c(d)}, position ${f + 1}.`);
	}
};
//#endregion
//#region src/components/kanban-board/index.js
t("kanban-board", h);
//#endregion
export { h as t };
