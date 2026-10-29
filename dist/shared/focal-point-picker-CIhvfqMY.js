import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
//#region src/components/focal-point-picker/focal-point-picker.scss?inline
var r = ":host{--_ease:cubic-bezier(.23, 1, .32, 1);--_accent:var(--lightningcss-light,#ea580c)var(--lightningcss-dark,#f97316);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:36rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);-webkit-user-select:none;user-select:none;border-radius:1.5rem;padding:1rem;display:block}img{object-fit:cover;pointer-events:none;width:100%;height:100%;position:absolute;inset:0}.frame{background:var(--lw-color-muted);cursor:crosshair;touch-action:none;border-radius:1rem;position:relative;overflow:hidden}.window{opacity:0;pointer-events:none;outline:1px solid #fff9;position:absolute;inset:0;box-shadow:0 0 0 9999px #00000073}@media (prefers-reduced-motion:no-preference){.window{transition-property:left,top,width,height,opacity;transition-duration:.2s;transition-timing-function:var(--_ease)}}.window[data-shown]{opacity:1}.window .corners{inset:.375rem}.corners{pointer-events:none;position:absolute;inset:.25rem}.corners i{filter:drop-shadow(0 0 1px #0009);border:0 solid #fff;width:.625rem;height:.625rem;position:absolute}.corners i:first-child{border-width:1px 0 0 1px;top:0;left:0}.corners i:nth-child(2){border-width:1px 1px 0 0;top:0;right:0}.corners i:nth-child(3){border-width:0 0 1px 1px;bottom:0;left:0}.corners i:nth-child(4){border-width:0 1px 1px 0;bottom:0;right:0}.layer{pointer-events:none;position:absolute;inset:0}@media (prefers-reduced-motion:no-preference){:host([data-gliding]) .layer{transition:translate .28s var(--_ease)}}.point{cursor:grab;pointer-events:auto;background:0 0;border:0;border-radius:50%;outline:none;width:2.5rem;height:2.5rem;padding:0;position:absolute;top:0;left:0;translate:-50% -50%}.point:active{cursor:grabbing}.point:focus-visible{box-shadow:0 0 0 2px #0006,0 0 0 4px #fff}.cross{filter:drop-shadow(0 0 1px #000000b3);background-color:#0000;background-image:linear-gradient(#fff,#fff),linear-gradient(#fff,#fff),linear-gradient(#fff,#fff),linear-gradient(#fff,#fff);background-position:0,100%,top,bottom;background-repeat:no-repeat;background-size:15px 1px,15px 1px,1px 15px,1px 15px;background-attachment:scroll,scroll,scroll,scroll;background-origin:padding-box,padding-box,padding-box,padding-box;background-clip:border-box,border-box,border-box,border-box;position:absolute;inset:0}.dot{background:var(--_accent);border-radius:50%;width:.375rem;height:.375rem;position:absolute;top:50%;left:50%;translate:-50% -50%;box-shadow:0 0 0 1px #fff}.crops{align-items:flex-end;gap:.75rem;margin-top:1rem;display:flex}.crop{min-width:0;font:inherit;text-align:left;color:inherit;cursor:pointer;background:0 0;border:0;outline:none;padding:0}.thumb{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);display:block;position:relative;overflow:hidden}@media (prefers-reduced-motion:no-preference){.thumb{transition:box-shadow .15s ease-out}}[data-shown]>.thumb{box-shadow:0 0 0 2px var(--lw-color-background), 0 0 0 4px var(--lw-color-foreground)}.crop:focus-visible>.thumb{box-shadow:0 0 0 2px var(--lw-color-background), 0 0 0 4px var(--lw-color-ring)}@media (prefers-reduced-motion:no-preference){:host([data-gliding]) .thumb img{transition:object-position .28s var(--_ease)}}.label{font-size:var(--lw-text-xs);text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-muted-foreground);margin-top:.375rem;display:block;overflow:hidden}.foot{border-top:1px solid var(--lw-color-border);font-size:var(--lw-text-xs);justify-content:space-between;align-items:center;gap:.75rem;margin-top:.75rem;padding-top:.75rem;display:flex}.hint{color:var(--lw-color-muted-foreground)}.value{font-family:var(--lw-font-mono);font-variant-numeric:tabular-nums;flex:none}", i = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=1067&fit=crop&auto=format&q=80", a = [
	{
		label: "Avatar",
		ratio: 1
	},
	{
		label: "Banner",
		ratio: 16 / 9
	},
	{
		label: "Story",
		ratio: 9 / 16
	}
], o = "<span class=\"corners\" aria-hidden=\"true\"><i></i><i></i><i></i><i></i></span>", s = (e, t, n) => Math.min(n, Math.max(t, e)), c = (e) => `${Math.round(e * 100)}%`, l = (e, t, n, r) => {
	let i = Math.min(1, r / n), a = Math.min(1, n / r), o = s(e - i / 2, 0, 1 - i), c = s(t - a / 2, 0, 1 - a);
	return {
		left: o,
		top: c,
		w: i,
		h: a,
		position: `${i < 1 ? o / (1 - i) * 100 : 50}% ${a < 1 ? c / (1 - a) * 100 : 50}%`
	};
}, u = class extends e {
	static styles = r;
	static props = {
		src: { default: i },
		alt: { default: "Peaks above a sea of clouds" },
		imageRatio: {
			type: Number,
			default: 3 / 2
		},
		x: {
			type: Number,
			default: .68
		},
		y: {
			type: Number,
			default: .38
		},
		crops: {
			type: Object,
			default: a
		}
	};
	#e = -1;
	#t = !1;
	render() {
		return `<div class="frame"><img class="source" draggable="false"><div class="window" aria-hidden="true">${o}</div>
<div class="layer"><button class="point" type="button"><span class="cross"></span><span class="dot"></span></button></div></div>
<div class="crops"></div>
<div class="foot"><span class="hint">Drag the point, or hover a crop to see it</span><code class="value"></code></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".frame");
		t.addEventListener("pointerdown", (e) => {
			e.isPrimary && e.button === 0 && (t.setPointerCapture(e.pointerId), this.#t = !0, this.#a(e, !this.query(".point").contains(e.target)));
		}, e), t.addEventListener("pointermove", (e) => this.#t && this.#a(e, !1), e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, () => this.#t = !1, e);
		this.query(".point").addEventListener("keydown", (e) => this.#o(e), e);
		let n = this.query(".crops"), r = (e) => {
			this.#e = e, this.#r();
		}, i = (e) => Number(e.target.closest(".crop")?.dataset.index ?? -1);
		n.addEventListener("pointerover", (e) => e.pointerType === "mouse" && r(i(e)), e), n.addEventListener("pointerout", () => r(-1), e), n.addEventListener("focusin", (e) => r(i(e)), e), n.addEventListener("focusout", () => r(-1), e);
	}
	updated(e) {
		let t = this.query(".source");
		e.has("src") && (t.src = this.src), t.alt = this.alt ?? "", this.query(".frame").style.aspectRatio = String(this.imageRatio), (e.has("crops") || e.has("src")) && this.#n(), this.#r();
	}
	#n() {
		this.query(".crops").innerHTML = this.crops.map(({ label: e, ratio: t }, r) => `<button class="crop" type="button" data-index="${r}" style="flex: ${t} 1 0"><span class="thumb" style="aspect-ratio: ${t}"><img alt="" draggable="false" src="${n(this.src)}">${o}</span><span class="label">${n(e)}</span></button>`).join(""), this.#e = -1;
	}
	#r() {
		let { x: e, y: t, imageRatio: n } = this;
		this.query(".layer").style.translate = `${e * 100}% ${t * 100}%`, this.query(".point").ariaLabel = `Focal point, ${c(e)} from the left, ${c(t)} from the top. Move with the arrow keys.`, this.query(".value").textContent = `${c(e)} ${c(t)}`, this.shadowRoot.querySelectorAll(".crop").forEach((r, i) => {
			r.querySelector("img").style.objectPosition = l(e, t, n, this.crops[i].ratio).position, r.toggleAttribute("data-shown", i === this.#e);
		});
		let r = this.crops[this.#e], i = this.query(".window");
		if (i.toggleAttribute("data-shown", !!r), !r) return;
		let { left: a, top: o, w: s, h: u } = l(e, t, n, r.ratio);
		Object.assign(i.style, {
			left: c(a),
			top: c(o),
			width: c(s),
			height: c(u)
		});
	}
	#i(e, t, n) {
		this.toggleAttribute("data-gliding", n), (e !== this.x || t !== this.y) && (this.x = e, this.y = t, this.emit("change", {
			x: e,
			y: t
		}));
	}
	#a(e, t) {
		let n = this.query(".frame").getBoundingClientRect();
		this.#i(s((e.clientX - n.left) / n.width, 0, 1), s((e.clientY - n.top) / n.height, 0, 1), t);
	}
	#o(e) {
		let t = e.shiftKey ? .1 : .01, n = {
			ArrowLeft: [-t, 0],
			ArrowRight: [t, 0],
			ArrowUp: [0, -t],
			ArrowDown: [0, t]
		}[e.key];
		if (!n) return;
		e.preventDefault();
		let r = (e, t) => s(Math.round((e + t) * 100) / 100, 0, 1);
		this.#i(r(this.x, n[0]), r(this.y, n[1]), !1);
	}
};
//#endregion
//#region src/components/focal-point-picker/index.js
t("focal-point-picker", u);
//#endregion
export { u as t };
