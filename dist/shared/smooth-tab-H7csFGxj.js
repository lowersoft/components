import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { i as r, n as i } from "./motion-CFWhFfc_.js";
//#region src/components/smooth-tab/smooth-tab.scss?inline
var a = ":host{width:28rem;max-width:100%;font-family:var(--lw-font-sans);flex-direction:column;gap:.75rem;display:flex}.bar{justify-content:center;display:flex}.tablist{border-radius:var(--lw-radius-full);background:var(--lw-color-muted);max-width:100%;padding:.25rem;display:inline-flex;position:relative}.tab{border-radius:var(--lw-radius-full);font-size:var(--lw-text-sm);white-space:nowrap;flex:none;align-items:center;gap:.375rem;padding:.375rem .875rem;font-weight:500;display:flex}button.tab{color:var(--lw-color-muted-foreground);cursor:pointer;transition:color var(--lw-duration-fast) ease-out;background:0 0;border:0;outline:none;font-family:inherit}button.tab:hover{color:var(--lw-color-foreground)}button.tab:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.overlay{background:var(--lw-smooth-tab-active,var(--lw-color-primary));color:var(--lw-smooth-tab-active-text,var(--lw-color-primary-foreground));clip-path:inset(0 100% 0 0);pointer-events:none;padding:.25rem;display:flex;position:absolute;inset:0}.viewport{border:1px solid var(--lw-color-border);background:var(--lw-color-background);touch-action:pan-y;-webkit-user-select:none;user-select:none;border-radius:1rem;position:relative;overflow:hidden}.viewport[data-dragging]{cursor:grabbing}.track{width:calc(var(--_count,1) * 100%);will-change:transform;display:flex}::slotted(*){box-sizing:border-box;flex:0 0 calc(100% / var(--_count,1));outline:none;min-width:0;min-height:220px;margin:0;padding:1.25rem}::slotted(:focus-visible){box-shadow:inset 0 0 0 2px var(--lw-color-ring)}", o = .35, s = .11, c = 6, l = 100, u = {
	stiffness: 420,
	damping: 38
}, d = (e, t, n) => e + (t - e) * n, f = (e, t, n) => Math.min(Math.max(e, t), n), p = (e, t) => {
	let n = e.length - 1;
	if (n < 0) return null;
	let r = f(t, 0, n), i = Math.min(Math.floor(r), Math.max(n - 1, 0)), a = e[i], o = e[Math.min(i + 1, n)], s = d(a.left, o.left, r - i), c = d(a.width, o.width, r - i), l = t < 0 ? -t : t - n;
	if (l > 0) {
		let e = c * Math.min(l, .5) * .4;
		c -= e, t > n && (s += e);
	}
	return {
		left: s,
		width: c,
		top: a.top,
		height: a.height
	};
}, m = (e, t) => e < 0 ? e * o : e > t ? t + (e - t) * o : e, h = class extends e {
	static styles = a;
	static props = {
		selected: {
			type: Number,
			default: 0
		},
		label: { default: "Sections" }
	};
	#e = 0;
	#t = 0;
	#n = [];
	#r = {
		width: 0,
		height: 0
	};
	#i = null;
	#a = null;
	#o = !1;
	#s = !1;
	render() {
		return "<div class=\"bar\"><div class=\"tablist\" role=\"tablist\" part=\"tabs\"></div></div><div class=\"viewport\" part=\"panels\"><div class=\"track\"><slot></slot></div></div>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".tablist"), n = this.query(".viewport");
		t.addEventListener("click", (e) => this.#_(e), e), t.addEventListener("keydown", (e) => this.#v(e), e), n.addEventListener("pointerdown", (e) => this.#y(e), e), n.addEventListener("pointermove", (e) => this.#x(e), e), n.addEventListener("pointerup", (e) => this.#S(e, !1), e), n.addEventListener("lostpointercapture", (e) => this.#S(e, !1), e), n.addEventListener("pointercancel", (e) => this.#S(e, !0), e), n.addEventListener("click", (e) => this.#C(e), {
			...e,
			capture: !0
		}), this.query("slot").addEventListener("slotchange", () => this.#d(), e);
		let r = new ResizeObserver(() => this.#f());
		r.observe(t), document.fonts?.ready.then(() => this.isConnected && this.#f()), this.signal.addEventListener("abort", () => {
			r.disconnect(), this.#i?.();
		});
	}
	updated(e) {
		e.has("label") && (this.query(".tablist").ariaLabel = this.label ?? ""), e.has("selected") && this.#u !== this.#t && this.#h(this.#u, { instant: !this.#s });
	}
	get #c() {
		return [...this.children];
	}
	get #l() {
		return [...this.shadowRoot.querySelectorAll("[role=\"tab\"]")];
	}
	get #u() {
		return f(Math.round(this.selected) || 0, 0, Math.max(this.#c.length - 1, 0));
	}
	#d() {
		let e = this.#c, t = (e, t) => n(e.dataset.label ?? `Tab ${t + 1}`), r = e.map((e, n) => `<button class="tab" type="button" role="tab"><span>${t(e, n)}</span></button>`).join(""), i = e.map((e, n) => `<span class="tab"><span>${t(e, n)}</span></span>`).join("");
		this.query(".tablist").innerHTML = `${r}<div class="overlay" aria-hidden="true">${i}</div>`, this.query(".track").style.setProperty("--_count", e.length), e.forEach((e, t) => {
			e.role = "tabpanel", e.ariaLabel = e.dataset.label ?? `Tab ${t + 1}`;
		}), this.#f(), this.#h(this.#u, { instant: !0 });
	}
	#f() {
		let e = this.query(".tablist").getBoundingClientRect();
		this.#r = {
			width: e.width,
			height: e.height
		}, this.#n = this.#l.map((t) => {
			let n = t.getBoundingClientRect();
			return {
				left: n.left - e.left,
				width: n.width,
				top: n.top - e.top,
				height: n.height
			};
		}), this.#p();
	}
	#p() {
		let e = this.#e, t = this.#c.length;
		this.query(".track").style.transform = `translate3d(${-e * 100 / Math.max(t, 1)}%, 0, 0)`, this.#c.forEach((t, n) => {
			t.style.opacity = String(1 - Math.min(Math.abs(e - n), 1) * .65);
		});
		let n = p(this.#n, e), r = this.query(".overlay");
		if (!n || !r) return;
		let i = this.#r.width - n.left - n.width, a = this.#r.height - n.top - n.height;
		r.style.clipPath = `inset(${n.top}px ${i}px ${a}px ${n.left}px round ${n.height / 2}px)`, this.#s = !0;
	}
	#m(e) {
		this.#l.forEach((t, n) => {
			t.ariaSelected = String(n === e), t.tabIndex = n === e ? 0 : -1;
		}), this.#c.forEach((t, n) => {
			t.inert = n !== e, t.tabIndex = n === e ? 0 : -1;
		});
	}
	#h(e, { instant: t = !1, velocity: n = 0 } = {}) {
		this.#t = e, this.#m(e), this.#i?.(), this.#i = null, t || i.matches ? (this.#e = e, this.#p()) : this.#i = r(this.#e, e, {
			...u,
			velocity: n,
			restDelta: 5e-4,
			update: (e) => {
				this.#e = e, this.#p();
			},
			done: () => this.#i = null
		});
	}
	#g(e, t) {
		let n = f(e, 0, this.#c.length - 1), r = n !== this.#u;
		this.selected = n, this.#h(n, t), r && this.emit("change", { index: n });
	}
	#_(e) {
		let t = e.target.closest("[role=\"tab\"]");
		t && this.#g(this.#l.indexOf(t));
	}
	#v(e) {
		let t = this.#l, n = t.indexOf(e.target.closest("[role=\"tab\"]")), r = t.length, i = {
			ArrowRight: (n + 1) % r,
			ArrowLeft: (n - 1 + r) % r,
			Home: 0,
			End: r - 1
		}[e.key];
		n < 0 || i === void 0 || (e.preventDefault(), t[i].focus(), this.#g(i, { instant: e.repeat }));
	}
	#y(e) {
		this.#c.length < 2 || e.pointerType === "mouse" && e.button !== 0 || (this.#a = {
			id: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
			startProgress: this.#e,
			axis: null,
			width: e.currentTarget.clientWidth || 1,
			samples: [{
				x: e.clientX,
				t: e.timeStamp
			}]
		});
	}
	#b(e, t) {
		let n = t.clientX - e.startX, r = t.clientY - e.startY;
		Math.max(Math.abs(n), Math.abs(r)) < c || (e.axis = Math.abs(n) > Math.abs(r) ? "x" : "y", e.axis === "x" && (this.#i?.(), this.#i = null, e.startProgress = this.#e, e.startX = t.clientX, e.samples = [{
			x: t.clientX,
			t: t.timeStamp
		}], t.currentTarget.setPointerCapture(t.pointerId), t.currentTarget.toggleAttribute("data-dragging", !0)));
	}
	#x(e) {
		let t = this.#a;
		if (t?.id === e.pointerId && (t.axis === null && this.#b(t, e), t.axis === "x")) {
			for (t.samples.push({
				x: e.clientX,
				t: e.timeStamp
			}); t.samples.length > 2 && e.timeStamp - t.samples[0].t > l;) t.samples.shift();
			this.#e = m(t.startProgress - (e.clientX - t.startX) / t.width, this.#c.length - 1), this.#p();
		}
	}
	#S(e, t) {
		let n = this.#a;
		if (n?.id !== e.pointerId || (this.#a = null, this.query(".viewport").removeAttribute("data-dragging"), n.axis !== "x")) return;
		t || (this.#o = !0, setTimeout(() => this.#o = !1));
		let r = n.samples[0], i = (e.clientX - r.x) / Math.max(e.timeStamp - r.t, 1), a = this.#e, o = Math.round(a);
		!t && Math.abs(i) > s && (o = i < 0 ? Math.floor(a) + 1 : Math.ceil(a) - 1), this.#g(o, { velocity: -i * 1e3 / n.width });
	}
	#C(e) {
		this.#o && (this.#o = !1, e.preventDefault(), e.stopPropagation());
	}
};
//#endregion
//#region src/components/smooth-tab/index.js
t("smooth-tab", h);
//#endregion
export { h as t };
