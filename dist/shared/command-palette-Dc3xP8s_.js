import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { t as a } from "./platform-CKi8k97Y.js";
import { i as o, o as s } from "./shortcut-kjm7vAXW.js";
import { r as c } from "./theme-D-ctQQvB.js";
import { n as l, t as u } from "./highlight-BSyGT8bg.js";
import { n as d, t as f } from "./people-C_zYMoEl.js";
import { Ct as p, E as m, at as h, ct as g, ht as _, m as v } from "./lucide-BVbUPHVq.js";
//#region src/components/command-palette/command-palette.scss?inline
var y = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:26rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:.5rem;display:block}p{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}kbd{--_edge:color-mix(in oklab, var(--lw-color-foreground) 22%, var(--lw-color-background));border:1px solid var(--_edge);border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--lw-color-foreground) 8%, var(--lw-color-background));min-width:1.5rem;height:1.5rem;box-shadow:0 2px 0 0 var(--_edge);color:inherit;font:inherit;justify-content:center;align-items:center;padding-inline:.375rem;font-size:.6875rem;line-height:1;display:inline-flex}@media (prefers-reduced-motion:no-preference){kbd{transition:translate var(--lw-duration-fast) var(--lw-ease-out), box-shadow var(--lw-duration-fast) var(--lw-ease-out)}}kbd[data-pressed]{box-shadow:none;transition-duration:75ms;translate:0 2px}kbd{min-width:1.25rem;height:1.25rem;font-family:var(--lw-font-mono);font-size:.625rem}.search{color:var(--_muted);align-items:center;gap:.5rem;padding:.375rem .5rem;display:flex}.scope{border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--lw-color-foreground) 10%, transparent);color:var(--lw-color-foreground);flex:none;align-items:center;gap:.125rem;padding:.125rem .375rem;display:inline-flex}.scope[hidden]{display:none}.query{min-width:0;height:2rem;font:var(--lw-text-md) var(--lw-font-sans);color:var(--lw-color-foreground);background:0 0;border:0;outline:none;flex:1}.query::placeholder{color:var(--_muted)}.keys{gap:.25rem;display:flex}.tabs{gap:.25rem;padding:.25rem .25rem .5rem;display:flex}.tabs[hidden]{display:none}.tab{border-radius:var(--lw-radius-md);color:var(--_muted);cursor:pointer;background:0 0;border:0;gap:.375rem;padding:.375rem .625rem;display:inline-flex}.tab[aria-selected=true]{background:var(--lw-color-foreground);color:var(--lw-color-background)}.tab-count{font-size:var(--lw-text-xs);opacity:.6}.results{border:1px solid var(--_line);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));overscroll-behavior:contain;border-radius:.875rem;max-height:17rem;padding:.25rem;position:relative;overflow-y:auto}.highlight{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.highlight{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.highlight.visible{opacity:1}.highlight{background:color-mix(in oklab, var(--lw-color-foreground) 8%, transparent)}.group-title{font-size:var(--lw-text-xs);color:var(--_muted);padding:.75rem .625rem .375rem}.item{border-radius:var(--lw-radius-md);font-size:var(--lw-text-md);cursor:pointer;align-items:center;gap:.75rem;padding:.5rem .625rem;display:flex;position:relative}.item>svg{color:var(--_muted);flex:none}.label{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.parent{color:var(--_muted)}.person{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));border-radius:50%;flex:none;place-items:center;width:1.25rem;height:1.25rem;font-size:.5rem;font-weight:600;display:grid}.swatch{border-radius:3px;flex:none;width:.625rem;height:.625rem;margin:0 .1875rem}.item-keys{gap:.25rem;display:flex}.none{text-align:center;color:var(--_muted);padding:1.5rem}.none[hidden]{display:none}.foot{font-size:var(--lw-text-xs);color:var(--_muted);align-items:center;gap:1rem;padding:.625rem .5rem .25rem;display:flex}.foot span{align-items:center;gap:.25rem;display:inline-flex}.foot b{color:var(--lw-color-foreground);font-weight:500}.scopes{margin-left:auto}", b = "<path d=\"M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z\"/>", x = "<path d=\"M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20\"/>", S = s("mod+k"), C = [
	{
		id: "",
		label: "All"
	},
	{
		id: "action",
		label: "Actions",
		prefix: ">"
	},
	{
		id: "page",
		label: "Pages",
		prefix: "#"
	},
	{
		id: "person",
		label: "People",
		prefix: "@"
	}
], w = [
	{
		id: "new-issue",
		kind: "action",
		label: "New issue",
		icon: h,
		keys: "c"
	},
	{
		id: "rename",
		kind: "action",
		label: "Rename page",
		icon: b,
		keys: "f2"
	},
	{
		id: "move",
		kind: "action",
		label: "Move to",
		icon: x,
		children: [
			{
				id: "runtime",
				label: "Runtime",
				color: "#3b82f6"
			},
			{
				id: "profiler",
				label: "Profiler",
				color: "#8e4ec6"
			},
			{
				id: "toolchain",
				label: "Toolchain",
				color: "#f59e0b"
			}
		]
	},
	{
		id: "theme",
		kind: "action",
		label: "Change theme",
		icon: _,
		children: [
			{
				id: "system",
				label: "System"
			},
			{
				id: "light",
				label: "Light"
			},
			{
				id: "dark",
				label: "Dark"
			}
		]
	},
	{
		id: "invite",
		kind: "action",
		label: "Invite teammates",
		icon: p
	},
	{
		id: "copy-link",
		kind: "action",
		label: "Copy link to page",
		icon: m,
		keys: "mod+shift+c"
	},
	{
		id: "p-roadmap",
		kind: "page",
		label: "Roadmap 2027",
		icon: m
	},
	{
		id: "p-profiler",
		kind: "page",
		label: "Profiler v2 spec",
		icon: m
	},
	{
		id: "p-release",
		kind: "page",
		label: "Release checklist",
		icon: m
	},
	{
		id: "p-oncall",
		kind: "page",
		label: "On-call runbook",
		icon: m
	},
	{
		id: "u-maya",
		kind: "person",
		label: "Maya Chen"
	},
	{
		id: "u-theo",
		kind: "person",
		label: "Theo Park"
	},
	{
		id: "u-ana",
		kind: "person",
		label: "Ana Ruiz"
	},
	{
		id: "u-sam",
		kind: "person",
		label: "Sam Okafor"
	}
], T = 3, E = class extends e {
	static styles = [r, y];
	static props = { commands: {
		type: Object,
		default: w
	} };
	#e = "";
	#t = null;
	#n = 0;
	#r = [];
	#i = [
		{ id: "rename" },
		{
			id: "move",
			value: "profiler"
		},
		{
			id: "theme",
			value: "dark"
		}
	];
	render() {
		let e = a ? "⌘" : "Ctrl";
		return `<div class="search">${i(g, 18)}<span class="scope" hidden></span><input class="query" type="text" role="combobox" aria-controls="results" aria-expanded="true" aria-autocomplete="list" placeholder="Search or type a command…" aria-label="Search or type a command" autocomplete="off" spellcheck="false"><span class="keys" aria-hidden="true"><kbd>${e}</kbd><kbd>K</kbd></span></div>
<div class="tabs" role="tablist" aria-label="Show">${C.map((e) => `<button class="tab" type="button" role="tab" data-kind="${e.id}">${e.label}<span class="tab-count"></span></button>`).join("")}</div>
<div class="results" id="results" role="listbox" aria-label="Results"><span class="highlight"></span><div class="groups"></div><p class="none" hidden>No results. Try another word.</p></div>
<footer class="foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> run</span><span class="scopes">Type <b>&gt;</b> <b>#</b> <b>@</b> to scope</span></footer><p class="live visually-hidden" aria-live="polite"></p>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".query");
		t.addEventListener("input", () => {
			this.#n = 0, this.#s();
		}, e), t.addEventListener("keydown", (e) => this.#d(e), e), this.query(".tabs").addEventListener("click", (e) => {
			let n = e.target.closest(".tab");
			n && (this.#e = n.dataset.kind, this.#n = 0, this.#s(), t.focus());
		}, e);
		let n = this.query(".results");
		n.addEventListener("click", (e) => {
			let t = e.target.closest(".item");
			t && this.#u(Number(t.dataset.index));
		}, e), n.addEventListener("pointermove", (e) => {
			let t = e.target.closest(".item");
			t && Number(t.dataset.index) !== this.#n && (this.#n = Number(t.dataset.index), this.#l());
		}, e), document.addEventListener("keydown", (e) => {
			o(e, S) && (e.preventDefault(), t.focus(), t.select());
		}, e);
	}
	updated() {
		this.#s();
	}
	get #a() {
		let e = this.query(".query").value, t = C.find((t) => t.prefix && e.startsWith(t.prefix));
		return {
			term: (t ? e.slice(1) : e).trim().toLowerCase(),
			kind: t?.id ?? this.#e
		};
	}
	get #o() {
		let { term: e, kind: t } = this.#a, n = (t) => !e || t.toLowerCase().includes(e);
		if (this.#t) return [{
			title: this.#t.label,
			items: this.#t.children.filter((e) => n(e.label)).map((e) => ({
				command: this.#t,
				child: e
			}))
		}];
		let r = [];
		if (!e && !t) {
			let e = this.#i.map((e) => {
				let t = this.commands.find((t) => t.id === e.id);
				return t && {
					command: t,
					child: t.children?.find((t) => t.id === e.value),
					recent: !0
				};
			}).filter(Boolean);
			e.length && r.push({
				title: "Recent",
				items: e
			});
		}
		for (let e of C.slice(1)) {
			if (t && t !== e.id) continue;
			let i = this.commands.filter((t) => t.kind === e.id && n(t.label)).map((e) => ({ command: e }));
			i.length && r.push({
				title: e.label,
				items: i
			});
		}
		return r;
	}
	#s() {
		let { term: e } = this.#a, t = this.query(".scope");
		t.hidden = !this.#t, t.innerHTML = this.#t ? `${n(this.#t.label)}${i(v, 14)}` : "", this.query(".tabs").hidden = !!this.#t;
		for (let t of this.shadowRoot.querySelectorAll(".tab")) {
			let n = t.dataset.kind;
			t.ariaSelected = String(n === this.#a.kind), t.querySelector(".tab-count").textContent = String(this.commands.filter((t) => (!n || t.kind === n) && (!e || t.label.toLowerCase().includes(e))).length);
		}
		let r = 0, a = this.#o;
		this.#r = a.flatMap((e) => e.items), this.query(".groups").innerHTML = a.map((e) => `<section class="group" role="group" aria-label="${n(e.title)}"><p class="group-title" aria-hidden="true">${n(e.title)}</p>${e.items.map((e) => this.#c(e, r++)).join("")}</section>`).join(""), this.query(".none").hidden = this.#r.length > 0, this.#n = Math.min(this.#n, Math.max(0, this.#r.length - 1)), this.#l();
	}
	#c({ command: e, child: t, recent: r }, a) {
		return `<div class="item" role="option" id="option-${a}" data-index="${a}" aria-selected="false">${e.kind === "person" ? `<span class="person" style="--_hue: ${f(e.label)}">${n(d(e.label))}</span>` : t?.color ? `<span class="swatch" style="background: ${n(t.color)}"></span>` : i(e.icon ?? "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"M10 9H8\"/><path d=\"M16 13H8\"/><path d=\"M16 17H8\"/>", 16)}<span class="label">${t && (r || this.#t) ? r ? `<span class="parent">${n(e.label)} ›</span> ${n(t.label)}` : n(t.label) : n(e.label)}</span>${!t && e.keys ? `<span class="item-keys">${s(e.keys).labels.map((e) => `<kbd>${n(e)}</kbd>`).join("")}</span>` : ""}${!t && e.children ? i(v, 15) : ""}</div>`;
	}
	#l() {
		let e = [...this.shadowRoot.querySelectorAll(".item")];
		e.forEach((e, t) => e.ariaSelected = String(t === this.#n));
		let t = e[this.#n], n = this.query(".query"), r = this.query(".highlight");
		t ? (l(r, t), t.scrollIntoView({ block: "nearest" }), n.setAttribute("aria-activedescendant", t.id)) : (u(r), n.removeAttribute("aria-activedescendant"));
	}
	#u(e) {
		let t = this.#r[e];
		if (!t) return;
		let { command: n, child: r } = t;
		n.children && !r ? (this.#t = n, this.query(".query").value = "", this.#n = 0, this.#s(), this.query(".live").textContent = `${n.label}: choose one`) : (n.id === "theme" && r && c(r.id), this.#i = [{
			id: n.id,
			value: r?.id
		}, ...this.#i.filter((e) => e.id !== n.id || e.value !== r?.id)].slice(0, T), this.#t = null, this.query(".query").value = "", this.#n = 0, this.#s(), this.query(".live").textContent = `${n.label}${r ? ` ${r.label}` : ""}: done`, this.emit("run", {
			id: n.id,
			value: r?.id
		}));
	}
	#d(e) {
		let t = this.#r.length, n = {
			ArrowDown: 1,
			ArrowUp: -1
		}[e.key];
		if (n && t) e.preventDefault(), this.#n = (this.#n + n + t) % t, this.#l();
		else if (e.key === "Enter") e.preventDefault(), this.#u(this.#n);
		else if (e.key === "Backspace" && !e.target.value || e.key === "Escape") {
			if (!this.#t && !(e.key === "Escape" && e.target.value)) return;
			e.preventDefault(), this.#t && !e.target.value ? this.#t = null : e.target.value = "", this.#n = 0, this.#s();
		}
	}
};
//#endregion
//#region src/components/command-palette/index.js
t("command-palette", E);
//#endregion
export { E as t };
