import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { i, n as a, r as o } from "./motion-CFWhFfc_.js";
import { a as s, i as c, r as l } from "./theme-D-ctQQvB.js";
import { n as u } from "./people-C_zYMoEl.js";
import { Ct as d, W as f, X as p, Z as m, at as h, d as g, g as _, lt as v, m as y, mt as b, p as x, x as S } from "./lucide-BVbUPHVq.js";
//#region src/components/profile-dropdown/profile-dropdown.scss?inline
var C = ":host{--_ease:cubic-bezier(.23, 1, .32, 1);--_surface:var(--lw-color-background);isolation:isolate;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);display:inline-block;position:relative}:host([data-open]){z-index:50}button,a{font:inherit;color:inherit;text-decoration:none}svg{flex:none}hr{background:var(--lw-color-muted);border:0;height:1px;margin:.375rem .625rem}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.grow{flex:1}.trigger{border:1px solid var(--lw-color-border);background:var(--_surface);text-align:left;cursor:pointer;width:15rem;transition:background-color var(--lw-duration-fast) ease-out, border-color var(--lw-duration-fast) ease-out;border-radius:1rem;outline:none;align-items:center;gap:.625rem;padding:.5rem .75rem .5rem .5rem;display:flex}.trigger:hover{border-color:color-mix(in oklab, var(--lw-color-border), var(--lw-color-foreground) 12%);background:color-mix(in oklab, var(--lw-color-muted) 50%, var(--_surface))}.trigger:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.trigger>svg{color:var(--lw-color-muted-foreground);transition:opacity var(--lw-duration-fast) ease-out}.trigger .identity{flex:1}:host([data-open]) .trigger .identity>*,:host([data-open]) .trigger>svg{visibility:hidden}:host([data-open]) .trigger>svg{opacity:0}.identity{align-items:center;gap:.625rem;min-width:0;display:flex}.identity.stacked{flex-direction:column;align-items:flex-start;gap:.75rem}.text{text-align:left;flex-direction:column;min-width:0;display:flex}.name,.email{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.name{font-size:var(--lw-text-sm);font-weight:500;line-height:1.25rem}.email{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);line-height:1rem}[data-piece]{z-index:2;transform-origin:0 0;position:relative}.avatar{width:var(--_size);height:var(--_size);font-size:max(7px, var(--_size) * .3);letter-spacing:.02em;-webkit-user-select:none;user-select:none;border-radius:50%;flex:none;place-items:center;font-weight:500;display:grid;position:relative}.avatar[data-tone=\"0\"]{background:var(--lw-color-primary);color:var(--lw-color-primary-foreground)}.avatar[data-tone=\"1\"]{background:var(--lw-color-border);color:var(--lw-color-foreground)}.avatar[data-tone=\"2\"]{background:var(--lw-color-muted);color:var(--lw-color-muted-foreground);box-shadow:inset 0 0 0 1px var(--lw-color-border)}.avatar .dot{width:.625rem;height:.625rem;box-shadow:0 0 0 2px var(--_surface);position:absolute;bottom:0;right:0}.dot{background:var(--lw-color-border);border-radius:50%;transition:background-color .2s ease-out}.dot[data-status=online]{background:#10b981}.dot[data-status=away]{background:#fbbf24}.dot[data-status=busy]{background:#ef4444}.panel{z-index:1;pointer-events:none;width:288px;position:absolute;top:0;right:0}.panel[hidden]{display:none}.surface{filter:drop-shadow(0 12px 24px #00000014)drop-shadow(0 2px 4px #0000000a);position:absolute;inset:0}.surface>*{position:absolute;inset:0}.edge{background:var(--lw-color-border);clip-path:inset(0 0 calc(100% - var(--_h)) calc(100% - var(--_w)) round 16px)}.fill,.content{clip-path:inset(1px 1px calc(100% - var(--_h) + 1px) calc(100% - var(--_w) + 1px) round 15px)}.fill{background:var(--_surface)}.content{position:relative}[data-phase=open] .content{pointer-events:auto}.pages{width:max-content;transition:transform .3s var(--_ease);align-items:flex-start;display:flex}[data-page=accounts] .pages{transform:translate(-288px)}.page{box-sizing:border-box;width:288px;transition:opacity .3s var(--_ease);flex:none;padding:.375rem}.page[inert]{opacity:0}.instant-pages .pages,.instant-pages .page{transition:none}.body{opacity:0;transition:opacity .12s var(--_ease)}[data-phase=open] .body{opacity:1;transition:opacity .2s var(--_ease) 50ms}.instant .body{transition:none}.head{justify-content:space-between;align-items:flex-start;padding:.625rem .625rem .75rem;display:flex}.plan{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);flex:none;padding-top:.125rem}.menu{outline:none}.status,.item{outline:none;transition:background-color .1s ease-out,color .1s ease-out}.status:focus,.item:focus{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.item{box-sizing:border-box;width:100%;font-size:var(--lw-text-sm);text-align:left;color:color-mix(in oklab, var(--lw-color-foreground) 80%, transparent);cursor:default;background:0 0;border:0;border-radius:10px;align-items:center;gap:.625rem;padding:.5rem .625rem;display:flex;position:relative}.item>svg,.item .icon,.item .value{color:var(--lw-color-muted-foreground)}.item[hidden]{display:none}.icon{display:grid}.value{font-size:var(--lw-text-xs)}.field{justify-content:space-between;align-items:center;min-width:0;padding:.25rem .25rem .25rem .625rem;display:flex}.caption{font-size:var(--lw-text-sm);color:var(--lw-color-muted-foreground)}.radios{display:flex}.status{border-radius:var(--lw-radius-md);font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);cursor:default;background:0 0;border:0;align-items:center;gap:.375rem;padding:.375rem .5rem;display:flex}.status .dot{width:.5rem;height:.5rem}.status[aria-checked=true]{color:var(--lw-color-foreground)}.status[aria-checked=false] .dot{background:var(--lw-color-border)}.themes{background:var(--lw-color-muted);border-radius:10px;padding:2px;display:flex;position:relative}.theme-plate{border-radius:var(--lw-radius-md);background:var(--_surface);width:2.25rem;height:1.75rem;translate:calc(var(--_i,0) * 100%) 0;position:absolute;top:2px;left:2px;box-shadow:0 1px 2px #00000014}@media (prefers-reduced-motion:no-preference){.theme-plate{transition:translate .25s var(--_ease)}}.theme{border-radius:var(--lw-radius-md);width:2.25rem;height:1.75rem;color:var(--lw-color-muted-foreground);cursor:default;transition:color var(--lw-duration-fast) ease-out;background:0 0;border:0;outline:none;place-items:center;display:grid;position:relative}.theme:hover,.theme[aria-checked=true]{color:var(--lw-color-foreground)}.theme:focus-visible{box-shadow:0 0 0 2px var(--lw-color-ring)}.stack{display:flex}.stack .avatar{box-shadow:0 0 0 2px var(--_surface)}.stack .avatar+.avatar{margin-left:-.375rem}.back{gap:.375rem;padding-left:.375rem;font-weight:500}.account .text{flex:1}.account .text .name{font-weight:400}.account>svg{color:var(--lw-color-foreground)}.add-mark{box-sizing:border-box;border:1px dashed var(--lw-color-border);width:1.75rem;height:1.75rem;color:var(--lw-color-muted-foreground);border-radius:50%;place-items:center;display:grid}.sign-out{touch-action:none;-webkit-user-select:none;user-select:none}.hint{font-size:var(--lw-text-xs);opacity:.6}.hint:before{content:\"Hold\"}[data-nudge] .hint:before{content:\"Keep holding\"}.fill-copy{background:var(--lw-color-primary);color:var(--lw-color-primary-foreground);clip-path:inset(0 100% 0 0 round 10px);transition:clip-path .24s var(--_ease);border-radius:10px;align-items:center;gap:.625rem;padding-inline:.625rem;display:flex;position:absolute;inset:0}.fill-copy>svg{color:inherit}:is([data-holding],[data-done])>.fill-copy{clip-path:inset(0 round 10px)}[data-holding]>.fill-copy{transition:clip-path var(--_hold,1.2s) linear}", w = [
	{
		id: "personal",
		name: "Maya Ortega",
		email: "maya@ortega.me",
		plan: "Pro"
	},
	{
		id: "lowersoft",
		name: "LowerSoft",
		email: "team@lowersoft.dev",
		plan: "Team"
	},
	{
		id: "side",
		name: "Night Shift",
		email: "hello@nightshift.dev",
		plan: "Free"
	}
], T = [
	{
		label: "Profile",
		icon: d
	},
	{
		label: "Settings",
		icon: v,
		value: "⌘,"
	},
	{
		label: "Billing",
		icon: S
	}
], E = [
	{
		id: "online",
		label: "Online",
		name: "Online"
	},
	{
		id: "away",
		label: "Away",
		name: "Away"
	},
	{
		id: "busy",
		label: "DND",
		name: "Do not disturb"
	}
], D = [
	{
		id: "light",
		label: "Light",
		icon: b
	},
	{
		id: "dark",
		label: "Dark",
		icon: m
	},
	{
		id: "system",
		label: "System",
		icon: p
	}
], O = 288, k = o(.3, 0), A = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End"
]), j = 1400, M = (e) => e.detail === 0 ? "keyboard" : "pointer", N = (e, t, r, i, a = "") => `<span class="avatar"${a} data-tone="${t % 3}" style="--_size: ${r}px" aria-hidden="true">${n(e.initials ?? u(e.name))}${i ? `<span class="dot" data-status="${i}"></span>` : ""}</span>`, P = (e, t, r, i) => `${N(e, t, i ? 40 : 32, r, " data-piece=\"avatar\"")}<span class="text"><span class="name" data-piece="name">${n(e.name)}</span><span class="email" data-piece="email">${n(e.email)}</span></span>`, F = (e, t, n) => {
	if (n === "Home") return e[0];
	if (n === "End") return e.at(-1);
	let r = e.find((e) => e === t);
	if (!r) return n === "ArrowUp" ? e.at(-1) : e[0];
	if (n === "ArrowLeft" || n === "ArrowRight") {
		let t = e.filter((e) => e.dataset.row === r.dataset.row);
		return t.length < 2 ? void 0 : t[(t.indexOf(r) + (n === "ArrowRight" ? 1 : -1) + t.length) % t.length];
	}
	let i = [...new Set(e.map((e) => e.dataset.row))], a = n === "ArrowDown" ? 1 : -1, o = i[(i.indexOf(r.dataset.row) + a + i.length) % i.length], s = e.filter((e) => e.dataset.row === o);
	return s.find((e) => e.ariaChecked === "true") ?? s[0];
}, I = class extends e {
	static styles = C;
	static props = {
		accounts: {
			type: Object,
			default: w
		},
		account: { default: "" },
		items: {
			type: Object,
			default: T
		},
		status: {
			default: "online",
			reflect: !0
		},
		holdDuration: {
			type: Number,
			default: 1200
		}
	};
	#e = "closed";
	#t = "main";
	#n = 0;
	#r = 0;
	#i = {
		w: 0,
		h: 0
	};
	#a = [];
	#o = {
		open: null,
		height: null
	};
	#s = {
		timer: 0,
		nudge: 0
	};
	render() {
		let e = E.map(({ id: e, label: t, name: n }) => `<button class="status" type="button" role="menuitemradio" tabindex="-1" data-menu-item data-row="status" data-status="${e}" aria-label="${n}"><span class="dot" data-status="${e}"></span>${t}</button>`).join(""), t = D.map(({ id: e, label: t, icon: n }) => `<button class="theme" type="button" role="menuitemradio" tabindex="-1" data-menu-item data-row="theme" data-theme="${e}" aria-label="${t}">${r(n, 14)}</button>`).join(""), n = `${r(f)}<span class="grow">Sign out</span><span class="hint"></span>`;
		return `<button class="trigger" part="trigger" type="button" aria-haspopup="menu" aria-expanded="false"><span class="identity"></span>${r(_)}</button>
<div class="panel" part="panel" hidden data-page="main">
  <div class="surface" aria-hidden="true"><div class="edge"></div><div class="fill"></div></div>
  <div class="content"><div class="pages">
    <div class="page main">
      <div class="head"><span class="identity stacked"></span><span class="plan body"></span></div>
      <div class="menu body" role="menu" tabindex="-1">
        <div class="field" role="group" aria-label="Status"><span class="caption">Status</span><span class="radios">${e}</span></div>
        <div class="field" role="group" aria-label="Theme"><span class="caption">Theme</span><span class="themes"><span class="theme-plate" aria-hidden="true"></span>${t}</span></div>
        <hr>
        <div class="items"></div>
        <button class="item switch" type="button" role="menuitem" tabindex="-1" data-menu-item data-row="switch" aria-haspopup="menu" aria-expanded="false"><span class="stack"></span><span class="grow">Switch account</span>${r(y)}</button>
        <hr>
        <button class="item sign-out" type="button" role="menuitem" tabindex="-1" data-menu-item data-row="sign-out">${n}<span class="visually-hidden">, press and hold to confirm</span><span class="fill-copy" aria-hidden="true">${n}</span></button>
      </div>
    </div>
    <div class="page accounts" inert>
      <div class="menu body" role="menu" tabindex="-1" aria-label="Switch account">
        <button class="item back" type="button" role="menuitem" tabindex="-1" data-menu-item data-row="back">${r(x)}<span class="visually-hidden">Back to </span>Switch account</button>
        <hr>
        <div class="list"></div>
        <hr>
        <button class="item add" type="button" role="menuitem" tabindex="-1" data-menu-item data-row="add"><span class="add-mark">${r(h, 14)}</span>Add account</button>
      </div>
    </div>
  </div></div>
</div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".trigger"), n = this.query(".panel");
		t.addEventListener("click", (e) => this.#v(M(e), M(e) === "keyboard" ? "first" : "menu"), e), t.addEventListener("keydown", (e) => this.#w(e), e), n.addEventListener("click", (e) => this.#C(e), e), n.addEventListener("keydown", (e) => this.#T(e), e), n.addEventListener("pointermove", (e) => this.#E(e), e);
		let r = this.query(".sign-out");
		r.addEventListener("pointerdown", (e) => this.#D(e), e);
		for (let t of [
			"pointerup",
			"pointercancel",
			"blur"
		]) r.addEventListener(t, () => this.#k(), e);
		r.addEventListener("contextmenu", (e) => e.preventDefault(), e), r.addEventListener("keyup", (e) => (e.key === "Enter" || e.key === " ") && this.#k(), e), document.addEventListener("pointerdown", (e) => !e.composedPath().includes(this) && this.#y("pointer", !1), {
			...e,
			capture: !0
		}), s(() => this.#u(), this.signal), this.signal.addEventListener("abort", () => this.#b());
	}
	updated(e) {
		[
			"accounts",
			"account",
			"items"
		].some((t) => e.has(t)) && this.#l(), e.has("holdDuration") && this.query(".sign-out").style.setProperty("--_hold", `${this.holdDuration}ms`), this.#u();
	}
	get #c() {
		return this.accounts.find(({ id: e }) => e === this.account) ?? this.accounts[0] ?? {
			id: "guest",
			name: "Guest",
			email: ""
		};
	}
	#l() {
		let e = this.#c, t = Math.max(0, this.accounts.indexOf(e)), i = this.accounts.filter((t) => t !== e);
		this.query(".trigger .identity").innerHTML = P(e, t, this.status, !1), this.query(".head .identity").innerHTML = P(e, t, this.status, !0), this.query(".plan").textContent = e.plan ?? "", this.query(".items").innerHTML = this.items.map((e, t) => {
			let i = e.href ? "a" : "button";
			return `<${i} class="item"${e.href ? ` href="${n(e.href)}"${e.external ? " target=\"_blank\" rel=\"noopener noreferrer\"" : ""}` : " type=\"button\""} role="menuitem" tabindex="-1" data-menu-item data-row="item-${t}" data-index="${t}"><span class="icon">${e.icon ? r(e.icon) : ""}</span><span class="grow">${n(e.label)}</span>${e.value ? `<span class="value">${n(e.value)}</span>` : ""}</${i}>`;
		}).join("");
		let a = this.query(".switch");
		a.hidden = this.accounts.length < 2, a.querySelector(".stack").innerHTML = i.slice(0, 2).map((e) => N(e, this.accounts.indexOf(e), 20)).join(""), this.query(".list").innerHTML = this.accounts.map((t, i) => `<button class="item account" type="button" role="menuitemradio" tabindex="-1" data-menu-item data-row="account-${i}" data-account="${n(t.id)}" aria-checked="${t === e}">${N(t, i, 28, t === e ? this.status : null)}<span class="text"><span class="name">${n(t.name)}</span><span class="email">${n(t.email)}</span></span>${t === e ? r(g) : ""}</button>`).join(""), this.#e === "open" && this.#_(this.#d.offsetHeight, !1);
	}
	#u() {
		for (let e of this.shadowRoot.querySelectorAll(".status")) e.ariaChecked = String(e.dataset.status === this.status);
		for (let e of this.shadowRoot.querySelectorAll(".avatar .dot")) e.dataset.status = this.status;
		let e = c(), t = [...this.shadowRoot.querySelectorAll(".theme")];
		t.forEach((t) => t.ariaChecked = String(t.dataset.theme === e)), this.query(".themes").style.setProperty("--_i", t.findIndex((t) => t.dataset.theme === e));
	}
	get #d() {
		return this.query(`.page.${this.#t}`);
	}
	#f(e = this.#d) {
		return [...e.querySelectorAll("[data-menu-item]")].filter((e) => !e.closest("[hidden]"));
	}
	#p() {
		for (let e of Object.keys(this.#o)) this.#o[e]?.(), this.#o[e] = null;
	}
	#m() {
		let e = this.#n, t = this.#i.w + (O - this.#i.w) * e, n = this.#i.h + (this.#r - this.#i.h) * e, r = this.query(".panel");
		r.style.setProperty("--_w", `${t}px`), r.style.setProperty("--_h", `${n}px`);
		let i = 1 - e;
		for (let { el: e, dx: t, dy: n, scale: r } of this.#a) e.style.transform = `translate(${t * i}px, ${n * i}px) scale(${1 + (r - 1) * i})`;
	}
	#h() {
		let e = this.query(".trigger");
		this.#i = {
			w: e.offsetWidth,
			h: e.offsetHeight
		}, this.#a = [...this.query(".head").querySelectorAll("[data-piece]")].map((t) => {
			t.style.transform = "";
			let n = t.getBoundingClientRect(), r = e.querySelector(`[data-piece="${t.dataset.piece}"]`).getBoundingClientRect();
			return {
				el: t,
				dx: r.left - n.left,
				dy: r.top - n.top,
				scale: r.height / n.height || 1
			};
		});
	}
	#g(e, t) {
		this.#o.open?.(), this.#o.open = i(this.#n, e, {
			...k,
			restDelta: .001,
			update: (e) => {
				this.#n = e, this.#m();
			},
			done: () => {
				this.#o.open = null, t?.();
			}
		});
	}
	#_(e, t) {
		this.#o.height?.(), this.#o.height = null, t || a.matches ? (this.#r = e, this.#m()) : this.#o.height = i(this.#r, e, {
			...k,
			restDelta: .1,
			update: (e) => {
				this.#r = e, this.#m();
			}
		});
	}
	#v(e, t) {
		if (this.#e === "open") return;
		let n = this.#e === "closing", r = e === "keyboard" || a.matches;
		this.#e = "open";
		let i = this.query(".panel");
		i.hidden = !1, i.classList.toggle("instant", r), this.#x("main", !0), this.toggleAttribute("data-open", !0), this.query(".trigger").ariaExpanded = "true", n || this.#h(), this.#r = this.#d.offsetHeight, this.#p(), r ? (this.#n = 1, this.#m()) : (n || (this.#n = 0), this.#m(), this.#g(1)), i.dataset.phase = "open";
		let o = this.#f();
		({
			first: o[0],
			last: o.at(-1),
			menu: this.query(".main .menu")
		})[t]?.focus({ preventScroll: !0 });
	}
	#y(e, t) {
		if (this.#e !== "open") return;
		let n = this.query(".trigger");
		if (t && n.focus({ preventScroll: !0 }), this.query(".sign-out").hasAttribute("data-done") || this.#k(!0), n.ariaExpanded = "false", e === "keyboard" || a.matches) {
			this.#b();
			return;
		}
		this.#e = "closing";
		let r = this.query(".panel");
		r.classList.remove("instant"), r.dataset.phase = "closing", this.#o.height?.(), this.#h(), this.#m(), this.#g(0, () => this.#b());
	}
	#b() {
		this.#p(), this.#e = "closed", this.#n = 0, this.#k(!0);
		let e = this.query(".panel");
		e.hidden = !0, delete e.dataset.phase, this.removeAttribute("data-open");
	}
	#x(e, t = !1) {
		this.#t = e;
		let n = this.query(".panel");
		n.dataset.page = e, n.classList.toggle("instant-pages", t);
		for (let t of this.shadowRoot.querySelectorAll(".page")) t.inert = !t.classList.contains(e);
		this.query(".switch").ariaExpanded = String(e === "accounts"), t || this.#_(this.#d.offsetHeight, !1);
	}
	#S(e) {
		if (this.#x(e), e === "accounts") {
			let e = this.#f();
			(e.find((e) => e.ariaChecked === "true") ?? e[0]).focus({ preventScroll: !0 });
		} else this.query(".switch").focus({ preventScroll: !0 });
	}
	#C(e) {
		let t = e.target.closest("[data-menu-item]");
		if (!t) return;
		let n = M(e), { row: r } = t.dataset;
		if (r === "status") this.status = t.dataset.status, this.emit("status", { status: this.status });
		else if (r === "theme") l(t.dataset.theme), this.emit("theme", { theme: t.dataset.theme });
		else if (r === "switch") this.#S("accounts");
		else if (r === "back") this.#S("main");
		else if (t.dataset.account !== void 0) {
			let e = this.accounts.find(({ id: e }) => e === t.dataset.account);
			e && e !== this.#c && (this.account = e.id, this.#l(), this.emit("account", { account: e })), this.#S("main");
		} else if (r === "add") this.emit("add-account"), this.#y(n, !0);
		else if (t.dataset.index !== void 0) {
			let e = Number(t.dataset.index);
			this.emit("select", {
				item: this.items[e],
				index: e
			}), this.#y(n, !0);
		}
	}
	#w(e) {
		(e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), this.#v("keyboard", e.key === "ArrowDown" ? "first" : "last"));
	}
	#T(e) {
		if (e.target.matches(".sign-out") && (e.key === "Enter" || e.key === " ")) {
			e.preventDefault(), e.repeat || this.#O("keyboard");
			return;
		}
		if (e.key === "Escape" || e.key === "Tab") {
			e.preventDefault(), this.#y("keyboard", !0);
			return;
		}
		if (this.#t === "accounts" && e.key === "Backspace") {
			e.preventDefault(), this.#S("main");
			return;
		}
		if (!A.has(e.key)) return;
		e.preventDefault();
		let t = this.shadowRoot.activeElement, n = F(this.#f(), t, e.key);
		n ? n.focus({ preventScroll: !0 }) : this.#t === "accounts" && e.key === "ArrowLeft" ? this.#S("main") : e.key === "ArrowRight" && t?.matches(".switch") && this.#S("accounts");
	}
	#E(e) {
		if (e.pointerType !== "mouse" || this.#e !== "open") return;
		let t = e.target.closest("[data-menu-item]");
		t && this.shadowRoot.activeElement !== t && t.focus({ preventScroll: !0 });
	}
	#D(e) {
		e.button === 0 && (e.currentTarget.setPointerCapture?.(e.pointerId), this.#O("pointer"));
	}
	#O(e) {
		let t = this.query(".sign-out");
		this.#s.timer || t.hasAttribute("data-done") || (clearTimeout(this.#s.nudge), t.removeAttribute("data-nudge"), t.toggleAttribute("data-holding", !0), this.#s.timer = setTimeout(() => {
			this.#s.timer = 0, t.removeAttribute("data-holding"), t.toggleAttribute("data-done", !0), this.emit("sign-out"), this.#y(e, !0);
		}, this.holdDuration));
	}
	#k(e = !1) {
		let t = this.query(".sign-out");
		if (clearTimeout(this.#s.nudge), e) {
			clearTimeout(this.#s.timer), this.#s.timer = 0;
			for (let e of [
				"data-holding",
				"data-nudge",
				"data-done"
			]) t.removeAttribute(e);
		} else this.#s.timer && (clearTimeout(this.#s.timer), this.#s.timer = 0, t.removeAttribute("data-holding"), t.toggleAttribute("data-nudge", !0), this.#s.nudge = setTimeout(() => t.removeAttribute("data-nudge"), j));
	}
};
//#endregion
//#region src/components/profile-dropdown/index.js
t("profile-dropdown", I);
//#endregion
export { I as t };
