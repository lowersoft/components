import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i, t as a } from "./motion-CFWhFfc_.js";
import { Dt as o, G as s, bt as c, q as l, u } from "./lucide-BVbUPHVq.js";
//#region src/components/notification-stack/notification-stack.scss?inline
var d = ":host{--_ease:cubic-bezier(.23, 1, .32, 1);width:24rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);display:block}p{margin:0}.head{justify-content:space-between;align-items:center;height:1.75rem;margin-bottom:.75rem;padding-inline:.25rem;display:flex}.heading{font-size:var(--lw-text-sm);font-weight:500}.count{font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);margin-left:.5rem}.toggle{border-radius:var(--lw-radius-md);font:var(--lw-text-sm) var(--lw-font-sans);color:var(--lw-color-muted-foreground);cursor:pointer;transition:background-color var(--lw-duration-fast) ease-out, color var(--lw-duration-fast) ease-out;background:0 0;border:0;padding:.25rem .5rem}.toggle[hidden]{display:none}.toggle:hover{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.toggle:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.list{outline:none;margin:0;padding:0;list-style:none;position:relative}@media (prefers-reduced-motion:no-preference){.list{transition:height .3s var(--_ease)}}.list>li{inset-inline:0;transform-origin:top;transition:opacity .3s var(--_ease);position:absolute;top:0}@media (prefers-reduced-motion:no-preference){.list>li{transition:transform .3s var(--_ease), opacity .3s var(--_ease)}}.list>li[data-hidden]{pointer-events:none}.swipe{touch-action:pan-y}article{border:1px solid var(--lw-color-border);background:var(--lw-color-background);box-shadow:var(--lw-shadow-sm);-webkit-user-select:none;user-select:none;border-radius:1rem;outline:none;gap:.75rem;padding:.875rem;display:flex;position:relative}article:focus-visible{box-shadow:0 0 0 2px var(--lw-color-ring)}[data-front] article{cursor:pointer}.content{flex:1;gap:.75rem;min-width:0;transition:opacity .2s ease-out;display:flex}[data-muted] .content{opacity:0}.app-icon{border-radius:var(--lw-radius-md);background:var(--lw-color-primary);color:#fff;flex:none;place-items:center;width:2rem;height:2rem;display:grid}.app-icon:not([style]){color:var(--lw-color-primary-foreground)}.text{flex:1;min-width:0}.line{justify-content:space-between;align-items:baseline;gap:.5rem;display:flex}.title{font-size:var(--lw-text-sm);text-overflow:ellipsis;white-space:nowrap;font-weight:500;overflow:hidden}.time{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);flex:none}.body{font-size:var(--lw-text-sm);color:var(--lw-color-muted-foreground);-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.dismiss{border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:1.5rem;height:1.5rem;color:var(--lw-color-muted-foreground);cursor:pointer;opacity:0;transition:opacity var(--lw-duration-fast) ease-out;border-radius:50%;place-items:center;padding:0;display:grid;position:absolute;top:-.5rem;left:-.5rem}article:hover .dismiss,.dismiss:focus-visible{opacity:1}.dismiss:hover{color:var(--lw-color-foreground)}.dismiss:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}[data-muted] .dismiss{display:none}.empty{font-size:var(--lw-text-sm);text-align:center;color:var(--lw-color-muted-foreground);padding-block:1.5rem}.empty[hidden]{display:none}", f = [
	{
		id: "n-1",
		app: "Messages",
		title: "Maya Chen",
		body: "Pushed the fix. Can you take a look before standup?",
		time: "now",
		icon: l,
		color: "#10b981"
	},
	{
		id: "n-2",
		app: "Calendar",
		title: "Release review in 10 min",
		body: "Room 4B · lower 0.9",
		time: "9:50",
		icon: u,
		color: "#ef4444"
	},
	{
		id: "n-3",
		app: "CI",
		title: "Nightly build failed on arm64",
		body: "The linker dropped debug info. 5 of 6 targets passed.",
		time: "9:12",
		icon: s,
		color: "#0ea5e9"
	},
	{
		id: "n-4",
		app: "Crash reports",
		title: "12 new crashes in 0.9.2",
		body: "One signature: the symbol cache on a full disk.",
		time: "8:31",
		icon: c
	}
], p = 10, m = 2, h = 8, g = 100, _ = .11, v = 6, y = 2 * Math.sqrt(520), b = 1400, x = 4200, S = 80, C = 200, w = 1 / 240, T = (e) => Math.max(1 - Math.abs(e) / 240, .3), E = (e) => {
	let t = e.at(-1);
	if (!t) return 0;
	let n = e.find((e) => t.t - e.t <= S), r = t.t - n.t;
	return r > 0 ? (t.x - n.x) / r : 0;
}, D = (e, t) => Math.abs(e) < g && !(Math.abs(t) > _ && Math.sign(t) === Math.sign(e)) ? 0 : (e === 0 ? t : e) > 0 ? 1 : -1, O = class extends e {
	static styles = d;
	static props = { notifications: {
		type: Object,
		default: f
	} };
	#e = !1;
	#t = !1;
	#n = !1;
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Map();
	#a = /* @__PURE__ */ new Map();
	#o = /* @__PURE__ */ new Map();
	#s = null;
	#c = !1;
	render() {
		return "<div class=\"head\"><p class=\"heading\">Notifications<span class=\"count\"></span></p><button class=\"toggle\" type=\"button\"></button></div><ol class=\"list\" aria-label=\"Notifications\" tabindex=\"-1\"></ol><p class=\"empty\" hidden>You're all caught up.</p>";
	}
	connected() {
		let e = { signal: this.signal };
		this.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && this.#l("hovered", !0), e), this.addEventListener("pointerleave", (e) => e.pointerType === "mouse" && this.#l("hovered", !1), e), this.addEventListener("focusin", () => this.#l("focused", !0), e), this.addEventListener("focusout", (e) => !this.shadowRoot.contains(e.relatedTarget) && e.relatedTarget !== this && this.#l("focused", !1), e), this.query(".toggle").addEventListener("click", () => this.#l("pinned", !this.#n), e);
		let t = this.query(".list");
		t.addEventListener("pointerdown", (e) => this.#x(e), e), t.addEventListener("pointermove", (e) => this.#S(e), e), t.addEventListener("pointerup", (e) => this.#C(e), e), t.addEventListener("pointercancel", (e) => this.#C(e), e), t.addEventListener("lostpointercapture", (e) => e.target.matches(".swipe") && this.#C(e), e), t.addEventListener("click", (e) => this.#w(e), e), t.addEventListener("keydown", (e) => this.#T(e), e);
		let n = new ResizeObserver(() => this.#m());
		n.observe(t), this.signal.addEventListener("abort", () => {
			n.disconnect();
			for (let e of this.#a.values()) e.stop();
			this.#a.clear();
		});
	}
	updated(e) {
		e.has("notifications") && this.#p(), this.#m();
	}
	#l(e, t) {
		e === "hovered" && (this.#e = t), e === "focused" && (this.#t = t), e === "pinned" && (this.#n = t), this.#m();
	}
	get #u() {
		return this.notifications.filter(({ id: e }) => !this.#r.has(e));
	}
	get #d() {
		return (this.#e || this.#t || this.#n) && this.#u.length > 1;
	}
	#f(e) {
		return this.query(`.list > li[data-id="${CSS.escape(e)}"]`);
	}
	#p() {
		let e = this.query(".list"), t = new Set(this.notifications.map(({ id: e }) => e));
		for (let n of [...e.children]) !t.has(n.dataset.id) && !this.#r.has(n.dataset.id) && n.remove();
		this.notifications.forEach((t, i) => {
			if (this.#f(t.id)) return;
			let a = document.createElement("li");
			a.dataset.id = t.id;
			let s = n(t.title);
			a.innerHTML = `<div class="swipe"><article tabindex="0" aria-label="${n(`${t.app}: ${t.title}. ${t.body}`)}"><div class="content"><span class="app-icon"${t.color ? ` style="background: ${n(t.color)}"` : ""}>${t.icon ? r(t.icon) : ""}</span><div class="text"><div class="line"><p class="title">${s}</p><span class="time">${n(t.time)}</span></div><p class="body">${n(t.body)}</p></div></div><button class="dismiss" type="button" aria-label="Dismiss ${s}">${r(o, 12)}</button></article></div>`, e.insertBefore(a, e.children[i] ?? null);
		});
	}
	#m() {
		let e = this.#u, t = this.#d, n = new Map(e.map(({ id: e }) => [e, this.#f(e)?.firstElementChild.offsetHeight || 76])), r = e[0] ? n.get(e[0].id) : 0, i = 0, a = e.map(({ id: e }) => {
			let t = i;
			return i += n.get(e) + h, t;
		}), o = this.query(".list");
		o.style.height = `${t ? Math.max(i - h, 0) : r + Math.max(Math.min(e.length - 1, m), 0) * p}px`;
		let s = this.notifications.length;
		for (let i of o.children) {
			let o = i.dataset.id, c = e.findIndex((e) => e.id === o), l = c < 0, u = !(t || c <= m) && !l, d = t || l ? 1 : 1 - c * .05, f = t ? a[c] : r + c * p - n.get(o) * d, h = l ? this.#o.get(o) ?? 0 : f;
			l || this.#o.set(o, f), i.style.transform = `translateY(${h}px) scale(${d})`, i.style.opacity = u ? "0" : "", i.style.zIndex = String(s - Math.max(c, 0)), i.toggleAttribute("data-hidden", u), i.toggleAttribute("data-muted", !t && c > 0), i.toggleAttribute("data-front", !t && c === 0 && e.length > 1);
			for (let e of i.querySelectorAll("article, .dismiss")) e.tabIndex = u ? -1 : 0;
		}
		this.query(".count").textContent = String(e.length);
		let c = this.query(".toggle");
		c.hidden = e.length < 2, c.textContent = t ? "Show less" : "Show all", c.ariaExpanded = String(t), this.query(".empty").hidden = e.length > 0;
	}
	#h(e, t) {
		this.#i.set(e, t);
		let n = this.#f(e)?.firstElementChild;
		n && (n.style.transform = t === 0 ? "" : `translateX(${t}px)`, n.style.opacity = t === 0 ? "" : String(T(t)));
	}
	#g(e) {
		this.#a.get(e)?.stop(), this.#a.delete(e);
	}
	#_(e, t, n) {
		this.#g(e);
		let r = !1, i = a(w, {
			step: () => r = t(w),
			render: () => !r || (this.#a.delete(e), n?.(), !1)
		});
		this.#a.set(e, i), i.wake();
	}
	#v(e, t) {
		let n = this.#i.get(e) ?? 0, r = t * 1e3;
		i.matches ? this.#h(e, 0) : this.#_(e, (t) => {
			r += (-520 * n - y * r) * t, n += r * t;
			let i = Math.abs(n) < .5 && Math.abs(r) < 10;
			return this.#h(e, i ? 0 : n), i;
		});
	}
	#y(e) {
		this.#r.delete(e), this.#i.delete(e), this.#o.delete(e), this.#f(e)?.remove(), this.notifications = this.notifications.filter((t) => t.id !== e), this.emit("dismiss", { id: e });
	}
	#b(e, t, n = 0) {
		if (this.#r.has(e)) return;
		let r = this.#u;
		this.#r.add(e);
		let a = this.#f(e), o = a.firstElementChild;
		if (a.contains(this.shadowRoot.activeElement)) {
			let t = r.findIndex((t) => t.id === e), n = r[t + 1] ?? r[t - 1];
			(n ? this.#f(n.id).querySelector("article") : this.query(".list")).focus();
		}
		if (this.#m(), i.matches) {
			this.#g(e), o.style.transition = `opacity ${C}ms ease-out`, o.style.opacity = "0", setTimeout(() => this.#y(e), C);
			return;
		}
		let s = o.offsetWidth * 1.1, c = this.#i.get(e) ?? 0, l = Math.max(Math.abs(n) * 1e3, b);
		this.#_(e, (n) => {
			l += x * n, c += t * l * n;
			let r = Math.abs(c) >= s;
			return this.#h(e, r ? t * s : c), o.style.opacity = String(Math.max(1 - Math.abs(c) / s, 0)), r;
		}, () => this.#y(e));
	}
	#x(e) {
		let t = e.target.closest("li");
		if (!t || this.#s) return;
		let n = t.dataset.id, r = this.#u.findIndex((e) => e.id === n);
		r < 0 || !this.#d && r > 0 || (this.#c = !1, !(e.pointerType === "mouse" && e.button !== 0 || e.target.closest("button")) && (this.#g(n), this.#s = {
			id: n,
			node: t.firstElementChild,
			pointerId: e.pointerId,
			x: e.clientX,
			y: e.clientY,
			origin: this.#i.get(n) ?? 0,
			dx: 0,
			axis: null,
			samples: []
		}));
	}
	#S(e) {
		let t = this.#s;
		if (t?.pointerId !== e.pointerId) return;
		let n = e.clientX - t.x, r = e.clientY - t.y;
		if (!t.axis) {
			if (Math.abs(n) < v && Math.abs(r) < v) return;
			t.axis = Math.abs(n) > Math.abs(r) ? "x" : "y", t.axis === "x" && t.node.setPointerCapture?.(e.pointerId);
		}
		t.axis === "x" && (t.dx = t.origin + n, t.samples.push({
			t: e.timeStamp,
			x: t.dx
		}), t.samples.length > 12 && t.samples.shift(), this.#h(t.id, t.dx));
	}
	#C(e) {
		let t = this.#s;
		if (t?.pointerId !== e.pointerId) return;
		if (this.#s = null, t.axis !== "x") {
			this.#i.get(t.id) && this.#v(t.id, 0);
			return;
		}
		this.#c = !0;
		let n = E(t.samples), r = D(t.dx, n);
		r === 0 ? this.#v(t.id, n) : this.#b(t.id, r, Math.sign(n) === r ? n : 0);
	}
	#w(e) {
		let t = e.target.closest("li");
		t && (e.target.closest(".dismiss") ? (e.stopPropagation(), this.#b(t.dataset.id, 1)) : this.#c ? this.#c = !1 : e.target.closest("article") && !this.#d && this.#l("pinned", !0));
	}
	#T(e) {
		e.key !== "Delete" && e.key !== "Backspace" || !e.target.matches("article") || (e.preventDefault(), e.repeat || this.#b(e.target.closest("li").dataset.id, 1));
	}
};
//#endregion
//#region src/components/notification-stack/index.js
t("notification-stack", O);
//#endregion
export { O as t };
