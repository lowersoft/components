import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./form-QHOiInAj.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { n as a, t as o } from "./swap-BK53XQML.js";
import { t as s } from "./field-DZ1QAD5P.js";
//#region src/components/natural-date-input/natural-date-input.scss?inline
var c = ":host{width:360px}.icon{width:1rem;height:1rem;color:var(--lw-color-muted-foreground);flex:none}.field{align-items:center;gap:.5rem;height:2.5rem;padding:0 .375rem 0 .75rem;display:flex}:host([data-disabled]) .field{opacity:.6}.control-wrap{flex:1;align-self:stretch;min-width:0;position:relative;overflow:hidden}.control-wrap[hidden]{display:none}.control{width:100%;height:100%;position:relative}.mirror{font:inherit;white-space:pre;color:#0000;pointer-events:none;align-items:center;display:flex;position:absolute;inset:0}.understood{text-decoration:underline;-webkit-text-decoration-color:var(--lw-color-accent);text-decoration-color:var(--lw-color-accent);text-underline-offset:4px;text-decoration-thickness:2px}.chip{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-accent) 14%, transparent);height:1.75rem;color:var(--lw-color-accent);align-items:center;display:inline-flex}.chip[hidden]{display:none}.chip button{height:100%;font:inherit;color:inherit;cursor:pointer;background:0 0;border:0;outline:none;align-items:center;font-weight:500;display:inline-flex}.chip button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;border-radius:var(--lw-radius-full)}.chip-text{padding:0 .25rem 0 .75rem}.chip-clear{padding:0 .5rem 0 .25rem}.chip-clear .icon{color:currentColor;width:.875rem;height:.875rem}.preview{min-height:1.25rem;font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);margin:.5rem 0 0;line-height:1.25rem}.preview[data-found]{color:var(--lw-color-foreground)}", l = [
	"sun",
	"mon",
	"tue",
	"wed",
	"thu",
	"fri",
	"sat"
], u = [
	"jan",
	"feb",
	"mar",
	"apr",
	"may",
	"jun",
	"jul",
	"aug",
	"sep",
	"oct",
	"nov",
	"dec"
], d = {
	a: 1,
	an: 1,
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
	ten: 10,
	eleven: 11,
	twelve: 12
}, f = 17, p = "(mon(?:day)?|tue(?:s(?:day)?)?|wed(?:s|nesday)?|thu(?:r(?:s(?:day)?)?)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?)", m = "(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)", h = "(?:st|nd|rd|th)?", g = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate()), _ = (e, t) => new Date(e.getFullYear(), e.getMonth(), e.getDate() + t), v = (e) => l.indexOf(e.slice(0, 3)), y = (e) => u.indexOf(e.slice(0, 3)), b = (e) => d[e] ?? Number(e), x = (e, t, n) => {
	let r = new Date(e.getFullYear(), t, n);
	return r < g(e) ? new Date(e.getFullYear() + 1, t, n) : r;
}, S = [
	[/\b(?:today|tod)\b/, (e) => e.day = g(e.now)],
	[/\b(?:tomorrow|tmrw?|tmw)\b/, (e) => e.day = _(e.now, 1)],
	[/\btonight\b/, (e) => (e.day = g(e.now), e.time ??= [20, 0])],
	[/\b(?:eod|end of (?:the )?day)\b/, (e) => (e.day ??= g(e.now), e.time = [f, 0])],
	[/\b(?:eow|end of (?:the )?week)\b/, (e) => (e.day = _(e.now, (5 - e.now.getDay() + 7) % 7), e.time = [f, 0])],
	[/\b(?:eom|end of (?:the )?month)\b/, (e) => (e.day = new Date(e.now.getFullYear(), e.now.getMonth() + 1, 0), e.time = [f, 0])],
	[/\bin (\d+|an?|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve) (min(?:ute)?s?|h(?:ou)?rs?|hours?|days?|weeks?|wks?|months?|years?)\b/, (e, [, t, n]) => {
		let r = b(t);
		if (n.startsWith("min") || n.startsWith("h")) {
			let t = new Date(e.now.getTime() + r * (n.startsWith("min") ? 6e4 : 36e5));
			e.day = g(t), e.time = [t.getHours(), t.getMinutes()];
		} else e.day = n.startsWith("day") ? _(e.now, r) : n.startsWith("w") ? _(e.now, r * 7) : n.startsWith("month") ? new Date(e.now.getFullYear(), e.now.getMonth() + r, e.now.getDate()) : new Date(e.now.getFullYear() + r, e.now.getMonth(), e.now.getDate());
	}],
	[/\bnext (week|month|year)\b/, (e, [, t]) => {
		let { now: n } = e;
		e.day = t === "week" ? _(n, (1 - n.getDay() + 7) % 7 || 7) : t === "month" ? new Date(n.getFullYear(), n.getMonth() + 1, 1) : new Date(n.getFullYear() + 1, 0, 1);
	}],
	[RegExp(`\\b(?:(next|this) )?${p}\\b`), (e, [, t, n]) => {
		let r = v(n), { now: i } = e;
		e.day = t === "next" ? _(_(i, (1 - i.getDay() + 7) % 7 || 7), (r - 1 + 7) % 7) : _(i, (r - i.getDay() + 7) % 7 || (t === "this" ? 0 : 7));
	}],
	[RegExp(`\\b${m} (\\d{1,2})${h}\\b`), (e, [, t, n]) => e.day = x(e.now, y(t), Number(n))],
	[RegExp(`\\b(\\d{1,2})${h} (?:of )?${m}\\b`), (e, [, t, n]) => e.day = x(e.now, y(n), Number(t))],
	[/\b(\d{1,2})\/(\d{1,2})\b/, (e, [, t, n]) => e.day = x(e.now, Number(t) - 1, Number(n))],
	[/\b(?:at )?(\d{1,2})(?::(\d{2}))? ?(am|pm|a|p)\b/, (e, [, t, n = "0", r]) => {
		e.time = [Number(t) % 12 + (r.startsWith("p") ? 12 : 0), Number(n)];
	}],
	[/\b(?:at )?([01]?\d|2[0-3]):([0-5]\d)\b/, (e, [, t, n]) => e.time = [Number(t), Number(n)]],
	[/\b(?:at )?(noon|midday)\b/, (e) => e.time = [12, 0]],
	[/\b(?:at )?midnight\b/, (e) => e.time = [0, 0]],
	[/\b(?:in the )?(morning|afternoon|evening)\b/, (e, [, t]) => e.time ??= [{
		morning: 9,
		afternoon: 14,
		evening: 18
	}[t], 0]]
], C = (e, t = /* @__PURE__ */ new Date()) => {
	let n = e.toLowerCase(), r = Array(n.length).fill(!1), i = {
		now: t,
		day: null,
		time: null
	}, a = [];
	for (let [e, t] of S) {
		let o = new RegExp(e.source, "g");
		for (let e of n.matchAll(o)) {
			let n = e.index + (e[0].length - e[0].trimStart().length), o = e.index + e[0].length;
			r.slice(n, o).some(Boolean) || (r.fill(!0, n, o), t(i, e), a.push([n, o]));
		}
	}
	if (!i.day && !i.time) return {
		date: null,
		hasTime: !1,
		parts: []
	};
	let o = i.day ?? g(t), [s, c] = i.time ?? [0, 0];
	return !i.day && i.time && new Date(o.getFullYear(), o.getMonth(), o.getDate(), s, c) <= t && (o = _(o, 1)), {
		date: new Date(o.getFullYear(), o.getMonth(), o.getDate(), s, c),
		hasTime: !!i.time,
		parts: a.sort((e, t) => e[0] - t[0])
	};
}, w = (e) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, T = w("<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M16 3v4M8 3v4M3 10h18\"/>"), E = w("<path d=\"M18 6 6 18M6 6l12 12\"/>"), D = (e) => String(e).padStart(2, "0"), O = 864e5, k = class extends r(e) {
	static styles = [
		s,
		a,
		c
	];
	static shadowOptions = {
		mode: "open",
		delegatesFocus: !0
	};
	static props = {
		value: { default: "" },
		label: { default: "Due date" },
		placeholder: { default: "Try “next fri 3pm”, “in 2 weeks” or “eod”" },
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
	#e = null;
	#t = "";
	#n = !1;
	render() {
		return `<label class="label" for="control" part="label"></label><div class="field" part="field">${T}<span class="control-wrap"><span class="mirror" aria-hidden="true"></span><input id="control" class="control" type="text" autocomplete="off" spellcheck="false" aria-describedby="preview"></span><span class="chip" part="chip" hidden><button class="chip-text" type="button"></button><button class="chip-clear" type="button" aria-label="Clear the date">${E}</button></span></div><p class="preview swap" id="preview" aria-live="polite"></p>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".control");
		t.addEventListener("input", () => this.#l(), e), t.addEventListener("scroll", () => this.#d(), e), t.addEventListener("keydown", (e) => {
			e.key === "Enter" && (e.preventDefault(), this.#f());
		}, e), this.query(".chip-text").addEventListener("click", () => this.#m(), e), this.query(".chip-clear").addEventListener("click", () => this.#h(), e), this.query(".chip").addEventListener("keydown", (e) => {
			(e.key === "Backspace" || e.key === "Delete") && (e.preventDefault(), this.#h());
		}, e);
	}
	updated(e) {
		if (e.has("label") && (this.query(".label").textContent = this.label ?? ""), e.has("placeholder") && (this.query(".control").placeholder = this.placeholder ?? ""), this.#r(), e.has("value") && this.value && this.value !== this.#a(this.#e)) {
			let e = this.#i(this.value);
			e && (this.#e = {
				date: e,
				hasTime: this.value.includes("T"),
				parts: []
			}, this.#p(!0));
		}
		this.#g();
	}
	formResetCallback() {
		this.#h(!1);
	}
	formDisabledCallback(e) {
		this.#n = e, this.#r();
	}
	#r() {
		let e = !!(this.disabled || this.#n);
		for (let t of this.shadowRoot.querySelectorAll("input, button")) t.disabled = e;
		this.toggleAttribute("data-disabled", e);
	}
	#i(e) {
		let t = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(e);
		if (!t) return null;
		let [, n, r, i, a = "0", o = "0"] = t;
		return new Date(Number(n), Number(r) - 1, Number(i), Number(a), Number(o));
	}
	#a(e) {
		if (!e?.date) return "";
		let { date: t, hasTime: n } = e, r = `${t.getFullYear()}-${D(t.getMonth() + 1)}-${D(t.getDate())}`;
		return n ? `${r}T${D(t.getHours())}:${D(t.getMinutes())}` : r;
	}
	get #o() {
		return this.closest("[lang]")?.lang || navigator.language || "en";
	}
	#s({ date: e, hasTime: t }) {
		let n = {
			weekday: "short",
			month: "short",
			day: "numeric"
		};
		return e.getFullYear() !== (/* @__PURE__ */ new Date()).getFullYear() && (n.year = "numeric"), t && Object.assign(n, {
			hour: "numeric",
			minute: "2-digit"
		}), new Intl.DateTimeFormat(this.#o, n).format(e);
	}
	#c(e) {
		let t = Math.round((new Date(e.getFullYear(), e.getMonth(), e.getDate()) - new Date((/* @__PURE__ */ new Date()).toDateString())) / O);
		return new Intl.RelativeTimeFormat(this.#o, { numeric: "auto" }).format(t, "day");
	}
	#l() {
		let e = this.query(".control");
		this.#t = e.value, this.#e = e.value.trim() ? C(e.value) : null, this.#u();
		let t = this.query(".preview");
		e.value.trim() ? this.#e.date ? o(t, `${this.#s(this.#e)} · ${this.#c(this.#e.date)}`) : o(t, "No date yet. Try “tomorrow 9am” or “in 3 days”.") : o(t, ""), t.toggleAttribute("data-found", !!this.#e?.date), this.#g();
	}
	#u() {
		let e = this.query(".mirror"), t = this.query(".control").value, n = [], r = 0;
		for (let [e, i] of this.#e?.parts ?? []) e > r && n.push(document.createTextNode(t.slice(r, e))), n.push(Object.assign(document.createElement("span"), {
			className: "understood",
			textContent: t.slice(e, i)
		})), r = i;
		n.push(document.createTextNode(t.slice(r))), e.replaceChildren(...n), this.#d();
	}
	#d() {
		this.query(".mirror").style.translate = `${-this.query(".control").scrollLeft}px 0`;
	}
	#f() {
		this.#e?.date ? (this.#p(), this.emit("change", {
			value: this.value,
			date: this.#e.date,
			phrase: this.#t
		})) : i.matches || this.query(".field").animate({ translate: [
			"0",
			"-4px",
			"4px",
			"-2px",
			"0"
		] }, {
			duration: 260,
			easing: "ease-out"
		});
	}
	#p(e = !1) {
		this.value = this.#a(this.#e);
		let t = this.query(".chip");
		this.query(".chip-text").textContent = this.#s(this.#e), this.query(".chip-text").ariaLabel = `${this.label}: ${this.#s(this.#e)}. Press to edit.`, this.query(".control-wrap").hidden = !0, t.hidden = !1, this.toggleAttribute("data-chip", !0), o(this.query(".preview"), e ? "" : `Set for ${this.#c(this.#e.date)}.`), e || (this.query(".chip-text").focus(), i.matches || t.animate({
			scale: [.9, 1],
			opacity: [0, 1]
		}, {
			duration: 220,
			easing: "cubic-bezier(0.34, 1.4, 0.64, 1)"
		})), this.#g();
	}
	#m() {
		this.query(".chip").hidden = !0, this.query(".control-wrap").hidden = !1, this.removeAttribute("data-chip");
		let e = this.query(".control");
		e.value = this.#t, e.focus(), e.setSelectionRange(e.value.length, e.value.length), this.#l();
	}
	#h(e = !0) {
		this.#e = null, this.#t = "", this.value = "", this.query(".chip").hidden = !0, this.query(".control-wrap").hidden = !1, this.removeAttribute("data-chip");
		let t = this.query(".control");
		t.value = "", this.#u(), o(this.query(".preview"), ""), e && (t.focus(), this.emit("change", {
			value: "",
			date: null,
			phrase: ""
		})), this.#g();
	}
	#g() {
		let e = this.hasAttribute("data-chip");
		this[n].setFormValue(this.name && e ? this.value : null);
		let t = this.query(".control");
		this.required && !e ? this[n].setValidity({ valueMissing: !0 }, this.#e?.date ? "Press Enter to set the date." : "Enter a due date.", t) : this[n].setValidity({});
	}
};
//#endregion
//#region src/components/natural-date-input/index.js
t("natural-date-input", k);
//#endregion
export { k as t };
