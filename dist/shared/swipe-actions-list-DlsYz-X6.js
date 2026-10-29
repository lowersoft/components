import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { n as a } from "./motion-CFWhFfc_.js";
import { n as o, t as s } from "./people-C_zYMoEl.js";
import { G as c, et as l } from "./lucide-BVbUPHVq.js";
//#region src/components/swipe-actions-list/swipe-actions-list.scss?inline
var u = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:30rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:0;display:block;position:relative;overflow:hidden}h2,p,ul{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.head{border-bottom:1px solid var(--_line);justify-content:space-between;align-items:baseline;padding:1rem 1.25rem;display:flex}.title{font-size:var(--lw-text-lg);font-weight:500}.unread{color:var(--_muted)}.list{padding:0;list-style:none}.row{touch-action:pan-y;-webkit-user-select:none;user-select:none;outline:none;position:relative;overflow:hidden}.row+.row{border-top:1px solid var(--_line)}.row:focus-visible{box-shadow:inset 0 0 0 2px var(--lw-color-ring)}.under{opacity:0;align-items:center;gap:.5rem;padding:0 1.5rem;font-weight:500;display:flex;position:absolute;inset:0}.under.left{background:color-mix(in oklab, #3b82f6 25%, var(--lw-color-background));justify-content:flex-start}[data-side=left]>.under.left{opacity:1}.under.right{background:color-mix(in oklab, #30a46c 25%, var(--lw-color-background));justify-content:flex-end}[data-side=right]>.under.right{opacity:1}[data-ready]>.under.left{color:#fff;background:#3b82f6}[data-ready]>.under.right{color:#fff;background:#30a46c}@media (prefers-reduced-motion:no-preference){.under{transition:background-color .15s ease-out}}.face-of-row{background:var(--lw-color-background);gap:.875rem;padding:1rem 1.25rem 1rem 1.5rem;display:flex;position:relative}@media (prefers-reduced-motion:no-preference){.face-of-row{transition:translate .25s cubic-bezier(.23,1,.32,1)}.row[data-side]>.face-of-row{transition:none}}.dot{background:var(--lw-color-foreground);opacity:0;border-radius:50%;width:.375rem;height:.375rem;position:absolute;top:1.75rem;left:.5rem}[data-unread] .dot{opacity:1}.avatar{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));width:2.5rem;height:2.5rem;font-size:var(--lw-text-xs);border-radius:50%;flex:none;place-items:center;font-weight:600;display:grid}.avatar.tile{background:var(--_mark);font-size:var(--lw-text-md);color:#fff;border-radius:.75rem}.content{flex:1;min-width:0}.top{align-items:baseline;gap:.5rem;display:flex}.from{font-size:var(--lw-text-md);font-weight:500}.row:not([data-unread]) .from{font-weight:400}.count{color:var(--_muted)}.time{color:var(--_muted);margin-left:auto}.subject,.preview{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.subject{font-size:var(--lw-text-md);margin-top:.375rem}.preview{color:var(--_muted);margin-top:.375rem}.attachment{border:1px solid var(--_line);border-radius:var(--lw-radius-md);align-items:center;gap:.375rem;margin-top:.625rem;padding:.25rem .625rem;display:inline-flex}.actions{border:1px solid var(--_line);border-radius:var(--lw-radius-md);background:var(--lw-color-background);opacity:0;gap:.25rem;padding:.25rem;display:flex;position:absolute;top:.75rem;right:.75rem}.row:hover .actions,.row:focus-within .actions{opacity:1}.actions button{border-radius:var(--lw-radius-sm);width:1.75rem;height:1.75rem;color:var(--_muted);cursor:pointer;background:0 0;border:0;place-items:center;padding:0;display:grid}.actions button:hover{color:var(--lw-color-foreground)}.toast{border-radius:var(--lw-radius-lg);background:var(--lw-color-foreground);color:var(--lw-color-background);align-items:center;gap:1rem;margin:.75rem;padding:.625rem .75rem .625rem 1rem;display:flex}@media (prefers-reduced-motion:no-preference){.toast{animation:.25s ease-out toast-in}}.toast[hidden]{display:none}@keyframes toast-in{0%{opacity:0;translate:0 .5rem}}.toast-text{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.undo{border-radius:var(--lw-radius-sm);cursor:pointer;background:0 0;border:0;padding:.25rem .5rem;font-weight:600}", d = "<rect width=\"20\" height=\"5\" x=\"2\" y=\"3\" rx=\"1\"/><path d=\"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4\"/>", f = .3, p = 4e3, m = [
	{
		id: 1,
		from: "LowerSoft Billing",
		mark: "#635bff",
		subject: "Your October invoice is ready",
		preview: "$480.00 was charged to the card ending 4421 on Oct 1. The PDF is attached.",
		time: "9:41",
		unread: !0,
		attachment: "invoice-oct-2026.pdf"
	},
	{
		id: 2,
		from: "Lena Hoffmann",
		subject: "Re: Profiler v2 copy",
		preview: "Left two notes on the second screen, the rest reads well. Ship it when you are happy.",
		time: "9:12",
		unread: !0,
		count: 3
	},
	{
		id: 3,
		from: "CI",
		mark: "#30a46c",
		subject: "Nightly build passed on 6 targets",
		preview: "x86_64, aarch64 and riscv64 on Linux and macOS. Binary 1.4 MB, cold start 9 ms.",
		time: "Tue"
	},
	{
		id: 4,
		from: "Marco Bellini",
		subject: "Crash in the symbol cache",
		preview: "Repro attached: fill the disk to the last few MB, then open any trace.",
		time: "Mon",
		count: 5
	}
], h = class extends e {
	static styles = [r, u];
	static props = { messages: {
		type: Object,
		default: m
	} };
	#e = [];
	#t = null;
	#n = null;
	render() {
		return "<header class=\"head\"><h2 class=\"title\">Inbox</h2><span class=\"unread\"></span></header><ul class=\"list\" aria-label=\"Messages\"></ul>\n<div class=\"toast\" role=\"status\" hidden><span class=\"toast-text\"></span><button class=\"undo\" type=\"button\">Undo</button></div>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".list");
		t.addEventListener("click", (e) => {
			let t = e.target.closest("[data-action]");
			if (!t) return;
			let n = Number(t.closest(".row").dataset.id);
			t.dataset.action === "archive" ? this.#c(n) : this.#s(n);
		}, e), t.addEventListener("keydown", (e) => {
			let t = e.target.closest(".row");
			if (!t || e.target !== t) return;
			let n = e.key.toLowerCase();
			n === "e" ? this.#c(Number(t.dataset.id)) : n === "u" ? this.#s(Number(t.dataset.id)) : (e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), (e.key === "ArrowDown" ? t.nextElementSibling : t.previousElementSibling)?.focus());
		}, e), this.#o(t, e), this.query(".undo").addEventListener("click", () => this.#l(), e), this.signal.addEventListener("abort", () => clearTimeout(this.#n?.timer));
	}
	updated(e) {
		e.has("messages") && (this.#e = this.messages.map((e) => ({ ...e })), this.#r());
	}
	#r() {
		this.query(".list").innerHTML = this.#e.map((e) => this.#i(e)).join(""), this.#a();
	}
	#i(e) {
		let t = e.mark ? `<span class="avatar tile" style="--_mark: ${n(e.mark)}">${n(e.from.charAt(0))}</span>` : `<span class="avatar" style="--_hue: ${s(e.from)}">${n(o(e.from))}</span>`;
		return `<li class="row" tabindex="0" data-id="${e.id}"${e.unread ? " data-unread" : ""} aria-label="${n(`${e.unread ? "Unread, " : ""}${e.from}: ${e.subject}`)}">
<span class="under left" aria-hidden="true">${i(c, 18)}<span class="under-text"></span></span><span class="under right" aria-hidden="true"><span>Archive</span>${i(d, 18)}</span>
<div class="face-of-row"><span class="dot" aria-hidden="true"></span>${t}<div class="content"><p class="top"><b class="from">${n(e.from)}</b>${e.count ? `<span class="count">${e.count}</span>` : ""}<time class="time">${n(e.time)}</time></p><p class="subject">${n(e.subject)}</p><p class="preview">${n(e.preview)}</p>${e.attachment ? `<span class="attachment">${i(l, 14)}${n(e.attachment)}</span>` : ""}</div>
<span class="actions"><button type="button" data-action="read" aria-label="${e.unread ? "Mark read" : "Mark unread"}" tabindex="-1">${i(c, 16)}</button><button type="button" data-action="archive" aria-label="Archive" tabindex="-1">${i(d, 16)}</button></span></div></li>`;
	}
	#a() {
		let e = this.#e.filter((e) => e.unread).length;
		this.query(".unread").textContent = e ? `${e} unread` : "All read";
	}
	#o(e, t) {
		e.addEventListener("pointerdown", (e) => {
			let t = e.target.closest(".row");
			t && e.button === 0 && !e.target.closest("button") && (this.#t = {
				row: t,
				x: e.clientX,
				y: e.clientY,
				dx: 0,
				axis: null,
				id: e.pointerId
			});
		}, t), e.addEventListener("pointermove", (e) => {
			let t = this.#t;
			if (!t) return;
			let n = e.clientX - t.x;
			if (!t.axis && Math.hypot(n, e.clientY - t.y) > 6 && (t.axis = Math.abs(n) > Math.abs(e.clientY - t.y) ? "x" : "y", t.axis === "x" && t.row.setPointerCapture(t.id)), t.axis !== "x") return;
			t.dx = n;
			let r = t.row.offsetWidth, i = t.row.hasAttribute("data-unread");
			t.row.querySelector(".face-of-row").style.translate = `${n}px 0`, t.row.dataset.side = n > 0 ? "left" : "right", t.row.toggleAttribute("data-ready", Math.abs(n) > r * f), t.row.querySelector(".under-text").textContent = i ? "Read" : "Unread";
		}, t);
		let n = () => {
			let e = this.#t;
			if (this.#t = null, !e || e.axis !== "x") return;
			let { row: t, dx: n } = e, r = Number(t.dataset.id), i = Math.abs(n) > t.offsetWidth * f, a = t.querySelector(".face-of-row");
			if (i && n < 0) return this.#c(r, n);
			a.style.translate = "", delete t.dataset.side, t.removeAttribute("data-ready"), i && this.#s(r);
		};
		e.addEventListener("pointerup", n, t), e.addEventListener("pointercancel", n, t);
	}
	#s(e) {
		let t = this.#e.find((t) => t.id === e);
		if (!t) return;
		t.unread = !t.unread;
		let n = this.query(`.row[data-id="${e}"]`);
		n.outerHTML = this.#i(t), this.query(`.row[data-id="${e}"]`).focus(), this.#a(), this.emit("read", {
			id: e,
			unread: t.unread
		});
	}
	async #c(e, t = 0) {
		let n = this.#e.findIndex((t) => t.id === e);
		if (n < 0) return;
		let r = this.query(`.row[data-id="${e}"]`), i = r.nextElementSibling ?? r.previousElementSibling;
		a.matches || (await r.querySelector(".face-of-row").animate({ translate: [`${t}px 0`, `${-r.offsetWidth}px 0`] }, {
			duration: 200,
			easing: "ease-in",
			fill: "forwards"
		}).finished, await r.animate({
			height: [`${r.offsetHeight}px`, "0px"],
			opacity: [1, 0]
		}, {
			duration: 200,
			easing: "ease-out"
		}).finished), clearTimeout(this.#n?.timer);
		let [o] = this.#e.splice(n, 1);
		r.remove(), i?.focus(), this.#a();
		let s = this.query(".toast");
		s.hidden = !1, this.query(".toast-text").textContent = `Archived “${o.subject}”`, this.#n = {
			message: o,
			index: n,
			timer: setTimeout(() => s.hidden = !0, p)
		}, this.emit("archive", { id: e });
	}
	#l() {
		this.#n &&= (clearTimeout(this.#n.timer), this.#e.splice(this.#n.index, 0, this.#n.message), this.#r(), this.query(`.row[data-id="${this.#n.message.id}"]`)?.focus(), this.query(".toast").hidden = !0, null);
	}
};
//#endregion
//#region src/components/swipe-actions-list/index.js
t("swipe-actions-list", h);
//#endregion
export { h as t };
