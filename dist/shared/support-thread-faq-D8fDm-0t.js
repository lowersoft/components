import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { n as a, t as o } from "./people-C_zYMoEl.js";
import { a as s, ot as c } from "./lucide-BVbUPHVq.js";
//#region src/components/support-thread-faq/support-thread-faq.scss?inline
var l = ":host{--_ink:var(--lw-color-foreground);--_muted:var(--lw-color-muted-foreground);--_line:var(--lw-color-border);--_surface:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));--_bubble:color-mix(in oklab, var(--lw-color-foreground) 7%, var(--lw-color-background));--_ease:cubic-bezier(.23, 1, .32, 1);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:26rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:.75rem;display:block}p{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.head{align-items:center;gap:.75rem;padding:.5rem .5rem .75rem;display:flex}.avatar{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));border-radius:50%;flex:none;place-items:center;font-weight:600;display:grid;position:relative}.avatar.large{width:2.5rem;height:2.5rem;font-size:var(--lw-text-sm)}.avatar.small{align-self:flex-end;width:1.75rem;height:1.75rem;font-size:.625rem}.online{border:2px solid var(--lw-color-background);background:var(--lw-color-accent);border-radius:50%;width:.75rem;height:.75rem;position:absolute;bottom:-1px;right:-1px}.who{flex:1;min-width:0}.name{font-size:var(--lw-text-md);font-weight:600}.reply{color:var(--_muted)}.reset{width:2.25rem;height:2.25rem;color:var(--_muted);cursor:pointer;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:grid}@media (prefers-reduced-motion:no-preference){.reset{transition:color .15s ease-out, rotate .4s var(--_ease)}}.reset:hover{color:var(--_ink)}.reset:active{rotate:-90deg}.thread{border:1px solid var(--_line);background:var(--_surface);overscroll-behavior:contain;scrollbar-width:none;border-radius:1.125rem;flex-direction:column;gap:1rem;height:26rem;padding:1.5rem .75rem .75rem;display:flex;overflow:hidden auto;-webkit-mask-image:linear-gradient(#0000,#000 1.5rem);mask-image:linear-gradient(#0000,#000 1.5rem)}.log{flex-direction:column;gap:1rem;margin-top:auto;display:flex}.group{gap:.5rem;display:flex}.group.you{justify-content:flex-end}.bubbles{flex-direction:column;gap:.375rem;max-width:85%;display:flex}.you>.bubbles{align-items:flex-end}.bubble{background:var(--_bubble);font-size:var(--lw-text-md);text-wrap:pretty;border-radius:1.125rem;padding:.625rem .875rem;line-height:1.45}@media (prefers-reduced-motion:no-preference){.bubble{animation:bubble-in .3s var(--_ease)}}.you .bubble{background:var(--lw-color-primary);color:var(--lw-color-primary-foreground);border-radius:1.25rem}@keyframes bubble-in{0%{opacity:0;translate:0 .5rem;scale:.96}}.seen{font-size:var(--lw-text-xs);color:var(--_muted)}@media (prefers-reduced-motion:no-preference){.seen{animation:.2s ease-out bubble-in}}.typing{gap:.25rem;padding-block:.875rem;display:flex}.dot{background:var(--_muted);opacity:.4;border-radius:50%;width:.375rem;height:.375rem}@media (prefers-reduced-motion:no-preference){.dot{animation:1s ease-in-out infinite dot}}.dot:nth-child(2){animation-delay:.15s}.dot:nth-child(3){animation-delay:.3s}@keyframes dot{30%{opacity:1;translate:0 -2px}}.suggestions{flex-direction:column;align-items:flex-end;gap:.5rem;display:flex}.suggestions:empty{display:none}.chip{border:1px solid var(--_line);border-radius:var(--lw-radius-full);font-size:var(--lw-text-md);text-align:right;color:var(--_muted);cursor:pointer;background:0 0;padding:.5rem .875rem}@media (prefers-reduced-motion:no-preference){.chip{animation:bubble-in .3s var(--_ease) backwards;transition:color .15s ease-out,border-color .15s ease-out,opacity .2s ease-out}}.chip:hover:not(:disabled){border-color:color-mix(in oklab, var(--_ink) 30%, transparent);color:var(--_ink)}.chip:disabled{cursor:default;opacity:.4}.composer{border:1px solid var(--_line);border-radius:var(--lw-radius-full);align-items:center;gap:.5rem;margin-top:.75rem;padding:.25rem .25rem .25rem 1rem;display:flex}.composer:focus-within{border-color:color-mix(in oklab, var(--_ink) 30%, transparent)}.input{min-width:0;font:var(--lw-text-md) var(--lw-font-sans);color:var(--_ink);background:0 0;border:0;outline:none;flex:1;padding:.5rem 0}.input::placeholder{color:var(--_muted)}.send{background:var(--lw-color-primary);width:2.25rem;height:2.25rem;color:var(--lw-color-primary-foreground);cursor:pointer;border:0;border-radius:50%;flex:none;place-items:center;padding:0;display:grid}@media (prefers-reduced-motion:no-preference){.send{transition:opacity .15s ease-out}}.send:disabled{cursor:default;opacity:.3}", u = 500, d = 12, f = 700, p = 1800, m = new Set("a an and are can do does for how i in is it me my of on or the there to what when where which who why will with you your".split(" ")), h = [
	{
		question: "Can I use it in client projects?",
		answer: "Yes, the license covers commercial work, including sites and apps you build for clients. You just can't resell the components as a kit."
	},
	{
		question: "Is there a free trial?",
		answer: "There is no trial, but every component has a live preview, and if it is not right for you, we refund within 14 days, no questions asked."
	},
	{
		question: "Do I get future updates?",
		answer: "Yes. Every component we add or improve is yours, for as long as the library exists. No renewals."
	},
	{
		question: "How do team seats work?",
		answer: "A team license covers up to ten people. Invite them from your account; anyone can be swapped out at any time."
	},
	{
		question: "Which frameworks are supported?",
		answer: "Any. The components are standard custom elements, so they work in plain HTML, React, Vue, Svelte and the rest."
	}
], g = (e) => new Set(e.toLowerCase().match(/[a-z0-9]+/g)?.filter((e) => !m.has(e)) ?? []), _ = class extends e {
	static styles = l;
	static props = {
		agent: { default: "Mia Kowalski" },
		company: { default: "Northwind" },
		reply: { default: "Typically replies in 2 min" },
		greeting: {},
		fallback: { default: "Good question, and not one I can answer from here. I'll write back by email within the hour." },
		items: {
			type: Object,
			default: h
		}
	};
	#e = /* @__PURE__ */ new Set();
	#t = /* @__PURE__ */ new Set();
	#n = !1;
	render() {
		return `<header class="head"><span class="avatar large"><span class="initials"></span><span class="online" title="Online"></span></span>
<div class="who"><p class="name"></p><p class="reply"></p></div><button class="reset" type="button" aria-label="Start over">${r(c, 18)}</button></header>
<div class="thread"><div class="log" role="log" aria-live="polite"></div><div class="suggestions" role="group" aria-label="Common questions"></div></div>
<form class="composer"><input class="input" type="text" placeholder="Ask your own question" aria-label="Your question" autocomplete="off"><button class="send" type="submit" aria-label="Send" disabled>${r(s, 16)}</button></form>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".suggestions").addEventListener("click", (e) => {
			let t = e.target.closest(".chip");
			t && this.#l(this.items[Number(t.dataset.index)].question);
		}, e);
		let t = this.query(".input");
		t.addEventListener("input", () => this.#s(), e), this.query(".composer").addEventListener("submit", (e) => {
			e.preventDefault();
			let n = t.value.trim();
			!n || this.#n || (t.value = "", this.#l(n));
		}, e), this.query(".reset").addEventListener("click", () => {
			this.#a(), this.emit("reset");
		}, e), this.signal.addEventListener("abort", () => this.#p());
	}
	updated(e) {
		this.query(".name").textContent = this.company ? `${this.#r} from ${this.company}` : this.agent ?? "", this.query(".reply").textContent = this.reply ?? "", this.query(".initials").textContent = a(this.agent ?? ""), this.style.setProperty("--_hue", o(this.agent ?? "")), [
			"items",
			"agent",
			"company",
			"greeting"
		].some((t) => e.has(t)) && this.#a();
	}
	get #r() {
		return (this.agent ?? "").split(/\s+/)[0];
	}
	get #i() {
		return this.greeting ?? `Hi, I'm ${this.#r}${this.company ? ` from ${this.company}` : ""}. These come up the most. Tap one, or ask your own.`;
	}
	#a() {
		this.#p(), this.#e.clear(), this.#n = !1, this.query(".log").replaceChildren(), this.#c("agent", this.#i), this.#o(), this.#s();
	}
	#o() {
		this.query(".suggestions").innerHTML = (this.items ?? []).map((e, t) => this.#e.has(t) ? "" : `<button class="chip" type="button" data-index="${t}"${this.#n ? " disabled" : ""}>${n(e.question)}</button>`).join("");
	}
	#s() {
		this.query(".send").disabled = this.#n || !this.query(".input").value.trim();
	}
	#c(e, t) {
		let r = this.query(".log"), i = r.lastElementChild;
		i?.dataset.from !== e && (i = Object.assign(document.createElement("div"), { className: `group ${e}` }), i.dataset.from = e, i.innerHTML = e === "agent" ? `<span class="avatar small" aria-hidden="true">${n(a(this.agent ?? ""))}</span><div class="bubbles"></div>` : "<div class=\"bubbles\"></div>", r.append(i));
		let o = Object.assign(document.createElement("p"), {
			className: "bubble",
			textContent: t
		});
		return i.querySelector(".bubbles").append(o), this.#d(), o;
	}
	#l(e) {
		let t = this.items.findIndex((t) => t.question === e), r = t >= 0 ? this.items[t] : this.#u(e);
		t >= 0 && this.#e.add(t), this.#n = !0, this.shadowRoot.querySelector(".seen")?.remove();
		let a = this.#c("you", e);
		this.#o(), this.#s(), this.emit("ask", {
			question: e,
			item: r ?? null
		});
		let o = r?.answer ?? this.fallback ?? "", s = +!i.matches, c = Math.min(p, Math.max(f, o.length * d));
		this.#f(u * s, () => {
			a.insertAdjacentHTML("afterend", "<span class=\"seen\">Seen</span>"), this.#d();
		}), this.#f(850 * s, () => {
			let e = this.#c("agent", "");
			e.classList.add("typing"), e.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="visually-hidden">${n(this.#r)} is typing</span>`, this.#f(c * s, () => {
				e.classList.remove("typing"), e.textContent = o, this.#n = !1, this.#o(), this.#s(), this.#d();
			});
		});
	}
	#u(e) {
		let t = g(e), n = null, r = 1;
		for (let e of this.items ?? []) {
			let i = [...g(`${e.question} ${e.answer}`)].filter((e) => t.has(e)).length;
			i > r && ([n, r] = [e, i]);
		}
		return n;
	}
	#d() {
		let e = this.query(".thread");
		e.scrollTo({
			top: e.scrollHeight,
			behavior: i.matches ? "auto" : "smooth"
		});
	}
	#f(e, t) {
		let n = setTimeout(() => {
			this.#t.delete(n), t();
		}, e);
		this.#t.add(n);
	}
	#p() {
		for (let e of this.#t) clearTimeout(e);
		this.#t.clear();
	}
};
//#endregion
//#region src/components/support-thread-faq/index.js
t("support-thread-faq", _);
//#endregion
export { _ as t };
