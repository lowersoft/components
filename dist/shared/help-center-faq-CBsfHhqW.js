import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i, t as a } from "./highlight-BSyGT8bg.js";
import { _t as o, ct as s, m as c } from "./lucide-BVbUPHVq.js";
//#region src/components/help-center-faq/help-center-faq.scss?inline
var l = ":host{--_ink:var(--lw-color-foreground);--_muted:var(--lw-color-muted-foreground);--_line:var(--lw-color-border);--_surface:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:29rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:.5rem;display:block}p{margin:0}.search{color:var(--_muted);cursor:text;align-items:center;gap:.75rem;padding:.75rem .75rem 1rem;display:flex}.query{min-width:0;font:var(--lw-text-md) var(--lw-font-sans);color:var(--_ink);background:0 0;border:0;outline:none;flex:1;padding:0}.query::placeholder{color:var(--_muted)}.query::-webkit-search-cancel-button{display:none}.count{font-variant-numeric:tabular-nums;flex:none}.results{border:1px solid var(--_line);background:var(--_surface);overscroll-behavior:contain;border-radius:1rem;max-height:30rem;padding:.25rem .375rem .375rem;position:relative;overflow:hidden auto}.highlight{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.highlight{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.highlight.visible{opacity:1}.highlight{background:color-mix(in oklab, var(--_ink) 6%, transparent);border-radius:.75rem}.group[hidden]{display:none}.group+.group{margin-top:.25rem}.group-head{font-size:var(--lw-text-xs);color:var(--_muted);justify-content:space-between;padding:.75rem .625rem .5rem;display:flex}.row{border-radius:.75rem;position:relative}.row[hidden]{display:none}.row[data-open]{background:color-mix(in oklab, var(--_ink) 6%, transparent)}.row-head{width:100%;font:var(--lw-text-md) var(--lw-font-sans);text-align:left;color:var(--_muted);cursor:pointer;background:0 0;border:0;align-items:center;gap:.75rem;padding:.75rem .625rem;display:flex}.row-head svg{flex:none}@media (prefers-reduced-motion:no-preference){.row-head svg{transition:rotate .2s ease-out}}[aria-selected=true]>.row-head,[data-open]>.row-head{color:var(--_ink)}[data-open]>.row-head svg{rotate:90deg}mark{color:inherit;background:#f59e0b4d;background:lab(72.7914% 26.933 75.434/.3);border-radius:2px}.snippet{font-size:var(--lw-text-xs);text-overflow:ellipsis;white-space:nowrap;color:var(--_muted);padding:0 .625rem .75rem 2.375rem;overflow:hidden}.snippet[hidden]{display:none}.answer{gap:1rem;padding:0 .75rem 1rem 2.375rem;display:grid}.answer[hidden]{display:none}@media (prefers-reduced-motion:no-preference){.answer{animation:.25s cubic-bezier(.23,1,.32,1) answer-in}}@keyframes answer-in{0%{opacity:0;translate:0 -.25rem}}.answer-text{font-size:var(--lw-text-md);color:var(--_muted);line-height:1.6}.command{width:100%;min-width:0;font-size:var(--lw-text-xs);display:flex}.answer-foot{color:var(--_muted);justify-content:space-between;align-items:center;gap:1rem;display:flex}.useful{font:inherit;color:var(--_muted);cursor:pointer;background:0 0;border:0;outline:none;align-items:center;gap:.5rem;padding:0;display:inline-flex}.useful:hover,.useful[aria-pressed=true]{color:var(--_ink)}.useful[aria-pressed=true] svg{fill:currentColor}.useful:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.useful-count{font-variant-numeric:tabular-nums}.none{color:var(--_muted);justify-items:start;gap:.75rem;padding:1rem .625rem;display:grid}.none[hidden]{display:none}.none kbd{border:1px solid var(--_line);border-radius:var(--lw-radius-sm);font:.6875rem var(--lw-font-sans);padding:0 .3rem}", u = (e, t, n, r, i) => ({
	group: e,
	question: t,
	answer: n,
	useful: r,
	command: i
}), d = [
	u("Setup", "How do I add a component?", "Install the package once, then import the components you use. Each one registers its own element, so the ones you never import never ship.", 214, "npm install @lowersoft/lw"),
	u("Setup", "Does it work outside a framework?", "Yes. They are standard custom elements, so they work in plain HTML, React, Vue, Svelte or anything else that renders the DOM.", 132),
	u("Setup", "Can I change the theme?", "Every design token is a --lw-* custom property. Load the default theme, then override the tokens on :root or on one element and the components follow, light and dark.", 98, "import '@lowersoft/lw/themes.css';"),
	u("Licensing", "Is it free for commercial work?", "Yes. The library is MIT licensed: use it in client work and products, free of charge, with no seat limits.", 176),
	u("Licensing", "Do I need to credit the library?", "No. Keep the license file with the package; a link back is always welcome but never required.", 41),
	u("Accessibility", "Do the components work with a keyboard?", "Every control is reachable with Tab, and lists, menus and sliders follow the arrow keys. Focus is always visible and never trapped.", 87),
	u("Accessibility", "Do animations respect reduced motion?", "Yes. With reduced motion on, components skip their animations and show the end state, and endless effects stay still.", 64)
], f = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), p = (e, t) => {
	if (!t) return n(e);
	let r = "", i = 0;
	for (let a of e.matchAll(t)) r += `${n(e.slice(i, a.index))}<mark>${n(a[0])}</mark>`, i = a.index + a[0].length;
	return r + n(e.slice(i));
}, m = (e, t) => (t.lastIndex = 0, e.split(/(?<=[.!?])\s+/).find((e) => e.match(t)) ?? ""), h = class extends e {
	static styles = l;
	static props = {
		items: {
			type: Object,
			default: d
		},
		placeholder: { default: "Search questions" }
	};
	#e = 0;
	#t = -1;
	#n = /* @__PURE__ */ new Set();
	render() {
		return `<label class="search">${r(s, 18)}<input class="query" type="search" autocomplete="off" spellcheck="false" role="combobox" aria-controls="results" aria-expanded="true" aria-autocomplete="list"><span class="count" aria-live="polite"></span></label>
<div class="results" id="results" role="listbox" aria-label="Questions"><span class="highlight"></span><div class="groups"></div>
<div class="none" hidden><p class="none-text"></p><lw-button class="ask" size="sm">Ask the team</lw-button></div></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".query");
		t.addEventListener("input", () => {
			this.#e = 0, this.#t = -1, this.query(".ask").hidden = !1, this.#s();
		}, e), t.addEventListener("keydown", (e) => this.#p(e), e);
		let n = this.query(".groups");
		n.addEventListener("click", (e) => {
			let t = e.target.closest(".useful");
			if (t) return this.#d(Number(t.closest(".row").dataset.index));
			let n = e.target.closest(".row-head");
			n && this.#u(Number(n.closest(".row").dataset.index));
		}, e), n.addEventListener("pointermove", (e) => {
			let t = e.target.closest(".row");
			t && Number(t.dataset.index) !== this.#e && (this.#e = Number(t.dataset.index), this.#c());
		}, e), this.query(".ask").addEventListener("click", () => this.#f(), e);
	}
	updated(e) {
		this.query(".query").placeholder = this.placeholder ?? "", e.has("items") && this.#r();
	}
	#r() {
		let e = [...new Set(this.items.map((e) => e.group))];
		this.query(".groups").innerHTML = e.map((e) => `<section class="group" data-group="${n(e)}"><header class="group-head"><span>${n(e)}</span><span class="group-count"></span></header>${this.items.map((t, n) => t.group === e ? this.#i(t, n) : "").join("")}</section>`).join(""), this.#n.clear(), this.#s();
	}
	#i(e, t) {
		let i = e.command ? `<lw-copy-button class="command" value="${n(e.command)}" label="Copy the command"></lw-copy-button>` : "";
		return `<div class="row" role="option" id="faq-row-${t}" data-index="${t}" aria-selected="false">
<button class="row-head" type="button" tabindex="-1" aria-expanded="false" aria-controls="faq-answer-${t}">${r(c, 16)}<span class="question"></span></button><p class="snippet"></p>
<div class="answer" id="faq-answer-${t}" hidden><p class="answer-text">${n(e.answer)}</p>${i}<div class="answer-foot"><button class="useful" type="button" aria-pressed="false">${r(o, 16)}<span>Mark useful</span></button><span class="useful-count"></span></div></div></div>`;
	}
	get #a() {
		let e = (this.query(".query").value ?? "").trim().split(/\s+/).filter(Boolean).map(f);
		return e.length ? new RegExp(e.join("|"), "gi") : null;
	}
	get #o() {
		return [...this.shadowRoot.querySelectorAll(".row:not([hidden])")];
	}
	#s() {
		let e = this.#a, t = 0;
		this.shadowRoot.querySelectorAll(".row").forEach((n) => {
			let r = this.items[Number(n.dataset.index)], i = !e || r.question.search(e) >= 0, a = e && !i && r.answer.search(e) >= 0;
			n.hidden = !(i || a), n.querySelector(".question").innerHTML = p(r.question, e);
			let o = n.querySelector(".snippet");
			o.innerHTML = a ? p(m(r.answer, e), e) : "", o.hidden = !a, n.hidden || t++;
		});
		for (let e of this.shadowRoot.querySelectorAll(".group")) {
			let t = e.querySelectorAll(".row:not([hidden])").length;
			e.hidden = !t, e.querySelector(".group-count").textContent = String(t);
		}
		let r = this.items.length;
		this.query(".count").textContent = e ? `${t} of ${r}` : `${r} answers`;
		let i = this.query(".none");
		i.hidden = t > 0, this.query(".none-text").innerHTML = `No answers for “${n(this.query(".query").value.trim())}”. Press <kbd>Enter</kbd> to ask the team.`, this.#l(), this.#c();
	}
	#c() {
		let e = this.#o, t = e.find((e) => Number(e.dataset.index) === this.#e) ?? e[0];
		this.#e = t ? Number(t.dataset.index) : -1;
		for (let e of this.shadowRoot.querySelectorAll(".row")) e.ariaSelected = String(e === t);
		let n = this.query(".query");
		t ? n.setAttribute("aria-activedescendant", t.id) : n.removeAttribute("aria-activedescendant");
		let r = this.query(".highlight");
		t && !t.hasAttribute("data-open") ? i(r, t) : a(r), t?.scrollIntoView({ block: "nearest" });
	}
	#l() {
		for (let e of this.shadowRoot.querySelectorAll(".row")) {
			let t = Number(e.dataset.index), n = t === this.#t;
			e.toggleAttribute("data-open", n), e.querySelector(".row-head").ariaExpanded = String(n), e.querySelector(".answer").hidden = !n;
			let r = this.#n.has(t), i = e.querySelector(".useful");
			i.ariaPressed = String(r), i.querySelector("span").textContent = r ? "Marked useful" : "Mark useful", e.querySelector(".useful-count").textContent = `${(this.items[t].useful ?? 0) + +!!r} found this useful`;
		}
	}
	#u(e) {
		this.#e = e, this.#t = this.#t === e ? -1 : e, this.#l(), this.#c(), this.#t >= 0 && this.emit("open", { item: this.items[e] });
	}
	#d(e) {
		let t = !this.#n.has(e);
		t ? this.#n.add(e) : this.#n.delete(e), this.#l(), this.emit("useful", {
			item: this.items[e],
			useful: t
		});
	}
	#f() {
		let e = this.query(".query").value.trim();
		e && (this.query(".none-text").textContent = `Sent. The team will answer “${e}” by email.`, this.query(".ask").hidden = !0, this.emit("ask", { question: e }));
	}
	#p(e) {
		let t = this.#o, n = t.findIndex((e) => Number(e.dataset.index) === this.#e), r = {
			ArrowDown: 1,
			ArrowUp: -1
		}[e.key];
		r && t.length ? (e.preventDefault(), this.#e = Number(t[(n + r + t.length) % t.length].dataset.index), this.#c()) : e.key === "Enter" ? (e.preventDefault(), t.length ? this.#u(this.#e) : this.#f()) : e.key === "Escape" && e.target.value && (e.preventDefault(), e.target.value = "", this.query(".ask").hidden = !1, this.#s());
	}
};
//#endregion
//#region src/components/help-center-faq/index.js
t("help-center-faq", h);
//#endregion
export { h as t };
