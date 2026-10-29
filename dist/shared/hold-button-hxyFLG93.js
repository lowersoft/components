import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./icons-Dv1KN71n.js";
import { n } from "./motion-CFWhFfc_.js";
import { t as r } from "./status-button-DsS9mbNz.js";
//#region src/components/hold-button/hold-button.scss?inline
var i = ":host([status=complete]:is([variant=secondary],[variant=outline],[variant=ghost])){--_bg:var(--lw-color-primary);--_fg:var(--lw-color-primary-foreground);--_border:var(--lw-color-primary)}.button{touch-action:none;-webkit-touch-callout:none;min-width:11rem;overflow:hidden}@media (prefers-reduced-motion:no-preference){.button{transition:background-color var(--lw-duration-fast) var(--lw-ease-out), border-color var(--lw-duration-fast) var(--lw-ease-out), color var(--lw-duration-fast) var(--lw-ease-out)}}.button:active{transform:none}.fill{opacity:.15;clip-path:inset(0 100% 0 0);pointer-events:none;transition:opacity var(--lw-duration-fast) var(--lw-ease-out);background:currentColor;position:absolute;inset:0}:host([status=complete]) .fill{opacity:0}", a = /* @__PURE__ */ new Set([" ", "Enter"]), o = { clipPath: ["inset(0 100% 0 0)", "inset(0 0 0 0)"] }, s = 300, c = 150, l = class extends r {
	static styles = [...r.styles, i];
	static statuses = {
		holding: {
			icon: "",
			label: "holdingLabel",
			silent: !0
		},
		complete: {
			icon: t,
			label: "completeLabel",
			locked: !0
		}
	};
	static props = {
		...r.props,
		duration: {
			type: Number,
			default: 1200
		},
		holdingLabel: { default: "Keep holding" },
		completeLabel: { default: "Done" },
		resetAfter: {
			type: Number,
			default: 1800
		}
	};
	#e = null;
	#t = !1;
	#n = 0;
	#r = 0;
	render() {
		return super.render("<span class=\"fill\" part=\"fill\" aria-hidden=\"true\"></span>");
	}
	connected() {
		super.connected();
		let e = this.query("button"), t = { signal: this.signal }, n = () => this.#s();
		e.addEventListener("pointerdown", this.#i, t), e.addEventListener("keydown", this.#a, t), e.addEventListener("keyup", (e) => a.has(e.key) && this.#s(), t);
		for (let r of [
			"pointerup",
			"pointerleave",
			"pointercancel",
			"blur"
		]) e.addEventListener(r, n, t);
		this.signal.addEventListener("abort", () => {
			clearTimeout(this.#n), clearTimeout(this.#r), this.#t = !1;
		});
	}
	handleClick() {}
	#i = (e) => {
		e.button === 0 && (e.currentTarget.hasPointerCapture(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId), this.#o());
	};
	#a = (e) => {
		a.has(e.key) && (e.preventDefault(), e.repeat || this.#o());
	};
	#o() {
		this.#t || this.disabled || this.status === "complete" || (this.#t = !0, this.#n = setTimeout(() => this.status = "holding", c), this.#e ??= this.#l(), this.#e.updatePlaybackRate(1), this.#e.play());
	}
	#s() {
		this.#t && (this.#t = !1, clearTimeout(this.#n), this.status = "idle", n.matches || !this.#e.currentTime ? this.#u() : (this.#e.updatePlaybackRate(-this.duration / s), this.#e.play()));
	}
	#c() {
		this.#t = !1, clearTimeout(this.#n), this.status = "complete", this.emit("complete"), this.formAction(), this.resetAfter > 0 && (this.#r = setTimeout(() => {
			this.#u(), this.status = "idle";
		}, this.resetAfter));
	}
	#l() {
		let e = this.query(".fill").animate(o, {
			duration: this.duration,
			fill: "both"
		});
		return e.pause(), e.onfinish = () => {
			this.#t && e.playbackRate > 0 && this.#c();
		}, e;
	}
	#u() {
		this.#e?.cancel(), this.#e = null;
	}
};
//#endregion
//#region src/components/hold-button/index.js
e("hold-button", l);
//#endregion
export { l as t };
