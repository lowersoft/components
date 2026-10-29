import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./form-QHOiInAj.js";
import { n as i, t as a } from "./rolling-VjfpUD4B.js";
//#region src/components/price-range/price-range.scss?inline
var o = ":host{--_thumb:1.25rem;width:360px;max-width:100%;font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);-webkit-user-select:none;user-select:none;display:block}:host([disabled]){opacity:.5}.head{justify-content:space-between;align-items:baseline;margin-bottom:.75rem;display:flex}.label{font-weight:500}.values{font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);gap:.375rem;display:flex}.value{color:var(--lw-color-foreground);font-weight:500}.histogram{height:4rem;padding:0 calc(var(--_thumb) / 2);align-items:flex-end;gap:2px;display:flex}.bar{background:color-mix(in oklab, var(--lw-color-foreground) 12%, transparent);border-radius:2px 2px 0 0;flex:1;transition:background-color .15s ease-out}.bar[data-in]{background:var(--lw-color-foreground)}.track{height:var(--_thumb);margin:0 calc(var(--_thumb) / 2);touch-action:none;cursor:pointer;position:relative}.track:before{content:\"\";border-radius:var(--lw-radius-full);background:var(--lw-color-muted);height:4px;position:absolute;inset:50% 0 auto;translate:0 -50%}:host([disabled]) .track{cursor:not-allowed}.fill{top:50%;left:var(--_from);right:calc(100% - var(--_to));border-radius:var(--lw-radius-full);background:var(--lw-color-foreground);cursor:grab;height:4px;position:absolute;translate:0 -50%}:host([data-drag=window]) .fill{cursor:grabbing}.thumb{top:0;left:var(--_from);z-index:1;width:var(--_thumb);height:var(--_thumb);border:2px solid var(--lw-color-foreground);background:var(--lw-color-background);cursor:grab;border-radius:50%;outline:none;transition:scale .15s ease-out;position:absolute;translate:-50%;box-shadow:0 1px 3px #00000026}.thumb[data-end=to]{left:var(--_to)}.thumb:hover,:host([data-drag=from]) .thumb[data-end=from],:host([data-drag=to]) .thumb[data-end=to]{scale:1.1}:host([data-dragging]) .thumb{cursor:grabbing}.thumb:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.count{font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);align-items:center;gap:.25em;margin:.875rem 0 0;display:flex}.count .rolling{color:var(--lw-color-foreground);font-weight:600}", s = 28, c = Array.from({ length: 320 }, (e, t) => {
	let n = t * .618034 % 1 * .98 + .01;
	return Math.round(Math.exp(Math.log(40) + Math.log(25) * n ** 1.6) / 5) * 5;
}), l = (e, t, n) => Math.min(Math.max(e, t), n), u = class extends r(e) {
	static styles = [i, o];
	static props = {
		prices: {
			type: Object,
			default: c
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 1e3
		},
		step: {
			type: Number,
			default: 10
		},
		from: { type: Number },
		to: { type: Number },
		currency: { default: "USD" },
		label: { default: "Price" },
		name: {},
		disabled: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = null;
	#t = null;
	#n = !1;
	render() {
		return `<div class="head"><span class="label" id="label"></span><span class="values"><span class="value low"></span><span class="dash" aria-hidden="true">–</span><span class="value high"></span></span></div><div class="histogram" part="histogram" aria-hidden="true">${"<span class=\"bar\"></span>".repeat(s)}</div><div class="track" part="track"><span class="fill"></span><span class="thumb" data-end="from" role="slider" tabindex="0" aria-labelledby="label"></span><span class="thumb" data-end="to" role="slider" tabindex="0" aria-labelledby="label"></span></div><p class="count" aria-live="polite"><span class="rolling"></span> <span class="unit"></span></p>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".track");
		t.addEventListener("pointerdown", (e) => this.#m(e), e), t.addEventListener("pointermove", (e) => this.#h(e), e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, () => this.#g(), e);
		for (let t of this.shadowRoot.querySelectorAll(".thumb")) t.addEventListener("keydown", (e) => this.#_(e, t.dataset.end), e);
	}
	updated(e) {
		e.has("label") && (this.query(".label").textContent = this.label ?? ""), this.#t ??= {
			from: this.from,
			to: this.to
		}, (e.has("prices") || e.has("min") || e.has("max")) && this.#c(), this.#l();
	}
	formResetCallback() {
		this.from = this.#t?.from, this.to = this.#t?.to;
	}
	formDisabledCallback(e) {
		this.#n = e, this.#l();
	}
	get #r() {
		return Array.isArray(this.prices) ? this.prices.filter(Number.isFinite) : [];
	}
	get #i() {
		return Math.max(this.max - this.min, 1);
	}
	get #a() {
		let e = l(this.from ?? this.min, this.min, this.max), t = l(this.to ?? this.max, this.min, this.max);
		return [Math.min(e, t), Math.max(e, t)];
	}
	#o(e) {
		let t = this.step > 0 ? this.step : 1;
		return l(Math.round((e - this.min) / t) * t + this.min, this.min, this.max);
	}
	#s(e) {
		return new Intl.NumberFormat(void 0, {
			style: "currency",
			currency: this.currency,
			maximumFractionDigits: 0
		}).format(e);
	}
	#c() {
		let e = Array(s).fill(0);
		for (let t of this.#r) t < this.min || t > this.max || (e[Math.min(27, Math.floor((t - this.min) / this.#i * s))] += 1);
		let t = Math.max(...e, 1);
		[...this.query(".histogram").children].forEach((n, r) => {
			n.style.height = `${Math.max(e[r] ? 6 : 2, e[r] / t * 100)}%`;
		});
	}
	#l() {
		let [e, t] = this.#a, r = (e) => (e - this.min) / this.#i * 100, i = this.query(".track");
		i.style.setProperty("--_from", `${r(e)}%`), i.style.setProperty("--_to", `${r(t)}%`), [...this.query(".histogram").children].forEach((n, r) => {
			let i = this.min + this.#i * r / s, a = this.min + this.#i * (r + 1) / s;
			n.toggleAttribute("data-in", a > e && i < t);
		}), this.query(".low").textContent = this.#s(e), this.query(".high").textContent = t >= this.max ? `${this.#s(t)}+` : this.#s(t);
		let o = !!(this.disabled || this.#n);
		for (let n of this.shadowRoot.querySelectorAll(".thumb")) {
			let r = n.dataset.end === "from" ? e : t;
			Object.assign(n, {
				ariaValueNow: String(r),
				ariaValueMin: String(n.dataset.end === "from" ? this.min : e),
				ariaValueMax: String(n.dataset.end === "from" ? t : this.max),
				ariaValueText: `${n.dataset.end === "from" ? "Minimum" : "Maximum"} ${this.#s(r)}`,
				tabIndex: o ? -1 : 0
			}), n.ariaDisabled = o ? "true" : null;
		}
		let c = this.#u(e, t);
		a(this.query(".count .rolling"), c.toLocaleString()), this.query(".count .unit").textContent = c === 1 ? "result" : "results";
		let l = new FormData();
		this.name && (l.append(`${this.name}-min`, String(e)), l.append(`${this.name}-max`, String(t))), this[n].setFormValue(this.name ? l : null);
	}
	#u(e, t) {
		return this.#r.filter((n) => n >= e && n <= t).length;
	}
	#d(e, t, n) {
		let [r, i] = [this.#o(e), this.#o(t)], [a, o] = this.#a;
		(r !== a || i !== o) && (this.from = r, this.to = i, this.#l(), this.dispatchEvent(new Event("input", {
			bubbles: !0,
			composed: !0
		})), n && this.#f());
	}
	#f() {
		let [e, t] = this.#a;
		this.emit("change", {
			from: e,
			to: t,
			count: this.#u(e, t)
		});
	}
	#p(e) {
		let t = this.query(".track").getBoundingClientRect();
		return this.min + l((e.clientX - t.left) / t.width, 0, 1) * this.#i;
	}
	#m(e) {
		if (this.disabled || this.#n || e.button !== 0) return;
		let [t, n] = this.#a, r = this.#p(e), i = e.target.closest(".thumb"), a;
		i ? a = i.dataset.end : r > t && r < n ? a = "window" : (a = Math.abs(r - t) <= Math.abs(r - n) ? "from" : "to", this.#d(a === "from" ? r : t, a === "to" ? r : n, !1)), e.preventDefault(), this.query(".track").setPointerCapture(e.pointerId), this.shadowRoot.querySelector(`.thumb[data-end="${a === "window" ? "from" : a}"]`).focus({ preventScroll: !0 }), this.#e = {
			mode: a,
			start: r,
			low: this.#a[0],
			high: this.#a[1]
		}, this.toggleAttribute("data-dragging", !0), this.dataset.drag = a;
	}
	#h(e) {
		let t = this.#e;
		if (!t) return;
		let n = this.#p(e);
		if (t.mode === "window") {
			let e = t.high - t.low, r = l(n - t.start, this.min - t.low, this.max - t.high);
			this.#d(t.low + r, t.low + r + e, !1);
		} else t.mode === "from" ? this.#d(Math.min(n, this.#a[1]), this.#a[1], !1) : this.#d(this.#a[0], Math.max(n, this.#a[0]), !1);
	}
	#g() {
		this.#e && (this.#e = null, this.removeAttribute("data-dragging"), delete this.dataset.drag, this.#f());
	}
	#_(e, t) {
		if (this.disabled || this.#n) return;
		let [n, r] = this.#a, i = this.step > 0 ? this.step : 1, a = Math.max(i, this.#o(this.min + this.#i / 10) - this.min), o = t === "from" ? n : r, s = {
			ArrowLeft: -i,
			ArrowDown: -i,
			ArrowRight: i,
			ArrowUp: i,
			PageDown: -a,
			PageUp: a
		}, c;
		if (e.key in s) c = o + s[e.key];
		else if (e.key === "Home") c = t === "from" ? this.min : n;
		else if (e.key === "End") c = t === "from" ? r : this.max;
		else return;
		e.preventDefault(), t === "from" ? this.#d(Math.min(c, r), r, !0) : this.#d(n, Math.max(c, n), !0);
	}
};
//#endregion
//#region src/components/price-range/index.js
t("price-range", u);
//#endregion
export { u as t };
