import { n as e, t } from "./core-WcEz9YgG.js";
import { r as n } from "./icons-Dv1KN71n.js";
import { n as r } from "./face-BTqcW8Ou.js";
import { U as i } from "./lucide-BVbUPHVq.js";
import { n as a, t as o } from "./login-CR429yh-.js";
//#region src/components/invite-signup/invite-signup.scss?inline
var s = ":host{--_ink:var(--lw-color-foreground);--_muted:var(--lw-color-muted-foreground);--_line:var(--lw-color-border);--_surface:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:29rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:.5rem;display:block}.logo{background:var(--lw-color-foreground);width:2.25rem;height:2.25rem;font-size:var(--lw-text-md);color:var(--lw-color-background);border-radius:.625rem;place-items:center;font-weight:700;display:grid}.title{font-size:var(--lw-text-lg);margin:0;font-weight:600}.lead{color:var(--lw-color-muted-foreground);margin:0}.providers{grid-template-columns:1fr 1fr;gap:.5rem;display:grid}.providers lw-button::part(button){width:100%}.divider{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);align-items:center;gap:.75rem;margin:0;display:flex}.divider:before,.divider:after{content:\"\";border-top:1px solid var(--lw-color-border);flex:1}.portrait{width:var(--_portrait,2.75rem);height:var(--_portrait,2.75rem);flex:none;position:relative}.portrait>svg{border-radius:50%;width:100%;height:100%;display:block}.mark{background:var(--_mark);width:42%;height:42%;box-shadow:0 0 0 2px var(--lw-color-background);color:#fff;border-radius:28%;place-items:center;display:grid;position:absolute;bottom:-.25rem;right:-.25rem}.mark svg{width:70%;height:70%}p,blockquote{margin:0}.head{justify-items:start;gap:.5rem;padding:1rem 1rem 1.25rem;display:grid}.inviter{--_portrait:3.25rem;margin-bottom:.75rem}.title{font-size:1.25rem}.invite{border:1px solid var(--_line);background:var(--_surface);border-radius:1rem;overflow:hidden}.invite[hidden]{display:none}.invite>*{padding:.875rem 1rem}.invite>*+*{border-top:1px solid var(--_line)}.note{gap:.5rem;display:grid}.quote{font-size:var(--lw-text-md);line-height:1.5}.by{font-size:var(--lw-text-xs);color:var(--_muted)}.seats{--_portrait:2rem;align-items:center;gap:1rem;display:flex}.faces{display:flex}.faces .portrait+.portrait{margin-left:-.5rem}.faces .portrait>svg{box-shadow:0 0 0 2px var(--_surface)}.more{background:color-mix(in oklab, var(--_ink) 12%, var(--_surface));min-width:2rem;height:2rem;box-shadow:0 0 0 2px var(--_surface);font-size:var(--lw-text-xs);border-radius:50%;place-items:center;margin-left:-1.5rem;font-weight:600;display:grid}.more[hidden]{display:none}.seat{width:var(--_portrait);height:var(--_portrait);border:1px dashed color-mix(in oklab, var(--_ink) 30%, transparent);border-radius:50%}.seat .portrait{opacity:0;scale:.6}@media (prefers-reduced-motion:no-preference){.seat .portrait{transition:opacity .25s ease-out,scale .35s cubic-bezier(.34,1.56,.64,1)}}.seat[data-taken]{border-color:#0000}.seat[data-taken] .portrait{opacity:1;scale:1}.seat-text{min-width:0;display:grid}.seat-text b{text-overflow:ellipsis;white-space:nowrap;font-weight:500;overflow:hidden}.seat-count{color:var(--_muted)}.locked{color:var(--_muted);align-items:center;gap:.5rem;display:flex}.locked svg{flex:none}.email{text-overflow:ellipsis;white-space:nowrap;color:var(--_ink);overflow:hidden}.from{flex:none}.not-you,.decline{font:inherit;color:var(--_muted);cursor:pointer;background:0 0;border:0;outline:none;padding:0}.not-you:hover,.decline:hover{color:var(--_ink)}.not-you:focus-visible,.decline:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.not-you{flex:none;margin-left:auto}.form{gap:1rem;padding:1.25rem 1rem 1rem;display:grid}.form[hidden]{display:none}.form lw-text-input,.form lw-password-input{width:100%;display:block}.form .join::part(button),.form .google::part(button){width:100%}.decline{font-size:var(--lw-text-xs);justify-self:center}.state{justify-items:start;gap:.75rem;padding:1.25rem 1rem 1rem;display:grid}.state[hidden]{display:none}", c = 1100, l = 5e3, u = 4, d = {
	workspace: "Northwind",
	inviter: "Maya Chen",
	inviterRole: "Admin",
	email: "sam@northwind.dev",
	role: "Editor",
	address: "northwind.lowersoft.dev",
	members: [
		"Maya Chen",
		"Theo Okafor",
		"Ines Alves",
		"Leo Park"
	],
	total: 14,
	note: "The 0.9 release lives in here: the build farm, the profiler runs and the crash reports. Grab a seat and say hi in #core.",
	sent: "2d ago",
	mark: {
		glyph: "triangle",
		color: "#2f6b55"
	}
}, f = class extends e {
	static styles = s;
	static props = { invite: {
		type: Object,
		default: d
	} };
	#e = null;
	#t = 0;
	render() {
		return `<header class="head"><span class="portrait inviter"></span><h2 class="title"></h2><p class="lead"></p></header>
<section class="invite" aria-label="Invite"><blockquote class="note"><p class="quote"></p><footer class="by"></footer></blockquote>
<div class="seats"><span class="faces"></span><span class="more"></span><span class="seat" aria-hidden="true"><span class="portrait yours"></span></span><span class="seat-text"><b class="seat-name">Your seat</b><span class="seat-count"></span></span></div>
<div class="locked">${n(i, 16)}<span class="email"></span><span class="from">from the invite</span><button class="not-you" type="button">Not you?</button></div></section>
<form class="form" novalidate><lw-text-input class="name" label="Full name" placeholder="Sam Ortiz" autocomplete="name" hint="Your portrait is drawn from your name. Add a photo anytime." required></lw-text-input>
<lw-password-input class="password" label="Password" required></lw-password-input><lw-button class="join" type="submit"></lw-button>
<p class="divider"><span>or</span></p><lw-button class="google" variant="outline"><span slot="start">${o}</span>Continue with Google</lw-button>
<button class="decline" type="button">Decline invite</button></form>
<div class="state" hidden role="status"><h2 class="title state-title"></h2><p class="lead state-text"></p><lw-button class="undo" variant="outline" size="sm" hidden>Undo</lw-button></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".name").addEventListener("input", () => this.#n(), e), this.query(".form").addEventListener("submit", (e) => {
			e.preventDefault(), this.#r();
		}, e), this.query(".google").addEventListener("click", () => this.emit("provider", { provider: "google" }), e);
		for (let t of [".decline", ".not-you"]) this.query(t).addEventListener("click", () => this.#i(), e);
		this.query(".undo").addEventListener("click", () => this.#a(), e), this.signal.addEventListener("abort", () => clearTimeout(this.#t));
	}
	updated(e) {
		if (!e.has("invite")) return;
		let t = this.invite ?? {}, n = (t.inviter ?? "").split(" ")[0];
		a(this.query(".inviter"), t.inviter, { mark: t.mark }), this.query(".head .title").textContent = `${n} invited you to ${t.workspace}`, this.query(".head .lead").textContent = `Join as ${/^[aeiou]/i.test(t.role ?? "") ? "an" : "a"} ${t.role} on ${t.address}`, this.query(".quote").textContent = `“${t.note ?? ""}”`, this.query(".by").textContent = [
			t.inviter,
			t.inviterRole,
			t.sent
		].filter(Boolean).join(" · ");
		let r = t.members ?? [], i = this.query(".faces");
		i.replaceChildren();
		for (let e of r.slice(0, u)) {
			let t = document.createElement("span");
			t.className = "portrait", t.title = e, a(t, e), i.append(t);
		}
		let o = Math.max(0, (t.total ?? r.length) - Math.min(u, r.length));
		this.query(".more").textContent = o ? `+${o}` : "", this.query(".more").hidden = !o, this.query(".email").textContent = t.email ?? "", this.query(".join").textContent = `Join ${t.workspace}`, this.#e = a(this.query(".yours"), " "), this.#n();
	}
	#n() {
		let e = (this.query(".name").value ?? "").trim(), t = this.invite?.total ?? 0;
		this.#e?.show(r(e || " ", 0)), this.query(".seat").toggleAttribute("data-taken", !!e), this.query(".seat-name").textContent = e || "Your seat", this.query(".seat-count").textContent = e ? `${t + 1} members with you` : `${t} members`;
	}
	async #r() {
		let e = this.query(".name"), t = this.query(".password");
		e.error = e.value?.trim() ? "" : "Enter your name.", t.error = (t.value ?? "").length >= 8 ? "" : "Use at least 8 characters.";
		let n = [e, t].find((e) => e.error);
		if (n) {
			n.focus();
			return;
		}
		let r = {
			name: e.value.trim(),
			email: this.invite.email,
			password: t.value
		}, i = this.query(".join");
		i.loading = !0;
		let a = this.accept ? await this.accept(r) : await new Promise((e) => setTimeout(() => e(!0), c));
		i.loading = !1, a && (this.#o(`Welcome to ${this.invite.workspace}`, `You're in as ${r.name}, with ${this.invite.total} others.`, !1), this.emit("accept", {
			name: r.name,
			email: r.email
		}));
	}
	#i() {
		this.#o("Invite declined", `You won't join ${this.invite.workspace}. ${this.invite.inviter.split(" ")[0]} won't be told for a few seconds.`, !0), clearTimeout(this.#t), this.#t = setTimeout(() => {
			this.query(".undo").hidden = !0, this.query(".state-text").textContent = "You can close this tab.", this.emit("decline");
		}, l);
	}
	#a() {
		clearTimeout(this.#t), this.query(".state").hidden = !0, this.query(".form").hidden = !1, this.query(".invite").hidden = !1, this.query(".name").focus();
	}
	#o(e, t, n) {
		this.query(".state-title").textContent = e, this.query(".state-text").textContent = t, this.query(".undo").hidden = !n, this.query(".state").hidden = !1, this.query(".form").hidden = !0, this.query(".invite").hidden = n, n && this.query(".undo").focus();
	}
};
//#endregion
//#region src/components/invite-signup/index.js
t("invite-signup", f);
//#endregion
export { f as t };
