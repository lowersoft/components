import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { n as a } from "./motion-CFWhFfc_.js";
import { n as o, t as s } from "./people-C_zYMoEl.js";
import { N as c } from "./lucide-BVbUPHVq.js";
import { s as l } from "./issues-C8uSFb36.js";
//#region src/components/sortable-list/sortable-list.scss?inline
var u = ".status-icon{color:var(--lw-color-muted-foreground);flex:none}.status-icon[data-status=progress]{color:#f5a524}.status-icon[data-status=review]{color:#8e4ec6}.status-icon[data-status=done]{color:#30a46c}.priority-icon{flex:none}.priority-icon rect{fill:color-mix(in oklab, var(--lw-color-foreground) 22%, transparent)}.priority-icon rect[data-on]{fill:var(--lw-color-muted-foreground)}.priority-icon[data-priority=urgent] rect{fill:#e5484d}.label-chip{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-full);font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);flex:none;align-items:center;gap:.375rem;padding:.125rem .5rem;display:inline-flex}.label-chip:before{content:\"\";background:var(--_label);border-radius:50%;width:.375rem;height:.375rem}.assignee{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));border-radius:50%;flex:none;place-items:center;width:1.5rem;height:1.5rem;font-size:.5625rem;font-weight:600;display:grid}.assignee[data-none]{border:1px dashed var(--lw-color-muted-foreground);background:0 0}:host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:30rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:.5rem;display:block}h2,p,ol{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.head{justify-content:space-between;align-items:baseline;padding:.75rem .75rem 1rem;display:flex}.title{font-size:var(--lw-text-lg);font-weight:500}.hint{color:var(--_muted)}.list{border:1px solid var(--_line);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));border-radius:1rem;gap:4px;padding:.25rem;list-style:none;display:grid}.row{background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));border-radius:.75rem;align-items:center;gap:.75rem;padding:.625rem .75rem .625rem .25rem;display:flex;position:relative}@media (prefers-reduced-motion:no-preference){.row{transition:translate .2s cubic-bezier(.23,1,.32,1),box-shadow .15s ease-out,scale .15s ease-out}.row[data-lifted]{transition:box-shadow .15s ease-out,scale .15s ease-out}}.row[data-lifted]{z-index:1;background:var(--lw-color-background);box-shadow:0 0 0 1px var(--_line), var(--lw-shadow-md);scale:1.02}.handle{border-radius:var(--lw-radius-md);width:2rem;height:2.5rem;color:var(--_muted);cursor:grab;touch-action:none;background:0 0;border:0;flex:none;place-items:center;padding:0;display:grid}:host([data-dragging]) .handle{cursor:grabbing}.rank{font-variant-numeric:tabular-nums;text-align:center;width:1.25rem;color:var(--_muted);flex:none}.text{flex:1;min-width:0}.item-title{font-size:var(--lw-text-md);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.meta{color:var(--_muted);align-items:center;gap:.5rem;margin-top:.25rem;display:flex}.meta code{font-size:var(--lw-text-xs)}.owner{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));border-radius:50%;flex:none;place-items:center;width:2rem;height:2rem;font-size:.625rem;font-weight:600;display:grid}.estimate{width:2rem;font-size:var(--lw-text-md);text-align:right;color:var(--_muted);flex:none}", d = {
	duration: 220,
	easing: "cubic-bezier(0.23, 1, 0.32, 1)"
}, f = [
	{
		id: "LOW-412",
		title: "Fix the symbol cache on a full disk",
		area: "runtime",
		priority: "high",
		owner: "Maya Lin",
		estimate: "2d"
	},
	{
		id: "LOW-397",
		title: "Search across crash reports",
		area: "profiler",
		priority: "medium",
		owner: "Theo Park",
		estimate: "5d"
	},
	{
		id: "LOW-405",
		title: "Company details on invoices",
		area: "billing",
		priority: "low",
		owner: "Ana Ruiz",
		estimate: "1d"
	},
	{
		id: "LOW-418",
		title: "ARM linker drops debug info",
		area: "toolchain",
		priority: "high",
		owner: "Sam Okafor",
		estimate: "½d"
	},
	{
		id: "LOW-421",
		title: "Man page for lower trace",
		area: "docs",
		priority: "low",
		owner: "Priya Raman",
		estimate: "1d"
	}
], p = class extends e {
	static styles = [r, u];
	static props = { items: {
		type: Object,
		default: f
	} };
	#e = [];
	#t = null;
	#n = null;
	render() {
		return "<header class=\"head\"><h2 class=\"title\">Next up</h2><p class=\"hint\">Drag to prioritize</p></header><ol class=\"list\"></ol><p id=\"handle-help\" hidden>Space to pick up, arrow keys to move, Space to drop, Escape to cancel.</p><p class=\"live visually-hidden\" aria-live=\"assertive\"></p>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".list");
		t.addEventListener("pointerdown", (e) => this.#c(e), e), t.addEventListener("pointermove", (e) => this.#l(e), e), t.addEventListener("pointerup", () => this.#u(), e), t.addEventListener("pointercancel", () => this.#u(), e), t.addEventListener("keydown", (e) => this.#p(e), e), t.addEventListener("focusout", (e) => {
			this.#n && !t.contains(e.relatedTarget) && this.#m();
		}, e);
	}
	updated(e) {
		e.has("items") && (this.#e = this.items.map((e) => e.id), this.#i());
	}
	get #r() {
		return [...this.shadowRoot.querySelectorAll(".row")];
	}
	#i() {
		let e = new Map(this.items.map((e) => [e.id, e]));
		this.query(".list").innerHTML = this.#e.map((t) => e.get(t)).map((e) => `<li class="row" data-id="${n(e.id)}"><button class="handle" type="button" aria-label="Move ${n(e.title)}" aria-describedby="handle-help">${i(c, 18)}</button><span class="rank"></span>
