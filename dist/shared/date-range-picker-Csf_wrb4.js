import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./form-QHOiInAj.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { n as a, t as o } from "./rolling-VjfpUD4B.js";
import { n as s, t as c } from "./highlight-BSyGT8bg.js";
import { a as l, c as u, d, f, i as p, l as m, n as h, o as g, p as _, r as v, s as y, t as b, u as x } from "./dates-Cwd3k25x.js";
//#region src/components/date-range-picker/date-range-picker.scss?inline
var S = ":host{--_month:280px;--_gap:2rem;--_row:2.25rem;--_hover:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent);width:820px;max-width:100%;font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block}button{font:inherit;color:inherit;cursor:pointer;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}button:disabled{cursor:not-allowed}.icon{width:1rem;height:1rem}.card{border:1px solid var(--lw-color-border);background:var(--lw-color-background);border-radius:1rem;overflow:hidden;box-shadow:0 1px 2px #0000000a;container-type:inline-size}.body{flex-direction:column;display:flex}.presets{border-bottom:1px solid var(--lw-color-border);flex:none;padding:.625rem .75rem}.presets-title{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);margin:0 0 .5rem;padding:.25rem .625rem 0;font-weight:500;display:none}.preset-list{flex-wrap:wrap;gap:.25rem;display:flex;position:relative}.highlight{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.highlight{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.highlight.visible{opacity:1}.preset{border-radius:var(--lw-radius-md);text-align:left;white-space:nowrap;height:2rem;color:var(--lw-color-muted-foreground);background:0 0;border:0;align-items:center;padding:0 .625rem;transition:color .15s ease-out,background-color .15s ease-out;display:flex;position:relative}.preset:hover{color:var(--lw-color-foreground)}.preset[aria-pressed=true]{background:var(--lw-color-muted);color:var(--lw-color-foreground);font-weight:500}@container (width>=48rem){.body{flex-direction:row}.presets{border-right:1px solid var(--lw-color-border);border-bottom:0;width:11rem;padding:.75rem}.presets-title{display:block}.preset-list{flex-direction:column}.preset{width:100%}}.calendar{flex:1;min-width:0;padding:.75rem 1rem 1rem;position:relative;overflow:hidden}.navs{z-index:1;padding-inline:max(0px, 50% - var(--_month) / 2 - .5rem);pointer-events:none;justify-content:space-between;display:flex;position:absolute;inset:.75rem .75rem auto}.nav{border-radius:var(--lw-radius-md);width:2.25rem;height:2.25rem;color:var(--lw-color-muted-foreground);pointer-events:auto;background:0 0;border:0;place-items:center;padding:0;transition:color .15s ease-out,background-color .15s ease-out;display:grid}.nav:hover:not(:disabled){background:var(--lw-color-muted);color:var(--lw-color-foreground)}.nav:disabled{opacity:.35}.months{justify-content:center;gap:var(--_gap);display:flex}.month{width:var(--_month)}.month:first-child{display:none}@container (width>=42rem){.navs{padding-inline:max(0px, 50% - var(--_month) - var(--_gap) / 2 - .5rem)}.month:first-child{display:block}}.title{height:var(--_row);justify-content:center;align-items:center;margin:0;font-weight:500;display:flex}.weekdays,.week{grid-template-columns:repeat(7,1fr);display:grid}.weekdays [role=columnheader]{height:2rem;font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);place-items:center;display:grid}.week{margin-top:.25rem;position:relative}.band{height:var(--_row);border-radius:var(--lw-radius-full);background:var(--lw-color-muted);pointer-events:none;position:absolute;top:0}.band[data-preview]{background:color-mix(in oklab, var(--lw-color-muted) 60%, transparent)}.band[hidden]{display:none}[role=gridcell]{place-items:center;display:grid;position:relative}.day{width:2.5rem;height:var(--_row);border-radius:var(--lw-radius-full);font-variant-numeric:tabular-nums;background:0 0;border:0;place-items:center;padding:0;transition:background-color .15s ease-out,color .15s ease-out;display:grid;position:relative}.day[hidden]{display:none}.day:hover:not(:disabled,[data-in-range]){background:var(--_hover)}.day:disabled{opacity:.3}.day[aria-current=date]:after{content:\"\";background:currentColor;border-radius:50%;width:3px;height:3px;position:absolute;bottom:.25rem;left:50%;translate:-50%}.day:is([data-start],[data-end]){width:var(--_row);background:var(--lw-color-primary);color:var(--lw-color-primary-foreground);font-weight:500}.hint{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.footer{border-top:1px solid var(--lw-color-border);background:color-mix(in oklab, var(--lw-color-muted) 50%, transparent);flex-direction:column;justify-content:space-between;gap:.75rem;padding:.75rem 1rem;display:flex}.range{align-items:center;gap:.5rem;display:flex}.field{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);background:var(--lw-color-background);flex-direction:column;flex:1;min-width:0;padding:.375rem .75rem;transition:border-color .15s ease-out;display:flex}.field[data-active]{border-color:color-mix(in oklab, var(--lw-color-foreground) 35%, transparent)}.field-label{color:var(--lw-color-muted-foreground);font-size:.6875rem}.field-value{text-overflow:ellipsis;white-space:nowrap;font-variant-numeric:tabular-nums;overflow:hidden}.dash{color:var(--lw-color-muted-foreground)}.count{white-space:nowrap;color:var(--lw-color-muted-foreground);align-items:center;gap:.25em;margin-left:.25rem;display:none}.count[hidden]{display:none}.actions{justify-content:flex-end;gap:.5rem;display:flex}@container (width>=36rem){.footer{flex-direction:row;align-items:center}.field{flex:none;width:10rem}.count{display:inline-flex}}.announce{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", C = 2, w = 42, T = {
	month: "short",
	day: "numeric",
	year: "numeric"
}, E = {
	weekday: "long",
	month: "long",
	day: "numeric",
	year: "numeric"
}, D = {
	duration: 380,
	easing: "cubic-bezier(0.23, 1, 0.32, 1)"
}, O = (e) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${e}"/></svg>`, k = {
	today: {
		label: "Today",
		range: (e) => [e, e]
	},
	week: {
		label: "Last 7 days",
		range: (e) => [b(e, -6), e]
	},
	month: {
		label: "Last 30 days",
		range: (e) => [b(e, -29), e]
	},
	thisMonth: {
		label: "This month",
		range: (e) => [d(e), e]
	},
	lastMonth: {
		label: "Last month",
		range: (e) => [h(e, -1), b(d(e), -1)]
	}
}, A = (e) => `<div class="month"><p class="title" id="title-${e}"></p><div class="grid" role="grid" aria-labelledby="title-${e}" aria-describedby="hint"><div class="weekdays" role="row">${"<span role=\"columnheader\"></span>".repeat(7)}</div>${`<div class="week" role="row"><span class="band" aria-hidden="true"></span>${"<span role=\"gridcell\"><button class=\"day\" type=\"button\" tabindex=\"-1\"></button></span>".repeat(7)}</div>`.repeat(w / 7)}</div></div>`, j = (e, t) => `<div class="field" data-field="${e}"><span class="field-label">${t}</span><span class="field-value"></span></div>`, M = class extends r(e) {
	static styles = [a, S];
	static props = {
		start: { reflect: !0 },
		end: { reflect: !0 },
		min: {},
		max: {},
		locale: { default: "en-US" },
		weekStart: {
			type: Number,
			default: 0
		},
		name: {}
	};
	#e = {
		start: null,
		end: null
	};
	#t = null;
	#n = null;
	#r = null;
	#i = null;
	#a = [];
	#o = null;
	render() {
		return `<div class="card" part="base"><div class="body"><div class="presets"><p class="presets-title" aria-hidden="true">Quick select</p><div class="preset-list" role="toolbar" aria-label="Quick select"><span class="highlight" aria-hidden="true"></span>${Object.entries(k).map(([e, { label: t }]) => `<button class="preset" type="button" data-preset="${e}" aria-pressed="false">${t}</button>`).join("")}</div></div><div class="calendar"><div class="navs"><button class="nav" type="button" data-step="-1" aria-label="Previous months">${O("m15 18-6-6 6-6")}</button><button class="nav" type="button" data-step="1" aria-label="Next months">${O("m9 18 6-6-6-6")}</button></div><div class="months">${Array.from({ length: C }, (e, t) => A(t)).join("")}</div><p class="hint" id="hint">Arrow keys move between days, Page Up and Page Down change the month, Enter picks a date, Escape cancels.</p></div></div><div class="footer"><div class="range">${j("start", "Start")}<span class="dash" aria-hidden="true">–</span>${j("end", "End")}<span class="count"><span class="rolling"></span> <span class="unit"></span></span></div><div class="actions"><lw-button class="clear" variant="ghost">Clear</lw-button><lw-button class="apply">Apply</lw-button></div></div><p class="announce" aria-live="polite"></p></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.#a = [...this.shadowRoot.querySelectorAll(".day")];
		let t = this.query(".calendar");
		t.addEventListener("click", (e) => this.#w(e), e), t.addEventListener("keydown", (e) => this.#E(e), e), t.addEventListener("focusin", (e) => e.target.dataset.date && (this.#n = e.target.dataset.date), e), t.addEventListener("pointerover", (e) => this.#y(e.target.closest(".day")?.dataset.date ?? null), e), t.addEventListener("pointerleave", () => this.#y(null), e);
		let n = this.query(".preset-list"), r = n.querySelector(".highlight");
		n.addEventListener("click", (e) => this.#x(e.target.closest(".preset")?.dataset.preset), e), n.addEventListener("pointerover", (e) => s(r, e.target.closest(".preset")), e), n.addEventListener("pointerleave", () => c(r), e), n.addEventListener("focusin", (e) => e.target.matches(":focus-visible") && s(r, e.target), e), n.addEventListener("focusout", () => c(r), e);
		let i = this.query(".clear"), a = this.query(".apply");
		i.addEventListener("click", () => !i.disabled && this.#v(null, null), e), a.addEventListener("click", () => !a.disabled && this.#S(), e);
		let o = new ResizeObserver(() => this.#t && this.#m());
		o.observe(this.query(".months")), this.signal.addEventListener("abort", () => o.disconnect());
	}
	updated(e) {
		let t = u(this.start), r = u(this.end);
		this.#i ??= {
			start: t,
			end: r
		}, (e.has("start") || e.has("end")) && (this.#e = t && r ? {
			start: y(t, r),
			end: g(t, r)
		} : {
			start: null,
			end: null
		}, this.#t && this.#e.end && this.#d(this.#e.end)), this.#t ??= h(this.#e.end ?? f(), -1), this.#n ??= this.#e.start ?? this.#c(f()), (e.has("locale") || e.has("weekStart")) && this.#p(), this.#m(), this[n].setFormValue(this.name && t && r ? `${t}/${r}` : null);
	}
	formResetCallback() {
		this.start = this.#i?.start ?? null, this.end = this.#i?.end ?? null;
	}
	get #s() {
		return {
			start: u(this.start),
			end: u(this.end)
		};
	}
	#c(e) {
		let t = u(this.min), n = u(this.max);
		return t && e < t ? t : n && e > n ? n : e;
	}
	get #l() {
		let e = [...this.query(".months").querySelectorAll(".month")].map((e, t) => e.getClientRects().length ? t : -1).filter((e) => e >= 0);
		return e.length ? [e[0], e.at(-1)] : [0, 1];
	}
	#u(e) {
		let [t, n] = this.#l;
		return e >= h(this.#t, t) && e <= p(h(this.#t, n));
	}
	#d(e) {
		if (this.#u(e)) return;
		let [t, n] = this.#l;
		this.#f(e < h(this.#t, t) ? h(e, -t) : h(e, -n));
	}
	#f(e) {
		let t = this.#t;
		if (this.#t = e, i.matches || !t || e === t) return;
		let n = this.query(".months");
		this.#o?.remove(), n.getAnimations().forEach((e) => e.cancel());
		let r = n.cloneNode(!0);
		r.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id")), Object.assign(r, {
			inert: !0,
			ariaHidden: "true"
		}), Object.assign(r.style, {
			position: "absolute",
			top: `${n.offsetTop}px`,
			left: `${n.offsetLeft}px`,
			width: `${n.offsetWidth}px`
		}), n.after(r), this.#o = r;
		let a = (e > t ? 1 : -1) * (n.offsetWidth + 32);
		r.animate({
			translate: ["0 0", `${-a}px 0`],
			opacity: [1, 0]
		}, D).onfinish = () => {
			r.remove(), this.#o === r && (this.#o = null);
		}, n.animate({
			translate: [`${a}px 0`, "0 0"],
			opacity: [0, 1]
		}, D);
	}
	#p() {
		this.query(".months").querySelectorAll(".weekdays").forEach((e) => [...e.children].forEach((e, t) => {
			let n = b("2023-01-01", (t + this.weekStart) % 7);
			e.textContent = l(n, this.locale, { weekday: "short" }).slice(0, 2), e.ariaLabel = l(n, this.locale, { weekday: "long" });
		}));
	}
	#m() {
		let e = u(this.min), t = u(this.max);
		this.query(".months").querySelectorAll(".month").forEach((n, r) => {
			let i = h(this.#t, r);
			n.querySelector(".title").textContent = l(i, this.locale, {
				month: "long",
				year: "numeric"
			});
			let a = (_(i) - this.weekStart + 7) % 7;
			this.#a.slice(r * w, (r + 1) * w).forEach((n, r) => {
				let o = b(i, r - a), s = m(o, i);
				n.hidden = !s, n.dataset.date = s ? o : "", s && (n.textContent = Number(o.slice(8)), n.ariaLabel = l(o, this.locale, E), n.disabled = !!(e && o < e || t && o > t), n.ariaCurrent = o === f() ? "date" : null);
			});
		});
		let [n, r] = this.#l;
		this.query("[data-step=\"-1\"]").disabled = !!(e && h(this.#t, n) <= e), this.query("[data-step=\"1\"]").disabled = !!(t && p(h(this.#t, r)) >= t), this.#h();
	}
	#h() {
		let { start: e, end: t } = this.#e, n = t ?? (e && this.#r) ?? e, [r, i] = e ? [y(e, n), g(e, n)] : [null, null], a = this.#u(this.#n) ? this.#n : this.#a.find((e) => e.dataset.date && !e.disabled && this.#u(e.dataset.date))?.dataset.date;
		for (let n of this.#a) {
			let o = n.dataset.date, s = !!(o && r && o >= r && o <= i);
			n.toggleAttribute("data-start", !!o && o === r), n.toggleAttribute("data-end", !!o && o === i), n.toggleAttribute("data-in-range", s), n.parentElement.ariaSelected = o ? String(s && !!(t || o === e)) : null, n.tabIndex = o && o === a ? 0 : -1;
		}
		for (let n of this.query(".months").querySelectorAll(".week")) {
			let r = [...n.querySelectorAll(".day")].map((e, t) => e.hasAttribute("data-in-range") ? t : -1).filter((e) => e >= 0), i = n.querySelector(".band");
			i.hidden = r.length < 2, i.toggleAttribute("data-preview", !(!e || t)), !(r.length < 2) && (i.style.left = `calc(${r[0]} * 100% / 7)`, i.style.width = `calc(${r.at(-1) - r[0] + 1} * 100% / 7)`);
		}
		this.#g();
	}
	#g() {
		let { start: e, end: t } = this.#e;
		for (let [n, r] of Object.entries({
			start: e,
			end: t
		})) {
			let e = this.query(`[data-field="${n}"]`);
			e.querySelector(".field-value").textContent = r ? l(r, this.locale, T) : "—";
		}
		this.query("[data-field=\"start\"]").toggleAttribute("data-active", !e || !!t), this.query("[data-field=\"end\"]").toggleAttribute("data-active", !(!e || t));
		let n = this.query(".count"), r = e && t ? v(e, t) : 0;
		n.hidden = !r, r && (o(n.querySelector(".rolling"), String(r)), n.querySelector(".unit").textContent = r === 1 ? "day" : "days");
		let i = this.#s, a = !!(e && t) || !e && !t, s = e !== i.start || t !== i.end;
		this.query(".apply").disabled = !a || !s, this.query(".clear").disabled = !e;
		let c = this.#c(f());
		this.shadowRoot.querySelectorAll(".preset").forEach((n) => {
			let [r, i] = k[n.dataset.preset].range(c).map((e) => this.#c(e));
			n.ariaPressed = String(r === e && i === t);
		});
	}
	#_(e) {
		this.query(".announce").textContent = e;
	}
	#v(e, t) {
		this.#e = {
			start: e,
			end: t
		}, this.#r = null, this.#h();
	}
	#y(e) {
		e !== this.#r && (this.#r = e, this.#e.start && !this.#e.end && this.#h());
	}
	#b(e) {
		let { start: t, end: n } = this.#e;
		if (this.#n = e, !t || n) {
			this.#v(e, null), this.#_(`Start ${l(e, this.locale, T)}. Pick an end date.`);
			return;
		}
		let [r, i] = [y(t, e), g(t, e)];
		this.#v(r, i);
		let a = v(r, i);
		this.#_(`${l(r, this.locale, T)} to ${l(i, this.locale, T)}, ${a} ${a === 1 ? "day" : "days"}.`);
	}
	#x(e) {
		if (!e) return;
		let [t, n] = k[e].range(this.#c(f())).map((e) => this.#c(e));
		this.#n = n, this.#v(t, n), this.#d(n), this.#m();
	}
	#S() {
		let { start: e, end: t } = this.#e;
		this.start = e, this.end = t, this.emit("change", {
			start: e,
			end: t
		});
	}
	#C() {
		let { start: e, end: t } = this.#s;
		(this.#e.start !== e || this.#e.end !== t) && (this.#v(e, t), this.emit("cancel"), this.#_("Changes cancelled."));
	}
	#w(e) {
		let t = e.target.closest(".nav");
		if (t) {
			let [e, n] = this.#l, r = Number(t.dataset.step) * (n - e + 1);
			this.#f(h(this.#t, r)), this.#n = this.#c(x(this.#n, r)), this.#m();
			return;
		}
		let n = e.target.closest(".day")?.dataset.date;
		n && this.#b(n);
	}
	#T(e) {
		let t = this.#c(e);
		this.#n = t, this.#e.start && !this.#e.end && (this.#r = t), this.#d(t), this.#m(), this.#a.find((e) => e.dataset.date === t)?.focus();
	}
	#E(e) {
		if (e.key === "Escape") {
			e.preventDefault(), this.#C();
			return;
		}
		let t = e.target.closest(".day")?.dataset.date;
		if (!t) return;
		let n = (_(t) - this.weekStart + 7) % 7, r = {
			ArrowLeft: () => b(t, -1),
			ArrowRight: () => b(t, 1),
			ArrowUp: () => b(t, -7),
			ArrowDown: () => b(t, 7),
			PageUp: () => x(t, -1),
			PageDown: () => x(t, 1),
			Home: () => b(t, -n),
			End: () => b(t, 6 - n)
		};
		e.key in r && (e.preventDefault(), this.#T(r[e.key]()));
	}
};
//#endregion
//#region src/components/date-range-picker/index.js
t("date-range-picker", M);
//#endregion
export { M as t };
