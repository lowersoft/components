import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./motion-CFWhFfc_.js";
import { t as i } from "./visibility--H4IXDjD.js";
import { n as a } from "./text-C4ocnqBV.js";
//#region src/components/dynamic-text/dynamic-text.scss?inline
var o = ":host{font-variant-numeric:tabular-nums;white-space:pre;display:inline-block}[hidden]{display:none!important}.live{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.morph{vertical-align:baseline;display:inline-block;position:relative}.measure{visibility:hidden;pointer-events:none;position:absolute;top:0;left:0}.strut{width:0;display:inline-block}.glyph{transform-origin:50% 80%;will-change:transform, opacity;position:absolute;top:0;left:0}.decode{font-family:var(--lw-font-mono)}.cell{text-align:center;width:1ch;display:inline-block}.cell[data-scramble]{opacity:.45}.cell[data-flash]{color:var(--lw-color-accent)}", s = 1 / 120, c = (e, t) => 2 * t * Math.sqrt(e), l = {
	k: 140,
	c: c(140, .8)
}, u = {
	k: 300,
	c: c(300, .9)
}, d = {
	k: 200,
	c: c(200, .86)
}, f = {
	k: 1400,
	c: c(1400, .6)
}, p = {
	k: 140,
	c: c(140, .7)
}, m = {
	k: 220,
	c: c(220, 1)
}, h = 32, g = .7, _ = .9, v = .75, y = -.16, b = .035, x = .45, S = 7, C = (e) => e >= "0" && e <= "9", w = (e) => e.trim() === "", T = (e) => Math.min(1, Math.max(0, e));
function E(e) {
	let t = 1 + e.sq, n = 1 - e.sq * .6;
	e.el.style.transform = `translate3d(${e.x.toFixed(2)}px, ${e.y.toFixed(2)}px, 0) rotate(${e.r.toFixed(2)}deg) scale(${n.toFixed(3)}, ${t.toFixed(3)})`, e.el.style.opacity = e.o.toFixed(3);
}
function D(e, t) {
	(e.sq !== 0 || e.vsq !== 0) && (e.vsq += (-f.k * e.sq - f.c * e.vsq) * t, e.sq += e.vsq * t, Math.abs(e.sq) < .001 && Math.abs(e.vsq) < .01 && (e.sq = e.vsq = 0));
}
function O(e, t, n) {
	switch (e.phase) {
		case "travel": {
			let n = Math.abs(e.tx - e.x0), r = n < .5 ? 1 : T(1 - Math.abs(e.tx - e.x) / n);
			e.ty = e.arc * 4 * r * (1 - r), e.vx += (-l.k * (e.x - e.tx) - l.c * e.vx) * t, e.x += e.vx * t, e.vy += (-u.k * (e.y - e.ty) - u.c * e.vy) * t, e.y += e.vy * t, e.o = Math.min(1, e.o + S * t);
			break;
		}
		case "drop":
			e.vy += h * n * t, e.y += e.vy * t, e.y >= 0 && (e.y = e.vy = 0, e.sq = y, e.phase = "rest"), e.o = T(1 + e.y / (g * n));
			break;
		case "fall":
			e.vy += h * n * t, e.y += e.vy * t, e.x += e.vx * t, e.vr += (-p.k * (e.r - e.tr) - p.c * e.vr) * t, e.r += e.vr * t, e.o = Math.min(e.o, T(1 - e.y / (_ * n)));
			break;
		case "roll":
			e.vy += (-d.k * (e.y - e.ty) - d.c * e.vy) * t, e.y += e.vy * t, e.o = T(1 - Math.abs(e.y) / (v * n));
			break;
		case "fade": e.o = T(e.o + (e.leaving ? -7 : S) * t);
	}
	D(e, t);
}
var k = (e) => e.leaving && e.o <= .002;
function A(e) {
	if (e.leaving) return !k(e);
	let t = Math.abs(e.x - e.tx) < .05 && Math.abs(e.vx) < .5 && Math.abs(e.y) < .05 && Math.abs(e.vy) < .5;
	return ((e.phase === "travel" || e.phase === "roll") && t || e.phase === "fade" && e.o >= 1) && Object.assign(e, {
		x: e.tx,
		y: 0,
		vx: 0,
		vy: 0,
		o: 1,
		phase: "rest"
	}), e.phase !== "rest" || e.sq !== 0;
}
var j = (e) => Number(e.filter((e) => e.digit).map((e) => e.char).join("")), M = class {
	glyphs = [];
	order = [];
	reduced = !1;
	#e;
	#t;
	#n = !1;
	#r = 16;
	#i = 0;
	#a = 0;
	#o = 0;
	#s = 0;
	#c = !1;
	#l = r(s, {
		step: () => this.#h(),
		render: () => this.#g()
	});
	constructor(e, t) {
		this.#e = e, this.#t = t;
	}
	update(e) {
		this.#r = parseFloat(getComputedStyle(this.#e).fontSize) || 16;
		let { tokens: t, width: n } = this.#u(e, !0);
		if (!this.#n) {
			this.#n = !0, this.order = t.map((e) => this.#d(e)), this.#i = this.#o = n, this.#_();
			return;
		}
		let r = this.reduced, i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
		for (let e of this.order) e.digit ? a.set(e.slot, e) : i.set(e.char, [...i.get(e.char) ?? [], e]);
		let o = j(t) < j(this.order) ? -1 : 1, s = [], c = 0;
		for (let e of t) {
			let t;
			if (e.digit ? (t = a.get(e.slot), a.delete(e.slot)) : t = i.get(e.char)?.shift(), t && t.char === e.char) {
				this.#f(t, e, r), s.push(t);
				continue;
			}
			t && this.#m(t, o, r);
			let n = this.#d(e);
			this.#p(n, o, r, c++), s.push(n);
		}
		let l = c * b;
		l > x && s.forEach((e) => e.delay *= x / l);
		for (let e of i.values()) e.forEach((e) => this.#m(e, o, r));
		for (let e of a.values()) this.#m(e, o, r);
		this.order = s, this.#o = n, r && (this.#i = n, this.#a = 0, this.#_()), this.#l.wake();
	}
	place(e) {
		this.#r = parseFloat(getComputedStyle(this.#e).fontSize) || 16;
		let { tokens: t, width: n } = this.#u(e, !1);
		t.length === this.order.length && (t.forEach((e, t) => {
			let n = this.order[t];
			n.tx = e.x, n.phase === "rest" && (n.x = e.x, E(n));
		}), this.#o = n, this.#c || (this.#i = n, this.#_()));
	}
	stop() {
		this.#l.stop();
	}
	#u(e, t) {
		let n = a(e);
		t && this.#t.replaceChildren(...n.map((e) => Object.assign(document.createElement("span"), { textContent: e })));
		let r = this.#t.children, i = [];
		n.forEach((e, t) => {
			r[t] && !w(e) && i.push({
				char: e,
				x: r[t].offsetLeft,
				digit: C(e),
				slot: 0
			});
		});
		let o = 0;
		for (let e = i.length - 1; e >= 0; e--) i[e].digit && (i[e].slot = o++);
		return {
			tokens: i,
			width: this.#t.offsetWidth
		};
	}
	#d(e) {
		let t = Object.assign(document.createElement("span"), {
			className: "glyph",
			textContent: e.char
		}), n = {
			id: this.#s++,
			char: e.char,
			digit: e.digit,
			slot: e.slot,
			el: t,
			phase: "rest",
			leaving: !1,
			delay: 0,
			x: e.x,
			vx: 0,
			tx: e.x,
			x0: e.x,
			arc: 0,
			y: 0,
			vy: 0,
			ty: 0,
			r: 0,
			vr: 0,
			tr: 0,
			sq: 0,
			vsq: 0,
			o: 1
		};
		return this.glyphs.push(n), this.#e.append(t), E(n), n;
	}
	#f(e, t, n) {
		if (e.slot = t.slot, e.tx = t.x, n) {
			Object.assign(e, {
				x: t.x,
				y: 0,
				vx: 0,
				vy: 0,
				phase: e.o < 1 ? "fade" : "rest"
			});
			return;
		}
		if (e.phase === "rest" && Math.abs(t.x - e.x) < .5) {
			e.x = t.x;
			return;
		}
		let r = t.x - e.x;
		Object.assign(e, {
			x0: e.x,
			delay: 0,
			arc: -Math.sign(r) * Math.min(.22 * this.#r, Math.abs(r) * .14),
			phase: "travel"
		});
	}
	#p(e, t, n, r) {
		e.o = 0, n ? e.phase = "fade" : e.digit ? Object.assign(e, {
			y: t * v * this.#r,
			ty: 0,
			phase: "roll"
		}) : Object.assign(e, {
			y: -.7 * this.#r,
			phase: "drop",
			delay: r * b
		}), E(e);
	}
	#m(e, t, n) {
		if (e.leaving = !0, e.delay = 0, n) e.phase = "fade";
		else if (e.digit) Object.assign(e, {
			phase: "roll",
			ty: -t * v * 1.2 * this.#r
		});
		else {
			let t = e.x + this.#r * .3 < this.#o / 2 ? -1 : 1;
			Object.assign(e, {
				tr: t * (5 + e.id * 7 % 11),
				vx: t * .4 * this.#r,
				vy: Math.max(e.vy, 0),
				phase: "fall"
			});
		}
	}
	#h() {
		let e = !1;
		for (let t of this.glyphs) t.delay > 0 ? (t.delay -= s, e = !0) : (O(t, s, this.#r), A(t) && (e = !0));
		Math.abs(this.#i - this.#o) >= .1 || Math.abs(this.#a) >= .1 ? (this.#a += (-m.k * (this.#i - this.#o) - m.c * this.#a) * s, this.#i += this.#a * s, e = !0) : (this.#i = this.#o, this.#a = 0), this.#c = e;
	}
	#g() {
		for (let e of this.glyphs) E(e);
		if (this.#_(), this.glyphs.some(k)) {
			for (let e of this.glyphs) k(e) && e.el.remove();
			this.glyphs = this.glyphs.filter((e) => !k(e));
		}
		return this.#c;
	}
	#_() {
		this.#e.style.width = `${this.#i.toFixed(2)}px`;
	}
}, N = {
	morph: 2200,
	decode: 2800,
	cycle: 900
}, P = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=<>/", F = "abcdefghijklmnopqrstuvwxyz#%&*+=<>/", I = "0123456789", L = .05, R = .05, z = (e) => C(e) ? I : e.toLowerCase() === e ? F : P, B = (e) => e[Math.floor(Math.random() * e.length)], V = (e, t, n, r) => e !== "cycle" || t === 0 ? r : t === n - 1 ? r * 2 : Math.max(90, r * .36 * .8 ** (t - 1)), H = class extends e {
	static styles = o;
	static props = {
		mode: {
			default: "morph",
			reflect: !0
		},
		text: {},
		interval: { type: Number },
		noLoop: { type: Boolean }
	};
	#e = [];
	#t = 0;
	#n = null;
	#r = !1;
	#i = 0;
	#a = null;
	#o = null;
	#s = null;
	render() {
		return "<span class=\"live\"></span><span class=\"morph\" aria-hidden=\"true\"><span class=\"measure\"></span><span class=\"strut\">​</span></span><span class=\"decode\" aria-hidden=\"true\" hidden></span>";
	}
	connected() {
		let e = this.query(".morph"), t = this.query(".measure");
		this.#a ??= new M(e, t);
		let n = new MutationObserver((e) => {
			e.some(({ type: e, target: t }) => e !== "attributes" || t !== this) && this.#f();
		});
		n.observe(this, {
			childList: !0,
			subtree: !0,
			characterData: !0,
			attributes: !0
		});
		let r = new ResizeObserver(() => this.#n && this.mode !== "decode" && this.#a.place(this.#n.text));
		r.observe(t), i(this, (e) => {
			this.#r = e, this.#m();
		}, this.signal), this.signal.addEventListener("abort", () => {
			n.disconnect(), r.disconnect(), clearTimeout(this.#i), this.#a.stop(), this.#h();
		}), this.#f();
	}
	updated(e) {
		e.has("mode") && (this.query(".morph").hidden = this.mode === "decode", this.query(".decode").hidden = this.mode !== "decode", this.query(".live").ariaLive = this.mode === "cycle" ? "off" : "polite"), [
			"mode",
			"text",
			"interval",
			"noLoop"
		].some((t) => e.has(t)) && this.#p(!0);
	}
	get #c() {
		return this.interval ?? N[this.mode] ?? N.morph;
	}
	get #l() {
		let e = Math.max(this.#e.length, 1);
		return this.noLoop ? Math.min(this.#t, e - 1) : this.#t % e;
	}
	get #u() {
		return this.text != null;
	}
	get #d() {
		return !this.#u && this.noLoop && this.#l === this.#e.length - 1;
	}
	#f() {
		this.#e = [...this.children].map((e) => ({
			text: e.textContent.trim(),
			lang: e.lang || void 0
		})).filter(({ text: e }) => e), this.#p(!0);
	}
	#p(e = !1) {
		if (!this.isConnected) return;
		let t = this.#u ? { text: this.text } : this.#e[this.#l] ?? { text: "" };
		(e || t.text !== this.#n?.text) && (this.#n = t, t.lang ? this.setAttribute("lang", t.lang) : this.removeAttribute("lang"), this.query(".live").textContent = t.text, this.mode === "decode" ? this.#g(t.text) : (this.#a.reduced = n.matches, this.#a.update(t.text))), this.#m();
	}
	#m() {
		clearTimeout(this.#i), !(this.#u || this.#d || !this.#r || this.#e.length < 2) && (this.#i = setTimeout(() => {
			this.#t += 1, this.#p(), this.#d && this.emit("complete");
		}, V(this.mode, this.#l, this.#e.length, this.#c)));
	}
	#h() {
		this.#o &&= (cancelAnimationFrame(this.#o.frame), this.#o.cells.forEach((e) => e.finish()), null);
	}
	#g(e) {
		this.#h();
		let t = this.query(".decode"), r = a(e);
		for (; t.children.length < r.length;) t.append(Object.assign(document.createElement("span"), { className: "cell" }));
		for (; t.children.length > r.length;) t.lastElementChild.remove();
		let i = [...t.children];
		i.forEach((e, t) => {
			e.textContent = r[t], e.removeAttribute("data-scramble"), e.removeAttribute("data-flash");
		});
		let o = this.#s;
		if (this.#s = r, !this.#r || !o) return;
		let s = r.map((e, t) => ({
			char: e,
			i: t
		})).filter(({ char: e, i: t }) => !w(e) && o[t] !== e);
		if (s.length === 0) return;
		if (n.matches) {
			t.animate({ opacity: [0, 1] }, {
				duration: 160,
				easing: "ease-out"
			});
			return;
		}
		let c = Math.min(.05, .75 / s.length), l = s.map(({ char: e, i: t }, n) => {
			let r = i[t];
			r.setAttribute("data-scramble", "");
			let a = "scramble", o = 0, s = .15 + n * c;
			return {
				get done() {
					return a === "done";
				},
				step(t) {
					a === "flash" ? t >= s + R && this.finish() : t >= s ? (r.textContent = e, r.removeAttribute("data-scramble"), r.setAttribute("data-flash", ""), a = "flash") : t >= o && (r.textContent = B(z(e)), o = t + L);
				},
				finish() {
					r.textContent = e, r.removeAttribute("data-scramble"), r.removeAttribute("data-flash"), a = "done";
				}
			};
		}), u = {
			cells: l,
			frame: 0
		}, d = 0, f = (e) => {
			d ||= e;
			let t = (e - d) / 1e3;
			l.forEach((e) => e.step(t)), l.every((e) => e.done) ? this.#o = null : u.frame = requestAnimationFrame(f);
		};
		u.frame = requestAnimationFrame(f), this.#o = u;
	}
};
//#endregion
//#region src/components/dynamic-text/index.js
t("dynamic-text", H);
//#endregion
export { H as t };
