import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./form-QHOiInAj.js";
import { a as i, n as a, t as o } from "./motion-CFWhFfc_.js";
//#region src/components/liquid-gauge/liquid-gauge.scss?inline
var s = ":host{box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:18rem;height:22.5rem;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);cursor:ns-resize;touch-action:none;-webkit-user-select:none;user-select:none;border-radius:1.5rem;outline:none;display:block;position:relative;overflow:hidden}:host([data-dragging]){cursor:grabbing}:host([readonly]){cursor:default}:host(:focus-visible){outline:2px solid var(--lw-color-ring);outline-offset:2px}p{margin:0}.dry,.rim,.liquid{pointer-events:none;position:absolute;inset:0}.readout{inset-inline:0;padding:1.5rem;position:absolute;top:0}.label{font-size:var(--lw-text-sm);font-weight:500}.percent{font-variant-numeric:tabular-nums;letter-spacing:-.025em;margin-top:.75rem;font-size:3.75rem;font-weight:600;line-height:1}.sign{opacity:.6;margin-left:.125rem;font-size:1.875rem;font-weight:500}.used{font-size:var(--lw-text-sm);font-variant-numeric:tabular-nums;opacity:.6;margin-top:.25rem}.status{font-size:var(--lw-text-sm);font-weight:500;position:absolute;bottom:1.5rem;left:1.5rem}.ticks{inset-block:0;width:1rem;position:absolute;right:0}.ticks span{opacity:.3;background:currentColor;width:.375rem;height:1px;position:absolute;right:0}.ticks span.half{width:.75rem}.rim{background:var(--lw-color-ring);transition:background-color .3s ease-out}:host([data-warn]) .rim{background:var(--lightningcss-light,#fca5a5)var(--lightningcss-dark,#7f1d1d)}.liquid{background:var(--lw-color-primary);color:var(--lw-color-primary-foreground);transition:background-color .3s ease-out,color .3s ease-out}:host([data-warn]) .liquid{color:#fff;background:#ef4444}.bubble{box-sizing:border-box;background:color-mix(in oklab, currentColor 20%, transparent);opacity:0;border:1px solid;border-radius:50%;width:.5rem;height:.5rem;position:absolute;top:0;left:0}", c = 28, l = 1 / 120, u = 2600, d = 18, f = 2.2, p = 90, m = 11, h = 4.5, g = 20, _ = 26, v = 3, y = 10, b = .06, x = .02, S = [
	10,
	20,
	30,
	40,
	50,
	60,
	70,
	80,
	90
], C = {
	ArrowUp: 1,
	ArrowRight: 1,
	ArrowDown: -1,
	ArrowLeft: -1,
	PageUp: 10,
	PageDown: -10
}, w = (e, t, n) => Math.min(n, Math.max(t, e)), T = (e, t = 0) => `polygon(0% calc(${100 - e}% - ${t}px),100% calc(${100 - e}% - ${t}px),100% 100%,0% 100%)`, E = "<div class=\"readout\"><p class=\"label\"></p><p class=\"percent\"><span class=\"number\"></span><span class=\"sign\">%</span></p><p class=\"used\"><span class=\"amount\"></span><span class=\"of\"></span></p></div><p class=\"status\"></p>", D = class extends r(e) {
	static styles = s;
	static props = {
		value: {
			type: Number,
			default: 72
		},
		readonly: {
			type: Boolean,
			reflect: !0
		},
		label: { default: "Storage" },
		total: {
			type: Number,
			default: 128
		},
		unit: { default: "GB" },
		warnAt: {
			type: Number,
			default: 90
		},
		name: {}
	};
	#e = new Float64Array(c);
	#t = new Float64Array(c);
	#n = null;
	#r = 0;
	#i = 0;
	#a = Array.from({ length: y }, () => ({
		x: 0,
		y: 0,
		r: 0,
		speed: 0,
		phase: 0,
		alive: !1
	}));
	#o = 0;
	#s = 0;
	#c = {
		width: 0,
		height: 0
	};
	#l = -1;
	#u = -1;
	#d = !0;
	#f = null;
	#p = null;
	#m = o(l, {
		step: () => this.#y(),
		render: () => this.#x()
	});
	render() {
		let e = S.map((e) => `<span class="${e === 50 ? "half" : ""}" style="top: ${100 - e}%"></span>`).join("");
		return `<div class="dry">${E}<div class="ticks">${e}</div></div><div class="rim" aria-hidden="true"></div><div class="liquid" aria-hidden="true">${E}<div class="ticks">${e}</div>${"<span class=\"bubble\"></span>".repeat(y)}</div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this[n].role = "slider", this[n].ariaValueMin = "0", this[n].ariaValueMax = "100", this.addEventListener("pointerdown", (e) => this.#D(e), e), this.addEventListener("pointermove", (e) => this.#O(e), e);
		for (let t of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) this.addEventListener(t, (e) => this.#k(e), e);
		this.addEventListener("pointerleave", () => this.#l < 0 && (this.#u = -1), e), this.addEventListener("keydown", (e) => this.#A(e), e);
		let t = new ResizeObserver(() => this.#_());
		t.observe(this);
		let r = new IntersectionObserver(([e]) => {
			this.#d = e.isIntersecting, this.#v();
		});
		r.observe(this), document.addEventListener("visibilitychange", () => this.#v(), e), this.signal.addEventListener("abort", () => {
			t.disconnect(), r.disconnect(), this.#m.stop();
		});
	}
	updated(e) {
		this.#f ??= this.value;
		let t = w(Number(this.value) || 0, 0, 100);
		(this.#n === null || a.matches) && (this.#n = t, this.#r = 0), this.tabIndex = this.readonly ? -1 : 0, this[n].ariaReadOnly = this.readonly ? "true" : null, this[n].ariaLabel = this.label ?? null, this.toggleAttribute("data-warn", t >= this.warnAt);
		let r = this.#h(Math.round(t));
		this[n].ariaValueNow = String(Math.round(t)), this[n].ariaValueText = `${Math.round(t)}%, ${r} of ${this.total} ${this.unit} used`, this[n].setFormValue(this.name ? String(Math.round(t)) : null);
		for (let e of this.shadowRoot.querySelectorAll(".label")) e.textContent = this.label ?? "";
		for (let e of this.shadowRoot.querySelectorAll(".of")) e.textContent = ` of ${this.total} ${this.unit} used`;
		for (let e of this.shadowRoot.querySelectorAll(".status")) e.textContent = t >= this.warnAt ? "Almost full" : `${100 - Math.round(t)}% free`;
		(e.has("value") || e.has("total")) && (this.#p = null), this.#_(), this.#v();
	}
	formResetCallback() {
		this.value = this.#f ?? 72;
	}
	#h(e) {
		return (e / 100 * this.total).toFixed(1);
	}
	get #g() {
		return w(Number(this.value) || 0, 0, 100);
	}
	#_() {
		this.#c = {
			width: this.clientWidth,
			height: this.clientHeight
		}, this.#C();
	}
	#v() {
		this.#d && !document.hidden ? this.#m.wake() : this.#m.stop();
	}
	#y() {
		let e = this.#e, t = this.#t, n = this.#g;
		this.#r += ((n - this.#n) * p - this.#r * m) * l, this.#n += this.#r * l;
		let r = Math.abs(n - this.#n) + Math.abs(this.#r) * .1;
		for (let n = 0; n < c; n++) {
			let r = e[n > 0 ? n - 1 : n], i = e[n < 27 ? n + 1 : n];
			t[n] += ((r + i - 2 * e[n]) * u - e[n] * d - t[n] * f) * l;
		}
		for (let n = 0; n < c; n++) e[n] = w(e[n] + t[n] * l, -26, _), r = Math.max(r, Math.abs(e[n]), Math.abs(t[n]) * .1);
		this.#i = Math.max(this.#i, r), this.#s += l, this.#b();
	}
	#b() {
		let { width: e, height: t } = this.#c;
		for (this.#o += Math.max(0, this.#r) * b * l; this.#o >= 1;) {
			--this.#o;
			let n = this.#a.find((e) => !e.alive);
			if (!n) {
				this.#o = 0;
				break;
			}
			Object.assign(n, {
				alive: !0,
				x: e * (.12 + Math.random() * .76),
				y: t - 6,
				r: 1.5 + Math.random() * 2.5,
				speed: 70 + Math.random() * 80,
				phase: Math.random() * Math.PI * 2
			});
		}
		let n = t * (1 - this.#n / 100);
		for (let t of this.#a) {
			if (!t.alive) continue;
			t.y -= t.speed * l;
			let r = w(Math.round(t.x / e * 27), 0, 27);
			t.y - t.r <= n + this.#e[r] && (t.alive = !1, this.#t[r] += t.r * 6);
		}
	}
	#x() {
		let e = this.#l >= 0 || this.#a.some((e) => e.alive) || this.#i > x;
		return this.#i = 0, e || (this.#n = this.#g, this.#r = 0, this.#e.fill(0), this.#t.fill(0)), this.#C(), e;
	}
	#S(e, t) {
		let { width: n, height: r } = this.#c, i = "";
		for (let a = 0; a < c; a++) i += `${(a / 27 * n).toFixed(1)}px ${w(e + this.#e[a] - t, -40, r + 40).toFixed(1)}px,`;
		return `polygon(${i}${n}px ${r + 40}px,0px ${r + 40}px)`;
	}
	#C() {
		let { width: e, height: t } = this.#c, n = this.query(".liquid"), r = this.query(".rim");
		if (!e || !t) {
			n.style.clipPath = T(this.#g), r.style.clipPath = T(this.#g, v);
			return;
		}
		let i = t * (1 - this.#n / 100);
		n.style.clipPath = this.#S(i, 0), r.style.clipPath = this.#S(i, v), this.shadowRoot.querySelectorAll(".bubble").forEach((e, t) => {
			let n = this.#a[t];
			if (e.style.opacity = n.alive ? "1" : "0", !n.alive) return;
			let r = Math.sin(this.#s * 7 + n.phase) * 2.5;
			e.style.transform = `translate3d(${(n.x + r - n.r).toFixed(1)}px,${(n.y - n.r).toFixed(1)}px,0) scale(${(n.r / 4).toFixed(3)})`;
		});
		let a = Math.round(w(this.#n, 0, 100));
		if (a !== this.#p) {
			this.#p = a;
			for (let e of this.shadowRoot.querySelectorAll(".number")) e.textContent = String(a);
			for (let e of this.shadowRoot.querySelectorAll(".amount")) e.textContent = this.#h(a);
		}
	}
	#w(e, t, n = 3) {
		if (a.matches) return;
		let r = this.getBoundingClientRect(), i = (e - r.left) / r.width * 27;
		for (let e = 0; e < c; e++) {
			let r = 1 - Math.abs(e - i) / n;
			r > 0 && (this.#t[e] += t * r);
		}
	}
	#T(e, t) {
		let n = Math.round(w(e, 0, 100));
		n !== this.value && (this.value = n, t ? this.dispatchEvent(new Event("input", {
			bubbles: !0,
			composed: !0
		})) : this.emit("change", { value: n }));
	}
	#E(e) {
		let t = this.getBoundingClientRect();
		return (1 - (e - t.top) / t.height) * 100;
	}
	#D(e) {
		this.readonly || e.pointerType === "mouse" && e.button !== 0 || (this.setPointerCapture?.(e.pointerId), this.#l = e.pointerId, this.#u = e.clientX, this.toggleAttribute("data-dragging", !0), this.#w(e.clientX, 260, 2.5), this.#T(this.#E(e.clientY), !0), this.#v());
	}
	#O(e) {
		let t = this.#u < 0 ? 0 : e.clientX - this.#u;
		if (this.#u = e.clientX, this.#l === e.pointerId) {
			if (!a.matches) for (let e = 0; e < c; e++) this.#t[e] += (e / 27 * 2 - 1) * t * h;
			this.#T(this.#E(e.clientY), !0), this.#v();
			return;
		}
		if (e.pointerType !== "mouse" || t === 0 || a.matches) return;
		let n = this.getBoundingClientRect();
		e.clientY - n.top > n.height * (1 - this.#n / 100) + 8 && (this.#w(e.clientX, Math.abs(t) * g, 2), this.#v());
	}
	#k(e) {
		this.#l === e.pointerId && (this.#l = -1, this.removeAttribute("data-dragging"), i(6), this.emit("change", { value: this.value }), this.#v());
	}
	#A(e) {
		if (this.readonly) return;
		let t;
		if (e.key in C ? t = this.value + C[e.key] * (e.shiftKey ? 10 : 1) : e.key === "Home" ? t = 0 : e.key === "End" && (t = 100), t === void 0) return;
		e.preventDefault();
		let n = this.getBoundingClientRect();
		this.#w(n.left + n.width / 2, t > this.value ? 120 : -120, 4), this.#T(t, !1), this.#v();
	}
};
//#endregion
//#region src/components/liquid-gauge/index.js
t("liquid-gauge", D);
//#endregion
export { D as t };
