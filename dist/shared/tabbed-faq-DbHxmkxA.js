import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { m as a, p as o } from "./lucide-BVbUPHVq.js";
//#region src/components/tabbed-faq/tabbed-faq.scss?inline
var s = ":host{--_ink:var(--lw-color-foreground);--_muted:var(--lw-color-muted-foreground);--_line:var(--lw-color-border);--_surface:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));--_ease:cubic-bezier(.23, 1, .32, 1);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:29rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:.5rem;display:block}p,h2,h3,ol{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.head{justify-content:space-between;align-items:baseline;padding:.75rem .5rem 1rem;display:flex}.title{font-size:var(--lw-text-lg);font-weight:600}.count{color:var(--_muted)}.tabs{background:var(--_surface);border-radius:.875rem;margin:0 .5rem 1rem;padding:.25rem;position:relative}.tablist,.clip{grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;display:grid}.clip{pointer-events:none;position:absolute;inset:.25rem}@media (prefers-reduced-motion:no-preference){.clip{transition:clip-path .3s var(--_ease)}}.clip .tab{background:color-mix(in oklab, var(--_ink) 10%, var(--lw-color-background));color:var(--_ink)}.tab{font-size:var(--lw-text-md);color:var(--_muted);cursor:pointer;background:0 0;border:0;border-radius:.625rem;justify-content:center;align-items:center;gap:.375rem;padding:.5rem .75rem;display:flex}.tab-count{font-size:var(--lw-text-xs);opacity:.7}.viewport{border:1px solid var(--_line);background:var(--_surface);border-radius:1rem;position:relative;overflow:hidden}@media (prefers-reduced-motion:no-preference){.viewport{transition:height .35s var(--_ease)}}.viewport[data-instant],.viewport[data-instant] .pane{transition:none}.pane{position:absolute;inset:0 0 auto}@media (prefers-reduced-motion:no-preference){.pane{transition:translate .4s var(--_ease), opacity .3s ease-out}}.list{padding:.375rem;display:grid}:host([data-open]) .list{opacity:0;translate:-30%}.answer{opacity:0;gap:1rem;padding:1rem 1.25rem 1.25rem;display:grid;translate:100%}:host([data-open]) .answer{opacity:1;translate:0}.row{text-align:left;cursor:pointer;background:0 0;border:0;border-radius:.75rem;align-items:center;gap:1rem;padding:.875rem .75rem;display:flex}@media (prefers-reduced-motion:no-preference){.row{transition:background-color .15s ease-out}}.row:hover,.row:focus-visible{background:color-mix(in oklab, var(--_ink) 6%, transparent)}.row>svg{color:var(--_muted);flex:none}.number{font:var(--lw-text-xs) var(--lw-font-mono);color:var(--_muted);flex:none;align-self:flex-start;padding-top:.125rem}.text{flex:1;gap:.25rem;min-width:0;display:grid}.question{font-size:var(--lw-text-md)}.preview{text-overflow:ellipsis;white-space:nowrap;color:var(--_muted);overflow:hidden}.meta{color:var(--_muted);flex:none}.back{color:var(--_muted);cursor:pointer;background:0 0;border:0;justify-self:start;align-items:center;gap:.25rem;padding:0;display:inline-flex}.back:hover{color:var(--_ink)}.answer-title{font-size:var(--lw-text-lg);outline:none;font-weight:600}.answer-text{color:var(--_muted);line-height:1.65}.steps{counter-reset:step;gap:.75rem;padding:0;list-style:none;display:grid}.steps li{counter-increment:step;grid-template-columns:1.5rem minmax(0,1fr);gap:.5rem .75rem;display:grid}.steps li:before{content:counter(step);border:1px solid var(--_line);width:1.5rem;height:1.5rem;font-size:var(--lw-text-xs);color:var(--_muted);border-radius:50%;place-items:center;display:grid}.steps li>span{align-self:center}.code{min-width:0;font-size:var(--lw-text-xs);grid-column:2;display:flex}.code::part(button){width:100%;min-width:0}.related{border-top:1px solid var(--_line);gap:.25rem;padding-top:1rem;display:grid}.related-head{font-size:var(--lw-text-xs);color:var(--_muted);margin-bottom:.25rem}.related-link{text-align:left;cursor:pointer;background:0 0;border:0;justify-content:space-between;align-items:center;gap:.5rem;padding:.375rem 0;display:flex}.related-link svg{color:var(--_muted);flex:none}.related-link:hover{text-underline-offset:.2em;text-decoration:underline}.pager{border-top:1px solid var(--_line);grid-template-columns:1fr 1fr;gap:.5rem;padding-top:1rem;display:grid}.step-link{border:1px solid var(--_line);text-align:left;cursor:pointer;background:0 0;border-radius:.625rem;align-items:center;gap:.375rem;min-width:0;padding:.5rem .625rem;display:flex}.step-link .step-text{flex:1;min-width:0;display:grid}.step-link .step-question{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.step-link small{font-size:var(--lw-text-xs);color:var(--_muted)}.step-link svg{color:var(--_muted);flex:none}.step-link.next{text-align:right;grid-column:2;justify-content:flex-end}.step-link:hover{border-color:color-mix(in oklab, var(--_ink) 30%, transparent)}", c = [
	{
		id: "setup",
		label: "Setup"
	},
	{
		id: "using",
		label: "Using"
	},
	{
		id: "license",
		label: "License"
	}
], l = (e, t, n, r = {}) => ({
	tab: e,
	question: t,
	answer: n,
	...r
}), u = [
	l("setup", "How do I install a component?", "Components ship in one package, and each registers its element when you import it, so the ones you never import never ship.", {
		steps: [
			{
				text: "Add the package",
				code: "npm install @lowersoft/lw"
			},
			{
				text: "Load the theme once",
				code: "import '@lowersoft/lw/themes.css';"
			},
			{
				text: "Import the components you use",
				code: "import '@lowersoft/lw/components/button.js';"
			}
		],
		related: [1, 4]
	}),
	l("setup", "Can I load it without a bundler?", "Yes. Import the modules from a CDN in a script of type module, then use the elements in plain HTML.", { related: [0] }),
	l("setup", "Does it work with server rendering?", "The elements render on the client. Server-rendered pages keep the tags in the HTML, and each one upgrades as soon as its module loads.", { related: [3] }),
	l("setup", "Which browsers are supported?", "Current Chrome, Edge, Firefox and Safari. The components rely on Shadow DOM, constructable style sheets and container queries.", { related: [2] }),
	l("using", "How do I listen for events?", "Every component fires events prefixed with lw-. They bubble and cross the shadow boundary, so you can listen on the element or any ancestor.", {
		steps: [{
			text: "Listen for the event",
			code: "picker.addEventListener('lw-change', (event) => console.log(event.detail));"
		}],
		related: [5]
	}),
	l("using", "Can I restyle a component?", "Override its --lw-* tokens on the element or any ancestor, or style the parts it exposes with ::part().", { related: [4, 6] }),
	l("using", "How do they work in forms?", "Inputs are form-associated: they submit their values with the form, validate with the browser’s constraint API and reset with it.", { related: [5] }),
	l("license", "Is it free for commercial work?", "Yes. The library is MIT licensed: use it in client work and products, free of charge, with no seat limits.", { related: [8] }),
	l("license", "Do I need to credit the library?", "No. Keep the license file with the package; a link back is welcome but never required.", { related: [7] }),
	l("license", "Can I fork and modify it?", "Yes. Change anything, ship your fork, keep it private or publish it; the license only asks that its notice stays in the copies.", { related: [7, 8] })
], d = (e) => String(e).padStart(2, "0"), f = class extends e {
	static styles = s;
	static props = {
		heading: { default: "Questions" },
		tabs: {
			type: Object,
			default: c
		},
		items: {
			type: Object,
			default: u
		},
		tab: { default: "setup" }
	};
	#e = -1;
	render() {
		return "<header class=\"head\"><h2 class=\"title\"></h2><span class=\"count\"></span></header>\n<div class=\"tabs\"><div class=\"tablist\" role=\"tablist\"></div><div class=\"clip\" aria-hidden=\"true\"></div></div>\n<div class=\"viewport\"><div class=\"pane list\" role=\"tabpanel\"></div><div class=\"pane answer\" aria-live=\"polite\"></div></div>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".tablist");
		t.addEventListener("click", (e) => {
			let t = e.target.closest("[role=\"tab\"]");
			t && this.#i(t.dataset.id, !1);
		}, e), t.addEventListener("keydown", (e) => {
			let t = {
				ArrowRight: 1,
				ArrowLeft: -1
			}[e.key];
			if (!t) return;
			e.preventDefault();
			let n = this.tabs.findIndex((e) => e.id === this.tab);
			this.#i(this.tabs[(n + t + this.tabs.length) % this.tabs.length].id, !0);
		}, e);
		let n = this.query(".list");
		n.addEventListener("click", (e) => {
			let t = e.target.closest(".row");
			t && this.#c(Number(t.dataset.index));
		}, e), n.addEventListener("keydown", (e) => {
			let t = {
				ArrowDown: 1,
				ArrowUp: -1
			}[e.key];
			if (!t) return;
			e.preventDefault();
			let r = [...n.querySelectorAll(".row")];
			r[(r.indexOf(e.target.closest(".row")) + t + r.length) % r.length]?.focus();
		}, e);
		let r = this.query(".answer");
		r.addEventListener("click", (e) => {
			let t = e.target.closest("[data-go]");
			t && (t.dataset.go === "back" ? this.#l() : this.#c(Number(t.dataset.go)));
		}, e), r.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				e.preventDefault(), this.#l();
				return;
			}
			if (e.target.closest("lw-copy-button")) return;
			let t = {
				ArrowLeft: this.#s[0],
				ArrowRight: this.#s[1]
			}[e.key];
			t !== void 0 && (e.preventDefault(), t >= 0 && this.#c(t));
		}, e);
		let i = new ResizeObserver(() => {
			this.#r(), this.#d();
		});
		i.observe(this.query(".tabs")), i.observe(this.query(".answer")), i.observe(n), this.signal.addEventListener("abort", () => i.disconnect());
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", this.query(".count").textContent = `${this.items.length} answers`, (e.has("tabs") || e.has("items")) && this.#t(), (e.has("tab") || e.has("items")) && (this.#e = -1, this.#o(), this.#u(!1)), this.#n();
	}
	#t() {
		let e = (e) => this.items.filter((t) => t.tab === e).length, t = (t) => `${n(t.label)}<span class="tab-count">${e(t.id)}</span>`;
		this.query(".tablist").innerHTML = this.tabs.map((e) => `<button class="tab" type="button" role="tab" id="tab-${n(e.id)}" data-id="${n(e.id)}">${t(e)}</button>`).join(""), this.query(".clip").innerHTML = this.tabs.map((e) => `<span class="tab">${t(e)}</span>`).join("");
	}
	#n() {
		for (let e of this.shadowRoot.querySelectorAll("[role=\"tab\"]")) {
			let t = e.dataset.id === this.tab;
			e.ariaSelected = String(t), e.tabIndex = t ? 0 : -1;
		}
		this.query(".list").setAttribute("aria-labelledby", `tab-${this.tab}`), this.#r();
	}
	#r() {
		let e = this.query("[role=\"tab\"][aria-selected=\"true\"]"), t = this.query(".clip");
		if (!e) return;
		let n = e.offsetLeft - t.offsetLeft, r = e.offsetTop - t.offsetTop;
		t.style.clipPath = `inset(${r}px ${t.clientWidth - n - e.offsetWidth}px ${t.clientHeight - r - e.offsetHeight}px ${n}px round 0.625rem)`;
	}
	#i(e, t) {
		e !== this.tab && (this.tab = e, this.emit("change", { tab: e })), t && this.query(`[role="tab"][data-id="${CSS.escape(e)}"]`)?.focus();
	}
	get #a() {
		return this.items.map((e, t) => ({
			each: e,
			index: t
		})).filter(({ each: e }) => e.tab === this.tab);
	}
	#o() {
		this.query(".list").innerHTML = this.#a.map(({ each: e, index: t }, i) => {
			let o = e.steps?.length ? `<span class="meta">${e.steps.length} steps</span>` : "";
			return `<button class="row" type="button" data-index="${t}"><span class="number">${d(i + 1)}</span><span class="text"><span class="question">${n(e.question)}</span><span class="preview">${n(e.answer)}</span></span>${o}${r(a, 16)}</button>`;
		}).join("");
	}
	get #s() {
		let e = this.#a.map(({ index: e }) => e), t = e.indexOf(this.#e);
		return [e[t - 1] ?? -1, e[t + 1] ?? -1];
	}
	#c(e) {
		let t = this.items[e];
		if (!t) return;
		t.tab !== this.tab && (this.tab = t.tab, this.#o(), this.#n(), this.emit("change", { tab: t.tab }));
		let i = this.tabs.find((e) => e.id === t.tab)?.label ?? "";
		this.#e = e;
		let [s, c] = this.#s, l = t.steps?.length ? `<ol class="steps">${t.steps.map((e) => `<li><span>${n(e.text)}</span>${e.code ? `<lw-copy-button class="code" value="${n(e.code)}" label="Copy"></lw-copy-button>` : ""}</li>`).join("")}</ol>` : "", u = (t.related ?? []).filter((e) => this.items[e]), d = (e, t) => e >= 0 ? `<button class="step-link ${t}" type="button" data-go="${e}">${t === "previous" ? r(o, 16) : ""}<span class="step-text"><small>${t === "previous" ? "Previous" : "Next"}</small><span class="step-question">${n(this.items[e].question)}</span></span>${t === "next" ? r(a, 16) : ""}</button>` : "<span></span>";
		this.query(".answer").innerHTML = `<button class="back" type="button" data-go="back">${r(o, 16)}${n(i)}</button>
<h3 class="answer-title" tabindex="-1">${n(t.question)}</h3><p class="answer-text">${n(t.answer)}</p>${l}
${u.length ? `<div class="related"><p class="related-head">Related</p>${u.map((e) => `<button class="related-link" type="button" data-go="${e}">${n(this.items[e].question)}${r(a, 14)}</button>`).join("")}</div>` : ""}
<nav class="pager" aria-label="More answers">${d(s, "previous")}${d(c, "next")}</nav>`, this.#u(!0), this.query(".answer-title").focus({ preventScroll: !0 }), this.emit("open", { item: t });
	}
	#l() {
		let e = this.#e;
		this.#e = -1, this.#u(!0), this.query(`.row[data-index="${e}"]`)?.focus({ preventScroll: !0 });
	}
	#u(e) {
		let t = this.#e >= 0;
		this.toggleAttribute("data-open", t), this.query(".list").inert = t, this.query(".answer").inert = !t, this.query(".viewport").toggleAttribute("data-instant", !e || i.matches), this.#d();
	}
	#d() {
		let e = this.query(this.#e >= 0 ? ".answer" : ".list");
		this.query(".viewport").style.height = `${e.scrollHeight}px`;
	}
};
//#endregion
//#region src/components/tabbed-faq/index.js
t("tabbed-faq", f);
//#endregion
export { f as t };
