import { n as e, t } from "./core-WcEz9YgG.js";
import { r as n } from "./icons-Dv1KN71n.js";
import { it as r, tt as i } from "./lucide-BVbUPHVq.js";
//#region src/components/clip-trimmer/clip-trimmer.scss?inline
var a = ":host{--_trim:var(--lightningcss-light,#ea580c)var(--lightningcss-dark,#f97316);--_veil:color-mix(in oklab, var(--lw-color-background) 75%, transparent);--_ease:cubic-bezier(.23, 1, .32, 1);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:32rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);-webkit-user-select:none;user-select:none;border-radius:1.5rem;padding:1rem;display:block}p{margin:0}.preview{aspect-ratio:16/9;background:var(--lw-color-muted);border-radius:1rem;position:relative;overflow:hidden}.shot{object-fit:cover;pointer-events:none;width:100%;height:100%;position:absolute;inset:0}.clock,.play{color:#fff;background:#0000008c;border-radius:999px;position:absolute;bottom:.75rem}.clock{font-variant-numeric:tabular-nums;padding:.25rem .625rem;font-size:11px;font-weight:500;left:.75rem}.play{cursor:pointer;border:0;outline:none;place-items:center;width:2rem;height:2rem;padding:0;display:grid;right:.75rem}@media (prefers-reduced-motion:no-preference){.play{transition:background-color .15s ease-out}}.play:hover{background:#000000b3}.play:focus-visible{box-shadow:0 0 0 2px #fff}.play svg{fill:currentColor}.track{margin-top:1.25rem;padding:0 1rem}.strip{cursor:pointer;touch-action:none;height:3.5rem;position:relative}.frames,.cut{border-radius:var(--lw-radius-md);position:absolute;inset:0;overflow:hidden}.frames{background:var(--lw-color-muted);display:flex}.frames span{background:var(--_src) center/cover no-repeat;border-right:1px solid #0000001a;flex:1}.frames span:last-child{border-right:0}.frames span:first-child{background-position:0%}.frames span:nth-child(2){background-position:11.1111%}.frames span:nth-child(3){background-position:22.2222%}.frames span:nth-child(4){background-position:33.3333%}.frames span:nth-child(5){background-position:44.4444%}.frames span:nth-child(6){background-position:55.5556%}.frames span:nth-child(7){background-position:66.6667%}.frames span:nth-child(8){background-position:77.7778%}.frames span:nth-child(9){background-position:88.8889%}.frames span:nth-child(10){background-position:100%}.cut{pointer-events:none}.cut span{background:var(--_veil);position:absolute;inset:0}.before{translate:calc((var(--_start) - 1) * 100%) 0}.after{translate:calc(var(--_end) * 100%) 0}.playhead{pointer-events:none;translate:calc(var(--_time) * 100%) 0;position:absolute;inset:-.25rem 0}@media (prefers-reduced-motion:no-preference){.playhead{transition:opacity .15s ease-out}}.playhead:before,.playhead:after{content:\"\";background:var(--lw-color-foreground);position:absolute;left:0}.playhead:before{width:1px;top:0;bottom:0;translate:-50%}.playhead:after{border-radius:50%;width:7px;height:7px;top:-.125rem;translate:-50%}:host([data-active=start]) .playhead,:host([data-active=end]) .playhead{opacity:0}.range{inset:0 auto;left:calc(var(--_start) * 100%);width:calc((var(--_end) - var(--_start)) * 100%);box-sizing:border-box;border-block:3px solid var(--_trim);cursor:grab;position:absolute}:host([data-active=range]) .range{cursor:grabbing}.handle{background:var(--_trim);cursor:ew-resize;outline:none;place-items:center;width:1rem;display:grid;position:absolute;inset-block:-3px}.handle.start{border-radius:var(--lw-radius-md) 0 0 var(--lw-radius-md);left:-1rem}.handle.end{border-radius:0 var(--lw-radius-md) var(--lw-radius-md) 0;right:-1rem}.handle:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.grip{background:#fff9;border-radius:999px;width:3px;height:1.25rem}@media (prefers-reduced-motion:no-preference){.grip{transition:background-color .15s ease-out}}.tip{border-radius:var(--lw-radius-sm);background:var(--lw-color-foreground);font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--lw-color-background);opacity:0;pointer-events:none;padding:.125rem .375rem;font-size:11px;position:absolute;top:-2rem}@media (prefers-reduced-motion:no-preference){.tip{transition:opacity .15s ease-out}}:host([data-active=start]) .handle.start .grip{background:#fff}:host([data-active=start]) .handle.start .tip{opacity:1}:host([data-active=end]) .handle.end .grip{background:#fff}:host([data-active=end]) .handle.end .tip{opacity:1}.ruler{height:1.25rem;margin-top:.5rem;position:relative}.ruler span{top:0;left:calc(var(--_at) * 100%);justify-items:center;display:grid;position:absolute;translate:-50%}.ruler span:before{content:\"\";background:var(--lw-color-border);width:1px;height:.25rem}.ruler span[data-label]:before{height:.5rem}.ruler span[data-snapped]:before{background:var(--_trim)}@media (prefers-reduced-motion:no-preference){.ruler span:before,.ruler span i{transition:color .15s ease-out,background-color .15s ease-out}}.ruler i{font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);margin-top:.125rem;font-size:10px;font-style:normal}[data-snapped]>.ruler i{color:var(--_trim)}.foot{font-size:var(--lw-text-sm);justify-content:space-between;align-items:center;gap:.75rem;margin-top:.75rem;padding:0 .25rem;display:flex}.length{font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground)}.length b{color:var(--lw-color-foreground);font-weight:500}", o = 10, s = 5, c = 5, l = 3, u = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=2400&h=800&fit=crop&auto=format&q=80", d = (e, t, n) => Math.min(n, Math.max(t, e)), f = (e) => {
	let t = Math.round(e * 10), n = Math.floor(t / 10);
	return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}.${t % 10}`;
}, p = class extends e {
	static styles = a;
	static props = {
		src: { default: u },
		alt: { default: "A valley road at dusk" },
		duration: {
			type: Number,
			default: 12
		},
		start: {
			type: Number,
			default: 2.4
		},
		end: {
			type: Number,
			default: 9
		},
		minLength: {
			type: Number,
			default: 1
		}
	};
	#e = 2.4;
	#t = !1;
	#n = 0;
	#r = 0;
	#i = null;
	render() {
		return `<div class="preview"><img class="shot" alt="" draggable="false"><span class="clock"></span><button class="play" type="button" aria-label="Play">${n(r, 14)}</button></div>
