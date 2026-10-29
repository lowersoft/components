import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./icons-HWomdoMw.js";
import { t as r } from "./icons-Dv1KN71n.js";
import { n as i, t as a } from "./form-QHOiInAj.js";
import { i as o, n as s, t as c } from "./menu-BCEGADW6.js";
import { r as l, t as u } from "./text-C4ocnqBV.js";
//#region src/components/phone-input/countries.js
var d = {
	US: {
		dial: "1",
		mask: "(###) ###-####",
		mobile: /^[2-9]\d{2}[2-9]\d{6}$/
	},
	CA: {
		dial: "1",
		mask: "(###) ###-####",
		mobile: /^[2-9]\d{2}[2-9]\d{6}$/
	},
	GB: {
		dial: "44",
		mask: "#### ######",
		mobile: /^7\d{9}$/
	},
	TR: {
		dial: "90",
		mask: "### ### ## ##",
		mobile: /^5\d{9}$/
	},
	DE: {
		dial: "49",
		mask: "### ########",
		mobile: /^1[5-7]\d{9}$/
	},
	FR: {
		dial: "33",
		mask: "# ## ## ## ##",
		mobile: /^[67]\d{8}$/
	},
	ES: {
		dial: "34",
		mask: "### ### ###",
		mobile: /^[67]\d{8}$/
	},
	IT: {
		dial: "39",
		mask: "### ### ####",
		mobile: /^3\d{9}$/
	},
	NL: {
		dial: "31",
		mask: "# ## ## ## ##",
		mobile: /^6\d{8}$/
	},
	IN: {
		dial: "91",
		mask: "##### #####",
		mobile: /^[6-9]\d{9}$/
	},
	BR: {
		dial: "55",
		mask: "(##) #####-####",
		mobile: /^\d{2}9\d{8}$/
	},
	JP: {
		dial: "81",
		mask: "##-####-####",
		mobile: /^[789]0\d{8}$/
	},
	AU: {
		dial: "61",
		mask: "### ### ###",
		mobile: /^4\d{8}$/
	},
	MX: {
		dial: "52",
		mask: "## #### ####",
		mobile: /^\d{10}$/
	}
}, f = "AF|Afghanistan|93|9 AL|Albania|355|9 DZ|Algeria|213|9 AD|Andorra|376|6 AO|Angola|244|9 AR|Argentina|54|10\nAM|Armenia|374|8 AU|Australia AT|Austria|43|10 AZ|Azerbaijan|994|9 BS|Bahamas|1242|7 BH|Bahrain|973|8 BD|Bangladesh|880|10\nBB|Barbados|1246|7 BY|Belarus|375|9 BE|Belgium|32|9 BZ|Belize|501|7 BJ|Benin|229|10 BT|Bhutan|975|8 BO|Bolivia|591|8\nBA|Bosnia and Herzegovina|387|8 BW|Botswana|267|8 BR|Brazil BN|Brunei|673|7 BG|Bulgaria|359|9 BF|Burkina Faso|226|8\nBI|Burundi|257|8 KH|Cambodia|855|9 CM|Cameroon|237|9 CA|Canada CV|Cape Verde|238|7 CF|Central African Republic|236|8\nTD|Chad|235|8 CL|Chile|56|9 CN|China|86|11 CO|Colombia|57|10 KM|Comoros|269|7 CG|Congo|242|9 CD|Congo (DRC)|243|9\nCR|Costa Rica|506|8 CI|Côte d’Ivoire|225|10 HR|Croatia|385|9 CU|Cuba|53|8 CY|Cyprus|357|8 CZ|Czechia|420|9 DK|Denmark|45|8\nDJ|Djibouti|253|8 DO|Dominican Republic|1809|7 EC|Ecuador|593|9 EG|Egypt|20|10 SV|El Salvador|503|8\nGQ|Equatorial Guinea|240|9 ER|Eritrea|291|7 EE|Estonia|372|8 SZ|Eswatini|268|8 ET|Ethiopia|251|9 FJ|Fiji|679|7\nFI|Finland|358|9 FR|France GA|Gabon|241|8 GM|Gambia|220|7 GE|Georgia|995|9 DE|Germany GH|Ghana|233|9 GR|Greece|30|10\nGT|Guatemala|502|8 GN|Guinea|224|9 GW|Guinea-Bissau|245|9 GY|Guyana|592|7 HT|Haiti|509|8 HN|Honduras|504|8\nHK|Hong Kong|852|8 HU|Hungary|36|9 IS|Iceland|354|7 IN|India ID|Indonesia|62|10 IR|Iran|98|10 IQ|Iraq|964|10\nIE|Ireland|353|9 IL|Israel|972|9 IT|Italy JM|Jamaica|1876|7 JP|Japan JO|Jordan|962|9 KZ|Kazakhstan|7|10|[67] KE|Kenya|254|9\nKW|Kuwait|965|8 KG|Kyrgyzstan|996|9 LA|Laos|856|10 LV|Latvia|371|8 LB|Lebanon|961|8 LS|Lesotho|266|8 LR|Liberia|231|9\nLY|Libya|218|9 LI|Liechtenstein|423|7 LT|Lithuania|370|8 LU|Luxembourg|352|9 MO|Macao|853|8 MG|Madagascar|261|9\nMW|Malawi|265|9 MY|Malaysia|60|9 MV|Maldives|960|7 ML|Mali|223|8 MT|Malta|356|8 MR|Mauritania|222|8 MU|Mauritius|230|8\nMX|Mexico MD|Moldova|373|8 MC|Monaco|377|8 MN|Mongolia|976|8 ME|Montenegro|382|8 MA|Morocco|212|9 MZ|Mozambique|258|9\nMM|Myanmar|95|9 NA|Namibia|264|9 NP|Nepal|977|10 NL|Netherlands NZ|New Zealand|64|9 NI|Nicaragua|505|8 NE|Niger|227|8\nNG|Nigeria|234|10 KP|North Korea|850|10 MK|North Macedonia|389|8 NO|Norway|47|8 OM|Oman|968|8 PK|Pakistan|92|10\nPS|Palestine|970|9 PA|Panama|507|8 PG|Papua New Guinea|675|8 PY|Paraguay|595|9 PE|Peru|51|9 PH|Philippines|63|10\nPL|Poland|48|9 PT|Portugal|351|9 PR|Puerto Rico|1787|7 QA|Qatar|974|8 RO|Romania|40|9 RU|Russia|7|10 RW|Rwanda|250|9\nSA|Saudi Arabia|966|9 SN|Senegal|221|9 RS|Serbia|381|9 SC|Seychelles|248|7 SL|Sierra Leone|232|8 SG|Singapore|65|8\nSK|Slovakia|421|9 SI|Slovenia|386|8 SO|Somalia|252|9 ZA|South Africa|27|9 KR|South Korea|82|10 SS|South Sudan|211|9\nES|Spain LK|Sri Lanka|94|9 SD|Sudan|249|9 SR|Suriname|597|7 SE|Sweden|46|9 CH|Switzerland|41|9 SY|Syria|963|9\nTW|Taiwan|886|9 TJ|Tajikistan|992|9 TZ|Tanzania|255|9 TH|Thailand|66|9 TG|Togo|228|8 TT|Trinidad and Tobago|1868|7\nTN|Tunisia|216|8 TR|Türkiye TM|Turkmenistan|993|8 UG|Uganda|256|9 UA|Ukraine|380|9 AE|United Arab Emirates|971|9\nGB|United Kingdom US|United States UY|Uruguay|598|8 UZ|Uzbekistan|998|9 VE|Venezuela|58|10 VN|Vietnam|84|9 YE|Yemen|967|9\nZM|Zambia|260|9 ZW|Zimbabwe|263|9", p = {
	6: "### ###",
	7: "### ####",
	8: "#### ####",
	9: "### ### ###",
	10: "### ### ####",
	11: "### #### ####"
}, m = Object.fromEntries(f.split(/\s+(?=[A-Z]{2}\|)/).map((e) => {
	let [t, n, r, i, a] = e.trim().split("|");
	return [t, {
		name: n,
		...d[t] ?? {
			dial: r,
			mask: p[i],
			mobile: null
		},
		lead: a ? RegExp(`^${a}`) : null
	}];
})), h = (e) => String.fromCodePoint(...[...e].map((e) => 127397 + e.charCodeAt(0))), g = (e) => e.replace(/[^#]/g, "").length, _ = (e, t) => {
	let n = "", r = "", i = 0;
	for (let a of e) i < t.length ? n += a === "#" ? t[i++] : a : r += a === "#" ? "0" : a;
	let a = n.replace(/[^\d]+$/, "");
	return {
		typed: a,
		rest: n.slice(a.length) + r
	};
}, v = (e, t) => {
	let n = e.trim().replace(/^00/, "+").replace("(0)", "").replace(/[^\d+]/g, "");
	if (!n.startsWith("+")) return null;
	let r = n.slice(1), i = Object.entries(m).filter(([, { dial: e }]) => r.startsWith(e)).sort(([, e], [, t]) => t.dial.length - e.dial.length);
	if (i.length === 0) return null;
	let a = i[0][1].dial, o = r.slice(a.length), s = i.filter(([, e]) => e.dial === a), c = s.find(([, e]) => e.lead?.test(o)), l = s.filter(([, e]) => !e.lead).map(([e]) => e);
	return {
		code: c?.[0] ?? (l.includes(t) ? t : l.includes("US") ? "US" : l[0] ?? s[0][0]),
		digits: o
	};
}, y = (e) => e.length === 4 && e.startsWith("1") ? `+1 ${e.slice(1)}` : `+${e}`, b = ":host{--_line:color-mix(in oklab, var(--lw-color-foreground) 22%, transparent);width:360px;max-width:100%;font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block}.label{margin-bottom:.5rem;font-weight:500;display:block}.icon{width:1rem;height:1rem}.field{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);background:var(--lw-color-background);align-items:center;height:2.75rem;transition:border-color .15s ease-out,box-shadow .15s ease-out;display:flex}.field:focus-within{border-color:var(--_line);box-shadow:0 0 0 3px color-mix(in oklab, var(--lw-color-ring) 30%, transparent)}:host(:is([data-state=landline],[data-state=unsupported])) .field{border-color:color-mix(in oklab, var(--lw-color-destructive) 60%, transparent)}:host([disabled]) .field{opacity:.5}.picker{align-self:stretch}.country{border:0;border-right:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md) 0 0 var(--lw-radius-md);height:100%;font:inherit;font-variant-numeric:tabular-nums;color:inherit;cursor:pointer;background:0 0;outline:none;align-items:center;gap:.375rem;padding:0 .5rem 0 .75rem;transition:background-color .15s ease-out;display:flex}.country:hover:not(:disabled){background:var(--lw-color-muted)}.country:focus-visible{box-shadow:inset 0 0 0 2px var(--lw-color-ring)}.country .chevron{color:var(--lw-color-muted-foreground)}@media (prefers-reduced-motion:no-preference){.country .chevron{transition:rotate .2s var(--lw-ease-out)}}.country[aria-expanded=true] .chevron{rotate:180deg}.flag{font-size:1.125rem;line-height:1}.control{flex:1;align-self:stretch;min-width:0;margin-left:.75rem;position:relative}.ghost,input{font:inherit;font-variant-numeric:tabular-nums;letter-spacing:.01em}.ghost{white-space:pre;pointer-events:none;align-items:center;display:flex;position:absolute;inset:0;overflow:hidden}.ghost-typed{color:#0000}.ghost-rest{color:var(--lw-color-muted-foreground);opacity:.45}input{width:100%;height:100%;color:inherit;background:0 0;border:0;outline:none;padding:0;position:relative}.ok{color:var(--lw-color-accent);opacity:0;flex:none;place-items:center;margin-right:.75rem;display:grid;scale:.6}@media (prefers-reduced-motion:no-preference){.ok{transition:opacity .15s ease-out, scale .25s var(--lw-ease-spring)}}:host(:is([data-state=mobile],[data-state=sending],[data-state=sent])) .ok{opacity:1;scale:1}.status{min-height:1.25rem;font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);margin:.5rem 0 0;line-height:1.25rem}:host(:is([data-state=mobile],[data-state=sent])) .status{color:var(--lw-color-accent)}:host(:is([data-state=landline],[data-state=unsupported],[data-state=error])) .status{color:var(--lw-color-destructive)}.send{margin-top:.75rem;display:flex}.send::part(button){width:100%}", x = "<svg class=\"icon chevron\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m4.5 6.5 3.5 3.5 3.5-3.5\"/></svg>", S = () => new Promise((e) => setTimeout(e, 900)), C = class extends a(e) {
	static styles = [
		n,
		o,
		b
	];
	static shadowOptions = {
		mode: "open",
		delegatesFocus: !0
	};
	static props = {
		value: { default: "" },
		country: {
			default: "US",
			reflect: !0
		},
		label: { default: "Phone number" },
		unavailable: { default: "" },
		unavailableMessage: { default: "We don’t offer service in this country yet." },
		name: {},
		required: { type: Boolean },
		disabled: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = null;
	#t = "";
	#n = "idle";
	#r = null;
	#i = null;
	#a = !1;
	render() {
		return `<label class="label" for="input"></label><div class="field" part="field"><span class="picker"><button class="country" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="menu"><span class="flag" aria-hidden="true"></span><span class="dial"></span>${x}</button>${c}</span><span class="control"><span class="ghost" aria-hidden="true"><span class="ghost-typed"></span><span class="ghost-rest"></span></span><input id="input" class="number" type="tel" inputmode="tel" autocomplete="tel" aria-describedby="status"></span><span class="ok" aria-hidden="true">${r}</span></div><p class="status" id="status" aria-live="polite"></p><lw-button class="send" disabled>Send code</lw-button>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.#e ??= new s({
			trigger: this.query(".country"),
			menu: this.query(".menu"),
			onPick: (e) => this.#p(e),
			search: "Search countries"
		}), this.#e.connect(this.signal), this.query(".number").addEventListener("input", () => this.#m(), e);
		let t = this.query(".send");
		t.addEventListener("click", () => !t.disabled && this.#g(), e);
	}
	updated(e) {
		if (this.#i ??= {
			value: this.value,
			country: this.country
		}, e.has("label") && (this.query(".label").textContent = this.label), e.has("disabled") && this.#l(), m[this.country] || (this.country = "US"), (e.has("unavailable") || e.has("unavailableMessage")) && this.#d(), e.has("country") && this.#f(), e.has("value") && this.value !== this.#s) {
			let e = v(this.value ?? "", this.country);
			e && (this.country = e.code), this.#h(e?.digits ?? "");
		} else this.#_();
	}
	formResetCallback() {
		this.country = this.#i?.country ?? "US", this.value = this.#i?.value ?? "", this.value || this.#h("");
	}
	formDisabledCallback(e) {
		this.#a = e, this.#l();
	}
	get #o() {
		return m[this.country] ?? m.US;
	}
	get #s() {
		return this.#t ? `+${this.#o.dial}${this.#t}` : "";
	}
	get #c() {
		return `${y(this.#o.dial)} ${_(this.#o.mask, this.#t).typed}`;
	}
	#l() {
		let e = this.disabled || this.#a;
		this.query(".number").disabled = e, this.query(".country").disabled = e;
	}
	get #u() {
		return new Set((this.unavailable ?? "").split(",").map((e) => e.trim().toUpperCase()).filter(Boolean));
	}
	#d() {
		let e = this.#u, t = Object.entries(m).sort(([, e], [, t]) => e.name.localeCompare(t.name, "en")).map(([t, { name: n, dial: r }]) => ({
			value: t,
			label: `${h(t)}  ${n}`,
			description: y(r),
			disabled: e.has(t),
			hint: this.unavailableMessage
		}));
		this.#e.setItems(t), this.#e.setChecked(this.country);
	}
	#f() {
		let { name: e, dial: t } = this.#o;
		this.query(".flag").textContent = h(this.country), this.query(".dial").textContent = y(t), this.query(".country").ariaLabel = `Country: ${e} (${y(t)})`, this.#e?.setChecked(this.country);
	}
	#p(e) {
		this.country = e, this.#f(), this.#h(this.#t), this.query(".number").focus();
	}
	#m() {
		let e = this.query(".number"), t = e.value;
		if (/^\s*(\+|00)/.test(t)) {
			let e = v(t, this.country);
			if (this.#r = null, !e) {
				if (t.replace(/\D/g, "").length < 4) return;
			} else if (this.#u.has(e.code)) {
				this.#r = e.code, this.#n = "unsupported", this.#_();
				return;
			} else {
				this.country = e.code, this.#f(), this.#h(e.digits, !0);
				return;
			}
		}
		let n = u(t, e.selectionStart ?? t.length), r = t.replace(/\D/g, ""), i = r.startsWith("0") && this.country !== "IT" ? 1 : 0;
		r = r.slice(i), this.#h(r, !0, Math.max(0, n - i));
	}
	#h(e, t = !1, n = null) {
		let r = this.#s;
		this.#t = e.slice(0, g(this.#o.mask));
		let i = this.query(".number"), { typed: a } = _(this.#o.mask, this.#t);
		if (i.value !== a && (i.value = a, t && this.shadowRoot.activeElement === i)) {
			let e = n === null ? a.length : l(a, Math.min(n, this.#t.length));
			i.setSelectionRange(e, e);
		}
		let o = this.#t.length === g(this.#o.mask);
		this.#n = this.#t ? o ? this.#o.mobile?.test(this.#t) ?? !0 ? "mobile" : "landline" : "partial" : "idle", this.value = this.#s, this.#_(), t && this.#s !== r && this.emit("change", {
			value: this.#s,
			country: this.country,
			mobile: this.#n === "mobile"
		});
	}
	async #g() {
		let e = this.#s;
		if (this.emit("send", { value: e })) {
			this.#n = "sending", this.#_();
			try {
				await (this.sendCode ?? S)(e), this.#s === e && (this.#n = "sent");
			} catch {
				this.#s === e && (this.#n = "error");
			}
			this.#_();
		}
	}
	#_() {
		let { typed: e, rest: t } = _(this.#o.mask, this.#t);
		this.query(".ghost-typed").textContent = e, this.query(".ghost-rest").textContent = t;
		let n = this.#n;
		this.dataset.state = n;
		let r = {
			idle: "We’ll text you a code to confirm it’s you.",
			partial: "We’ll text you a code to confirm it’s you.",
			mobile: this.#o.mobile ? `Mobile number. We’ll text a code to ${this.#c}.` : `We’ll text a code to ${this.#c}.`,
			landline: "That doesn’t look like a mobile number. Codes go by text.",
			unsupported: `${this.#r ? m[this.#r].name : "That country"}: ${this.unavailableMessage}`,
			sending: `Sending a code to ${this.#c}…`,
			sent: `Code sent to ${this.#c}.`,
			error: "Couldn’t send the code. Try again in a moment."
		};
		this.query(".status").textContent = r[n];
		let a = this.query(".send");
		a.disabled = !["mobile", "error"].includes(n), a.loading = n === "sending", a.textContent = n === "sent" ? "Code sent" : n === "error" ? "Try again" : "Send code";
		let o = [
			"mobile",
			"sending",
			"sent",
			"error"
		].includes(n);
		this[i].setFormValue(this.name && o ? this.#s : null);
		let s = this.query(".number");
		o || n === "idle" && !this.required ? this[i].setValidity({}) : n === "idle" ? this[i].setValidity({ valueMissing: !0 }, "Enter your phone number.", s) : n === "landline" ? this[i].setValidity({ typeMismatch: !0 }, "Enter a mobile number.", s) : this[i].setValidity({ tooShort: !0 }, "The number is incomplete.", s);
	}
};
//#endregion
//#region src/components/phone-input/index.js
t("phone-input", C);
//#endregion
export { C as t };
