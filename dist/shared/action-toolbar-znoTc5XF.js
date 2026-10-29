import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { n as a } from "./motion-CFWhFfc_.js";
import { i as o } from "./menu-BCEGADW6.js";
import { n as s } from "./swap-BK53XQML.js";
import { n as c, t as l } from "./people-C_zYMoEl.js";
import { Dt as u, G as d, gt as f } from "./lucide-BVbUPHVq.js";
import { n as p, t as m } from "./picker-CFtn-7gY.js";
//#region src/components/action-toolbar/action-toolbar.scss?inline
var h = ".picker-trigger{border-radius:var(--lw-radius-md);font:inherit;color:var(--lw-color-foreground);cursor:pointer;background:0 0;border:0;outline:none;align-items:center;gap:.375rem;padding:.375rem .5rem;display:inline-flex}.picker-trigger:hover,.picker-trigger[aria-expanded=true]{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent)}.picker-trigger:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.picker-trigger>svg{color:var(--lw-color-muted-foreground);flex:none}.picker-label{color:var(--lw-color-muted-foreground)}.status-icon{color:var(--lw-color-muted-foreground);flex:none}.status-icon[data-status=progress]{color:#f5a524}.status-icon[data-status=review]{color:#8e4ec6}.status-icon[data-status=done]{color:#30a46c}.priority-icon{flex:none}.priority-icon rect{fill:color-mix(in oklab, var(--lw-color-foreground) 22%, transparent)}.priority-icon rect[data-on]{fill:var(--lw-color-muted-foreground)}.priority-icon[data-priority=urgent] rect{fill:#e5484d}.label-chip{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-full);font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);flex:none;align-items:center;gap:.375rem;padding:.125rem .5rem;display:inline-flex}.label-chip:before{content:\"\";background:var(--_label);border-radius:50%;width:.375rem;height:.375rem}.assignee{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));border-radius:50%;flex:none;place-items:center;width:1.5rem;height:1.5rem;font-size:.5625rem;font-weight:600;display:grid}.assignee[data-none]{border:1px dashed var(--lw-color-muted-foreground);background:0 0}:host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:46rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:0;display:block;position:relative;overflow:hidden;container-type:inline-size}h2,ul{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.check{border:1.5px solid color-mix(in oklab, var(--lw-color-foreground) 35%, transparent);appearance:none;cursor:pointer;border-radius:.3125rem;flex:none;place-content:center;width:1.125rem;height:1.125rem;margin:0;display:grid}.check:before{content:\"\";background:var(--lw-color-background);clip-path:polygon(14% 44%,0 65%,50% 100%,100% 16%,80% 0%,43% 62%);width:.625rem;height:.625rem;scale:0}@media (prefers-reduced-motion:no-preference){.check:before{transition:scale .15s ease-out}}.check:checked,.check:indeterminate{border-color:var(--lw-color-foreground);background:var(--lw-color-foreground)}.check:checked:before,.check:indeterminate:before{scale:1}.check:indeterminate:before{clip-path:none;height:2px}.check:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.head{border-bottom:1px solid var(--_line);align-items:center;gap:1rem;padding:1rem 1.25rem;display:flex}.title{font-size:var(--lw-text-lg);font-weight:500}.total{color:var(--_muted);margin-left:.5rem;font-weight:400}.list{padding:0 0 4.5rem;list-style:none}.row{outline:none;grid-template-columns:auto auto 9rem minmax(0,1fr) auto;align-items:center;gap:1rem;padding:.75rem 1.25rem;display:grid;overflow:hidden}.row+.row{border-top:1px solid var(--_line)}.row:hover{background:color-mix(in oklab, var(--lw-color-foreground) 3%, transparent)}.row:focus-visible{box-shadow:inset 0 0 0 2px var(--lw-color-ring)}.row[data-selected]{background:color-mix(in oklab, var(--lw-color-foreground) 7%, transparent)}@container (width<=36rem){.row{grid-template-columns:auto auto minmax(0,1fr) auto}.row .from{display:none}}.avatar{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));border-radius:50%;place-items:center;width:1.75rem;height:1.75rem;font-size:.5625rem;font-weight:600;display:grid}.avatar.tile{background:var(--_mark);font-size:var(--lw-text-xs);color:#fff;border-radius:.5rem;box-shadow:inset 0 0 0 1px #fff3;box-shadow:inset 0 0 0 1px lab(100% -.0000298023 .0000119209/.2)}.from{font-size:var(--lw-text-md);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}[data-unread]>.from{font-weight:600}.subject-cell{align-items:center;gap:.5rem;min-width:0;display:flex}.subject{font-size:var(--lw-text-md);text-overflow:ellipsis;white-space:nowrap;color:var(--_muted);overflow:hidden}[data-unread] .subject{color:var(--lw-color-foreground)}.time{white-space:nowrap;color:var(--_muted)}.toolbar{z-index:2;border:1px solid var(--_line);background:color-mix(in oklab, var(--lw-color-foreground) 8%, var(--lw-color-background));box-shadow:var(--lw-shadow-md);white-space:nowrap;border-radius:1rem;align-items:center;gap:.125rem;padding:.375rem;display:flex;position:absolute;bottom:1rem;left:50%;translate:-50%}@media (prefers-reduced-motion:no-preference){.toolbar{animation:.25s cubic-bezier(.23,1,.32,1) rise}}.toolbar[hidden]{display:none}@keyframes rise{0%{opacity:0;translate:-50% 1rem}}.count{font-variant-numeric:tabular-nums;padding:0 .75rem;font-weight:500}.sep{background:var(--_line);width:1px;height:1.25rem;margin:0 .25rem}.act{border-radius:var(--lw-radius-md);cursor:pointer;background:0 0;border:0;align-items:center;gap:.375rem;height:2.25rem;padding:0 .625rem;display:inline-flex}.act:hover{background:color-mix(in oklab, var(--lw-color-foreground) 8%, transparent)}.act.danger:hover{color:var(--lw-color-destructive)}.act.clear{color:var(--_muted)}@container (width<=36rem){.act span{display:none}}.label-picker .picker-trigger{height:2.25rem;padding:0 .625rem}.label-picker .picker-trigger .picker-label{color:var(--lw-color-foreground)}.undo-bar{border-radius:var(--lw-radius-lg);background:var(--lw-color-foreground);color:var(--lw-color-background);align-items:center;gap:1rem;padding:.5rem .5rem .5rem 1rem;display:flex;position:absolute;bottom:1rem;left:50%;translate:-50%}.undo-bar[hidden],.toolbar:not([hidden])~.undo-bar{display:none}.undo{border-radius:var(--lw-radius-sm);cursor:pointer;background:0 0;border:0;padding:.25rem .5rem;font-weight:600}", g = "<rect width=\"20\" height=\"5\" x=\"2\" y=\"3\" rx=\"1\"/><path d=\"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4\"/>", _ = "<path d=\"M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/>", v = {
	Billing: "#30a46c",
	Product: "#3b82f6",
	Build: "#f76b15",
	Support: "#8e4ec6"
}, y = [
	{
		id: 1,
		from: "LowerSoft Billing",
		mark: "#635bff",
		label: "Billing",
		subject: "Your invoice for October is ready",
		time: "9:41 AM",
		unread: !0
	},
	{
		id: 2,
		from: "Maya Chen",
		label: "Product",
		subject: "Re: Profiler v2 copy, last pass before launch",
		time: "9:12 AM",
		unread: !0
	},
	{
		id: 3,
		from: "CI",
		mark: "#09090b",
		subject: "Build failed on main: type error in alloc.c",
		time: "8:55 AM"
	},
	{
		id: 4,
		from: "Issue tracker",
		mark: "#8e8cf0",
		subject: "3 issues were assigned to you this week",
		time: "Yesterday"
	},
	{
		id: 5,
		from: "Jonas Weber",
		label: "Billing",
		subject: "Contract for the Q4 retainer, signed",
		time: "Yesterday"
	},
	{
		id: 6,
		from: "Code review",
		mark: "#30a46c",
		subject: "[lowersoft/runtime] Pull request #48 was merged",
		time: "Oct 14"
	}
], b = class extends e {
	static styles = [
		r,
		o,
		s,
		h
	];
	static props = { conversations: {
		type: Object,
		default: y
	} };
	#e = [];
	#t = /* @__PURE__ */ new Set();
	#n = null;
	#r = null;
	render() {
		return `<header class="head"><input class="all check" type="checkbox" aria-label="Select all"><h2 class="title">Inbox <span class="total"></span></h2></header><ul class="list" aria-label="Conversations"></ul>
<div class="toolbar" role="toolbar" aria-label="Selected conversations" hidden><span class="count" aria-live="polite"></span><span class="sep"></span>
<button class="act" type="button" data-action="archive">${i(g, 16)}<span>Archive</span></button><button class="act" type="button" data-action="read">${i(d, 16)}<span class="read-label">Mark read</span></button>
<span class="label-picker">${p("label-menu", {
			icon: i(f, 16),
			label: "Label"
		})}</span><button class="act danger" type="button" data-action="delete">${i(_, 16)}<span>Delete</span></button><span class="sep"></span><button class="act clear" type="button" aria-label="Clear selection">${i(u, 16)}</button></div>
<div class="undo-bar" role="status" hidden><span class="undo-text"></span><button class="undo" type="button">Undo</button></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		m(this.query(".label-picker"), this.signal, (e) => this.#s("label", e)).set(Object.keys(v).map((e) => ({
			value: e,
			label: e
		})), ""), this.query(".label-picker .picker-value").remove(), this.query(".all").addEventListener("change", (e) => {
			this.#t = e.target.checked ? new Set(this.#e.map((e) => e.id)) : /* @__PURE__ */ new Set(), this.#o();
		}, e);
		let t = this.query(".list");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".check");
			t && this.#a(Number(t.closest(".row").dataset.id), e.shiftKey);
		}, e), t.addEventListener("keydown", (e) => {
			let t = e.target.closest(".row");
			if (!t) return;
			let n = e.key.toLowerCase();
			if (n === "x") this.#a(Number(t.dataset.id), e.shiftKey);
			else if (n === "j" || e.key === "ArrowDown") t.nextElementSibling?.focus();
			else if (n === "k" || e.key === "ArrowUp") t.previousElementSibling?.focus();
			else return;
			e.preventDefault();
		}, e), this.query(".toolbar").addEventListener("click", (e) => {
			let t = e.target.closest(".act");
			t && (t.classList.contains("clear") ? (this.#t.clear(), this.#o()) : this.#s(t.dataset.action));
		}, e), this.query(".undo").addEventListener("click", () => this.#l(), e), this.addEventListener("keydown", (e) => {
			e.key === "Escape" && this.#t.size && (this.#t.clear(), this.#o());
		}, e);
	}
	updated(e) {
		e.has("conversations") && (this.#e = this.conversations.map((e) => ({ ...e })), this.#t.clear(), this.#i());
	}
	#i() {
		this.query(".list").innerHTML = this.#e.map((e) => {
			let t = e.mark ? `<span class="avatar tile" style="--_mark: ${n(e.mark)}">${n(e.from.charAt(0))}</span>` : `<span class="avatar" style="--_hue: ${l(e.from)}">${n(c(e.from))}</span>`;
			return `<li class="row" tabindex="0" data-id="${e.id}"><input class="check" type="checkbox" tabindex="-1" aria-label="Select ${n(e.from)}: ${n(e.subject)}">${t}<span class="from">${n(e.from)}</span>
<span class="subject-cell"><span class="label"></span><span class="subject">${n(e.subject)}</span></span><time class="time">${n(e.time)}</time></li>`;
		}).join(""), this.#o();
	}
	#a(e, t) {
		let n = this.#e.map((e) => e.id);
		if (t && this.#n !== null && n.includes(this.#n)) {
			let [t, r] = [n.indexOf(this.#n), n.indexOf(e)].sort((e, t) => e - t), i = !this.#t.has(e);
			for (let e of n.slice(t, r + 1)) i ? this.#t.add(e) : this.#t.delete(e);
		} else this.#t.has(e) ? this.#t.delete(e) : this.#t.add(e);
		this.#n = e, this.#o();
	}
	#o() {
		let e = this.#t.size, t = this.#e.length;
		this.query(".total").textContent = `${t} conversations`;
		let r = this.query(".all");
		r.checked = e > 0 && e === t, r.indeterminate = e > 0 && e < t;
		for (let e of this.shadowRoot.querySelectorAll(".row")) {
			let t = this.#e.find((t) => t.id === Number(e.dataset.id)), r = this.#t.has(t.id);
			e.toggleAttribute("data-selected", r), e.toggleAttribute("data-unread", !!t.unread), e.querySelector(".check").checked = r, e.querySelector(".label").innerHTML = t.label ? `<span class="label-chip" style="--_label: ${v[t.label] ?? "#71717a"}">${n(t.label)}</span>` : "";
		}
		let i = this.query(".toolbar");
		i.hidden = e === 0, this.query(".count").textContent = `${e} selected`;
		let a = [...this.#t].every((e) => !this.#e.find((t) => t.id === e)?.unread);
		this.query(".read-label").textContent = a ? "Mark unread" : "Mark read";
	}
	async #s(e, t) {
		let n = [...this.#t];
		if (n.length) {
			if (e === "read") {
				let e = n.every((e) => !this.#e.find((t) => t.id === e).unread);
				for (let t of n) this.#e.find((e) => e.id === t).unread = e;
			} else if (e === "label") for (let e of n) this.#e.find((t) => t.id === e).label = t;
			else {
				let t = this.#e.map((e) => ({ ...e })), r = n.map((e) => this.query(`.row[data-id="${e}"]`));
				a.matches || await Promise.all(r.map((e) => e.animate({
					opacity: [1, 0],
					height: [`${e.offsetHeight}px`, "0px"]
				}, {
					duration: 220,
					easing: "ease-out"
				}).finished)), this.#e = this.#e.filter((e) => !this.#t.has(e.id)), this.#t.clear(), this.#i(), this.#c(`${n.length} ${n.length === 1 ? "conversation" : "conversations"} ${e === "archive" ? "archived" : "deleted"}`, t), this.emit("action", {
					action: e,
					ids: n
				});
				return;
			}
			this.#o(), this.emit("action", {
				action: e,
				ids: n,
				label: t
			});
		}
	}
	#c(e, t) {
		clearTimeout(this.#r?.timer);
		let n = this.query(".undo-bar");
		n.hidden = !1, this.query(".undo-text").textContent = e, this.#r = {
			before: t,
			timer: setTimeout(() => n.hidden = !0, 5e3)
		};
	}
	#l() {
		this.#r && (clearTimeout(this.#r.timer), this.#e = this.#r.before, this.#r = null, this.query(".undo-bar").hidden = !0, this.#i());
	}
};
//#endregion
//#region src/components/action-toolbar/index.js
t("action-toolbar", b);
//#endregion
export { b as t };
