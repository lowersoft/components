import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { n as r } from "./motion-CFWhFfc_.js";
//#region src/components/scroll-index/scroll-index.scss?inline
var i = ":host{--_accent:var(--lw-scroll-index-accent,#3b82f6);border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:100%;height:520px;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);border-radius:1rem;display:block;position:relative;overflow:hidden}:host([scroller=window]){background:0 0;border:0;border-radius:0;grid-template-columns:minmax(0,1fr) 3rem;gap:1.5rem;height:auto;display:grid;overflow:visible}.box{overscroll-behavior:contain;height:100%;overflow-y:auto}:host([scroller=window]) .box{height:auto;overflow:visible}.content{padding:2rem 4rem 2rem 2.5rem}:host([scroller=window]) .content{padding:0}nav{z-index:1;justify-content:flex-end;width:3rem;display:flex;position:absolute;top:50%;right:.75rem;translate:0 -50%}:host([scroller=window]) nav{align-self:start;position:sticky;top:calc(50vh - 140px);right:auto;translate:none}.rail{cursor:pointer;touch-action:none;-webkit-user-select:none;user-select:none;width:100%;height:280px;position:relative}.rail[data-dragging]{cursor:grabbing}.tick{width:.875rem;height:1rem;cursor:inherit;background:0 0;border:0;border-radius:.125rem;outline:none;padding:0;position:absolute;right:0;translate:0 -50%}.tick[data-level=\"2\"]{width:.5rem}.tick:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.tick span{border-radius:var(--lw-radius-full);background:var(--lw-color-border);transform-origin:100%;width:100%;height:1.5px;translate:0 -50%;scale:var(--_swell,1) 1;transition:background-color .2s ease-out;position:absolute;top:50%;right:0}.tick[data-state=current] span{background:var(--_accent)}.tick[data-state=passed] span{background:var(--lw-color-foreground)}.head{border-radius:var(--lw-radius-full);background:var(--lw-color-foreground);pointer-events:none;will-change:transform;width:1.5rem;height:2px;margin-top:-1px;position:absolute;top:0;right:0}.label{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);background:var(--lw-color-background);box-shadow:var(--lw-shadow-sm);font-size:var(--lw-text-xs);white-space:nowrap;opacity:0;pointer-events:none;padding:.25rem .5rem;font-weight:500;transition:opacity .15s ease-out,transform .15s ease-out;position:absolute;top:0;right:2.25rem}", a = 16, o = 1.6, s = 18, c = 900, l = (e, t, n) => Math.min(Math.max(e, t), n), u = (e) => e < .5 ? 8 * e ** 4 : 1 - (-2 * e + 2) ** 4 / 2, d = class extends e {
	static styles = i;
	static props = {
		selector: { default: "h2, h3" },
		scroller: {
			default: "self",
			reflect: !0
		}
	};
	#e = [];
	#t = 0;
	#n = 1;
	#r = 280;
	#i = -1;
	#a = null;
	#o = null;
	#s = [];
	#c = 0;
	#l = 0;
	#u = 0;
	#d = !1;
	#f = null;
	render() {
		return "<div class=\"box\"><div class=\"content\"><slot></slot></div></div><nav aria-label=\"Sections\"><div class=\"rail\" part=\"rail\"><div class=\"ticks\"></div><span class=\"head\" aria-hidden=\"true\"></span><span class=\"label\" aria-hidden=\"true\"></span></div></nav>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".rail");
		t.addEventListener("pointerdown", (e) => this.#A(e), e), t.addEventListener("pointermove", (e) => this.#j(e), e), t.addEventListener("pointerup", (e) => this.#M(e), e), t.addEventListener("pointercancel", (e) => this.#M(e), e), t.addEventListener("pointerleave", () => this.#N(), e);
		let n = this.query(".ticks");
		n.addEventListener("click", (e) => this.#P(e), e), n.addEventListener("keydown", (e) => this.#F(e), e), n.addEventListener("focusin", (e) => this.#D(this.#O(e.target)), e), n.addEventListener("focusout", () => this.query(".label").style.opacity = "0", e), this.query("slot").addEventListener("slotchange", () => this.#g(), e), this.#h();
		let r = new ResizeObserver(() => this.#g());
		r.observe(this.query(".content")), r.observe(this.query(".box")), this.signal.addEventListener("abort", () => {
			r.disconnect(), cancelAnimationFrame(this.#c), this.#c = 0, this.#w(), clearTimeout(this.#u), this.#f?.abort();
		});
	}
	updated(e) {
		e.has("scroller") && this.#h(), this.#g();
	}
	get #p() {
		return this.scroller === "window";
	}
	get #m() {
		return this.#p ? window.scrollY : this.query(".box").scrollTop;
	}
	set #m(e) {
		this.#p ? window.scrollTo(0, e) : this.query(".box").scrollTop = e;
	}
	#h() {
		this.#f?.abort(), this.#f = new AbortController();
		let e = {
			signal: this.#f.signal,
			passive: !0
		}, t = this.#p ? window : this.query(".box");
		t.addEventListener("scroll", () => this.#S(), e);
		for (let n of ["wheel", "touchstart"]) t.addEventListener(n, () => this.#w(), e);
	}
	#g() {
		this.isConnected && (this.#_(), this.#S());
	}
	#_() {
		let e = this.#m, t = this.query(".box"), r = this.query(".content");
		if (this.#p) {
			let t = r.getBoundingClientRect().top + e;
			this.#t = Math.max(t - a, 0), this.#n = Math.max(t + r.offsetHeight - window.innerHeight, this.#t + 1);
		} else this.#t = 0, this.#n = Math.max(t.scrollHeight - t.clientHeight, 1);
		let i = this.#p ? 0 : t.getBoundingClientRect().top - e, o = this.#n - this.#t;
		this.#e = [...this.querySelectorAll(this.selector)].map((t) => {
			let n = l(t.getBoundingClientRect().top + e - i - a, this.#t, this.#n);
			return {
				el: t,
				text: t.textContent.trim(),
				level: Number(t.tagName.slice(1)) || 2,
				at: n,
				pos: (n - this.#t) / o
			};
		}), this.#r = this.query(".rail").clientHeight || 280;
		let s = this.query(".ticks"), c = this.#e.map(({ text: e, level: t, pos: r }) => `<button class="tick" type="button" aria-label="${n(e)}" data-level="${t <= 2 ? 1 : 2}" data-state="ahead" style="top: ${(r * 100).toFixed(3)}%"><span></span></button>`).join("");
		s.dataset.markup !== c && (s.innerHTML = c, s.dataset.markup = c, this.#i = -1);
	}
	get #v() {
		return l((this.#m - this.#t) / (this.#n - this.#t), 0, 1);
	}
	#y(e) {
		let t = -1, n = Infinity;
		return this.#e.forEach(({ pos: r }, i) => {
			let a = Math.abs(r * this.#r - e);
			a < n && (n = a, t = i);
		}), {
			index: t,
			distance: n
		};
	}
	get #b() {
		let e = this.#m + 1, t = -1;
		return this.#e.forEach(({ at: n }, r) => {
			n <= e && (t = r);
		}), t;
	}
	#x(e, t) {
		let n = this.query(".label"), r = this.#e[e];
		r ? (n.textContent !== r.text && (n.textContent = r.text), n.style.transform = `translate3d(0, ${(r.pos * this.#r).toFixed(1)}px, 0) translateY(-50%)`, n.style.opacity = t ? "1" : "0") : n.style.opacity = "0";
	}
	#S() {
		this.#c ||= requestAnimationFrame(() => this.#C());
	}
	#C() {
		this.#c = 0, this.query(".head").style.transform = `translate3d(0, ${(this.#v * this.#r).toFixed(1)}px, 0)`;
		let e = [...this.shadowRoot.querySelectorAll(".tick")], t = this.#b;
		t !== this.#i && (this.#i = t, e.forEach((e, n) => e.dataset.state = n === t ? "current" : n < t ? "passed" : "ahead"), this.#d && this.#a === null && !this.#o && t >= 0 && (this.#x(t, !0), clearTimeout(this.#u), this.#u = setTimeout(() => {
			this.#a === null && !this.#o && (this.query(".label").style.opacity = "0");
		}, c)));
		let n = !1;
		e.forEach((e, t) => {
			let i = (this.#e[t]?.pos ?? 0) * this.#r, a = this.#a === null || r.matches ? 1 : 1 + o * Math.exp(-((this.#a - i) ** 2) / 1352), s = this.#s[t] ?? 1, c = s + (a - s) * .35;
			this.#s[t] = Math.abs(c - a) < .005 ? a : c, n ||= this.#s[t] !== a, e.style.setProperty("--_swell", this.#s[t].toFixed(3));
		}), this.#d = !0, n && this.#S();
	}
	#w() {
		cancelAnimationFrame(this.#l), this.#l = 0;
	}
	#T(e) {
		this.#w();
		let t = this.#m, n = l(e, 0, this.#p ? 1e9 : this.#n);
		if (r.matches || Math.abs(n - t) < 2) {
			this.#m = n;
			return;
		}
		let i = l(260 + Math.abs(n - t) * .12, 300, 650), a = performance.now(), o = (e) => {
			let r = Math.min((e - a) / i, 1);
			this.#m = t + (n - t) * u(r), this.#l = r < 1 ? requestAnimationFrame(o) : 0;
		};
		this.#l = requestAnimationFrame(o);
	}
	#E(e) {
		let t = this.#e[e];
		t && this.#T(t.at);
	}
	#D(e) {
		e < 0 || (this.#a = (this.#e[e]?.pos ?? 0) * this.#r, this.#x(e, !0), this.#S());
	}
	#O(e) {
		return [...this.shadowRoot.querySelectorAll(".tick")].indexOf(e.closest?.(".tick"));
	}
	#k(e) {
		return l(e.clientY - this.query(".rail").getBoundingClientRect().top, 0, this.#r);
	}
	#A(e) {
		if (this.#o || e.button !== 0) return;
		e.preventDefault();
		let t = this.query(".rail");
		t.setPointerCapture?.(e.pointerId), this.#w();
		let n = this.#k(e);
		this.#o = {
			id: e.pointerId,
			moved: !1,
			y: n,
			t: e.timeStamp,
			v: 0
		}, this.#a = n, t.toggleAttribute("data-dragging", !0), this.#x(this.#y(n).index, !0), this.#S();
	}
	#j(e) {
		let t = this.#k(e), n = this.#o;
		if (n?.id === e.pointerId) {
			let r = Math.max(e.timeStamp - n.t, 1);
			n.v = n.v * .4 + (t - n.y) / r * .6, n.moved ||= Math.abs(t - n.y) > 3, n.y = t, n.t = e.timeStamp, n.moved && (this.#m = this.#t + t / this.#r * (this.#n - this.#t));
		} else if (e.pointerType !== "mouse") return;
		this.#a = t, this.#x(this.#y(t).index, !0), this.#S();
	}
	#M(e) {
		let t = this.#o;
		if (t?.id !== e.pointerId) return;
		this.#o = null, this.query(".rail").removeAttribute("data-dragging"), e.pointerType !== "mouse" && (this.#a = null, this.#x(-1, !1));
		let n = this.#y(t.moved ? t.y + t.v * 120 : t.y);
		n.index >= 0 && (!t.moved || n.distance < s) && this.#E(n.index), this.#S();
	}
	#N() {
		this.#o || (this.#a = null, this.#x(-1, !1), this.#S());
	}
	#P(e) {
		e.detail === 0 && this.#E(this.#O(e.target));
	}
	#F(e) {
		if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		e.preventDefault();
		let t = [...this.shadowRoot.querySelectorAll(".tick")];
		t[l(this.#O(e.target) + (e.key === "ArrowDown" ? 1 : -1), 0, t.length - 1)]?.focus();
	}
};
//#endregion
//#region src/components/scroll-index/index.js
t("scroll-index", d);
//#endregion
export { d as t };
