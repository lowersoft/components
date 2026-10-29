import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./dom-Dlk1FlsZ.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { i as a, n as o, r as s } from "./motion-CFWhFfc_.js";
import { M as c, N as l, P as u, Q as d, _ as f, dt as p, nt as m, q as h, ut as g, xt as _ } from "./lucide-BVbUPHVq.js";
//#region src/components/toolbar/tools.js
var v = [
	{
		id: "select",
		label: "Select",
		icon: d,
		shortcut: "V",
		cursor: "default"
	},
	{
		id: "hand",
		label: "Hand",
		icon: u,
		shortcut: "H",
		cursor: "grab"
	},
	{
		id: "shapes",
		label: "Shapes",
		icon: p,
		tools: [
			{
				id: "rectangle",
				label: "Rectangle",
				icon: p,
				shortcut: "R",
				cursor: "crosshair"
			},
			{
				id: "ellipse",
				label: "Ellipse",
				icon: f,
				shortcut: "O",
				cursor: "crosshair"
			},
			{
				id: "line",
				label: "Line",
				icon: g,
				shortcut: "L",
				cursor: "crosshair"
			}
		]
	},
	{
		id: "pen",
		label: "Pen",
		icon: m,
		shortcut: "P",
		cursor: "crosshair"
	},
	{
		id: "text",
		label: "Text",
		icon: _,
		shortcut: "T",
		cursor: "text"
	},
	{
		id: "comment",
		label: "Comment",
		icon: h,
		shortcut: "C",
		cursor: "crosshair"
	}
], y = ":host{--_surface:var(--lw-color-background);--_muted:var(--lw-color-muted-foreground);--_ease:cubic-bezier(.23, 1, .32, 1);width:100%;font-family:var(--lw-font-sans);display:block}.stage{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-lg);background:radial-gradient(circle at 1px 1px, var(--lw-color-border) 1px, transparent 0) 0 0/20px 20px, var(--lw-color-muted);height:360px;position:relative;overflow:hidden}.dock{z-index:1;cursor:auto;position:absolute;top:0;left:0}.toolbar{border:1px solid var(--lw-color-border);background:var(--_surface);border-radius:14px;align-items:center;gap:2px;padding:.25rem;transition:box-shadow .2s ease-out;display:flex;position:relative;box-shadow:0 4px 16px -6px #00000026}[data-dragging]>.toolbar{box-shadow:0 12px 32px -8px #00000040}:is([data-edge=left],[data-edge=right])>.toolbar{flex-direction:column}.plate{background:var(--lw-color-primary);border-radius:10px;width:2.25rem;height:2.25rem;position:absolute;top:0;left:0}.option,.tool,.grip{outline:none}.option:focus-visible,.tool:focus-visible,.grip:focus-visible{box-shadow:0 0 0 2px var(--lw-color-ring)}button{color:inherit;font:inherit;cursor:pointer;background:0 0;border:0;padding:0}.grip{border-radius:var(--lw-radius-sm);width:1.25rem;height:2.25rem;color:var(--_muted);cursor:grab;touch-action:none;transition:color var(--lw-duration-fast) ease-out;place-items:center;display:grid}.grip:hover{color:var(--lw-color-foreground)}[data-dragging] .grip{cursor:grabbing}:is([data-edge=left],[data-edge=right]) .grip{width:2.25rem;height:1.25rem}.grip-v,:is([data-edge=left],[data-edge=right]) .grip-h{display:none}:is([data-edge=left],[data-edge=right]) .grip-v,.grip-h{display:contents}.divider{background:var(--lw-color-border);flex:none;width:1px;height:1.25rem;margin-inline:2px}:is([data-edge=left],[data-edge=right]) .divider{width:1.25rem;height:1px;margin:2px 0}.slot{flex:none;width:2.25rem;height:2.25rem;position:relative}.tool{width:100%;height:100%;color:var(--_muted);transition:color var(--lw-duration-fast) ease-out, background-color var(--lw-duration-fast) ease-out;border-radius:10px;place-items:center;display:grid;position:relative}.tool:hover{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.selected>.tool{color:var(--lw-color-primary-foreground);background:0 0}.more{width:.625rem;height:.625rem;color:var(--_muted);transition:color var(--lw-duration-fast) ease-out;justify-content:flex-end;align-items:flex-end;display:flex;position:absolute;bottom:5px;right:5px}.more:before{content:\"\";position:absolute;inset:-6px}.more:hover{color:var(--lw-color-foreground)}.selected>.more{color:color-mix(in oklab, var(--lw-color-primary-foreground) 65%, transparent)}.more svg{fill:currentColor;width:5px;height:5px}.flyout,.tip-body{transform-origin:var(--_origin)}.dock{--_origin:50% 100%}.dock[data-edge=top]{--_origin:50% 0%}.dock[data-edge=left]{--_origin:0% 50%}.dock[data-edge=right]{--_origin:100% 50%}.flyout{z-index:3;border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-lg);background:var(--_surface);width:11rem;box-shadow:var(--lw-shadow-md);opacity:0;visibility:hidden;transition:opacity .1s var(--_ease), scale .1s var(--_ease), visibility 0s .1s;padding:.25rem;position:absolute;scale:.96}.open>.flyout{opacity:1;visibility:visible;transition:opacity .15s var(--_ease), scale .15s var(--_ease);scale:1}[data-edge=bottom] .flyout{bottom:calc(100% + .75rem);left:50%;translate:-50%}[data-edge=top] .flyout{top:calc(100% + .75rem);left:50%;translate:-50%}[data-edge=left] .flyout{top:50%;left:calc(100% + .75rem);translate:0 -50%}[data-edge=right] .flyout{top:50%;right:calc(100% + .75rem);translate:0 -50%}@media (prefers-reduced-motion:reduce){.flyout{scale:1}}.option{border-radius:var(--lw-radius-md);width:100%;font-size:var(--lw-text-sm);text-align:left;color:var(--_muted);transition:color var(--lw-duration-fast) ease-out, background-color var(--lw-duration-fast) ease-out;align-items:center;gap:.625rem;padding:.375rem .5rem;display:flex}.option:hover,.option[aria-checked=true]{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.option span{flex:1}kbd{border:1px solid color-mix(in oklab, currentColor 20%, transparent);min-width:1rem;font-family:var(--lw-font-mono);text-align:center;opacity:.7;border-radius:.25rem;padding-inline:.25rem;font-size:10px;line-height:1rem}.tip{z-index:2;pointer-events:none;position:absolute}[data-edge=bottom]>.tip{translate:-50% -100%}[data-edge=top]>.tip{translate:-50%}[data-edge=left]>.tip{translate:0 -50%}[data-edge=right]>.tip{translate:-100% -50%}.tip[hidden]{display:none}.tip-body{border-radius:var(--lw-radius-sm);background:var(--lw-color-primary);box-shadow:var(--lw-shadow-sm);font-size:var(--lw-text-xs);white-space:nowrap;color:var(--lw-color-primary-foreground);align-items:center;gap:.5rem;padding:.25rem .5rem;font-weight:500;display:flex}@media (prefers-reduced-motion:no-preference){.animated>.tip-body{animation:tip-in .15s var(--_ease)}}@keyframes tip-in{0%{opacity:0;scale:.96}}", b = 12, x = 400, S = 300, C = 8, w = 350, T = 6, E = .998 / .0020000000000000018, D = 100, O = s(.25, 0), k = {
	stiffness: 380,
	damping: 32
}, A = {
	bottom: "left",
	left: "top",
	top: "right",
	right: "bottom"
}, j = Object.keys(A), M = (e) => e === "left" || e === "right", N = (e, t, n) => t > n ? (t + n) / 2 : Math.min(n, Math.max(t, e)), P = (e, t) => i(e, t, 1.75), F = (e) => e ? `<kbd>${r(e)}</kbd>` : "", I = (e, t, n, r, i) => ({
	top: {
		x: t / 2,
		y: b + i / 2
	},
	left: {
		x: b + r / 2,
		y: n / 2
	},
	right: {
		x: t - b - r / 2,
		y: n / 2
	},
	bottom: {
		x: t / 2,
		y: n - b - i / 2
	}
})[e], L = (e, t, n, r) => {
	let i = {
		bottom: r - t,
		top: t,
		left: e,
		right: n - e
	};
	return j.reduce((e, t) => i[t] < i[e] ? t : e);
}, R = (e, t, n, r, i, a, o) => {
	let s = {
		left: t - r.w / 2 + i.w / 2,
		right: t + r.w / 2 - i.w / 2
	}[e] ?? t, c = {
		top: n - r.h / 2 + i.h / 2,
		bottom: n + r.h / 2 - i.h / 2
	}[e] ?? n;
	return {
		x: N(s, i.w / 2, a - i.w / 2),
		y: N(c, i.h / 2, o - i.h / 2)
	};
}, z = (e, t, n) => {
	let r = Math.round(t.left + t.width / 2 - n.left), i = Math.round(t.top + t.height / 2 - n.top);
	return {
		top: {
			x: r,
			y: Math.round(n.height + C)
		},
		left: {
			x: Math.round(n.width + C),
			y: i
		},
		right: {
			x: -8,
			y: i
		},
		bottom: {
			x: r,
			y: -8
		}
	}[e];
}, B = (e, t) => {
	let n = e.filter((e) => t - e.t <= D);
	if (n.length < 2) return {
		x: 0,
		y: 0,
		cx: 0,
		cy: 0
	};
	let r = n[0], i = n.at(-1), a = Math.max(1, i.t - r.t);
	return {
		x: (i.x - r.x) / a,
		y: (i.y - r.y) / a,
		cx: (i.cx - r.cx) / a,
		cy: (i.cy - r.cy) / a
	};
}, V = (e, t, n, r, i) => e === r ? (t + 1) % n : e === i ? (t - 1 + n) % n : e === "Home" ? 0 : e === "End" ? n - 1 : -1, H = class extends e {
	static styles = y;
	static props = {
		tools: {
			type: Object,
			default: v
		},
		value: { default: "" },
		edge: {
			default: "bottom",
			reflect: !0
		},
		shortcuts: { default: "scoped" },
		label: { default: "Tools" }
	};
	#e = /* @__PURE__ */ new Map();
	#t = null;
	#n = !1;
	#r = null;
	#i = null;
	#a = {
		x: 0,
		y: 0
	};
	#o = !1;
	#s = null;
	#c = [];
	#l = [];
	#u = null;
	#d = {
		timer: 0,
		open: !1,
		warmUntil: 0
	};
	render() {
		return "<div class=\"stage\" part=\"stage\"><slot></slot><div class=\"dock\" part=\"dock\"><div class=\"toolbar\" role=\"toolbar\"><span class=\"plate\" aria-hidden=\"true\"></span></div><div class=\"tip\" aria-hidden=\"true\" hidden><div class=\"tip-body\"></div></div></div></div>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".stage"), n = this.query(".toolbar");
		t.addEventListener("pointerenter", (e) => this.#n = e.pointerType !== "touch", e), t.addEventListener("pointerleave", () => this.#n = !1, e), n.addEventListener("click", (e) => this.#M(e), e), n.addEventListener("keydown", (e) => this.#I(e), e), n.addEventListener("focusin", (e) => this.#R(e), e), n.addEventListener("focusout", () => this.#U(), e), n.addEventListener("pointerover", (e) => this.#B(e, !0), e), n.addEventListener("pointerout", (e) => this.#B(e, !1), e), n.addEventListener("pointerdown", (e) => this.#O(e), e), n.addEventListener("pointermove", (e) => this.#k(e), e), n.addEventListener("pointerup", (e) => this.#A(e), e), n.addEventListener("lostpointercapture", (e) => this.#A(e), e), n.addEventListener("pointercancel", () => this.#j(), e), n.addEventListener("contextmenu", (e) => e.target.closest("[data-group]") && e.preventDefault(), e), window.addEventListener("keydown", (e) => this.#z(e), e), document.addEventListener("pointerdown", (e) => this.#N(e), e);
		let r = new ResizeObserver(() => !this.#r && this.#S(null));
		r.observe(t), this.signal.addEventListener("abort", () => {
			r.disconnect(), this.#_(this.#c), this.#_(this.#l), this.#j(), clearTimeout(this.#d.timer);
		});
	}
	updated(e) {
		e.has("label") && (this.query(".toolbar").ariaLabel = this.label ?? ""), e.has("tools") && this.#h(), this.#f.some(({ id: e }) => e === this.value) || (this.value = this.#f[0]?.id ?? ""), this.edge !== this.#s && this.#C(), this.#g();
	}
	get #f() {
		return this.tools.flatMap((e) => e.tools?.length ? e.tools : [e]);
	}
	get #p() {
		return [...this.shadowRoot.querySelectorAll("[data-item]")];
	}
	#m(e) {
		let t = e.tools;
		return t?.length ? t.find(({ id: e }) => e === this.value) ?? t.find(({ id: t }) => t === this.#e.get(e.id)) ?? t[0] : e;
	}
	#h() {
		let e = `<button class="grip" type="button" aria-label="Move toolbar" data-item tabindex="0"><span class="grip-h">${P(l, 16)}</span><span class="grip-v">${P(c, 16)}</span></button><span class="divider" aria-hidden="true"></span>`, t = this.tools.map((e) => {
			let t = r(e.id);
			if (!e.tools?.length) return `<div class="slot" data-slot="${t}"><button class="tool" type="button" data-item tabindex="-1"></button></div>`;
			let n = e.tools.map((e) => `<button class="option" type="button" role="menuitemradio" tabindex="-1" data-id="${r(e.id)}" aria-keyshortcuts="${r(e.shortcut ?? "")}">${P(e.icon, 16)}<span>${r(e.label)}</span>${F(e.shortcut)}</button>`).join("");
			return `<div class="slot" data-slot="${t}" data-group><button class="tool" type="button" data-item tabindex="-1"></button><button class="more" type="button" tabindex="-1" aria-haspopup="menu" aria-expanded="false" aria-label="More ${r(e.label.toLowerCase())}"><svg viewBox="0 0 5 5" aria-hidden="true"><path d="M5 0V5H0Z"/></svg></button><div class="flyout" role="menu" aria-label="${r(e.label)}">${n}</div></div>`;
		}).join(""), n = this.query(".toolbar");
		n.replaceChildren(this.query(".plate")), n.insertAdjacentHTML("beforeend", e + t), this.#u = null;
	}
	#g(e = !1) {
		this.tools.forEach((e, t) => {
			let n = this.shadowRoot.querySelectorAll(".slot")[t], r = this.#m(e), i = n.querySelector(".tool");
			i.dataset.id !== r.id && (i.dataset.id = r.id, i.innerHTML = P(r.icon, 18), i.ariaLabel = r.label, r.shortcut ? i.setAttribute("aria-keyshortcuts", r.shortcut) : i.removeAttribute("aria-keyshortcuts"));
			let a = r.id === this.value;
			i.ariaPressed = String(a), n.classList.toggle("selected", a);
			for (let e of n.querySelectorAll(".option")) e.ariaChecked = String(e.dataset.id === this.value);
		});
		let t = this.#f.find(({ id: e }) => e === this.value);
		this.query(".stage").style.cursor = this.#r ? "grabbing" : t?.cursor ?? "", this.query(".stage").dataset.tool = this.value, this.#p.some((e) => e.tabIndex === 0) || (this.#p[0].tabIndex = 0), this.#v(e);
	}
	#_(e) {
		for (let t of e.splice(0)) t();
	}
	#v(e) {
		let t = this.query(".slot.selected"), n = this.query(".plate");
		if (n.hidden = !t, !t) return;
		let r = {
			x: t.offsetLeft,
			y: t.offsetTop
		}, i = () => n.style.transform = `translate(${this.#u.x}px, ${this.#u.y}px)`;
		if (this.#_(this.#l), !this.#u || e || o.matches) {
			this.#u = r, i();
			return;
		}
		let s = { ...this.#u };
		this.#l = ["x", "y"].map((e) => a(s[e], r[e], {
			...O,
			restDelta: .1,
			update: (t) => {
				this.#u[e] = t, i();
			}
		}));
	}
	#y(e, t = !1) {
		let n = this.tools.find((t) => t.tools?.some((t) => t.id === e));
		n && this.#e.set(n.id, e), e === this.value ? this.#g(t) : (this.value = e, this.#g(t), this.emit("change", { id: e }));
	}
	#b() {
		let e = this.query(".stage"), t = this.query(".dock");
		return {
			W: e.clientWidth,
			H: e.clientHeight,
			w: t.offsetWidth,
			h: t.offsetHeight
		};
	}
	#x() {
		let { W: e, H: t, w: n, h: r } = this.#b(), i = N(this.#a.x, n / 2, e - n / 2), a = N(this.#a.y, r / 2, t - r / 2);
		this.query(".dock").style.transform = `translate3d(${i}px, ${a}px, 0) translate(-50%, -50%)`;
	}
	#S(e) {
		let { W: t, H: n, w: r, h: i } = this.#b(), s = I(this.edge, t, n, r, i);
		if (this.#_(this.#c), !e || !this.#o) {
			this.#a = s, this.#o = t > 0, this.#x();
			return;
		}
		let c = o.matches ? {
			stiffness: 900,
			damping: 60
		} : k;
		this.#c = ["x", "y"].map((t) => a(this.#a[t], s[t], {
			...c,
			velocity: e[t],
			restDelta: .1,
			update: (e) => {
				this.#a[t] = e, this.#x();
			}
		}));
	}
	#C(e = {
		x: 0,
		y: 0
	}) {
		let { edge: t } = this;
		if (!j.includes(t)) {
			this.edge = "bottom";
			return;
		}
		let n = this.query(".dock"), r = {
			w: n.offsetWidth,
			h: n.offsetHeight
		}, i = this.#s !== null && M(this.#s) !== M(t);
		if (this.#s = t, n.dataset.edge = t, this.query(".toolbar").ariaOrientation = M(t) ? "vertical" : "horizontal", this.#U(), this.#F(), i && this.#o) {
			let e = {
				w: n.offsetWidth,
				h: n.offsetHeight
			}, { W: i, H: a } = this.#b();
			this.#a = R(t, this.#a.x, this.#a.y, r, e, i, a), this.#x(), this.#v(!0);
		}
		this.#S(e);
	}
	#w(e, t) {
		e === this.edge ? this.#S(t) : (this.edge = e, this.#C(t), this.emit("dock", { edge: e }));
	}
	#T(e) {
		e.preventDefault(), e.target.closest(".grip").setPointerCapture(e.pointerId), this.#_(this.#c);
		let t = this.query(".stage").getBoundingClientRect(), { W: n, H: r, w: i, h: a } = this.#b(), o = N(this.#a.x, i / 2, n - i / 2), s = N(this.#a.y, a / 2, r - a / 2);
		this.#a = {
			x: o,
			y: s
		}, this.#r = {
			id: e.pointerId,
			dx: e.clientX - t.left - o,
			dy: e.clientY - t.top - s,
			left: t.left,
			top: t.top,
			samples: [{
				t: e.timeStamp,
				x: o,
				y: s,
				cx: o,
				cy: s
			}]
		}, this.#U(), this.#F(), this.query(".dock").toggleAttribute("data-dragging", !0), this.#g();
	}
	#E(e) {
		let t = this.#r, { W: n, H: r, w: i, h: a } = this.#b(), o = e.clientX - t.left - t.dx, s = e.clientY - t.top - t.dy;
		this.#a = {
			x: N(o, i / 2, n - i / 2),
			y: N(s, a / 2, r - a / 2)
		}, this.#x(), t.samples.push({
			t: e.timeStamp,
			x: o,
			y: s,
			cx: this.#a.x,
			cy: this.#a.y
		}), t.samples.length > 8 && t.samples.shift();
	}
	#D(e) {
		let t = this.#r;
		this.#r = null, this.query(".dock").removeAttribute("data-dragging"), this.#g();
		let n = B(t.samples, e.timeStamp), { W: r, H: i } = this.#b(), a = t.samples.at(-1), o = N(a.x + n.x * E, 0, r), s = N(a.y + n.y * E, 0, i);
		this.#w(L(o, s, r, i), {
			x: n.cx * 1e3,
			y: n.cy * 1e3
		});
	}
	#O(e) {
		if (this.#U(), e.button !== 0) return;
		if (e.target.closest(".grip")) {
			this.#T(e);
			return;
		}
		let t = e.target.closest(".tool")?.closest("[data-group]");
		t && (this.#j(), this.#i = {
			x: e.clientX,
			y: e.clientY,
			fired: !1,
			timer: setTimeout(() => {
				this.#i.fired = !0, this.#P(t, !1);
			}, w)
		});
	}
	#k(e) {
		this.#r?.id === e.pointerId ? this.#E(e) : this.#i && Math.hypot(e.clientX - this.#i.x, e.clientY - this.#i.y) > T && this.#j();
	}
	#A(e) {
		this.#r?.id === e.pointerId ? this.#D(e) : clearTimeout(this.#i?.timer);
	}
	#j() {
		clearTimeout(this.#i?.timer), this.#i = null;
	}
	#M(e) {
		let t = e.target.closest(".option");
		if (t) {
			let e = this.#t?.byKey;
			this.#y(t.dataset.id), this.#F(e);
			return;
		}
		let n = e.target.closest(".more");
		if (n) {
			let e = n.closest(".slot");
			this.#t?.slot === e ? this.#F() : this.#P(e, !1);
			return;
		}
		let r = e.target.closest(".tool");
		r && (this.#i?.fired ? this.#i = null : this.#y(r.dataset.id));
	}
	#N(e) {
		this.#t && !e.composedPath().includes(this.#t.slot) && this.#F();
	}
	#P(e, t) {
		if (this.#F(), this.#U(), this.#t = {
			slot: e,
			byKey: t
		}, e.classList.add("open"), e.querySelector(".more").ariaExpanded = "true", !t) return;
		let n = [...e.querySelectorAll(".option")];
		(n.find((e) => e.ariaChecked === "true") ?? n[0]).focus();
	}
	#F(e = !1) {
		let t = this.#t?.slot;
		t && (this.#t = null, t.classList.remove("open"), t.querySelector(".more").ariaExpanded = "false", e && t.querySelector(".tool").focus());
	}
	#I(e) {
		let t = M(this.edge), n = e.target.closest(".option");
		if (n) {
			this.#L(e, n);
			return;
		}
		let r = this.#p, i = r.indexOf(e.target);
		if (i < 0) return;
		if (e.target.matches(".grip") && (e.key === "Enter" || e.key === " ")) {
			e.preventDefault(), this.#w(A[this.edge], {
				x: 0,
				y: 0
			});
			return;
		}
		let a = t ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"], o = e.target.closest("[data-group]");
		if (o && a.includes(e.key)) {
			e.preventDefault(), this.#P(o, !0);
			return;
		}
		let s = V(e.key, i, r.length, t ? "ArrowDown" : "ArrowRight", t ? "ArrowUp" : "ArrowLeft");
		s < 0 || (e.preventDefault(), r[s].focus());
	}
	#L(e, t) {
		if (e.key === "Escape") {
			e.preventDefault(), e.stopPropagation(), this.#F(!0);
			return;
		}
		if (e.key === "Tab") {
			this.#F();
			return;
		}
		let n = [...t.parentElement.children], r = V(e.key, n.indexOf(t), n.length, "ArrowDown", "ArrowUp");
		r < 0 || (e.preventDefault(), e.stopPropagation(), n[r].focus());
	}
	#R(e) {
		let t = this.#p;
		if (t.includes(e.target)) {
			for (let n of t) n.tabIndex = n === e.target ? 0 : -1;
			e.target.matches(":focus-visible") && this.#H(e.target);
		}
	}
	#z(e) {
		if (e.key === "Escape") {
			this.#F();
			return;
		}
		if (this.shortcuts === "off" || e.metaKey || e.ctrlKey || e.altKey || e.repeat || e.defaultPrevented || e.isComposing || n(e)) return;
		let t = this.#f.find(({ shortcut: t }) => t?.toLowerCase() === e.key.toLowerCase());
		if (!t) return;
		let r = document.activeElement, i = !r || r === document.body, a = this.contains(r) || r === this || this.#n && i;
		(this.shortcuts === "global" || a) && (e.preventDefault(), this.#y(t.id, !0));
	}
	#B(e, t) {
		let n = e.target.closest("[data-item]");
		n && !n.contains(e.relatedTarget) && (t ? this.#H(n) : this.#U());
	}
	#V(e) {
		if (e.matches(".grip")) return { label: e.matches(":focus-visible") ? "Drag, or Enter to move" : "Drag to dock" };
		let t = this.#f.find(({ id: t }) => t === e.dataset.id);
		return {
			label: t?.label ?? "",
			shortcut: t?.shortcut
		};
	}
	#H(e) {
		if (this.#r || this.#t) return;
		let t = this.#d;
		clearTimeout(t.timer);
		let n = (n) => {
			let { label: i, shortcut: a } = this.#V(e), o = this.query(".tip"), { x: s, y: c } = z(this.edge, e.getBoundingClientRect(), this.query(".dock").getBoundingClientRect());
			o.querySelector(".tip-body").innerHTML = r(i) + F(a), o.style.left = `${s}px`, o.style.top = `${c}px`, o.classList.toggle("animated", n), o.hidden = !1, t.open = !0;
		};
		t.open || performance.now() < t.warmUntil ? n(!1) : t.timer = setTimeout(() => n(!0), x);
	}
	#U() {
		let e = this.#d;
		clearTimeout(e.timer), e.open && (e.warmUntil = performance.now() + S), e.open = !1, this.query(".tip").hidden = !0;
	}
};
//#endregion
//#region src/components/toolbar/index.js
t("toolbar", H);
//#endregion
export { H as t };
