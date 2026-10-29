import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { n as r, r as i, t as a } from "./motion-CFWhFfc_.js";
//#region src/components/morphic-navbar/morphic-navbar.scss?inline
var o = ":host{--_surface:var(--lw-color-primary);--_ink:var(--lw-color-primary-foreground);--_mark:var(--lw-navbar-mark,#f97316);font-family:var(--lw-font-sans);display:block}nav{justify-content:center;padding:.5rem 1rem;display:flex}.row{touch-action:pan-y;-webkit-user-select:none;user-select:none;align-items:center;display:flex;position:relative}.segment{z-index:1;position:relative}.segment.pinned{z-index:2}.segment[inert]{pointer-events:none}.link{border-radius:var(--lw-radius-lg);background:var(--_surface);height:2.25rem;font-size:var(--lw-text-sm);color:color-mix(in oklab, var(--_ink) 55%, var(--_surface));-webkit-tap-highlight-color:transparent;transition:color var(--lw-duration-fast) ease-out;outline:none;align-items:center;padding-inline:1rem;font-weight:500;text-decoration:none;display:flex;position:relative}.link:hover,.link[data-highlighted]{color:var(--_ink)}.link:focus-visible{box-shadow:inset 0 0 0 2px var(--_mark)}.cap{background:var(--_surface);width:.75rem;position:absolute;inset-block:0}.cap.start{transform-origin:0;left:-1px}.cap.end{transform-origin:100%;right:-1px}.name{position:relative}.mark{border-radius:var(--lw-radius-full);background:var(--_mark);width:.75rem;height:2px;position:absolute;bottom:.375rem;left:calc(50% - .375rem);transform:scaleX(0)}@media (prefers-reduced-motion:no-preference){.mark{transition:transform .2s cubic-bezier(.23,1,.32,1)}}[data-highlighted]>.mark{transform:scaleX(1)}.chevron{z-index:0;border-radius:var(--lw-radius-lg);background:var(--_surface);width:2.25rem;height:2.25rem;color:color-mix(in oklab, var(--_ink) 55%, var(--_surface));cursor:pointer;opacity:0;pointer-events:none;transition:color var(--lw-duration-fast) ease-out;border:0;outline:none;place-items:center;padding:0;display:grid;position:absolute;top:0;left:0}.chevron.shown{z-index:3;pointer-events:auto}.chevron:hover{color:var(--_ink)}.chevron:focus-visible{box-shadow:inset 0 0 0 2px var(--_mark)}.chevron[hidden]{display:none}.chevron svg{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;width:1rem;height:1rem}", s = [
	{
		href: "#home",
		label: "Home"
	},
	{
		href: "#work",
		label: "Work"
	},
	{
		href: "#notes",
		label: "Notes"
	},
	{
		href: "#blog",
		label: "Blog"
	},
	{
		href: "#about",
		label: "About"
	}
], c = 8, l = 2, u = 4, d = .16, f = 90, p = 80, m = 36, h = 4, g = i(.32, .15), _ = 1 / 240, v = {
	ArrowLeft: (e) => e - 1,
	ArrowRight: (e) => e + 1,
	Home: () => 0,
	End: (e, t) => t - 1
}, y = (e) => Math.round(e * 100) / 100, b = (e, t, n) => Math.min(n, Math.max(t, e)), x = (e, t) => e === t || e !== "/" && t.startsWith(`${e}/`), S = (e, t) => {
	let n = -1;
	return e.forEach((r, i) => {
		t && x(r, t) && (n < 0 || r.length > e[n].length) && (n = i);
	}), n;
}, C = (e, t) => Math.max(0, 1 - Math.abs(e - t)), w = (e, t, n) => {
	let r = [0], i = 0;
	for (let a = 0; a < e - 1; a++) {
		let e = c * Math.max(C(t, a), C(t, a + 1));
		n !== null && n !== Math.round(t) && (a === n - 1 || a === n) && (e = Math.max(e, l)), i += e, r.push(i);
	}
	return r.map((e) => y(e - i / 2));
}, T = ({ centers: e, widths: t, rowWidth: n }, r) => {
	let i = t[r] ?? 0, a = n / 2 - (i + h + m) / 2 + i / 2;
	return {
		xs: e.map((e) => y(a - e)),
		chevron: y(a + i / 2 + h + m / 2)
	};
}, E = (e, t) => {
	let n = e.length - 1;
	if (n <= 0 || t <= e[0]) return 0;
	for (let r = 0; r < n; r++) if (t < e[r + 1]) return r + (t - e[r]) / Math.max(1, e[r + 1] - e[r]);
	return n;
}, D = (e, t) => {
	let n = e.filter((e) => t - e.t <= f), r = n[0], i = n.at(-1);
	return !r || i.t === r.t ? 0 : (i.x - r.x) / (i.t - r.t) * 1e3;
}, O = (e, t) => `scaleX(${y(b(1 - e / 1.5, 0, 1) * (1 - b(t * 4, 0, 1)))})`, k = class extends e {
	static styles = o;
	static props = {
		items: {
			type: Object,
			default: s
		},
		value: { default: "" },
		compact: {
			type: Boolean,
			reflect: !0
		},
		label: { default: "Main" }
	};
	#e = null;
	#t = null;
	#n = !1;
	#r = null;
	#i = !1;
	#a = !1;
	#o = null;
	#s = null;
	#c = [];
	#l = [];
	#u = [];
	#d = a(_, {
		step: () => this.#b(),
		render: () => this.#x()
	});
	render() {
		return "<nav part=\"nav\"><div class=\"row\"></div></nav>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".row");
		t.addEventListener("pointerdown", (e) => this.#k(e), e), t.addEventListener("pointermove", (e) => this.#A(e), e), t.addEventListener("pointerup", (e) => this.#j(e, !0), e), t.addEventListener("pointercancel", (e) => this.#j(e, !1), e), t.addEventListener("click", (e) => this.#M(e), {
			...e,
			capture: !0
		}), t.addEventListener("keydown", (e) => this.#P(e), e), t.addEventListener("focusin", (e) => this.#F(e), e), t.addEventListener("focusout", (e) => !t.contains(e.relatedTarget) && this.#I(), e), t.addEventListener("dragstart", (e) => e.preventDefault(), e), t.addEventListener("pointerover", (e) => this.#D(e, !0), e), t.addEventListener("pointerout", (e) => this.#D(e, !1), e), window.addEventListener("scroll", () => this.#T(), {
			...e,
			passive: !0
		}), window.addEventListener("popstate", () => this.#w(), e);
		let n = new ResizeObserver(() => this.#_());
		n.observe(t), this.signal.addEventListener("abort", () => {
			this.#d.stop(), n.disconnect();
		});
	}
	updated(e) {
		e.has("label") && (this.query("nav").ariaLabel = this.label ?? ""), e.has("items") && this.#g(), e.has("items") && !this.value && this.#w(), this.#T(), this.#v(e.has("items"));
	}
	get #f() {
		return [...this.shadowRoot.querySelectorAll(".link")];
	}
	get #p() {
		return S(this.items.map(({ href: e }) => e), this.value);
	}
	get #m() {
		return this.#e ?? this.#p;
	}
	get #h() {
		return !!this.compact && this.#a && this.#o === null && !this.#n && !this.#r?.scrubbing && this.#p >= 0;
	}
	#g() {
		let e = this.items.map(({ href: e, label: t }, r) => `<div class="segment" data-index="${r}"><a class="link" part="link" href="${n(e)}" draggable="false"><span class="cap start" aria-hidden="true"></span><span class="cap end" aria-hidden="true"></span><span class="name">${n(t)}</span><span class="mark" aria-hidden="true"></span></a></div>`).join("");
		this.query(".row").innerHTML = e + "<button class=\"chevron\" type=\"button\" aria-label=\"Show all links\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m6 9 6 6 6-6\"/></svg></button>";
		let t = this.items.length;
		this.#c = [
			...w(t, this.#p, null),
			0,
			0
		], this.#l = [...this.#c], this.#u = this.#c.map(() => 0), this.#s = null;
	}
	#_() {
		let e = [...this.shadowRoot.querySelectorAll(".segment")];
		this.#s = {
			centers: e.map((e) => e.offsetLeft + e.offsetWidth / 2),
			widths: e.map((e) => e.offsetWidth),
			rowWidth: this.query(".row").offsetWidth
		}, this.#y(!0);
	}
	#v(e = !1) {
		let t = this.#p, n = this.#m, r = this.#h;
		this.#f.forEach((e, i) => {
			i === t ? e.setAttribute("aria-current", "page") : e.removeAttribute("aria-current"), e.toggleAttribute("data-highlighted", i === n), e.parentElement.classList.toggle("pinned", i === t), e.parentElement.inert = r && i !== t;
		});
		let i = this.query(".chevron");
		i.hidden = !this.compact, i.ariaExpanded = String(!r), i.ariaHidden = String(!r), i.tabIndex = r ? 0 : -1, i.classList.toggle("shown", r), this.#y(e);
	}
	#y(e) {
		if (!this.#s) {
			if (!this.isConnected) return;
			this.#_();
			return;
		}
		let t = this.items.length, n = this.#p, i = this.#r, a, o;
		if (this.#h) ({xs: a, chevron: o} = T(this.#s, n));
		else {
			let e = !!i?.scrubbing;
			a = w(t, e ? i.focus : this.#m, e ? null : this.#t);
			let r = Math.max(0, n);
			o = (this.#s.centers[r] ?? 0) + (a[r] ?? 0);
		}
		this.#l = [
			...a,
			y(o - m / 2),
			+!!this.#h
		], e || r.matches ? (this.#c = [...this.#l], this.#u = this.#c.map(() => 0), this.#d.stop(), this.#S()) : this.#d.wake();
	}
	#b() {
		for (let e = 0; e < this.#c.length; e++) this.#u[e] += ((this.#l[e] - this.#c[e]) * g.stiffness - this.#u[e] * g.damping) * _, this.#c[e] += this.#u[e] * _;
	}
	#x() {
		let e = this.#c.every((e, t) => Math.abs(this.#l[t] - e) < .01 && Math.abs(this.#u[t]) < .01);
		return e && (this.#c = [...this.#l]), this.#S(), !e;
	}
	#S() {
		let e = this.items.length, t = this.#c.slice(0, e), [n, r] = this.#c.slice(e), i = this.#p;
		this.shadowRoot.querySelectorAll(".segment").forEach((n, a) => {
			n.style.transform = `translate3d(${y(t[a])}px,0,0)`, n.style.opacity = a === i ? "" : String(y(b(1 - r * 1.8, 0, 1)));
			let [o, s] = n.querySelectorAll(".cap");
			o.style.transform = a > 0 ? O(t[a] - t[a - 1], r) : "scaleX(0)", s.style.transform = a < e - 1 ? O(t[a + 1] - t[a], r) : "scaleX(0)";
		});
		let a = this.query(".chevron");
		a.style.transform = `translate3d(${y(n)}px,0,0)`, a.style.opacity = String(y(r));
	}
	#C(e) {
		let t = this.items[e];
		t && e !== this.#p && (this.value = t.href, this.#v(), this.emit("change", {
			href: t.href,
			index: e
		}));
	}
	#w() {
		let e = this.items.map(({ href: e }) => e), t = [location.hash, location.pathname].map((t) => S(e, t)).find((e) => e >= 0);
		t === void 0 ? this.value ||= e[0] ?? "" : this.value = e[t];
	}
	#T() {
		let e = !!this.compact && window.scrollY > p, t = this.#o !== null && (!e || Math.abs(window.scrollY - this.#o) > p);
		(e !== this.#a || t) && (this.#a = e, t && (this.#o = null), this.#v());
	}
	#E() {
		this.#o = window.scrollY, this.#v(), this.#f[this.#p]?.focus({ preventScroll: !0 });
	}
	#D(e, t) {
		let n = e.target.closest(".segment");
		if (!n || n.contains(e.relatedTarget) || e.pointerType !== "mouse" || this.#r?.scrubbing) return;
		let r = Number(n.dataset.index);
		if (t) this.#t = r;
		else if (this.#t === r) this.#t = null;
		else return;
		this.#y(!1);
	}
	#O(e, t) {
		return b(E(this.#s?.centers ?? [], e - t.rowLeft), 0, this.items.length - 1);
	}
	#k(e) {
		e.button !== 0 || this.#h || e.target.closest(".chevron") || (this.#r = {
			id: e.pointerId,
			startX: e.clientX,
			rowLeft: e.currentTarget.getBoundingClientRect().left,
			scrubbing: !1,
			focus: this.#m,
			samples: [{
				x: e.clientX,
				t: e.timeStamp
			}]
		});
	}
	#A(e) {
		let t = this.#r;
		if (t?.id === e.pointerId) {
			if (!t.scrubbing) {
				if (Math.abs(e.clientX - t.startX) < u) return;
				t.scrubbing = !0, e.currentTarget.setPointerCapture(e.pointerId), this.#t = null;
			}
			t.samples.push({
				x: e.clientX,
				t: e.timeStamp
			}), t.samples.length > 12 && t.samples.shift(), t.focus = this.#O(e.clientX, t), this.#e = Math.round(t.focus), this.#v();
		}
	}
	#j(e, t) {
		let n = this.#r;
		if (n?.id !== e.pointerId || (this.#r = null, !n.scrubbing)) return;
		if (this.#e = null, !t) {
			this.#v();
			return;
		}
		let r = D(n.samples, e.timeStamp), i = Math.round(this.#O(e.clientX + r * d, n));
		this.#i = !0, setTimeout(() => this.#i = !1), this.#f[i]?.click(), this.#v();
	}
	#M(e) {
		if (this.#i && e.isTrusted) {
			this.#i = !1, e.preventDefault(), e.stopPropagation();
			return;
		}
		if (e.target.closest(".chevron")) {
			this.#E();
			return;
		}
		let t = e.target.closest(".link");
		t && (this.#C(this.#f.indexOf(t)), this.#N(e, t.getAttribute("href")));
	}
	#N(e, t) {
		if (!t.startsWith("#") || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		e.preventDefault();
		let n = document.getElementById(decodeURIComponent(t.slice(1)));
		n && (n.scrollIntoView(), location.hash !== t && history.pushState(null, "", t));
	}
	#P(e) {
		let t = this.#f, n = v[e.key], r = t.indexOf(this.shadowRoot.activeElement);
		!n || r < 0 || (e.preventDefault(), t[b(n(r, t.length), 0, t.length - 1)].focus());
	}
	#F(e) {
		let t = this.#f.indexOf(e.target);
		t < 0 || !e.target.matches(":focus-visible") || (this.#n = !0, this.#e = t, this.#v(!0));
	}
	#I() {
		(this.#n || this.#e !== null) && (this.#n = !1, this.#r || (this.#e = null), this.#v(!0));
	}
};
//#endregion
//#region src/components/morphic-navbar/index.js
t("morphic-navbar", k);
//#endregion
export { k as t };
