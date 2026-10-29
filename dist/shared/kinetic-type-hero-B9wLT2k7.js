import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { n as r } from "./motion-CFWhFfc_.js";
import { t as i } from "./visibility--H4IXDjD.js";
//#region src/components/kinetic-type-hero/kinetic-type-hero.scss?inline
var a = ":host{--_accent:#ff5a36;box-sizing:border-box;background:var(--lw-color-background);width:100%;min-height:520px;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);padding:6rem clamp(1.5rem,5vw,4rem) 0;justify-content:center;align-items:flex-start;padding-block:5rem;display:flex;position:relative;overflow:hidden;container-type:inline-size}.container{width:100%;max-width:72rem;margin-inline:auto;position:relative}.stack{display:grid}@container (width>=56rem){.stack{grid-template-areas:\"stack\"}.stack>*{grid-area:stack}}.description{max-width:24rem;font-size:var(--lw-text-lg);text-wrap:pretty;color:var(--lw-color-muted-foreground);margin:0 0 2rem;line-height:1.6}@container (width>=56rem){.description{justify-self:end;margin:.5rem 0 0}}.title{letter-spacing:-.055em;white-space:nowrap;margin:0;font-size:6rem;font-weight:600;line-height:.95;position:relative}.line{padding-bottom:.06em;display:block;overflow:hidden}.set{display:inline-block}.letter{transform-origin:50% 100%;will-change:transform;display:inline-block}.space{white-space:pre}.stop{background:var(--_accent);width:.16em;height:.16em;margin-left:.04em}", o = 260, s = 18, c = 10, l = 900, u = 28, d = class extends e {
	static styles = a;
	static props = {
		heading: { default: "Make it\nunmistakable." },
		description: { default: "lower is written close to the metal: hand-tuned C with SIMD where it counts, no runtime and no garbage collector. One 1.4 MB binary that starts in under 10 ms and never asks the machine for more than it needs." }
	};
	#e = [];
	#t = [];
	#n = null;
	#r = 0;
	#i = 0;
	#a = !1;
	#o = !1;
	render() {
		return "<div class=\"container\"><div class=\"stack\"><p class=\"description\"></p><h1 class=\"title\"></h1></div></div>";
	}
	connected() {
		let e = { signal: this.signal }, t = new ResizeObserver(() => this.#c());
		t.observe(this.query(".stack")), this.signal.addEventListener("abort", () => {
			t.disconnect(), cancelAnimationFrame(this.#r);
		}), i(this, (e) => {
			this.#a = e, e && this.#l();
		}, this.signal), this.addEventListener("pointermove", (e) => {
			e.pointerType !== "mouse" || r.matches || (this.#n = {
				x: e.clientX,
				y: e.clientY
			}, this.#u());
		}, e), this.addEventListener("pointerleave", () => {
			this.#n = null, this.#u();
		}, e);
	}
	updated(e) {
		this.query(".description").textContent = this.description ?? "", e.has("heading") && this.#s();
	}
	#s() {
		let e = this.query(".title"), t = this.heading ?? "";
		e.ariaLabel = t.replace(/\n/g, " "), e.innerHTML = t.split("\n").map((e) => {
			let t = e.endsWith(".");
			return `<span class="line" aria-hidden="true"><span class="set">${[...t ? e.slice(0, -1) : e].map((e) => e === " " ? "<span class=\"space\"> </span>" : `<span class="letter">${n(e)}</span>`).join("")}${t ? "<span class=\"letter stop\"></span>" : ""}</span></span>`;
		}).join(""), this.#e = [...e.querySelectorAll(".letter")], this.#t = this.#e.map(() => [0, 0]), this.#o = !1, this.#c(), this.#a && this.#l();
	}
	#c() {
		let e = this.query(".title"), t = this.query(".stack").clientWidth;
		if (!t) return;
		e.style.fontSize = "100px";
		let n = Math.max(...[...e.querySelectorAll(".set")].map((e) => e.scrollWidth));
		n && (e.style.fontSize = `${100 * t / n}px`);
	}
	#l() {
		this.#o || (this.#o = !0, !r.matches && this.#e.forEach((e, t) => {
			e.animate([{ translate: "0 105%" }, { translate: "0 0" }], {
				duration: l,
				delay: t * u,
				easing: "cubic-bezier(0.23, 1, 0.32, 1)",
				fill: "backwards"
			});
		}));
	}
	#u() {
		this.#r || !this.#a || (this.#i = performance.now(), this.#r = requestAnimationFrame((e) => this.#d(e)));
	}
	#d(e) {
		this.#r = 0;
		let t = Math.min((e - this.#i) / 1e3, .05);
		this.#i = e;
		let n = 1 - Math.exp(-10 * t), r = !1, i = this.query(".title").getBoundingClientRect();
		this.#e.forEach((e, t) => {
			let a = [0, 0];
			if (this.#n) {
				let t = i.left + e.offsetLeft + e.offsetWidth / 2 - this.#n.x, n = i.top + e.offsetTop + e.offsetHeight / 2 - this.#n.y, r = Math.max(0, 1 - Math.hypot(t, n) / o) ** 2, l = Math.sign(t) || 1;
				a = [l * r * s, -l * r * c];
			}
			let l = this.#t[t];
			l[0] += (a[0] - l[0]) * n, l[1] += (a[1] - l[1]) * n, (Math.abs(a[0] - l[0]) > .05 || Math.abs(a[1] - l[1]) > .05) && (r = !0), e.style.transform = `translateX(${l[0].toFixed(2)}px) skewX(${l[1].toFixed(2)}deg)`;
		}), (r || this.#n) && (this.#r = requestAnimationFrame((e) => this.#d(e)));
	}
};
//#endregion
//#region src/components/kinetic-type-hero/index.js
t("kinetic-type-hero", d);
//#endregion
export { d as t };