<div class="text"><p class="item-title">${n(e.title)}</p><p class="meta">${l(e.priority)}<code>${n(e.id)}</code><span>${n(e.area)}</span></p></div><span class="owner" style="--_hue: ${s(e.owner)}" title="${n(e.owner)}">${n(o(e.owner))}</span><span class="estimate">${n(e.estimate)}</span></li>`).join(""), this.#a();
	}
	#a() {
		this.#r.forEach((e, t) => e.querySelector(".rank").textContent = String(t + 1));
	}
	#o(e) {
		if (!a.matches) for (let t of this.#r) {
			let n = e.get(t), r = t.getBoundingClientRect().top;
			n !== void 0 && n !== r && t.animate({ translate: [`0 ${n - r}px`, "0 0"] }, d);
		}
	}
	#s() {
		return new Map(this.#r.map((e) => [e, e.getBoundingClientRect().top]));
	}
	#c(e) {
		let t = e.target.closest(".handle");
		if (!t || e.button !== 0) return;
		e.preventDefault();
		let n = t.closest(".row");
		t.focus(), t.setPointerCapture(e.pointerId);
		let r = this.#r;
		this.#t = {
			row: n,
			y: e.clientY,
			from: r.indexOf(n),
			index: r.indexOf(n),
			height: n.offsetHeight + 4
		}, n.toggleAttribute("data-lifted", !0), this.toggleAttribute("data-dragging", !0);
	}
	#l(e) {
		let t = this.#t;
		if (!t) return;
		let n = e.clientY - t.y, r = this.#r;
		t.index = Math.max(0, Math.min(r.length - 1, t.from + Math.round(n / t.height))), t.row.style.translate = `0 ${n}px`, r.forEach((e, n) => {
			if (e === t.row) return;
			let r = n > t.from && n <= t.index ? -t.height : n < t.from && n >= t.index ? t.height : 0;
			e.style.translate = r ? `0 ${r}px` : "";
		});
	}
	#u() {
		let e = this.#t;
		if (!e) return;
		this.#t = null, this.removeAttribute("data-dragging");
		let t = this.#s();
		for (let e of this.#r) e.style.translate = "";
		e.row.removeAttribute("data-lifted"), this.#d(e.row, e.index, t);
	}
	#d(e, t, n = this.#s()) {
		let r = this.query(".list"), i = this.#r.filter((t) => t !== e);
		r.insertBefore(e, i[t] ?? null), this.#o(n), this.#a();
		let a = this.#r.map((e) => e.dataset.id);
		a.join() !== this.#e.join() && (this.#e = a, this.emit("reorder", { ids: a }));
	}
	#f(e) {
		this.query(".live").textContent = e;
	}
	#p(e) {
		let t = e.target.closest(".handle");
		if (!t) return;
		let n = t.closest(".row"), r = n.querySelector(".item-title").textContent, i = this.#r, a = i.indexOf(n);
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault(), this.#n ? (this.#n = null, n.removeAttribute("data-lifted"), this.#f(`${r} dropped at position ${a + 1}.`)) : (this.#n = {
				row: n,
				from: a
			}, n.toggleAttribute("data-lifted", !0), this.#f(`${r} picked up, position ${a + 1} of ${i.length}.`));
			return;
		}
		if (e.key === "Escape" && this.#n) {
			e.preventDefault(), this.#m(), t.focus();
			return;
		}
		let o = {
			ArrowUp: -1,
			ArrowDown: 1
		}[e.key];
		if (!o) return;
		if (e.preventDefault(), !this.#n) {
			i[a + o]?.querySelector(".handle").focus();
			return;
		}
		let s = Math.max(0, Math.min(i.length - 1, a + o));
		s !== a && (this.#d(n, s), t.focus(), this.#f(`${r}, position ${s + 1} of ${i.length}.`));
	}
	#m() {
		let { row: e, from: t } = this.#n;
		this.#n = null, e.removeAttribute("data-lifted"), this.#d(e, t), this.#f(`Move cancelled. ${e.querySelector(".item-title").textContent} is back at position ${t + 1}.`);
	}
};
//#endregion
//#region src/components/sortable-list/index.js
t("sortable-list", p);
//#endregion
export { p as t };
