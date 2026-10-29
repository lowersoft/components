import { n as e, t } from "./core-WcEz9YgG.js";
import { r as n } from "./icons-Dv1KN71n.js";
import { i as r, n as i, r as a } from "./motion-CFWhFfc_.js";
import { Et as o, ot as s } from "./lucide-BVbUPHVq.js";
//#region src/components/photo-straighten/photo-straighten.scss?inline
var c = ":host{--_level:var(--lightningcss-light,#059669)var(--lightningcss-dark,#34d399);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:32rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);-webkit-user-select:none;user-select:none;border-radius:1.5rem;padding:1rem;display:block}.frame{background:var(--lw-color-muted);border-radius:1rem;position:relative;overflow:hidden}.photo{object-fit:cover;pointer-events:none;width:100%;height:100%;position:absolute;inset:0}.grid{opacity:0;pointer-events:none;position:absolute;inset:0}@media (prefers-reduced-motion:no-preference){.grid{transition:opacity .2s ease-out}}:host([data-adjusting]) .grid{opacity:1}.grid span{background:#ffffff40;position:absolute}.grid span[data-third]{background:#ffffffb3}.grid span[data-axis=x]{inset-inline:0;top:calc(var(--_at) * 100%);height:1px}.grid span[data-axis=y]{inset-block:0;left:calc(var(--_at) * 100%);width:1px}.badge{border-radius:var(--lw-radius-full);color:#fff;background:#0000008c;padding:.25rem .625rem;font-size:11px;font-weight:500;position:absolute;top:.75rem;left:.75rem}@media (prefers-reduced-motion:no-preference){.badge{transition:background-color .2s ease-out}}:host([data-level]) .badge{background:#059669e6;background:lab(54.8183% -43.5039 13.9397/.9)}.tools{justify-content:space-between;align-items:center;margin-top:1rem;display:flex}.value{font-size:var(--lw-text-sm);font-variant-numeric:tabular-nums;font-weight:500}@media (prefers-reduced-motion:no-preference){.value{transition:color .2s ease-out}}:host([data-level]) .value{color:var(--_level)}.dial{border-radius:var(--lw-radius-md);cursor:ew-resize;touch-action:none;outline:none;height:3rem;margin-top:.5rem;position:relative;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,#0000,#000 20% 80%,#0000);mask-image:linear-gradient(90deg,#0000,#000 20% 80%,#0000)}.dial:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;-webkit-mask-image:none;mask-image:none}.ruler{height:100%;position:absolute;top:0;left:50%}.ruler span{justify-items:center;display:grid;position:absolute;top:.5rem;translate:-50%}.ruler span:before{content:\"\";background:var(--lw-color-border);width:1px;height:.5rem}.ruler span[data-major]:before{background:var(--lw-color-muted-foreground);height:.75rem}.ruler span[data-zero]:before{background:var(--_level);height:.75rem}.ruler i{font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);margin-top:.25rem;font-size:10px;font-style:normal}[data-zero]>.ruler i{color:var(--_level)}.needle{border-radius:var(--lw-radius-full);background:var(--lw-color-foreground);width:2px;height:1.25rem;position:absolute;top:.25rem;left:50%;translate:-50%}", l = 45, u = 9, d = .18, f = .6, p = a(.45, .1), m = 5, h = ["x", "y"].map((e) => [
	1,
	2,
	3,
	4,
	5
].map((t) => `<span data-axis="${e}"${t % 2 ? "" : " data-third"} style="--_at: ${t / 6}"></span>`).join("")).join(""), g = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&h=1200&fit=crop&auto=format&q=80", _ = (e, t, n) => Math.min(n, Math.max(t, e)), v = (e) => Math.round(e * 10) / 10, y = (e) => Math.abs(e) <= l ? e : Math.sign(e) * (l + 3 * (1 - Math.exp(-(Math.abs(e) - l) / 6))), b = (e) => {
	let t = v(e);
	return t === 0 ? "0°" : `${t > 0 ? "+" : "−"}${Math.abs(t).toFixed(1)}°`;
}, x = class extends e {
	static styles = c;
	static props = {
		src: { default: g },
		alt: { default: "A lake below mountains" },
		aspectRatio: {
			type: Number,
			default: 4 / 3
		},
		tilt: {
			type: Number,
			default: 4.2
		},
		angle: {
			type: Number,
			default: 0
		}
	};
	#e = 0;
	#t = null;
	#n = null;
	render() {
		return `<div class="frame"><img class="photo" draggable="false"><div class="grid" aria-hidden="true">${h}</div><span class="badge"></span></div>
<div class="tools"><lw-button class="auto" variant="ghost" size="sm"><span slot="start">${n(o, 14)}</span>Auto</lw-button><span class="value"></span><lw-button class="reset" variant="ghost" size="sm"><span slot="start">${n(s, 14)}</span>Reset</lw-button></div>
<div class="dial" role="slider" tabindex="0" aria-label="Straighten" aria-valuemin="-45" aria-valuemax="${l}"><div class="ruler">${this.#r()}</div><span class="needle" aria-hidden="true"></span></div>`;
	}
	#r() {
		return Array.from({ length: 91 }, (e, t) => {
			let n = t - l, r = n === 0 ? " data-zero" : n % 5 == 0 ? " data-major" : "";
			return `<span style="left: ${t * u}px"${r}>${n % 15 == 0 ? `<i>${n}</i>` : ""}</span>`;
		}).join("");
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".dial");
		t.addEventListener("pointerdown", (e) => this.#c(e), e), t.addEventListener("pointermove", (e) => this.#l(e), e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, (e) => this.#u(e), e);
		t.addEventListener("dblclick", () => this.#s(0), e), t.addEventListener("keydown", (e) => this.#d(e), e), this.query(".auto").addEventListener("click", () => this.#s(-this.tilt), e), this.query(".reset").addEventListener("click", () => this.#s(0), e), this.signal.addEventListener("abort", () => this.#t?.());
	}
	updated(e) {
		let t = this.query(".photo");
		e.has("src") && (t.src = this.src), t.alt = this.alt ?? "", this.query(".frame").style.aspectRatio = String(this.aspectRatio), this.angle !== this.#i && (this.#t?.(), this.#e = this.angle), this.#o();
	}
	get #i() {
		return v(_(this.#e, -45, l));
	}
	#a(e) {
		this.#e = e;
		let t = this.#i;
		t !== this.angle && (this.angle = t, this.emit("change", { angle: t })), this.#o();
	}
	#o() {
		let e = this.tilt + this.#e, t = Math.abs(e) * Math.PI / 180, n = Math.max(this.aspectRatio, 1 / this.aspectRatio);
		this.query(".photo").style.transform = `rotate(${e}deg) scale(${Math.cos(t) + n * Math.sin(t)})`, this.query(".ruler").style.translate = `${-(this.#e + l) * u}px 0`;
		let r = this.#i, i = Math.abs(this.tilt + r) < .05;
		this.toggleAttribute("data-level", i), this.query(".badge").textContent = i ? "Level" : "Crooked", this.query(".value").textContent = b(r);
		let a = this.query(".dial");
		a.ariaValueNow = String(r), a.ariaValueText = b(r), this.query(".reset").disabled = r === 0;
	}
	#s(e) {
		this.#t?.(), i.matches ? (this.#a(e), this.toggleAttribute("data-adjusting", !1)) : (this.toggleAttribute("data-adjusting", !0), this.#t = r(this.#e, e, {
			...p,
			update: (e) => this.#a(e),
			done: () => {
				this.#t = null, this.#n || this.toggleAttribute("data-adjusting", !1);
			}
		}));
	}
	#c(e) {
		!e.isPrimary || e.button !== 0 || this.#n || (e.currentTarget.setPointerCapture(e.pointerId), this.#t?.(), this.#n = {
			x: e.clientX,
			from: this.#e,
			samples: [{
				x: e.clientX,
				t: e.timeStamp
			}]
		}, this.toggleAttribute("data-adjusting", !0));
	}
	#l(e) {
		let t = this.#n;
		t && (this.#a(y(t.from - (e.clientX - t.x) / u)), t.samples.push({
			x: e.clientX,
			t: e.timeStamp
		}), t.samples.length > m && t.samples.shift());
	}
	#u(e) {
		let t = this.#n;
		if (!t) return;
		this.#n = null;
		let [n] = t.samples, r = (e.timeStamp - n.t) / 1e3, i = r > 0 && r < .15 ? -(e.clientX - n.x) / u / r : 0, a = _(this.#e + i * d, -45, l);
		this.#s(Math.abs(a) < f ? 0 : v(a));
	}
	#d(e) {
		if (e.key === "Home" || e.key === "0") {
			e.preventDefault(), this.#s(0);
			return;
		}
		let t = e.shiftKey ? 1 : .1, n = {
			ArrowLeft: -t,
			ArrowDown: -t,
			ArrowRight: t,
			ArrowUp: t
		}[e.key];
		n !== void 0 && (e.preventDefault(), this.#t?.(), this.#a(_(v(this.#e + n), -45, l)));
	}
};
//#endregion
//#region src/components/photo-straighten/index.js
t("photo-straighten", x);
//#endregion
export { x as t };
