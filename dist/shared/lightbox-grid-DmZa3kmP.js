import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { i, n as a, r as o } from "./motion-CFWhFfc_.js";
import { Dt as s, m as c, p as l } from "./lucide-BVbUPHVq.js";
//#region src/components/lightbox-grid/lightbox-grid.scss?inline
var u = ":host{width:36rem;max-width:100%;font-family:var(--lw-font-sans);display:block}.grid{grid-template-columns:repeat(3,1fr);gap:.5rem;margin:0;padding:0;list-style:none;display:grid}.grid li:first-child{grid-area:span 2/span 2}.thumb{aspect-ratio:1;border-radius:var(--lw-radius-lg);background:var(--lw-color-muted);cursor:zoom-in;border:0;outline:none;width:100%;padding:0;display:block;position:relative;overflow:hidden}.thumb:focus-visible{outline:2px solid var(--lw-color-foreground);outline-offset:2px}.thumb.away{opacity:0}.thumb img{object-fit:cover;width:100%;height:100%;transition:filter .2s ease-out}.thumb:hover img{filter:brightness(.95)}.viewer{z-index:100;position:fixed;inset:0}.viewer[hidden]{display:none}.backdrop{opacity:0;background:#09090b;position:absolute;inset:0}.photo{cursor:grab;touch-action:none;-webkit-user-select:none;user-select:none;will-change:transform, clip-path;position:absolute;overflow:hidden}.photo:active{cursor:grabbing}.photo img{object-fit:cover;pointer-events:none;width:100%;height:100%;display:block}.chrome{opacity:0;pointer-events:none;position:absolute;inset:0}.chrome button{color:#fff;cursor:pointer;pointer-events:auto;width:2.5rem;height:2.5rem;transition:background-color var(--lw-duration-fast) ease-out;background:#ffffff1a;border:0;border-radius:50%;place-items:center;padding:0;display:grid}.chrome button:hover{background:#fff3}.chrome button:focus-visible{outline:2px solid #ffffffb3}.chrome button:disabled{opacity:.3;pointer-events:none}.corner{align-items:center;gap:.75rem;display:flex;position:absolute;top:1rem;right:1rem}.count{font-size:var(--lw-text-sm);font-variant-numeric:tabular-nums;color:#fff9}.prev,.next{position:absolute;top:50%;translate:0 -50%}@media not (min-width:640px){.prev,.next{display:none!important}}.prev{left:1rem}.next{right:1rem}.caption{font-size:var(--lw-text-sm);text-align:center;color:#fffc;margin:0;position:absolute;inset-inline:1rem}", d = (e, t, n) => `https://images.unsplash.com/photo-${e}?w=${t}&h=${n}&fit=crop&auto=format&q=80`, f = [
	{
		src: d("1501785888041-af3ef285b470", 1600, 1067),
		alt: "A lake below mountains",
		width: 1600,
		height: 1067,
		caption: "Lake shore, early morning"
	},
	{
		src: d("1506905925346-21bda4d32df4", 1200, 1600),
		alt: "Peaks above the clouds",
		width: 1200,
		height: 1600,
		caption: "Above the cloud line"
	},
	{
		src: d("1470071459604-3b5ec3a7fe05", 1600, 1067),
		alt: "Misty hills",
		width: 1600,
		height: 1067,
		caption: "Fog over the hills"
	},
	{
		src: d("1441974231531-c6227db76b6e", 1200, 1600),
		alt: "Light through a forest",
		width: 1200,
		height: 1600,
		caption: "Forest, late afternoon"
	},
	{
		src: d("1469474968028-56623f02e42e", 1600, 1067),
		alt: "Sun setting over a valley",
		width: 1600,
		height: 1067,
		caption: "Valley at sunset"
	},
	{
		src: d("1433086966358-54859d0ed716", 1200, 1600),
		alt: "A waterfall",
		width: 1200,
		height: 1600,
		caption: "Waterfall after rain"
	}
], p = o(.5, .12), m = o(.42, .08), h = o(.35, .2), g = 48, _ = 12, v = 56, y = 10, b = 110, x = .55, S = .45, C = 6, w = {
	x: 0,
	y: 0,
	scale: 1,
	ix: 0,
	iy: 0,
	radius: y
}, T = (e) => {
	let t = window.innerWidth, n = window.innerHeight, r = t < 640 ? _ : g, i = Math.min((t - r * 2) / e.width, (n - r * 2 - v) / e.height), a = e.width * i, o = e.height * i;
	return {
		left: (t - a) / 2,
		top: (n - v - o) / 2,
		width: a,
		height: o
	};
}, E = (e, t, n, r) => {
	let i = n.width / n.height, a = (i > t.width / t.height ? t.height * i : t.width) / e.width;
	return {
		x: t.left + t.width / 2 - (e.left + e.width / 2),
		y: t.top + t.height / 2 - (e.top + e.height / 2),
		scale: a,
		ix: (e.width - t.width / a) / 2,
		iy: (e.height - t.height / a) / 2,
		radius: r / a
	};
}, D = (e) => e.bottom > 0 && e.top < window.innerHeight && e.right > 0 && e.left < window.innerWidth, O = class extends e {
	static styles = u;
	static props = { images: {
		type: Object,
		default: f
	} };
	#e = null;
	#t = null;
	#n = !1;
	#r = !1;
	#i = {
		...w,
		alpha: 1,
		fade: 0
	};
	#a = null;
	#o = null;
	#s = "";
	render() {
		return `<ul class="grid"></ul>
<div class="viewer" role="dialog" aria-modal="true" hidden>
  <div class="backdrop"></div>
  <div class="photo"><img alt="" draggable="false"></div>
  <div class="chrome"><div class="corner"><span class="count"></span><button class="close" type="button" aria-label="Close">${r(s)}</button></div><button class="prev" type="button" aria-label="Previous photo">${r(l)}</button><button class="next" type="button" aria-label="Next photo">${r(c)}</button><p class="caption"></p></div>
</div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".grid").addEventListener("click", (e) => {
			let t = e.target.closest(".thumb");
			t && this.#h(Number(t.dataset.index));
		}, e), this.query(".viewer").addEventListener("keydown", (e) => this.#x(e), e), this.query(".backdrop").addEventListener("click", () => this.#g(), e), this.query(".close").addEventListener("click", () => this.#g(), e), this.query(".prev").addEventListener("click", () => this.#_(-1), e), this.query(".next").addEventListener("click", () => this.#_(1), e);
		let t = this.query(".photo");
		t.addEventListener("pointerdown", (e) => this.#v(e), e), t.addEventListener("pointermove", (e) => this.#y(e), e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, (e) => this.#b(e), e);
		window.addEventListener("resize", () => this.#e !== null && this.#f(), e), this.signal.addEventListener("abort", () => {
			this.#a?.(), this.#e !== null && (document.documentElement.style.overflow = this.#s);
		});
	}
	updated(e) {
		e.has("images") && (this.query(".grid").innerHTML = this.images.map((e, t) => `<li><button class="thumb" type="button" data-index="${t}" aria-label="Open ${n(e.alt)}"><img src="${n(e.src)}" alt="" loading="lazy" draggable="false"></button></li>`).join(""));
	}
	get #c() {
		return [...this.shadowRoot.querySelectorAll(".thumb")];
	}
	#l() {
		let e = this.#i, t = this.query(".photo");
		t.style.transform = `translate(${e.x}px, ${e.y}px) scale(${e.scale})`, t.style.clipPath = `inset(${e.iy}px ${e.ix}px ${e.iy}px ${e.ix}px round ${e.radius}px)`, t.style.opacity = String(e.alpha), this.query(".backdrop").style.opacity = String(e.fade * .92), this.query(".chrome").style.opacity = String(e.fade);
	}
	#u(e, t) {
		this.#a?.();
		let n = { ...this.#i };
		return new Promise((r) => {
			this.#a = i(0, 1, {
				...t,
				restDelta: .001,
				update: (t) => {
					for (let r of Object.keys(e)) this.#i[r] = n[r] + (e[r] - n[r]) * t;
					this.#l();
				},
				done: () => {
					this.#a = null, r();
				}
			});
		});
	}
	#d(e, t) {
		let n = { ...this.#i }, r = performance.now();
		return new Promise((i) => {
			let a = (o) => {
				let s = Math.min(1, (o - r) / t), c = 1 - (1 - s) ** 3;
				for (let t of Object.keys(e)) this.#i[t] = n[t] + (e[t] - n[t]) * c;
				this.#l(), s < 1 ? requestAnimationFrame(a) : i();
			};
			requestAnimationFrame(a);
		});
	}
	#f() {
		let e = this.images[this.#e];
		this.#t = T(e);
		let t = this.query(".photo");
		Object.assign(t.style, {
			left: `${this.#t.left}px`,
			top: `${this.#t.top}px`,
			width: `${this.#t.width}px`,
			height: `${this.#t.height}px`
		});
		let n = this.query(".caption");
		n.textContent = e.caption ?? "", n.style.top = `${this.#t.top + this.#t.height + 18}px`;
	}
	#p(e) {
		let t = this.#c[e], n = t?.getBoundingClientRect();
		return !n || !D(n) ? null : E(this.#t, n, this.images[e], Number.parseFloat(getComputedStyle(t).borderTopLeftRadius) || 0);
	}
	#m(e) {
		let t = this.images[e];
		this.#e = e, this.#f();
		let n = this.query(".photo img");
		n.src = t.src, n.alt = t.alt;
		let r = this.query(".viewer");
		r.ariaLabel = t.caption ?? t.alt, this.query(".count").textContent = `${e + 1} / ${this.images.length}`, this.query(".prev").disabled = e === 0, this.query(".next").disabled = e === this.images.length - 1, this.#c.forEach((t, n) => t.classList.toggle("away", n === e));
	}
	async #h(e) {
		this.#s = document.documentElement.style.overflow, document.documentElement.style.overflow = "hidden", this.#r = !1, this.#n = !1, this.query(".viewer").hidden = !1, this.#m(e), this.query(".close").focus({ preventScroll: !0 }), this.emit("open", { index: e });
		let t = this.#p(e);
		!t || a.matches ? (this.#i = {
			...w,
			alpha: 0,
			fade: 0
		}, await this.#d({
			alpha: 1,
			fade: 1
		}, 180)) : (this.#i = {
			...t,
			alpha: 1,
			fade: 0
		}, this.#l(), this.#d({ fade: 1 }, 300), await this.#u(w, p)), this.#n = !0;
	}
	async #g() {
		if (this.#e === null || this.#r) return;
		this.#r = !0;
		let e = this.#e;
		this.#c[e]?.scrollIntoView({
			behavior: "instant",
			block: "nearest",
			inline: "nearest"
		});
		let t = this.#p(e);
		!t || a.matches ? await this.#d({
			alpha: 0,
			fade: 0
		}, 160) : (this.#d({ fade: 0 }, 280), await this.#u(t, m)), this.query(".viewer").hidden = !0, this.#c[e]?.classList.remove("away"), this.#e = null, this.#r = !1, document.documentElement.style.overflow = this.#s, this.#c[e]?.focus({ preventScroll: !0 }), this.emit("close");
	}
	#_(e) {
		let t = (this.#e ?? 0) + e;
		this.#e === null || t < 0 || t >= this.images.length || (this.#m(t), this.#a?.(), a.matches ? (this.#i = {
			...w,
			alpha: 1,
			fade: 1
		}, this.#l()) : (this.#i = {
			...w,
			x: e * 72,
			alpha: 0,
			fade: 1
		}, this.#d({
			x: 0,
			alpha: 1
		}, 300)));
	}
	#v(e) {
		!this.#n || this.#r || e.button !== 0 || (e.currentTarget.setPointerCapture?.(e.pointerId), this.#a?.(), this.#o = {
			id: e.pointerId,
			x: e.clientX,
			y: e.clientY,
			axis: null,
			samples: [{
				x: e.clientX,
				y: e.clientY,
				t: e.timeStamp
			}]
		});
	}
	#y(e) {
		let t = this.#o;
		if (t?.id !== e.pointerId) return;
		let n = e.clientX - t.x, r = e.clientY - t.y;
		if (!t.axis) {
			if (Math.hypot(n, r) < C) return;
			t.axis = Math.abs(n) > Math.abs(r) ? "x" : "y";
		}
		if (t.samples.push({
			x: e.clientX,
			y: e.clientY,
			t: e.timeStamp
		}), t.samples.length > 5 && t.samples.shift(), t.axis === "y") {
			let e = Math.min(Math.abs(r) / window.innerHeight, 1);
			Object.assign(this.#i, {
				x: n,
				y: r,
				scale: 1 - e * .45,
				fade: 1 - Math.min(Math.abs(r) / 360, 1) * .85
			});
		} else {
			let e = n > 0 && this.#e === 0 || n < 0 && this.#e === this.images.length - 1;
			this.#i.x = e ? n * .25 : n;
		}
		this.#l();
	}
	#b(e) {
		let t = this.#o;
		if (t?.id !== e.pointerId) return;
		this.#o = null;
		let n = t.samples[0], r = t.samples.at(-1), i = Math.max(1, r.t - n.t), a = (r.x - n.x) / i, o = (r.y - n.y) / i, s = e.clientX - t.x, c = e.clientY - t.y;
		if (t.axis === "y") Math.abs(c) > b || Math.abs(o) > x ? this.#g() : this.#u({
			x: 0,
			y: 0,
			scale: 1,
			fade: 1
		}, h);
		else if (t.axis === "x") {
			let e = Math.abs(s) > this.#t.width * .22 || Math.abs(a) > S;
			e && s < 0 && this.#e < this.images.length - 1 ? this.#_(1) : e && s > 0 && this.#e > 0 ? this.#_(-1) : this.#u({ x: 0 }, h);
		}
	}
	#x(e) {
		if (e.key === "Escape") e.preventDefault(), this.#g();
		else if (e.key === "ArrowRight") this.#_(1);
		else if (e.key === "ArrowLeft") this.#_(-1);
		else if (e.key === "Tab") {
			let t = [...this.query(".viewer").querySelectorAll("button:not(:disabled)")], n = this.shadowRoot.activeElement;
			e.shiftKey && n === t[0] ? (e.preventDefault(), t.at(-1).focus()) : !e.shiftKey && n === t.at(-1) && (e.preventDefault(), t[0].focus());
		}
	}
};
//#endregion
//#region src/components/lightbox-grid/index.js
t("lightbox-grid", O);
//#endregion
export { O as t };
