import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./motion-CFWhFfc_.js";
//#region src/components/card-flip/card-flip.scss?inline
var i = ":host{aspect-ratio:7/10;width:260px;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);perspective:1100px;touch-action:pan-y;-webkit-user-select:none;user-select:none;border-radius:1rem;outline:none;display:block;position:relative}:host([axis=x]){touch-action:pan-x}:host(:focus-visible){outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:4px}.floor{inset-inline:8%;filter:blur(12px);pointer-events:none;background:#18181b40;border-radius:50%;height:1.5rem;position:absolute;bottom:-1.75rem}.tilt,.card{width:100%;height:100%;transform-style:preserve-3d;position:relative}@media (prefers-reduced-motion:no-preference){.tilt{transition:transform .5s cubic-bezier(.23,1,.32,1)}}.card{border-radius:inherit;cursor:grab}:host(:active) .card{cursor:grabbing}.slice{background:var(--lw-color-border);border-radius:1rem;position:absolute;inset:0}.face{border:1px solid var(--lw-color-border);background:var(--lw-color-background);backface-visibility:hidden;border-radius:1rem;position:absolute;inset:0;overflow:hidden}.face.front{transform:translateZ(3px)}::slotted(*){height:100%}.light{pointer-events:none;justify-content:center;align-items:center;display:flex;position:absolute;inset:0}.shade{opacity:0;background:#000;position:absolute;inset:0}.band{opacity:0;background:#fff;flex:none;width:33%;height:220%}", a = .6, o = 20, s = .22, c = 450, l = 4, u = 36, d = 6, f = 6, p = 7, m = 1 / 240, h = 80, g = "button, a, input, select, textarea, [data-no-flip]", _ = (e) => (e % 2 + 2) % 2, v = (e) => _(Math.round(e / 180)) === 1, y = (e) => Math.round(e / 180) * 180, b = (e, t) => {
	let n = e.at(-1);
	if (!n || t - n.t > h) return 0;
	let r = e.find((e) => n.t - e.t <= h);
	return !r || n.t <= r.t ? 0 : (n.a - r.a) / (n.t - r.t) * 1e3;
}, x = class extends e {
	static styles = i;
	static props = {
		flipped: {
			type: Boolean,
			reflect: !0
		},
		axis: {
			default: "y",
			reflect: !0
		},
		label: { default: "Card" }
	};
	#e = 0;
	#t = 0;
	#n = 0;
	#r = null;
	#i = null;
	#a = !1;
	#o = r(m, {
		step: () => this.#c(),
		render: (e) => this.#l(e)
	});
	render() {
		let e = Array.from({ length: p }, (e, t) => `<div class="slice" style="transform: translateZ(${(-3 + f * (t + .5) / p).toFixed(3)}px)"></div>`).join(""), t = "<div class=\"light\" aria-hidden=\"true\"><div class=\"shade\"></div><div class=\"band\"></div></div>";
		return `<div class="floor" aria-hidden="true"></div>
<div class="tilt"><div class="card">${e}
  <div class="face front" part="face"><slot name="front"></slot>${t}</div>
  <div class="face back" part="face"><slot name="back"></slot>${t}</div>
</div></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.tabIndex = 0, this.role = "group", this.ariaRoleDescription = "flip card", this.addEventListener("pointerdown", (e) => this.#h(e), e), this.addEventListener("pointermove", (e) => this.#g(e), e), this.addEventListener("pointerup", (e) => this.#_(e, !1), e), this.addEventListener("pointercancel", (e) => this.#_(e, !0), e), this.addEventListener("lostpointercapture", (e) => this.#_(e, !0), e), this.addEventListener("pointerleave", () => !this.#r && this.#m(0, 0), e), this.addEventListener("keydown", (e) => this.#v(e), e), this.signal.addEventListener("abort", () => this.#o.stop());
	}
	updated(e) {
		e.has("label") && (this.ariaLabel = this.label), e.has("flipped") && this.#s(), this.query(".back").style.transform = `${this.axis === "x" ? "rotateX" : "rotateY"}(180deg) translateZ(${f / 2}px)`, this.#p();
	}
	#s() {
		let e = !!this.flipped;
		if (this.ariaDescription = `Showing the ${e ? "back" : "front"}. Press Enter or Space, or drag, to turn it over.`, !this.#a) {
			this.#a = !0, this.#e = this.#n = e ? 180 : 0;
			return;
		}
		if (this.#r?.dragging || v(this.#n) === e) return;
		let t = y(this.#e);
		this.#n = v(t) === e ? t : t + (this.#e < t ? -180 : 180), this.#u();
	}
	#c() {
		let e = -170 * (this.#e - this.#n) - o * this.#t;
		this.#t += e * m, this.#e += this.#t * m;
	}
	#l() {
		return Math.abs(this.#e - this.#n) < .05 && Math.abs(this.#t) < .5 ? (this.#n = v(this.#n) ? 180 : 0, this.#e = this.#n, this.#t = 0, this.#p(), !1) : (this.#p(), !0);
	}
	#u() {
		n.matches ? (this.#o.stop(), this.#e = this.#n = v(this.#n) ? 180 : 0, this.#t = 0, this.#p()) : this.#o.wake();
	}
	#d(e) {
		this.#n = e;
		let t = v(e);
		t !== !!this.flipped && (this.flipped = t, this.emit("change", { flipped: t })), this.#u();
	}
	#f(e) {
		this.#d(y(this.#n) + 180 * e);
	}
	#p() {
		let e = this.axis === "x" ? "x" : "y", t = this.#e * Math.PI / 180, n = Math.sin(t), r = Math.abs(n), i = Math.abs(Math.cos(t));
		this.query(".card").style.transform = `translateZ(${(r * u).toFixed(2)}px) ${e === "y" ? "rotateY" : "rotateX"}(${this.#e.toFixed(2)}deg)`;
		let a = this.query(".floor"), o = (.16 + .84 * i).toFixed(3), s = (1 - r * .12).toFixed(3);
		a.style.transform = e === "y" ? `scale(${o}, ${s})` : `scale(${s}, ${o})`, a.style.opacity = (1 - r * .45).toFixed(3);
		let c = `${(n * 140).toFixed(1)}%`, l = e === "y" ? `translateX(${c}) rotate(18deg)` : `translateY(${c}) rotate(72deg)`;
		for (let e of this.shadowRoot.querySelectorAll(".band")) e.style.opacity = (r * .12).toFixed(3), e.style.transform = l;
		for (let e of this.shadowRoot.querySelectorAll(".shade")) e.style.opacity = (r * .14).toFixed(3);
		let d = v(this.#e);
		if (d !== this.#i) {
			this.#i = d;
			for (let [e, t] of [[this.query(".front"), d], [this.query(".back"), !d]]) e.inert = t, e.toggleAttribute("aria-hidden", t);
		}
	}
	#m(e, t) {
		this.query(".tilt").style.transform = `rotateX(${(-t * d).toFixed(2)}deg) rotateY(${(e * d).toFixed(2)}deg)`;
	}
	#h(e) {
		this.#r || e.button !== 0 || e.composedPath()[0].closest?.(g) || (this.#r = {
			id: e.pointerId,
			x: e.clientX,
			y: e.clientY,
			angle: this.#e,
			dragging: !1,
			samples: [{
				t: e.timeStamp,
				a: this.#e
			}]
		}, this.setPointerCapture?.(e.pointerId));
	}
	#g(e) {
		let t = this.#r;
		if (t?.id !== e.pointerId) {
			if (e.pointerType !== "mouse") return;
			let t = this.getBoundingClientRect();
			this.#m((e.clientX - t.left) / t.width * 2 - 1, (e.clientY - t.top) / t.height * 2 - 1);
			return;
		}
		let n = e.clientX - t.x, r = e.clientY - t.y;
		if (!t.dragging) {
			if (Math.hypot(n, r) < l) return;
			t.dragging = !0, this.#o.stop(), this.#t = 0, this.#m(0, 0);
		}
		this.#e = t.angle + (this.axis === "x" ? -r : n) * a, t.samples.push({
			t: e.timeStamp,
			a: this.#e
		}), t.samples.length > 8 && t.samples.shift(), this.#p();
	}
	#_(e, t) {
		let n = this.#r;
		if (n?.id !== e.pointerId) return;
		if (this.#r = null, !n.dragging) {
			if (t) return;
			let n = this.getBoundingClientRect(), r = this.axis === "x" ? e.clientY < n.top + n.height / 2 : e.clientX > n.left + n.width / 2;
			this.#f(r ? 1 : -1);
			return;
		}
		let r = t ? 0 : b(n.samples, e.timeStamp), i = y(n.angle), a = y(this.#e + r * s);
		Math.abs(r) > c && a === i && (a = i + 180 * Math.sign(r));
		let o = 1080;
		this.#t = r, this.#d(Math.max(i - o, Math.min(i + o, a)));
	}
	#v(e) {
		e.target !== this || e.key !== "Enter" && e.key !== " " || (e.preventDefault(), this.#f(1));
	}
};
//#endregion
//#region src/components/card-flip/index.js
t("card-flip", x);
//#endregion
export { x as t };
