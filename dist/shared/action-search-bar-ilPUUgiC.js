import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { t as i } from "./platform-CKi8k97Y.js";
import { i as a, n as o, r as s } from "./motion-CFWhFfc_.js";
import { H as c, I as l, O as u, T as d, V as f, b as p, ct as m, d as h, ht as g, m as _, o as v, s as y, t as b, wt as x, z as S } from "./lucide-BVbUPHVq.js";
//#region src/components/action-search-bar/action-search-bar.scss?inline
var C = ":host{width:28rem;max-width:100%;height:46px;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);display:block;position:relative}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.palette{inset-inline:0;z-index:30;border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-lg);background:var(--lw-color-background);box-shadow:var(--lw-shadow-sm);position:absolute;top:0;overflow:hidden;container:palette/inline-size}:host([data-open]) .palette{box-shadow:0 16px 40px -16px #0003}.bar{align-items:center;gap:.5rem;height:2.75rem;padding-inline:.75rem;display:flex}.bar>svg{color:var(--lw-color-muted-foreground)}.crumbs{display:contents}.crumb{border-radius:var(--lw-radius-sm);background:var(--lw-color-muted);height:1.5rem;font:500 var(--lw-text-xs)/1 var(--lw-font-sans);color:var(--lw-color-foreground);cursor:pointer;border:0;flex:none;padding-inline:.5rem}.crumb:hover{background:var(--lw-color-border)}input{min-width:0;height:100%;font:var(--lw-text-sm) var(--lw-font-sans);color:inherit;background:0 0;border:0;outline:none;flex:1;padding:0}input::placeholder{color:var(--lw-color-muted-foreground)}kbd{box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-muted);min-width:1.25rem;height:1.25rem;font:11px var(--lw-font-sans);color:var(--lw-color-muted-foreground);border-radius:.25rem;justify-content:center;align-items:center;padding-inline:.25rem;display:inline-flex}.hotkey,.keys{flex:none;gap:2px;display:flex}.hotkey[hidden],.keys[hidden]{display:none}.panel{border-top:1px solid var(--lw-color-muted)}.panel[hidden]{display:none}.body{overflow:hidden}.list{overscroll-behavior:contain;max-height:18rem;padding:.375rem;position:relative;overflow-y:auto}.heading{color:var(--lw-color-muted-foreground);padding:.5rem .5rem .25rem;font-size:11px;font-weight:500}.option{border-radius:var(--lw-radius-sm);height:2.25rem;font-size:var(--lw-text-sm);color:color-mix(in oklab, var(--lw-color-foreground) 80%, transparent);cursor:default;align-items:center;gap:.625rem;padding-inline:.5rem;display:flex}.option[aria-selected=true]{background:var(--lw-color-muted)}.option[aria-disabled=true]{opacity:.5}.option b{color:var(--lw-color-foreground);font-weight:600}.icon{width:1rem;height:1rem;color:var(--lw-color-muted-foreground);flex:none;place-items:center;display:grid}[aria-selected=true]>.icon{color:var(--lw-color-foreground)}.label{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.parent{color:var(--lw-color-muted-foreground)}.end{color:var(--lw-color-muted-foreground);flex:none;align-items:center;display:flex}.done{color:var(--lw-color-foreground);display:grid}.spin{display:grid}@media (prefers-reduced-motion:no-preference){.spin{animation:.8s linear infinite spin}}@keyframes spin{to{rotate:1turn}}.empty{font-size:var(--lw-text-sm);text-align:center;color:var(--lw-color-muted-foreground);margin:0;padding:.25rem .75rem 1.5rem}.empty[hidden]{display:none}.footer{border-top:1px solid var(--lw-color-muted);color:var(--lw-color-muted-foreground);justify-content:space-between;align-items:center;gap:.75rem;padding:.5rem .75rem;font-size:11px;display:flex}.hints,.nav-hint,.back-hint{align-items:center;gap:.375rem;display:flex}.nav-hint,.back-hint{margin-right:.375rem}.back-hint[hidden]{display:none}@container palette (width<20rem){.nav-hint{display:none}}", w = /[\s\-_/.]/, T = /\s+/g, E = (e, t) => t === 0 || w.test(e[t - 1] ?? ""), D = (e, t, n) => {
	for (let r = n; r < e.length; r++) if (e[r] === t && E(e, r)) return r;
	return n;
}, O = (e, t, n) => {
	let r = [], i = 0, a = 0;
	for (let o of t) {
		let t = e.indexOf(o, a);
		if (t < 0) return null;
		let s = r.at(-1);
		n && (s === void 0 || t !== s + 1) && (t = D(e, o, t)), i += s !== void 0 && t === s + 1 ? 6 : 1, i += E(e, t) ? 8 : 0, i -= s === void 0 ? t * .5 : (t - s - 1) * .2, r.push(t), a = t + 1;
	}
	return {
		score: i,
		matches: r
	};
}, k = (e, t) => {
	let n = e.toLowerCase(), r = t.toLowerCase().replace(T, "");
	if (!r) return {
		score: 0,
		matches: []
	};
	let i = n.indexOf(r);
	return i >= 0 ? {
		score: 100 - i + (E(n, i) ? 30 : 0),
		matches: Array.from(r, (e, t) => i + t)
	} : O(n, r, !0) ?? O(n, r, !1);
}, A = ({ item: e, path: t }, n) => {
	let r = k(e.label, n);
	if (r) return r;
	let i = null;
	for (let r of [...t.map(({ label: e }) => e), ...e.keywords ?? []]) {
		let e = k(r, n);
		e && (i === null || e.score > i) && (i = e.score);
	}
	return i === null ? null : {
		score: i / 2,
		matches: []
	};
}, j = (e, t = []) => e.flatMap((e) => [{
	item: e,
	path: t
}, ...e.children ? j(e.children, [...t, e]) : []]), M = (e, t) => {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = r.path[0]?.group ?? r.item.group ?? t ?? "";
		n.set(e, [...n.get(e) ?? [], r]);
	}
	return [...n].map(([e, t]) => ({
		key: e || "items",
		label: e,
		rows: t
	}));
}, N = (e, t, n, r) => {
	let i = e?.children ?? t;
	if (!n.trim()) {
		let t = M(i.map((e) => ({
			item: e,
			path: [],
			key: e.id,
			matches: []
		})), e?.label);
		return !e && r.length && t.unshift({
			key: "recent",
			label: "Recent",
			rows: r.map((e) => ({
				...e,
				key: `recent-${e.item.id}`,
				matches: []
			}))
		}), t;
	}
	let a = M(j(i).flatMap((e) => {
		let t = A(e, n);
		return t ? [{
			...e,
			key: e.item.id,
			...t
		}] : [];
	}), e?.label);
	for (let e of a) e.rows.sort((e, t) => t.score - e.score);
	return a;
}, P = [
	{
		id: "new-document",
		label: "New document",
		icon: d,
		group: "Actions",
		keywords: [
			"create",
			"page",
			"file"
		],
		shortcut: ["⌘", "N"]
	},
	{
		id: "duplicate",
		label: "Duplicate page",
		icon: p,
		group: "Actions",
		keywords: ["copy", "clone"],
		shortcut: ["⌘", "D"]
	},
	{
		id: "move",
		label: "Move to…",
		icon: u,
		group: "Actions",
		keywords: ["folder", "file"],
		placeholder: "Move to which folder?",
		children: [
			{
				id: "move-inbox",
				label: "Inbox",
				icon: u
			},
			{
				id: "move-projects",
				label: "Projects",
				icon: u
			},
			{
				id: "move-archive",
				label: "Archive",
				icon: u
			}
		]
	},
	{
		id: "theme",
		label: "Change theme",
		icon: g,
		group: "Actions",
		keywords: [
			"appearance",
			"dark",
			"light",
			"mode"
		],
		placeholder: "Choose a theme…",
		children: [
			{
				id: "theme-light",
				label: "Light",
				icon: g
			},
			{
				id: "theme-dark",
				label: "Dark",
				icon: g
			},
			{
				id: "theme-system",
				label: "Match system",
				icon: g
			}
		]
	},
	{
		id: "invite",
		label: "Invite member",
		icon: x,
		group: "Actions",
		keywords: [
			"team",
			"share",
			"add"
		]
	},
	{
		id: "copy-link",
		label: "Copy link",
		icon: f,
		group: "Actions",
		keywords: ["url", "share"],
		shortcut: ["⌘", "L"]
	},
	{
		id: "docs",
		label: "Documentation",
		icon: y,
		group: "Links",
		keywords: ["help", "guide"],
		href: "/docs"
	},
	{
		id: "changelog",
		label: "Changelog",
		icon: l,
		group: "Links",
		keywords: [
			"release",
			"updates",
			"new"
		],
		href: "/changelog"
	},
	{
		id: "status",
		label: "Status page",
		icon: b,
		group: "Links",
		keywords: ["uptime", "incident"],
		href: "/status"
	},
	{
		id: "shortcuts",
		label: "Keyboard shortcuts",
		icon: S,
		group: "Links",
		keywords: ["keys", "hotkeys"],
		href: "/shortcuts"
	}
], F = 400, I = 3, L = s(.32, 0), R = "cubic-bezier(0.23, 1, 0.32, 1)", z = (e) => `<kbd>${n(e)}</kbd>`, B = (e) => (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "k", V = (e, t) => {
	let r = new Set(t);
	return e.split("").map((e, t) => r.has(t) ? `<b>${n(e)}</b>` : n(e)).join("").replaceAll("</b><b>", "");
}, H = (e, t) => t === "pending" ? `<span class="spin">${r(c)}</span>` : t === "done" ? `<span class="done">${r(h)}</span>` : e.children ? r(_) : e.href ? r(v) : e.shortcut ? `<span class="keys" aria-hidden="true">${e.shortcut.map(z).join("")}</span>` : "", U = class extends e {
	static styles = C;
	static props = {
		items: {
			type: Object,
			default: P
		},
		recent: {
			type: Object,
			default: ["copy-link", "theme-dark"]
		},
		open: {
			type: Boolean,
			reflect: !0
		},
		shortcut: { type: Boolean },
		label: { default: "Search commands" },
		placeholder: { default: "Search or jump to…" }
	};
	#e = "";
	#t = [];
	#n = 0;
	#r = [];
	#i = null;
	#a = 0;
	#o = 0;
	#s = !1;
	#c = !0;
	#l = null;
	#u = {
		fade: !1,
		slide: 0,
		spring: !1
	};
	#d = null;
	#f = 0;
	render() {
		let e = i ? "⌘" : "Ctrl";
		return `<div class="palette" part="palette">
  <div class="bar">${r(m)}<span class="crumbs"></span><label class="visually-hidden" for="input"></label><input id="input" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="list" autocomplete="off" spellcheck="false"><span class="hotkey" aria-hidden="true">${z(e)}${z("K")}</span></div>
  <div class="panel" hidden>
    <div class="body"><div class="content"><div class="list" id="list" role="listbox"></div><p class="empty" hidden></p></div></div>
    <div class="footer"><span class="hints"><span class="nav-hint">${z("↑")}${z("↓")}<span>Navigate</span></span>${z("↵")}<span class="enter-hint">Run</span></span><span class="hints"><span class="back-hint" hidden>${z("⌫")}<span>Back</span></span>${z("esc")}<span>Close</span></span></div>
  </div>
</div>
<span class="visually-hidden" aria-live="polite"></span>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query("input");
		t.addEventListener("input", () => this.#k(), e), t.addEventListener("keydown", (e) => this.#j(e), e), t.addEventListener("pointerdown", (e) => e.button === 0 && this.#g("pointer"), e);
		let n = this.query(".panel");
		for (let t of [n, this.query(".crumbs")]) t.addEventListener("pointerdown", (e) => e.preventDefault(), e);
		n.addEventListener("click", (e) => this.#M(e), e), n.addEventListener("pointermove", (e) => this.#N(e), e), this.query(".crumbs").addEventListener("click", (e) => e.target.closest(".crumb:last-child") && !this.#i && this.#w("pointer"), e), this.addEventListener("focusout", (e) => this.open && !this.shadowRoot.contains(e.relatedTarget) && this.#_(!1), e), this.addEventListener("pointerenter", (e) => this.#s = e.pointerType === "mouse", e), this.addEventListener("pointerleave", () => this.#s = !1, e), window.addEventListener("keydown", (e) => this.#y(e), {
			...e,
			capture: !0
		});
		let r = new IntersectionObserver(([e]) => this.#c = e?.isIntersecting ?? !0);
		r.observe(this), this.signal.addEventListener("abort", () => {
			r.disconnect(), clearTimeout(this.#o), this.#d?.();
		});
	}
	updated(e) {
		e.has("label") && (this.query("label").textContent = this.label ?? ""), e.has("open") && this.#v(), this.#b();
	}
	get #p() {
		return this.#t.at(-1);
	}
	get #m() {
		let e = j(this.items);
		return (this.recent ?? []).map((t) => e.find((e) => e.item.id === t)).filter((e) => e && !e.item.children).slice(0, I);
	}
	#h(e) {
		this.query("[aria-live]").textContent = e;
	}
	#g(e) {
		this.open || (this.#u.fade = e === "pointer", this.#n = 0, this.open = !0, this.emit("toggle", { open: !0 }));
	}
	#_(e) {
		clearTimeout(this.#o), this.#a++, this.#i = null, this.#e = "", this.#t = [], this.#n = 0, this.query("input").value = "";
		let t = this.open;
		this.open = !1, t && this.emit("toggle", { open: !1 });
		let n = this.#l;
		this.#l = null, e && n?.isConnected && n.focus();
	}
	#v() {
		let e = this.query(".panel");
		e.hidden = !this.open, this.query(".hotkey").hidden = !!this.open, this.query("input").ariaExpanded = String(!!this.open), this.toggleAttribute("data-open", !!this.open), this.open ? (this.#u.fade && !o.matches && e.animate([{ opacity: 0 }, { opacity: 1 }], {
			duration: 120,
			easing: R
		}), this.#u.fade = !1) : (this.#d?.(), this.#f = 0);
	}
	#y(e) {
		if (!B(e) || !this.#c || e.defaultPrevented) return;
		let t = document.activeElement, n = t === this;
		if (!(this.shortcut || n || this.#s)) return;
		let r = t?.closest?.("[aria-modal=\"true\"]");
		if (r && !r.contains(this)) return;
		if (e.preventDefault(), e.stopPropagation(), this.open) {
			this.#_(!0);
			return;
		}
		t instanceof HTMLElement && !n && (this.#l = t);
		let i = this.query("input");
		i.focus(), i.select(), this.#g("keyboard");
	}
	#b() {
		let e = this.#p, t = this.query("input");
		if (t.placeholder = e ? e.placeholder ?? `Search ${e.label.toLowerCase()}…` : this.placeholder ?? "", t.readOnly = !!this.#i, this.query(".crumbs").innerHTML = this.#t.map((e) => `<button class="crumb" type="button" tabindex="-1" aria-label="Back from ${n(e.label)}">${n(e.label)}</button>`).join(""), this.query(".back-hint").hidden = !this.#t.length, !this.open) return;
		let i = N(e, this.items, this.#e, this.#m);
		this.#r = i.flatMap(({ rows: e }) => e), this.#n = Math.min(Math.max(this.#n, 0), Math.max(this.#r.length - 1, 0));
		let a = -1, o = this.query(".list");
		o.ariaLabel = e ? e.label : "Commands", o.ariaBusy = String(this.#i?.phase === "pending"), o.innerHTML = i.map(({ key: e, label: t, rows: i }) => {
			let o = t ? `<div class="heading" id="group-${n(e)}" role="presentation">${n(t)}</div>` : "", s = i.map((e) => {
				a++;
				let t = this.#i?.key === e.key ? this.#i.phase : void 0, i = e.path.map(({ label: e }) => `<span class="parent">${n(e)}<span aria-hidden="true"> › </span></span>`).join(""), o = e.item.children ? "<span class=\"visually-hidden\">, opens a page</span>" : "";
				return `<div class="option" id="option-${a}" role="option" data-index="${a}" aria-selected="false"${this.#i && !t ? " aria-disabled=\"true\"" : ""}><span class="icon" aria-hidden="true">${e.item.icon ? r(e.item.icon) : ""}</span><span class="label">${i}${V(e.item.label, e.matches)}${o}</span><span class="end">${H(e.item, t)}</span></div>`;
			}).join("");
			return `<div role="group"${t ? ` aria-labelledby="group-${n(e)}"` : ""}>${o}${s}</div>`;
		}).join("");
		let s = this.query(".empty");
		s.hidden = this.#r.length > 0, s.textContent = `No results for “${this.#e.trim()}”`, this.#x(), this.#S();
	}
	#x() {
		let e = this.query(".list"), t = this.#r.length ? this.query(`#option-${this.#n}`) : null;
		for (let t of e.querySelectorAll("[aria-selected=\"true\"]")) t.ariaSelected = "false";
		let n = this.query("input");
		if (!t) {
			n.removeAttribute("aria-activedescendant");
			return;
		}
		t.ariaSelected = "true", n.setAttribute("aria-activedescendant", t.id), this.query(".enter-hint").textContent = this.#r[this.#n]?.item.children ? "Open" : "Run";
		let r = t.offsetTop, i = r + t.offsetHeight;
		r < e.scrollTop + 6 ? e.scrollTop = r - 30 : i > e.scrollTop + e.clientHeight - 6 && (e.scrollTop = i - e.clientHeight + 6);
	}
	#S() {
		let e = this.query(".body"), t = this.query(".content").offsetHeight;
		this.#d?.(), this.#d = null;
		let n = (t) => {
			this.#f = t, e.style.height = `${t}px`;
		};
		!this.#u.spring || !this.#f || o.matches ? n(t) : this.#d = a(this.#f, t, {
			...L,
			restDelta: .5,
			update: n
		}), this.#u.spring = !1;
		let r = this.#u.slide;
		this.#u.slide = 0, r && this.query(".list").animate([{
			transform: o.matches ? "none" : `translateX(${r * 14}px)`,
			opacity: 0
		}, {
			transform: "none",
			opacity: 1
		}], {
			duration: 200,
			easing: R
		});
	}
	#C(e, t) {
		t === "pointer" && (this.#u = {
			...this.#u,
			slide: 1,
			spring: !0
		}), this.#t = [...this.#t, e], this.#T(""), this.#n = 0, this.#h(`${e.label}, ${e.children?.length ?? 0} options`), this.#b();
	}
	#w(e) {
		let t = this.#p;
		if (!t) return;
		e === "pointer" && (this.#u = {
			...this.#u,
			slide: -1,
			spring: !0
		}), this.#t = this.#t.slice(0, -1), this.#T("");
		let n = N(this.#p, this.items, "", this.#m).flatMap(({ rows: e }) => e);
		this.#n = Math.max(0, n.findIndex((e) => e.key === t.id)), this.#h(this.#p?.label ?? "All commands"), this.query("input").focus(), this.#b();
	}
	#T(e) {
		this.#e = e, this.query("input").value = e;
	}
	#E(e, t) {
		this.#i || (e.item.children ? this.#C(e.item, t) : this.#D(e));
	}
	#D(e) {
		let t = ++this.#a, n = [...this.#t, ...e.path];
		this.emit("select", {
			item: e.item,
			path: n
		});
		let r = this.run?.(e.item, n);
		r instanceof Promise ? (this.#i = {
			key: e.key,
			phase: "pending"
		}, this.#h(`Running ${e.item.label}`), this.#b(), r.then(() => this.#O(e, t), () => {
			t === this.#a && (this.#i = null, this.#h(`${e.item.label} failed`), this.#b());
		})) : this.#O(e, t);
	}
	#O(e, t) {
		t === this.#a && (this.#i = {
			key: e.key,
			phase: "done"
		}, this.#h(`${e.item.label}, done`), this.#b(), this.#o = setTimeout(() => {
			t === this.#a && (this.recent = [e.item.id, ...(this.recent ?? []).filter((t) => t !== e.item.id)].slice(0, I), this.#_(this.#l !== null));
		}, F));
	}
	#k() {
		this.#e = this.query("input").value, this.#n = 0, this.open ? this.#b() : this.#g("keyboard");
	}
	#A(e) {
		let t = this.#r.length;
		t && (this.#n = (Math.max(this.#n, 0) + e + t) % t, this.#x());
	}
	#j(e) {
		if (this.#i && e.key !== "Tab") {
			e.preventDefault();
			return;
		}
		let { key: t } = e;
		[
			"ArrowDown",
			"ArrowUp",
			"Home",
			"End"
		].includes(t) ? (e.preventDefault(), this.open ? t === "Home" || t === "End" ? (this.#n = t === "Home" ? 0 : this.#r.length - 1, this.#x()) : this.#A(t === "ArrowDown" ? 1 : -1) : this.#g("keyboard")) : t === "Enter" ? (e.preventDefault(), this.open ? this.#r[this.#n] && this.#E(this.#r[this.#n], "keyboard") : this.#g("keyboard")) : t === "Backspace" && this.open && !this.#e && this.#t.length ? (e.preventDefault(), this.#w("keyboard")) : t === "Escape" && (this.open ? (e.preventDefault(), this.#_(!0)) : this.#e && this.#T(""));
	}
	#M(e) {
		let t = e.target.closest(".option");
		t && this.#E(this.#r[Number(t.dataset.index)], "pointer");
	}
	#N(e) {
		let t = e.target.closest(".option");
		if (e.pointerType !== "mouse" || this.#i || !t) return;
		let n = Number(t.dataset.index);
		n !== this.#n && (this.#n = n, this.#x());
	}
};
//#endregion
//#region src/components/action-search-bar/index.js
t("action-search-bar", U);
//#endregion
export { U as t };
