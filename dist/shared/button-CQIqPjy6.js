import { n as e } from "./core-WcEz9YgG.js";
import { n as t } from "./dom-Dlk1FlsZ.js";
import { t as n } from "./icons-HWomdoMw.js";
import { n as r } from "./icons-Dv1KN71n.js";
import { i, n as a, o, r as s } from "./shortcut-kjm7vAXW.js";
import { n as c, t as l } from "./form-QHOiInAj.js";
//#region src/components/button/button.scss?inline
var u = ":host{--_bg:var(--lw-color-primary);--_fg:var(--lw-color-primary-foreground);--_border:transparent}:host([variant=secondary]){--_bg:var(--lw-color-secondary);--_fg:var(--lw-color-secondary-foreground)}:host([variant=outline]){--_bg:transparent;--_fg:var(--lw-color-foreground);--_border:var(--lw-color-border)}:host([variant=ghost]){--_bg:transparent;--_fg:var(--lw-color-foreground)}:host([variant=destructive]){--_bg:var(--lw-color-destructive);--_fg:var(--lw-color-destructive-foreground)}:host{--_height:2.25rem;--_padding:1rem;--_text:var(--lw-text-sm);vertical-align:middle;display:inline-flex;position:relative}:host([size=sm]){--_height:2rem;--_padding:.75rem;--_text:var(--lw-text-xs)}:host([size=lg]){--_height:2.75rem;--_padding:1.5rem;--_text:var(--lw-text-md)}:host([icon-only]) .button{width:var(--_height);padding:0}:host([disabled]){pointer-events:none;opacity:.5}:host([disabled][disabled-reason]){pointer-events:auto;opacity:1}:host([disabled][disabled-reason]) .button{cursor:not-allowed}:host([disabled][disabled-reason]) .button:hover{background:var(--_bg)}:host([disabled][disabled-reason]) .button:active{transform:none}.reason{z-index:20;border-radius:var(--lw-radius-md);background:var(--lw-color-foreground);width:max-content;max-width:16rem;box-shadow:var(--lw-shadow-md);color:var(--lw-color-background);font-size:var(--lw-text-xs);text-align:center;opacity:0;pointer-events:none;visibility:hidden;padding:.375rem .625rem;line-height:1.4;position:absolute;bottom:calc(100% + .5rem);left:50%;translate:-50% .25rem}@media (prefers-reduced-motion:no-preference){.reason{transition:opacity var(--lw-duration-fast) var(--lw-ease-out), translate var(--lw-duration-fast) var(--lw-ease-out), visibility var(--lw-duration-fast)}}:host([disabled][disabled-reason]) .button:is(:hover,:focus-visible)+.reason{opacity:1;visibility:visible;translate:-50%}.spin{display:none}:host([loading]) .spin{display:flex}:host([loading]) slot[name=start]{display:none}:host([loading]) .button{cursor:progress}.button{height:var(--_height);padding-inline:var(--_padding);border:1px solid var(--_border);border-radius:var(--lw-radius-md);background:var(--_bg);color:var(--_fg);font:inherit;font-size:var(--_text);white-space:nowrap;cursor:pointer;-webkit-user-select:none;user-select:none;flex:1;justify-content:center;align-items:center;gap:.5rem;font-weight:500;display:inline-flex}@media (prefers-reduced-motion:no-preference){.button{transition:background-color var(--lw-duration-fast) var(--lw-ease-out), transform var(--lw-duration-fast) var(--lw-ease-out)}}.button:hover{background:color-mix(in oklab, var(--_bg) 88%, var(--_fg))}.button:active{transform:scale(.97)}.button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.keys{gap:.25rem;padding-bottom:2px;display:flex}.keys:empty{display:none}.key{--_edge:color-mix(in oklab, var(--_fg) 22%, var(--_bg));border:1px solid var(--_edge);border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--_fg) 8%, var(--_bg));min-width:1.5rem;height:1.5rem;box-shadow:0 2px 0 0 var(--_edge);color:inherit;font:inherit;justify-content:center;align-items:center;padding-inline:.375rem;font-size:.6875rem;line-height:1;display:inline-flex}@media (prefers-reduced-motion:no-preference){.key{transition:translate var(--lw-duration-fast) var(--lw-ease-out), box-shadow var(--lw-duration-fast) var(--lw-ease-out)}}.key[data-pressed],.button:active .key{box-shadow:none;transition-duration:75ms;translate:0 2px}", d = (e, t, n) => n == null ? e.removeAttribute(t) : e.setAttribute(t, n), f = class extends l(e) {
	static styles = [n, u];
	static shadowOptions = {
		mode: "open",
		delegatesFocus: !0
	};
	static props = {
		variant: {
			default: "primary",
			reflect: !0
		},
		size: {
			default: "md",
			reflect: !0
		},
		type: { default: "button" },
		disabled: {
			type: Boolean,
			reflect: !0
		},
		disabledReason: { reflect: !0 },
		loading: {
			type: Boolean,
			reflect: !0
		},
		shortcut: {},
		passive: { type: Boolean },
		iconOnly: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = null;
	#t = null;
	render() {
		return `<button class="button" part="button"><span class="spin">${r}</span><slot name="start"></slot><slot></slot><slot name="end"></slot><span class="keys" aria-hidden="true"></span></button><span class="reason" part="reason" id="reason" role="tooltip"></span>`;
	}
	connected() {
		this.query(".button").addEventListener("click", (e) => this.#n || this.handleClick(e), { signal: this.signal }), this.#e && this.#i();
	}
	updated(e) {
		let t = this.query(".button");
		if (e.has("disabled") || e.has("disabledReason")) {
			let e = this.disabled && !!this.disabledReason;
			t.disabled = this.disabled && !e, d(t, "aria-disabled", e ? "true" : null), d(t, "aria-describedby", e ? "reason" : null);
		}
		if (e.has("disabledReason")) {
			let e = this.query(".reason");
			e && (e.textContent = this.disabledReason ?? "");
		}
		e.has("loading") && d(t, "aria-busy", this.loading ? "true" : null), e.has("shortcut") && this.#r(), (e.has("shortcut") || e.has("passive")) && this.#i();
	}
	handleClick() {
		this.formAction();
	}
	formAction() {
		let { form: e } = this[c];
		e && (this.type === "submit" ? e.requestSubmit() : this.type === "reset" && e.reset());
	}
	get #n() {
		return this.disabled || this.loading;
	}
	#r() {
		this.#e = this.shortcut ? o(this.shortcut) : null, d(this.query(".button"), "aria-keyshortcuts", this.#e?.aria ?? null);
		let e = (this.#e?.labels ?? []).map((e) => Object.assign(document.createElement("kbd"), {
			className: "key",
			part: "key",
			textContent: e
		}));
		this.query(".keys")?.replaceChildren(...e);
	}
	#i() {
		if (this.#t?.abort(), this.#t = null, this.#s(), !this.#e || this.passive || !this.isConnected) return;
		this.#t = new AbortController();
		let e = { signal: AbortSignal.any([this.signal, this.#t.signal]) };
		addEventListener("keydown", this.#a, e), addEventListener("keyup", (e) => this.#o(e, !1), e), addEventListener("blur", () => this.#s(), e);
	}
	#a = (e) => {
		let n = this.#e;
		(n.allowedWhileTyping || !t(e)) && (this.#o(e, !0), !e.repeat && !this.#n && i(e, n) && (e.preventDefault(), this.query(".button").click()));
	};
	#o(e, t) {
		let n = this.shadowRoot.querySelectorAll(".key");
		if (!n.length) return;
		let { modifiers: r, key: i } = this.#e;
		r.forEach((t, r) => n[r].toggleAttribute("data-pressed", s(t, e))), n[r.length].toggleAttribute("data-pressed", t && a(e, i));
	}
	#s() {
		this.shadowRoot.querySelectorAll("[data-pressed]").forEach((e) => e.removeAttribute("data-pressed"));
	}
};
//#endregion
export { u as n, f as t };