<div class="track"><div class="strip">
<div class="frames">${"<span></span>".repeat(o)}</div>
<div class="cut" aria-hidden="true"><span class="before"></span><span class="after"></span></div>
<div class="playhead" aria-hidden="true"></div>
<div class="range" data-part="range">${["start", "end"].map((e) => `<div class="handle ${e}" data-part="${e}" role="slider" tabindex="0" aria-label="Trim ${e}" aria-valuemin="0"><span class="grip"></span><span class="tip"></span></div>`).join("")}</div>
</div><div class="ruler" aria-hidden="true"></div></div>
<div class="foot"><p class="length"><b></b> of <span class="total"></span></p><lw-button class="reset" variant="ghost" size="sm">Reset</lw-button></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".strip");
		t.addEventListener("pointerdown", (e) => this.#y(e), e), t.addEventListener("pointermove", (e) => this.#b(e), e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, (e) => this.#x(e), e);
		for (let t of this.shadowRoot.querySelectorAll(".handle")) t.addEventListener("keydown", (e) => this.#S(e, t.dataset.part), e);
		this.query(".play").addEventListener("click", () => this.#u(), e), this.query(".reset").addEventListener("click", () => this.#c(0, this.duration), e), this.signal.addEventListener("abort", () => this.#f());
	}
	updated(e) {
		e.has("src") && (this.query(".shot").src = this.src, this.style.setProperty("--_src", `url(${JSON.stringify(this.src)})`)), e.has("alt") && (this.query(".shot").alt = this.alt ?? ""), e.has("duration") && this.#a();
		let t = d(this.end, Math.min(this.minLength, this.duration), this.duration), n = d(this.start, 0, t - Math.min(this.minLength, t));
		n !== this.start || t !== this.end ? (this.start = n, this.end = t) : (this.#e = d(this.#e, this.start, this.end), this.#o());
	}
	#a() {
		let e = Array.from({ length: Math.floor(this.duration) + 1 }, (e, t) => t);
		this.query(".ruler").innerHTML = e.map((e) => `<span data-second="${e}"${e % c ? "" : " data-label"} style="--_at: ${e / this.duration}">${e % c ? "" : `<i>${e}s</i>`}</span>`).join("");
	}
	#o() {
		let { duration: e, start: t, end: n } = this;
		this.style.setProperty("--_start", String(t / e)), this.style.setProperty("--_end", String(n / e));
		for (let t of ["start", "end"]) {
			let n = this.query(`.handle.${t}`);
			n.ariaValueMax = String(e), n.ariaValueNow = String(Math.round(this[t] * 10) / 10), n.ariaValueText = `${this[t].toFixed(1)} seconds`, n.querySelector(".tip").textContent = f(this[t]);
		}
		this.query(".length b").textContent = `${(n - t).toFixed(1)}s`, this.query(".total").textContent = `${e.toFixed(1)}s`, this.query(".reset").disabled = t === 0 && n === e, this.#s();
	}
	#s() {
		let e = this.#e / this.duration;
		this.style.setProperty("--_time", String(e)), this.query(".shot").style.objectPosition = `${e * 100}% 50%`, this.query(".clock").textContent = f(this.#e);
	}
	#c(e, t) {
		(e !== this.start || t !== this.end) && (this.start = e, this.end = t, this.emit("change", {
			start: e,
			end: t
		}));
	}
	#l(e) {
		this.#e = d(e, this.start, this.end), this.#s();
	}
	#u() {
		if (this.#t) return this.#f();
		this.#e >= this.end - .05 && this.#l(this.start), this.#t = !0, this.#r = performance.now(), this.#n = requestAnimationFrame((e) => this.#d(e)), this.#p();
	}
	#d(e) {
		let t = this.#e + (e - this.#r) / 1e3;
		this.#r = e, (t >= this.end || t < this.start) && (t = this.start), this.#l(t), this.#n = requestAnimationFrame((e) => this.#d(e));
	}
	#f() {
		this.#t && (this.#t = !1, cancelAnimationFrame(this.#n), this.#p());
	}
	#p() {
		let e = this.query(".play");
		e.ariaLabel = this.#t ? "Pause" : "Play", e.innerHTML = n(this.#t ? i : r, 14);
	}
	get #m() {
		return this.query(".strip").getBoundingClientRect().width / this.duration;
	}
	#h(e) {
		let t = this.query(".strip").getBoundingClientRect();
		return d((e - t.left) / t.width * this.duration, 0, this.duration);
	}
	#g(e) {
		let t = Math.round(e), n = Math.abs(t - e) * this.#m < s;
		return this.#_(n ? t : null), n ? t : e;
	}
	#_(e) {
		for (let t of this.shadowRoot.querySelectorAll(".ruler span")) t.toggleAttribute("data-snapped", Number(t.dataset.second) === e);
	}
	#v(e, t) {
		let { start: n, end: r, minLength: i, duration: a } = this, o = e === "start" ? [d(t, 0, r - i), r] : [n, d(t, n + i, a)];
		this.#c(...o), this.#e = e === "start" ? o[0] : o[1], this.#s();
	}
	#y(e) {
		if (!e.isPrimary || e.button !== 0 || this.#i) return;
		let t = e.target.closest("[data-part]")?.dataset.part ?? "seek";
		e.currentTarget.setPointerCapture(e.pointerId), this.#i = {
			part: t,
			x: e.clientX,
			start: this.start,
			end: this.end,
			moved: !1
		}, this.dataset.active = t, t === "start" || t === "end" ? (this.#f(), e.target.closest(".handle").focus()) : t === "seek" && this.#l(this.#h(e.clientX));
	}
	#b(e) {
		let t = this.#i;
		if (!t) return;
		let n = e.clientX - t.x;
		if (Math.abs(n) > l && (t.moved = !0), t.part === "start" || t.part === "end") this.#v(t.part, this.#g(t[t.part] + n / this.#m));
		else if (t.part === "range" && t.moved) {
			let e = t.end - t.start, r = d(t.start + n / this.#m, 0, this.duration - e);
			this.#c(r, r + e), this.#e = d(this.#e, r, r + e), this.#s();
		} else t.part === "seek" && this.#l(this.#h(e.clientX));
	}
	#x(e) {
		let t = this.#i;
		t && (this.#i = null, t.part === "range" && !t.moved && this.#l(this.#h(e.clientX)), (t.part === "start" || t.part === "end") && this.#l(this.start), delete this.dataset.active, this.#_(null));
	}
	#S(e, t) {
		let n = e.shiftKey ? 1 : .1, r = {
			ArrowLeft: -n,
			ArrowDown: -n,
			ArrowRight: n,
			ArrowUp: n,
			Home: -this.duration,
			End: this.duration
		}[e.key];
		r !== void 0 && (e.preventDefault(), this.#v(t, Math.round((this[t] + r) * 10) / 10));
	}
};
//#endregion
//#region src/components/clip-trimmer/index.js
t("clip-trimmer", p);
//#endregion
export { p as t };
