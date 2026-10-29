import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { n as a, t as o } from "./rolling-VjfpUD4B.js";
import { i as s } from "./menu-BCEGADW6.js";
import { n as c } from "./swap-BK53XQML.js";
import { n as l, t as u } from "./people-C_zYMoEl.js";
import { a as d, gt as f, h as p } from "./lucide-BVbUPHVq.js";
import { n as m, t as h } from "./picker-CFtn-7gY.js";
//#region src/components/feedback-composer/feedback-composer.scss?inline
var g = ".picker-trigger{border-radius:var(--lw-radius-md);font:inherit;color:var(--lw-color-foreground);cursor:pointer;background:0 0;border:0;outline:none;align-items:center;gap:.375rem;padding:.375rem .5rem;display:inline-flex}.picker-trigger:hover,.picker-trigger[aria-expanded=true]{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent)}.picker-trigger:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.picker-trigger>svg{color:var(--lw-color-muted-foreground);flex:none}.picker-label{color:var(--lw-color-muted-foreground)}:host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:34rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));font-size:var(--lw-text-sm);border:0;border-radius:1.5rem;padding:.5rem;display:block}p,h3,ul{margin:0}button,input,textarea{font:inherit;color:inherit;outline:none}button:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.head{align-items:center;gap:.75rem;padding:.375rem .5rem .75rem;display:flex}.faces{display:flex}.face{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));width:1.625rem;height:1.625rem;box-shadow:0 0 0 2px var(--lw-color-background);border-radius:50%;place-items:center;font-size:.5625rem;font-weight:600;display:grid}.face+.face{margin-left:-.375rem}.summary{font-size:var(--lw-text-md);color:var(--_muted)}.summary b{color:var(--lw-color-foreground);font-weight:500}.votes{vertical-align:bottom;display:inline-flex}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.box{border:1px solid var(--_line);background:var(--lw-color-background);border-radius:1.25rem}.box:focus-within{border-color:color-mix(in oklab, var(--lw-color-foreground) 30%, transparent)}.title,.details{box-sizing:border-box;width:100%;font-size:var(--lw-text-md);background:0 0;border:0;display:block}.title:focus-visible,.details:focus-visible{outline:none}.title::placeholder,.details::placeholder{color:var(--_muted)}.title{font-size:var(--lw-text-lg);padding:1.125rem 1.25rem .5rem}.details{resize:none;field-sizing:content;min-height:3.5rem;padding:.25rem 1.25rem;line-height:1.5}.tools{justify-content:space-between;align-items:center;padding:.5rem;display:flex}.post{background:var(--lw-color-primary);width:2.5rem;height:2.5rem;color:var(--lw-color-primary-foreground);cursor:pointer;border:0;border-radius:50%;place-items:center;padding:0;display:grid}.post:disabled{background:color-mix(in oklab, var(--lw-color-foreground) 10%, transparent);color:var(--_muted);cursor:default}.similar{padding:.875rem .5rem .25rem}.similar[hidden]{display:none}.similar-title{font-size:var(--lw-text-xs);color:var(--_muted);padding:0 .5rem .5rem;font-weight:400}.list{padding:0;list-style:none}.request{align-items:center;gap:.75rem;padding:.375rem .5rem;display:flex}@media (prefers-reduced-motion:no-preference){.request{animation:.25s ease-out rise}}@keyframes rise{0%{opacity:0;translate:0 .25rem}}.vote{border:1px solid var(--_line);border-radius:var(--lw-radius-md);min-width:2.75rem;font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;cursor:pointer;background:0 0;justify-items:center;padding:.25rem .375rem;display:inline-grid}.vote:hover{border-color:color-mix(in oklab, var(--lw-color-foreground) 35%, transparent)}.vote[aria-pressed=true]{border-color:var(--lw-color-foreground);background:var(--lw-color-foreground);color:var(--lw-color-background)}.request-title{flex:1;min-width:0}.request-area{font-size:var(--lw-text-xs);color:var(--_muted)}.posted{font-size:var(--lw-text-xs);color:var(--_muted);padding:.75rem .75rem .25rem}.posted:empty{display:none}", _ = [
	{
		value: "runtime",
		label: "Runtime"
	},
	{
		value: "toolchain",
		label: "Toolchain"
	},
	{
		value: "profiler",
		label: "Profiler"
	},
	{
		value: "docs",
		label: "Docs"
	}
], v = [
	{
		id: 1,
		title: "Export profiler traces to Perfetto",
		area: "profiler",
		votes: 214
	},
	{
		id: 2,
		title: "RISC-V target for the release builds",
		area: "toolchain",
		votes: 187
	},
	{
		id: 3,
		title: "Arena allocator in the standard runtime",
		area: "runtime",
		votes: 152
	},
	{
		id: 4,
		title: "Flame graph diff between two traces",
		area: "profiler",
		votes: 131
	},
	{
		id: 5,
		title: "Reproducible builds by default",
		area: "toolchain",
		votes: 118
	},
	{
		id: 6,
		title: "Man pages for every CLI command",
		area: "docs",
		votes: 77
	},
	{
		id: 7,
		title: "Hot reload for long-running daemons",
		area: "runtime",
		votes: 64
	},
	{
		id: 8,
		title: "Cross-compile from Windows without WSL",
		area: "toolchain",
		votes: 47
	}
], y = [
	"Ana Moreno",
	"Jules Laurent",
	"Sam Okafor",
	"Priya Shah"
], b = 3, x = new Set("the and for with from that this into add support".split(" ")), S = new Intl.NumberFormat("en-US"), C = (e) => (e.toLowerCase().match(/[a-z0-9]{3,}/g) ?? []).filter((e) => !x.has(e)), w = class extends e {
	static styles = [
		r,
		s,
		a,
		c,
		g
	];
	static props = {
		roadmap: { default: "LowerSoft roadmap" },
		area: { default: "" },
		areas: {
			type: Object,
			default: _
		},
		requests: {
			type: Object,
			default: v
		},
		team: {
			type: Object,
			default: y
		}
	};
	#e = /* @__PURE__ */ new Set();
	#t = [];
	#n;
	render() {
		return `<header class="head"><span class="faces"></span><p class="summary"><b class="roadmap-name"></b> · <span class="open"></span> · <span class="votes"><span class="visually-hidden"></span><span class="rolling" aria-hidden="true"></span></span></p></header>
<form class="box" novalidate><input class="title" type="text" placeholder="Request a feature" aria-label="Feature" autocomplete="off"><textarea class="details" rows="2" placeholder="What are you trying to do, and what gets in the way?" aria-label="Details"></textarea>
<div class="tools">${m("area-menu", { icon: i(f, 15) })}<button class="post" type="submit" aria-label="Post the request" disabled>${i(d, 18)}</button></div></form>
<section class="similar" aria-labelledby="similar-title" hidden><h3 class="similar-title" id="similar-title">Already asked? Vote instead</h3><ul class="list"></ul></section><p class="posted" role="status"></p>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.#n = h(this.query(".picker"), this.signal, (e) => this.area = e), this.query(".picker-trigger").setAttribute("aria-label", "Area");
		let t = this.query(".box");
		t.addEventListener("input", () => this.#a(), e), t.addEventListener("submit", (e) => {
			e.preventDefault(), this.#c();
		}, e), this.query(".list").addEventListener("click", (e) => {
			let t = e.target.closest(".vote");
			t && this.#s(Number(t.dataset.id));
		}, e);
	}
	updated(e) {
		e.has("team") && (this.query(".faces").innerHTML = (this.team ?? []).map((e) => `<span class="face" style="--_hue: ${u(e)}">${n(l(e))}</span>`).join("")), this.query(".roadmap-name").textContent = this.roadmap ?? "", this.#n?.set([{
			value: "",
			label: "Area"
		}, ...this.areas], this.area ?? ""), this.#a();
	}
	get #r() {
		return [...this.#t, ...this.requests ?? []];
	}
	#i(e) {
		return e.votes + +!!this.#e.has(e.id);
	}
	#a() {
		let e = this.#r;
		this.query(".open").textContent = `${e.length} open`;
		let t = `${S.format(e.reduce((e, t) => e + this.#i(t), 0))} votes`;
		this.query(".votes .visually-hidden").textContent = t, o(this.query(".votes .rolling"), t);
		let n = this.query(".title").value.trim();
		this.query(".post").disabled = n.length < 4;
		let r = C(n), i = r.length ? e.map((e) => ({
			request: e,
			score: C(e.title).filter((e) => r.some((t) => e.startsWith(t) || t.startsWith(e))).length
		})).filter((e) => e.score && !this.#t.includes(e.request)).sort((e, t) => t.score - e.score || t.request.votes - e.request.votes).slice(0, b).map((e) => e.request) : [];
		this.query(".similar").hidden = !i.length, this.#o(i);
	}
	#o(e) {
		let t = new Map(this.areas.map((e) => [e.value, e.label]));
		this.query(".list").innerHTML = e.map((e) => {
			let r = this.#e.has(e.id);
			return `<li class="request"><button class="vote" type="button" data-id="${e.id}" aria-pressed="${r}" aria-label="${r ? "Take back your vote for" : "Vote for"} ${n(e.title)}">${i(p, 15)}<span class="vote-count">${S.format(this.#i(e))}</span></button><span class="request-title">${n(e.title)}</span><span class="request-area">${n(t.get(e.area) ?? "")}</span></li>`;
		}).join("");
	}
	#s(e) {
		let t = !this.#e.has(e);
		t ? this.#e.add(e) : this.#e.delete(e), this.#a(), this.query(`.vote[data-id="${e}"]`)?.focus(), this.emit("vote", {
			id: e,
			voted: t
		});
	}
	#c() {
		let e = this.query(".title").value.trim();
		if (e.length < 4) return;
		let t = this.query(".details").value.trim(), n = {
			id: -(this.#t.length + 1),
			title: e,
			area: this.area,
			votes: 0
		};
		this.#t.unshift(n), this.#e.add(n.id), this.query(".box").reset(), this.query(".posted").textContent = `Posted “${e}” with your vote on it.`, this.#a(), this.emit("request", {
			title: e,
			details: t,
			area: this.area
		});
	}
};
//#endregion
//#region src/components/feedback-composer/index.js
t("feedback-composer", w);
//#endregion
export { w as t };
