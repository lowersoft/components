import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./form-QHOiInAj.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { n as a, t as o } from "./highlight-BSyGT8bg.js";
import { t as s } from "./field-DZ1QAD5P.js";
//#region src/components/address-input/addresses.js
var c = [
	"street",
	"apt",
	"city",
	"region",
	"postal",
	"country"
], l = "https://photon.komoot.io/api/", u = 6, d = /* @__PURE__ */ new Set([
	"US",
	"CA",
	"GB",
	"IE",
	"AU",
	"NZ",
	"FR",
	"IN",
	"ZA",
	"SG",
	"MY",
	"PH",
	"LU"
]), f = ({ city: e, region: t, postal: n, country: r }) => [
	e,
	[t, n].filter(Boolean).join(" "),
	r
].filter(Boolean).join(", "), p = ({ housenumber: e, street: t, name: n, city: r, town: i, district: a, locality: o, county: s, state: c, postcode: l, country: u, countrycode: f }, p) => {
	let m = f?.toUpperCase(), h = t ?? n ?? "";
	return e && t && (h = d.has(m) ? `${e} ${t}` : `${t} ${e}`), {
		street: h,
		apt: "",
		city: r ?? i ?? a ?? o ?? s ?? "",
		region: c && c !== r ? c : "",
		postal: l ?? "",
		country: m && p.of(m) || u || ""
	};
}, m = async (e, { signal: t, lang: n = "en" } = {}) => {
	let r = new URL(l);
	r.searchParams.set("q", e), r.searchParams.set("limit", "12"), r.searchParams.set("lang", "default");
	for (let e of ["house", "street"]) r.searchParams.append("layer", e);
	let i = await fetch(r, { signal: t });
	if (!i.ok) throw Error(`Address search failed: ${i.status}`);
	let { features: a = [] } = await i.json(), o;
	try {
		o = new Intl.DisplayNames([n, "en"], { type: "region" });
	} catch {
		o = new Intl.DisplayNames(["en"], { type: "region" });
	}
	let s = /* @__PURE__ */ new Set();
	return a.map(({ properties: e }) => p(e, o)).filter((e) => {
		let t = `${e.street}|${f(e)}`;
		return !e.street || s.has(t) ? !1 : (s.add(t), !0);
	}).slice(0, u);
}, h = (e) => e.normalize("NFKD").replace(/\p{M}/gu, "").toLocaleLowerCase("en"), g = (e) => h(e).split(/[\s,]+/).filter(Boolean), _ = (e, t) => {
	let n = [], r = e.indexOf(t);
	for (; r !== -1;) (r === 0 || !/[\p{L}\p{N}]/u.test(e[r - 1])) && n.push(r), r = e.indexOf(t, r + 1);
	return n;
}, v = (e, t) => {
	let n = h(e);
	if (n.length !== e.length) return [document.createTextNode(e)];
	let r = Array(e.length).fill(!1);
	for (let e of g(t)) for (let t of _(n, e)) r.fill(!0, t, t + e.length);
	let i = [], a = 0;
	for (let t = 1; t <= e.length; t++) {
		if (t < e.length && r[t] === r[a]) continue;
		let n = e.slice(a, t);
		i.push(r[a] ? Object.assign(document.createElement("mark"), { textContent: n }) : document.createTextNode(n)), a = t;
	}
	return i;
}, y = ":host{width:440px}.icon{width:1rem;height:1rem;color:var(--lw-color-muted-foreground);flex:none}.finder{position:relative}.finder[hidden]{display:none}.field{align-items:center;gap:.5rem;height:2.5rem;padding:0 .75rem;display:flex}.control{flex:1;height:100%}.listbox{top:2.875rem;z-index:10;border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-lg);background:var(--lw-color-background);max-height:18rem;box-shadow:var(--lw-shadow-md);overflow-anchor:none;margin:0;padding:.25rem;list-style:none;position:absolute;inset-inline:0;overflow-y:auto}.listbox[hidden]{display:none}@media (prefers-reduced-motion:no-preference){.listbox{animation:drop .16s var(--lw-ease-out)}}@keyframes drop{0%{opacity:0;translate:0 -4px}}.highlight{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.highlight{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.highlight.visible{opacity:1}[role=option]{border-radius:var(--lw-radius-md);cursor:pointer;align-items:flex-start;gap:.625rem;padding:.5rem .625rem;display:flex;position:relative}[role=option] .icon{margin-top:.125rem}.option-text{gap:.125rem;min-width:0;display:grid}.option-street{color:var(--lw-color-muted-foreground)}.option-place{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}mark{color:var(--lw-color-foreground);background:0 0;font-weight:600}.credit{border-top:1px solid var(--lw-color-border);color:var(--lw-color-muted-foreground);margin-top:.25rem;padding:.375rem .625rem .125rem;font-size:.6875rem}.empty{font-size:var(--lw-text-xs);text-align:center;color:var(--lw-color-muted-foreground);padding:.75rem}.link{font:inherit;font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);text-decoration:underline;-webkit-text-decoration-color:color-mix(in oklab, currentcolor 40%, transparent);text-decoration-color:color-mix(in oklab, currentcolor 40%, transparent);text-underline-offset:3px;cursor:pointer;background:0 0;border:0;padding:0}.link:hover:not(:disabled){color:var(--lw-color-foreground)}.link:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;border-radius:2px}.link:disabled{cursor:not-allowed;opacity:.5}.manual{margin-top:.5rem}.lines[hidden]{display:none}.lines-head{justify-content:space-between;align-items:baseline;margin-bottom:.75rem;display:flex}.lines-title{font-weight:500}.grid{grid-template-columns:1fr 1fr;gap:.875rem .75rem;display:grid}.line{width:100%}.line.wide{grid-column:1/-1}:host([data-unfolded])>.label{display:none}.announce{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", b = 300, x = 3, S = "cubic-bezier(0.23, 1, 0.32, 1)", C = {
	street: {
		label: "Street address",
		autocomplete: "address-line1",
		wide: !0
	},
	apt: {
		label: "Apt, suite, floor",
		autocomplete: "address-line2",
		wide: !0,
		optional: !0
	},
	city: {
		label: "City",
		autocomplete: "address-level2"
	},
	region: {
		label: "State / region",
		autocomplete: "address-level1",
		optional: !0
	},
	postal: {
		label: "Postal code",
		autocomplete: "postal-code"
	},
	country: {
		label: "Country",
		autocomplete: "country-name"
	}
}, w = "<svg class=\"icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" aria-hidden=\"true\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg>", T = "<svg class=\"icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z\"/><circle cx=\"12\" cy=\"9.5\" r=\"2.5\"/></svg>", E = class extends r(e) {
	static styles = [s, y];
	static props = {
		label: { default: "Shipping address" },
		placeholder: { default: "Start typing your address" },
		name: {},
		required: {
			type: Boolean,
			reflect: !0
		},
		disabled: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = [];
	#t = -1;
	#n = 0;
	#r = null;
	#i = !1;
	#a = !1;
	#o = null;
	render() {
		return `<label class="label" for="search" part="label"></label><div class="finder"><div class="field" part="field">${w}<input id="search" class="control" type="text" role="combobox" autocomplete="off" aria-autocomplete="list" aria-expanded="false" aria-controls="listbox"></div><ul class="listbox" id="listbox" role="listbox" part="listbox" hidden><li class="highlight" role="presentation" aria-hidden="true"></li></ul><button class="manual link" type="button">Enter it manually</button></div><div class="lines" hidden><div class="lines-head"><span class="lines-title"></span><button class="again link" type="button">Search again</button></div><div class="grid">${c.map((e) => {
			let { label: t, autocomplete: n, wide: r, optional: i } = C[e];
			return `<lw-text-input class="line${r ? " wide" : ""}" data-part="${e}" label="${t}${i ? " (optional)" : ""}" autocomplete="shipping ${n}"></lw-text-input>`;
		}).join("")}</div></div><p class="announce" aria-live="polite"></p>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query("#search");
		t.addEventListener("input", () => this.#l(), e), t.addEventListener("keydown", (e) => this.#m(e), e), t.addEventListener("blur", () => setTimeout(() => this.#f(), 120), e), this.query(".listbox").addEventListener("pointerdown", (e) => e.preventDefault(), e), this.query(".listbox").addEventListener("click", (e) => this.#h(Number(e.target.closest("[role=\"option\"]")?.dataset.index)), e), this.query(".listbox").addEventListener("pointermove", (e) => {
			let t = e.target.closest("[role=\"option\"]");
			t && Number(t.dataset.index) !== this.#t && this.#p(Number(t.dataset.index), !1);
		}, e), this.query(".manual").addEventListener("click", () => this.#g(null), e), this.query(".again").addEventListener("click", () => this.#_(), e), this.query(".grid").addEventListener("input", () => this.#v(), e), this.signal.addEventListener("abort", () => {
			clearTimeout(this.#n), this.#r?.abort();
		});
	}
	updated(e) {
		if (e.has("label") && (this.query(".label").textContent = this.label ?? "", this.query(".lines-title").textContent = this.label ?? ""), e.has("placeholder") && (this.query("#search").placeholder = this.placeholder ?? ""), this.#o) {
			let e = this.#o;
			this.#o = null, this.value = e;
		}
		this.#s(), this.#y();
	}
	formResetCallback() {
		this.#_(!1), this.query("#search").value = "";
		for (let e of this.#c) e.value = "";
		this.#y();
	}
	formDisabledCallback(e) {
		this.#a = e, this.#s();
	}
	get value() {
		return Object.fromEntries(this.#c.map((e) => [e.dataset.part, (e.value ?? "").trim()]));
	}
	set value(e) {
		if (this.#c.length === 0) this.#o = e;
		else {
			for (let t of this.#c) t.value = e?.[t.dataset.part] ?? "";
			e && this.#g(e, !1), this.#y();
		}
	}
	#s() {
		let e = !!(this.disabled || this.#a);
		this.query("#search").disabled = e;
		for (let t of this.shadowRoot.querySelectorAll(".link")) t.disabled = e;
		for (let t of this.#c) t.disabled = e, t.required = !!this.required && !C[t.dataset.part].optional;
	}
	get #c() {
		return [...this.shadowRoot.querySelectorAll(".line")];
	}
	#l() {
		clearTimeout(this.#n), this.#r?.abort();
		let e = this.query("#search").value.trim();
		e.length < x ? this.#d([]) : this.#n = setTimeout(() => this.#u(e), b);
	}
	async #u(e) {
		let t = new AbortController();
		this.#r = t;
		try {
			let n = this.closest("[lang]")?.lang || navigator.language || "en", r = await (this.search ?? m)(e, {
				signal: t.signal,
				lang: n
			});
			t.signal.aborted || this.#d(r, e);
		} catch {
			t.signal.aborted || this.#d([], e, !0);
		}
	}
	#d(e, t = "", n = !1) {
		this.#e = e, this.#t = -1;
		let r = this.query(".listbox"), i = this.query("#search"), a = e.map((e, n) => {
			let r = Object.assign(document.createElement("li"), {
				id: `option-${n}`,
				role: "option"
			});
			r.dataset.index = n, r.ariaSelected = "false";
			let i = Object.assign(document.createElement("span"), { className: "option-text" }), a = Object.assign(document.createElement("span"), { className: "option-street" }), o = Object.assign(document.createElement("span"), { className: "option-place" });
			return a.append(...v(e.street, t)), o.append(...v(f(e), t)), i.append(a, o), r.insertAdjacentHTML("afterbegin", T), r.append(i), r;
		});
		if (t && e.length === 0) {
			let e = n ? "Couldn’t search right now. Enter it manually below." : "No matches. Enter it manually below.";
			a.push(Object.assign(document.createElement("li"), {
				className: "empty",
				textContent: e
			}));
		}
		if (e.length && !this.search) {
			let e = Object.assign(document.createElement("li"), {
				className: "credit",
				role: "presentation",
				textContent: "Search by Photon · © OpenStreetMap contributors"
			});
			a.push(e);
		}
		let s = r.querySelector(".highlight");
		o(s), r.replaceChildren(s, ...a);
		let c = a.length > 0;
		r.hidden = !c, i.ariaExpanded = String(c), i.removeAttribute("aria-activedescendant"), t && (this.query(".announce").textContent = e.length ? `${e.length} ${e.length === 1 ? "address" : "addresses"} found.` : "No addresses found.");
	}
	#f() {
		this.query(".listbox").hidden = !0, this.query("#search").ariaExpanded = "false", this.query("#search").removeAttribute("aria-activedescendant"), o(this.query(".listbox .highlight")), this.#t = -1;
	}
	#p(e, t = !0) {
		let n = [...this.shadowRoot.querySelectorAll("[role=\"option\"]")];
		if (n.length === 0) return;
		this.#t = (e + n.length) % n.length, n.forEach((e, t) => e.ariaSelected = String(t === this.#t));
		let r = n[this.#t];
		a(this.query(".listbox .highlight"), r), t && r.scrollIntoView({ block: "nearest" }), this.query("#search").setAttribute("aria-activedescendant", r.id);
	}
	#m(e) {
		let t = !this.query(".listbox").hidden;
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			if (!t || this.#e.length === 0) return;
			e.preventDefault(), this.#p(this.#t + (e.key === "ArrowDown" ? 1 : -1));
		} else e.key === "Enter" && t && this.#t >= 0 ? (e.preventDefault(), this.#h(this.#t)) : e.key === "Escape" && t && (e.preventDefault(), this.#f());
	}
	#h(e) {
		let t = this.#e[e];
		t && (this.#f(), this.#g(t), this.#v());
	}
	#g(e, t = !0) {
		if (e) for (let t of this.#c) t.value = e[t.dataset.part] ?? "";
		let n = this.query(".finder"), r = this.query(".lines");
		n.hidden = !0, r.hidden = !1, this.#i = !0, this.toggleAttribute("data-unfolded", !0), i.matches || (r.animate({ opacity: [0, 1] }, {
			duration: 200,
			easing: S
		}), this.#c.forEach((e, t) => e.animate({
			opacity: [0, 1],
			translate: ["0 -6px", "0 0"]
		}, {
			duration: 260,
			delay: t * 40,
			easing: S,
			fill: "backwards"
		}))), t && (this.shadowRoot.querySelector(`.line[data-part="${e ? "apt" : "street"}"]`).focus(), this.query(".announce").textContent = e ? "Address filled in. Add an apartment or suite if there is one." : "Enter the address line by line.");
	}
	#_(e = !0) {
		this.query(".finder").hidden = !1, this.query(".lines").hidden = !0, this.#i = !1, this.removeAttribute("data-unfolded"), e && this.query("#search").focus();
	}
	#v() {
		this.#y(), this.emit("change", { address: this.value });
	}
	#y() {
		let e = this.value, t = c.some((t) => e[t]);
		if (this.name && t) {
			let t = new FormData();
			for (let n of c) t.append(`${this.name}-${n}`, e[n]);
			this[n].setFormValue(t);
		} else this[n].setFormValue(null);
		let r = this.required && c.find((t) => !C[t].optional && !e[t]);
		if (!r) {
			this[n].setValidity({});
			return;
		}
		let i = this.#i ? this.shadowRoot.querySelector(`.line[data-part="${r}"]`) : this.query("#search");
		this[n].setValidity({ valueMissing: !0 }, this.#i ? `Enter the ${C[r].label.toLowerCase()}.` : "Find your address or enter it manually.", i);
	}
};
//#endregion
//#region src/components/address-input/index.js
t("address-input", E);
//#endregion
export { E as t };
