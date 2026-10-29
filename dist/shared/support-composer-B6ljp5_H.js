import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { t as a } from "./platform-CKi8k97Y.js";
import { i as o } from "./menu-BCEGADW6.js";
import { n as s } from "./swap-BK53XQML.js";
import { Dt as c, E as l, a as u, et as d, o as f } from "./lucide-BVbUPHVq.js";
import { n as p } from "./testimonial-Cc4crTCQ.js";
import { n as m, t as h } from "./picker-CFtn-7gY.js";
//#region src/components/support-composer/support-composer.scss?inline
var g = ".picker-trigger{border-radius:var(--lw-radius-md);font:inherit;color:var(--lw-color-foreground);cursor:pointer;background:0 0;border:0;outline:none;align-items:center;gap:.375rem;padding:.375rem .5rem;display:inline-flex}.picker-trigger:hover,.picker-trigger[aria-expanded=true]{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent)}.picker-trigger:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.picker-trigger>svg{color:var(--lw-color-muted-foreground);flex:none}.picker-label{color:var(--lw-color-muted-foreground)}:host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:30rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));font-size:var(--lw-text-sm);border:0;border-radius:1.5rem;padding:.5rem;display:block}p,h3,ul{margin:0}a,button{font:inherit;color:inherit;outline:none}a:focus-visible,button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.head{align-items:center;gap:.625rem;padding:.375rem .5rem .75rem;display:flex}.faces{display:flex}.face{width:1.5rem;height:1.5rem;box-shadow:0 0 0 2px var(--lw-color-background);border-radius:50%;overflow:hidden}.face+.face{margin-left:-.375rem}.face svg{width:100%;height:100%;display:block}.who{min-width:0;color:var(--_muted);flex:1}.who b{color:var(--lw-color-foreground);font-weight:500}.status{font-size:var(--lw-text-xs);color:var(--_muted);align-items:center;gap:.375rem;text-decoration:none;display:inline-flex}.status:hover{color:var(--lw-color-foreground)}.dot{background:var(--lw-color-accent);border-radius:50%;width:.375rem;height:.375rem}.box{border:1px solid var(--_line);background:var(--lw-color-background);border-radius:1.125rem}@media (prefers-reduced-motion:no-preference){.box{transition:border-color .15s ease-out,box-shadow .15s ease-out}}.box:focus-within{border-color:color-mix(in oklab, var(--lw-color-foreground) 30%, transparent)}.box[data-drop]{border-style:dashed;border-color:var(--lw-color-foreground)}.subject,.message{box-sizing:border-box;width:100%;font:var(--lw-text-md) var(--lw-font-sans);color:var(--lw-color-foreground);background:0 0;border:0;outline:none;display:block}.subject::placeholder,.message::placeholder{color:var(--_muted)}.subject{padding:1rem 1rem .375rem}.message{resize:none;field-sizing:content;min-height:4.5rem;padding:.375rem 1rem;line-height:1.5}.files{flex-wrap:wrap;gap:.375rem;padding:0 1rem;list-style:none;display:flex}.files:empty{display:none}.attached{border:1px solid var(--_line);border-radius:var(--lw-radius-md);font-size:var(--lw-text-xs);align-items:center;gap:.25rem;padding:.125rem .25rem .125rem .5rem;display:inline-flex}.file-name{text-overflow:ellipsis;white-space:nowrap;max-width:10rem;overflow:hidden}.remove{border-radius:var(--lw-radius-sm);color:var(--_muted);cursor:pointer;background:0 0;border:0;place-items:center;padding:.125rem;display:grid}.tools{align-items:center;gap:.25rem;padding:.5rem;display:flex}.attach{border-radius:var(--lw-radius-md);cursor:pointer;align-items:center;gap:.375rem;padding:.375rem .5rem;display:inline-flex}.attach:hover{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent)}.attach:focus-within{outline:2px solid var(--lw-color-ring);outline-offset:2px}.attach input{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.send{background:var(--lw-color-primary);width:2.25rem;height:2.25rem;color:var(--lw-color-primary-foreground);cursor:pointer;border:0;border-radius:50%;place-items:center;margin-left:auto;padding:0;display:grid}@media (prefers-reduced-motion:no-preference){.send{transition:opacity .15s ease-out}}.send:disabled{background:color-mix(in oklab, var(--lw-color-foreground) 10%, transparent);color:var(--_muted);cursor:default}.articles{padding:.75rem .5rem 0}.articles[hidden]{display:none}.articles-head{justify-content:space-between;align-items:center;padding:0 .5rem .25rem;display:flex}.articles-title{font-size:var(--lw-text-xs);color:var(--_muted);font-weight:400}.hide{border-radius:var(--lw-radius-sm);color:var(--_muted);cursor:pointer;background:0 0;border:0;place-items:center;padding:.25rem;display:grid}.article-list{padding:0;list-style:none}.article{border-radius:var(--lw-radius-md);align-items:center;gap:.625rem;padding:.5rem;text-decoration:none;display:flex}@media (prefers-reduced-motion:no-preference){.article{animation:.25s ease-out rise}}.article svg{color:var(--_muted);flex:none}.article:hover{background:color-mix(in oklab, var(--lw-color-foreground) 5%, transparent)}@keyframes rise{0%{opacity:0;translate:0 .25rem}}.article-title{flex:1;min-width:0}.article-time{font-size:var(--lw-text-xs);color:var(--_muted)}.hint,.sent{font-size:var(--lw-text-xs);color:var(--_muted);padding:.75rem 1rem .5rem}.sent{color:var(--lw-color-foreground)}", _ = [
	{
		value: "bug",
		label: "Bug"
	},
	{
		value: "build",
		label: "Build or toolchain"
	},
	{
		value: "billing",
		label: "Billing"
	},
	{
		value: "question",
		label: "Question"
	}
], v = [
	{
		title: "Read a crash report",
		minutes: 2,
		href: "#"
	},
	{
		title: "Symbolicate a stack trace",
		minutes: 3,
		href: "#"
	},
	{
		title: "Cross-compile for ARM",
		minutes: 4,
		href: "#"
	},
	{
		title: "Download invoices",
		minutes: 1,
		href: "#"
	},
	{
		title: "Invite teammates to a workspace",
		minutes: 2,
		href: "#"
	}
], y = [
	"Ana Moreno",
	"Jules Laurent",
	"Sam Okafor"
], b = 3, x = (e) => e.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [], S = class extends e {
	static styles = [
		r,
		o,
		s,
		g
	];
	static props = {
		team: {
			type: Object,
			default: y
		},
		reply: { default: "Usually replies in 2h" },
		status: { default: "All systems normal" },
		statusHref: { default: "#" },
		topic: { default: "bug" },
		articles: {
			type: Object,
			default: v
		}
	};
	#e = [];
	#t;
	render() {
		let e = a ? "⌘" : "Ctrl";
		return `<header class="head"><span class="faces"></span><p class="who"><b>Support</b> · <span class="reply"></span></p><a class="status"><span class="dot"></span><span class="status-text"></span>${i(f, 13)}</a></header>
<form class="box" novalidate><input class="subject" type="text" placeholder="Subject" aria-label="Subject" autocomplete="off"><textarea class="message" rows="3" placeholder="What happened, and what did you expect instead?" aria-label="Message"></textarea>
<ul class="files"></ul><div class="tools">${m("topic-menu", { label: "Topic" })}<label class="attach">${i(d, 16)}<span>Attach</span><input class="file" type="file" accept="image/*,.txt,.log" multiple></label><button class="send" type="submit" aria-label="Send" disabled>${i(u, 18)}</button></div></form>
<section class="articles" aria-labelledby="articles-title"><header class="articles-head"><h3 class="articles-title" id="articles-title"></h3><button class="hide" type="button" aria-label="Hide articles">${i(c, 15)}</button></header><ul class="article-list"></ul></section>
<p class="hint">${e}+↵ to send · Paste or drop screenshots</p><p class="sent" role="status" hidden></p>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.#t = h(this.query(".picker"), this.signal, (e) => this.topic = e);
		let t = this.query(".box");
		t.addEventListener("input", () => this.#n(), e), t.addEventListener("submit", (e) => {
			e.preventDefault(), this.#a();
		}, e), t.addEventListener("keydown", (e) => {
			e.key === "Enter" && (a ? e.metaKey : e.ctrlKey) && (e.preventDefault(), this.#a());
		}, e), this.query(".file").addEventListener("change", (e) => {
			this.#r([...e.target.files]), e.target.value = "";
		}, e), t.addEventListener("paste", (e) => {
			let t = [...e.clipboardData?.files ?? []];
			t.length && (e.preventDefault(), this.#r(t));
		}, e), t.addEventListener("dragover", (e) => {
			e.preventDefault(), t.toggleAttribute("data-drop", !0);
		}, e), t.addEventListener("dragleave", () => t.removeAttribute("data-drop"), e), t.addEventListener("drop", (e) => {
			e.preventDefault(), t.removeAttribute("data-drop"), this.#r([...e.dataTransfer?.files ?? []]);
		}, e), this.query(".files").addEventListener("click", (e) => {
			let t = e.target.closest(".remove");
			t && (this.#e.splice(Number(t.dataset.index), 1), this.#i());
		}, e), this.query(".hide").addEventListener("click", () => this.query(".articles").hidden = !0, e);
	}
	updated(e) {
		if (e.has("team")) {
			let e = this.query(".faces");
			e.replaceChildren();
			for (let t of this.team ?? []) {
				let n = Object.assign(document.createElement("span"), { className: "face" });
				p(n, t), e.append(n);
			}
		}
		this.query(".reply").textContent = this.reply ?? "", this.query(".status-text").textContent = this.status ?? "", this.query(".status").href = this.statusHref ?? "#", this.#t?.set(_, this.topic), this.#n();
	}
	#n() {
		let e = this.query(".subject").value.trim(), t = this.query(".message").value.trim();
		this.query(".send").disabled = !e || !t;
		let r = x(e), a = (this.articles ?? []).map((e) => ({
			article: e,
			score: x(e.title).filter((e) => r.some((t) => e.startsWith(t) || t.startsWith(e))).length
		})), o = a.filter((e) => e.score).sort((e, t) => t.score - e.score), s = (o.length ? o : a).slice(0, b).map((e) => e.article);
		this.query(".articles-title").textContent = o.length ? "These might help" : "Popular articles", this.query(".article-list").innerHTML = s.map((e) => `<li><a class="article" href="${n(e.href ?? "#")}">${i(l, 15)}<span class="article-title">${n(e.title)}</span><span class="article-time">${e.minutes} min</span></a></li>`).join("");
	}
	#r(e) {
		this.#e.push(...e.filter((e) => e.size)), this.#i();
	}
	#i() {
		this.query(".files").innerHTML = this.#e.map((e, t) => `<li class="attached"><span class="file-name">${n(e.name || "Pasted image")}</span><button class="remove" type="button" data-index="${t}" aria-label="Remove ${n(e.name || "pasted image")}">${i(c, 13)}</button></li>`).join("");
	}
	async #a() {
		let e = this.query(".subject").value.trim(), t = this.query(".message").value.trim();
		if (!e || !t) return;
		let n = {
			subject: e,
			message: t,
			topic: this.topic,
			files: [...this.#e]
		}, r = this.query(".send");
		r.disabled = !0, r.setAttribute("aria-busy", "true");
		try {
			await this.send?.(n);
		} catch {
			r.disabled = !1;
			return;
		} finally {
			r.removeAttribute("aria-busy");
		}
		this.query(".box").reset(), this.#e = [], this.#i(), this.#n();
		let i = this.query(".sent");
		i.hidden = !1, i.textContent = `Sent “${e}”. We'll reply by email; ${this.reply?.toLowerCase() ?? ""}.`, this.emit("send", n);
	}
};
//#endregion
//#region src/components/support-composer/index.js
t("support-composer", S);
//#endregion
export { S as t };
