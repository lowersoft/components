import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { t as a } from "./platform-CKi8k97Y.js";
import { n as o, t as s } from "./highlight-BSyGT8bg.js";
import { J as c, R as l, ct as u, pt as d, vt as f } from "./lucide-BVbUPHVq.js";
//#region src/components/docs-search/docs-search.scss?inline
var p = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);--_ask:#12a594;box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:36rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:.5rem;display:block}p{margin:0}.search{color:var(--_muted);align-items:center;gap:.75rem;padding:.5rem .75rem .75rem;display:flex}.input{min-width:0;height:2.25rem;font:var(--lw-text-lg) var(--lw-font-sans);color:var(--lw-color-foreground);background:0 0;border:0;outline:none;flex:1}.input::placeholder{color:var(--_muted)}.input::-webkit-search-cancel-button{display:none}.count{white-space:nowrap}.results{border:1px solid var(--_line);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));overscroll-behavior:contain;border-radius:1rem;max-height:26rem;padding:.25rem;position:relative;overflow-y:auto}.results:has(.rows:empty){display:none}.highlight{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.highlight{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.highlight.visible{opacity:1}.highlight{background:color-mix(in oklab, var(--lw-color-foreground) 8%, transparent)}.ask,.result{border-radius:var(--lw-radius-md);cursor:pointer;gap:.75rem;padding:.75rem;display:flex;position:relative}.ask{font-size:var(--lw-text-md);align-items:center}.ask>svg{color:var(--_ask)}.ask q{color:var(--_muted)}.ask-text{flex:1;min-width:0}.keys{gap:.25rem;display:flex}kbd{--_edge:color-mix(in oklab, var(--lw-color-foreground) 22%, var(--lw-color-background));border:1px solid var(--_edge);border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--lw-color-foreground) 8%, var(--lw-color-background));min-width:1.5rem;height:1.5rem;box-shadow:0 2px 0 0 var(--_edge);color:inherit;font:inherit;justify-content:center;align-items:center;padding-inline:.375rem;font-size:.6875rem;line-height:1;display:inline-flex}@media (prefers-reduced-motion:no-preference){kbd{transition:translate var(--lw-duration-fast) var(--lw-ease-out), box-shadow var(--lw-duration-fast) var(--lw-ease-out)}}kbd[data-pressed]{box-shadow:none;transition-duration:75ms;translate:0 2px}kbd{font-family:var(--lw-font-mono)}.group-head{color:var(--_muted);align-items:center;gap:.5rem;padding:1rem .75rem .375rem;display:flex}.group-head svg{color:#8e4ec6}.group-count{margin-left:auto}.hash{color:var(--_muted);padding-top:.125rem;display:grid}.title{font-size:var(--lw-text-md)}.snippet{color:var(--_muted);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin-top:.375rem;line-height:1.5;display:-webkit-box;overflow:hidden}mark{color:var(--lw-color-foreground);-webkit-text-decoration:underline 1px color-mix(in oklab, var(--lw-color-foreground) 50%, transparent);text-decoration:underline 1px color-mix(in oklab, var(--lw-color-foreground) 50%, transparent);text-underline-offset:.25em;background:0 0}.title mark{font-weight:500}.none{color:var(--_muted);padding:1rem .75rem}", m = "<path d=\"M4 9h16M4 15h16M10 3 8 21M16 3l-2 18\"/>", h = {
	Authentication: l,
	Builds: d,
	Profiler: f
}, g = [
	{
		group: "Authentication",
		title: "Rotate a key",
		text: "Rotate a key from its menu. The old key keeps working for 24 hours so running builds finish, then it stops.",
		href: "#rotate"
	},
	{
		group: "Authentication",
		title: "Create an API key",
		text: "Create keys from Settings, API keys. Each key belongs to one workspace and can be limited to read or write.",
		href: "#create-key"
	},
	{
		group: "Authentication",
		title: "Revoke a leaked key",
		text: "If a key leaks, revoke it right away from its menu. Revoking is immediate and cannot be undone.",
		href: "#revoke"
	},
	{
		group: "Builds",
		title: "Cache a build between runs",
		text: "Builds keep their object cache for seven days. Set LOWER_CACHE to share it between machines.",
		href: "#cache"
	},
	{
		group: "Builds",
		title: "Cross-compile for ARM",
		text: "Pass --target aarch64-linux to any build. The toolchain is fetched once and kept with the cache.",
		href: "#cross"
	},
	{
		group: "Builds",
		title: "Sign a release binary",
		text: "Release builds are signed with the workspace key; rotate it like an API key when someone leaves.",
		href: "#sign"
	},
	{
		group: "Profiler",
		title: "Record a trace",
		text: "Run lower trace with your program after it. Sampling starts at once and costs under 2% of a core.",
		href: "#trace"
	},
	{
		group: "Profiler",
		title: "Read a flame graph",
		text: "Wide frames are where the time goes. Click one to zoom in; press the key F to fit it again.",
		href: "#flame"
	},
	{
		group: "Profiler",
		title: "Share a trace link",
		text: "Traces can be shared with a link that expires after a day, a week or never.",
		href: "#share"
	}
], _ = (e) => e.toLowerCase().match(/[a-z0-9]+/g) ?? [], v = /* @__PURE__ */ new Set([
	"a",
	"an",
	"the",
	"to",
	"of",
	"for",
	"and",
	"in",
	"on",
	"how",
	"do",
	"i"
]), y = (e, t) => n(e).replace(/[A-Za-z0-9]+/g, (e) => t.some((t) => e.toLowerCase().startsWith(t)) ? `<mark>${e}</mark>` : e), b = class extends e {
	static styles = [r, p];
	static props = {
		value: { default: "rotate api key" },
		sections: {
			type: Object,
			default: g
		}
	};
	#e = 0;
	#t = [];
	render() {
		let e = a ? "⌘" : "Ctrl";
		return `<label class="search">${i(u, 20)}<input class="input" type="search" role="combobox" aria-controls="results" aria-expanded="true" aria-autocomplete="list" aria-label="Search the docs" placeholder="Search the docs" autocomplete="off" spellcheck="false"><span class="count" aria-live="polite"></span></label>
<div class="results" id="results" role="listbox" aria-label="Results"><span class="highlight"></span><div class="rows"></div></div><template class="keys"><kbd>${e}</kbd><kbd>↵</kbd></template>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".input");
		t.addEventListener("input", () => {
			this.#e = 0, this.#i();
		}, e), t.addEventListener("keydown", (e) => this.#s(e), e);
		let n = this.query(".results");
		n.addEventListener("click", (e) => {
			let t = e.target.closest("[data-row]");
			t && this.#o(Number(t.dataset.row));
		}, e), n.addEventListener("pointermove", (e) => {
			let t = e.target.closest("[data-row]");
			t && Number(t.dataset.row) !== this.#e && (this.#e = Number(t.dataset.row), this.#a());
		}, e);
	}
	updated(e) {
		e.has("value") && (this.query(".input").value = this.value ?? ""), this.#i();
	}
	get #n() {
		return _(this.query(".input").value).filter((e) => !v.has(e));
	}
	get #r() {
		let e = this.#n;
		return e.length ? this.sections.map((t) => {
			let n = _(t.title), r = _(t.text), i = (e, t) => e.some((e) => e.startsWith(t));
			return {
				section: t,
				score: e.reduce((e, t) => e + (i(n, t) ? 2 : 0) + +!!i(r, t), 0)
			};
		}).filter((e) => e.score > 0).sort((e, t) => t.score - e.score) : [];
	}
	#i() {
		let e = this.query(".input").value.trim(), t = this.#n, r = this.#r;
		this.query(".count").textContent = e ? `${r.length} ${r.length === 1 ? "section" : "sections"}` : "";
		let a = [];
		for (let { section: e } of r) {
			let t = a.find((t) => t.name === e.group);
			t || a.push(t = {
				name: e.group,
				sections: []
			}), t.sections.push(e);
		}
		this.#t = [];
		let o = "";
		e && (this.#t.push({ ask: e }), o += `<div class="ask" role="option" id="row-0" data-row="0">${i(c, 20)}<span class="ask-text">Ask the docs <q>${n(e)}</q></span><span class="keys">${this.query(".keys").innerHTML}</span></div>`);
		for (let e of a) {
			o += `<div class="group" role="group" aria-label="${n(e.name)}"><p class="group-head" aria-hidden="true">${i(h[e.name] ?? m, 15)}<span>${n(e.name)}</span><span class="group-count">${e.sections.length}</span></p>`;
			for (let n of e.sections) {
				let e = this.#t.push({ section: n }) - 1;
				o += `<div class="result" role="option" id="row-${e}" data-row="${e}"><span class="hash" aria-hidden="true">${i(m, 16)}</span><div><p class="title">${y(n.title, t)}</p><p class="snippet">${y(n.text, t)}</p></div></div>`;
			}
			o += "</div>";
		}
		e && !r.length && (o += "<p class=\"none\">No sections match. Ask the docs instead.</p>"), this.query(".rows").innerHTML = o, this.#a();
	}
	#a() {
		let e = [...this.shadowRoot.querySelectorAll("[data-row]")];
		this.#e = Math.min(this.#e, Math.max(0, e.length - 1)), e.forEach((e, t) => e.ariaSelected = String(t === this.#e));
		let t = e[this.#e], n = this.query(".input");
		t ? (o(this.query(".highlight"), t), t.scrollIntoView({ block: "nearest" }), n.setAttribute("aria-activedescendant", t.id)) : (s(this.query(".highlight")), n.removeAttribute("aria-activedescendant"));
	}
	#o(e) {
		let t = this.#t[e];
		t && (t.ask ? this.emit("ask", { question: t.ask }) : this.emit("open", { section: t.section }));
	}
	#s(e) {
		let t = this.#t.length, n = {
			ArrowDown: 1,
			ArrowUp: -1
		}[e.key];
		n && t ? (e.preventDefault(), this.#e = (this.#e + n + t) % t, this.#a()) : e.key === "Enter" && (e.preventDefault(), (a ? e.metaKey : e.ctrlKey) && this.#t[0]?.ask ? this.#o(0) : this.#o(this.#e));
	}
};
//#endregion
//#region src/components/docs-search/index.js
t("docs-search", b);
//#endregion
export { b as t };
