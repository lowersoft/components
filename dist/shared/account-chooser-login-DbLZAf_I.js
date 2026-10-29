import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i, t as a } from "./highlight-BSyGT8bg.js";
import { D as o, Dt as s, R as c, U as l, m as u, r as d } from "./lucide-BVbUPHVq.js";
import { n as f, t as p } from "./login-CR429yh-.js";
//#region src/components/account-chooser-login/account-chooser-login.scss?inline
var m = ":host{--_ink:var(--lw-color-foreground);--_muted:var(--lw-color-muted-foreground);--_line:var(--lw-color-border);--_surface:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:29rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:.5rem;display:block}.logo{background:var(--lw-color-foreground);width:2.25rem;height:2.25rem;font-size:var(--lw-text-md);color:var(--lw-color-background);border-radius:.625rem;place-items:center;font-weight:700;display:grid}.title{font-size:var(--lw-text-lg);margin:0;font-weight:600}.lead{color:var(--lw-color-muted-foreground);margin:0}.providers{grid-template-columns:1fr 1fr;gap:.5rem;display:grid}.providers lw-button::part(button){width:100%}.divider{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);align-items:center;gap:.75rem;margin:0;display:flex}.divider:before,.divider:after{content:\"\";border-top:1px solid var(--lw-color-border);flex:1}.portrait{width:var(--_portrait,2.75rem);height:var(--_portrait,2.75rem);flex:none;position:relative}.portrait>svg{border-radius:50%;width:100%;height:100%;display:block}.mark{background:var(--_mark);width:42%;height:42%;box-shadow:0 0 0 2px var(--lw-color-background);color:#fff;border-radius:28%;place-items:center;display:grid;position:absolute;bottom:-.25rem;right:-.25rem}.mark svg{width:70%;height:70%}p{margin:0}.head{justify-content:space-between;align-items:center;padding:1rem 1rem 0;display:flex}.count{color:var(--_muted)}.intro{gap:.5rem;padding:1.25rem 1rem;display:grid}.intro[hidden]{display:none}.title{font-size:1.25rem}.list{border:1px solid var(--_line);background:var(--_surface);border-radius:1rem;outline:none;padding:.375rem;position:relative}.list[hidden]{display:none}.list:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.highlight{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.highlight{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.highlight.visible{opacity:1}.highlight{background:color-mix(in oklab, var(--_ink) 6%, transparent);border-radius:.75rem}.row{cursor:pointer;align-items:center;gap:.875rem;padding:.75rem;display:flex;position:relative}.row[data-signed-out] .portrait,.row[data-signed-out] .who{opacity:.55}.row>svg{color:var(--_muted);flex:none}.who{flex:1;gap:.125rem;min-width:0;display:grid}.line{align-items:center;gap:.375rem;min-width:0;display:flex}.name{white-space:nowrap;font-weight:500}.workspace{text-overflow:ellipsis;white-space:nowrap;color:var(--_muted);overflow:hidden}.badge{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--_ink) 10%, transparent);text-align:center;flex:none;min-width:1.125rem;padding:0 .3125rem;font-size:.6875rem;font-weight:600}.sub{min-width:0;color:var(--_muted);display:grid}.sub>span{text-overflow:ellipsis;white-space:nowrap;grid-area:1/1;overflow:hidden}@media (prefers-reduced-motion:no-preference){.sub>span{transition:opacity .15s ease-out,translate .15s ease-out}}.session{opacity:0;translate:0 .25rem}.row[aria-selected=true] .email{opacity:0;translate:0 -.25rem}.row[aria-selected=true] .session{opacity:1;translate:0}.method{border:1px solid var(--_line);border-radius:var(--lw-radius-full);font-size:var(--lw-text-xs);color:var(--_muted);flex:none;align-items:center;gap:.375rem;padding:.25rem .625rem;display:inline-flex}.method svg{width:.875rem;height:.875rem}.forget{width:1.75rem;height:1.75rem;color:var(--_muted);cursor:pointer;opacity:0;background:0 0;border:0;border-radius:50%;outline:none;flex:none;place-items:center;padding:0;display:grid}.row[aria-selected=true] .forget,.forget:focus-visible{opacity:1}.forget:hover{background:color-mix(in oklab, var(--_ink) 8%, transparent);color:var(--_ink)}.forget:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.step{gap:1.25rem;padding:1rem;display:grid}.step[hidden]{display:none}@media (prefers-reduced-motion:no-preference){.step{animation:.3s cubic-bezier(.23,1,.32,1) step-in}}@keyframes step-in{0%{opacity:0;translate:0 .5rem}}.back{font:inherit;color:var(--_muted);cursor:pointer;background:0 0;border:0;outline:none;justify-self:start;align-items:center;gap:.375rem;padding:0;display:inline-flex}.back:hover{color:var(--_ink)}.back:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.chosen{--_portrait:3.5rem;align-items:center;gap:1rem;display:flex}.chosen .who{gap:.25rem}.chosen .name{font-size:var(--lw-text-lg);font-weight:600}.chosen .email{color:var(--_muted)}.step-form{gap:.75rem;display:grid}.step-form lw-text-input{display:block}.step-form .go::part(button){width:100%}.note{font-size:var(--lw-text-xs);color:var(--_muted)}.signed-in{border-radius:var(--lw-radius-md);text-align:center;color:var(--lightningcss-light,#047857)var(--lightningcss-dark,#34d399);background:var(--lightningcss-light,#05966924)var(--lightningcss-dark,#34d39924);background:var(--lightningcss-light,lab(54.8183% -43.5039 13.9397/.14))var(--lightningcss-dark,lab(75.6955% -52.188 16.7595/.14));padding:.75rem}.foot{justify-content:center;align-items:center;min-height:3rem;padding:.5rem;display:flex}.foot [hidden]{display:none}.undo-bar{color:var(--_muted);align-items:center;gap:.5rem;display:flex}", h = 5e3, g = 1100, _ = [
	{
		name: "Maya Chen",
		workspace: "Northwind",
		email: "maya@northwind.dev",
		badge: 3,
		mark: {
			glyph: "triangle",
			color: "#2f6b55"
		},
		device: "MacBook Pro",
		seen: "Active now"
	},
	{
		name: "Maya Chen",
		workspace: "Personal",
		email: "maya.chen@gmail.com",
		method: "google",
		mark: {
			glyph: "leaf",
			color: "#8a7350"
		},
		device: "MacBook Pro",
		seen: "2 days ago"
	},
	{
		name: "Theo Okafor",
		workspace: "Fieldnotes",
		email: "theo@fieldnotes.co",
		method: "passkey",
		badge: 12,
		mark: {
			glyph: "lines",
			color: "#6b6b70"
		},
		device: "iPhone",
		seen: "Yesterday"
	},
	{
		name: "Ines Alves",
		workspace: "Harbor Studio",
		email: "ines@harbor.studio",
		method: "password",
		mark: {
			glyph: "arch",
			color: "#6d6a8f"
		},
		device: "MacBook Pro",
		seen: "Last week",
		signedOut: !0
	}
], v = { "northwind.dev": "Okta" }, y = {
	sso: {
		icon: c,
		label: (e) => e.provider,
		action: (e) => `Continue with ${e.provider}`
	},
	google: {
		icon: null,
		label: () => "Google",
		action: () => "Continue with Google"
	},
	passkey: {
		icon: o,
		label: () => "Passkey",
		action: () => "Use your passkey"
	},
	password: {
		icon: l,
		label: () => "Password",
		action: () => "Sign in"
	}
}, b = (e, t) => `<span class="method">${e === "google" ? p : r(y[e].icon, 14)}${n(y[e].label(t))}</span>`, x = class extends e {
	static styles = m;
	static props = {
		brand: { default: "LowerSoft" },
		accounts: {
			type: Object,
			default: _
		},
		ssoDomains: {
			type: Object,
			default: v
		}
	};
	#e = 0;
	#t = null;
	#n = 0;
	render() {
		return "<header class=\"head\"><span class=\"logo\" aria-hidden=\"true\"></span><span class=\"count\"></span></header>\n<div class=\"intro\"><h2 class=\"title\">Choose an account</h2><p class=\"lead\"></p></div>\n<div class=\"list\" role=\"listbox\" tabindex=\"0\" aria-label=\"Accounts\"><span class=\"highlight\"></span><div class=\"rows\"></div></div>\n<section class=\"step\" hidden aria-live=\"polite\"></section>\n<footer class=\"foot\"><lw-button class=\"another\" variant=\"ghost\">Use another account</lw-button><div class=\"undo-bar\" role=\"status\" hidden><span class=\"undo-text\"></span><lw-button class=\"undo\" variant=\"ghost\" size=\"sm\">Undo</lw-button></div></footer>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".list");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".forget"), n = e.target.closest(".row");
			n && (t ? this.#f(Number(n.dataset.index)) : this.#l(Number(n.dataset.index)));
		}, e), t.addEventListener("pointermove", (e) => {
			let t = e.target.closest(".row");
			t && this.#o(Number(t.dataset.index));
		}, e), t.addEventListener("pointerleave", () => this.#s(), e), t.addEventListener("keydown", (e) => this.#c(e), e), this.query(".another").addEventListener("click", () => this.emit("use-another"), e), this.query(".undo").addEventListener("click", () => this.#p(), e), this.signal.addEventListener("abort", () => clearTimeout(this.#n));
	}
	updated(e) {
		this.query(".logo").textContent = (this.brand ?? "").charAt(0).toUpperCase(), this.query(".lead").textContent = `to continue to ${this.brand}`, (e.has("accounts") || e.has("ssoDomains")) && this.#a();
	}
	#r(e) {
		return e.method ? e.method : this.ssoDomains?.[e.email.split("@")[1]] ? "sso" : "password";
	}
	#i(e) {
		let t = this.#r(e);
		return {
			...e,
			method: t,
			provider: e.provider ?? this.ssoDomains?.[e.email.split("@")[1]] ?? "SSO"
		};
	}
	#a() {
		let e = this.accounts ?? [];
		this.query(".count").textContent = `${e.length} on this device`;
		let t = this.query(".rows");
		t.innerHTML = e.map((e, t) => {
			let i = this.#i(e), a = `${i.device ?? "This device"} · ${i.seen ?? ""}`;
			return `<div class="row" role="option" id="account-${t}" data-index="${t}"${i.signedOut ? " data-signed-out" : ""} aria-selected="false">
<span class="portrait"></span><span class="who"><span class="line"><span class="name">${n(i.name)}</span><span class="workspace">${n(i.workspace ?? "")}</span>${i.badge ? `<span class="badge" aria-label="${i.badge} unread">${i.badge}</span>` : ""}</span>
<span class="sub"><span class="email">${n(i.email)}${i.signedOut ? " · Signed out" : ""}</span><span class="session">${n(a)}</span></span></span>
${b(i.method, i)}<button class="forget" type="button" aria-label="Forget ${n(i.email)}">${r(s, 14)}</button>${r(u, 16)}</div>`;
		}).join(""), t.querySelectorAll(".portrait").forEach((t, r) => {
			let i = e[r];
			i.image ? t.innerHTML = `<img src="${n(i.image)}" alt="">` : f(t, i.name, {
				seed: i.seed,
				mark: i.mark
			});
		}), this.#e = Math.min(this.#e, Math.max(0, e.length - 1)), this.#s();
	}
	#o(e) {
		this.#e = e, this.#s();
	}
	#s() {
		let e = this.shadowRoot.querySelectorAll(".row");
		e.forEach((e, t) => e.ariaSelected = String(t === this.#e));
		let t = this.query(".list"), n = e[this.#e];
		n && t.setAttribute("aria-activedescendant", n.id), n ? i(this.query(".highlight"), n) : a(this.query(".highlight"));
	}
	#c(e) {
		let t = this.accounts.length, n = {
			ArrowDown: 1,
			ArrowUp: -1
		}[e.key];
		n && t ? (e.preventDefault(), this.#o((this.#e + n + t) % t)) : e.key === "Enter" && t ? (e.preventDefault(), this.#l(this.#e)) : (e.key === "Delete" || e.key === "Backspace") && t && (e.preventDefault(), this.#f(this.#e));
	}
	#l(e) {
		let t = this.#i(this.accounts[e]), i = t.method, a = this.query(".step"), o = i === "password" ? "<lw-text-input class=\"password\" type=\"password\" placeholder=\"Password\" autocomplete=\"current-password\" aria-label=\"Password\"></lw-text-input>" : "", s = {
			sso: `${t.email.split("@")[1]} signs in through ${t.provider}.`,
			google: "You will pick this account in Google.",
			passkey: "Use Touch ID, Face ID or your security key.",
			password: ""
		}[i];
		a.innerHTML = `<button class="back" type="button">${r(d, 16)}All accounts</button>
<div class="chosen"><span class="portrait"></span><span class="who"><span class="name">${n(t.name)}</span><span class="email">${n(t.email)}</span></span></div>
<form class="step-form">${o}<lw-button class="go" type="submit">${i === "google" ? `<span slot="start">${p}</span>` : i === "password" ? "" : `<span slot="start">${r(y[i].icon, 16)}</span>`}${n(y[i].action(t))}</lw-button>${s ? `<p class="note">${n(s)}</p>` : ""}</form>`, f(a.querySelector(".portrait"), t.name, {
			seed: t.seed,
			mark: t.mark
		}), a.querySelector(".back").addEventListener("click", () => this.#u()), a.querySelector(".step-form").addEventListener("submit", (e) => {
			e.preventDefault(), this.#d(t);
		}), this.dataset.step = i, a.hidden = !1, this.query(".list").hidden = !0, this.query(".intro").hidden = !0, (a.querySelector(".password") ?? a.querySelector(".go")).focus();
	}
	#u() {
		delete this.dataset.step, this.query(".step").hidden = !0, this.query(".list").hidden = !1, this.query(".intro").hidden = !1, this.query(".list").focus(), this.#s();
	}
	async #d(e) {
		let t = this.query(".step"), r = t.querySelector(".go"), i = t.querySelector(".password");
		if (i && !i.value) {
			i.error = "Enter your password.", i.focus();
			return;
		}
		r.loading = !0;
		let a = this.signIn ? await this.signIn(e, { password: i?.value }) : await new Promise((e) => setTimeout(() => e(!0), g));
		r.loading = !1, a ? (t.querySelector(".step-form").innerHTML = `<p class="signed-in">Signed in to ${n(e.workspace ?? this.brand)}</p>`, this.emit("continue", { account: e })) : i && (i.error = "That password did not match.");
	}
	#f(e) {
		this.#m();
		let t = [...this.accounts], [n] = t.splice(e, 1);
		this.#t = {
			account: n,
			index: e
		}, this.accounts = t, this.query(".undo-text").textContent = `Forgot ${n.email}`, this.query(".undo-bar").hidden = !1, this.query(".another").hidden = !0, this.#n = setTimeout(() => this.#m(), h), this.query(".list").focus();
	}
	#p() {
		clearTimeout(this.#n);
		let e = this.#t;
		if (!e) return;
		this.#t = null;
		let t = [...this.accounts];
		t.splice(e.index, 0, e.account), this.accounts = t, this.#h();
	}
	#m() {
		clearTimeout(this.#n), this.#t && (this.emit("remove", { account: this.#t.account }), this.#t = null, this.#h());
	}
	#h() {
		this.query(".undo-bar").hidden = !0, this.query(".another").hidden = !1;
	}
};
//#endregion
//#region src/components/account-chooser-login/index.js
t("account-chooser-login", x);
//#endregion
export { x as t };
