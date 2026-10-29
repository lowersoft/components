import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { t as i } from "./icons-Dv1KN71n.js";
import { n as a } from "./motion-CFWhFfc_.js";
//#region src/components/stepper-form/stepper-form.scss?inline
var o = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);--_ease:cubic-bezier(.23, 1, .32, 1);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:32rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:0;display:block;overflow:hidden;container-type:inline-size}h2,h3,p,ol{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.head{border-bottom:1px solid var(--_line);padding:1.75rem 1.75rem 1.5rem}.title{font-size:var(--lw-text-lg);font-weight:600}.progress-text{font-size:var(--lw-text-md);color:var(--_muted);margin-top:.375rem}.bar{gap:.375rem;margin-top:1.25rem;display:flex}.segment{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-foreground) 10%, transparent);flex:1;height:.25rem;overflow:hidden}.fill{background:var(--lw-color-foreground);transform-origin:0;height:100%;display:block;scale:0 1}@media (prefers-reduced-motion:no-preference){.fill{transition:scale .5s var(--_ease)}}[data-current]>.fill{scale:.35 1}[data-done]>.fill{scale:1}.steps{padding:1.5rem 1.75rem 1.75rem;list-style:none}.step{padding-bottom:1.25rem;position:relative}.step:not(:last-child):before{content:\"\";background:var(--_line);width:1px;position:absolute;top:2rem;bottom:0;left:.9375rem}.step:last-child{padding-bottom:0}.step-head{align-items:center;gap:.875rem;min-height:2rem;display:flex}.marker{z-index:1;border:1px solid var(--_line);background:var(--lw-color-background);width:2rem;height:2rem;font-size:var(--lw-text-xs);color:var(--_muted);border-radius:50%;flex:none;place-items:center;display:grid;position:relative}.marker .icon{display:none}[data-state=open] .marker{border-color:var(--lw-color-foreground);box-shadow:0 0 0 4px color-mix(in oklab, var(--lw-color-foreground) 10%, transparent);color:var(--lw-color-foreground)}[data-state=done] .marker{border-color:var(--lw-color-foreground);background:var(--lw-color-foreground);color:var(--lw-color-background)}[data-state=done] .marker .number{display:none}[data-state=done] .marker .icon{display:block}.step-title{font-size:var(--lw-text-md);white-space:nowrap;font-weight:500}[data-state=next] .step-title{color:var(--_muted)}.summary{min-width:0;color:var(--_muted);text-overflow:ellipsis;white-space:nowrap;flex:1;overflow:hidden}.edit{border-radius:var(--lw-radius-sm);color:var(--_muted);cursor:pointer;background:0 0;border:0;padding:.25rem .5rem}.edit:hover{color:var(--lw-color-foreground)}.edit[hidden]{display:none}.panel{grid-template-rows:0fr;display:grid}@media (prefers-reduced-motion:no-preference){.panel{transition:grid-template-rows .4s var(--_ease)}}[data-state=open] .panel{grid-template-rows:1fr}.panel-inner{min-height:0;padding-left:2.875rem;overflow:hidden}[data-state=open] .panel-inner{padding-top:.75rem}.lead{font-size:var(--lw-text-md);color:var(--_muted)}.fields{gap:1.125rem;margin-top:1.25rem;display:grid}.fields lw-text-input,.fields lw-password-input,.fields lw-textarea{width:100%}.pair{gap:1.125rem;display:grid}@container (width>=28rem){.pair{grid-template-columns:1fr 1fr}}.address{font:var(--lw-text-xs) var(--lw-font-mono);color:var(--_muted);margin-top:-.5rem}.address b{color:var(--lw-color-foreground);font-weight:400}.label{margin-bottom:.5rem;font-weight:500;display:block}.sizes{flex-wrap:wrap;gap:.375rem;display:flex}.size{border:1px solid var(--_line);border-radius:var(--lw-radius-md);cursor:pointer;background:0 0;padding:.375rem .75rem}.size[aria-checked=true]{border-color:var(--lw-color-foreground);box-shadow:inset 0 0 0 1px var(--lw-color-foreground)}.invite-count{font-size:var(--lw-text-xs);color:var(--_muted);margin-top:-.5rem}.invite-count:empty{display:none}.actions{align-items:center;gap:.5rem;margin-top:1.5rem;display:flex}.actions .continue{margin-left:auto}.enter{font-size:var(--lw-text-xs);color:var(--_muted)}.enter kbd{--_edge:color-mix(in oklab, var(--lw-color-foreground) 22%, var(--lw-color-background));border:1px solid var(--_edge);border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--lw-color-foreground) 8%, var(--lw-color-background));min-width:1.5rem;height:1.5rem;box-shadow:0 2px 0 0 var(--_edge);color:inherit;font:inherit;justify-content:center;align-items:center;padding-inline:.375rem;font-size:.6875rem;line-height:1;display:inline-flex}@media (prefers-reduced-motion:no-preference){.enter kbd{transition:translate var(--lw-duration-fast) var(--lw-ease-out), box-shadow var(--lw-duration-fast) var(--lw-ease-out)}}.enter kbd[data-pressed]{box-shadow:none;transition-duration:75ms;translate:0 2px}.enter kbd{font-family:var(--lw-font-mono);margin-right:.25rem}@container (width<=26rem){.enter{display:none}}.done{text-align:center;justify-items:center;gap:.375rem;padding:0 1.75rem 2rem;display:grid}.done[hidden]{display:none}.done-mark{background:var(--lw-color-accent);width:2.5rem;height:2.5rem;color:var(--lw-color-background);border-radius:50%;place-items:center;margin-bottom:.5rem;display:grid}.done-title{font-size:var(--lw-text-md);font-weight:600}.done-text{color:var(--_muted)}", s = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, c = [
	"Just me",
	"2–10",
	"11–50",
	"51+"
], l = (e) => e.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32), u = [
	{
		id: "account",
		title: "Account",
		lead: "You will use this to sign in. No card required.",
		fields: "<div class=\"pair\"><lw-text-input data-key=\"name\" label=\"Full name\" autocomplete=\"name\" placeholder=\"Jordan Lee\" required></lw-text-input><lw-text-input data-key=\"email\" type=\"email\" label=\"Work email\" autocomplete=\"email\" placeholder=\"jordan@company.com\" required></lw-text-input></div>\n<lw-password-input data-key=\"password\" label=\"Password\" placeholder=\"Choose a password\" required></lw-password-input>"
	},
	{
		id: "workspace",
		title: "Workspace",
		lead: "Where your projects, builds and crash reports live.",
		fields: `<lw-text-input data-key="workspace" label="Workspace name" placeholder="Northwind" required></lw-text-input><p class="address"></p>
<div class="sizes-field"><span class="label" id="size-label">Team size</span><div class="sizes" role="radiogroup" aria-labelledby="size-label">${c.map((e) => `<button class="size" type="button" role="radio" data-size="${e}">${e}</button>`).join("")}</div></div>`
	},
	{
		id: "invite",
		title: "Invite your team",
		lead: "They get an email with a link to join. You can do this later.",
		fields: "<lw-textarea data-key=\"invites\" label=\"Email addresses\" placeholder=\"ana@company.com, sam@company.com\" rows=\"3\"></lw-textarea><p class=\"invite-count\"></p>"
	}
], d = class extends e {
	static styles = [r, o];
	static props = {
		heading: { default: "Set up your workspace" },
		domain: { default: "lowersoft.dev" }
	};
	#e = 0;
	#t = c[1];
	#n = !1;
	render() {
		return `<header class="head"><h2 class="title"></h2><p class="progress-text" aria-live="polite"></p><div class="bar" aria-hidden="true">${u.map(() => "<span class=\"segment\"><span class=\"fill\"></span></span>").join("")}</div></header>
<ol class="steps">${u.map((e, t) => `<li class="step" data-index="${t}"><div class="step-head"><span class="marker"><span class="number">${t + 1}</span>${i}</span><h3 class="step-title">${n(e.title)}</h3><p class="summary"></p><button class="edit" type="button">Edit<span class="visually-hidden"> ${n(e.title.toLowerCase())}</span></button></div>
<div class="panel"><div class="panel-inner"><p class="lead">${n(e.lead)}</p><div class="fields">${e.fields}</div><div class="actions"><span class="enter"><kbd>Enter</kbd> to continue</span>${t === 2 ? "<lw-button class=\"skip\" variant=\"ghost\">Skip for now</lw-button>" : ""}<lw-button class="continue">${t === u.length - 1 ? "Finish" : "Continue"}</lw-button></div></div></div></li>`).join("")}</ol>
<div class="done" role="status" hidden><span class="done-mark">${i}</span><p class="done-title"></p><p class="done-text"></p></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".steps");
		t.addEventListener("click", (e) => {
			if (e.target.closest(".continue")) return this.#s();
			if (e.target.closest(".skip")) return this.#r("invites").value = "", this.#s();
			let t = e.target.closest(".edit");
			t && this.#c(Number(t.closest(".step").dataset.index), !0);
			let n = e.target.closest(".size");
			n && (this.#t = n.dataset.size, this.#l());
		}, e), t.addEventListener("keydown", (e) => {
			e.key === "Enter" && !e.shiftKey && !e.composedPath().some((e) => e.tagName === "TEXTAREA" || e.tagName === "BUTTON" || e.tagName === "LW-BUTTON") && (e.preventDefault(), this.#s());
			let t = {
				ArrowRight: 1,
				ArrowLeft: -1
			}[e.key];
			t && e.target.closest(".size") && (e.preventDefault(), this.#t = c[(c.indexOf(this.#t) + t + c.length) % c.length], this.#l(), this.query(`.size[data-size="${this.#t}"]`).focus());
		}, e), t.addEventListener("input", () => this.#u(), e), this.#l();
	}
	updated() {
		this.query(".title").textContent = this.heading ?? "", this.#f();
	}
	#r(e) {
		return this.query(`[data-key="${e}"]`);
	}
	#i(e) {
		return (this.#r(e)?.value ?? "").trim();
	}
	get #a() {
		return this.#i("invites").split(/[\s,;]+/).filter(Boolean);
	}
	#o() {
		let e = [...this.shadowRoot.querySelectorAll(`.step[data-index="${this.#e}"] [data-key]`)], t = this.#r("invites");
		if (u[this.#e].id === "invite") {
			let e = this.#a.find((e) => !s.test(e));
			return t.error = e ? `“${e}” is not an email address.` : "", e && t.focus(), !e;
		}
		for (let t of e) if (!t.reportValidity()) return t.focus(), !1;
		return !0;
	}
	#s() {
		if (!(this.#n || !this.#o())) {
			if (this.#e === u.length - 1) return this.#p();
			this.#c(this.#e + 1, !0);
		}
	}
	#c(e, t) {
		if (this.#e = e, this.#f(), t) {
			let t = this.query(`.step[data-index="${e}"] [data-key]`);
			requestAnimationFrame(() => t?.focus());
		}
	}
	#l() {
		for (let e of this.shadowRoot.querySelectorAll(".size")) {
			let t = e.dataset.size === this.#t;
			e.ariaChecked = String(t), e.tabIndex = t ? 0 : -1;
		}
	}
	#u() {
		let e = l(this.#i("workspace"));
		this.query(".address").innerHTML = `${n(this.domain)}/<b>${n(e || "your-team")}</b>`;
		let t = this.#a.length;
		this.query(".invite-count").textContent = t ? `${t} ${t === 1 ? "invite" : "invites"} ready` : "";
	}
	#d() {
		let e = this.#a.length;
		return [
			`${this.#i("name")} · ${this.#i("email")}`,
			`${this.#i("workspace")} · ${this.#t}`,
			e ? `${e} ${e === 1 ? "invite" : "invites"}` : "Skipped"
		];
	}
	#f() {
		let e = this.#d();
		this.query(".progress-text").textContent = this.#n ? "All set" : `Step ${this.#e + 1} of ${u.length} · about ${u.length - this.#e} min`, this.shadowRoot.querySelectorAll(".segment").forEach((e, t) => {
			e.toggleAttribute("data-done", this.#n || t < this.#e), e.toggleAttribute("data-current", !this.#n && t === this.#e);
		});
		for (let t of this.shadowRoot.querySelectorAll(".step")) {
			let n = Number(t.dataset.index), r = this.#n || n < this.#e ? "done" : n === this.#e ? "open" : "next";
			t.dataset.state = r, t.querySelector(".panel").inert = r !== "open", t.querySelector(".summary").textContent = r === "done" ? e[n] : "", t.querySelector(".edit").hidden = r !== "done" || this.#n, r === "open" ? t.setAttribute("aria-current", "step") : t.removeAttribute("aria-current");
		}
		this.#u();
	}
	#p() {
		this.#n = !0, this.#f();
		let e = {
			name: this.#i("name"),
			email: this.#i("email"),
			workspace: this.#i("workspace"),
			slug: l(this.#i("workspace")),
			size: this.#t,
			invites: this.#a
		}, t = this.query(".done");
		t.hidden = !1, this.query(".done-title").textContent = `${e.workspace} is ready`, this.query(".done-text").textContent = `It lives at ${this.domain}/${e.slug}.${e.invites.length ? ` We sent ${e.invites.length} ${e.invites.length === 1 ? "invite" : "invites"}.` : ""}`, a.matches || t.animate({
			opacity: [0, 1],
			translate: ["0 0.5rem", "0 0"]
		}, {
			duration: 400,
			easing: "cubic-bezier(0.23, 1, 0.32, 1)"
		}), this.emit("complete", e);
	}
};
//#endregion
//#region src/components/stepper-form/index.js
t("stepper-form", d);
//#endregion
export { d as t };
