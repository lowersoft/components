import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./form-QHOiInAj.js";
import { a as i, i as a, n as o, r as s } from "./motion-CFWhFfc_.js";
import { n as c, t as l } from "./rolling-VjfpUD4B.js";
//#region src/components/detent-dial/detent-dial.scss?inline
var u = ":host{--_accent:var(--lw-detent-dial-accent,var(--lightningcss-light,#ea580c)var(--lightningcss-dark,#fb923c));font-family:var(--lw-font-sans);color:var(--lw-color-foreground);-webkit-user-select:none;user-select:none;display:inline-block}:host([disabled]){opacity:.5}.dial{width:var(--_size);height:var(--_size);position:relative}.ticks{position:absolute;inset:0;overflow:visible}.ticks line{stroke:var(--lw-color-border);stroke-width:1.5px;transition:stroke .15s}.ticks .lit{stroke:var(--lw-color-foreground)}.ticks .current{stroke:var(--_accent);stroke-width:2px}.end{font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);white-space:nowrap;font-size:.6875rem;position:absolute;translate:-50%}.knob{border:1px solid var(--lw-color-border);background:var(--lw-color-background);cursor:grab;touch-action:none;border-radius:50%;outline:none;width:64%;height:64%;transition:border-color .15s;position:absolute;top:50%;left:50%;translate:-50% -50%;box-shadow:0 1px 2px #0000000f,0 12px 32px -12px #00000040}.knob:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:4px}:host([data-grabbing]) .knob{border-color:color-mix(in oklab, var(--lw-color-foreground) 22%, transparent);cursor:grabbing}.knob[aria-disabled]{cursor:not-allowed}.turn{position:absolute;inset:0}.indicator{background:var(--lw-color-foreground);border-radius:2px;width:3px;height:.75rem;position:absolute;top:.625rem;left:50%;translate:-50%}.readout{pointer-events:none;flex-direction:column;justify-content:center;align-items:center;display:flex;position:absolute;inset:0}.label{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}.value{letter-spacing:-.02em;font-size:1.875rem;font-weight:500}", d = 270, f = -135, p = 16, m = 56, h = 9, g = 12, _ = 14, v = .4, y = 80, b = .3, x = s(.35, .2), S = {
	stiffness: 140,
	damping: 24
}, C = 40, w = (e, t) => t * (1 - Math.exp(-e / t)), T = (e, t, n) => Math.min(Math.max(e, t), n), E = (e, t, n) => Number((Math.round((e - t) / n) * n + t).toFixed(10)), D = (e) => (String(e).split(".")[1] ?? "").length, O = (e, t, n) => {
	let r = n * Math.PI / 180;
	return {
		x: (e + t * Math.sin(r)).toFixed(2),
		y: (e - t * Math.cos(r)).toFixed(2)
	};
}, k = class extends r(e) {
	static styles = [c, u];
	static props = {
		value: {
			type: Number,
			default: 21
		},
		min: {
			type: Number,
			default: 16
		},
		max: {
			type: Number,
			default: 30
		},
		step: {
			type: Number,
			default: .5
		},
		label: { default: "Temperature" },
		suffix: { default: "°" },
		size: {
			type: Number,
			default: 240
		},
		name: {},
		disabled: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = null;
	#t = null;
	#n = null;
	#r = [];
	#i = [];
	#a = null;
	#o = null;
	#s = "mouse";
	#c = 0;
	#l = !1;
	render() {
		return "<div class=\"dial\"><svg class=\"ticks\" aria-hidden=\"true\"></svg><span class=\"end start\" aria-hidden=\"true\"></span><span class=\"end finish\" aria-hidden=\"true\"></span><div class=\"knob\" part=\"knob\" role=\"slider\" aria-labelledby=\"label\"><div class=\"turn\" aria-hidden=\"true\"><span class=\"indicator\"></span></div><div class=\"readout\"><span class=\"label\" id=\"label\"></span><span class=\"value rolling\" aria-hidden=\"true\"></span></div></div></div>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".knob");
		t.addEventListener("pointerdown", (e) => this.#w(e), e), t.addEventListener("pointermove", (e) => this.#T(e), e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, (e) => this.#E(e), e);
		t.addEventListener("keydown", (e) => this.#D(e), e), t.addEventListener("dblclick", () => this.#u && this.#x(this.#p(this.#n)), e), t.addEventListener("wheel", (e) => this.#O(e), {
			...e,
			passive: !1
		}), this.signal.addEventListener("abort", () => {
			this.#a?.(), this.#a = null, this.#o = null;
		});
	}
	updated(e) {
		this.#n ??= this.value, [
			"min",
			"max",
			"step",
			"size",
			"suffix"
		].some((t) => e.has(t)) && this.#g(), e.has("label") && (this.query(".label").textContent = this.label), e.has("disabled") && this.#h();
		let t = this.#p(this.value);
		(this.#e === null || t !== this.#t && !this.#o) && (this.#a?.(), this.#a = null, this.#v(t, !1));
	}
	formResetCallback() {
		this.#a?.(), this.#a = null, this.#v(this.#p(this.#n), !1);
	}
	formDisabledCallback(e) {
		this.#l = e, this.#h();
	}
	get #u() {
		return !this.disabled && !this.#l;
	}
	get #d() {
		return this.max - this.min;
	}
	get #f() {
		return Math.max(1, Math.min(Math.round(this.#d / this.step), m));
	}
	#p(e) {
		return T(E(e, this.min, this.step), this.min, this.max);
	}
	#m(e) {
		return this.formatValue ? this.formatValue(e) : `${e.toFixed(D(this.step))}${this.suffix ?? ""}`;
	}
	#h() {
		let e = this.query(".knob");
		e.tabIndex = this.#u ? 0 : -1, e.ariaDisabled = this.#u ? null : "true";
	}
	#g() {
		let e = this.size, t = e / 2, n = t - 6;
		this.query(".dial").style.setProperty("--_size", `${e}px`);
		let r = this.query(".ticks");
		r.setAttribute("viewBox", `0 0 ${e} ${e}`);
		let i = this.#f;
		r.innerHTML = Array.from({ length: i + 1 }, () => "<line stroke-linecap=\"round\"/>").join(""), this.#r = [...r.children], this.#i = [], this.#r.forEach((e, r) => {
			let { x: a, y: o } = O(t, n, f + r / i * d);
			e.setAttribute("x2", a), e.setAttribute("y2", o);
		});
		for (let [e, r, i] of [[
			".start",
			-147,
			this.min
		], [
			".finish",
			147,
			this.max
		]]) {
			let a = this.query(e), { x: o, y: s } = O(t, n + 2, r);
			Object.assign(a.style, {
				left: `${o}px`,
				top: `${s}px`
			}), a.textContent = this.#m(i);
		}
		this.#t = null, this.#e !== null && this.#v(this.#e, !1);
	}
	#_(e) {
		let t = this.#d === 0 ? 0 : d / this.#d;
		if (e < this.min) return f - w((this.min - e) * t, p);
		if (e > this.max) return 135 + w((e - this.max) * t, p);
		let n = E(e, this.min, this.step);
		return f + (n + (e - n) * .35 - this.min) * t;
	}
	#v(e, t = !0) {
		this.#e = e;
		let n = this.#_(e);
		this.query(".turn").style.rotate = `${n.toFixed(2)}deg`, this.#y(n);
		let r = this.#p(e);
		if (r === this.#t) return;
		let i = this.#t;
		this.#t = r, this.#b(r, t && i !== null);
	}
	#y(e) {
		let t = this.#f, n = this.size / 2, r = n - 6;
		this.#r.forEach((i, a) => {
			let o = f + a / t * d, s = 6;
			a === 0 || a === t || a * 2 === t ? s = 14 : a % 5 == 0 && (s = 10);
			let c = (o - e) / g, l = Math.round((s + h * Math.exp(-c * c)) * 10) / 10;
			if (this.#i[a] === l) return;
			this.#i[a] = l;
			let { x: u, y: p } = O(n, r - l, o);
			i.setAttribute("x1", u), i.setAttribute("y1", p);
		});
	}
	#b(e, t) {
		let r = this.#m(e);
		l(this.query(".value"), r);
		let a = this.query(".knob");
		Object.assign(a, {
			ariaValueNow: String(e),
			ariaValueMin: String(this.min),
			ariaValueMax: String(this.max),
			ariaValueText: r
		});
		let o = Math.round((e - this.min) / (this.#d || 1) * this.#f);
		this.#r.forEach((e, t) => e.setAttribute("class", t === o ? "current" : t < o ? "lit" : "")), this[n].setFormValue(this.name ? String(e) : null), this.value = e, t && (this.emit("change", { value: e }), this.#s === "touch" && i(1));
	}
	#x(e, t = x, n = 0) {
		this.#a?.(), this.#a = null, o.matches ? this.#v(e) : this.#a = a(this.#e, e, {
			...t,
			velocity: n,
			restDelta: .005,
			restSpeed: .01,
			update: (e) => this.#v(e),
			done: () => this.#a = null
		});
	}
	#S(e) {
		this.#a?.(), this.#a = null, this.#s = "keyboard", this.#v(this.#p(this.#t + e));
	}
	#C(e, t) {
		let n = e.clientX - (t.left + t.width / 2), r = e.clientY - (t.top + t.height / 2);
		return {
			angle: Math.atan2(n, -r) * 180 / Math.PI,
			distance: Math.hypot(n, r)
		};
	}
	#w(e) {
		if (!this.#u || this.#o || e.pointerType === "mouse" && e.button !== 0) return;
		let t = e.currentTarget.getBoundingClientRect();
		this.#a?.(), this.#a = null, this.#s = e.pointerType, e.currentTarget.setPointerCapture(e.pointerId), this.#o = {
			id: e.pointerId,
			box: t,
			lastAngle: this.#C(e, t).angle,
			samples: [{
				t: e.timeStamp,
				v: this.#e
			}]
		}, this.toggleAttribute("data-grabbing", !0);
	}
	#T(e) {
		let t = this.#o;
		if (t?.id !== e.pointerId) return;
		let { angle: n, distance: r } = this.#C(e, t.box), i = n - t.lastAngle;
		if (t.lastAngle = n, r < _) return;
		i > 180 ? i -= 360 : i < -180 && (i += 360);
		let a = this.#e + i / d * this.#d;
		for (this.#v(a), t.samples.push({
			t: e.timeStamp,
			v: a
		}); t.samples.length > 2 && e.timeStamp - t.samples[0].t > y;) t.samples.shift();
	}
	#E(e) {
		let t = this.#o;
		if (t?.id !== e.pointerId) return;
		this.#o = null, this.removeAttribute("data-grabbing");
		let n = t.samples[0], r = t.samples.at(-1), i = (r.t - n.t) / 1e3, a = e.timeStamp - r.t > y, o = i > 0 && !a ? (r.v - n.v) / i : 0, s = this.#e;
		!(s >= this.min && s <= this.max) || Math.abs(o) < this.#d * v ? this.#x(this.#p(s)) : this.#x(this.#p(s + o * b), S, o);
	}
	#D(e) {
		if (!this.#u) return;
		let { step: t, min: n, max: r } = this, i = Math.max(t, E(this.#d / 10, 0, t)), a = {
			ArrowUp: t,
			ArrowRight: t,
			ArrowDown: -t,
			ArrowLeft: -t,
			PageUp: i,
			PageDown: -i,
			Home: n - this.#t,
			End: r - this.#t
		};
		e.key in a && (e.preventDefault(), this.#S(a[e.key]));
	}
	#O(e) {
		if (this.#u && this.shadowRoot.activeElement === e.currentTarget) for (e.preventDefault(), this.#c += e.deltaY; Math.abs(this.#c) >= C;) {
			let e = Math.sign(this.#c);
			this.#c -= e * C, this.#S(-e * this.step);
		}
	}
};
//#endregion
//#region src/components/detent-dial/index.js
t("detent-dial", k);
//#endregion
export { k as t };
