import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./dom-Dlk1FlsZ.js";
import { t as n } from "./icons-HWomdoMw.js";
import { r } from "./icons-Dv1KN71n.js";
import { t as i } from "./clipboard-BCkfa02P.js";
import { S as a, b as o, d as s } from "./lucide-BVbUPHVq.js";
import { n as c, t as l } from "./modal-DvPYHqbK.js";
//#region src/components/two-factor-dialog/two-factor-dialog.scss?inline
var u = ".modal{--_width:34rem;container-type:inline-size}.progress{gap:.375rem;margin-bottom:1rem;display:flex}.progress span{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-foreground) 15%, transparent);width:1.75rem;height:.25rem}@media (prefers-reduced-motion:no-preference){.progress span{transition:background-color .3s ease-out}}.progress span[data-done]{background:var(--lw-color-foreground)}.step{gap:1rem;margin-top:1.5rem;display:grid}.step[hidden]{display:none}@media (prefers-reduced-motion:no-preference){.step{animation:.3s ease-out step-in}}@container (width>=28rem){.step[data-step=\"0\"]{grid-template-columns:9.5rem minmax(0,1fr);align-items:start;gap:1.5rem}}@keyframes step-in{0%{opacity:0;translate:.5rem}}.qr{box-sizing:border-box;color:#09090b;background:#fff;border-radius:.875rem;width:9.5rem;padding:.625rem}.qr img,.qr svg{fill:currentColor;width:100%;height:auto;display:block}.instructions{font-size:var(--lw-text-md);color:var(--_muted);line-height:1.55}.instructions b{color:var(--lw-color-foreground);font-weight:500}.cant{color:var(--_muted);margin-top:1rem}.key{border-radius:var(--lw-radius-lg);background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent);align-items:center;gap:.5rem;margin-top:.5rem;padding:.5rem .5rem .5rem .875rem;display:flex}.secret{min-width:0;font:var(--lw-text-md) var(--lw-font-mono);letter-spacing:.04em;overflow-wrap:anywhere;flex:1}.icon{border-radius:var(--lw-radius-md);width:2rem;height:2rem;color:var(--_muted);cursor:pointer;background:0 0;border:0;flex:none;place-items:center;padding:0;display:grid}.icon:hover{color:var(--lw-color-foreground)}.codes{border:1px dashed var(--_line);border-radius:var(--lw-radius-lg);font:var(--lw-text-md) var(--lw-font-mono);grid-template-columns:repeat(2,1fr);gap:.5rem 1.5rem;padding:1rem 1.25rem;list-style:none;display:grid}.code-actions{gap:.5rem;display:flex}.foot .back{margin-right:auto}.foot [hidden]{display:none}", d = [
	"Scan with your authenticator",
	"Enter the code it shows",
	"Save your recovery codes"
], f = 25, p = 1600, m = (e) => {
	let t = [...e].reduce((e, t) => Math.imul(e ^ t.charCodeAt(0), 16777619) >>> 0, 2166136261), n = () => (t = Math.imul(t, 1103515245) + 12345 >>> 0) / 4294967296, r = (e, t) => e < 8 && t < 8 || e >= 17 && t < 8 || e < 8 && t >= 17, i = "";
	for (let e = 0; e < f; e++) for (let t = 0; t < f; t++) !r(t, e) && n() > .52 && (i += `<rect x="${t}" y="${e}" width="1" height="1"/>`);
	let a = (e, t) => `<rect x="${e + .5}" y="${t + .5}" width="6" height="6" fill="none" stroke="currentColor"/><rect x="${e + 2}" y="${t + 2}" width="3" height="3"/>`;
	return `<svg class="qr-code" viewBox="0 0 ${f} ${f}" shape-rendering="crispEdges" aria-hidden="true">${a(0, 0)}${a(18, 0)}${a(0, 18)}${i}</svg>`;
}, h = [
	"4F7K-2M9Q",
	"X8D3-HB6T",
	"P2RW-7NCL",
	"J5VZ-Q4EM",
	"T9AG-3KYF",
	"C6UH-8SPD",
	"M3XN-W7RB",
	"Z4LQ-5GTJ"
], g = class extends l {
	static styles = [
		c,
		n,
		u
	];
	static props = {
		...l.props,
		email: { default: "mara@northwind.dev" },
		secret: { default: "JBSWY3DPEHPK3PXPLOWR" },
		qrSrc: {},
		codes: {
			type: Object,
			default: h
		},
		step: {
			type: Number,
			default: 0,
			reflect: !0
		}
	};
	#e = /* @__PURE__ */ new Set();
	renderBody() {
		return `<div class="body"><div class="progress" aria-hidden="true">${d.map(() => "<span></span>").join("")}</div><h2 class="title" id="modal-title"></h2><p class="lead step-of"></p>
<section class="step" data-step="0"><div class="qr"></div><div class="scan-text"><p class="instructions">Open 1Password, Authy or Google Authenticator and scan the code. It adds <b class="email"></b>.</p><p class="cant">Can't scan? Enter this key</p><div class="key"><code class="secret"></code><button class="icon copy-key" type="button" aria-label="Copy the key">${r(o, 16)}</button></div></div></section>
<section class="step" data-step="1"><p class="instructions">Type the six digits your authenticator shows for LowerSoft. They change every 30 seconds.</p><lw-verification-code class="otp" length="6" label="Six-digit code"></lw-verification-code></section>
<section class="step" data-step="2"><p class="instructions">Each code signs you in once if you lose your phone. Keep them somewhere other than this computer.</p><ol class="codes"></ol><div class="code-actions"><lw-button class="copy-codes" variant="outline" size="sm"><span slot="start">${r(o, 15)}</span>Copy</lw-button><lw-button class="download" variant="outline" size="sm"><span slot="start">${r(a, 15)}</span>Download</lw-button></div><lw-checkbox class="saved">I've saved my recovery codes</lw-checkbox></section>
<p class="live visually-hidden" aria-live="polite"></p></div>
<footer class="foot"><lw-button class="back" variant="ghost">Back</lw-button><lw-button class="next"></lw-button></footer>`;
	}
	connected() {
		super.connected();
		let e = { signal: this.signal };
		this.query(".copy-key").addEventListener("click", () => this.#r(this.secret, this.query(".copy-key")), e), this.query(".copy-codes").addEventListener("click", () => this.#r(this.codes.join("\n"), null), e), this.query(".download").addEventListener("click", () => {
			let e = URL.createObjectURL(new Blob([`LowerSoft recovery codes for ${this.email}\n\n${this.codes.join("\n")}\n`], { type: "text/plain" }));
			Object.assign(document.createElement("a"), {
				href: e,
				download: "lowersoft-recovery-codes.txt"
			}).click(), setTimeout(() => URL.revokeObjectURL(e), 1e3);
		}, e);
		let t = this.query(".otp");
		t.verify = async (e) => this.verify ? this.verify(e) : /^\d{6}$/.test(e), t.addEventListener("lw-verified", () => this.step = 2, e), this.query(".saved").addEventListener("change", () => this.#t(), e), this.query(".back").addEventListener("click", () => this.step = Math.max(0, this.step - 1), e), this.query(".next").addEventListener("click", () => this.#n(), e), this.signal.addEventListener("abort", () => this.#e.forEach(clearTimeout));
	}
	updated(e) {
		super.updated(e), this.query(".email").textContent = this.email ?? "", this.query(".secret").textContent = (this.secret ?? "").match(/.{1,4}/g)?.join(" ") ?? "", (e.has("qrSrc") || e.has("secret")) && (this.query(".qr").innerHTML = this.qrSrc ? `<img src="${t(this.qrSrc)}" alt="QR code for your authenticator">` : m(this.secret ?? "")), e.has("codes") && (this.query(".codes").innerHTML = this.codes.map((e) => `<li>${t(e)}</li>`).join("")), e.has("step") && this.step === 1 && requestAnimationFrame(() => this.query(".otp").focus()), this.#t();
	}
	#t() {
		let e = this.step;
		this.query("#modal-title").textContent = d[e], this.query(".step-of").textContent = `Two-factor · step ${e + 1} of ${d.length}`, this.shadowRoot.querySelectorAll(".progress span").forEach((t, n) => t.toggleAttribute("data-done", n <= e));
		for (let t of this.shadowRoot.querySelectorAll(".step")) t.hidden = Number(t.dataset.step) !== e;
		this.query(".back").hidden = e === 0;
		let t = this.query(".next");
		t.textContent = [
			"I scanned it",
			"Verify",
			"Done"
		][e], t.disabled = e === 2 && !this.query(".saved").checked, t.hidden = e === 1;
	}
	#n() {
		this.step < d.length - 1 ? this.step++ : (this.emit("enabled"), this.hide("enabled"));
	}
	async #r(e, t) {
		try {
			await i(e);
		} catch {
			return;
		}
		if (this.query(".live").textContent = "Copied", !t) return;
		t.innerHTML = r(s, 16);
		let n = setTimeout(() => {
			t.innerHTML = r(o, 16), this.#e.delete(n);
		}, p);
		this.#e.add(n);
	}
};
//#endregion
//#region src/components/two-factor-dialog/index.js
e("two-factor-dialog", g);
//#endregion
export { g as t };
