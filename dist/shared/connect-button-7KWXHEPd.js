import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./status-button-DsS9mbNz.js";
import { t as n } from "./action-button-CitOyaNC.js";
//#region src/components/connect-button/connect-button.scss?inline
var r = ".button{gap:.625rem}.marks{flex:none;align-items:center;gap:.25rem;display:flex}.mark,::slotted(:is([slot=mark],[slot=provider])){flex:none;width:1.25rem;height:1.25rem}.mark{border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--_fg) 14%, transparent);justify-content:center;align-items:center;display:inline-flex}.mark .icon{width:.75rem;height:.75rem}.link{justify-content:space-between;align-items:center;width:1.25rem;display:flex}.side{background:color-mix(in oklab, var(--_fg) 35%, transparent);width:30%;height:2px;transition:width .3s var(--lw-ease-spring), background-color .3s var(--lw-ease-out);border-radius:1px}:host([status=connected]) .side{background:var(--_fg);width:50%}.pulse{border-radius:var(--lw-radius-full);background:var(--_fg);opacity:0;width:.25rem;height:.25rem;transition:width .3s var(--lw-ease-spring)}:host([status=connected]) .pulse{width:0}:host([status=connecting]) .pulse{animation:.9s ease-in-out infinite pulse}@keyframes pulse{0%,to{opacity:.25;scale:.6}50%{opacity:1;scale:1.2}}.account:not(:empty):before{opacity:.5;content:\"·\";margin-inline-end:.5rem}.label[data-status=connected]:after{opacity:0;content:attr(data-disconnect);transition:opacity var(--lw-duration-fast) var(--lw-ease-out);justify-content:center;align-items:center;display:flex;position:absolute;inset:0}:host([status=connected]) .button:is(:hover,:focus-visible){color:var(--lw-color-destructive)}:host([status=connected]) .button:is(:hover,:focus-visible) .label[data-status=connected]>*{opacity:0}:host([status=connected]) .button:is(:hover,:focus-visible) .label[data-status=connected]:after{opacity:1}", i = (e) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, a = `<span class="marks" aria-hidden="true"><slot name="mark">${`<span class="mark">${i("<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"4\"/>")}</span>`}</slot><span class="link"><span class="side"></span><span class="pulse"></span><span class="side"></span></span><slot name="provider">${`<span class="mark">${i("<path d=\"M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z\"/>")}</span>`}</slot></span>`, o = class extends t {
	static styles = [
		...t.styles,
		n,
		r
	];
	static statuses = {
		connecting: {
			label: "connectingLabel",
			busy: !0,
			locked: !0
		},
		connected: {
			label: "connectedLabel",
			after: "<span class=\"account\"></span>"
		},
		error: { label: "errorLabel" }
	};
	static props = {
		...t.props,
		account: {},
		connectingLabel: { default: "Connecting" },
		connectedLabel: { default: "Connected" },
		disconnectLabel: { default: "Disconnect" },
		errorLabel: { default: "Couldn’t connect" }
	};
	#e = 0;
	render() {
		return super.render(a);
	}
	updated(e) {
		if (super.updated(e), e.has("account") && (this.query(".account").textContent = this.account ?? ""), e.has("disconnectLabel") && (this.query(".label[data-status=\"connected\"]").dataset.disconnect = this.disconnectLabel), [
			"status",
			"account",
			"connectedLabel",
			"disconnectLabel"
		].some((t) => e.has(t))) {
			let e = this.query(".button");
			this.status === "connected" ? e.ariaLabel = [
				this.disconnectLabel,
				this.connectedLabel,
				this.account
			].filter(Boolean).join(", ") : e.removeAttribute("aria-label");
		}
	}
	handleClick() {
		this.status !== "connecting" && (this.status === "connected" ? this.#n() : this.#t());
	}
	#t() {
		let e = null;
		if (!this.emit("connect", { waitUntil: (t) => e = t })) return;
		let t = ++this.#e;
		this.status = "connecting", Promise.resolve(e).then((e) => {
			t === this.#e && (typeof e == "string" && (this.account = e), this.status = "connected");
		}, () => t === this.#e && (this.status = "error"));
	}
	#n() {
		this.emit("disconnect") && (this.#e++, this.status = "idle");
	}
};
//#endregion
//#region src/components/connect-button/index.js
e("connect-button", o);
//#endregion
export { o as t };
