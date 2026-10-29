import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { t as i } from "./platform-CKi8k97Y.js";
import { n as a, t as o } from "./highlight-BSyGT8bg.js";
import { t as s } from "./clipboard-BCkfa02P.js";
import { n as c, t as l } from "./people-C_zYMoEl.js";
import { B as u, L as d, bt as f, ct as p, ft as m, vt as h } from "./lucide-BVbUPHVq.js";
import { n as g, r as _ } from "./hero-CAqTQjEL.js";
//#region src/components/product-stage-hero/product-stage-hero.scss?inline
var v = ":host{--_ink:var(--lw-color-foreground);--_muted:var(--lw-color-muted-foreground);--_surface:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));--_line:var(--lw-color-border);--_ease:cubic-bezier(.23, 1, .32, 1);box-sizing:border-box;background:var(--lw-color-background);width:100%;min-height:760px;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);justify-content:center;align-items:flex-start;padding:6rem clamp(1.5rem,5vw,4rem) 0;display:flex;position:relative;overflow:hidden;container-type:inline-size}.container{width:100%;max-width:72rem;margin-inline:auto;position:relative}.intro{gap:2rem;display:grid}@container (width>=56rem){.intro{grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);align-items:center;column-gap:4rem}}.title{letter-spacing:-.05em;text-wrap:balance;margin:0;font-size:clamp(3rem,7vw,5.75rem);font-weight:600;line-height:.95}::slotted([slot=eyebrow]){margin-bottom:1.25rem}.description{max-width:30rem;font-size:var(--lw-text-lg);text-wrap:pretty;color:var(--lw-color-muted-foreground);margin:0;line-height:1.6}.actions{flex-wrap:wrap;align-items:center;gap:.75rem;margin-top:2rem;display:flex}.primary::part(button),.secondary::part(button){border-radius:var(--lw-radius-full)}.window{border:1px solid var(--lw-color-border);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));height:100%;font-size:var(--lw-text-sm);border-radius:1rem;overflow:hidden}.bar{border-bottom:1px solid var(--lw-color-border);align-items:center;gap:.75rem;height:3.25rem;padding:0 1rem;display:flex}.logo{background:var(--lw-color-foreground);width:1.5rem;height:1.5rem;font-size:var(--lw-text-xs);color:var(--lw-color-background);border-radius:.375rem;flex:none;place-items:center;font-weight:700;display:grid}.crumbs{white-space:nowrap;align-items:center;min-width:0;display:flex}.crumbs span+span:before{content:\"/\";color:color-mix(in oklab, var(--lw-color-muted-foreground) 60%, transparent);margin:0 .625rem}.stage{height:34rem;margin:4.5rem -2rem 0;padding:0 2rem;position:relative;-webkit-mask-image:linear-gradient(#000 45%,#0000 96%);mask-image:linear-gradient(#000 45%,#0000 96%)}kbd{font:.6875rem var(--lw-font-mono);color:var(--_muted)}.product{font-weight:600}.team{color:var(--_muted)}.cycle{font-weight:500}.range{border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--_ink) 6%, transparent);font-size:var(--lw-text-xs);white-space:nowrap;color:var(--_muted);padding:.25rem .5rem;display:none}@container (width>=48rem){.range{display:inline}}.search{border:1px solid var(--_line);border-radius:var(--lw-radius-md);background:var(--lw-color-background);width:15rem;height:2rem;font:inherit;color:var(--_muted);cursor:text;outline:none;align-items:center;gap:.5rem;margin-left:auto;padding:0 .625rem;display:none}@container (width>=64rem){.search{display:flex}}.search:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.search span{text-align:left;flex:1}.people{margin-left:auto;display:none}@container (width>=48rem){.people{display:flex}}.search~.people{margin-left:0}.people .avatar+.avatar{margin-left:-.375rem}.people .avatar{box-shadow:0 0 0 2px var(--_surface)}.avatar{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));border-radius:50%;flex:none;place-items:center;width:1.5rem;height:1.5rem;font-size:.5625rem;font-weight:600;display:inline-grid}.app{height:calc(100% - 3.25rem);display:grid}@container (width>=48rem){.app{grid-template-columns:12rem minmax(0,1fr)}}@container (width>=64rem){.app{grid-template-columns:13rem minmax(0,1fr) 21rem}}.sidebar{border-right:1px solid var(--_line);color:var(--_muted);flex-direction:column;gap:.125rem;padding:.75rem;display:none}@container (width>=48rem){.sidebar{display:flex}}.sidebar a{border-radius:var(--lw-radius-md);align-items:center;gap:.625rem;padding:.5rem .625rem;display:flex}.sidebar a[aria-current]{background:color-mix(in oklab, var(--_ink) 7%, transparent);color:var(--_ink)}.sidebar .count{font-size:var(--lw-text-xs);margin-left:auto}.list{outline:none;min-width:0;position:relative}.list:focus-visible{box-shadow:inset 0 0 0 2px var(--lw-color-ring)}.highlight{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.highlight{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.highlight.visible{opacity:1}.highlight{background:color-mix(in oklab, var(--_ink) 6%, transparent);border-radius:0}.group-head{border-bottom:1px solid var(--_line);background:color-mix(in oklab, var(--_ink) 3%, transparent);align-items:center;gap:.5rem;margin:0;padding:.625rem 1rem;font-weight:500;display:flex;position:relative}.group-head .count{color:var(--_muted);font-weight:400}.row{border-bottom:1px solid var(--_line);cursor:pointer;align-items:center;gap:.75rem;padding:.75rem 1rem;display:flex;position:relative}.issue-id{width:4rem;font:var(--lw-text-xs) var(--lw-font-mono);color:var(--_muted);flex:none}.issue-title{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.chips{flex:none;gap:.375rem;display:none}@container (width>=40rem){.chips{display:flex}}.due{width:3.25rem;font-size:var(--lw-text-xs);color:var(--_muted);flex:none;display:none}@container (width>=40rem){.due{display:block}}.chip{border:1px solid var(--_line);border-radius:var(--lw-radius-full);font-size:var(--lw-text-xs);white-space:nowrap;color:var(--_muted);align-items:center;gap:.375rem;padding:.125rem .5rem;display:inline-flex}.chip:before{content:\"\";background:oklch(.7 .15 var(--_hue));border-radius:50%;width:.375rem;height:.375rem}.priority{flex:none;align-items:flex-end;gap:2px;height:.75rem;display:inline-flex}.priority i{background:color-mix(in oklab, var(--_ink) 20%, transparent);border-radius:1px;width:3px}.priority i:first-child{height:25%}.priority i:nth-child(2){height:50%}.priority i:nth-child(3){height:75%}.priority i:nth-child(4){height:100%}.priority i[data-on]{background:var(--_muted)}.status-icon{--_tint:var(--_muted);box-sizing:border-box;border:1.5px solid var(--_tint);background:conic-gradient(var(--_tint) var(--_fill,0turn), transparent 0) content-box;border-radius:50%;flex:none;width:.875rem;height:.875rem;padding:1.5px}.status-icon[data-status=\"0\"]{--_fill:.5turn;--_tint:#f59e0b}.status-icon[data-status=\"1\"]{--_fill:.75turn;--_tint:#2dd4bf}.status-icon[data-status=\"3\"]{border-style:dashed}.status-icon[data-status=\"4\"]{--_fill:1turn;--_tint:#818cf8}.detail{border-left:1px solid var(--_line);padding:1.75rem 1.5rem;display:none}@container (width>=64rem){.detail{display:block}}.detail-id{font:var(--lw-text-xs) var(--lw-font-mono);color:var(--_muted);margin:0}.detail-title{letter-spacing:-.015em;margin:.75rem 0 0;font-size:1.25rem;font-weight:600;line-height:1.3}.fields code{font:var(--lw-text-xs) var(--lw-font-mono);color:var(--_muted)}.detail-text{color:var(--_muted);margin:1rem 0 0;line-height:1.6}.fields{grid-template-columns:5.5rem 1fr;gap:.75rem 1rem;margin:1.5rem 0 0;display:grid}.fields div{display:contents}.fields dt{color:var(--_muted)}.fields dd{flex-wrap:wrap;align-items:center;gap:.5rem;margin:0;display:flex}.menu{border:1px solid var(--_line);background:var(--lw-color-background);width:min(22rem,100% - 5rem);box-shadow:var(--lw-shadow-md), 0 24px 48px -24px #00000059;font-size:var(--lw-text-sm);border-radius:.75rem;position:absolute;top:22rem;left:2.5rem}@container (width>=64rem){.menu{left:.5rem}}.menu-search{border-bottom:1px solid var(--_line);align-items:center;gap:.625rem;padding:.75rem;display:flex}.target{border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--_ink) 8%, transparent);font:.6875rem var(--lw-font-mono);color:var(--_muted);flex:none;padding:.125rem .375rem}.command-input{min-width:0;font:inherit;color:inherit;background:0 0;border:0;outline:none;flex:1;padding:0}.commands{padding:.375rem;position:relative}.commands .highlight{border-radius:var(--lw-radius-md)}.command{cursor:pointer;justify-content:space-between;align-items:center;gap:.75rem;padding:.5rem .625rem;display:flex;position:relative}.keys{gap:.375rem;display:flex}.empty{color:var(--_muted);margin:0;padding:.75rem}.toast{background:var(--lw-color-primary);box-shadow:var(--lw-shadow-md);font-size:var(--lw-text-sm);color:var(--lw-color-primary-foreground);opacity:0;pointer-events:none;border-radius:.625rem;align-items:center;gap:1rem;padding:.625rem .75rem .625rem 1rem;display:flex;position:absolute;top:4.25rem;right:3rem;translate:0 -.5rem}@media (prefers-reduced-motion:no-preference){.toast{transition:opacity .25s var(--_ease), translate .25s var(--_ease)}}.toast[data-shown]{opacity:1;pointer-events:auto;translate:0}.undo{border-radius:var(--lw-radius-sm);background:color-mix(in oklab, currentColor 14%, transparent);font:inherit;color:inherit;cursor:pointer;border:0;outline:none;padding:.25rem .5rem;font-weight:500}.undo:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.undo[hidden]{display:none}", y = [
	"In progress",
	"In review",
	"Todo",
	"Backlog",
	"Done"
], b = i ? "⌘" : "Ctrl", x = [
	"Maya Kerr",
	"Jon Barros",
	"Ada Finch",
	"Leo Okafor"
], S = x[0], C = {
	Renderer: 250,
	Memory: 15,
	Perf: 75,
	Crash: 0,
	Platform: 295,
	Build: 160
}, w = [
	{
		id: "LOW-482",
		title: "Segfault resizing the window on Wayland",
		status: "In progress",
		priority: 4,
		assignee: "Maya Kerr",
		labels: ["Crash", "Platform"],
		due: "Oct 17",
		target: "linux-x86_64",
		description: "The swapchain is recreated while a frame still holds the old surface. Wait on the in-flight fence before tearing it down."
	},
	{
		id: "LOW-476",
		title: "Font atlas leaks on every theme switch",
		status: "In progress",
		priority: 3,
		assignee: "Ada Finch",
		labels: ["Memory"],
		due: "Oct 18",
		target: "all",
		description: "Each switch allocates a new atlas and never frees the old one: 4 MB a time. Reuse the glyph pages and free on swap."
	},
	{
		id: "LOW-479",
		title: "SIMD path for the blur kernel",
		status: "In review",
		priority: 2,
		assignee: "Jon Barros",
		labels: ["Perf", "Renderer"],
		due: "Oct 16",
		target: "x86_64, arm64",
		description: "The scalar blur takes 6 ms per frame at 4K. AVX2 and NEON paths bring it under 1 ms with the same output."
	},
	{
		id: "LOW-471",
		title: "Cut cold start below 10 ms",
		status: "Todo",
		priority: 2,
		assignee: "Leo Okafor",
		labels: ["Perf"],
		due: "Oct 22",
		target: "all",
		description: "Startup spends 14 ms loading fonts eagerly. Map the font files lazily and build the atlas on first draw."
	},
	{
		id: "LOW-468",
		title: "Reproducible release builds",
		status: "Todo",
		priority: 1,
		assignee: "Maya Kerr",
		labels: ["Build"],
		due: "Oct 24",
		target: "all",
		description: "Two builds of the same commit differ by their timestamps. Pin SOURCE_DATE_EPOCH and sort the archive members."
	}
], T = [
	{
		label: "Inbox",
		icon: d,
		count: 3
	},
	{
		label: "My issues",
		icon: u,
		count: 7
	},
	{
		label: "Releases",
		icon: h,
		current: !0
	},
	{
		label: "Crashes",
		icon: f,
		count: 2
	},
	{
		label: "Board",
		icon: m
	}
], E = (e, t) => e[(e.indexOf(t) + 1) % e.length], D = [
	{
		id: "assign",
		label: () => `Assign to ${S}`,
		keys: ["A"],
		apply: () => ({ assignee: S }),
		says: () => `assigned to ${S}`
	},
	{
		id: "status",
		label: (e) => `Change status to ${E(y, e.status)}`,
		keys: ["S"],
		apply: (e) => ({ status: E(y, e.status) }),
		says: (e) => `moved to ${e.status}`
	},
	{
		id: "priority",
		label: () => "Raise priority",
		keys: ["P"],
		apply: (e) => ({ priority: (e.priority + 1) % 5 }),
		says: () => "priority raised"
	},
	{
		id: "done",
		label: () => "Mark as done",
		keys: [b, "D"],
		apply: () => ({ status: "Done" }),
		says: () => "marked as done"
	},
	{
		id: "copy",
		label: () => "Copy issue link",
		keys: [b, "."],
		apply: () => ({}),
		says: () => "link copied"
	}
], O = (e) => `<span class="avatar" style="--_hue: ${l(e)}" title="${n(e)}">${n(c(e))}</span>`, k = (e) => `<span class="status-icon" data-status="${y.indexOf(e)}" aria-hidden="true"></span>`, A = (e) => `<span class="priority" aria-label="Priority ${e} of 4">${[
	1,
	2,
	3,
	4
].map((t) => `<i${t <= e ? " data-on" : ""}></i>`).join("")}</span>`, j = (e) => `<span class="chip" style="--_hue: ${C[e] ?? 0}">${n(e)}</span>`, M = class extends e {
	static styles = v;
	static props = {
		heading: { default: "Fix it before it ships." },
		description: { default: "Triage crashes, plan releases and land patches for lower from one keyboard-first workspace. Targets and stack traces sit beside every issue, and nothing waits on a spinner." },
		product: { default: "lower" },
		team: { default: "Core" },
		cycle: { default: "Release 0.9" },
		range: { default: "Oct 13 – Oct 24" },
		progress: {
			type: Number,
			default: 64
		},
		issues: {
			type: Object,
			default: w
		},
		issue: { default: w[0].id }
	};
	#e = 0;
	#t = null;
	render() {
		return `<div class="container">
${g("Start tracking", "Read the changelog")}
<div class="stage">
<div class="window">
<header class="bar"><span class="logo" aria-hidden="true"></span><nav class="crumbs" aria-label="Location"><span class="product"></span><span class="team"></span><span class="cycle"></span></nav><span class="range"></span>
<button class="search" type="button">${r(p, 16)}<span>Search issues</span><kbd>${b} K</kbd></button><span class="people" aria-label="Team">${x.map(O).join("")}</span></header>
<div class="app">
<nav class="sidebar" aria-label="Views">${T.map((e) => `<a${e.current ? " aria-current=\"page\"" : ""}>${r(e.icon, 16)}<span>${e.label}</span>${e.count ? `<span class="count">${e.count}</span>` : ""}</a>`).join("")}</nav>
<div class="list" role="listbox" tabindex="0" aria-label="Issues"><span class="highlight"></span><div class="groups"></div></div>
<article class="detail" aria-live="polite"></article></div></div>
<div class="menu" role="dialog" aria-label="Command menu"><div class="menu-search"><span class="target"></span><input class="command-input" placeholder="Type a command…" aria-label="Command" role="combobox" aria-controls="commands" aria-expanded="true" autocomplete="off"></div>
<div class="commands" id="commands" role="listbox"><span class="highlight"></span><div class="command-rows"></div></div></div>
<div class="toast" role="status"><span class="toast-text"></span><button class="undo" type="button">Undo</button></div>
</div></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".list");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".row");
			t && this.#c(t.dataset.id);
		}, e), t.addEventListener("keydown", (e) => this.#l(e), e);
		let n = this.query(".command-input"), r = () => {
			n.focus(), n.select();
		};
		this.query(".search").addEventListener("click", r, e), n.addEventListener("input", () => {
			this.#e = 0, this.#o();
		}, e), n.addEventListener("keydown", (e) => this.#u(e), e);
		let a = this.query(".command-rows");
		a.addEventListener("click", (e) => {
			let t = e.target.closest(".command");
			t && this.#d(t.dataset.id);
		}, e), a.addEventListener("pointermove", (e) => {
			let t = e.target.closest(".command");
			t && (this.#e = [...a.children].indexOf(t), this.#s());
		}, e), this.query(".undo").addEventListener("click", () => this.#p(), e), this.addEventListener("keydown", (e) => {
			e.key.toLowerCase() === "k" && (i ? e.metaKey : e.ctrlKey) && (e.preventDefault(), r());
		}, e);
	}
	updated(e) {
		_(this), this.query(".logo").textContent = (this.product ?? "").charAt(0), this.query(".product").textContent = this.product ?? "", this.query(".team").textContent = this.team ?? "", this.query(".cycle").textContent = this.cycle ?? "", this.query(".range").textContent = `${this.range} · ${this.progress}%`, (e.has("issues") || e.has("issue")) && this.#i();
	}
	get #n() {
		return this.issues.find((e) => e.id === this.issue) ?? this.issues[0];
	}
	get #r() {
		return y.flatMap((e) => this.issues.filter((t) => t.status === e));
	}
	#i() {
		let e = this.#n;
		if (this.query(".groups").innerHTML = y.map((t) => {
			let r = this.issues.filter((e) => e.status === t);
			if (!r.length) return "";
			let i = r.map((t) => `<div class="row" role="option" id="issue-${n(t.id)}" data-id="${n(t.id)}" aria-selected="${t === e}">${A(t.priority)}<span class="issue-id">${n(t.id)}</span>${k(t.status)}<span class="issue-title">${n(t.title)}</span><span class="chips">${(t.labels ?? []).map(j).join("")}</span><span class="due">${n(t.due ?? "")}</span>${O(t.assignee)}</div>`).join("");
			return `<div class="group" role="group" aria-label="${t}"><p class="group-head">${k(t)}${t}<span class="count">${r.length}</span></p>${i}</div>`;
		}).join(""), this.query(".list").setAttribute("aria-activedescendant", `issue-${e?.id ?? ""}`), requestAnimationFrame(() => a(this.query(".list .highlight"), this.query(".row[aria-selected=\"true\"]"))), !e) return;
		let t = (e, t) => `<div><dt>${e}</dt><dd>${t}</dd></div>`;
		this.query(".detail").innerHTML = `<p class="detail-id">${n(e.id)}</p><h2 class="detail-title">${n(e.title)}</h2><p class="detail-text">${n(e.description ?? "")}</p>
<dl class="fields">${t("Status", `${k(e.status)}${n(e.status)}`)}${t("Assignee", `${O(e.assignee)}${n(c(e.assignee))}`)}${t("Priority", A(e.priority))}${t("Labels", (e.labels ?? []).map(j).join(""))}${t("Target", `<code>${n(e.target ?? "")}</code>`)}${t("Due", n(e.due ?? ""))}</dl>`, this.query(".target").textContent = e.id, this.#o();
	}
	get #a() {
		let e = this.query(".command-input").value.trim().toLowerCase(), t = this.#n;
		return D.filter((n) => n.label(t).toLowerCase().includes(e));
	}
	#o() {
		let e = this.#n;
		if (!e) return;
		let t = this.#a;
		this.#e = Math.min(this.#e, Math.max(0, t.length - 1)), this.query(".command-rows").innerHTML = t.length ? t.map((t) => `<div class="command" role="option" id="command-${t.id}" data-id="${t.id}">${n(t.label(e))}<span class="keys">${t.keys.map((e) => `<kbd>${n(e)}</kbd>`).join("")}</span></div>`).join("") : "<p class=\"empty\">No commands match.</p>", this.#s();
	}
	#s() {
		let e = this.query(".command-rows").querySelectorAll(".command");
		e.forEach((e, t) => e.ariaSelected = String(t === this.#e));
		let t = e[this.#e], n = this.query(".command-input");
		t ? n.setAttribute("aria-activedescendant", t.id) : n.removeAttribute("aria-activedescendant");
		let r = this.query(".commands .highlight");
		t ? a(r, t) : o(r);
	}
	#c(e) {
		e !== this.issue && (this.issue = e, this.emit("select", { issue: this.#n }));
	}
	#l(e) {
		let t = {
			ArrowDown: 1,
			ArrowUp: -1
		}[e.key];
		if (!t) return;
		e.preventDefault();
		let n = this.#r, r = n.indexOf(this.#n);
		this.#c(n[(r + t + n.length) % n.length].id);
	}
	#u(e) {
		let t = this.#a.length, n = {
			ArrowDown: 1,
			ArrowUp: -1
		}[e.key];
		n && t ? (e.preventDefault(), this.#e = (this.#e + n + t) % t, this.#s()) : e.key === "Enter" && t ? (e.preventDefault(), this.#d(this.#a[this.#e].id)) : e.key === "Escape" && (e.target.value = "", this.#o(), this.query(".list").focus());
	}
	#d(e) {
		let t = D.find((t) => t.id === e), n = this.#n;
		if (!t || !n) return;
		let r = {
			...n,
			...t.apply(n)
		};
		this.issues = this.issues.map((e) => e === n ? r : e), e === "copy" && s(`${location.origin}/issue/${n.id}`).catch(() => {}), this.#f(`${n.id} ${t.says(r)}`, e === "copy" ? null : n), this.query(".command-input").value = "", this.#e = 0, this.emit("command", {
			command: e,
			issue: r
		});
	}
	#f(e, t) {
		this.#t = t;
		let n = this.query(".toast");
		this.query(".toast-text").textContent = e, this.query(".undo").hidden = !t, n.removeAttribute("data-shown"), n.getBoundingClientRect(), n.toggleAttribute("data-shown", !0);
	}
	#p() {
		let e = this.#t;
		e && (this.issues = this.issues.map((t) => t.id === e.id ? e : t), this.#f(`${e.id} restored`, null));
	}
};
//#endregion
//#region src/components/product-stage-hero/index.js
t("product-stage-hero", M);
//#endregion
export { M as t };
