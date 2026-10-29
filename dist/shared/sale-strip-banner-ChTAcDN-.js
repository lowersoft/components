import { n as e, t } from "./core-WcEz9YgG.js";
import { r as n } from "./icons-Dv1KN71n.js";
import { n as r, t as i } from "./rolling-VjfpUD4B.js";
import { t as a } from "./clipboard-BCkfa02P.js";
import { b as o, d as s, i as c } from "./lucide-BVbUPHVq.js";
import { n as l, t as u } from "./banner-DyZRwpIp.js";
//#region src/components/sale-strip-banner/sale-strip-banner.scss?inline
var d = ":host{font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block;overflow:hidden;container-type:inline-size}:host([hidden]){display:none}p{margin:0}a,button{font:inherit;color:inherit;outline:none}a:focus-visible,button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.close,.icon-button{border-radius:var(--lw-radius-md);width:2rem;height:2rem;color:var(--lw-color-muted-foreground);cursor:pointer;background:0 0;border:0;flex:none;place-items:center;padding:0;display:grid}.close:hover,.icon-button:hover{color:var(--lw-color-foreground)}:host{--_strip:color-mix(in oklab, var(--lw-color-foreground) 6%, var(--lw-color-background));border-bottom:1px solid var(--lw-color-border);background:var(--_strip)}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.bar{min-height:3.5rem;font-size:var(--lw-text-md);flex-wrap:wrap;justify-content:center;align-items:center;gap:.5rem 1.75rem;padding:.5rem 3.5rem;display:flex;position:relative}@container (width<=40rem){.bar{justify-content:flex-start;padding-left:1rem}}.offer{color:var(--lw-color-muted-foreground)}.offer b{color:var(--lw-color-foreground);font-weight:600}.coupon{border:1px dashed color-mix(in oklab, var(--lw-color-foreground) 35%, transparent);border-radius:var(--lw-radius-md);font:500 var(--lw-text-sm) var(--lw-font-mono);letter-spacing:.04em;cursor:pointer;background:0 0;align-items:center;gap:.5rem;padding:.375rem 1rem;display:inline-flex;-webkit-mask:radial-gradient(circle at 0,#0000 .375rem,#000 calc(.375rem + .5px)) 0/51% 100% no-repeat,radial-gradient(circle at 100%,#0000 .375rem,#000 calc(.375rem + .5px)) 100%/51% 100% no-repeat;mask:radial-gradient(circle at 0,#0000 .375rem,#000 calc(.375rem + .5px)) 0/51% 100% no-repeat,radial-gradient(circle at 100%,#0000 .375rem,#000 calc(.375rem + .5px)) 100%/51% 100% no-repeat}@media (prefers-reduced-motion:no-preference){.coupon{transition:background-color .15s ease-out}}.coupon:hover,.coupon[data-copied]{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent)}.coupon[data-copied] .coupon-icon{color:var(--lw-color-accent)}.coupon-icon{color:var(--lw-color-muted-foreground);display:grid}.countdown{color:var(--lw-color-muted-foreground);align-items:baseline;gap:.5rem;display:inline-flex}@container (width<=40rem){.countdown{display:none}}.time{font-family:var(--lw-font-mono);color:var(--lw-color-foreground)}.action{align-items:center;gap:.375rem;font-weight:500;text-decoration:none;display:inline-flex}.action .action-text{text-underline-offset:.3em;text-decoration:underline;text-decoration-thickness:1.5px}@media (prefers-reduced-motion:no-preference){.action svg{transition:translate .2s ease-out}}.action:hover svg{translate:3px}.close{position:absolute;top:50%;right:.75rem;translate:0 -50%}", f = 1600, p = 223769e3, m = (e) => String(e).padStart(2, "0"), h = (e) => {
	let t = Math.max(0, Math.floor(e / 1e3)), n = Math.floor(t / 86400), r = `${m(Math.floor(t % 86400 / 3600))}:${m(Math.floor(t % 3600 / 60))}:${m(t % 60)}`;
	return n ? `${n}d ${r}` : r;
}, g = class extends e {
	static styles = [r, d];
	static props = {
		offer: { default: "30% off" },
		text: { default: "annual plans this week" },
		code: { default: "LOWER30" },
		ends: {},
		action: { default: "See plans" },
		href: { default: "#" }
	};
	#e = 0;
	#t = 0;
	#n = 0;
	render() {
		return `<div class="bar"><p class="offer"><b class="offer-bold"></b> <span class="offer-text"></span></p>
<button class="coupon" type="button"><span class="code"></span><span class="coupon-icon">${n(o, 15)}</span></button><span class="visually-hidden copied" aria-live="polite"></span>
<p class="countdown"><span class="countdown-label">Ends in</span> <span class="visually-hidden time-text"></span><span class="rolling time" aria-hidden="true"></span></p>
<a class="action"><span class="action-text"></span>${n(c, 16)}</a>${u()}</div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".coupon").addEventListener("click", () => this.#i(), e), this.query(".close").addEventListener("click", () => l(this), e), this.#t = setInterval(() => this.#r(), 1e3), this.signal.addEventListener("abort", () => {
			clearInterval(this.#t), clearTimeout(this.#n);
		});
	}
	updated(e) {
		e.has("ends") && (this.#e = this.ends ? new Date(this.ends).getTime() : Date.now() + p), this.query(".offer-bold").textContent = this.offer ?? "", this.query(".offer-text").textContent = this.text ?? "", this.query(".code").textContent = this.code ?? "", this.query(".coupon").ariaLabel = `Copy the code ${this.code}`;
		let t = this.query(".action");
		t.href = this.href ?? "#", this.query(".action-text").textContent = this.action ?? "", this.#r();
	}
	#r() {
		let e = this.#e - Date.now(), t = h(e);
		i(this.query(".time"), t);
		let n = t.replace(/:\d\d$/, "");
		this.query(".time-text").textContent !== n && (this.query(".time-text").textContent = n), e <= 0 && this.isConnected && !this.hidden && (clearInterval(this.#t), l(this));
	}
	async #i() {
		try {
			await a(this.code ?? "");
		} catch {
			return;
		}
		let e = this.query(".coupon-icon");
		e.innerHTML = n(s, 15), this.query(".coupon").toggleAttribute("data-copied", !0), this.query(".copied").textContent = "Code copied", clearTimeout(this.#n), this.#n = setTimeout(() => {
			e.innerHTML = n(o, 15), this.query(".coupon").removeAttribute("data-copied"), this.query(".copied").textContent = "";
		}, f), this.emit("copy", { code: this.code });
	}
};
//#endregion
//#region src/components/sale-strip-banner/index.js
t("sale-strip-banner", g);
//#endregion
export { g as t };
