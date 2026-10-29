import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { t as a } from "./platform-CKi8k97Y.js";
import { n as o } from "./motion-CFWhFfc_.js";
import { t as s } from "./visibility--H4IXDjD.js";
import { n as c } from "./people-C_zYMoEl.js";
import { Y as l, at as u } from "./lucide-BVbUPHVq.js";
//#region src/components/canvas-toolbar/canvas-toolbar.scss?inline
var d = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:56rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:0;display:block;position:relative;overflow:hidden}h2,p{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.bar{z-index:2;pointer-events:none;align-items:center;gap:1rem;padding:1rem 1rem 0 1.5rem;display:flex;position:absolute;inset:0 0 auto}.bar>*{pointer-events:auto}.title{font-size:var(--lw-text-lg);font-weight:500}.count{color:var(--_muted);font-weight:400}.people{flex:1;display:flex}.person{border:2px solid var(--_ring);background:color-mix(in oklab, var(--lw-color-foreground) 12%, var(--lw-color-background));border-radius:50%;place-items:center;width:1.875rem;height:1.875rem;font-size:.625rem;font-weight:600;display:grid}.person+.person{margin-left:-.5rem}.tools{border:1px solid var(--_line);background:color-mix(in oklab, var(--lw-color-foreground) 6%, var(--lw-color-background));box-shadow:var(--lw-shadow-md);border-radius:1rem;align-items:center;gap:.125rem;padding:.375rem;display:flex}.tool,.zoom{border-radius:var(--lw-radius-md);min-width:2.25rem;height:2.25rem;color:var(--_muted);cursor:pointer;background:0 0;border:0;place-items:center;padding:0 .375rem;display:grid}.tool:hover:not(:disabled),.zoom:hover:not(:disabled){background:color-mix(in oklab, var(--lw-color-foreground) 8%, transparent);color:var(--lw-color-foreground)}.tool:disabled,.zoom:disabled{cursor:default;opacity:.35}.zoom{min-width:3.5rem;font-size:var(--lw-text-md);font-variant-numeric:tabular-nums;color:var(--lw-color-foreground)}.sep{background:var(--_line);width:1px;height:1.25rem;margin:0 .25rem}.board{background-image:radial-gradient(color-mix(in oklab, var(--lw-color-foreground) 18%, transparent) 1px, transparent 1.2px);touch-action:none;background-size:22px 22px;height:32rem;position:relative;overflow:hidden}.world{transform-origin:0 0;position:absolute;inset:0}@media (prefers-reduced-motion:no-preference){.world{transition:scale .2s cubic-bezier(.23,1,.32,1)}}.section-title{font-size:var(--lw-text-lg);background:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 6' preserveAspectRatio='none'%3E%3Cpath d='M1 3c8-2 12 2 20 0s12-2 20 0 12 2 20 0 12-2 20 0 12 2 18 0' fill='none' stroke='%23999' stroke-width='1.5'/%3E%3C/svg%3E\") 0 100%/100% .375rem no-repeat;padding-bottom:.375rem;font-weight:600;position:absolute;top:5rem;left:3rem}.links{width:100%;height:100%;color:color-mix(in oklab, var(--lw-color-foreground) 70%, transparent);position:absolute;inset:0;overflow:visible}.links .link{fill:none;stroke:currentColor;stroke-width:1.5px}.note{box-sizing:border-box;border:1px solid color-mix(in oklab, var(--_note) 60%, transparent);background:color-mix(in oklab, var(--_note) 30%, var(--lw-color-background));width:14rem;min-height:6rem;font-size:var(--lw-text-md);cursor:grab;-webkit-user-select:none;user-select:none;border-radius:.75rem;outline:none;padding:1rem;line-height:1.45;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.note{transition:translate .2s cubic-bezier(.23,1,.32,1),box-shadow .15s ease-out}}.note:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.note[data-dragging]{z-index:1;box-shadow:var(--lw-shadow-md);cursor:grabbing;transition:box-shadow .15s ease-out}.note.outline{border:2px solid color-mix(in oklab, var(--lw-color-foreground) 70%, transparent);background:var(--lw-color-background);width:12rem;min-height:0;font-size:var(--lw-text-lg);place-items:center;font-weight:600;display:grid}.cursor{z-index:1;pointer-events:none;align-items:flex-start;display:flex;position:absolute;top:55%;left:62%}.cursor svg{fill:var(--_color);stroke:var(--lw-color-background);stroke-width:1px}.cursor-name{border-radius:var(--lw-radius-md);background:var(--_color);font-size:var(--lw-text-xs);color:#fff;margin:1rem 0 0 -.25rem;padding:.125rem .5rem;font-weight:500}", f = "<path d=\"M9 14 4 9l5-5\"/><path d=\"M4 9h10.5a5.5 5.5 0 0 1 0 11H11\"/>", p = "<path d=\"m15 14 5-5-5-5\"/><path d=\"M20 9H9.5a5.5 5.5 0 0 0 0 11H13\"/>", m = [
	.5,
	.67,
	.75,
	.86,
	1,
	1.25,
	1.5,
	2
], h = 8, g = [
	{
		id: "a",
		text: "Rewrite the profiler page for v2",
		x: 40,
		y: 150,
		color: "#8e4ec6"
	},
	{
		id: "b",
		text: "Crash emails: link each report to its trace",
		x: 330,
		y: 250,
		color: "#e5484d"
	},
	{
		id: "c",
		text: "Migration guide for teams on the old profiler",
		x: 620,
		y: 120,
		color: "#0090ff"
	},
	{
		id: "d",
		text: "Ship Nov 4",
		x: 330,
		y: 430,
		color: "",
		outline: !0
	}
], _ = [
	["a", "b"],
	["b", "c"],
	["b", "d"]
], v = [
	{
		name: "Maya Chen",
		color: "#8e4ec6"
	},
	{
		name: "Jonas Becker",
		color: "#0090ff"
	},
	{
		name: "Priya Nair",
		color: "#e5484d"
	}
], y = class extends e {
	static styles = [r, d];
	static props = {
		heading: { default: "Launch board" },
		zoom: {
			type: Number,
			default: .86
		},
		notes: {
			type: Object,
			default: g
		},
		links: {
			type: Object,
			default: _
		},
		people: {
			type: Object,
			default: v
		}
	};
	#e = /* @__PURE__ */ new Map();
	#t = [];
	#n = [];
	#r = null;
	#i = 0;
	render() {
		return `<header class="bar"><h2 class="title"><span class="heading"></span> <span class="count"></span></h2><span class="people"></span>
<div class="tools" role="toolbar" aria-label="Board"><button class="tool" type="button" data-action="undo" aria-label="Undo">${i(f, 18)}</button><button class="tool" type="button" data-action="redo" aria-label="Redo">${i(p, 18)}</button><span class="sep"></span>
<button class="tool" type="button" data-action="out" aria-label="Zoom out">${i(l, 18)}</button><button class="zoom" type="button" data-action="reset" aria-label="Reset zoom"></button><button class="tool" type="button" data-action="in" aria-label="Zoom in">${i(u, 18)}</button></div></header>
<div class="board"><div class="world"><svg class="links" aria-hidden="true"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1 9 5 1 9" fill="none" stroke="currentColor" stroke-width="1.5"/></marker></defs></svg><p class="section-title">Q4 launch</p><div class="notes"></div></div>
<span class="cursor" aria-hidden="true"><svg viewBox="0 0 16 16" width="18" height="18"><path d="M2 2 14 7 8.5 8.5 7 14Z"/></svg><span class="cursor-name"></span></span></div><p class="live visually-hidden" aria-live="polite"></p>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".tools").addEventListener("click", (e) => {
			let t = e.target.closest("[data-action]")?.dataset.action;
			t === "undo" ? this.#u(this.#t, this.#n) : t === "redo" ? this.#u(this.#n, this.#t) : t && this.#o(t === "reset" ? 1 : this.#a(t === "in" ? 1 : -1));
		}, e);
		let t = this.query(".board");
		t.addEventListener("wheel", (e) => {
			(e.ctrlKey || e.metaKey) && (e.preventDefault(), this.#o(this.#a(e.deltaY < 0 ? 1 : -1)));
		}, {
			...e,
			passive: !1
		}), this.#d(t, e), this.addEventListener("keydown", (e) => this.#f(e), e), s(this, (e) => this.#p(e), this.signal), this.signal.addEventListener("abort", () => cancelAnimationFrame(this.#i));
	}
	updated(e) {
		this.query(".heading").textContent = this.heading ?? "", e.has("people") && (this.query(".people").innerHTML = this.people.map((e) => `<span class="person" style="--_ring: ${n(e.color)}" title="${n(e.name)}">${n(c(e.name))}</span>`).join(""), this.query(".cursor").style.setProperty("--_color", this.people[0]?.color ?? "#8e4ec6"), this.query(".cursor-name").textContent = (this.people[0]?.name ?? "").split(" ")[0]), e.has("notes") && (this.#e = new Map(this.notes.map((e) => [e.id, {
			x: e.x,
			y: e.y
		}])), this.query(".notes").innerHTML = this.notes.map((e) => `<div class="note${e.outline ? " outline" : ""}" data-id="${n(e.id)}" tabindex="0" role="group" aria-roledescription="note" style="--_note: ${n(e.color || "transparent")}">${n(e.text)}</div>`).join(""), this.#t = [], this.#n = []), this.query(".count").textContent = `${this.notes.length + this.links.length + 1} items`, this.#s();
	}
	#a(e) {
		let t = m.findIndex((e) => e >= this.zoom - .001);
		return m[Math.min(m.length - 1, Math.max(0, (t < 0 ? m.length - 1 : t) + e))];
	}
	#o(e) {
		this.zoom = e, this.query(".live").textContent = `Zoom ${Math.round(e * 100)}%`;
	}
	#s() {
		this.query(".world").style.scale = String(this.zoom), this.query(".zoom").textContent = `${Math.round(this.zoom * 100)}%`;
		for (let e of this.shadowRoot.querySelectorAll(".note")) {
			let t = this.#e.get(e.dataset.id);
			e.style.translate = `${t.x}px ${t.y}px`;
		}
		this.#c(), this.query("[data-action=\"undo\"]").disabled = !this.#t.length, this.query("[data-action=\"redo\"]").disabled = !this.#n.length, this.query("[data-action=\"out\"]").disabled = this.zoom <= m[0], this.query("[data-action=\"in\"]").disabled = this.zoom >= m.at(-1);
	}
	#c() {
		let e = (e) => {
			let t = this.query(`.note[data-id="${CSS.escape(e)}"]`), n = this.#e.get(e);
			return t && n ? {
				x: n.x,
				y: n.y,
				w: t.offsetWidth,
				h: t.offsetHeight
			} : null;
		}, t = (e, t) => {
			let n = e.x + e.w / 2, r = e.y + e.h / 2, i = t.x + t.w / 2 - n, a = t.y + t.h / 2 - r, o = 1 / Math.max(Math.abs(i) / (e.w / 2 + 12), Math.abs(a) / (e.h / 2 + 12), 1e-6);
			return [n + i * o, r + a * o];
		}, n = this.query(".links");
		n.querySelectorAll("path.link").forEach((e) => e.remove());
		for (let [r, i] of this.links) {
			let a = e(r), o = e(i);
			if (!a || !o) continue;
			let [s, c] = t(a, o), [l, u] = t(o, a);
			n.insertAdjacentHTML("beforeend", `<path class="link" d="M${s} ${c}L${l} ${u}" marker-end="url(#arrow)"/>`);
		}
	}
	#l(e, t, n = !0) {
		let r = this.#e.get(e);
		(r.x !== t.x || r.y !== t.y) && (n && (this.#t.push({
			id: e,
			from: { ...r },
			to: { ...t }
		}), this.#n = []), this.#e.set(e, { ...t }), this.#s(), this.emit("change", { notes: this.notes.map((e) => ({
			...e,
			...this.#e.get(e.id)
		})) }));
	}
	#u(e, t) {
		let n = e.pop();
		n && (this.#e.set(n.id, e === this.#t ? { ...n.from } : { ...n.to }), t.push(n), this.#s(), this.query(".live").textContent = e === this.#t ? "Undone" : "Redone");
	}
	#d(e, t) {
		e.addEventListener("pointerdown", (e) => {
			let t = e.target.closest(".note");
			if (!t || e.button !== 0) return;
			e.preventDefault(), t.focus(), t.setPointerCapture(e.pointerId);
			let n = this.#e.get(t.dataset.id);
			this.#r = {
				note: t,
				id: t.dataset.id,
				start: { ...n },
				x: e.clientX,
				y: e.clientY
			}, t.toggleAttribute("data-dragging", !0);
		}, t), e.addEventListener("pointermove", (e) => {
			let t = this.#r;
			t && (this.#e.set(t.id, {
				x: t.start.x + (e.clientX - t.x) / this.zoom,
				y: t.start.y + (e.clientY - t.y) / this.zoom
			}), this.#s());
		}, t);
		for (let n of ["pointerup", "pointercancel"]) e.addEventListener(n, () => {
			let e = this.#r;
			if (!e) return;
			this.#r = null, e.note.removeAttribute("data-dragging");
			let t = { ...this.#e.get(e.id) };
			this.#e.set(e.id, e.start), this.#l(e.id, t);
		}, t);
	}
	#f(e) {
		if ((a ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "z") {
			e.preventDefault(), e.shiftKey ? this.#u(this.#n, this.#t) : this.#u(this.#t, this.#n);
			return;
		}
		let t = e.composedPath().find((e) => e.classList?.contains("note")), n = {
			ArrowLeft: [-1, 0],
			ArrowRight: [1, 0],
			ArrowUp: [0, -1],
			ArrowDown: [0, 1]
		}[e.key];
		if (!t || !n) return;
		e.preventDefault();
		let r = e.shiftKey ? 32 : h, i = this.#e.get(t.dataset.id);
		this.#l(t.dataset.id, {
			x: i.x + n[0] * r,
			y: i.y + n[1] * r
		});
	}
	#p(e) {
		cancelAnimationFrame(this.#i);
		let t = this.query(".cursor");
		if (!e || o.matches) return;
		let n = performance.now(), r = (e) => {
			let i = (e - n) / 1e3;
			t.style.left = `${62 + Math.sin(i * .4) * 18}%`, t.style.top = `${55 + Math.sin(i * .7) * 20}%`, this.#i = requestAnimationFrame(r);
		};
		this.#i = requestAnimationFrame(r);
	}
};
//#endregion
//#region src/components/canvas-toolbar/index.js
t("canvas-toolbar", y);
//#endregion
export { y as t };
