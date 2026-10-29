import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { n as a, t as o } from "./highlight-BSyGT8bg.js";
import { n as s, t as c } from "./people-C_zYMoEl.js";
import { Ct as l, J as u, a as d, pt as f, y as p } from "./lucide-BVbUPHVq.js";
//#region src/components/slash-command-menu/slash-command-menu.scss?inline
var m = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:36rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:.5rem;display:block}h2,p{margin:0}button,input{font:inherit;color:inherit;outline:none}button:focus-visible,input:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.head{color:var(--_muted);align-items:center;gap:.625rem;padding:.5rem .75rem .875rem;display:flex}.channel{font-size:var(--lw-text-lg);color:var(--lw-color-foreground);flex:1;font-weight:500}.log{border:1px solid var(--_line);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));border-bottom:0;border-radius:1rem 1rem 0 0;flex-direction:column;justify-content:flex-end;gap:1rem;height:16rem;padding:1rem;display:flex;overflow-y:auto}.message{gap:.75rem;display:flex}@media (prefers-reduced-motion:no-preference){.message{animation:.25s ease-out rise}}.message.action .text{color:var(--_muted);font-style:italic}@keyframes rise{0%{opacity:0;translate:0 .375rem}}.avatar{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));border-radius:50%;flex:none;place-items:center;width:2rem;height:2rem;font-size:.625rem;font-weight:600;display:grid}.meta{align-items:baseline;gap:.5rem;display:flex}.meta b{font-size:var(--lw-text-md);font-weight:500}.meta time{color:var(--_muted)}.text{font-size:var(--lw-text-md);color:color-mix(in oklab, var(--lw-color-foreground) 82%, transparent);margin-top:.25rem;line-height:1.5}.composer{border:1px solid var(--_line);border-radius:0 0 1rem 1rem;align-items:center;gap:.5rem;padding:.5rem .5rem .5rem 1rem;display:flex;position:relative}.composer:focus-within{border-color:color-mix(in oklab, var(--lw-color-foreground) 30%, transparent)}.input{min-width:0;height:2.25rem;font-size:var(--lw-text-md);background:0 0;border:0;flex:1}.input:focus-visible{outline:none}.input::placeholder{color:var(--_muted)}.send{background:var(--lw-color-primary);width:2rem;height:2rem;color:var(--lw-color-primary-foreground);cursor:pointer;border:0;border-radius:50%;place-items:center;padding:0;display:grid}.send:disabled{background:color-mix(in oklab, var(--lw-color-foreground) 10%, transparent);color:var(--_muted);cursor:default}.menu{z-index:2;border:1px solid var(--_line);border-radius:var(--lw-radius-lg);background:var(--lw-color-background);box-shadow:var(--lw-shadow-md);padding:.25rem;position:absolute;bottom:calc(100% + .375rem);left:.5rem;right:.5rem}@media (prefers-reduced-motion:no-preference){.menu{animation:.18s ease-out rise}}.menu[hidden]{display:none}.commands{position:relative}.highlight{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.highlight{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.highlight.visible{opacity:1}.command{border-radius:var(--lw-radius-md);cursor:pointer;align-items:center;gap:.625rem;padding:.5rem .625rem;display:flex;position:relative}.command>svg{color:var(--_muted);flex:none}.command-name{font-family:var(--lw-font-mono);font-weight:500}.command-hint{color:var(--_muted)}.command-about{text-overflow:ellipsis;white-space:nowrap;color:var(--_muted);margin-left:auto;overflow:hidden}", h = [
	{
		name: "assign",
		icon: l,
		hint: "@person",
		about: "Hand the thread to someone",
		post: (e) => `assigned this to ${e || "nobody yet"}`
	},
	{
		name: "remind",
		icon: p,
		hint: "what, when",
		about: "Remind the channel later",
		post: (e) => `set a reminder: “${e || "check back"}”`
	},
	{
		name: "poll",
		icon: "<path d=\"M3 3v16a2 2 0 0 0 2 2h16\"/><path d=\"M18 17V9M13 17V5M8 17v-3\"/>",
		hint: "question",
		about: "Ask the channel to vote",
		post: (e) => `started a poll: “${e || "Yes or no?"}”`
	},
	{
		name: "build",
		icon: f,
		hint: "branch",
		about: "Start a build and post the result",
		post: (e) => `started a build of ${e || "main"}`
	},
	{
		name: "shrug",
		icon: u,
		hint: "message",
		about: "Append ¯\\_(ツ)_/¯",
		post: (e) => `${e} ¯\\_(ツ)_/¯`.trim(),
		plain: !0
	}
], g = [
	{
		who: "Maya Chen",
		time: "9:41",
		text: "New flame graph colours are up for review. Labels still need a pass."
	},
	{
		who: "Leo Martins",
		time: "9:44",
		text: "Looks great. Who is taking the labels?"
	},
	{
		who: "Ana Silva",
		time: "9:52",
		text: "Not me this week, I am on call. Remind Maya?"
	}
], _ = () => new Intl.DateTimeFormat("en-US", {
	hour: "numeric",
	minute: "2-digit",
	hour12: !1
}).format(/* @__PURE__ */ new Date()), v = class extends e {
	static styles = [r, m];
	static props = {
		channel: { default: "runtime" },
		members: {
			type: Number,
			default: 4
		},
		you: { default: "Sam Okafor" },
		messages: {
			type: Object,
			default: g
		}
	};
	#e = 0;
	#t = [];
	render() {
		return `<header class="head">${i(u, 20)}<h2 class="channel"></h2><span class="members"></span></header>
<div class="log" role="log" aria-live="polite"></div>
<form class="composer"><div class="menu" id="commands" role="listbox" aria-label="Commands" hidden><span class="highlight"></span><div class="commands"></div></div><input class="input" type="text" role="combobox" aria-controls="commands" aria-expanded="false" aria-autocomplete="list" autocomplete="off" spellcheck="false"><button class="send" type="submit" aria-label="Send" disabled>${i(d, 16)}</button></form>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".input");
		t.addEventListener("input", () => {
			this.#e = 0, this.#i();
		}, e), t.addEventListener("keydown", (e) => this.#c(e), e), t.addEventListener("blur", () => setTimeout(() => this.#o(), 120), e), this.query(".composer").addEventListener("submit", (e) => {
			e.preventDefault(), this.#l();
		}, e), this.query(".commands").addEventListener("pointerdown", (e) => {
			let t = e.target.closest(".command");
			t && (e.preventDefault(), this.#s(Number(t.dataset.index)));
		}, e);
	}
	updated(e) {
		if (this.query(".channel").textContent = `#${this.channel}`, this.query(".members").textContent = `${this.members} members`, this.query(".input").placeholder = `Message #${this.channel}, or type / for commands`, e.has("messages")) {
			this.query(".log").replaceChildren();
			for (let e of this.messages) this.#n(e, !1);
		}
	}
	#n(e, t = !0) {
		let r = this.query(".log");
		r.insertAdjacentHTML("beforeend", `<article class="message${e.action ? " action" : ""}"><span class="avatar" style="--_hue: ${c(e.who)}">${n(s(e.who))}</span><div><p class="meta"><b>${n(e.who)}</b><time>${n(e.time)}</time></p><p class="text">${n(e.text)}</p></div></article>`), t && r.lastElementChild.scrollIntoView({ block: "nearest" });
	}
	get #r() {
		let e = this.query(".input").value.match(/^\/(\w*)(?:\s+(.*))?$/s);
		return e ? {
			name: e[1].toLowerCase(),
			args: (e[2] ?? "").trim(),
			complete: /\s/.test(this.query(".input").value)
		} : null;
	}
	#i() {
		let e = this.#r, t = this.query(".input");
		this.query(".send").disabled = !t.value.trim(), this.#t = e && !e.complete ? h.filter((t) => t.name.startsWith(e.name)) : [];
		let r = this.query(".menu");
		r.hidden = !this.#t.length, t.ariaExpanded = String(!r.hidden), this.query(".commands").innerHTML = this.#t.map((e, t) => `<div class="command" role="option" id="command-${t}" data-index="${t}">${i(e.icon, 16)}<span class="command-name">/${e.name}</span><span class="command-hint">${n(e.hint)}</span><span class="command-about">${n(e.about)}</span></div>`).join(""), this.#a();
	}
	#a() {
		let e = [...this.shadowRoot.querySelectorAll(".command")];
		this.#e = Math.min(this.#e, Math.max(0, e.length - 1)), e.forEach((e, t) => e.ariaSelected = String(t === this.#e));
		let t = e[this.#e], n = this.query(".input");
		t ? (a(this.query(".highlight"), t), n.setAttribute("aria-activedescendant", t.id)) : (o(this.query(".highlight")), n.removeAttribute("aria-activedescendant"));
	}
	#o() {
		this.#t = [], this.query(".menu").hidden = !0, this.query(".input").ariaExpanded = "false";
	}
	#s(e) {
		let t = this.#t[e];
		if (!t) return;
		let n = this.query(".input");
		n.value = `/${t.name} `, n.focus(), this.#o(), this.query(".send").disabled = !1;
	}
	#c(e) {
		let t = this.#t.length > 0, n = {
			ArrowDown: 1,
			ArrowUp: -1
		}[e.key];
		t && n ? (e.preventDefault(), this.#e = (this.#e + n + this.#t.length) % this.#t.length, this.#a()) : t && (e.key === "Tab" || e.key === "Enter") ? (e.preventDefault(), this.#s(this.#e)) : t && e.key === "Escape" && (e.preventDefault(), this.#o());
	}
	#l() {
		let e = this.query(".input"), t = e.value.trim();
		if (!t) return;
		let n = this.#r, r = n && h.find((e) => e.name === n.name);
		r ? this.#n({
			who: this.you,
			time: _(),
			text: r.post(n.args),
			action: !r.plain
		}) : this.#n({
			who: this.you,
			time: _(),
			text: t
		}), this.emit("send", {
			text: t,
			command: r?.name,
			args: n?.args
		}), e.value = "", this.#i();
	}
};
//#endregion
//#region src/components/slash-command-menu/index.js
t("slash-command-menu", v);
//#endregion
export { v as t };
