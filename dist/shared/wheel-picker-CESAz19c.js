import { n as e, t } from "./core-WcEz9YgG.js";
import { a as n, i as r, n as i, r as a } from "./motion-CFWhFfc_.js";
var o = 20, s = 18 / Math.tan(o / 2 * Math.PI / 180), c = Math.ceil(90 / o), l = Math.round(s * 2) + 18, u = 1.2, d = 80, f = 4, p = .32, m = a(.4, .15), h = {
	stiffness: 140,
	damping: 24
}, g = 120, _ = (e, t) => (e % t + t) % t, v = (e, t) => t * (1 - Math.exp(-e / t)), y = Array.from({ length: 11 }, () => "<span class=\"row\"></span>").join(""), b = document.createElement("template");
b.innerHTML = `<div class="column" part="column" role="spinbutton" tabindex="0"><div class="fade"><div class="view"><div class="drum">${y}</div></div><div class="view selected"><div class="drum">${y}</div></div></div></div>`;
var x = class {
	element = b.content.firstElementChild.cloneNode(!0);
	#e = [...this.element.querySelectorAll(".drum")];
	#t = [];
	#n = !1;
	#r = 0;
	#i = null;
	#a = null;
	#o = null;
	#s = "mouse";
	#c = 0;
	#l;
	constructor(e, t) {
		this.#l = e;
		let n = this.element, r = { signal: t };
		n.addEventListener("pointerdown", (e) => this.#v(e), r), n.addEventListener("pointermove", (e) => this.#y(e), r);
		for (let e of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) n.addEventListener(e, (e) => this.#b(e), r);
		n.addEventListener("keydown", (e) => this.#x(e), r), n.addEventListener("wheel", (e) => this.#S(e), {
			...r,
			passive: !1
		}), t.addEventListener("abort", () => {
			this.#a?.(), clearTimeout(this.#c);
		});
	}
	configure({ options: e, label: t, loop: n, width: r }) {
		this.#t = e, this.#n = n, this.element.ariaLabel = t, this.element.style.width = r ?? "", this.element.ariaValueMin = "0", this.element.ariaValueMax = String(Math.max(e.length - 1, 0)), this.#i = null, this.#f();
	}
	get #u() {
		return this.#t.length;
	}
	get index() {
		return this.#u ? _(Math.round(this.#r), this.#u) : -1;
	}
	show(e) {
		if (this.#o || this.#a || e < 0 || e === this.index) return;
		let t = e - this.index;
		this.#n && Math.abs(t) > this.#u / 2 && (t -= Math.sign(t) * this.#u), this.#d(Math.round(this.#r) + t);
	}
	#d(e) {
		this.#r = e, this.#f();
	}
	#f() {
		let e = this.#u, t = this.element;
		for (let e of this.#e) e.style.transform = `translateZ(${-s}px) rotateX(${(this.#r * o).toFixed(3)}deg)`;
		let r = this.index;
		t.ariaValueNow = String(r), t.ariaValueText = this.#t[r]?.label ?? "";
		let i = Math.round(this.#r);
		if (i !== this.#i) {
			this.#i !== null && this.#s === "touch" && n(1), this.#i = i;
			for (let t of this.#e) [...t.children].forEach((t, n) => {
				let r = i - c + n, a = e === 0 || !this.#n && (r < 0 || r >= e);
				t.hidden = a, !a && (t.textContent = this.#t[_(r, e)].label, t.style.transform = `rotateX(${-r * o}deg) translateZ(${s}px)`);
			});
		}
	}
	#p(e) {
		return this.#n ? e : Math.min(Math.max(e, 0), this.#u - 1);
	}
	#m() {
		this.#a = null, this.#l(this.index);
	}
	#h() {
		this.#a?.(), this.#a = null;
	}
	#g(e, t = m, n = 0) {
		this.#h(), i.matches ? (this.#d(e), this.#m()) : this.#a = r(this.#r, e, {
			...t,
			velocity: n,
			restDelta: .001,
			restSpeed: .01,
			update: (e) => this.#d(e),
			done: () => this.#m()
		});
	}
	#_(e) {
		if (this.#n) return e;
		let t = this.#u - 1;
		return e < 0 ? -v(-e, u) : e > t ? t + v(e - t, u) : e;
	}
	#v(e) {
		this.#o || e.pointerType === "mouse" && e.button !== 0 || !this.#u || (this.#h(), this.#s = e.pointerType, this.element.setPointerCapture(e.pointerId), this.#o = {
			id: e.pointerId,
			startY: e.clientY,
			start: this.#r,
			moved: !1,
			samples: [{
				t: e.timeStamp,
				v: this.#r
			}]
		});
	}
	#y(e) {
		let t = this.#o;
		if (t?.id !== e.pointerId) return;
		let n = e.clientY - t.startY;
		if (!t.moved && Math.abs(n) < f) return;
		t.moved = !0;
		let r = t.start - n / 36;
		for (this.#d(this.#_(r)), t.samples.push({
			t: e.timeStamp,
			v: r
		}); t.samples.length > 2 && e.timeStamp - t.samples[0].t > d;) t.samples.shift();
	}
	#b(e) {
		let t = this.#o;
		if (t?.id !== e.pointerId) return;
		if (this.#o = null, !t.moved) {
			let t = this.element.getBoundingClientRect(), n = Math.max(-1, Math.min(1, (e.clientY - (t.top + t.height / 2)) / s)), r = Math.round(Math.asin(n) * 180 / Math.PI / o);
			this.#g(this.#p(Math.round(this.#r) + r));
			return;
		}
		let n = t.samples[0], r = t.samples.at(-1), i = (r.t - n.t) / 1e3, a = e.timeStamp - r.t > d, c = i > 0 && !a ? (r.v - n.v) / i : 0, l = this.#r;
		!this.#n && (l < 0 || l > this.#u - 1) || Math.abs(c) < 2 ? this.#g(this.#p(Math.round(l))) : this.#g(this.#p(Math.round(l + c * p)), h, c);
	}
	#x(e) {
		let t = Math.round(this.#r), n = t - _(t, this.#u), r = {
			ArrowUp: 1,
			ArrowDown: -1,
			PageUp: 5,
			PageDown: -5
		}, i;
		if (e.key === "Home") i = n;
		else if (e.key === "End") i = n + this.#u - 1;
		else if (e.key in r) i = this.#p(t + r[e.key]);
		else return;
		e.preventDefault(), this.#h(), this.#s = "keyboard", this.#d(i), this.#m();
	}
	#S(e) {
		if (!this.#u) return;
		e.preventDefault(), this.#h(), this.#s = "mouse";
		let t = this.#r + e.deltaY / 36 * .4;
		this.#d(this.#n ? t : Math.min(Math.max(t, -.4), this.#u - 1 + .4)), clearTimeout(this.#c), this.#c = setTimeout(() => this.#g(this.#p(Math.round(this.#r))), g);
	}
}, S = ":host{font-family:var(--lw-font-sans);color:var(--lw-color-foreground);-webkit-user-select:none;user-select:none;display:inline-block}.picker{border:1px solid var(--lw-color-border);background:var(--lw-color-background);border-radius:1rem;padding-inline:.75rem;position:relative}.band,.tick{pointer-events:none;position:absolute;top:50%;translate:0 -50%}.band{height:var(--_item);border-radius:var(--lw-radius-md);background:var(--lw-color-muted);inset-inline:.5rem}.tick{background:var(--lw-color-muted-foreground);width:4px;height:1px;left:2px}.tick.end{left:auto;right:2px}.columns{justify-content:center;display:flex}.column{width:4rem;height:var(--_view);border-radius:var(--lw-radius-md);cursor:grab;touch-action:none;outline:none;position:relative}.column:active{cursor:grabbing}.column:focus-visible{box-shadow:inset 0 0 0 2px var(--lw-color-ring)}.fade{position:absolute;inset:0;-webkit-mask-image:linear-gradient(#0000,#000 34% 66%,#0000);mask-image:linear-gradient(#0000,#000 34% 66%,#0000)}.view{perspective:1000px;pointer-events:none;color:var(--lw-color-muted-foreground);position:absolute;inset:0}.view.selected{clip-path:inset(calc(50% - var(--_item) / 2) 0);color:var(--lw-color-foreground);font-weight:500}.drum{inset-inline:0;transform-style:preserve-3d;position:absolute;top:50%}.row{inset-inline:0;top:calc(var(--_item) / -2);height:var(--_item);font-variant-numeric:tabular-nums;backface-visibility:hidden;justify-content:center;align-items:center;font-size:1.25rem;display:flex;position:absolute}.row[hidden]{display:none}", C = class extends e {
	static styles = S;
	static props = { label: { default: "Picker" } };
	#e = this.attachInternals();
	#t = [];
	#n = [];
	render() {
		return `<div class="picker" style="--_item: 36px; --_view: ${l}px"><span class="band" aria-hidden="true"></span><span class="tick" aria-hidden="true"></span><span class="tick end" aria-hidden="true"></span><div class="columns"></div></div>`;
	}
	connected() {
		this.#e.role = "group";
		let e = new MutationObserver(() => this.#r());
		e.observe(this, {
			childList: !0,
			subtree: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: [
				"label",
				"value",
				"aria-label",
				"data-loop",
				"data-width"
			]
		}), this.addEventListener("change", (e) => e.target !== this && this.#i(), { signal: this.signal }), document.addEventListener("reset", (e) => e.target.contains?.(this) && setTimeout(() => this.#i()), { signal: this.signal }), this.signal.addEventListener("abort", () => e.disconnect()), this.#r();
	}
	updated(e) {
		e.has("label") && (this.#e.ariaLabel = this.label);
	}
	get value() {
		return Object.fromEntries(this.#n.map((e, t) => [e.name || String(t), e.value]));
	}
	set value(e) {
		this.#n.forEach((t, n) => {
			let r = e?.[t.name || String(n)];
			r !== void 0 && (t.value = r);
		}), this.#i();
	}
	#r() {
		this.#n = [...this.querySelectorAll(":scope > select")];
		let e = this.query(".columns");
		for (; this.#t.length < this.#n.length;) {
			let t = this.#t.length, n = new x((e) => this.#a(t, e), this.signal);
			this.#t.push(n), e.append(n.element);
		}
		for (; this.#t.length > this.#n.length;) this.#t.pop().element.remove();
		this.#n.forEach((e, t) => {
			this.#t[t].configure({
				options: [...e.options].map((e) => ({
					value: e.value,
					label: e.label
				})),
				label: e.getAttribute("aria-label") ?? e.name,
				loop: e.hasAttribute("data-loop"),
				width: e.dataset.width
			});
		}), this.#i();
	}
	#i() {
		this.#n.forEach((e, t) => this.#t[t]?.show(e.selectedIndex));
	}
	#a(e, t) {
		let n = this.#n[e];
		!n || t < 0 || n.selectedIndex === t || (n.selectedIndex = t, n.dispatchEvent(new Event("input", { bubbles: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0 })), this.emit("change", { value: this.value }));
	}
};
//#endregion
//#region src/components/wheel-picker/index.js
t("wheel-picker", C);
//#endregion
export { C as t };
