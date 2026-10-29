import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { a as r, n as i, t as a } from "./motion-CFWhFfc_.js";
//#region src/components/receipt-printer/receipt-printer.scss?inline
var o = ":host{border:1px solid var(--lw-color-border);background:var(--lw-color-muted);width:18rem;height:30rem;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);-webkit-user-select:none;user-select:none;border-radius:1.5rem;display:block;position:relative;overflow:hidden}p{margin:0}.sheet-box{position:absolute;inset:64px 0 0;overflow:hidden}:host([data-torn]) .sheet-box{overflow:visible}.paper{transform-origin:0 0;touch-action:none;background:#fff;width:14rem;margin-left:-7rem;position:absolute;top:0;left:50%;box-shadow:0 1px 2px #0000000f,0 8px 24px -12px #00000040;-webkit-mask:conic-gradient(from -45deg at 50% 100%,#0000,#000 1deg 89deg,#0000 90deg) 50% 100%/8px 4px repeat-x,linear-gradient(#000 0 0) 0 0/100% calc(100% - 4px) no-repeat;mask:conic-gradient(from -45deg at 50% 100%,#0000,#000 1deg 89deg,#0000 90deg) 50% 100%/8px 4px repeat-x,linear-gradient(#000 0 0) 0 0/100% calc(100% - 4px) no-repeat}:host([data-torn]) .paper{-webkit-mask:conic-gradient(from 135deg at 50% 0,#0000,#000 1deg 89deg,#0000 90deg) 50% 0/8px 4px repeat-x,conic-gradient(from -45deg at 50% 100%,#0000,#000 1deg 89deg,#0000 90deg) 50% 100%/8px 4px repeat-x,linear-gradient(#000 0 0) 0 4px/100% calc(100% - 8px) no-repeat;mask:conic-gradient(from 135deg at 50% 0,#0000,#000 1deg 89deg,#0000 90deg) 50% 0/8px 4px repeat-x,conic-gradient(from -45deg at 50% 100%,#0000,#000 1deg 89deg,#0000 90deg) 50% 100%/8px 4px repeat-x,linear-gradient(#000 0 0) 0 4px/100% calc(100% - 8px) no-repeat}:host([data-phase=hanging]) .paper{cursor:grab}:host([data-phase=hanging]) .paper:active,:host([data-phase=held]) .paper{cursor:grabbing}:host([data-phase=idle][data-torn]) .paper{visibility:hidden}.perforation{inset-inline:.25rem;border-top:2px dotted #d4d4d8;position:absolute;top:.25rem}:host([data-torn]) .perforation{display:none}.receipt{font:11px/15px var(--lw-font-mono);color:#27272a;padding:1.5rem 1.25rem 2rem}.name{font-size:var(--lw-text-xs);letter-spacing:.2em;text-align:center;font-weight:600}.center{text-align:center}.muted{color:#71717a}.rule{white-space:nowrap;color:#a1a1aa;margin-block:7px;overflow:hidden}.row{justify-content:space-between;gap:.75rem;display:flex}.item{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.num{font-variant-numeric:tabular-nums}.total{margin-top:.25rem;font-size:13px;font-weight:600}.barcode{justify-content:center;gap:1px;height:2.25rem;margin-top:1rem;display:flex}.barcode .ink{background:#27272a}.thanks{margin-top:.75rem}.printer{inset-inline:0;box-sizing:border-box;border-bottom:1px solid var(--lw-color-border);background:var(--lw-color-background);height:4rem;position:absolute;top:0}.bar{font-size:var(--lw-text-xs);justify-content:space-between;align-items:center;padding:1rem 1.25rem 0;display:flex}.merchant{font-weight:500}.status{color:var(--lw-color-muted-foreground)}.slot{inset-inline:2rem;border-radius:var(--lw-radius-full);background:var(--lightningcss-light,#18181b)var(--lightningcss-dark,#000);height:.25rem;position:absolute;bottom:.5rem}.tear{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.tear[hidden]{display:none}.tear:focus{clip:auto;clip-path:none;border-radius:var(--lw-radius-full);background:var(--lw-color-primary);width:auto;height:auto;font:var(--lw-text-xs) var(--lw-font-sans);color:var(--lw-color-primary-foreground);white-space:nowrap;border:0;margin:0;padding:.375rem .75rem;position:absolute;bottom:1rem;right:1rem;overflow:visible}.actions{inset-inline:0;justify-content:center;padding:1.25rem;transition:opacity .2s ease-out;display:flex;position:absolute;bottom:0}:host(:not([data-phase=idle])) .actions{opacity:0;pointer-events:none}", s = 64, c = 15, l = 34, u = .055, d = .05, f = 1 / 120, p = 2600, m = .996, h = 18, g = 72, _ = 900, v = .35, y = .02, b = {
	printing: "Printing…",
	hanging: "Pull down to tear"
}, x = [
	{
		name: "lower tee",
		quantity: 2,
		price: 24
	},
	{
		name: "LowerSoft mug",
		quantity: 1,
		price: 14
	},
	{
		name: "Sticker pack",
		quantity: 2,
		price: 4
	},
	{
		name: "Esc keycap",
		quantity: 1,
		price: 6
	}
], S = [
	2,
	1,
	1,
	3,
	1,
	2,
	2,
	1,
	3,
	1,
	1,
	2,
	1,
	1,
	2,
	3,
	1,
	2,
	1,
	1,
	3,
	2,
	1,
	1,
	2,
	1,
	3,
	1,
	1,
	2,
	2,
	1,
	1,
	3,
	1,
	2
], C = (e, t) => t * (1 - Math.exp(-e / t)), w = (e, t, n) => [e * Math.cos(n) - t * Math.sin(n), e * Math.sin(n) + t * Math.cos(n)], T = (e) => e.toFixed(2), E = class extends e {
	static styles = o;
	static props = {
		merchant: { default: "LowerSoft Store" },
		order: { default: "#4182" },
		date: { default: "14 Oct 2026 · 08:42" },
		items: {
			type: Object,
			default: x
		},
		tax: {
			type: Number,
			default: .08
		},
		currency: { default: "$" },
		manual: { type: Boolean }
	};
	#e = "idle";
	#t = !1;
	#n = !1;
	#r = !1;
	#i = 0;
	#a = {
		width: 0,
		height: 0,
		slotX: 0,
		cx: 0,
		cy: 0,
		pcx: 0,
		pcy: 0,
		angle: 0,
		spin: 0,
		hx: 0,
		hy: 0,
		hingeX: 0,
		hingeY: 0,
		hidden: 0,
		feedTarget: 0,
		pause: 0
	};
	#o = null;
	#s = a(f, {
		step: () => this.#_(),
		render: () => this.#x()
	});
	render() {
		return "<div class=\"sheet-box\"><div class=\"paper\" role=\"document\"><span class=\"perforation\" aria-hidden=\"true\"></span><div class=\"receipt\"></div></div></div>\n<div class=\"printer\"><div class=\"bar\"><span class=\"merchant\"></span><span class=\"status\" aria-live=\"polite\">Ready</span></div><div class=\"slot\"></div></div>\n<button class=\"tear\" type=\"button\">Tear off receipt</button>\n<div class=\"actions\"><lw-button class=\"print\">Print receipt</lw-button></div>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".paper");
		t.addEventListener("pointerdown", (e) => this.#T(e), e), t.addEventListener("pointermove", (e) => this.#E(e), e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, (e) => this.#D(e), e);
		this.query(".print").addEventListener("click", () => this.#e === "idle" && this.print(), e), this.query(".tear").addEventListener("click", () => this.#C(), e);
		let n = new IntersectionObserver(([e]) => {
			this.#r = e.isIntersecting, this.#d();
		}, { threshold: .4 });
		n.observe(this), document.addEventListener("visibilitychange", () => this.#d(), e), this.signal.addEventListener("abort", () => {
			n.disconnect(), this.#s.stop();
		});
	}
	updated() {
		this.#c(), this.query(".merchant").textContent = this.merchant ?? "", this.query(".paper").ariaLabel = `Receipt from ${this.merchant}, order ${this.order}`, this.#p(), this.#e === "idle" && !this.#t && this.#g(-this.#a.height), this.#m(), this.#u();
	}
	print() {
		let e = this.#a;
		this.#p(), this.#t = !1, this.emit("print"), i.matches ? (this.#g(0), this.#l("hanging"), this.#m()) : (e.hidden = e.feedTarget = e.height, e.pause = .25, this.#g(-e.hidden), this.#l("printing"), this.#m(), this.#f());
	}
	#c() {
		let e = this.items ?? [], t = e.reduce((e, t) => e + t.quantity * t.price, 0), r = t * this.tax, i = `<p class="rule" aria-hidden="true">${"- ".repeat(40)}</p>`, a = (e, t, n = "") => `<p class="row ${n}"><span>${e}</span><span class="num">${t}</span></p>`;
		this.query(".receipt").innerHTML = `<p class="name">${n((this.merchant ?? "").toUpperCase())}</p><p class="center muted">${n(this.date ?? "")}</p><p class="center muted">Order ${n(this.order ?? "")}</p>${i}${e.map((e) => a(`<span class="item">${e.quantity} × ${n(e.name)}</span>`, T(e.quantity * e.price))).join("")}${i}${a("Subtotal", T(t), "muted")}${a(`Tax ${Math.round(this.tax * 100)}%`, T(r), "muted")}${a("Total", `${n(this.currency ?? "")}${T(t + r)}`, "total")}<div class="barcode" aria-hidden="true">${S.map((e, t) => `<span${t % 2 ? "" : " class=\"ink\""} style="width: ${e}px"></span>`).join("")}</div><p class="center muted thanks">Thank you, come again</p>`;
	}
	#l(e) {
		this.#e = e, this.#u();
	}
	#u() {
		let e = this.#e;
		this.dataset.phase = e, this.toggleAttribute("data-torn", this.#t), this.query(".status").textContent = b[e] ?? "Ready";
		let t = this.query(".print");
		t.textContent = this.#t ? "Print another" : "Print receipt", t.disabled = e !== "idle", this.query(".tear").hidden = e !== "hanging";
	}
	#d() {
		!this.#r || document.hidden ? this.#s.stop() : (!this.manual && !this.#n && (this.#n = !0, this.print()), this.#f());
	}
	#f() {
		this.#r && !document.hidden && this.#s.wake();
	}
	#p() {
		let e = this.query(".paper");
		Object.assign(this.#a, {
			width: e.offsetWidth,
			height: e.offsetHeight,
			slotX: this.clientWidth / 2
		});
	}
	#m() {
		let e = this.#a, [t, n] = w(e.width / 2, e.height / 2, e.angle), r = e.cx - t - (e.slotX - e.width / 2), i = e.cy - n - s;
		this.query(".paper").style.transform = `translate3d(${r.toFixed(2)}px,${i.toFixed(2)}px,0) rotate(${e.angle.toFixed(4)}rad)`;
	}
	#h(e) {
		let t = this.#a, [n, r] = w(t.width / 2 - t.hingeX, t.height / 2 - t.hingeY, e);
		return [t.hx + n, t.hy + r];
	}
	#g(e) {
		let t = this.#a;
		Object.assign(t, {
			hingeX: t.width / 2,
			hingeY: 0,
			hx: t.slotX,
			hy: s + e
		});
		let [n, r] = this.#h(0);
		Object.assign(t, {
			cx: n,
			cy: r,
			pcx: n,
			pcy: r,
			angle: 0
		});
	}
	#_() {
		this.#i = this.#e === "printing" ? this.#v() : this.#e === "falling" ? this.#b() : this.#e === "hanging" || this.#e === "held" ? this.#y() : 0;
	}
	#v() {
		let e = this.#a;
		e.pause > 0 ? e.pause -= f : e.feedTarget > 0 && (e.feedTarget = Math.max(0, e.feedTarget - c), e.pause = u + Math.random() * d), e.hidden += (e.feedTarget - e.hidden) * Math.min(1, l * f), Math.abs(e.hidden - e.feedTarget) < .05 && (e.hidden = e.feedTarget), this.#g(-e.hidden);
		let t = e.pause > 0 ? 0 : Math.sin(performance.now() / 9) * .4;
		return this.query(".printer").style.transform = t ? `translate3d(${t.toFixed(2)}px,0,0)` : "", e.hidden === 0 && e.feedTarget === 0 ? (this.query(".printer").style.transform = "", this.#l("hanging"), 0) : 1;
	}
	#y() {
		let e = this.#a, t = (e.cx - e.pcx) * m, n = (e.cy - e.pcy) * m;
		e.pcx = e.cx, e.pcy = e.cy, e.cx += t, e.cy += n + p * f * f;
		let r = Math.hypot(e.width / 2 - e.hingeX, e.height / 2 - e.hingeY), i = e.cx - e.hx, a = e.cy - e.hy, o = Math.hypot(i, a) || 1;
		return e.cx = e.hx + i / o * r, e.cy = e.hy + a / o * r, e.angle = Math.atan2(e.cy - e.hy, e.cx - e.hx) - Math.atan2(e.height / 2 - e.hingeY, e.width / 2 - e.hingeX), Math.abs(t) + Math.abs(n);
	}
	#b() {
		let e = this.#a, t = (e.cx - e.pcx) * m, n = (e.cy - e.pcy) * m;
		return t += Math.sin(e.angle) * Math.max(n, 0) * v * f * 10, e.pcx = e.cx, e.pcy = e.cy, e.cx += t, e.cy += n + p * f * f, e.angle += e.spin * f, e.spin *= .995, e.cy > this.clientHeight + Math.hypot(e.width, e.height) / 2 ? 0 : 1;
	}
	#x() {
		return this.#m(), this.#e === "falling" && this.#i === 0 ? (this.#l("idle"), !1) : this.#e === "printing" || this.#e === "falling" || !!this.#o || this.#i > y;
	}
	#S(e) {
		this.#t = !0, r(14), this.emit("tear"), i.matches || this.query(".printer").animate([{ transform: "translate3d(0,1.5px,0)" }, { transform: "none" }], {
			duration: 220,
			easing: "cubic-bezier(0.23, 1, 0.32, 1)"
		}), this.#l(i.matches ? "idle" : e ? "held" : "falling"), this.#f();
	}
	#C() {
		this.#e === "hanging" && (this.#a.spin = 1.2, this.#a.pcy = this.#a.cy - 3, this.#S(!1), this.query(".print").focus());
	}
	#w(e) {
		let t = this.getBoundingClientRect();
		return {
			x: e.clientX - t.left,
			y: e.clientY - t.top
		};
	}
	#T(e) {
		if (this.#e !== "hanging" || e.pointerType === "mouse" && e.button !== 0) return;
		let t = this.#a, { x: n, y: r } = this.#w(e);
		e.currentTarget.setPointerCapture?.(e.pointerId);
		let [i, a] = w(t.width / 2, t.height / 2, t.angle), [o, s] = w(n - (t.cx - i), r - (t.cy - a), -t.angle);
		this.#o = {
			id: e.pointerId,
			startX: n,
			startY: r,
			grabX: o,
			grabY: s,
			samples: [{
				t: e.timeStamp,
				x: n,
				y: r
			}]
		}, this.#f();
	}
	#E(e) {
		let t = this.#o;
		if (t?.id !== e.pointerId) return;
		let n = this.#a, { x: r, y: i } = this.#w(e);
		if (t.samples.push({
			t: e.timeStamp,
			x: r,
			y: i
		}), t.samples.length > 5 && t.samples.shift(), this.#e === "hanging") {
			if (i - t.startY > g) Object.assign(n, {
				hingeX: t.grabX,
				hingeY: t.grabY,
				hx: r,
				hy: i
			}), this.#S(!0);
			else {
				Object.assign(n, {
					hingeX: n.width / 2,
					hingeY: 0,
					hx: n.slotX,
					hy: s + C(Math.max(0, i - t.startY), h)
				});
				let e = -Math.atan2(r - n.slotX - (t.grabX - n.width / 2), Math.max(t.grabY, 24)) * .7, [a, o] = this.#h(e);
				Object.assign(n, {
					pcx: n.cx,
					pcy: n.cy,
					cx: a,
					cy: o,
					angle: e
				});
			}
		} else this.#e === "held" && (n.hx = r, n.hy = i);
		this.#f();
	}
	#D(e) {
		let t = this.#o;
		if (t?.id !== e.pointerId) return;
		this.#o = null;
		let n = this.#a, r = t.samples[0], i = t.samples.at(-1), a = Math.max((i.t - r.t) / 1e3, .016), o = (i.x - r.x) / a, c = (i.y - r.y) / a;
		if (this.#e === "held") {
			let e = n.angle;
			this.#y(), n.spin = (n.angle - e) / f + o * .002, n.pcx = n.cx - o * f * .6, n.pcy = n.cy - c * f * .6, this.#l("falling");
		} else this.#e === "hanging" && c > _ ? (n.pcx = n.cx - o * f * .5, n.pcy = n.cy - c * f * .5, n.spin = o * .004, this.#S(!1)) : this.#e === "hanging" && (n.hy = s, n.pcx = n.cx, n.pcy = n.cy);
		this.#f();
	}
};
//#endregion
//#region src/components/receipt-printer/index.js
t("receipt-printer", E);
//#endregion
export { E as t };
