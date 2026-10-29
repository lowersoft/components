import { t as e } from "./core-WcEz9YgG.js";
import { n as t } from "./motion-CFWhFfc_.js";
import { t as n } from "./action-button-CL_BDqUs.js";
import { n as r, t as i } from "./rolling-VjfpUD4B.js";
//#region src/components/pay-button/pay-button.scss?inline
var a = ".label[data-status=idle]{gap:.375rem}.amount{font-weight:600}.card{color:color-mix(in oklab, var(--_fg) 65%, transparent);font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;align-items:center;gap:.375rem;margin-inline-start:.375rem;display:inline-flex}.card[hidden]{display:none}.card:before{background:color-mix(in oklab, var(--_fg) 25%, transparent);content:\"\";width:1px;height:1rem;margin-inline-end:.125rem}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", o = 300, s = "<svg class=\"icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"2\"/><path d=\"M2 10h20\"/></svg>", c = class extends n {
	static styles = [
		...n.styles,
		r,
		a
	];
	static props = {
		...n.props,
		amount: {
			type: Number,
			default: 0
		},
		currency: { default: "USD" },
		locale: {},
		label: { default: "Pay" },
		card: {},
		pendingLabel: { default: "Processing" },
		successLabel: { default: "Paid" },
		errorLabel: { default: "Card declined" }
	};
	#e = null;
	#t = !1;
	renderIdle() {
		return `<span class="pay-label"></span><span class="amount rolling" aria-hidden="true"></span><span class="amount-text visually-hidden"></span><span class="card" hidden>${s}<span aria-hidden="true">••••</span><span class="last4"></span></span>`;
	}
	updated(e) {
		super.updated(e), e.has("label") && (this.query(".pay-label").textContent = this.label), e.has("card") && (this.query(".card").hidden = !this.card, this.query(".last4").textContent = this.card ?? ""), (e.has("locale") || e.has("currency")) && (this.#e = new Intl.NumberFormat(this.locale, {
			style: "currency",
			currency: this.currency,
			numberingSystem: "latn"
		})), [
			"amount",
			"locale",
			"currency"
		].some((t) => e.has(t)) && this.#n();
	}
	#n() {
		let e = this.#e.format(this.amount), n = this.query(".button"), r = n.offsetWidth;
		i(this.query(".amount"), e), this.query(".amount-text").textContent = e;
		let a = n.offsetWidth, s = this.#t && a !== r && !t.matches;
		if (this.#t = !0, s) {
			let e = getComputedStyle(this).getPropertyValue("--lw-ease-out").trim() || "ease-out";
			n.animate({ width: [`${r}px`, `${a}px`] }, {
				duration: o,
				easing: e
			});
		}
	}
};
//#endregion
//#region src/components/pay-button/index.js
e("pay-button", c);
//#endregion
export { c as t };
