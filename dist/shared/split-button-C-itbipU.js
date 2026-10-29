import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./action-button-CL_BDqUs.js";
import { i as n, n as r, t as i } from "./menu-BCEGADW6.js";
import { n as a, t as o } from "./swap-BK53XQML.js";
//#region src/components/split-button/split-button.scss?inline
var s = ":host{position:relative}.button:not(.caret){border-start-end-radius:0;border-end-end-radius:0}.caret{border-inline-start-color:color-mix(in oklab, var(--_fg) 20%, transparent);box-shadow:inset 1px 0 color-mix(in oklab, var(--_fg) 20%, transparent);border-start-start-radius:0;border-end-start-radius:0;flex:none;padding-inline:.625rem}.caret .icon{transition:rotate var(--lw-duration-normal) var(--lw-ease-out)}.caret[aria-expanded=true] .icon{rotate:180deg}", c = "<svg class=\"icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m6 9 6 6 6-6\"/></svg>", l = (e) => {
	try {
		return localStorage.getItem(e);
	} catch {
		return null;
	}
}, u = (e, t) => {
	try {
		localStorage.setItem(e, t);
	} catch {}
}, d = class extends t {
	static styles = [
		...t.styles,
		n,
		a,
		s
	];
	static props = {
		...t.props,
		value: { reflect: !0 },
		storageKey: {},
		menuLabel: { default: "More options" }
	};
	#e = [];
	#t = null;
	renderIdle() {
		return "<slot name=\"start\"></slot><span class=\"choice swap\"></span>";
	}
	render() {
		return `${super.render()}<button class="button caret" part="caret" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="menu">${c}</button>${i}`;
	}
	connected() {
		super.connected(), this.#t ??= new r({
			trigger: this.query(".caret"),
			menu: this.query(".menu"),
			onPick: (e) => this.#i(e),
			canOpen: () => this.status !== "pending"
		}), this.#t.connect(this.signal), this.storageKey && !this.hasAttribute("value") && (this.value = l(this.storageKey) ?? void 0), this.#n();
		let e = new MutationObserver((e) => {
			e.some(({ type: e, target: t }) => e !== "attributes" || t !== this) && this.#n();
		});
		e.observe(this, {
			childList: !0,
			subtree: !0,
			attributes: !0,
			characterData: !0
		}), this.signal.addEventListener("abort", () => e.disconnect());
	}
	updated(e) {
		e.has("value") && this.#r(), e.has("menuLabel") && (this.query(".caret").ariaLabel = this.menuLabel), (e.has("status") || e.has("disabled")) && (this.query(".caret").disabled = this.disabled || this.status === "pending"), super.updated(e);
	}
	#n() {
		this.#e = [...this.querySelectorAll(":scope > option")].map((e) => ({
			value: e.value,
			label: e.textContent.trim(),
			description: e.dataset.description ?? "",
			pending: e.dataset.pending,
			done: e.dataset.done
		})), this.#t.setItems(this.#e), this.#r();
	}
	#r() {
		let e = this.#e.find((e) => e.value === this.value) ?? this.#e[0];
		e && (o(this.query(".choice"), e.label, this.query(".button")), this.pendingLabel = e.pending ?? e.label, this.successLabel = e.done ?? e.label, this.#t.setChecked(e.value));
	}
	#i(e) {
		e !== (this.value ?? this.#e[0]?.value) && (this.value = e, this.storageKey && u(this.storageKey, e), this.emit("change", { value: e }));
	}
};
//#endregion
//#region src/components/split-button/index.js
e("split-button", d);
//#endregion
export { d as t };
