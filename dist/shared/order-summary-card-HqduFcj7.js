import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { n as a, t as o } from "./rolling-VjfpUD4B.js";
import { Y as s, at as c } from "./lucide-BVbUPHVq.js";
//#region src/components/order-summary-card/order-summary-card.scss?inline
var l = ":host{box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:24rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);border-radius:1.5rem;padding:1.25rem;display:block}p{margin:0}.heading{font-size:var(--lw-text-md);font-weight:600}.items{gap:.75rem;margin:1rem 0 0;padding:0;list-style:none;display:grid}.items li{align-items:center;gap:.75rem;display:flex}.tile{border-radius:var(--lw-radius-lg);background:color-mix(in oklab, var(--_tint) 35%, var(--lw-color-background));flex:none;place-items:center;width:3rem;height:3rem;display:grid}.tile svg{width:100%;height:100%;fill:var(--_tint);stroke:var(--_tint)}.tile .soft{fill:color-mix(in oklab, var(--_tint) 50%, white);stroke:none}.what{flex:1;min-width:0;display:grid}.name{font-size:var(--lw-text-sm);text-overflow:ellipsis;white-space:nowrap;font-weight:500;overflow:hidden}.detail{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}.stepper{border-radius:var(--lw-radius-full);font-size:var(--lw-text-sm);font-variant-numeric:tabular-nums;align-items:center;gap:.125rem;display:flex}.stepper button{width:1.5rem;height:1.5rem;color:var(--lw-color-muted-foreground);cursor:pointer;opacity:.5;transition:opacity var(--lw-duration-fast) ease-out, background-color var(--lw-duration-fast) ease-out;background:0 0;border:0;border-radius:50%;outline:none;place-items:center;padding:0;display:grid}li:hover .stepper button,.stepper button:focus-visible{opacity:1}.stepper button:hover:not(:disabled){background:var(--lw-color-muted);color:var(--lw-color-foreground)}.stepper button:disabled{cursor:default;opacity:.2}.stepper button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.qty{text-align:center;min-width:1rem}.line{min-width:4.5rem;font-size:var(--lw-text-sm);font-variant-numeric:tabular-nums;justify-content:flex-end}.delivery{border-top:1px solid var(--lw-color-muted);justify-content:space-between;align-items:center;gap:.75rem;margin-top:1rem;padding-top:1rem;display:flex}.arrives{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}.promo{margin-top:.75rem}.add-promo{font:var(--lw-text-sm) var(--lw-font-sans);color:var(--lw-color-muted-foreground);text-underline-offset:3px;cursor:pointer;background:0 0;border:0;padding:0;-webkit-text-decoration:underline dotted;text-decoration:underline dotted}.add-promo:hover{color:var(--lw-color-foreground)}.add-promo:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.add-promo[hidden]{display:none}.promo-form{gap:.5rem;display:flex}.promo-form[hidden]{display:none}.code{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);min-width:0;height:2rem;font:var(--lw-text-sm) var(--lw-font-mono);text-transform:uppercase;color:inherit;background:0 0;outline:none;flex:1;padding:0 .625rem}.code:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.apply{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);height:2rem;font:500 var(--lw-text-sm) var(--lw-font-sans);color:inherit;cursor:pointer;border:0;padding:0 .75rem}.apply:hover{background:var(--lw-color-border)}.apply:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.promo-note{font-size:var(--lw-text-xs);margin-top:.375rem}.promo-note[data-tone=error]{color:var(--lightningcss-light,#dc2626)var(--lightningcss-dark,#f87171)}.promo-note[data-tone=ok]{color:var(--lightningcss-light,#059669)var(--lightningcss-dark,#34d399)}.promo-note:empty{display:none}.totals{border-top:1px solid var(--lw-color-muted);font-size:var(--lw-text-sm);gap:.375rem;margin:1rem 0;padding-top:1rem;display:grid}.totals div{justify-content:space-between;display:flex}.totals div[hidden]{display:none}.totals dt{color:var(--lw-color-muted-foreground)}.totals dd{font-variant-numeric:tabular-nums;margin:0}.discount{color:var(--lightningcss-light,#059669)var(--lightningcss-dark,#34d399)}.total-row{border-top:1px dashed var(--lw-color-border);font-size:var(--lw-text-md);margin-top:.375rem;padding-top:.5rem;font-weight:600}.total-row dt{color:var(--lw-color-foreground)}.pay{width:100%;display:flex}", u = {
	mug: "<rect x=\"14\" y=\"16\" width=\"22\" height=\"22\" rx=\"4\"/><path d=\"M36 21h3a5 5 0 0 1 0 10h-3\" fill=\"none\" stroke-width=\"3\"/>",
	notebook: "<rect x=\"15\" y=\"10\" width=\"22\" height=\"30\" rx=\"2\"/><path d=\"M19 10v30\" stroke-width=\"2\"/><rect x=\"23\" y=\"16\" width=\"10\" height=\"3\" rx=\"1\" class=\"soft\"/>",
	candle: "<rect x=\"17\" y=\"20\" width=\"18\" height=\"20\" rx=\"3\"/><path d=\"M26 19c-3-4 0-7 0-10 2 3 4 5 0 10z\" class=\"soft\"/>"
}, d = [
	{
		id: "mug",
		name: "LowerSoft mug",
		detail: "Segfault · 350 ml",
		price: 28,
		quantity: 2,
		art: "mug",
		tint: "#d6c3a5"
	},
	{
		id: "notebook",
		name: "Field notebook",
		detail: "Memory map grid · A5",
		price: 18,
		quantity: 1,
		art: "notebook",
		tint: "#9fb4a6"
	},
	{
		id: "candle",
		name: "Release candle",
		detail: "Clean build · 200 g",
		price: 32,
		quantity: 1,
		art: "candle",
		tint: "#c9a49a"
	}
], f = {
	WELCOME10: {
		label: "10% off",
		percent: 10
	},
	SAVE5: {
		label: "$5 off",
		amount: 5
	}
}, p = 9, m = .08, h = class extends e {
	static styles = [a, l];
	static props = {
		items: {
			type: Object,
			default: d
		},
		currency: { default: "USD" },
		express: { type: Boolean },
		promo: { default: "" }
	};
	render() {
		return "<p class=\"heading\">Order summary</p>\n<ul class=\"items\"></ul>\n<div class=\"delivery\"><lw-switch class=\"express\" size=\"sm\">Express delivery</lw-switch><span class=\"arrives\"></span></div>\n<div class=\"promo\"><button class=\"add-promo\" type=\"button\">Add promo code</button><form class=\"promo-form\" hidden><input class=\"code\" type=\"text\" placeholder=\"Promo code\" aria-label=\"Promo code\" autocomplete=\"off\" spellcheck=\"false\"><button class=\"apply\" type=\"submit\">Apply</button></form><p class=\"promo-note\" aria-live=\"polite\"></p></div>\n<dl class=\"totals\"><div><dt>Subtotal</dt><dd class=\"subtotal\"></dd></div><div><dt>Shipping</dt><dd class=\"shipping\"></dd></div><div class=\"discount-row\" hidden><dt class=\"discount-label\"></dt><dd class=\"discount\"></dd></div><div><dt>Tax</dt><dd class=\"tax\"></dd></div><div class=\"total-row\"><dt>Total</dt><dd class=\"total\"></dd></div></dl>\n<lw-pay-button class=\"pay\"></lw-pay-button>";
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".items").addEventListener("click", (e) => this.#o(e), e), this.query(".express").addEventListener("change", (e) => {
			this.express = e.target.checked, this.#a();
		}, e), this.query(".add-promo").addEventListener("click", () => this.#s(), e), this.query(".promo-form").addEventListener("submit", (e) => {
			e.preventDefault(), this.#c();
		}, e);
	}
	updated(e) {
		e.has("items") && this.#n(), this.query(".express").checked = !!this.express, this.#r();
	}
	get #e() {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: this.currency
		});
	}
	get #t() {
		let e = this.items.reduce((e, { price: t, quantity: n }) => e + t * n, 0), t = f[this.promo], n = t ? t.percent ? e * t.percent / 100 : Math.min(t.amount, e) : 0, r = this.express ? p : 0, i = Math.round((e - n) * m * 100) / 100;
		return {
			subtotal: e,
			discount: n,
			shipping: r,
			tax: i,
			total: e - n + r + i
		};
	}
	#n() {
		this.query(".items").innerHTML = this.items.map((e) => `<li data-id="${n(e.id)}"><span class="tile" style="--_tint: ${n(e.tint ?? "#d4d4d8")}" aria-hidden="true"><svg viewBox="0 0 52 52">${u[e.art] ?? u.mug}</svg></span><span class="what"><span class="name">${n(e.name)}</span><span class="detail">${n(e.detail ?? "")}</span></span><span class="stepper"><button class="less" type="button" aria-label="One less ${n(e.name)}">${r(s, 14)}</button><span class="qty" aria-live="polite"></span><button class="more" type="button" aria-label="One more ${n(e.name)}">${r(c, 14)}</button></span><span class="line rolling"></span></li>`).join("");
	}
	#r() {
		let e = this.#e, t = this.#t;
		for (let t of this.shadowRoot.querySelectorAll(".items li")) {
			let n = this.items.find(({ id: e }) => e === t.dataset.id);
			t.querySelector(".qty").textContent = String(n.quantity), t.querySelector(".less").disabled = n.quantity <= 1, o(t.querySelector(".line"), e.format(n.price * n.quantity));
		}
		this.query(".arrives").textContent = this.express ? "Arrives tomorrow" : "Free · arrives Thu";
		for (let n of [
			"subtotal",
			"tax",
			"total"
		]) this.#i(this.query(`.${n}`), e.format(t[n]));
		this.#i(this.query(".shipping"), t.shipping ? e.format(t.shipping) : "Free");
		let n = f[this.promo];
		this.query(".discount-row").hidden = !n, n && (this.query(".discount-label").textContent = `${this.promo} · ${n.label}`, this.#i(this.query(".discount"), `−${e.format(t.discount)}`));
		let r = this.query(".pay");
		r.amount = Math.round(t.total * 100) / 100, r.currency = this.currency, r.locale = "en-US";
	}
	#i(e, t) {
		e.classList.add("rolling"), o(e, t);
	}
	#a() {
		this.emit("change", {
			items: this.items,
			express: !!this.express,
			promo: this.promo,
			total: this.#t.total
		});
	}
	#o(e) {
		let t = e.target.closest(".less, .more");
		if (!t) return;
		let n = t.closest("li").dataset.id, r = t.classList.contains("more") ? 1 : -1;
		this.items = this.items.map((e) => e.id === n ? {
			...e,
			quantity: Math.max(1, e.quantity + r)
		} : e), this.#a();
	}
	#s() {
		this.query(".add-promo").hidden = !0;
		let e = this.query(".promo-form");
		e.hidden = !1, i.matches || e.animate([{
			opacity: 0,
			translate: "0 -4px"
		}, {
			opacity: 1,
			translate: "0 0"
		}], {
			duration: 200,
			easing: "ease-out"
		}), this.query(".code").focus();
	}
	#c() {
		let e = this.query(".code"), t = e.value.trim().toUpperCase(), n = this.query(".promo-note");
		f[t] ? (this.promo = t, n.textContent = `${t} applied: ${f[t].label}.`, n.dataset.tone = "ok", this.query(".promo-form").hidden = !0, this.#a()) : (n.textContent = t ? "That code isn't valid." : "Enter a code first.", n.dataset.tone = "error", i.matches || e.animate([
			{ translate: "0" },
			{ translate: "-4px" },
			{ translate: "4px" },
			{ translate: "0" }
		], { duration: 240 }));
	}
};
//#endregion
//#region src/components/order-summary-card/index.js
t("order-summary-card", h);
//#endregion
export { h as t };
