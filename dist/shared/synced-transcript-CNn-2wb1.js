import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { a, it as o, n as s, tt as c } from "./lucide-BVbUPHVq.js";
//#region src/components/synced-transcript/synced-transcript.scss?inline
var l = ":host{--_ease:cubic-bezier(.23, 1, .32, 1);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:28rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);-webkit-user-select:none;user-select:none;border-radius:1.5rem;padding:0;display:block}p{margin:0}button{font:inherit;color:inherit;cursor:pointer;background:0 0;border:0;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.head{justify-content:space-between;align-items:center;gap:.75rem;padding:1.25rem 1.25rem 0;display:flex}.titles{min-width:0}.kicker{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}.heading{font-size:var(--lw-text-sm);text-overflow:ellipsis;white-space:nowrap;font-weight:500;overflow:hidden}.speed{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-full);height:1.75rem;font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;flex:none;padding:0 .625rem;font-weight:500}@media (prefers-reduced-motion:no-preference){.speed{transition:background-color .15s ease-out}}.speed:hover{background:var(--lw-color-muted)}.body{position:relative}.scroll{box-sizing:border-box;outline:none;height:18rem;padding:1.5rem 1.25rem;overflow-y:auto;-webkit-mask-image:linear-gradient(#0000,#000 24px calc(100% - 24px),#0000);mask-image:linear-gradient(#0000,#000 24px calc(100% - 24px),#0000)}.scroll:focus-visible{box-shadow:inset 0 0 0 2px var(--lw-color-ring)}.content{isolation:isolate;position:relative}.mark{z-index:-1;border-radius:var(--lw-radius-sm);background:var(--lw-color-muted);opacity:0;pointer-events:none;position:absolute;top:0;left:0}.segment+.segment{margin-top:1.25rem}.who{font-size:var(--lw-text-xs);align-items:center;gap:.5rem;margin-bottom:.25rem;display:flex}.initial{background:var(--lw-color-muted);width:1.25rem;height:1.25rem;color:var(--lw-color-muted-foreground);border-radius:50%;place-items:center;font-size:10px;font-weight:500;display:grid}.speaker{font-weight:500}.stamp{border-radius:var(--lw-radius-sm);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);padding:0}@media (prefers-reduced-motion:no-preference){.stamp{transition:color .15s ease-out}}.stamp:hover{color:var(--lw-color-foreground)}.text{color:var(--lw-color-muted-foreground);cursor:pointer;font-size:15px;line-height:1.75rem}@media (prefers-reduced-motion:no-preference){.text span{transition:color .15s ease-out}}.text [data-spoken]{color:var(--lw-color-foreground)}.back-to-now{border-radius:var(--lw-radius-full);background:var(--lw-color-primary);box-shadow:var(--lw-shadow-sm);font-size:var(--lw-text-xs);color:var(--lw-color-primary-foreground);opacity:0;pointer-events:none;align-items:center;gap:.375rem;padding:.375rem .75rem;font-weight:500;display:flex;position:absolute;bottom:.75rem;left:50%;translate:-50% .5rem}@media (prefers-reduced-motion:no-preference){.back-to-now{transition:opacity .2s var(--_ease), translate .2s var(--_ease)}}.back-to-now[data-shown]{opacity:1;pointer-events:auto;translate:-50%}.back-to-now .arrow{display:grid}.bar{border-top:1px solid var(--lw-color-border);align-items:center;gap:.75rem;padding:.75rem 1.25rem;display:flex}.play{background:var(--lw-color-primary);width:2.25rem;height:2.25rem;color:var(--lw-color-primary-foreground);border-radius:50%;flex:none;place-items:center;padding:0;display:grid}@media (prefers-reduced-motion:no-preference){.play{transition:scale .15s ease-out}}.play:active{scale:.94}.play svg{fill:currentColor}.now,.total{width:2.25rem;font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground)}.total{text-align:right}.seek{border-radius:var(--lw-radius-sm);cursor:pointer;touch-action:none;outline:none;flex:1;align-items:center;height:1.5rem;display:flex;position:relative}.seek:before{content:\"\";border-radius:var(--lw-radius-full);background:var(--lw-color-muted);height:.25rem;position:absolute;inset-inline:0}.seek:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.fill{border-radius:var(--lw-radius-full);background:var(--lw-color-primary);transform-origin:0;width:100%;height:.25rem;position:relative;scale:0 1}", u = [
	1,
	1.5,
	2
], d = 5, f = /\s+/, p = "140ms cubic-bezier(0.23, 1, 0.32, 1)", m = ((e) => {
	let t = .6;
	return e.map(([e, n]) => {
		let r = t, i = r + n.split(f).length / 2.7;
		return t = i + .7, {
			speaker: e,
			start: r,
			end: i,
			text: n
		};
	});
})([
	["Maya", "Welcome back. Today we're talking about the small details in interfaces, the ones nobody notices until they're missing."],
	["Theo", "Right. Like a menu that opens in a hundred and fifty milliseconds instead of four hundred. You never think about it, but the slow one feels broken."],
	["Maya", "So where do you start when something feels off?"],
	["Theo", "I slow it down. I record the screen and step through it frame by frame. Most of the time the easing is wrong, or two things move that should move as one."],
	["Maya", "And when it finally feels right?"],
	["Theo", "Then I stop touching it. The best motion is the kind you only miss when it's gone."]
]), h = (e, t, n) => Math.min(n, Math.max(t, e)), g = (e) => {
	let t = Math.max(0, Math.floor(e));
	return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}, _ = (e) => {
	let t = [];
	for (let n of e) {
		let e = n.text.split(f).filter(Boolean), r = e.reduce((e, t) => e + t.length + 1, 0), i = n.start;
		for (let a of e) t.push({
			text: a,
			start: i
		}), i += (a.length + 1) / r * (n.end - n.start);
	}
	return t;
}, v = class extends e {
	static styles = l;
	static props = {
		heading: { default: "Frame Rate · Episode 48" },
		segments: {
			type: Object,
			default: m
		},
		duration: {
			type: Number,
			default: 0
		}
	};
	#e = [];
	#t = 0;
	#n = -1;
	#r = 0;
	#i = !1;
	#a = 0;
	#o = 0;
	#s = !0;
	#c = null;
	render() {
		return `<div class="head"><div class="titles"><p class="kicker">Transcript</p><p class="heading"></p></div><button class="speed" type="button"></button></div>
<div class="body"><section class="scroll" aria-label="Transcript" tabindex="0"><div class="content"><div class="mark" aria-hidden="true"></div><div class="segments"></div></div></section>
<button class="back-to-now" type="button" tabindex="-1"><span class="arrow"></span>Back to now</button></div>
<div class="bar"><button class="play" type="button" aria-label="Play">${r(o, 16)}</button><span class="now"></span>
<div class="seek" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0"><span class="fill"></span></div><span class="total"></span></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".scroll");
		for (let n of ["wheel", "touchmove"]) t.addEventListener(n, () => this.#s = !1, {
			...e,
			passive: !0
		});
		t.addEventListener("scroll", () => this.#g(), e), this.query(".segments").addEventListener("click", (e) => this.#y(e), e), this.query(".back-to-now").addEventListener("click", () => this.#_(), e), this.query(".play").addEventListener("click", () => this.#S(), e), this.query(".speed").addEventListener("click", () => {
			this.#r = (this.#r + 1) % u.length, this.#d();
		}, e);
		let n = this.query(".seek");
		n.addEventListener("pointerdown", (e) => {
			n.setPointerCapture(e.pointerId), this.#b(e);
		}, e), n.addEventListener("pointermove", (e) => n.hasPointerCapture(e.pointerId) && this.#b(e), e), n.addEventListener("keydown", (e) => this.#x(e), e), this.signal.addEventListener("abort", () => this.#w());
	}
	updated(e) {
		this.query(".heading").textContent = this.heading ?? "", e.has("segments") && this.#u(), this.query(".total").textContent = g(this.#l), this.query(".seek").ariaValueMax = String(Math.round(this.#l)), this.#d(), this.#f();
	}
	get #l() {
		return this.duration || Math.ceil((this.segments.at(-1)?.end ?? 0) + .6);
	}
	#u() {
		this.#e = _(this.segments);
		let e = 0;
		this.query(".segments").innerHTML = this.segments.map((t) => {
			let r = t.text.split(f).filter(Boolean).map((t) => `<span data-index="${e++}">${n(t)} </span>`);
			return `<div class="segment"><div class="who"><span class="initial" aria-hidden="true">${n(t.speaker.charAt(0))}</span><span class="speaker">${n(t.speaker)}</span><button class="stamp" type="button" data-time="${t.start}" aria-label="Play from ${g(t.start)}">${g(t.start)}</button></div><p class="text" data-time="${t.start}">${r.join("")}</p></div>`;
		}).join(""), this.#n = -1, this.#c = null;
	}
	#d() {
		let e = u[this.#r], t = this.query(".speed");
		t.textContent = `${e}×`, t.ariaLabel = `Playback speed ${e}x`;
	}
	#f() {
		let e = this.#l;
		this.query(".now").textContent = g(this.#t), this.query(".fill").style.scale = `${this.#t / e} 1`;
		let t = this.query(".seek");
		t.ariaValueNow = String(Math.round(this.#t)), t.ariaValueText = `${g(this.#t)} of ${g(e)}`;
		let n = this.#e.findIndex((e) => e.start > this.#t);
		if (n = (n === -1 ? this.#e.length : n) - 1, n === this.#n) return;
		let r = this.shadowRoot.querySelectorAll(".text span");
		for (let e = Math.max(0, Math.min(n, this.#n) + 1); e <= Math.max(n, this.#n); e++) r[e]?.toggleAttribute("data-spoken", e <= n);
		this.#n = n, this.#p(), this.#g();
	}
	#p() {
		let e = this.query(".mark"), t = this.#m;
		if (!t) {
			e.style.opacity = "0", this.#c = null;
			return;
		}
		let n = this.#c === t.offsetTop;
		e.style.transition = n && !i.matches ? `translate ${p}, width ${p}, opacity 150ms ease-out` : "opacity 150ms ease-out";
		let r = Number.parseFloat(getComputedStyle(t).fontSize) * .28;
		e.style.translate = `${t.offsetLeft - 3}px ${t.offsetTop}px`, e.style.width = `${t.offsetWidth - r + 6}px`, e.style.height = `${t.offsetHeight}px`, e.style.opacity = "1", !n && this.#s && this.#h(t, this.#c !== null), this.#c = t.offsetTop;
	}
	get #m() {
		return this.#n < 0 ? null : this.query(`.text [data-index="${this.#n}"]`);
	}
	#h(e, t) {
		let n = this.query(".scroll"), r = n.scrollTop + e.getBoundingClientRect().top - n.getBoundingClientRect().top - n.clientHeight / 3;
		n.scrollTo({
			top: r,
			behavior: t && !i.matches ? "smooth" : "auto"
		});
	}
	#g() {
		let e = this.#m, t = null;
		if (e && !this.#s) {
			let n = e.getBoundingClientRect(), r = this.query(".scroll").getBoundingClientRect();
			t = n.bottom < r.top ? "up" : n.top > r.bottom ? "down" : null;
		}
		let n = this.query(".back-to-now");
		t && (n.querySelector(".arrow").innerHTML = r(t === "up" ? a : s, 14)), n.toggleAttribute("data-shown", !!t), n.tabIndex = t ? 0 : -1;
	}
	#_() {
		this.#s = !0, this.#g();
		let e = this.#m;
		e && this.#h(e, !0);
	}
	#v(e) {
		this.#t = h(e, 0, this.#l), this.#s = !0, this.#f(), this.emit("time", { time: this.#t });
	}
	#y(e) {
		let t = e.target.closest("[data-index]"), n = e.target.closest("[data-time]");
		t ? this.#v(this.#e[Number(t.dataset.index)].start) : n && this.#v(Number(n.dataset.time));
	}
	#b(e) {
		let t = e.currentTarget.getBoundingClientRect();
		this.#v((e.clientX - t.left) / t.width * this.#l);
	}
	#x(e) {
		if (e.key === " ") {
			e.preventDefault(), this.#S();
			return;
		}
		let t = {
			ArrowLeft: -5,
			ArrowDown: -5,
			ArrowRight: d,
			ArrowUp: d,
			Home: -Infinity,
			End: Infinity
		}[e.key];
		t !== void 0 && (e.preventDefault(), this.#v(this.#t + t));
	}
	#S() {
		if (this.#i) return this.#w();
		this.#t >= this.#l && this.#v(0), this.#i = !0, this.#o = performance.now(), this.#a = requestAnimationFrame((e) => this.#C(e)), this.#T();
	}
	#C(e) {
		let t = Math.min(this.#l, this.#t + (e - this.#o) / 1e3 * u[this.#r]);
		this.#o = e, this.#t = t, this.#f(), this.emit("time", { time: t }), t >= this.#l ? this.#w() : this.#a = requestAnimationFrame((e) => this.#C(e));
	}
	#w() {
		this.#i && (this.#i = !1, cancelAnimationFrame(this.#a), this.#T());
	}
	#T() {
		let e = this.query(".play");
		e.ariaLabel = this.#i ? "Pause" : "Play", e.innerHTML = r(this.#i ? c : o, 16);
	}
};
//#endregion
//#region src/components/synced-transcript/index.js
t("synced-transcript", v);
//#endregion
export { v as t };
