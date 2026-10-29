import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./form-QHOiInAj.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { r as a, t as o } from "./text-C4ocnqBV.js";
//#region src/components/card-input/card.js
var s = {
	visa: {
		label: "Visa",
		pattern: /^4/,
		lengths: [
			13,
			16,
			19
		],
		groups: [
			4,
			4,
			4,
			4,
			3
		],
		cvc: 3
	},
	mastercard: {
		label: "Mastercard",
		pattern: /^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/,
		lengths: [16],
		groups: [
			4,
			4,
			4,
			4
		],
		cvc: 3
	},
	amex: {
		label: "American Express",
		pattern: /^3[47]/,
		lengths: [15],
		groups: [
			4,
			6,
			5
		],
		cvc: 4
	},
	discover: {
		label: "Discover",
		pattern: /^(6011|65|64[4-9]|622)/,
		lengths: [16, 19],
		groups: [
			4,
			4,
			4,
			4,
			3
		],
		cvc: 3
	}
}, c = {
	lengths: [16],
	groups: [
		4,
		4,
		4,
		4
	],
	cvc: 3
}, l = (e) => Object.keys(s).find((t) => s[t].pattern.test(e)) ?? null, u = (e) => s[e] ?? c, d = (e) => Math.max(...u(e).lengths), f = (e, t) => {
	let n = [], r = e;
	for (let e of u(t).groups) {
		if (!r) break;
		n.push(r.slice(0, e)), r = r.slice(e);
	}
	return n.join(" ");
}, p = (e) => {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let r = Number(e[e.length - 1 - n]);
		n % 2 == 1 && (r *= 2, r > 9 && (r -= 9)), t += r;
	}
	return e.length > 0 && t % 10 == 0;
}, m = ":host{--_line:color-mix(in oklab, var(--lw-color-foreground) 22%, transparent);--_slide:.32s var(--lw-ease-out);width:400px;max-width:100%;font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block}.label{margin-bottom:.5rem;font-weight:500;display:block}.field{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);background:var(--lw-color-background);align-items:center;gap:.625rem;height:2.75rem;padding:0 .75rem;transition:border-color .15s ease-out,box-shadow .15s ease-out;display:flex;overflow:hidden}.field:focus-within{border-color:var(--_line);box-shadow:0 0 0 3px color-mix(in oklab, var(--lw-color-ring) 30%, transparent)}.field[data-invalid]{border-color:color-mix(in oklab, var(--lw-color-destructive) 60%, transparent)}:host([disabled]) .field{opacity:.5}.brand{width:32px;height:22px;color:var(--lw-color-muted-foreground);border-radius:3px;flex:none;overflow:hidden}.reel{flex-direction:column;display:flex}@media (prefers-reduced-motion:no-preference){.reel{transition:translate .36s var(--lw-ease-spring)}}.mark svg{width:32px;height:22px;display:block}input{width:100%;min-width:0;height:100%;font:inherit;font-variant-numeric:tabular-nums;color:inherit;background:0 0;border:0;outline:none;padding:0}input::placeholder{color:var(--lw-color-muted-foreground);opacity:.7}.number-wrap{flex:1;align-self:stretch;min-width:0;position:relative;overflow:hidden}@media (prefers-reduced-motion:no-preference){.number-wrap{transition:flex var(--_slide)}}[data-compact] .number-wrap{flex:0 0 var(--_last4)}.edit{font:inherit;color:inherit;opacity:0;pointer-events:none;cursor:text;background:0 0;border:0;outline:none;align-items:center;padding:0;display:flex;position:absolute;inset:0}[data-compact] .edit{opacity:1;pointer-events:auto}.edit:focus-visible{box-shadow:inset 0 -2px var(--lw-color-ring);border-radius:2px}[data-compact] .number{opacity:0}.mask{background:var(--lw-color-background);letter-spacing:.1em;color:var(--lw-color-muted-foreground);opacity:0;padding-right:.375rem;position:absolute;top:50%;left:0;translate:-.25rem -50%}@media (prefers-reduced-motion:no-preference){.mask{transition:opacity .2s ease-out, translate var(--_slide)}}[data-compact] .mask{opacity:1;translate:0 -50%}.digits{font-variant-numeric:tabular-nums;white-space:pre}@media (prefers-reduced-motion:no-preference){.digits{transition:translate var(--_slide)}}.digits.probe{visibility:hidden;position:absolute}.rest{opacity:0;flex:none;gap:.75rem;max-width:0;display:flex;translate:1rem}@media (prefers-reduced-motion:no-preference){.rest{transition:max-width var(--_slide), opacity .2s ease-out, translate var(--_slide)}}[data-compact] .rest{opacity:1;max-width:16rem;translate:0}.rest .exp{width:4.5rem}.rest .cvc{width:3rem}.message{min-height:1.25rem;font-size:var(--lw-text-xs);color:var(--lw-color-destructive);margin:.375rem 0 0;line-height:1.25rem}.brand-name{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", h = (e) => `<svg viewBox="0 0 32 22" aria-hidden="true">${e}</svg>`, g = {
	generic: h("<rect x=\"1\" y=\"1\" width=\"30\" height=\"20\" rx=\"3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/><rect x=\"1\" y=\"6\" width=\"30\" height=\"3.5\" fill=\"currentColor\" opacity=\".35\"/><rect x=\"5\" y=\"14\" width=\"8\" height=\"2.5\" rx=\"1\" fill=\"currentColor\" opacity=\".5\"/>"),
	visa: h("<rect width=\"32\" height=\"22\" rx=\"3\" fill=\"#1a1f71\"/><text x=\"16\" y=\"15\" fill=\"#fff\" font-size=\"9\" font-weight=\"800\" font-style=\"italic\" text-anchor=\"middle\" font-family=\"Arial, sans-serif\">VISA</text>"),
	mastercard: h("<rect width=\"32\" height=\"22\" rx=\"3\" fill=\"#252525\"/><circle cx=\"12.5\" cy=\"11\" r=\"6\" fill=\"#eb001b\"/><circle cx=\"19.5\" cy=\"11\" r=\"6\" fill=\"#f79e1b\" fill-opacity=\".9\"/>"),
	amex: h("<rect width=\"32\" height=\"22\" rx=\"3\" fill=\"#2e77bc\"/><text x=\"16\" y=\"14.5\" fill=\"#fff\" font-size=\"7\" font-weight=\"800\" text-anchor=\"middle\" font-family=\"Arial, sans-serif\">AMEX</text>"),
	discover: h("<rect width=\"32\" height=\"22\" rx=\"3\" fill=\"#fff\" stroke=\"#d4d4d8\"/><text x=\"13\" y=\"14\" fill=\"#111\" font-size=\"6\" font-weight=\"700\" text-anchor=\"middle\" font-family=\"Arial, sans-serif\">DISC</text><circle cx=\"25\" cy=\"11\" r=\"3.5\" fill=\"#f58220\"/>")
}, _ = ["generic", ...Object.keys(s)], v = {
	number: "Your card number is invalid.",
	expInvalid: "Your card’s expiration date is invalid.",
	expPast: "Your card’s expiration date is in the past."
}, y = (e) => e.replace(/\D/g, ""), b = class extends r(e) {
	static styles = m;
	static shadowOptions = {
		mode: "open",
		delegatesFocus: !0
	};
	static props = {
		label: { default: "Card" },
		name: {},
		required: { type: Boolean },
		disabled: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = "";
	#t = null;
	#n = !1;
	#r = !1;
	#i = !1;
	render() {
		return `<label class="label" for="number"></label><div class="field" part="field"><span class="brand" aria-hidden="true"><span class="reel">${_.map((e) => `<span class="mark" data-brand="${e}">${g[e]}</span>`).join("")}</span></span><span class="number-wrap"><input id="number" class="number" type="text" inputmode="numeric" autocomplete="cc-number" placeholder="1234 1234 1234 1234" aria-describedby="message brand-name"><button class="edit" type="button" tabindex="-1" aria-label="Edit card number"><span class="digits"></span><span class="mask" aria-hidden="true">••••</span></button></span><span class="rest" inert><input class="exp" type="text" inputmode="numeric" autocomplete="cc-exp" placeholder="MM / YY" aria-label="Expiration date" aria-describedby="message"><input class="cvc" type="text" inputmode="numeric" autocomplete="cc-csc" placeholder="CVC" aria-label="Security code" aria-describedby="message"></span></div><p class="message" id="message" aria-live="polite"></p><span class="brand-name" id="brand-name"></span>`;
	}
	connected() {
		let e = { signal: this.signal }, [t, n, r] = [
			".number",
			".exp",
			".cvc"
		].map((e) => this.query(e));
		t.addEventListener("input", () => this.#l(), e), t.addEventListener("blur", () => this.#f(), e), n.addEventListener("input", () => this.#u(), e), n.addEventListener("blur", () => this.#f(), e), r.addEventListener("input", () => this.#d(), e), n.addEventListener("keydown", (e) => this.#p(e, () => this.#h()), e), r.addEventListener("keydown", (e) => this.#p(e, () => this.#m(n)), e), this.query(".edit").addEventListener("click", () => this.#h(), e);
	}
	updated(e) {
		e.has("label") && (this.query(".label").textContent = this.label), e.has("disabled") && this.#a(), this.#b();
	}
	formResetCallback() {
		for (let e of [
			".number",
			".exp",
			".cvc"
		]) this.query(e).value = "";
		this.#e = "", this.#g(null), this.#_(!1), this.#y(""), this.#b();
	}
	formDisabledCallback(e) {
		this.#i = e, this.#a();
	}
	get value() {
		let e = y(this.query(".exp").value);
		return {
			brand: this.#t,
			number: this.#e,
			expMonth: e.length === 4 ? Number(e.slice(0, 2)) : null,
			expYear: e.length === 4 ? 2e3 + Number(e.slice(2)) : null,
			cvc: this.query(".cvc").value,
			complete: this.#r
		};
	}
	#a() {
		let e = this.disabled || this.#i;
		this.shadowRoot.querySelectorAll("input").forEach((t) => t.disabled = e);
	}
	get #o() {
		let e = this.#e.length;
		return e === (this.#t === "amex" ? 15 : 16) || e === d(this.#t);
	}
	get #s() {
		return this.#o && u(this.#t).lengths.includes(this.#e.length) && p(this.#e);
	}
	get #c() {
		let e = y(this.query(".exp").value);
		if (e.length < 4) return null;
		let t = Number(e.slice(0, 2));
		if (t < 1 || t > 12) return "expInvalid";
		let n = /* @__PURE__ */ new Date(), r = 2e3 + Number(e.slice(2));
		return r < n.getFullYear() || r === n.getFullYear() && t < n.getMonth() + 1 ? "expPast" : null;
	}
	#l() {
		let e = this.query(".number"), t = o(e.value, e.selectionStart ?? e.value.length), n = y(e.value), r = l(n);
		n = n.slice(0, d(r)), this.#e = n, this.#g(r);
		let i = f(n, r);
		if (e.value !== i) {
			e.value = i;
			let r = a(i, Math.min(t, n.length));
			e.setSelectionRange(r, r);
		}
		this.#s ? (this.#y(""), this.#_(!0), this.query(".exp").focus()) : this.#o ? this.#v(v.number) : this.#y(""), this.#b();
	}
	#u() {
		let e = this.query(".exp"), t = y(e.value).slice(0, 4);
		t.length === 1 && Number(t) > 1 && (t = `0${t}`), e.value = t.length > 2 ? `${t.slice(0, 2)} / ${t.slice(2)}` : t;
		let n = this.#c;
		n ? this.#v(v[n]) : this.#y(""), t.length === 4 && !n && this.query(".cvc").focus(), this.#b();
	}
	#d() {
		let e = this.query(".cvc");
		e.value = y(e.value).slice(0, u(this.#t).cvc), this.#b();
	}
	#f() {
		this.#e && !this.#s && this.shadowRoot.activeElement !== this.query(".number") && this.#y(v.number);
	}
	#p(e, t) {
		e.key === "Backspace" && e.target.value === "" && (e.preventDefault(), t());
	}
	#m(e) {
		e.focus(), e.setSelectionRange(e.value.length, e.value.length);
	}
	#h() {
		this.#_(!1), this.#m(this.query(".number"));
	}
	#g(e) {
		e === this.#t && this.query(".reel").style.translate || (this.#t = e, this.query(".reel").style.translate = `0 ${-_.indexOf(e ?? "generic") * 100 / _.length}%`, this.query(".brand-name").textContent = e ? s[e].label : "", this.query(".cvc").placeholder = e === "amex" ? "CID" : "CVC");
	}
	#_(e) {
		if (e === this.#n) return;
		this.#n = e;
		let t = this.query(".field"), n = this.query(".digits"), r = this.query(".number-wrap");
		if (e) {
			n.textContent = this.query(".number").value;
			let e = Object.assign(document.createElement("span"), {
				className: "digits probe",
				textContent: this.#e.slice(-4)
			});
			r.append(e);
			let i = this.query(".mask").offsetWidth + e.offsetWidth;
			e.remove(), t.style.setProperty("--_last4", `${i}px`), n.style.translate = `${i - n.offsetWidth}px 0`;
		} else n.style.translate = "0 0";
		t.toggleAttribute("data-compact", e), this.query(".rest").inert = !e, this.query(".edit").tabIndex = e ? 0 : -1, this.query(".edit").ariaLabel = e ? `Edit card number ending in ${this.#e.slice(-4)}` : "Edit card number";
	}
	#v(e) {
		this.#y(e), !i.matches && this.query(".field").animate({ translate: [
			"0",
			"-4px",
			"4px",
			"-3px",
			"3px",
			"0"
		] }, {
			duration: 300,
			easing: "ease-out"
		});
	}
	#y(e) {
		let t = this.query(".message");
		t.textContent = e, this.query(".field").toggleAttribute("data-invalid", !!e);
	}
	#b() {
		let { cvc: e } = this.value, t = y(this.query(".exp").value), r = this.#s && t.length === 4 && !this.#c && e.length === u(this.#t).cvc;
		if (r !== this.#r && (this.#r = r, this.emit("change", {
			complete: r,
			brand: this.#t,
			last4: r ? this.#e.slice(-4) : null
		})), this.name && r) {
			let e = new FormData(), t = this.value;
			e.append(`${this.name}-number`, t.number), e.append(`${this.name}-exp`, `${String(t.expMonth).padStart(2, "0")}/${t.expYear}`), e.append(`${this.name}-cvc`, t.cvc), this[n].setFormValue(e);
		} else this[n].setFormValue(null);
		let i = !this.#e && !t && !e, a = this.query(".number");
		r || i && !this.required ? this[n].setValidity({}) : i ? this[n].setValidity({ valueMissing: !0 }, "Enter your card details.", a) : this[n].setValidity({ customError: !0 }, this.query(".message").textContent || "Your card details are incomplete.", a);
	}
};
//#endregion
//#region src/components/card-input/index.js
t("card-input", b);
//#endregion
export { b as t };
