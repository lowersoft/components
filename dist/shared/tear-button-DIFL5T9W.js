import { n as e, t } from "./core-WcEz9YgG.js";
import { a as n, n as r, t as i } from "./motion-CFWhFfc_.js";
//#region src/components/tear-button/tear-button.scss?inline
var a = ":host{--_bg:var(--lw-color-primary);--_fg:var(--lw-color-primary-foreground);--_border:transparent}:host([variant=secondary]){--_bg:var(--lw-color-secondary);--_fg:var(--lw-color-secondary-foreground)}:host([variant=outline]){--_bg:transparent;--_fg:var(--lw-color-foreground);--_border:var(--lw-color-border)}:host([variant=ghost]){--_bg:transparent;--_fg:var(--lw-color-foreground)}:host([variant=destructive]){--_bg:var(--lw-color-destructive);--_fg:var(--lw-color-destructive-foreground)}:host{--_height:4.25rem;--_body:14.75rem;--_stub:4.75rem;width:calc(var(--_body) + var(--_stub));height:var(--_height);-webkit-user-select:none;user-select:none;vertical-align:middle;display:inline-block;position:relative}:host([status=flying]){z-index:1}.body,.stub{border:1px solid var(--_border);background:var(--_bg);color:var(--_fg);position:absolute;inset-block:0}.body{width:var(--_body);border-right:0;border-radius:1rem 0 0 1rem;align-items:center;gap:.75rem;padding-inline:1rem;display:flex;left:0;-webkit-mask:radial-gradient(circle at 100% 0,#0000 7px,#000 7.5px) top/100% 51% no-repeat,radial-gradient(circle at 100% 100%,#0000 7px,#000 7.5px) bottom/100% 51% no-repeat;mask:radial-gradient(circle at 100% 0,#0000 7px,#000 7.5px) top/100% 51% no-repeat,radial-gradient(circle at 100% 100%,#0000 7px,#000 7.5px) bottom/100% 51% no-repeat}.chip{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--_fg) 12%, transparent);width:2.25rem;height:2.25rem;transition:background-color .3s var(--lw-ease-out), color .3s var(--lw-ease-out);flex:none;justify-content:center;align-items:center;display:flex}:host(:is([status=flying],[status=torn])) .chip{background:var(--_fg);color:var(--_bg)}.icon,::slotted(svg){width:1rem;height:1rem}.check,:host(:is([status=flying],[status=torn])) .chip slot{display:none}:host(:is([status=flying],[status=torn])) .check{display:block}.lines{flex:1;min-width:0;display:grid}.line{min-width:0;transition:opacity .3s var(--lw-ease-out);grid-area:1/1}@media (prefers-reduced-motion:no-preference){.line{transition:opacity .3s var(--lw-ease-out), filter .3s var(--lw-ease-out), translate .3s var(--lw-ease-out)}}.done,:host(:is([status=flying],[status=torn])) .ask{opacity:0;filter:blur(3px);pointer-events:none;translate:0 .25rem}:host(:is([status=flying],[status=torn])) .done{opacity:1;filter:none;translate:0}.title,.sub{text-overflow:ellipsis;white-space:nowrap;display:block;overflow:hidden}.title{font-size:var(--lw-text-sm);font-weight:500}.sub{color:color-mix(in oklab, var(--_fg) 60%, transparent);font-size:var(--lw-text-xs)}.stub{left:var(--_body);width:var(--_stub);color:color-mix(in oklab, var(--_fg) 65%, transparent);font:inherit;font-size:var(--lw-text-xs);cursor:grab;touch-action:none;transform-origin:0 100%;transition:opacity .3s var(--lw-ease-out), translate .3s var(--lw-ease-out);border-left:0;border-radius:0 1rem 1rem 0;flex-direction:column;justify-content:center;align-items:center;gap:.25rem;padding:0;font-weight:500;display:flex;-webkit-mask:radial-gradient(circle at 0 0,#0000 7px,#000 7.5px) top/100% 51% no-repeat,radial-gradient(circle at 0 100%,#0000 7px,#000 7.5px) bottom/100% 51% no-repeat;mask:radial-gradient(circle at 0 0,#0000 7px,#000 7.5px) top/100% 51% no-repeat,radial-gradient(circle at 0 100%,#0000 7px,#000 7.5px) bottom/100% 51% no-repeat}@starting-style{.stub{opacity:0;translate:-.75rem}}.stub:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:-5px}:host([status=tearing]) .stub{cursor:grabbing}:host([status=torn]) .stub{display:none}.perforation{inset-block:.625rem;border-left:2px dotted color-mix(in oklab, var(--_fg) 35%, transparent);position:absolute;left:0}.live{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", o = 34, s = 7, c = .55, l = .3, u = {
	stiffness: 900,
	damping: 42
}, d = {
	stiffness: 520,
	damping: 22
}, f = 2600, p = 220, m = 1 / 120, h = 180, g = [
	1.6,
	.4,
	2.2,
	.9,
	1.8,
	.2,
	2.4,
	1.1,
	.5,
	2,
	1.4,
	.3,
	2.3,
	.8,
	1.7,
	.1,
	2.1,
	1.2,
	.6,
	1.9
], _ = "viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"", v = `<svg class="icon" ${_}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>`, y = `<svg class="icon check" ${_}><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`, b = `<svg class="icon" ${_}><path d="M6 6c6 0 12 3 12 11M14 14l4 4 4-4"/></svg>`, x = (e, t, n) => Math.min(Math.max(e, t), n), S = (e) => e * 180 / Math.PI, C = (e) => {
	let t = x(e, 0, 1) * s, n = Math.min(Math.floor(t), 6), r = t - n;
	return (n + (r < c ? r / c * l : l + (r - c) / .44999999999999996 * .7)) / s;
}, w = (e, t, n, r) => {
	let i = r === 1 ? t : 0, a = r === 1 ? 0 : t, o = Math.ceil(e / n * g.length), s = [`${a}px 0`];
	for (let t = 0; t <= o; t++) {
		let a = Math.min(t / g.length * n, e);
		s.push(`${(i - r * g[t % g.length]).toFixed(1)}px ${a.toFixed(1)}px`);
	}
	return s.push(`${i}px ${e.toFixed(1)}px`, `${i}px ${n}px`, `${a}px ${n}px`), `polygon(${s.join(",")})`;
}, T = class extends e {
	static styles = a;
	static props = {
		variant: {
			default: "primary",
			reflect: !0
		},
		status: {
			default: "idle",
			reflect: !0
		},
		label: { default: "Delete workspace" },
		description: { default: "Tear off the stub to confirm" },
		stubLabel: { default: "Tear" },
		confirmedLabel: { default: "Workspace deleted" },
		confirmedDescription: { default: "Kept in trash for 30 days" },
		resetAfter: {
			type: Number,
			default: 2400
		}
	};
	#e = null;
	#t = null;
	#n = null;
	#r = i(m, {
		step: () => this.#h(),
		render: (e) => this.#g(e)
	});
	#i = 0;
	#a = 0;
	#o = null;
	render() {
		return `<div class="body" part="body"><span class="chip" aria-hidden="true"><slot name="icon">${v}</slot>${y}</span><span class="lines"><span class="line ask"><span class="title"></span><span class="sub"></span></span><span class="line done" aria-hidden="true"><span class="title"></span><span class="sub"></span></span></span></div><button class="stub" part="stub" type="button"><span class="perforation"></span>${b}<span class="stub-label"></span></button><span class="live" aria-live="polite"></span>`;
	}
	connected() {
		this.#e = this.query(".body"), this.#t = this.query(".stub"), this.#s();
		let e = { signal: this.signal }, t = () => this.#m();
		this.#t.addEventListener("pointerdown", this.#d, e), this.#t.addEventListener("pointermove", this.#f, e), this.#t.addEventListener("keydown", this.#p, e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) this.#t.addEventListener(n, t, e);
		this.signal.addEventListener("abort", () => {
			this.#r.stop(), clearTimeout(this.#i), clearTimeout(this.#a), this.status !== "idle" && this.#C();
		});
	}
	updated(e) {
		let t = this.shadowRoot.querySelectorAll(".line");
		for (let [n, [r, i]] of Object.entries({
			label: [0, ".title"],
			description: [0, ".sub"],
			confirmedLabel: [1, ".title"],
			confirmedDescription: [1, ".sub"]
		})) e.has(n) && (t[r].querySelector(i).textContent = this[n]);
		e.has("stubLabel") && (this.query(".stub-label").textContent = this.stubLabel), (e.has("label") || e.has("description")) && (this.#t.ariaLabel = `${this.label}: ${this.description}`);
	}
	#s() {
		this.#o = {
			angle: 0,
			speed: 0,
			target: 0,
			held: !1,
			auto: !1,
			flying: !1,
			grab: 0,
			hole: 0
		}, this.#o.hand = {
			x: 0,
			y: 0,
			t: 0,
			vx: 0,
			vy: 0
		};
	}
	#c() {
		let { left: e, top: t } = this.getBoundingClientRect();
		return {
			x: e + this.#n.body,
			y: t + this.#n.height
		};
	}
	#l(e) {
		let t = this.#c();
		return S(Math.atan2(e.clientY - t.y, e.clientX - t.x));
	}
	#u() {
		this.#n = {
			body: this.#e.offsetWidth,
			stub: this.#t.offsetWidth,
			height: this.offsetHeight
		};
	}
	#d = (e) => {
		if (this.status === "flying" || this.status === "torn" || e.pointerType === "mouse" && e.button !== 0) return;
		e.preventDefault(), this.#t.focus(), this.#t.setPointerCapture(e.pointerId), this.#u();
		let t = this.#o;
		t.grab = this.#l(e) - t.angle, t.held = !0, t.hand = {
			x: e.clientX,
			y: e.clientY,
			t: e.timeStamp,
			vx: 0,
			vy: 0
		}, this.status = "tearing", this.#r.wake();
	};
	#f = (e) => {
		let t = this.#o;
		if (!t.held) return;
		let { hand: n } = t, r = e.timeStamp - n.t;
		r > 0 && (n.vx = n.vx * .5 + (e.clientX - n.x) / r * 500, n.vy = n.vy * .5 + (e.clientY - n.y) / r * 500), Object.assign(n, {
			x: e.clientX,
			y: e.clientY,
			t: e.timeStamp
		});
		let i = this.#l(e) - t.grab, a = i < 0 ? i * .15 : i;
		t.target = a >= o ? o * 1.05 : C(Math.max(a, 0) / o) * o + Math.min(a, 0), this.#r.wake();
	};
	#p = (e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), !(this.status !== "idle" || e.repeat) && (this.#u(), this.#o.auto = !0, this.#o.target = 0, this.status = "tearing", this.#r.wake()));
	};
	#m() {
		this.#o.held && (this.#o.held = !1, this.#o.target = 0, this.#r.wake());
	}
	#h() {
		let e = this.#o;
		return e.flying ? this.#v() : e.auto ? (e.target = Math.min(e.target + m * 60, o * 1.05), this.#_()) : this.#_() && e.held;
	}
	#g(e) {
		let t = this.#o;
		return t.flying ? (this.#b(), !e || (this.#S(), !1)) : (this.#y(), e ? (t.auto = !1, this.#x()) : t.held || t.auto || Math.abs(t.angle) >= .02 || Math.abs(t.speed) >= .05 ? !0 : (this.#s(), this.#y(), this.status = "idle", !1));
	}
	#_() {
		let e = this.#o, { stiffness: t, damping: r } = e.held || e.auto ? u : d;
		e.speed += ((e.target - e.angle) * t - e.speed * r) * m, e.angle += e.speed * m;
		let i = Math.floor(x(e.angle / o, 0, 1) * s);
		return i > e.hole && n(3), e.hole = i, e.angle >= o * .995;
	}
	#v() {
		let e = this.#o;
		return e.vy += f * m, e.x += e.vx * m, e.y += e.vy * m, e.angle += e.spin * m, e.y > p;
	}
	#y() {
		let { body: e, stub: t, height: n } = this.#n, r = x(this.#o.angle / o, 0, 1) * n;
		this.#e.style.clipPath = r > .5 ? w(r, e, n, 1) : "", this.#t.style.clipPath = r > .5 ? w(r, t, n, -1) : "", this.#t.style.transform = `rotate(${this.#o.angle.toFixed(2)}deg)`;
	}
	#b() {
		let { x: e, y: t, angle: n } = this.#o, r = x(1 - (t - p * .5) / (p * .5), 0, 1);
		this.#t.style.transform = `translate(${e.toFixed(1)}px, ${t.toFixed(1)}px) rotate(${n.toFixed(1)}deg)`, this.#t.style.opacity = r.toFixed(3);
	}
	#x() {
		let e = this.#o;
		e.held = !1, n(14);
		let t = e.angle * Math.PI / 180, i = e.speed * Math.PI / 180 * this.#n.height;
		return Object.assign(e, {
			flying: !0,
			x: 0,
			y: 0,
			vx: Math.cos(t) * i + x(e.hand.vx, -900, 900) * .6 + 90,
			vy: Math.sin(t) * i + x(e.hand.vy, -900, 900) * .6 - 120,
			spin: e.speed * .6 + 140
		}), this.#t.style.transition = "none", this.status = "flying", this.query(".live").textContent = this.confirmedLabel, this.emit("confirm"), !r.matches || (this.#t.style.transition = `opacity ${h}ms ease-out`, this.#t.style.opacity = "0", this.#a = setTimeout(() => this.#S(), h), !1);
	}
	#S() {
		this.status = "torn", this.resetAfter > 0 && (this.#i = setTimeout(() => this.#C(), this.resetAfter));
	}
	#C() {
		this.#s(), this.#e.style.clipPath = "", this.#t.removeAttribute("style"), this.query(".live").textContent = "", this.status = "idle";
	}
};
//#endregion
//#region src/components/tear-button/index.js
t("tear-button", T);
//#endregion
export { T as t };
