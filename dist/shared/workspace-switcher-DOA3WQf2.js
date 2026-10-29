import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { t as i } from "./platform-CKi8k97Y.js";
import { n as a } from "./motion-CFWhFfc_.js";
import { n as o, t as s } from "./highlight-BSyGT8bg.js";
import { n as c } from "./people-C_zYMoEl.js";
import { W as l, at as u, ct as d, d as f, g as p, lt as m } from "./lucide-BVbUPHVq.js";
//#region src/components/workspace-switcher/workspace-switcher.scss?inline
var h = ":host{width:16rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);display:block;position:relative}:host([data-open]){z-index:50}button{font:inherit;color:inherit;cursor:pointer;background:0 0;border:0;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.trigger{box-sizing:border-box;border-radius:var(--lw-radius-lg);text-align:left;width:100%;transition:background-color var(--lw-duration-fast) ease-out;align-items:center;gap:.5rem;padding:.375rem;display:flex}.trigger:hover{background:var(--lw-color-muted)}.trigger>svg{color:var(--lw-color-muted-foreground);flex:none}:host([data-open]) .trigger{visibility:hidden}.current{flex:1;align-items:center;gap:.625rem;min-width:0;display:flex}.logo{width:var(--_size);height:var(--_size);border-radius:calc(var(--_size) * .28);background:var(--_color);font-size:calc(var(--_size) * .38);color:#fff;flex:none;place-items:center;font-weight:600;display:grid}.names{min-width:0;display:grid}.name{font-size:var(--lw-text-sm);text-overflow:ellipsis;white-space:nowrap;font-weight:500;overflow:hidden}.plan{font-size:var(--lw-text-xs);text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-muted-foreground);overflow:hidden}.panel{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-lg);background:var(--lw-color-background);width:100%;position:absolute;top:0;left:0;overflow:hidden;box-shadow:0 12px 32px -12px #00000040}.panel[hidden]{display:none}.find{border-bottom:1px solid var(--lw-color-muted);height:2.5rem;color:var(--lw-color-muted-foreground);align-items:center;gap:.5rem;padding:0 .75rem;display:flex}.search{min-width:0;height:100%;font:var(--lw-text-sm) var(--lw-font-sans);color:var(--lw-color-foreground);background:0 0;border:0;outline:none;flex:1;padding:0}.list-box{max-height:15rem;padding:.25rem;position:relative;overflow-y:auto}.highlight{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.highlight{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.highlight.visible{opacity:1}.list{position:relative}.row{border-radius:var(--lw-radius-md);cursor:default;align-items:center;gap:.625rem;padding:.375rem .5rem;display:flex;position:relative}.tick{margin-left:auto;display:grid}kbd{font:var(--lw-text-xs) var(--lw-font-sans);color:var(--lw-color-muted-foreground);margin-left:auto}.tick+kbd{margin-left:.25rem}.empty{font-size:var(--lw-text-sm);text-align:center;color:var(--lw-color-muted-foreground);margin:0;padding:.75rem}.empty[hidden]{display:none}.create{border-radius:var(--lw-radius-md);width:calc(100% - .5rem);font-size:var(--lw-text-sm);color:var(--lw-color-muted-foreground);align-items:center;gap:.625rem;margin:0 .25rem .25rem;padding:.5rem;display:flex}.create:hover{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.account{border-top:1px solid var(--lw-color-muted);background:color-mix(in oklab, var(--lw-color-muted) 50%, transparent);align-items:center;gap:.5rem;padding:.5rem .5rem .5rem .75rem;display:flex}.account button{border-radius:var(--lw-radius-md);width:1.75rem;height:1.75rem;color:var(--lw-color-muted-foreground);place-items:center;padding:0;display:grid}.account button:hover{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.avatar{background:var(--lw-color-primary);width:1.5rem;height:1.5rem;color:var(--lw-color-primary-foreground);border-radius:50%;flex:none;place-items:center;font-size:10px;font-weight:600;display:grid}.who{flex:1;min-width:0;display:grid}.account-name{font-size:var(--lw-text-xs);font-weight:500}.email{text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-muted-foreground);font-size:11px;overflow:hidden}", g = [
	{
		id: "lowersoft",
		name: "LowerSoft",
		plan: "Pro",
		members: 24,
		color: "#6366f1"
	},
	{
		id: "runtime",
		name: "lower Runtime",
		plan: "Team",
		members: 8,
		color: "#f97316"
	},
	{
		id: "night-shift",
		name: "Night Shift",
		plan: "Free",
		members: 3,
		color: "#10b981"
	},
	{
		id: "sideproject",
		name: "Side Project",
		plan: "Free",
		members: 1,
		color: "#e11d48"
	}
], _ = {
	name: "Maya Ortega",
	email: "maya@ortega.me"
}, v = i ? "⌘" : "Ctrl+", y = "cubic-bezier(0.23, 1, 0.32, 1)", b = (e, t) => `<span class="logo" style="--_color: ${n(e.color ?? "#71717a")}; --_size: ${t}px" aria-hidden="true">${n(c(e.name))}</span>`, x = class extends e {
	static styles = h;
	static props = {
		workspaces: {
			type: Object,
			default: g
		},
		workspace: { default: "" },
		account: {
			type: Object,
			default: _
		}
	};
	#e = !1;
	#t = 0;
	#n = "";
	render() {
		return `<button class="trigger" type="button" aria-haspopup="listbox" aria-expanded="false"><span class="current"></span>${r(p, 16)}</button>
<div class="panel" hidden>
  <label class="find">${r(d, 16)}<input class="search" type="text" role="combobox" aria-expanded="true" aria-controls="list" aria-autocomplete="list" placeholder="Find a workspace…" autocomplete="off" spellcheck="false"></label>
  <div class="list-box"><span class="highlight" aria-hidden="true"></span><div class="list" id="list" role="listbox" aria-label="Workspaces"></div><p class="empty" hidden>No workspace matches.</p></div>
  <button class="create" type="button">${r(u, 16)}Create workspace</button>
  <div class="account"><span class="avatar" aria-hidden="true"></span><span class="who"><span class="account-name"></span><span class="email"></span></span><button class="settings" type="button" aria-label="Account settings">${r(m, 16)}</button><button class="sign-out" type="button" aria-label="Sign out">${r(l, 16)}</button></div>
</div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".trigger").addEventListener("click", () => this.#c(!0), e);
		let t = this.query(".search");
		t.addEventListener("input", () => {
			this.#n = t.value, this.#t = 0, this.#o();
		}, e), this.query(".panel").addEventListener("keydown", (e) => this.#d(e), e);
		let n = this.query(".list");
		n.addEventListener("click", (e) => {
			let t = e.target.closest("[role=\"option\"]");
			t && this.#l(t.dataset.id);
		}, e), n.addEventListener("pointermove", (e) => {
			let t = e.target.closest("[role=\"option\"]");
			t && e.pointerType === "mouse" && this.#s(this.#a.indexOf(t));
		}, e), n.addEventListener("pointerdown", (e) => e.preventDefault(), e), this.query(".create").addEventListener("click", () => this.#u("create"), e), this.query(".settings").addEventListener("click", () => this.#u("settings"), e), this.query(".sign-out").addEventListener("click", () => this.#u("sign-out"), e), window.addEventListener("keydown", (e) => this.#f(e), e), document.addEventListener("pointerdown", (e) => this.#e && !e.composedPath().includes(this) && this.#c(!1, !1), e);
	}
	updated() {
		let e = this.#r;
		this.query(".current").innerHTML = e ? `${b(e, 28)}<span class="names"><span class="name">${n(e.name)}</span><span class="plan">${n(e.plan ?? "")}</span></span>` : "", this.query(".trigger").ariaLabel = `Workspace: ${e?.name ?? ""}. Switch`;
		let t = this.account ?? {};
		this.query(".avatar").textContent = c(t.name ?? ""), this.query(".account-name").textContent = t.name ?? "", this.query(".email").textContent = t.email ?? "", this.#e && this.#o();
	}
	get #r() {
		return this.workspaces.find(({ id: e }) => e === this.workspace) ?? this.workspaces[0];
	}
	get #i() {
		let e = this.#n.trim().toLowerCase();
		return this.workspaces.map((e, t) => ({
			workspace: e,
			index: t
		})).filter(({ workspace: t }) => t.name.toLowerCase().includes(e));
	}
	get #a() {
		return [...this.query(".list").children];
	}
	#o() {
		let e = this.#r, t = this.#i;
		this.query(".list").innerHTML = t.map(({ workspace: t, index: i }) => `<div class="row" role="option" id="ws-${n(t.id)}" data-id="${n(t.id)}" aria-selected="${t === e}">${b(t, 24)}<span class="names"><span class="name">${n(t.name)}</span><span class="plan">${n(t.plan ?? "")}${t.members ? ` · ${t.members} member${t.members === 1 ? "" : "s"}` : ""}</span></span>${t === e ? `<span class="tick">${r(f, 16)}</span>` : ""}${i < 9 ? `<kbd>${v}${i + 1}</kbd>` : ""}</div>`).join(""), this.query(".empty").hidden = t.length > 0, this.#s(Math.min(this.#t, t.length - 1));
	}
	#s(e) {
		this.#t = e;
		let t = this.#a, n = t[e];
		t.forEach((t, n) => t.toggleAttribute("data-active", n === e));
		let r = this.query(".search");
		n ? (r.setAttribute("aria-activedescendant", n.id), o(this.query(".highlight"), n), n.scrollIntoView({ block: "nearest" })) : (r.removeAttribute("aria-activedescendant"), s(this.query(".highlight")));
	}
	#c(e, t = !0) {
		if (e === this.#e) return;
		this.#e = e;
		let n = this.query(".trigger"), r = this.query(".panel");
		if (n.ariaExpanded = String(e), this.toggleAttribute("data-open", e), e) {
			this.#n = "", this.query(".search").value = "", r.hidden = !1, this.#t = Math.max(0, this.workspaces.indexOf(this.#r)), this.#o(), this.query(".search").focus(), a.matches || r.animate([{
				height: `${n.offsetHeight}px`,
				opacity: .6
			}, {
				height: `${r.offsetHeight}px`,
				opacity: 1
			}], {
				duration: 280,
				easing: y
			});
			return;
		}
		let i = () => {
			r.hidden = !0, s(this.query(".highlight"));
		};
		t && n.focus(), a.matches ? i() : r.animate([{
			height: `${r.offsetHeight}px`,
			opacity: 1
		}, {
			height: `${n.offsetHeight}px`,
			opacity: 0
		}], {
			duration: 200,
			easing: y
		}).finished.then(i, i);
	}
	#l(e) {
		let t = e !== this.#r?.id;
		this.workspace = e, this.#c(!1), t && this.emit("change", { workspace: this.workspaces.find((t) => t.id === e) });
	}
	#u(e) {
		this.#c(!1), this.emit(e);
	}
	#d(e) {
		let t = this.#a.length;
		if (e.key === "Escape") e.preventDefault(), this.#c(!1);
		else if (e.key === "ArrowDown" || e.key === "ArrowUp") e.preventDefault(), t && this.#s((this.#t + (e.key === "ArrowDown" ? 1 : -1) + t) % t);
		else if (e.key === "Enter" && e.target.matches(".search")) {
			e.preventDefault();
			let t = this.#a[this.#t];
			t && this.#l(t.dataset.id);
		} else e.key === "Tab" && !e.shiftKey && e.target.matches(".sign-out") && this.#c(!1, !1);
	}
	#f(e) {
		let t = document.activeElement === this;
		if (!(e.metaKey || e.ctrlKey) || e.altKey || !/^[1-9]$/.test(e.key) || !this.#e && !t) return;
		let n = this.workspaces[Number(e.key) - 1];
		n && (e.preventDefault(), this.#l(n.id));
	}
};
//#endregion
//#region src/components/workspace-switcher/index.js
t("workspace-switcher", x);
//#endregion
export { x as t };
