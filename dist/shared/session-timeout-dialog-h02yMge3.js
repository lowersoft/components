import { t as e } from "./core-WcEz9YgG.js";
import { n as t, t as n } from "./modal-DvPYHqbK.js";
//#region src/components/session-timeout-dialog/session-timeout-dialog.scss?inline
var r = ".modal{--_width:30rem;--_ring:var(--lw-color-foreground)}:host([data-urgent]) .modal{--_ring:var(--lw-color-destructive)}.content{align-items:center;gap:1.5rem;padding:2rem 2rem 1.75rem;display:flex}.ring{flex:none;place-items:center;width:4.5rem;height:4.5rem;display:grid;position:relative}.ring svg{fill:none;stroke-width:2.5px;stroke-linecap:round;position:absolute;inset:0;rotate:-90deg}.track{stroke:var(--_line)}.left{stroke:var(--_ring);stroke-dasharray:1}@media (prefers-reduced-motion:no-preference){.left{transition:stroke-dashoffset .25s linear,stroke .3s ease-out}}.count{font-size:var(--lw-text-lg);font-variant-numeric:tabular-nums;font-weight:500}.lead b{font-variant-numeric:tabular-nums;color:var(--_ring);font-weight:600}", i = 10, a = class extends n {
	static styles = [t, r];
	static props = {
		...n.props,
		seconds: {
			type: Number,
			default: 60
		}
	};
	#e = 0;
	#t = 0;
	renderBody() {
		return "<div class=\"body content\"><span class=\"ring\" aria-hidden=\"true\"><svg viewBox=\"0 0 44 44\"><circle class=\"track\" cx=\"22\" cy=\"22\" r=\"20\"/><circle class=\"left\" cx=\"22\" cy=\"22\" r=\"20\" pathLength=\"1\"/></svg><span class=\"count\"></span></span>\n<div><h2 class=\"title\" id=\"modal-title\">Still there?</h2><p class=\"lead\">For your security you'll be signed out in <b class=\"clock\"></b>. Anything you're typing stays put.</p></div></div>\n<footer class=\"foot\"><lw-button class=\"out\" variant=\"outline\">Sign out</lw-button><lw-button class=\"stay\">Stay signed in</lw-button></footer><p class=\"announce visually-hidden\" aria-live=\"assertive\"></p>";
	}
	connected() {
		super.connected();
		let e = { signal: this.signal };
		this.query(".stay").addEventListener("click", () => {
			this.emit("extend"), this.hide("extend");
		}, e), this.query(".out").addEventListener("click", () => this.#r(!1), e), this.addEventListener("lw-close", () => clearInterval(this.#t), e), this.signal.addEventListener("abort", () => clearInterval(this.#t));
	}
	opened() {
		this.#e = Date.now() + this.seconds * 1e3, clearInterval(this.#t), this.#t = setInterval(() => this.#n(), 250), this.#n(), requestAnimationFrame(() => this.query(".stay").focus());
	}
	#n() {
		let e = Math.max(0, Math.ceil((this.#e - Date.now()) / 1e3));
		this.query(".count").textContent = String(e), this.query(".clock").textContent = `${Math.floor(e / 60)}:${String(e % 60).padStart(2, "0")}`, this.query(".left").style.strokeDashoffset = String(1 - e / this.seconds), this.toggleAttribute("data-urgent", e <= i), e === i && (this.query(".announce").textContent = `${i} seconds left before you're signed out.`), e === 0 && this.#r(!0);
	}
	#r(e) {
		clearInterval(this.#t), this.emit("sign-out", { expired: e }), this.hide(e ? "expired" : "sign-out");
	}
};
//#endregion
//#region src/components/session-timeout-dialog/index.js
e("session-timeout-dialog", a);
//#endregion
export { a as t };
