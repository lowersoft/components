import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { t as i } from "./clipboard-BCkfa02P.js";
import { n as a, t as o } from "./people-C_zYMoEl.js";
import { V as s, d as c } from "./lucide-BVbUPHVq.js";
//#region src/components/minimal-faq/minimal-faq.scss?inline
var l = ":host{--_ink:var(--lw-color-foreground);--_muted:var(--lw-color-muted-foreground);--_line:var(--lw-color-border);--_ease:cubic-bezier(.23, 1, .32, 1);font-family:var(--lw-font-sans);color:var(--_ink);display:block;container-type:inline-size}p,h2,h3{margin:0}.layout{gap:2.5rem;display:grid}@container (width>=48rem){.layout{grid-template-columns:minmax(0,.8fr) minmax(0,1fr);align-items:start;gap:5rem}}.side{justify-items:start;gap:1.25rem;padding-top:1.5rem;display:grid}.title{letter-spacing:-.03em;font-size:clamp(2rem,4.5vw,2.5rem);font-weight:500;line-height:1.1}.description{max-width:26rem;color:var(--_muted);line-height:1.6}.team{font-size:var(--lw-text-sm);color:var(--_muted);align-items:center;gap:.75rem;display:flex}.faces{display:flex}.face{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));width:1.5rem;height:1.5rem;box-shadow:0 0 0 2px var(--lw-color-background);border-radius:50%;place-items:center;font-size:.5625rem;font-weight:600;display:grid}.face+.face{margin-left:-.375rem}.ask::part(button){border-radius:var(--lw-radius-full)}.list{border-top:1px solid var(--_line)}.item{border-bottom:1px solid var(--_line)}.trigger{width:100%;font:500 var(--lw-text-lg)/1.4 var(--lw-font-sans);text-align:left;color:var(--_ink);cursor:pointer;background:0 0;border:0;outline:none;justify-content:space-between;align-items:center;gap:1.5rem;padding:1.375rem 0;display:flex}@media (prefers-reduced-motion:no-preference){.trigger{transition:color .25s ease-out}}[data-open]>.item:not([data-open]) .trigger{color:var(--_muted)}.trigger:hover{color:var(--_ink)}.trigger:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.cross{width:.875rem;height:.875rem;color:var(--_muted);flex:none;position:relative}.cross:before,.cross:after{content:\"\";background:currentColor;width:100%;height:1px;position:absolute;top:50%;left:0}@media (prefers-reduced-motion:no-preference){.cross:before,.cross:after{transition:rotate .3s var(--_ease)}}.cross:after{rotate:90deg}[data-open]>.question .cross{color:var(--_ink)}[data-open]>.question .cross:after{rotate:0deg}.panel{grid-template-rows:0fr;display:grid}@media (prefers-reduced-motion:no-preference){.panel{transition:grid-template-rows .35s var(--_ease)}}[data-open]>.panel{grid-template-rows:1fr}.clip{justify-items:start;gap:1rem;min-height:0;padding:0;display:grid;overflow:hidden}[data-open]>.panel>.clip{padding-bottom:1.5rem}.answer{max-width:36rem;color:var(--_muted);line-height:1.7}.copy{font:var(--lw-text-sm) var(--lw-font-sans);color:var(--_muted);cursor:pointer;background:0 0;border:0;outline:none;align-items:center;gap:.375rem;padding:0;display:inline-flex}.copy:hover{color:var(--_ink)}.copy:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}", u = 1600, d = "faq-", f = [
	{
		question: "Can I change plans later?",
		answer: "Yes. Move up or down from Settings at any time; upgrades take effect at once and downgrades at the end of the billing cycle."
	},
	{
		question: "What happens when my trial ends?",
		answer: "Your workspace moves to the Free plan. Nothing is deleted: Pro features pause until you upgrade, and everything you made stays where it is."
	},
	{
		question: "How does seat billing work?",
		answer: "You pay for members who can edit. Viewers and guests are free and unlimited. When someone joins mid-month we charge only for the days left in the cycle."
	},
	{
		question: "Where is my data stored?",
		answer: "In the region you pick when you create the workspace: the EU or the US. Backups stay in the same region, encrypted at rest."
	},
	{
		question: "Do you offer discounts for nonprofits and schools?",
		answer: "Yes, half off any paid plan. Write to us from your organisation’s address and we will set it up within a day."
	},
	{
		question: "Can I cancel anytime?",
		answer: "Anytime, from Settings, in two clicks. You keep access until the end of the period you paid for, and can export everything first."
	}
], p = [
	"Ana Moreno",
	"Jules Laurent",
	"Sam Okafor"
], m = (e) => e.id ?? e.question.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), h = class extends e {
	static styles = l;
	static props = {
		heading: { default: "Questions, answered" },
		description: { default: "Plans, billing and your data, in plain words. Anything we missed, write to us and a person replies." },
		team: {
			type: Object,
			default: p
		},
		reply: { default: "Usually reply within 2 hours" },
		items: {
			type: Object,
			default: f
		},
		open: {
			default: "",
			reflect: !0
		}
	};
	render() {
		return "<div class=\"layout\"><div class=\"side\"><h2 class=\"title\"></h2><p class=\"description\"></p>\n<div class=\"team\"><span class=\"faces\"></span><span class=\"reply\"></span></div><lw-button class=\"ask\">Ask us</lw-button></div>\n<div class=\"list\"></div></div>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".list");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".copy");
			if (t) return this.#i(t);
			let n = e.target.closest(".trigger");
			n && this.#n(n.dataset.id);
		}, e), t.addEventListener("keydown", (e) => this.#a(e), e), this.query(".ask").addEventListener("click", () => this.emit("ask"), e), window.addEventListener("hashchange", () => this.#r(!0), e), this.#r(!1);
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", this.query(".reply").textContent = this.reply ?? "", e.has("team") && (this.query(".faces").innerHTML = (this.team ?? []).map((e) => `<span class="face" style="--_hue: ${o(e)}" title="${n(e)}">${n(a(e))}</span>`).join("")), e.has("items") && this.#e(), this.#t();
	}
	#e() {
		this.query(".list").innerHTML = (this.items ?? []).map((e) => {
			let t = n(m(e));
			return `<div class="item" id="${d}${t}"><h3 class="question"><button class="trigger" type="button" data-id="${t}" aria-expanded="false" aria-controls="answer-${t}"><span>${n(e.question)}</span><span class="cross" aria-hidden="true"></span></button></h3>
<div class="panel" id="answer-${t}" role="region" aria-label="${n(e.question)}"><div class="clip"><p class="answer">${n(e.answer)}</p><button class="copy" type="button" data-id="${t}">${r(s, 14)}<span>Copy link</span></button></div></div></div>`;
		}).join("");
	}
	#t() {
		this.query(".list").toggleAttribute("data-open", !!this.open);
		for (let e of this.shadowRoot.querySelectorAll(".trigger")) {
			let t = e.dataset.id === this.open;
			e.ariaExpanded = String(t), e.closest(".item").toggleAttribute("data-open", t), e.closest(".item").querySelector(".panel").inert = !t;
		}
	}
	#n(e) {
		let t = this.open === e ? "" : e;
		this.open = t, this.emit("toggle", {
			id: e,
			open: !!t
		});
	}
	#r(e) {
		if (!location.hash.startsWith(`#${d}`)) return;
		let t = decodeURIComponent(location.hash.slice(5));
		(this.items ?? []).some((e) => m(e) === t) && (this.open = t, e && requestAnimationFrame(() => this.query(`#${d}${CSS.escape(t)}`)?.scrollIntoView({ block: "center" })));
	}
	async #i(e) {
		let t = new URL(location.href);
		t.hash = `${d}${e.dataset.id}`;
		try {
			await i(t.href);
		} catch {
			return;
		}
		let n = e.querySelector("span");
		e.querySelector("svg").outerHTML = r(c, 14), n.textContent = "Copied", setTimeout(() => {
			e.querySelector("svg").outerHTML = r(s, 14), n.textContent = "Copy link";
		}, u);
	}
	#a(e) {
		let t = e.target.closest(".trigger");
		if (!t) return;
		let n = [...this.shadowRoot.querySelectorAll(".trigger")], r = n.indexOf(t), i = {
			ArrowDown: r + 1,
			ArrowUp: r - 1,
			Home: 0,
			End: n.length - 1
		}[e.key];
		i !== void 0 && (e.preventDefault(), n[(i + n.length) % n.length].focus());
	}
};
//#endregion
//#region src/components/minimal-faq/index.js
t("minimal-faq", h);
//#endregion
export { h as t };
