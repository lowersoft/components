import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { m as a } from "./lucide-BVbUPHVq.js";
//#region src/components/file-tree/file-tree.scss?inline
var o = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);--_path:#12a594;box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:20rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:0;display:block;overflow:hidden}h2,ul{margin:0}button,input{font:inherit;color:inherit;outline:none}button:focus-visible,input:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.head{border-bottom:1px solid var(--_line);align-items:center;gap:.125rem;padding:.625rem .5rem .625rem 1rem;display:flex}.title{min-width:0;font-size:var(--lw-text-md);text-overflow:ellipsis;white-space:nowrap;flex:1;font-weight:500;overflow:hidden}.label{color:var(--_muted);font-weight:400}.tool{border-radius:var(--lw-radius-md);width:1.875rem;height:1.875rem;color:var(--_muted);cursor:pointer;background:0 0;border:0;flex:none;place-items:center;padding:0;display:grid}.tool:hover{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent);color:var(--lw-color-foreground)}.tree{max-height:26rem;padding:.375rem;list-style:none;overflow-y:auto}.item{border-radius:var(--lw-radius-md);height:2rem;font-size:var(--lw-text-md);white-space:nowrap;cursor:pointer;outline:none;align-items:center;gap:.375rem;padding:0 .5rem;display:flex}.item>svg{color:var(--_muted);flex:none}.item:hover{background:color-mix(in oklab, var(--lw-color-foreground) 5%, transparent)}.item:focus-visible{box-shadow:inset 0 0 0 2px var(--lw-color-ring)}.item[aria-selected=true]{background:color-mix(in oklab, var(--lw-color-foreground) 12%, transparent)}.item[aria-selected=true]>svg{color:var(--lw-color-foreground)}.guide{flex:none;width:.875rem;height:100%;position:relative}.guide:before{content:\"\";background:var(--_line);width:1px;position:absolute;top:0;bottom:0;left:.4375rem}.guide[data-lit]:before{background:var(--_path)}.twisty{width:1rem;color:var(--_muted);flex:none;place-items:center;display:grid}@media (prefers-reduced-motion:no-preference){.twisty svg{transition:rotate .15s ease-out}}[aria-expanded=true]>.twisty svg{rotate:90deg}.name{text-overflow:ellipsis;overflow:hidden}.creating{cursor:default}.creating:hover{background:0 0}.new-name{border:1px solid var(--_path);border-radius:var(--lw-radius-sm);background:var(--lw-color-background);min-width:0;height:1.625rem;font-size:var(--lw-text-md);flex:1;padding:0 .375rem}.new-error{border-radius:var(--lw-radius-sm);background:var(--lw-color-destructive);font-size:var(--lw-text-xs);color:#fff;margin-top:3.5rem;margin-left:2.5rem;padding:.125rem .375rem;position:absolute}.new-error:empty{display:none}", s = {
	folder: "<path d=\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\"/>",
	open: "<path d=\"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2\"/>",
	file: "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"m10 13-2 2 2 2M14 17l2-2-2-2\"/>",
	text: "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"M10 9H8M16 13H8M16 17H8\"/>",
	newFile: "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"M9 15h6M12 18v-6\"/>",
	newFolder: "<path d=\"M12 10v6M9 13h6\"/><path d=\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\"/>",
	collapse: "<path d=\"m7 20 5-5 5 5M7 4l5 5 5-5\"/>"
}, c = [
	{
		name: "src",
		children: [
			{
				name: "alloc",
				children: [
					{ name: "arena.c" },
					{ name: "arena.h" },
					{ name: "pool.c" }
				]
			},
			{
				name: "trace",
				children: [
					{ name: "sampler.c" },
					{ name: "sampler.h" },
					{ name: "symbols.c" }
				]
			},
			{ name: "main.c" },
			{ name: "lower.h" }
		]
	},
	{
		name: "tests",
		children: [{ name: "alloc_test.c" }, { name: "trace_test.c" }]
	},
	{ name: "Makefile" },
	{ name: "README.md" },
	{ name: "LICENSE" }
], l = /\.(c|h|cc|cpp|rs|zig|s|asm|js|ts)$/i, u = class extends e {
	static styles = [r, o];
	static props = {
		project: { default: "lowersoft-runtime" },
		tree: {
			type: Object,
			default: c
		},
		selected: {
			default: "src/alloc/arena.c",
			reflect: !0
		}
	};
	#e = [];
	#t = /* @__PURE__ */ new Set(["src", "src/alloc"]);
	#n = null;
	render() {
		return `<header class="head"><h2 class="title"><span class="label">Explorer</span> <span class="project"></span></h2>
<button class="tool" type="button" data-action="file" aria-label="New file">${i(s.newFile, 17)}</button><button class="tool" type="button" data-action="folder" aria-label="New folder">${i(s.newFolder, 17)}</button><button class="tool" type="button" data-action="collapse" aria-label="Collapse all">${i(s.collapse, 17)}</button></header>
<ul class="tree" role="tree" aria-label="Files"></ul>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".head").addEventListener("click", (e) => {
			let t = e.target.closest(".tool")?.dataset.action;
			t === "collapse" ? (this.#t.clear(), this.#i(!0)) : t && this.#l(t === "folder");
		}, e);
		let t = this.query(".tree");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".item");
			t && !e.target.closest(".new-name") && this.#o(t.dataset.path, !0);
		}, e), t.addEventListener("keydown", (e) => this.#c(e), e);
	}
	updated(e) {
		this.query(".project").textContent = this.project ?? "", e.has("tree") && (this.#e = structuredClone(this.tree ?? [])), this.#i();
	}
	#r() {
		let e = [], t = (n, r, i) => {
			let a = [...n].sort((e, t) => !!t.children - !!e.children || e.name.localeCompare(t.name));
			for (let n of a) {
				let a = r ? `${r}/${n.name}` : n.name;
				e.push({
					entry: n,
					path: a,
					level: i,
					parent: r
				}), n.children && this.#t.has(a) && t(n.children, a, i + 1), this.#n && this.#n.parent === a && this.#t.has(a) && n.children && e.push({
					creating: !0,
					level: i + 1,
					parent: a
				});
			}
		};
		return t(this.#e, "", 1), this.#n && this.#n.parent === "" && e.push({
			creating: !0,
			level: 1,
			parent: ""
		}), e;
	}
	#i(e) {
		let t = e && this.shadowRoot.activeElement?.dataset?.path, r = this.selected ?? "", o = this.#r();
		this.query(".tree").innerHTML = o.map((e) => {
			let t = Array.from({ length: e.level - 1 }, (t, n) => {
				let i = (e.parent ?? "").split("/").slice(0, n + 1).join("/");
				return `<span class="guide"${r.startsWith(`${i}/`) ? " data-lit" : ""}></span>`;
			}).join("");
			if (e.creating) return `<li class="item creating" role="none">${t}<span class="twisty"></span>${i(this.#n.folder ? s.folder : s.file, 16)}<input class="new-name" type="text" aria-label="${this.#n.folder ? "New folder name" : "New file name"}" spellcheck="false"><span class="new-error" role="alert"></span></li>`;
			let o = !!e.entry.children, c = o && this.#t.has(e.path), u = o ? c ? s.open : s.folder : l.test(e.entry.name) ? s.file : s.text;
			return `<li class="item" role="treeitem" data-path="${n(e.path)}" aria-level="${e.level}" aria-selected="${e.path === r}"${o ? ` aria-expanded="${c}"` : ""} tabindex="-1">${t}<span class="twisty">${o ? i(a, 14) : ""}</span>${i(u, 16)}<span class="name">${n(e.entry.name)}</span></li>`;
		}).join("");
		let c = [...this.shadowRoot.querySelectorAll(".item[data-path]")], u = c.find((e) => e.dataset.path === (t || r)) ?? c[0];
		u && (u.tabIndex = 0), t && u?.focus();
		let d = this.query(".new-name");
		d && (d.focus(), d.addEventListener("keydown", (e) => this.#d(e), { signal: this.signal }), d.addEventListener("blur", () => this.#n && setTimeout(() => this.#u(), 0), { signal: this.signal }));
	}
	#a(e) {
		let t = this.#e, n = null;
		for (let r of e.split("/")) n = t.find((e) => e.name === r), t = n?.children ?? [];
		return n;
	}
	#o(e, t) {
		let n = this.#a(e);
		n && (n.children ? (t && (this.#t.has(e) ? this.#t.delete(e) : this.#t.add(e)), this.selected = e, this.#i(!0), this.query(`.item[data-path="${CSS.escape(e)}"]`)?.focus()) : (this.selected = e, this.#i(), this.query(`.item[data-path="${CSS.escape(e)}"]`)?.focus(), this.emit("open", { path: e })));
	}
	#s(e) {
		if (e) {
			for (let e of this.shadowRoot.querySelectorAll(".item[data-path]")) e.tabIndex = -1;
			e.tabIndex = 0, e.focus();
		}
	}
	#c(e) {
		let t = e.target.closest(".item[data-path]");
		if (!t) return;
		let n = [...this.shadowRoot.querySelectorAll(".item[data-path]")], r = n.indexOf(t), i = t.dataset.path, a = t.hasAttribute("aria-expanded"), o = t.ariaExpanded === "true", s = {
			ArrowDown: () => this.#s(n[r + 1]),
			ArrowUp: () => this.#s(n[r - 1]),
			Home: () => this.#s(n[0]),
			End: () => this.#s(n.at(-1)),
			ArrowRight: () => {
				a && !o ? (this.#t.add(i), this.#i(!0)) : a && this.#s(n[r + 1]);
			},
			ArrowLeft: () => {
				a && o ? (this.#t.delete(i), this.#i(!0)) : this.#s(this.query(`.item[data-path="${CSS.escape(i.split("/").slice(0, -1).join("/"))}"]`));
			},
			Enter: () => this.#o(i, !0)
		}[e.key];
		if (s) e.preventDefault(), s();
		else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey) {
			let t = e.key.toLowerCase(), i = [...n.slice(r + 1), ...n.slice(0, r)].find((e) => e.querySelector(".name").textContent.toLowerCase().startsWith(t));
			this.#s(i);
		}
	}
	#l(e) {
		let t = this.selected ?? "", n = this.#a(t)?.children ? t : t.split("/").slice(0, -1).join("/");
		n && this.#t.add(n), this.#n = {
			folder: e,
			parent: n
		}, this.#i();
	}
	#u() {
		this.#n && (this.#n = null, this.#i(), this.query(".item[tabindex=\"0\"]")?.focus());
	}
	#d(e) {
		if (e.key === "Escape") {
			e.preventDefault(), this.#u();
			return;
		}
		if (e.key !== "Enter") return;
		e.preventDefault();
		let t = e.target.value.trim(), { folder: n, parent: r } = this.#n, i = r ? this.#a(r).children : this.#e, a = t ? /[\\/]/.test(t) ? "Names cannot contain slashes." : i.some((e) => e.name === t) ? `${t} already exists here.` : "" : "Give it a name.";
		if (a) {
			this.query(".new-error").textContent = a;
			return;
		}
		i.push(n ? {
			name: t,
			children: []
		} : { name: t });
		let o = r ? `${r}/${t}` : t;
		this.#n = null, n && this.#t.add(o), this.selected = o, this.#i(), this.query(`.item[data-path="${CSS.escape(o)}"]`)?.focus(), this.emit("create", {
			path: o,
			folder: n
		});
	}
};
//#endregion
//#region src/components/file-tree/index.js
t("file-tree", u);
//#endregion
export { u as t };
