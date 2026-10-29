import { n as e, t } from "./core-WcEz9YgG.js";
import { n } from "./motion-CFWhFfc_.js";
import { t as r } from "./visibility--H4IXDjD.js";
import { n as i } from "./text-C4ocnqBV.js";
//#region src/components/cradle-text/cradle.js
var a = 8, o = 3, s = .72, c = .3, l = 1.6, u = .02, d = 2 * Math.PI / s, f = (e, t, n) => Math.min(Math.max(e, t), n), p = class {
	bobs = [];
	radius = 1;
	restitution = .97;
	energy() {
		return this.bobs.reduce((e, { omega: t, phi: n }) => e + (t / d) ** 2 + 2 * (1 - Math.cos(n)), 0);
	}
	shift(e) {
		return this.radius * Math.sin(e.phi);
	}
	rest() {
		this.bobs.forEach((e) => {
			e.phi = 0, e.omega = 0;
		});
	}
	step(e) {
		let t = e / a, n = this.energy() < u ? l : c, { bobs: r } = this;
		for (let e = 0; e < a; e++) {
			for (let e of r) e.held || (e.omega -= d * d * Math.sin(e.phi) * t, e.omega *= 1 - n * t, e.phi += e.omega * t);
			for (let e = 0; e < o; e++) {
				for (let e = 0; e + 1 < r.length; e++) this.#e(r[e], r[e + 1]);
				for (let e = r.length - 2; e >= 0; e--) this.#e(r[e], r[e + 1]);
			}
		}
	}
	#e(e, t) {
		let { radius: n } = this, r = this.shift(e), i = this.shift(t), a = r - i - e.gap, o = +!e.held, s = +!t.held;
		if (a <= 0 || o + s === 0) return;
		let c = a / (o + s);
		e.phi = Math.asin(f((r - o * c) / n, -1, 1)), t.phi = Math.asin(f((i + s * c) / n, -1, 1));
		let l = Math.max(Math.cos(e.phi), .2), u = Math.max(Math.cos(t.phi), .2), d = e.omega * n * l, p = t.omega * n * u, m = d - p;
		if (m <= 0) return;
		let h = (1 + this.restitution) * m / (o + s);
		e.omega = (d - o * h) / (n * l), t.omega = (p + s * h) / (n * u);
	}
}, m = ":host{--_thread:color-mix(in oklab, var(--lw-color-muted-foreground) 50%, transparent);line-height:1;display:inline-block}:host([data-grabbing]) .stage{cursor:grabbing}.live{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.stage{cursor:grab;touch-action:pan-y;-webkit-user-select:none;user-select:none;padding:1.5em .9em .45em;display:block;position:relative}.rail{inset-inline:0;background:var(--_thread);pointer-events:none;height:1px;position:absolute;top:.3em}.letters{white-space:pre;display:block;position:relative}.letter{transform-origin:0 0;will-change:transform;display:inline-block;position:relative}.thread{background:var(--_thread);width:1px;position:absolute}.space{width:.32em;display:inline-block}.probe{width:0;height:0;display:inline-block}", h = 1.15, g = .22, _ = 900, v = .38, y = 520, b = 1.25, x = 400, S = 4e-4, C = (e) => 1 - (1 - e) ** 4, w = class extends e {
	static styles = m;
	static props = {
		text: {},
		bounce: {
			type: Number,
			default: .97
		},
		noIntro: { type: Boolean }
	};
	#e = new p();
	#t = document.createElement("canvas").getContext("2d");
	#n = 0;
	#r = -1;
	#i = 0;
	#a = 0;
	#o = !1;
	#s = !1;
	#c = 0;
	#l = null;
	#u = null;
	#d = null;
	render() {
		return "<span class=\"live\"></span><span class=\"stage\" part=\"base\"><span class=\"rail\" part=\"rail\" aria-hidden=\"true\"></span><span class=\"letters\" aria-hidden=\"true\"></span></span>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".stage"), n = new MutationObserver(() => this.#p());
		n.observe(this, {
			childList: !0,
			subtree: !0,
			characterData: !0
		});
		let i = new ResizeObserver(() => t.clientWidth !== this.#r && this.#m());
		i.observe(t), document.fonts?.ready.then(() => this.isConnected && this.#m()), r(this, (e) => {
			this.#o = e, e && (this.#s || this.#f(), this.#g());
		}, this.signal), t.addEventListener("pointerdown", (e) => this.#S(e), e), t.addEventListener("pointermove", (e) => this.#C(e), e), t.addEventListener("pointerup", (e) => this.#w(e), e), t.addEventListener("pointercancel", (e) => this.#w(e), e), t.addEventListener("pointerleave", () => this.#d = null, e), this.signal.addEventListener("abort", () => {
			n.disconnect(), i.disconnect(), cancelAnimationFrame(this.#i), clearTimeout(this.#c), this.#i = 0, this.#u = null, this.#l = null, this.removeAttribute("data-grabbing"), this.#e.rest(), this.#h();
		}), this.#p();
	}
	updated(e) {
		e.has("text") && this.#p(), e.has("bounce") && (this.#e.restitution = f(this.bounce, 0, 1));
	}
	#f() {
		this.#s = !0, !(this.noIntro || n.matches) && (this.#c = setTimeout(() => {
			let e = this.#e.bobs[0];
			!e || this.#u || (this.#l = {
				bob: e,
				start: performance.now(),
				to: -.62
			}, this.#g());
		}, x));
	}
	#p() {
		if (!this.isConnected) return;
		let e = this.text ?? this.textContent.trim();
		this.query(".live").textContent = e;
		let t = i(e).map((e) => {
			if (e.trim() === "") return Object.assign(document.createElement("span"), { className: "space" });
			let t = Object.assign(document.createElement("span"), { className: "letter" });
			return t.dataset.letter = e, t.append(Object.assign(document.createElement("span"), { className: "thread" }), e), t;
		}), n = Object.assign(document.createElement("span"), { className: "probe" });
		this.query(".letters").replaceChildren(...t, n), this.#m();
	}
	#m() {
		let e = this.query(".stage"), t = this.query(".letters"), n = this.#e;
		this.#r = e.clientWidth, this.#l = null, this.#u = null, this.removeAttribute("data-grabbing");
		let r = e.getBoundingClientRect(), i = t.lastElementChild.getBoundingClientRect().bottom - r.top, a = getComputedStyle(t), o = Number.parseFloat(a.fontSize);
		this.#t.font = a.font, this.#n = this.query(".rail").getBoundingClientRect().top - r.top + .5, n.radius = Math.max(i - o * .35 - this.#n, 1), n.bobs = [...t.querySelectorAll(".letter")].map((e) => {
			e.style.transform = "";
			let t = e.getBoundingClientRect(), n = this.#t.measureText(e.dataset.letter), a = t.left - r.left, o = t.top - r.top, s = a - n.actualBoundingBoxLeft, c = a + n.actualBoundingBoxRight, l = i - n.actualBoundingBoxAscent, u = (s + c) / 2;
			return Object.assign(e.firstElementChild.style, {
				left: `${u - a - .5}px`,
				top: `${this.#n - o}px`,
				height: `${Math.max(l - this.#n, 0)}px`
			}), {
				el: e,
				left: s,
				right: c,
				center: u,
				top: l,
				bottom: i + n.actualBoundingBoxDescent,
				boxLeft: a,
				boxTop: o,
				gap: 0,
				phi: 0,
				omega: 0,
				held: !1
			};
		}), n.bobs.forEach((e, t, n) => e.gap = n[t + 1] ? Math.max(n[t + 1].left - e.right, 0) : 0);
	}
	#h() {
		for (let e of this.#e.bobs) {
			if (e.phi === 0) {
				e.el.style.transform = "";
				continue;
			}
			let t = e.center - e.boxLeft, n = this.#n - e.boxTop;
			e.el.style.transform = `translate3d(${t.toFixed(2)}px, ${n.toFixed(2)}px, 0) rotate(${(-e.phi).toFixed(4)}rad) translate3d(${(-t).toFixed(2)}px, ${(-n).toFixed(2)}px, 0)`;
		}
	}
	#g() {
		this.#i || !this.#o || !this.isConnected || (this.#a = 0, this.#i = requestAnimationFrame(this.#_));
	}
	#_ = (e) => {
		if (this.#i = 0, !this.#o) return;
		let t = this.#a ? Math.min((e - this.#a) / 1e3, 1 / 30) : 1 / 60;
		this.#a = e, this.#v(e), this.#e.step(t), this.#h(), this.#u || this.#l || this.#e.energy() > S ? this.#i = requestAnimationFrame(this.#_) : (this.#e.rest(), this.#h());
	};
	#v(e) {
		let t = this.#l;
		if (!t) return;
		let n = (e - t.start) / y;
		t.bob.omega = 0, n >= b ? (t.bob.held = !1, this.#l = null) : (t.bob.held = !0, t.bob.phi = t.to * C(Math.min(n, 1)));
	}
	#y() {
		this.#l && (this.#l.bob.held = !1), this.#l = null;
	}
	#b(e) {
		let t = this.query(".stage").getBoundingClientRect();
		return {
			x: e.clientX - t.left,
			y: e.clientY - t.top
		};
	}
	#x({ x: e, y: t }, n) {
		let r = this.#e;
		return r.bobs.find((i) => {
			let a = r.shift(i);
			return e > i.left + a - n && e < i.right + a + n && t > i.top - n && t < i.bottom + n;
		});
	}
	#S(e) {
		if (this.#u || e.button !== 0 || n.matches) return;
		let t = this.#b(e), r = this.#x(t, Number.parseFloat(getComputedStyle(this).fontSize) * .1);
		r && (e.currentTarget.setPointerCapture(e.pointerId), this.#y(), r.held = !0, r.omega = 0, this.#u = {
			id: e.pointerId,
			bob: r,
			startX: t.x - this.#e.shift(r),
			moved: !1,
			prev: r.phi,
			prevTime: e.timeStamp,
			spin: 0
		}, this.toggleAttribute("data-grabbing", !0), this.#g());
	}
	#C(e) {
		let t = this.#b(e), r = this.#u;
		if (r?.id === e.pointerId) {
			let n = t.x - r.startX;
			Math.abs(n) > 3 && (r.moved = !0);
			let i = Math.sin(h), a = Math.asin(f(n / this.#e.radius, -i, i)), o = Math.max(e.timeStamp - r.prevTime, 8) / 1e3;
			r.spin = r.spin * .4 + (a - r.prev) / o * .6, r.prev = a, r.prevTime = e.timeStamp, r.bob.phi = a, r.bob.omega = r.spin, this.#g();
			return;
		}
		if (e.pointerType !== "mouse" || n.matches) {
			this.#d = null;
			return;
		}
		let i = this.#x(t, 0) ?? null, a = this.#d;
		if (a && i && i !== a.over && !i.held) {
			let n = Math.max(e.timeStamp - a.t, 8) / 1e3, r = f((t.x - a.x) / n, -900, _);
			i.omega += g * r / this.#e.radius, this.#y(), this.#g();
		}
		this.#d = {
			x: t.x,
			t: e.timeStamp,
			over: i
		};
	}
	#w(e) {
		let t = this.#u;
		if (t?.id !== e.pointerId) return;
		let { bob: n } = t;
		if (n.held = !1, this.removeAttribute("data-grabbing"), t.moved) n.omega = e.timeStamp - t.prevTime > 60 ? 0 : f(t.spin, -d * 1.5, d * 1.5);
		else {
			let t = this.#b(e).x < n.center + this.#e.shift(n) ? 1 : -1;
			n.omega += t * d * v;
		}
		this.#u = null, this.#g();
	}
};
//#endregion
//#region src/components/cradle-text/index.js
t("cradle-text", w);
//#endregion
export { w as t };
