import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./icons-HWomdoMw.js";
import { r } from "./icons-Dv1KN71n.js";
import { i } from "./menu-BCEGADW6.js";
import { n as a } from "./swap-BK53XQML.js";
import { V as o } from "./lucide-BVbUPHVq.js";
import { n as s, t as c } from "./picker-CFtn-7gY.js";
//#region src/components/format-toolbar/format-toolbar.scss?inline
var l = ".picker-trigger{border-radius:var(--lw-radius-md);font:inherit;color:var(--lw-color-foreground);cursor:pointer;background:0 0;border:0;outline:none;align-items:center;gap:.375rem;padding:.375rem .5rem;display:inline-flex}.picker-trigger:hover,.picker-trigger[aria-expanded=true]{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent)}.picker-trigger:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.picker-trigger>svg{color:var(--lw-color-muted-foreground);flex:none}.picker-label{color:var(--lw-color-muted-foreground)}:host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:44rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);min-height:14rem;font-size:var(--lw-text-sm);border-radius:1.5rem;padding:2rem 2.5rem;display:block;position:relative}button,input{font:inherit;color:inherit;outline:none}button:focus-visible,input:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.toolbar{z-index:2;border:1px solid var(--_line);background:color-mix(in oklab, var(--lw-color-foreground) 6%, var(--lw-color-background));box-shadow:var(--lw-shadow-md);white-space:nowrap;border-radius:1rem;padding:.375rem;position:absolute}@media (prefers-reduced-motion:no-preference){.toolbar{transition:left .15s ease-out,top .15s ease-out;animation:.18s ease-out pop}}.toolbar[hidden]{display:none}@keyframes pop{0%{opacity:0;scale:.96}}.tools{align-items:center;gap:.125rem;display:flex}.tools[hidden]{display:none}.block .picker-trigger{height:2.25rem;font-size:var(--lw-text-md);padding:0 .625rem}.sep{background:var(--_line);width:1px;height:1.25rem;margin:0 .375rem}.tool{border-radius:var(--lw-radius-md);min-width:2.25rem;height:2.25rem;font-size:var(--lw-text-md);color:var(--_muted);cursor:pointer;background:0 0;border:0;justify-content:center;align-items:center;gap:.375rem;padding:0 .5rem;display:inline-flex}.tool:hover{color:var(--lw-color-foreground)}.tool[aria-pressed=true]{background:color-mix(in oklab, var(--lw-color-foreground) 12%, transparent);color:var(--lw-color-foreground)}.link-form[hidden]{display:none}.url{width:18rem;height:2.25rem;font-size:var(--lw-text-md);background:0 0;border:0;padding:0 .625rem}.url::placeholder{color:var(--_muted)}.doc{font-size:var(--lw-text-lg);color:color-mix(in oklab, var(--lw-color-foreground) 82%, transparent);outline:none;line-height:1.75}.doc :is(h2,h3){color:var(--lw-color-foreground);margin:0 0 .75rem;line-height:1.25}.doc h2{font-size:1.75rem}.doc p,.doc ul,.doc blockquote{margin:0 0 1rem}.doc blockquote{border-left:2px solid var(--_line);padding-left:1rem}.doc b,.doc strong{color:var(--lw-color-foreground)}.doc a{color:inherit;text-underline-offset:.2em}.doc [style*=background-color]{color:var(--lw-color-foreground);border-radius:.2em}", u = {
	bold: "<path d=\"M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8\"/>",
	italic: "<path d=\"M19 4h-9M14 20H5M15 4 9 20\"/>",
	underline: "<path d=\"M6 4v6a6 6 0 0 0 12 0V4M4 20h16\"/>",
	strikeThrough: "<path d=\"M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6M4 12h16\"/>",
	highlight: "<path d=\"m9 11-6 6v3h9l3-3\"/><path d=\"m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4\"/>",
	insertUnorderedList: "<path d=\"M3 12h.01M3 18h.01M3 6h.01M8 12h13M8 18h13M8 6h13\"/>"
}, d = [
	{
		command: "bold",
		label: "Bold",
		key: "B"
	},
	{
		command: "italic",
		label: "Italic",
		key: "I"
	},
	{
		command: "underline",
		label: "Underline",
		key: "U"
	},
	{
		command: "strikeThrough",
		label: "Strikethrough"
	},
	{
		command: "highlight",
		label: "Highlight"
	}
], f = [
	{
		value: "p",
		label: "Text"
	},
	{
		value: "h2",
		label: "Heading"
	},
	{
		value: "h3",
		label: "Subheading"
	},
	{
		value: "blockquote",
		label: "Quote"
	}
], p = "rgb(48 164 108 / 0.3)", m = 10, h = `<h2>Launch notes</h2><p>Profiler v2 ships on <b>November 4</b>. Sampling moves to <span style="background-color: rgba(128, 128, 128, 0.3)">a timer signal</span> with no instrumentation, and <span style="background-color: ${p}">every crash report links to its trace</span>.</p><p>The old profiler stays one release behind a flag, so nobody has to switch on launch day.</p>`, g = class extends e {
	static styles = [
		n,
		i,
		a,
		l
	];
	static props = { doc: { default: h } };
	#e;
	#t = null;
	render() {
		return `<div class="toolbar" role="toolbar" aria-label="Format" hidden><div class="tools"><span class="block">${s("block-menu")}</span><span class="sep"></span>
${d.map((e) => `<button class="tool" type="button" data-command="${e.command}" aria-pressed="false" aria-label="${e.label}" tabindex="-1"${e.key ? ` title="${e.label} (Ctrl+${e.key})"` : ""}>${r(u[e.command], 18)}</button>`).join("")}<span class="sep"></span>
<button class="tool link" type="button" tabindex="-1">${r(o, 18)}<span>Link</span></button><button class="tool" type="button" data-command="insertUnorderedList" aria-pressed="false" aria-label="List" tabindex="-1">${r(u.insertUnorderedList, 18)}</button></div>
<form class="link-form" hidden><input class="url" type="url" placeholder="Paste a link and press Enter" aria-label="Link address"></form></div>
<article class="doc" contenteditable="true" aria-label="Notes"></article>`;
	}
	connected() {
		let e = { signal: this.signal };
		document.execCommand("styleWithCSS", !1, !0), this.#e = c(this.query(".block"), this.signal, (e) => this.#s("formatBlock", `<${e}>`)), this.query(".block .picker-trigger").tabIndex = 0;
		let t = this.query(".doc");
		document.addEventListener("selectionchange", () => this.#r(), e), t.addEventListener("input", () => this.emit("change", { html: t.innerHTML }), e), t.addEventListener("keydown", (e) => {
			e.altKey && e.key === "F10" && (e.preventDefault(), this.query(".toolbar:not([hidden]) .picker-trigger")?.focus());
		}, e);
		let n = this.query(".toolbar");
		n.addEventListener("pointerdown", (e) => e.target.closest(".url") || e.preventDefault(), e), n.addEventListener("click", (e) => {
			let t = e.target.closest(".tool");
			if (t) {
				if (t.classList.contains("link")) return this.#l();
				if (t.dataset.command === "highlight") return this.#c();
				this.#s(t.dataset.command);
			}
		}, e), n.addEventListener("keydown", (e) => this.#f(e), e), this.query(".link-form").addEventListener("submit", (e) => {
			e.preventDefault(), this.#u();
		}, e);
	}
	updated(e) {
		e.has("doc") && (this.query(".doc").innerHTML = this.doc ?? "");
	}
	get #n() {
		return this.shadowRoot.getSelection?.() ?? document.getSelection();
	}
	#r() {
		let e = this.query(".toolbar");
		if (this.shadowRoot.activeElement?.closest?.(".toolbar")) return;
		let t = this.#n, n = this.query(".doc"), r = t?.rangeCount ? t.getRangeAt(0) : null;
		if (!r || r.collapsed || !n.contains(r.commonAncestorContainer)) {
			e.hidden = !0, this.query(".link-form").hidden = !0;
			return;
		}
		this.#t = r.cloneRange(), e.hidden = !1;
		let i = r.getBoundingClientRect(), a = this.getBoundingClientRect(), o = e.offsetWidth, s = Math.min(Math.max(0, i.left + i.width / 2 - a.left - o / 2), a.width - o), c = i.top - a.top - e.offsetHeight - m;
		e.style.left = `${s}px`, e.style.top = `${c < 0 ? i.bottom - a.top + m : c}px`, this.#i();
	}
	#i() {
		for (let e of this.shadowRoot.querySelectorAll(".tool[data-command]")) {
			let t = e.dataset.command, n = t === "highlight" ? this.#a() : document.queryCommandState(t);
			e.ariaPressed = String(n);
		}
		let e = (document.queryCommandValue("formatBlock") || "p").toLowerCase();
		this.#e?.set(f, f.some((t) => t.value === e) ? e : "p");
	}
	#a() {
		let e = this.#n?.anchorNode;
		return (e?.nodeType === 1 ? e : e?.parentElement)?.closest("[style*=\"background-color\"]")?.style.backgroundColor.startsWith("rgba(48, 164, 108") ?? !1;
	}
	#o() {
		let e = this.#n;
		this.#t && e && (e.removeAllRanges(), e.addRange(this.#t));
	}
	#s(e, t) {
		this.#o(), document.execCommand(e, !1, t), this.#i(), this.emit("change", { html: this.query(".doc").innerHTML });
	}
	#c() {
		this.#s("hiliteColor", this.#a() ? "transparent" : p);
	}
	#l() {
		this.query(".tools").hidden = !0;
		let e = this.query(".link-form");
		e.hidden = !1, e.querySelector(".url").focus();
	}
	#u() {
		let e = this.query(".url").value.trim();
		this.#d(), e && this.#s("createLink", /^[a-z]+:/i.test(e) ? e : `https://${e}`);
	}
	#d() {
		this.query(".url").value = "", this.query(".link-form").hidden = !0, this.query(".tools").hidden = !1;
	}
	#f(e) {
		if (e.key === "Escape") {
			e.preventDefault(), this.#d(), this.query(".doc").focus(), this.#o();
			return;
		}
		if (e.target.closest(".url")) return;
		let t = {
			ArrowRight: 1,
			ArrowLeft: -1
		}[e.key];
		if (!t) return;
		e.preventDefault();
		let n = [this.query(".block .picker-trigger"), ...this.shadowRoot.querySelectorAll(".tools .tool")];
		n[(n.indexOf(this.shadowRoot.activeElement) + t + n.length) % n.length].focus();
	}
};
//#endregion
//#region src/components/format-toolbar/index.js
t("format-toolbar", g);
//#endregion
export { g as t };
