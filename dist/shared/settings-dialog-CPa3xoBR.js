import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./dom-Dlk1FlsZ.js";
import { t as n } from "./icons-HWomdoMw.js";
import { r } from "./icons-Dv1KN71n.js";
import { Ct as i, U as a, X as o, ht as s, lt as c } from "./lucide-BVbUPHVq.js";
import { n as l, t as u } from "./modal-DvPYHqbK.js";
//#region src/components/settings-dialog/settings-dialog.scss?inline
var d = ".modal{--_width:44rem;overflow:hidden;container-type:inline-size}.layout{min-height:26rem;display:grid}@container (width>=36rem){.layout{grid-template-columns:12rem minmax(0,1fr)}}.nav{border-bottom:1px solid var(--_line);background:var(--_raised);padding:1.25rem .75rem}@container (width>=36rem){.nav{border-right:1px solid var(--_line);border-bottom:0}}.nav .title{font-size:var(--lw-text-md);padding:0 .5rem .875rem}.sections{gap:.125rem;display:flex;overflow-x:auto}@container (width>=36rem){.sections{flex-direction:column}}.section{border-radius:var(--lw-radius-md);color:var(--_muted);text-align:left;cursor:pointer;background:0 0;border:0;flex:none;align-items:center;gap:.625rem;padding:.5rem .625rem;display:flex}.section span:first-of-type{flex:1}.section:hover{color:var(--lw-color-foreground)}.section[aria-selected=true]{background:color-mix(in oklab, var(--lw-color-foreground) 8%, transparent);color:var(--lw-color-foreground)}.dot{opacity:0;background:#f59e0b;border-radius:50%;width:.375rem;height:.375rem}[data-changed]>.dot{opacity:1}.panels{flex-direction:column;display:flex;position:relative}.panel{flex:1;padding:1.5rem}.panel[hidden]{display:none}@media (prefers-reduced-motion:no-preference){.panel{animation:.25s ease-out panel-in}}@keyframes panel-in{0%{opacity:0;translate:0 .25rem}}.panel-title{font-size:var(--lw-text-lg);margin-bottom:1.25rem;font-weight:600}.fields{gap:1.25rem;display:grid}.fields lw-text-input{width:100%}.row,.session{justify-content:space-between;align-items:center;gap:1rem;display:flex}lw-switch.setting::part(label){clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.row-label{font-weight:500}.row-hint{color:var(--_muted);margin-top:.125rem}.group{gap:.625rem;display:grid}.choices{border:1px solid var(--_line);border-radius:var(--lw-radius-lg);justify-self:start;padding:.25rem;display:inline-flex}.choice{border-radius:var(--lw-radius-md);color:var(--_muted);cursor:pointer;background:0 0;border:0;align-items:center;gap:.375rem;padding:.375rem .875rem;display:inline-flex}.choice[aria-checked=true]{background:color-mix(in oklab, var(--lw-color-foreground) 9%, transparent);color:var(--lw-color-foreground)}.sessions{gap:.75rem;padding:0;list-style:none;display:grid}.session{border:1px solid var(--_line);border-radius:var(--lw-radius-lg);padding:.75rem}.sign-out{border:1px solid var(--_line);border-radius:var(--lw-radius-md);cursor:pointer;background:0 0;padding:.25rem .625rem}.sign-out:hover{border-color:var(--lw-color-destructive);color:var(--lw-color-destructive)}.savebar{border-top:1px solid var(--_line);background:var(--lw-color-background);opacity:0;pointer-events:none;align-items:center;gap:.5rem;padding:.75rem 1rem .75rem 1.5rem;display:flex;position:sticky;bottom:0;translate:0 100%}@media (prefers-reduced-motion:no-preference){.savebar{transition:translate .25s cubic-bezier(.23,1,.32,1),opacity .2s ease-out}}.savebar[data-show]{opacity:1;pointer-events:auto;translate:0}.changes{color:var(--_muted);flex:1}", f = [
	{
		id: "general",
		label: "General",
		icon: c
	},
	{
		id: "account",
		label: "Account",
		icon: i
	},
	{
		id: "notifications",
		label: "Notifications",
		icon: "<path d=\"M10.268 21a2 2 0 0 0 3.464 0\"/><path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\"/>"
	},
	{
		id: "appearance",
		label: "Appearance",
		icon: s
	},
	{
		id: "security",
		label: "Security",
		icon: a
	}
], p = {
	workspace: "Northwind",
	slug: "northwind",
	name: "Maya Chen",
	email: "maya@northwind.dev",
	buildFailed: !0,
	crashReports: !0,
	weeklyDigest: !1,
	mentions: !0,
	theme: "system",
	density: "comfortable",
	twoFactor: !0
}, m = [{
	device: "MacBook Pro · Firefox",
	where: "Lisbon",
	when: "This device"
}, {
	device: "ThinkPad · Chrome",
	where: "Berlin",
	when: "2 days ago"
}], h = (e, t, n) => `<div class="row"><div><p class="row-label">${t}</p><p class="row-hint">${n}</p></div><lw-switch class="setting" data-key="${e}" size="sm">${t}</lw-switch></div>`, g = (e, t, n) => `<button class="choice" type="button" role="radio" data-key="${e}" data-value="${t}">${n}</button>`, _ = {
	general: "<lw-text-input class=\"setting\" data-key=\"workspace\" label=\"Workspace name\"></lw-text-input><lw-text-input class=\"setting\" data-key=\"slug\" label=\"Address\" hint=\"Changing it breaks old links to builds.\"><span slot=\"start\">lowersoft.dev/</span></lw-text-input>",
	account: "<lw-text-input class=\"setting\" data-key=\"name\" label=\"Full name\" autocomplete=\"name\"></lw-text-input><lw-text-input class=\"setting\" data-key=\"email\" type=\"email\" label=\"Email\" autocomplete=\"email\"></lw-text-input>",
	notifications: `${h("buildFailed", "Failed builds", "When a build on main breaks")}${h("crashReports", "New crash reports", "Grouped, once per signature")}${h("mentions", "Mentions", "When someone mentions you in a review")}${h("weeklyDigest", "Weekly digest", "Benchmarks and builds, every Monday")}`,
	appearance: `<div class="group"><p class="row-label" id="theme-label">Theme</p><div class="choices" role="radiogroup" aria-labelledby="theme-label">${g("theme", "system", `${r(o, 15)}System`)}${g("theme", "light", "Light")}${g("theme", "dark", "Dark")}</div></div>
<div class="group"><p class="row-label" id="density-label">Density</p><div class="choices" role="radiogroup" aria-labelledby="density-label">${g("density", "comfortable", "Comfortable")}${g("density", "compact", "Compact")}</div></div>`,
	security: `${h("twoFactor", "Two-factor authentication", "A code from your app at every sign-in")}<div class="group"><p class="row-label">Signed-in devices</p><ul class="sessions"></ul></div>`
}, v = class extends u {
	static styles = [
		l,
		n,
		d
	];
	static props = {
		...u.props,
		section: {
			default: "general",
			reflect: !0
		},
		settings: {
			type: Object,
			default: p
		}
	};
	#e = {};
	#t = {};
	#n = [...m];
	renderBody() {
		return `<div class="layout"><nav class="nav"><h2 class="title" id="modal-title">Settings</h2><div class="sections" role="tablist" aria-orientation="vertical">${f.map((e) => `<button class="section" type="button" role="tab" id="tab-${e.id}" data-id="${e.id}" aria-controls="panel-${e.id}">${r(e.icon, 16)}<span>${e.label}</span><span class="dot" aria-hidden="true"></span></button>`).join("")}</div></nav>
<div class="panels">${f.map((e) => `<section class="panel" role="tabpanel" id="panel-${e.id}" aria-labelledby="tab-${e.id}" data-id="${e.id}"><h3 class="panel-title">${e.label}</h3><div class="fields">${_[e.id]}</div></section>`).join("")}
<footer class="savebar" role="status"><span class="changes"></span><lw-button class="discard" variant="ghost" size="sm">Discard</lw-button><lw-button class="save" size="sm">Save changes</lw-button></footer></div></div>`;
	}
	connected() {
		super.connected();
		let e = { signal: this.signal }, t = this.query(".sections");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".section");
			t && (this.section = t.dataset.id);
		}, e), t.addEventListener("keydown", (e) => {
			let n = {
				ArrowDown: 1,
				ArrowRight: 1,
				ArrowUp: -1,
				ArrowLeft: -1
			}[e.key];
			if (!n) return;
			e.preventDefault();
			let r = f.findIndex((e) => e.id === this.section);
			this.section = f[(r + n + f.length) % f.length].id, t.querySelector(`[data-id="${this.section}"]`).focus();
		}, e);
		let n = this.query(".panels");
		n.addEventListener("input", (e) => {
			let t = e.target.closest("lw-text-input.setting");
			t && this.#i(t.dataset.key, t.value);
		}, e), n.addEventListener("change", (e) => {
			let t = e.target.closest("lw-switch.setting");
			t && this.#i(t.dataset.key, t.checked);
		}, e), n.addEventListener("click", (e) => {
			let t = e.target.closest(".choice");
			t && this.#i(t.dataset.key, t.dataset.value);
			let n = e.target.closest(".sign-out");
			if (n) {
				let [e] = this.#n.splice(Number(n.dataset.index), 1);
				this.#s(), this.emit("sign-out-device", { device: e.device });
			}
		}, e), this.query(".discard").addEventListener("click", () => this.#r(), e), this.query(".save").addEventListener("click", () => this.#c(), e);
	}
	updated(e) {
		super.updated(e), e.has("settings") && (this.#e = {
			...p,
			...this.settings
		}, this.#r());
		for (let e of this.shadowRoot.querySelectorAll(".section")) {
			let t = e.dataset.id === this.section;
			e.ariaSelected = String(t), e.tabIndex = t ? 0 : -1;
		}
		for (let e of this.shadowRoot.querySelectorAll(".panel")) e.hidden = e.dataset.id !== this.section;
		this.#s();
	}
	#r() {
		this.#t = { ...this.#e };
		for (let e of this.shadowRoot.querySelectorAll("lw-text-input.setting")) e.value = this.#t[e.dataset.key] ?? "";
		for (let e of this.shadowRoot.querySelectorAll("lw-switch.setting")) e.checked = !!this.#t[e.dataset.key];
		this.#o();
	}
	#i(e, t) {
		this.#t[e] = t, this.#o();
	}
	get #a() {
		return Object.keys(this.#t).filter((e) => this.#t[e] !== this.#e[e]);
	}
	#o() {
		for (let e of this.shadowRoot.querySelectorAll(".choice")) {
			let t = this.#t[e.dataset.key] === e.dataset.value;
			e.ariaChecked = String(t), e.tabIndex = t ? 0 : -1;
		}
		let e = this.#a;
		for (let t of this.shadowRoot.querySelectorAll(".section")) {
			let n = this.query(`.panel[data-id="${t.dataset.id}"]`);
			t.toggleAttribute("data-changed", e.some((e) => n.querySelector(`[data-key="${e}"]`)));
		}
		this.query(".savebar").toggleAttribute("data-show", e.length > 0), this.query(".changes").textContent = e.length ? `${e.length} unsaved ${e.length === 1 ? "change" : "changes"}` : "";
	}
	#s() {
		this.query(".sessions").innerHTML = this.#n.map((e, n) => `<li class="session"><div><p class="row-label">${t(e.device)}</p><p class="row-hint">${t(e.where)} · ${t(e.when)}</p></div>${e.when === "This device" ? "" : `<button class="sign-out" type="button" data-index="${n}">Sign out</button>`}</li>`).join("");
	}
	#c() {
		let e = this.#a;
		e.length && (this.#e = { ...this.#t }, this.#o(), this.emit("save", {
			settings: { ...this.#e },
			changed: e
		}));
	}
};
//#endregion
//#region src/components/settings-dialog/index.js
e("settings-dialog", v);
//#endregion
export { v as t };
