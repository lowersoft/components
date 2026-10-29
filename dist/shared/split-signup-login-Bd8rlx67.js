import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { n as r } from "./face-BTqcW8Ou.js";
import { i, n as a, r as o } from "./login-CR429yh-.js";
//#region src/components/split-signup-login/split-signup-login.scss?inline
var s = ":host{--_ink:var(--lw-color-foreground);--_muted:var(--lw-color-muted-foreground);--_line:var(--lw-color-border);--_surface:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));--_skeleton:color-mix(in oklab, var(--lw-color-foreground) 9%, transparent);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:56rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:.5rem;display:block;container-type:inline-size}.split{gap:.5rem;display:grid}@container (width>=44rem){.split{grid-template-columns:minmax(0,1fr) minmax(0,.95fr)}}.logo{background:var(--lw-color-foreground);width:2.25rem;height:2.25rem;font-size:var(--lw-text-md);color:var(--lw-color-background);border-radius:.625rem;place-items:center;font-weight:700;display:grid}.title{font-size:var(--lw-text-lg);margin:0;font-weight:600}.lead{color:var(--lw-color-muted-foreground);margin:0}.providers{grid-template-columns:1fr 1fr;gap:.5rem;display:grid}.providers lw-button::part(button){width:100%}.divider{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);align-items:center;gap:.75rem;margin:0;display:flex}.divider:before,.divider:after{content:\"\";border-top:1px solid var(--lw-color-border);flex:1}.portrait{width:var(--_portrait,2.75rem);height:var(--_portrait,2.75rem);flex:none;position:relative}.portrait>svg{border-radius:50%;width:100%;height:100%;display:block}.mark{background:var(--_mark);width:42%;height:42%;box-shadow:0 0 0 2px var(--lw-color-background);color:#fff;border-radius:28%;place-items:center;display:grid;position:absolute;bottom:-.25rem;right:-.25rem}.mark svg{width:70%;height:70%}p,dl,dd{margin:0}.form{align-content:start;gap:1rem;padding:1.5rem 1.5rem 1.25rem;display:grid}.form[hidden]{display:none}.form lw-text-input,.form lw-password-input{width:100%;display:block}.intro{gap:.5rem;margin:.5rem 0;display:grid}.title{font-size:1.25rem}.submit::part(button){width:100%}.foot{color:var(--_muted)}.foot a{color:var(--_ink);text-underline-offset:.2em;font-weight:500}.preview{border:1px solid var(--_line);background:var(--_surface);border-radius:1rem;align-content:start;gap:1rem;padding:1.25rem;display:grid}.preview-head{color:var(--_muted);justify-content:space-between;display:flex}.app{border:1px solid var(--_line);background:var(--lw-color-background);font-size:var(--lw-text-xs);border-radius:.75rem;grid-template-columns:7.5rem minmax(0,1fr);display:grid;overflow:hidden}.side{border-right:1px solid var(--_line);color:var(--_muted);align-content:start;gap:.125rem;padding:.75rem .5rem;display:grid}.side>span:not(.ws){border-radius:var(--lw-radius-sm);padding:.3rem .5rem}.side [data-on]{background:color-mix(in oklab, var(--_ink) 7%, transparent);color:var(--_ink)}.ws{min-width:0;color:var(--_ink);align-items:center;gap:.5rem;margin-bottom:.625rem;padding:0 .25rem;display:flex}.ws-logo{background:var(--_ink);width:1.375rem;height:1.375rem;color:var(--lw-color-background);border-radius:.375rem;flex:none;place-items:center;font-weight:700;display:grid}.ws-logo .mark{width:100%;height:100%;box-shadow:none;position:static}[data-empty]>.ws-logo{border:1px dashed var(--_line);background:0 0}.ws-name{text-overflow:ellipsis;white-space:nowrap;font-weight:600;overflow:hidden}[data-empty]>.ws-name{background:var(--_skeleton);border-radius:1px;flex:1;height:.375rem}.main{align-content:start;gap:.75rem;padding:.875rem;display:grid}.greeting{font-size:var(--lw-text-sm);font-weight:600}.greeting[data-empty]{background:var(--_skeleton);border-radius:2px;width:45%;height:.5rem}.empty{color:var(--_muted)}.tiles{grid-template-columns:1fr 1fr;gap:.5rem;display:grid}.tiles span{border:1px dashed var(--_line);border-radius:var(--lw-radius-md);color:var(--_muted);padding:1rem .5rem}.found{gap:.75rem;display:grid}.hint{color:var(--_muted)}.choice{grid-template-columns:1fr 1fr;gap:.5rem;display:grid}.choice[hidden]{display:none}.option{border:1px solid var(--_line);border-radius:var(--lw-radius-md);background:var(--lw-color-background);font:inherit;text-align:left;color:var(--_muted);cursor:pointer;outline:none;align-items:center;gap:.5rem;padding:.625rem .75rem;display:flex}.option[aria-checked=true]{border-color:var(--_ink);color:var(--_ink)}.option:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.option-mark{flex:none;place-items:center;width:1.25rem;height:1.25rem;display:grid}.option-mark .mark{width:100%;height:100%;box-shadow:none;position:static}.option-mark.new{border:1px dashed var(--_line);border-radius:.375rem}.facts{display:grid}.facts div{border-top:1px solid var(--_line);justify-content:space-between;align-items:center;gap:1rem;min-height:2.75rem;display:flex}.facts dt{color:var(--_muted)}.facts dd{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.facts dd[data-empty]{background:var(--_skeleton);border-radius:2px;width:6rem;height:.5rem}.you{--_portrait:1.75rem;align-items:center;gap:.5rem;display:flex}.you[data-empty] .portrait{display:none}.done{align-content:center;gap:.5rem;padding:2rem 1.5rem;display:grid}.done[hidden]{display:none}", c = 1100, l = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, u = [
	"gmail.com",
	"googlemail.com",
	"outlook.com",
	"hotmail.com",
	"icloud.com",
	"yahoo.com",
	"proton.me"
], d = [
	"Home",
	"Projects",
	"Inbox",
	"Docs",
	"Members",
	"Settings"
], f = [
	"New project",
	"Invite team",
	"Import data",
	"Pick a theme"
], p = { "northwind.dev": {
	name: "Northwind",
	members: 14,
	mark: {
		glyph: "triangle",
		color: "#2f6b55"
	}
} }, m = (e) => e.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), h = (e) => e.charAt(0).toUpperCase() + e.slice(1), g = class extends e {
	static styles = s;
	static props = {
		brand: { default: "LowerSoft" },
		teams: {
			type: Object,
			default: p
		},
		appDomain: { default: "lowersoft.dev" },
		signInHref: { default: "#" }
	};
	#e = !0;
	#t = null;
	render() {
		return `<div class="split"><form class="form" novalidate><span class="logo" aria-hidden="true"></span><div class="intro"><h2 class="title"></h2><p class="lead">Build, profile and ship native code together. Free for teams up to 10.</p></div>
${i()}<p class="divider"><span>or with email</span></p>
<lw-text-input class="name" label="Full name" placeholder="Sam Ortiz" autocomplete="name" required></lw-text-input>
<lw-text-input class="email" label="Work email" type="email" placeholder="sam@company.com" autocomplete="email" required></lw-text-input>
<lw-password-input class="password" label="Password" required></lw-password-input>
<lw-button class="submit" type="submit">Create account</lw-button><p class="foot">Already have an account? <a class="sign-in">Sign in</a></p></form>
<aside class="preview" aria-label="Your account" aria-live="polite"><header class="preview-head"><span>Your account</span><span>Preview</span></header>
<div class="app" aria-hidden="true"><nav class="side"><span class="ws"><span class="ws-logo"></span><span class="ws-name"></span></span>${d.map((e, t) => `<span${t ? "" : " data-on"}>${e}</span>`).join("")}</nav>
<div class="main"><span class="greeting"></span><p class="empty">Nothing here yet</p><div class="tiles">${f.map((e) => `<span>+ ${e}</span>`).join("")}</div></div></div>
<div class="found"><p class="hint"></p><div class="choice" role="radiogroup" aria-label="Workspace" hidden><button class="option" type="button" role="radio" data-join="true"><span class="option-mark"></span><span class="option-text"></span></button><button class="option" type="button" role="radio" data-join="false"><span class="option-mark new">+</span><span>Start a new workspace</span></button></div></div>
<dl class="facts"><div><dt>You</dt><dd class="you"><span class="portrait"></span><span class="you-name"></span></dd></div><div><dt>Address</dt><dd class="address"></dd></div><div><dt>Role</dt><dd class="role"></dd></div><div><dt>Plan</dt><dd>Free · 14-day Pro trial</dd></div></dl></aside>
<div class="done" hidden><h2 class="title done-title"></h2><p class="lead done-text"></p></div></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		for (let t of [".name", ".email"]) this.query(t).addEventListener("input", () => this.#r(), e);
		this.query(".choice").addEventListener("click", (e) => {
			let t = e.target.closest(".option");
			t && (this.#e = t.dataset.join === "true", this.#r());
		}, e), this.query(".form").addEventListener("submit", (e) => {
			e.preventDefault(), this.#i();
		}, e);
		for (let t of this.shadowRoot.querySelectorAll(".provider")) t.addEventListener("click", () => this.emit("provider", { provider: t.dataset.provider }), e);
		this.#t = a(this.query(".portrait"), " ");
	}
	updated() {
		this.query(".logo").textContent = (this.brand ?? "").charAt(0).toUpperCase(), this.query(".form .title").textContent = `Create your ${this.brand} account`, this.query(".sign-in").href = this.signInHref ?? "#", this.#r();
	}
	get #n() {
		let e = (this.query(".name").value ?? "").trim(), t = (this.query(".email").value ?? "").trim().toLowerCase(), n = l.test(t) ? t.split("@")[1] : "", r = e.split(/\s+/)[0] ?? "", i = n ? this.teams?.[n] : null;
		if (i && this.#e) return {
			mode: "join",
			name: i.name,
			address: `${m(i.name)}.${this.appDomain}`,
			role: "Member",
			team: i
		};
		if (n && !i && !u.includes(n)) {
			let e = h(n.split(".")[0]);
			return {
				mode: "new",
				name: e,
				address: `${m(e)}.${this.appDomain}`,
				role: "Owner"
			};
		}
		return n || r ? {
			mode: i ? "new" : "personal",
			name: `${r || "Your"}'s workspace`,
			address: `${m(r || "you")}.${this.appDomain}`,
			role: "Owner",
			team: i
		} : null;
	}
	#r() {
		let e = (this.query(".name").value ?? "").trim(), t = this.#n, i = t?.team;
		this.query(".ws-logo").innerHTML = t ? i && t.mode === "join" ? o(i.mark) : `<span class="initial">${n(t.name.charAt(0))}</span>` : "", this.query(".ws").toggleAttribute("data-empty", !t), this.query(".ws-name").textContent = t?.name ?? "", this.query(".greeting").textContent = e ? `Welcome, ${e.split(/\s+/)[0]}` : "", this.query(".greeting").toggleAttribute("data-empty", !e);
		let a = this.query(".choice");
		if (a.hidden = !i, i) {
			this.query(".hint").textContent = `${i.name} is already on ${this.brand} · ${i.members} members`, this.query(".option-mark").innerHTML = o(i.mark), this.query(".option-text").textContent = `Join ${i.name}`;
			for (let e of a.querySelectorAll(".option")) e.ariaChecked = String(e.dataset.join === "true" === this.#e);
		} else this.query(".hint").textContent = t?.mode === "personal" ? "A personal workspace, just for you. Use your work email to find your team." : t ? `A new workspace for ${t.name}.` : "Use your work email and we'll find your team.";
		this.#t?.show(r(e || " ", 0)), this.query(".you").toggleAttribute("data-empty", !e), this.query(".you-name").textContent = e, this.query(".address").textContent = t?.address ?? "", this.query(".address").toggleAttribute("data-empty", !t), this.query(".role").textContent = t?.role ?? "", this.query(".role").toggleAttribute("data-empty", !t), this.query(".submit").textContent = t?.mode === "join" ? `Join ${t.name}` : "Create account";
	}
	async #i() {
		let e = [
			".name",
			".email",
			".password"
		].map((e) => this.query(e)), [t, n, r] = e;
		t.error = t.value?.trim() ? "" : "Enter your name.", n.error = l.test(n.value?.trim() ?? "") ? "" : "Enter a valid email address.", r.error = (r.value ?? "").length >= 8 ? "" : "Use at least 8 characters.";
		let i = e.find((e) => e.error);
		if (i) {
			i.focus();
			return;
		}
		let a = this.#n, o = {
			name: t.value.trim(),
			email: n.value.trim(),
			password: r.value,
			workspace: {
				mode: a.mode,
				name: a.name,
				address: a.address
			}
		}, s = this.query(".submit");
		s.loading = !0;
		let u = this.signUp ? await this.signUp(o) : await new Promise((e) => setTimeout(() => e(!0), c));
		s.loading = !1, u && (this.query(".done-title").textContent = a.mode === "join" ? `Welcome to ${a.name}` : `${a.name} is ready`, this.query(".done-text").textContent = `We sent a confirmation to ${o.email}. Your workspace lives at ${a.address}.`, this.query(".form").hidden = !0, this.query(".done").hidden = !1, this.emit("sign-up", {
			name: o.name,
			email: o.email,
			workspace: o.workspace
		}));
	}
};
//#endregion
//#region src/components/split-signup-login/index.js
t("split-signup-login", g);
//#endregion
export { g as t };
