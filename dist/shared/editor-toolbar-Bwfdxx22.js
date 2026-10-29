import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { n as a } from "./people-C_zYMoEl.js";
import { J as o, d as s, m as c } from "./lucide-BVbUPHVq.js";
//#region src/components/editor-toolbar/editor-toolbar.scss?inline
var l = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);--_ease:cubic-bezier(.23, 1, .32, 1);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:56rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:0;display:block;overflow:hidden;container-type:inline-size}p,ul{margin:0}a,button{font:inherit;color:inherit;outline:none}a:focus-visible,button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.bar{border-bottom:1px solid var(--_line);align-items:center;gap:.75rem;padding:.625rem .75rem;display:flex}.tool{border-radius:var(--lw-radius-md);min-width:2.25rem;height:2.25rem;color:var(--_muted);cursor:pointer;background:0 0;border:0;justify-content:center;align-items:center;gap:.375rem;padding:0 .375rem;display:inline-flex}.tool:hover{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent);color:var(--lw-color-foreground)}.comment-count{font-size:var(--lw-text-md);color:var(--lw-color-foreground)}.crumbs{min-width:0;font-size:var(--lw-text-md);white-space:nowrap;flex:1;align-items:center;gap:.5rem;display:flex}.crumbs>svg{color:var(--_muted);flex:none}.crumb{color:var(--_muted);align-items:center;gap:.5rem;display:inline-flex}.crumb[aria-current]{text-overflow:ellipsis;min-width:0;color:var(--lw-color-foreground);font-weight:500;overflow:hidden}@container (width<=44rem){.crumb:not([aria-current],:first-child){display:none}}.mark{color:#fff;background:#8e4ec6;border-radius:.3125rem;place-items:center;width:1.25rem;height:1.25rem;font-size:.6875rem;font-weight:700;display:grid}.saved{color:var(--_muted);flex:none;align-items:center;gap:.375rem;display:inline-flex}.saved[data-saving] .saved-icon{opacity:.3}@container (width<=40rem){.saved .saved-text{display:none}}.saved-icon{display:grid}@media (prefers-reduced-motion:no-preference){.saved-icon{transition:opacity .2s ease-out}}.people{flex:none;display:flex}.person{border:2px solid var(--_ring,var(--_line));background:color-mix(in oklab, var(--lw-color-foreground) 12%, var(--lw-color-background));border-radius:50%;place-items:center;width:2rem;height:2rem;font-size:.6875rem;font-weight:600;display:grid}.person+.person{margin-left:-.5rem}@media (prefers-reduced-motion:no-preference){.person{transition:translate .2s ease-out}}.person:hover{z-index:1;translate:0 -2px}.more-people{border-color:var(--_line);background:var(--lw-color-background);color:var(--_muted)}.divider{background:var(--_line);width:1px;height:1.5rem}.share::part(button){border-radius:var(--lw-radius-full)}.body{grid-template-columns:13rem minmax(0,1fr);height:20rem;display:grid}@media (prefers-reduced-motion:no-preference){.body{transition:grid-template-columns .3s var(--_ease)}}:host(:not([outline])) .body{grid-template-columns:0 minmax(0,1fr)}.outline{border-right:1px solid var(--_line);white-space:nowrap;min-width:0;padding:1.25rem .75rem;overflow:hidden}:host(:not([outline])) .outline{border-right-color:#0000}.outline-title{color:var(--_muted);padding:0 .5rem .75rem}.headings{padding:0;list-style:none}.heading{border-radius:var(--lw-radius-md);font-size:var(--lw-text-md);text-overflow:ellipsis;color:var(--_muted);padding:.375rem .5rem;text-decoration:none;display:block;overflow:hidden}.heading[data-level=\"2\"]{padding-left:1rem}.heading:hover,.heading[data-current]{color:var(--lw-color-foreground)}.heading[data-current]:after{content:\"\";vertical-align:middle;background:#8e4ec6;border-radius:50%;width:.375rem;height:.375rem;margin-left:.5rem;display:inline-block}.page{padding:1.5rem 2rem;overflow-y:auto}.doc{max-width:40rem;font-size:var(--lw-text-md);outline:none;line-height:1.7}.doc h1{margin:0 0 .75rem;font-size:1.75rem;line-height:1.2}.doc h2{font-size:var(--lw-text-lg);margin:1.5rem 0 .5rem}.doc p{color:color-mix(in oklab, var(--lw-color-foreground) 80%, transparent);margin:0}", u = "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><path d=\"M9 3v18\"/>", d = "<circle cx=\"5\" cy=\"12\" r=\"1.2\" fill=\"currentColor\"/><circle cx=\"12\" cy=\"12\" r=\"1.2\" fill=\"currentColor\"/><circle cx=\"19\" cy=\"12\" r=\"1.2\" fill=\"currentColor\"/>", f = 900, p = 3, m = [
	{
		name: "Maya Chen",
		color: "#8e4ec6"
	},
	{
		name: "Jonas Weber",
		color: "#0090ff"
	},
	{
		name: "Priya Raman",
		color: "#e5484d"
	},
	{
		name: "Theo Park",
		color: "#30a46c"
	},
	{
		name: "Ana Ruiz",
		color: "#f76b15"
	}
], h = "<h1 id=\"s-profiler\">Profiler v2</h1><p>Profiler v2 samples every thread at 10 kHz with no instrumentation, and opens straight from a crash report at the frame that failed.</p>\n<h2 id=\"s-sampling\">Sampling</h2><p>Sampling runs off a timer signal, so the program under test pays under 2% of a core. Stacks are walked with frame pointers where they exist and DWARF where they don't.</p>\n<h2 id=\"s-symbols\">Symbols</h2><p>Symbols come from the remote symbol server and are cached on disk; a cold lookup takes a few milliseconds, a warm one none.</p>\n<h2 id=\"s-rollout\">Rollout</h2><p>Teams on Pro get it on November 4. The old profiler stays one release behind a flag, then goes.</p>", g = (e) => {
	let t = Math.round(e / 6e4);
	return t < 1 ? "just now" : `${t} min ago`;
}, _ = class extends e {
	static styles = [r, l];
	static props = {
		path: {
			type: Object,
			default: [
				"LowerSoft",
				"Specs",
				"Profiler v2"
			]
		},
		people: {
			type: Object,
			default: m
		},
		comments: {
			type: Number,
			default: 3
		},
		outline: {
			type: Boolean,
			default: !0,
			reflect: !0
		},
		doc: { default: h }
	};
	#e = Date.now() - 12e4;
	#t = !1;
	#n = 0;
	#r = 0;
	render() {
		return `<header class="bar"><button class="tool toggle" type="button" aria-label="Outline" aria-controls="outline">${i(u, 18)}</button><nav class="crumbs" aria-label="Breadcrumb"></nav>
<p class="saved" aria-live="polite"><span class="saved-icon">${i(s, 16)}</span><span class="saved-text"></span></p><span class="people"></span><span class="divider"></span>
<button class="tool comments" type="button">${i(o, 18)}<span class="comment-count"></span></button><lw-button class="share" size="sm">Share</lw-button><button class="tool more" type="button" aria-label="More">${i(d, 18)}</button></header>
<div class="body"><nav class="outline" id="outline" aria-label="Outline"><p class="outline-title">Outline</p><ul class="headings"></ul></nav><div class="page"><article class="doc" contenteditable="true" spellcheck="false" aria-label="Document"></article></div></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".toggle").addEventListener("click", () => this.outline = !this.outline, e), this.query(".share").addEventListener("click", () => this.emit("share"), e), this.query(".comments").addEventListener("click", () => this.emit("comments"), e), this.query(".doc").addEventListener("input", () => this.#o(), e), this.query(".headings").addEventListener("click", (e) => {
			let t = e.target.closest(".heading");
			t && (e.preventDefault(), this.query(`#${CSS.escape(t.dataset.id)}`)?.scrollIntoView({
				block: "start",
				behavior: "smooth"
			}));
		}, e), this.query(".page").addEventListener("scroll", () => this.#a(), {
			...e,
			passive: !0
		}), this.#r = setInterval(() => this.#s(), 3e4), this.signal.addEventListener("abort", () => {
			clearInterval(this.#r), clearTimeout(this.#n);
		});
	}
	updated(e) {
		if (e.has("path")) {
			let e = this.path ?? [];
			this.query(".crumbs").innerHTML = e.map((t, r) => `${r ? i(c, 14) : ""}<span class="crumb"${r === e.length - 1 ? " aria-current=\"page\"" : ""}>${r === 0 ? `<span class="mark" aria-hidden="true">${n(t.charAt(0))}</span>` : ""}${n(t)}</span>`).join("");
		}
		if (e.has("people")) {
			let e = this.people ?? [], t = e.length - p;
			this.query(".people").innerHTML = `${e.slice(0, p).map((e) => `<span class="person" style="--_ring: ${n(e.color)}" title="${n(e.name)}">${n(a(e.name))}</span>`).join("")}${t > 0 ? `<span class="person more-people" title="${n(e.slice(p).map((e) => e.name).join(", "))}">+${t}</span>` : ""}`, this.query(".people").ariaLabel = `In this document: ${e.map((e) => e.name).join(", ")}`;
		}
		this.query(".comment-count").textContent = String(this.comments ?? 0), this.query(".comments").ariaLabel = `${this.comments} comments`, e.has("doc") && (this.query(".doc").innerHTML = this.doc ?? "", this.#i());
		let t = this.query(".toggle");
		t.ariaExpanded = String(this.outline), this.query(".outline").inert = !this.outline, this.#s();
	}
	#i() {
		this.query(".headings").innerHTML = [...this.query(".doc").querySelectorAll("h1[id], h2[id]")].map((e) => `<li><a class="heading" href="#${n(e.id)}" data-id="${n(e.id)}" data-level="${e.tagName.slice(1)}">${n(e.textContent)}</a></li>`).join(""), this.#a();
	}
	#a() {
		let e = this.query(".page").getBoundingClientRect().top, t = [...this.query(".doc").querySelectorAll("h1[id], h2[id]")], n = t.filter((t) => t.getBoundingClientRect().top - e < 40).at(-1) ?? t[0];
		for (let e of this.shadowRoot.querySelectorAll(".heading")) e.toggleAttribute("data-current", e.dataset.id === n?.id);
	}
	#o() {
		this.#t = !0, this.#s(), clearTimeout(this.#n), this.#n = setTimeout(() => {
			this.#t = !1, this.#e = Date.now(), this.#i(), this.#s(), this.emit("save", { html: this.query(".doc").innerHTML });
		}, f);
	}
	#s() {
		this.query(".saved").toggleAttribute("data-saving", this.#t), this.query(".saved-text").textContent = this.#t ? "Saving…" : `Saved ${g(Date.now() - this.#e)}`;
	}
};
//#endregion
//#region src/components/editor-toolbar/index.js
t("editor-toolbar", _);
//#endregion
export { _ as t };
