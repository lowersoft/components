import { n as e, t } from "./icons-Dv1KN71n.js";
import { t as n } from "./status-button-DsS9mbNz.js";
import { t as r } from "./action-button-CitOyaNC.js";
//#region src/components/button/action-button.js
var i = "<svg class=\"icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 8v4M12 16h.01\"/></svg>", a = { translate: [
	"0",
	"-5px",
	"5px",
	"-3px",
	"3px",
	"0"
] }, o = 320, s = class extends n {
	static styles = [...n.styles, r];
	static statuses = {
		pending: {
			icon: e,
			label: "pendingLabel",
			busy: !0,
			locked: !0
		},
		success: {
			icon: t,
			label: "successLabel"
		},
		error: {
			icon: i,
			label: "errorLabel"
		}
	};
	static props = {
		...n.props,
		pendingLabel: { default: "Saving" },
		successLabel: { default: "Saved" },
		errorLabel: { default: "Try again" },
		successDuration: {
			type: Number,
			default: 1600
		},
		errorDuration: {
			type: Number,
			default: 3200
		}
	};
	#e = 0;
	#t = 0;
	connected() {
		super.connected(), this.signal.addEventListener("abort", () => clearTimeout(this.#e));
	}
	handleClick(e) {
		if (this.status === "pending") return;
		super.handleClick(e), clearTimeout(this.#e);
		let t = null;
		if (!this.emit("action", { waitUntil: (e) => t = e })) return;
		if (!t) return this.#n("success");
		let n = ++this.#t;
		this.status = "pending", Promise.resolve(t).then(() => n === this.#t && this.#n("success"), (e) => n === this.#t && this.#n("error", e));
	}
	statusChanged(e, t) {
		e === "error" && t && this.query(".content").animate(a, {
			duration: o,
			easing: "ease-out"
		});
	}
	#n(e, t) {
		this.status = e, this.emit(e, e === "error" ? { error: t } : void 0), this.#e = setTimeout(() => this.status = "idle", e === "success" ? this.successDuration : this.errorDuration);
	}
};
//#endregion
export { s as t };
