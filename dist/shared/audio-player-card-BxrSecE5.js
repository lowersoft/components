import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { n as a } from "./people-C_zYMoEl.js";
import { it as o, ot as s, st as c, tt as l } from "./lucide-BVbUPHVq.js";
//#region src/components/audio-player-card/audio-player-card.scss?inline
var u = ":host{box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:24rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);-webkit-user-select:none;user-select:none;border-radius:1.5rem;padding:1.25rem;display:block}p{margin:0}.top{align-items:center;gap:.75rem;display:flex}.cover{border-radius:var(--lw-radius-lg);width:3rem;height:3rem;font-size:var(--lw-text-sm);color:#fff;background:linear-gradient(135deg,#f97316,#db2777);flex:none;place-items:center;font-weight:600;display:grid}.titles{min-width:0}.heading,.show{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.heading{font-size:var(--lw-text-sm);font-weight:500}.show{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}.wave{border-radius:var(--lw-radius-md);cursor:pointer;touch-action:pan-y;outline:none;margin-top:1.25rem;padding-top:.5rem;position:relative}.wave:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:4px}.marks{height:.25rem;position:absolute;inset:0 0 auto}.marks span{background:var(--lw-color-ring);border-radius:1px;width:2px;height:.25rem;position:absolute;translate:-50%}.bars{align-items:center;gap:2px;height:3rem;display:flex}.bars span{border-radius:var(--lw-radius-full);background:var(--lw-color-border);flex:1;min-height:3px;transition:background-color .12s ease-out}.bars span[data-played]{background:var(--lw-color-foreground)}.tip{border-radius:var(--lw-radius-md);background:var(--lw-color-primary);font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--lw-color-primary-foreground);pointer-events:none;flex-direction:column;align-items:center;padding:.25rem .5rem;display:flex;position:absolute;bottom:calc(100% + .25rem);translate:-50%}.tip[hidden]{display:none}.tip b{font-weight:500}.tip span{opacity:.7}.times{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);justify-content:space-between;gap:.75rem;margin-top:.5rem;display:flex}.chapter{text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-foreground);overflow:hidden}.controls{grid-template-columns:1fr auto auto auto 1fr;align-items:center;gap:.75rem;margin-top:1rem;display:grid}button{font:inherit;color:inherit;cursor:pointer;background:0 0;border:0;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.speed{border-radius:var(--lw-radius-full);background:var(--lw-color-muted);min-width:2.75rem;font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;justify-self:start;padding:.25rem .5rem;font-weight:600}.back,.forward{width:2.5rem;height:2.5rem;color:var(--lw-color-muted-foreground);transition:background-color var(--lw-duration-fast) ease-out, color var(--lw-duration-fast) ease-out;border-radius:50%;place-items:center;padding:0;display:grid;position:relative}.back:hover,.forward:hover{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.back span,.forward span{font-size:7px;font-weight:700;position:absolute}.play{background:var(--lw-color-primary);width:3rem;height:3rem;color:var(--lw-color-primary-foreground);transition:scale var(--lw-duration-fast) ease-out;border-radius:50%;place-items:center;padding:0;display:grid}.play:active{scale:.94}.play svg{fill:currentColor}.icon{grid-area:1/1;transition:opacity .18s ease-out,scale .18s ease-out,filter .18s ease-out;display:grid}.play-icon{translate:1px}.pause-icon,[data-playing] .play-icon{opacity:0;filter:blur(2px);scale:.6}[data-playing] .pause-icon{opacity:1;filter:none;scale:1}", d = 64, f = [
	1,
	1.25,
	1.5,
	2,
	.75
], p = 15, m = 30, h = 5, g = [
	{
		time: 0,
		title: "Intro"
	},
	{
		time: 142,
		title: "Why motion matters"
	},
	{
		time: 528,
		title: "Springs, not curves"
	},
	{
		time: 1015,
		title: "Interruptible by default"
	},
	{
		time: 1460,
		title: "Questions from listeners"
	}
], _ = (e, t, n) => Math.min(n, Math.max(t, e)), v = (e) => {
	let t = Math.max(0, Math.floor(e)), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60), i = String(t % 60).padStart(2, "0");
	return n ? `${n}:${String(r).padStart(2, "0")}:${i}` : `${r}:${i}`;
}, y = (e) => {
	let t = [...e].reduce((e, t) => (e * 31 + t.charCodeAt(0)) % 2147483647, 7) || 7, n = () => (t = t * 16807 % 2147483647, t / 2147483647);
	return Array.from({ length: d }, (e, t) => {
		let r = .55 + .45 * Math.sin(t / 3.1 + n());
		return Math.max(.12, Math.min(1, r * (.45 + n() * .6)));
	});
}, b = class extends e {
	static styles = u;
	static props = {
		heading: { default: "Designing for motion" },
		show: { default: "Lowersoft Radio · Episode 42" },
		src: { default: "" },
		duration: {
			type: Number,
			default: 1860
		},
		chapters: {
			type: Object,
			default: g
		}
	};
	#e = null;
	#t = 0;
	#n = !1;
	#r = 0;
	#i = 0;
	#a = 0;
	#o = null;
	render() {
		return `<div class="top"><span class="cover" aria-hidden="true"></span><div class="titles"><p class="heading"></p><p class="show"></p></div></div>
<div class="wave" role="slider" tabindex="0" aria-valuemin="0"><div class="marks"></div><div class="bars"></div><span class="tip" hidden></span></div>
<div class="times"><span class="elapsed"></span><span class="chapter"></span><span class="remaining"></span></div>
<div class="controls"><button class="speed" type="button"></button><button class="back" type="button" aria-label="Back ${p} seconds">${r(s, 20)}<span>${p}</span></button><button class="play" type="button" aria-label="Play"><span class="icon play-icon">${r(o, 20)}</span><span class="icon pause-icon">${r(l, 20)}</span></button><button class="forward" type="button" aria-label="Forward ${m} seconds">${r(c, 20)}<span>${m}</span></button><span class="spacer"></span></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".play").addEventListener("click", () => this.#d(), e), this.query(".back").addEventListener("click", () => this.#h(this.#t - p), e), this.query(".forward").addEventListener("click", () => this.#h(this.#t + m), e), this.query(".speed").addEventListener("click", () => this.#g(), e);
		let t = this.query(".wave");
		t.addEventListener("pointerdown", (e) => this.#b(e), e), t.addEventListener("pointermove", (e) => this.#x(e), e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, () => this.#o = null, e);
		t.addEventListener("pointerleave", () => this.query(".tip").hidden = !0, e), t.addEventListener("keydown", (e) => this.#S(e), e), this.signal.addEventListener("abort", () => {
			this.#p(), cancelAnimationFrame(this.#a), this.#a = 0;
		});
	}
	updated(e) {
		e.has("src") && this.#u(), e.has("heading") && (this.query(".bars").innerHTML = y(this.heading ?? "").map((e) => `<span style="height: ${(e * 100).toFixed(1)}%"></span>`).join(""), this.query(".cover").textContent = a(this.heading ?? "")), this.query(".heading").textContent = this.heading ?? "", this.query(".show").textContent = this.show ?? "", this.#_();
	}
	get #s() {
		return this.#e && Number.isFinite(this.#e.duration) ? this.#e.duration : this.duration;
	}
	get #c() {
		return [...this.chapters ?? []].sort((e, t) => e.time - t.time);
	}
	#l(e) {
		return this.#c.findLast((t) => t.time <= e);
	}
	#u() {
		if (this.#p(), this.#e = this.src ? new Audio(this.src) : null, !this.#e) return;
		this.#e.preload = "metadata", this.#e.playbackRate = f[this.#r];
		let e = () => {
			this.#t = this.#e.currentTime, this.#_();
		};
		for (let t of [
			"timeupdate",
			"loadedmetadata",
			"seeked"
		]) this.#e.addEventListener(t, e, { signal: this.signal });
		this.#e.addEventListener("ended", () => this.#p(), { signal: this.signal });
	}
	#d() {
		this.#n ? this.#p() : this.#f();
	}
	#f() {
		this.#t >= this.#s && (this.#t = 0), this.#n = !0, this.#e && (this.#e.currentTime = this.#t, this.#e.play().catch(() => this.#p())), this.#i = performance.now(), this.#a ||= requestAnimationFrame((e) => this.#m(e)), this.#_(), this.emit("play");
	}
	#p() {
		this.#n && (this.#n = !1, this.#e?.pause(), this.#_(), this.emit("pause"));
	}
	#m(e) {
		this.#a = 0, this.#n && (this.#e || (this.#t = Math.min(this.#s, this.#t + (e - this.#i) / 1e3 * f[this.#r]), this.#t >= this.#s && this.#p()), this.#i = e, this.#_(), this.#n && (this.#a = requestAnimationFrame((e) => this.#m(e))));
	}
	#h(e) {
		this.#t = _(e, 0, this.#s), this.#e && (this.#e.currentTime = this.#t), this.#_();
	}
	#g() {
		this.#r = (this.#r + 1) % f.length, this.#e && (this.#e.playbackRate = f[this.#r]);
		let e = this.query(".speed");
		i.matches || e.animate([{ scale: .88 }, { scale: 1 }], {
			duration: 220,
			easing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
		}), this.#_();
	}
	#_() {
		let e = this.#s, t = e ? this.#t / e : 0, n = Math.round(t * d);
		[...this.query(".bars").children].forEach((e, t) => e.toggleAttribute("data-played", t < n)), this.query(".marks").innerHTML = this.#c.filter(({ time: e }) => e > 0).map(({ time: t }) => `<span style="left: ${(t / e * 100).toFixed(2)}%"></span>`).join(""), this.query(".elapsed").textContent = v(this.#t), this.query(".remaining").textContent = `-${v(e - this.#t)}`;
		let r = this.#l(this.#t);
		this.query(".chapter").textContent = r?.title ?? "";
		let i = this.query(".play");
		i.toggleAttribute("data-playing", this.#n), i.ariaLabel = this.#n ? "Pause" : "Play";
		let a = f[this.#r];
		this.query(".speed").textContent = `${a}×`, this.query(".speed").ariaLabel = `Playback speed ${a}×. Change`;
		let o = this.query(".wave");
		o.ariaLabel = `${this.heading}, seek`, o.ariaValueMax = String(Math.round(e)), o.ariaValueNow = String(Math.round(this.#t)), o.ariaValueText = `${v(this.#t)} of ${v(e)}${r ? `, ${r.title}` : ""}`;
	}
	#v(e) {
		let t = this.query(".bars").getBoundingClientRect();
		return _((e - t.left) / t.width, 0, 1) * this.#s;
	}
	#y(e) {
		let t = this.query(".bars").getBoundingClientRect(), r = this.#v(e), i = this.#l(r), a = this.query(".tip");
		a.innerHTML = `${i ? `<b>${n(i.title)}</b>` : ""}<span>${v(r)}</span>`, a.style.left = `${_(e - t.left, 0, t.width)}px`, a.hidden = !1;
	}
	#b(e) {
		(e.pointerType !== "mouse" || e.button === 0) && (e.currentTarget.setPointerCapture?.(e.pointerId), this.#o = e.pointerId, this.#h(this.#v(e.clientX)), this.#y(e.clientX));
	}
	#x(e) {
		(e.pointerType === "mouse" || this.#o === e.pointerId) && this.#y(e.clientX), this.#o === e.pointerId && this.#h(this.#v(e.clientX));
	}
	#S(e) {
		let t = e.shiftKey ? 15 : h, n = {
			ArrowRight: t,
			ArrowUp: t,
			ArrowLeft: -t,
			ArrowDown: -t
		};
		if (e.key in n) this.#h(this.#t + n[e.key]);
		else if (e.key === "Home") this.#h(0);
		else if (e.key === "End") this.#h(this.#s);
		else if (e.key === " " || e.key === "k") this.#d();
		else return;
		e.preventDefault();
	}
};
//#endregion
//#region src/components/audio-player-card/index.js
t("audio-player-card", b);
//#endregion
export { b as t };
