import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { n as r } from "./motion-CFWhFfc_.js";
import { i } from "./login-CR429yh-.js";
//#region src/components/magic-link-login/magic-link-login.scss?inline
var a = ":host{--_ink:var(--lw-color-foreground);--_muted:var(--lw-color-muted-foreground);--_line:var(--lw-color-border);--_surface:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));--_ok:var(--lightningcss-light,#059669)var(--lightningcss-dark,#34d399);--_ease:cubic-bezier(.23, 1, .32, 1);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:25rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:.5rem;display:block}p,h2{margin:0}a{color:inherit}.inbox{border:1px solid var(--_line);background:var(--_surface);font-size:var(--lw-text-xs);border-radius:1rem;overflow:hidden}.inbox[hidden]{display:none}.inbox-head{border-bottom:1px solid var(--_line);justify-content:space-between;gap:1rem;padding:.625rem .75rem;font-weight:600;display:flex}.to{text-overflow:ellipsis;white-space:nowrap;color:var(--_muted);font-weight:400;overflow:hidden}.slot{margin:.375rem}.draft{border:1px dashed var(--_line);color:var(--_muted);border-radius:.75rem;align-items:center;gap:.625rem;padding:.875rem .75rem;display:flex}[data-typing]>.draft{border-color:color-mix(in oklab, var(--_ink) 35%, transparent);color:var(--_ink)}:host([data-stage=check]) .draft,:host([data-stage=done]) .draft{display:none}.dot{border:1px solid;border-radius:50%;flex:none;width:.375rem;height:.375rem}.draft-text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.message{border:1px solid var(--_line);background:var(--lw-color-background);box-shadow:var(--lw-shadow-sm);border-radius:.75rem;gap:.5rem;padding:.75rem;display:none}:host([data-stage=check]) .message,:host([data-stage=done]) .message{display:grid}@media (prefers-reduced-motion:no-preference){:host([data-stage=check]) .message,:host([data-stage=done]) .message{animation:land .4s var(--_ease)}}@keyframes land{0%{opacity:0;translate:0 -.5rem}}.message-head{justify-content:space-between;font-weight:600;display:flex}.now{color:var(--_muted);font-weight:400}.message-subject{font-size:var(--lw-text-sm)}.expiry{color:var(--_muted);align-items:center;gap:.625rem;display:flex}.bar{background:var(--_line);border-radius:1px;flex:1;height:2px;overflow:hidden}.bar i{background:var(--_ink);transform-origin:0;height:100%;display:block}.expires{font-variant-numeric:tabular-nums}.message-actions{justify-content:space-between;align-items:center;gap:.75rem;display:flex}.open-mail{border-radius:var(--lw-radius-full);background:var(--_ink);color:var(--lw-color-background);outline:none;padding:.375rem .75rem;font-weight:500;text-decoration:none}.open-mail:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.code-label{color:var(--_muted)}.code-label b{font:600 var(--lw-text-sm) var(--lw-font-mono);letter-spacing:.1em;color:var(--_ink);margin-left:.25rem}.mails{margin:0;padding:0 .375rem .375rem;list-style:none}.mails li{color:var(--_muted);grid-template-columns:6.5rem minmax(0,1fr) auto;gap:.75rem;padding:.625rem .75rem;display:grid}.mails span{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mails .from{color:var(--_ink)}.logo{background:var(--lw-color-foreground);width:2.25rem;height:2.25rem;font-size:var(--lw-text-md);color:var(--lw-color-background);border-radius:.625rem;place-items:center;font-weight:700;display:grid}.title{font-size:var(--lw-text-lg);margin:0;font-weight:600}.lead{color:var(--lw-color-muted-foreground);margin:0}.providers{grid-template-columns:1fr 1fr;gap:.5rem;display:grid}.providers lw-button::part(button){width:100%}.divider{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);align-items:center;gap:.75rem;margin:0;display:flex}.divider:before,.divider:after{content:\"\";border-top:1px solid var(--lw-color-border);flex:1}.portrait{width:var(--_portrait,2.75rem);height:var(--_portrait,2.75rem);flex:none;position:relative}.portrait>svg{border-radius:50%;width:100%;height:100%;display:block}.mark{background:var(--_mark);width:42%;height:42%;box-shadow:0 0 0 2px var(--lw-color-background);color:#fff;border-radius:28%;place-items:center;display:grid;position:absolute;bottom:-.25rem;right:-.25rem}.mark svg{width:70%;height:70%}.body{padding:1.5rem 1rem 1.25rem}.form,.check,.done{gap:1rem;display:grid}.form .lead,.check .lead,.done .lead{margin-top:-.5rem}.form .providers,.check .providers,.done .providers{margin-top:.5rem}.form[hidden],.check[hidden],.done[hidden]{display:none}.provider,.email{position:relative}.provider[data-last]:after,.email[data-last]:after{content:\"Last used\";border:1px solid var(--_line);border-radius:var(--lw-radius-full);background:var(--lw-color-background);color:var(--_muted);padding:0 .375rem;font-size:.625rem;font-weight:500;position:absolute;top:0;right:.75rem;translate:0 -50%}.email,.password{width:100%;display:block}.password[hidden]{display:none}.complete{color:var(--_muted);align-items:center;gap:.375rem;padding-right:.25rem;display:flex}.complete[hidden]{display:none}.complete kbd{border:1px solid var(--_line);border-radius:var(--lw-radius-sm);font:.625rem var(--lw-font-sans);padding:0 .3rem}.submit::part(button){width:100%}.check-actions{justify-content:space-between;gap:.5rem;display:flex}.done .title:before{content:\"\";background:var(--_ok);vertical-align:middle;border-radius:50%;width:.5rem;height:.5rem;margin-right:.5rem;display:inline-block}.foot{border-top:1px solid var(--_line);color:var(--_muted);justify-content:space-between;gap:1rem;padding:1rem;display:flex}.foot .signup{color:var(--_ink);text-underline-offset:.2em;font-weight:500}.foot .terms{text-decoration:none}", o = 900, s = 600, c = 30, l = 6, u = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, d = {
	"gmail.com": ["Gmail", "https://mail.google.com/"],
	"outlook.com": ["Outlook", "https://outlook.live.com/mail/"],
	"hotmail.com": ["Outlook", "https://outlook.live.com/mail/"],
	"icloud.com": ["iCloud Mail", "https://www.icloud.com/mail"],
	"proton.me": ["Proton Mail", "https://mail.proton.me/"]
}, f = [
	"gmail.com",
	"outlook.com",
	"icloud.com",
	"proton.me",
	"company.com"
], p = [{
	from: "Jonas Weber",
	subject: "Release 0.9: profiler numbers, round two",
	time: "9:41 AM"
}, {
	from: "LowerSoft CI",
	subject: "Nightly build passed on all 6 targets",
	time: "8:02 AM"
}], m = (e) => `${Math.floor(e / 60)}:${String(e % 60).padStart(2, "0")}`, h = () => String(Math.floor(Math.random() * 10 ** l)).padStart(l, "0"), g = class extends e {
	static styles = a;
	static props = {
		brand: { default: "LowerSoft" },
		method: {
			default: "magic",
			reflect: !0
		},
		lastUsed: { default: "google" },
		domains: {
			type: Object,
			default: f
		},
		signupHref: { default: "#" },
		termsHref: { default: "#" }
	};
	#e = "form";
	#t = "";
	#n = "";
	#r = 0;
	#i = 0;
	#a = 0;
	render() {
		return `<section class="inbox" aria-label="Inbox preview"><header class="inbox-head"><span>Inbox</span><span class="to"></span></header>
<div class="slot"><div class="draft"><span class="dot" aria-hidden="true"></span><span class="draft-text"></span></div>
<article class="message" aria-live="polite"><header class="message-head"><span class="sender"></span><span class="now">now</span></header><p class="message-subject"></p>
<div class="expiry"><span class="bar" aria-hidden="true"><i></i></span><span class="expires"></span></div>
<div class="message-actions"><a class="open-mail" target="_blank" rel="noopener"></a><span class="code-label">Code <b class="code"></b></span></div></article></div>
<ul class="mails">${p.map((e) => `<li><span class="from">${n(e.from)}</span><span class="subject">${n(e.subject)}</span><span class="time">${e.time}</span></li>`).join("")}</ul></section>
<div class="body">
<form class="form" novalidate><h2 class="title"></h2><p class="lead"></p>
${i()}
<p class="divider"><span>or with email</span></p>
<lw-text-input class="email" type="email" name="email" placeholder="you@company.com" autocomplete="email" required aria-label="Email"><span slot="end" class="complete" hidden><kbd>Tab</kbd><span class="suggest"></span></span></lw-text-input>
<lw-text-input class="password" type="password" name="password" placeholder="Password" autocomplete="current-password" aria-label="Password"></lw-text-input>
<lw-button class="submit" type="submit"></lw-button></form>
<div class="check" hidden><h2 class="title">Check your inbox</h2><p class="lead sent-to"></p><lw-verification-code class="otp" length="${l}" label="Code from the email"></lw-verification-code>
<div class="check-actions"><lw-button class="back" variant="ghost" size="sm">Use a different email</lw-button><lw-button class="resend" variant="ghost" size="sm"></lw-button></div></div>
<div class="done" hidden><h2 class="title">You're signed in</h2><p class="lead done-text"></p></div></div>
<footer class="foot"><span>New to <span class="brand-name"></span>? <a class="signup">Create an account</a></span><a class="terms">Terms</a></footer>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".email");
		t.addEventListener("input", () => this.#s(), e), t.addEventListener("keydown", (e) => this.#c(e), e), this.query(".form").addEventListener("submit", (e) => {
			e.preventDefault(), this.#l();
		}, e);
		for (let t of this.shadowRoot.querySelectorAll(".provider")) t.addEventListener("click", () => this.emit("provider", { provider: t.dataset.provider }), e);
		this.query(".back").addEventListener("click", () => this.#p("form"), e), this.query(".resend").addEventListener("click", () => this.#u(), e);
		let n = this.query(".otp");
		n.verify = async (e) => this.verify ? this.verify(e) : e === this.#n, n.addEventListener("lw-verified", () => this.#f("magic"), e), this.signal.addEventListener("abort", () => clearInterval(this.#r));
	}
	updated() {
		let e = this.brand ?? "", t = this.method === "password";
		this.query(".form .title").textContent = `Sign in to ${e}`, this.query(".lead").textContent = t ? "Welcome back. Sign in with your email and password." : "No password needed. We'll email you a link.", this.query(".submit").textContent = t ? "Sign in" : "Email me a sign-in link", this.query(".password").hidden = !t, this.query(".password").required = t, this.query(".inbox").hidden = t, this.query(".brand-name").textContent = e, this.query(".signup").href = this.signupHref ?? "#", this.query(".terms").href = this.termsHref ?? "#";
		for (let e of this.shadowRoot.querySelectorAll(".provider")) e.toggleAttribute("data-last", e.dataset.provider === this.lastUsed);
		this.query(".email").toggleAttribute("data-last", this.lastUsed === "email"), this.#s();
	}
	get #o() {
		let e = this.query(".email").value ?? "", t = e.indexOf("@");
		if (t < 1) return "";
		let n = e.slice(t + 1).toLowerCase(), r = (this.domains ?? []).find((e) => e.startsWith(n) && e !== n);
		return r ? r.slice(n.length) : "";
	}
	#s() {
		if (this.#e !== "form") return;
		let e = (this.query(".email").value ?? "").trim(), t = this.#o;
		this.query(".to").textContent = e ? `${e}${t}` : "you@company.com", this.query(".draft-text").textContent = e ? `Draft: sign-in link for ${e}${t}` : `Your link from ${this.brand} lands here`, this.query(".slot").toggleAttribute("data-typing", !!e);
		let n = this.query(".complete");
		n.hidden = !t, this.query(".suggest").textContent = t, this.query(".email").error = "";
	}
	#c(e) {
		let t = this.#o;
		if (e.key !== "Tab" || e.shiftKey || !t) return;
		e.preventDefault();
		let n = this.query(".email");
		n.value = `${n.value}${t}`, this.#s();
	}
	async #l() {
		let e = this.query(".email"), t = (e.value ?? "").trim();
		if (!u.test(t)) {
			e.error = "Enter a valid email address.", e.focus();
			return;
		}
		if (this.#t = t, this.method !== "password") {
			await this.#u();
			return;
		}
		let n = this.query(".password");
		if (!n.value) {
			n.error = "Enter your password.", n.focus();
			return;
		}
		let r = this.query(".submit");
		r.loading = !0;
		let i = this.signIn ? await this.signIn({
			email: t,
			password: n.value
		}) : await new Promise((e) => setTimeout(() => e(!0), o));
		r.loading = !1, i ? this.#f("password") : n.error = "That email and password did not match.";
	}
	async #u() {
		let e = this.query(".submit");
		e.loading = !0, this.send ? await this.send(this.#t) : await new Promise((e) => setTimeout(e, o)), e.loading = !1, this.#n = h(), this.#i = Date.now() + s * 1e3, this.#a = Date.now() + c * 1e3;
		let [t, n] = d[this.#t.split("@")[1]?.toLowerCase() ?? ""] ?? ["mail", `mailto:${this.#t}`], i = this.query(".open-mail");
		i.textContent = `Open ${t}`, i.href = n, this.query(".to").textContent = this.#t, this.query(".sender").textContent = this.brand ?? "", this.query(".message-subject").textContent = `Sign in to ${this.brand}`, this.query(".code").textContent = `${this.#n.slice(0, 3)} ${this.#n.slice(3)}`, this.query(".sent-to").textContent = `We sent a link to ${this.#t}. Open it, or enter the code from it.`;
		let a = this.query(".bar i");
		a.getAnimations().forEach((e) => e.cancel()), r.matches || a.animate([{ scale: "1 1" }, { scale: "0 1" }], {
			duration: s * 1e3,
			easing: "linear",
			fill: "forwards"
		}), this.query(".otp").value = "", this.#p("check"), this.emit("send", { email: this.#t }), clearInterval(this.#r), this.#d(), this.#r = setInterval(() => this.#d(), 1e3);
	}
	#d() {
		let e = Math.max(0, Math.round((this.#i - Date.now()) / 1e3));
		this.query(".expires").textContent = e ? `Expires in ${m(e)}` : "Expired";
		let t = Math.max(0, Math.round((this.#a - Date.now()) / 1e3)), n = this.query(".resend");
		n.textContent = t ? `Resend in ${t}s` : "Resend link", n.disabled = t > 0, e || clearInterval(this.#r);
	}
	#f(e) {
		clearInterval(this.#r), this.query(".done-text").textContent = `Signed in as ${this.#t}.`, this.#p("done"), this.emit("sign-in", {
			method: e,
			email: this.#t
		});
	}
	#p(e) {
		this.#e = e, this.dataset.stage = e, this.query(".form").hidden = e !== "form", this.query(".check").hidden = e !== "check", this.query(".done").hidden = e !== "done", e === "form" && (clearInterval(this.#r), this.#s(), this.query(".email").focus()), e === "check" && this.query(".otp").focus();
	}
};
//#endregion
//#region src/components/magic-link-login/index.js
t("magic-link-login", g);
//#endregion
export { g as t };
