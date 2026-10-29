import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { it as a } from "./lucide-BVbUPHVq.js";
//#region src/components/continue-learning-card/continue-learning-card.scss?inline
var o = ":host{box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:22rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);border-radius:1.5rem;padding:.75rem;display:block}p{margin:0}.thumb{aspect-ratio:16/9;cursor:pointer;background:#18181b;border:0;border-radius:1rem;outline:none;width:100%;padding:0;display:block;position:relative;overflow:hidden}.thumb:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.thumb canvas{width:100%;height:100%;display:block}.play{color:#18181b;background:#ffffffe6;border-radius:50%;place-items:center;width:2.75rem;height:2.75rem;transition:opacity .2s ease-out;display:grid;position:absolute;top:50%;left:50%;translate:-50% -50%}.play svg{fill:currentColor;translate:1px}[data-scrubbing] .play{opacity:0}.at{bottom:.875rem;left:clamp(1.5rem, var(--_at) * 100%, 100% - 1.5rem);border-radius:var(--lw-radius-sm);font:500 11px var(--lw-font-sans);font-variant-numeric:tabular-nums;color:#fff;opacity:0;background:#000000b3;padding:.125rem .375rem;transition:opacity .15s ease-out;position:absolute;translate:-50%}[data-scrubbing] .at{opacity:1}.playhead{inset-block:0 .25rem;left:calc(var(--_at) * 100%);opacity:0;background:#fffc;width:2px;transition:opacity .15s ease-out;position:absolute}[data-scrubbing] .playhead{opacity:1}.bar{inset-inline:0;background:#ffffff40;height:.25rem;position:absolute;bottom:0}.bar span{inset-block:0;position:absolute;left:0}.watched{width:calc(var(--_watched) * 100%);background:#ef4444}.preview{width:calc(var(--_at) * 100%);opacity:0;background:#ffffff73}[data-scrubbing] .preview{opacity:1}.info{padding:.75rem .25rem 0}.course{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}.title{font-size:var(--lw-text-md);margin-top:.125rem;font-weight:600}.left{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);margin-top:.125rem}.up-next{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);margin:1rem .25rem .375rem;font-weight:500}.up-next[hidden]{display:none}.next{margin:0;padding:0;list-style:none}.next button{border-radius:var(--lw-radius-md);width:100%;font:var(--lw-text-sm) var(--lw-font-sans);text-align:left;color:inherit;cursor:pointer;transition:background-color var(--lw-duration-fast) ease-out;background:0 0;border:0;outline:none;align-items:center;gap:.625rem;padding:.5rem .25rem;display:flex}.next button:hover{background:var(--lw-color-muted)}.next button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.swatch{aspect-ratio:16/9;background:linear-gradient(135deg, hsl(var(--_hue), 45%, 30%), hsl(calc(var(--_hue) + 40), 50%, 16%));border-radius:4px;flex:none;width:2.5rem}.next-title{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.duration{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground)}", s = [
	{
		id: "l4",
		title: "Springs, not curves",
		duration: 1140,
		watched: 380,
		hue: 250
	},
	{
		id: "l5",
		title: "Interrupting animations",
		duration: 960,
		hue: 25
	},
	{
		id: "l6",
		title: "Gestures and momentum",
		duration: 1320,
		hue: 160
	},
	{
		id: "l7",
		title: "Motion and accessibility",
		duration: 780,
		hue: 320
	}
], c = 12, l = 320, u = 180, d = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, f = (e) => `${Math.max(1, Math.round(e / 60))} min`, p = (e, t, n) => {
	let r = n / 11, i = e.createLinearGradient(0, 0, l, u);
	i.addColorStop(0, `hsl(${t.hue} 45% 22%)`), i.addColorStop(1, `hsl(${(t.hue + 40) % 360} 50% 14%)`), e.fillStyle = i, e.fillRect(0, 0, l, u), e.fillStyle = "rgb(255 255 255 / 0.85)", e.fillRect(24, 24, 120, 10), e.fillStyle = "rgb(255 255 255 / 0.3)", e.fillRect(24, 42, 80, 6), e.strokeStyle = "rgb(255 255 255 / 0.25)", e.setLineDash([4, 6]), e.beginPath(), e.moveTo(40, 150), e.quadraticCurveTo(l / 2, 30, 280, 150), e.stroke(), e.setLineDash([]);
	let a = (1 - r) ** 2 * 40 + 2 * (1 - r) * r * (l / 2) + r ** 2 * 280, o = (1 - r) ** 2 * 150 + 2 * (1 - r) * r * 30 + r ** 2 * 150;
	e.fillStyle = `hsl(${t.hue} 90% 70%)`, e.beginPath(), e.arc(a, o, 14, 0, Math.PI * 2), e.fill();
}, m = class extends e {
	static styles = o;
	static props = {
		course: { default: "Motion for interfaces" },
		lessons: {
			type: Object,
			default: s
		},
		lesson: { default: "" }
	};
	#e = [];
	#t = null;
	#n = null;
	render() {
		return `<button class="thumb" type="button"><canvas width="${l}" height="${u}"></canvas><span class="play" aria-hidden="true">${r(a, 18)}</span><span class="at" aria-hidden="true"></span><span class="playhead" aria-hidden="true"></span><span class="bar" aria-hidden="true"><span class="watched"></span><span class="preview"></span></span></button>
<div class="info"><p class="course"></p><p class="title"></p><p class="left"></p></div>
<p class="up-next">Up next</p><ol class="next"></ol>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".thumb");
		t.addEventListener("pointermove", (e) => this.#a(e), e), t.addEventListener("pointerleave", () => this.#a(null), e), t.addEventListener("click", () => this.#s(), e), t.addEventListener("keydown", (e) => this.#o(e), e), this.query(".next").addEventListener("click", (e) => {
			let t = e.target.closest("button");
			t && this.#c(t.dataset.id);
		}, e);
	}
	updated() {
		let e = this.#r;
		if (!e) return;
		this.#t !== e.id && (this.#e = Array.from({ length: c }, (t, n) => {
			let r = new OffscreenCanvas(l, u);
			return p(r.getContext("2d"), e, n), r;
		}), this.#t = e.id);
		let t = this.lessons.indexOf(e);
		this.query(".course").textContent = this.course ?? "", this.query(".title").textContent = `Lesson ${t + 1} · ${e.title}`, this.#i();
		let r = this.lessons.slice(t + 1, t + 4);
		this.query(".up-next").hidden = !r.length, this.query(".next").innerHTML = r.map((e) => `<li><button type="button" data-id="${n(e.id)}"><span class="swatch" style="--_hue: ${e.hue ?? 220}"></span><span class="next-title">${n(e.title)}</span><span class="duration">${f(e.duration)}</span></button></li>`).join("");
	}
	get #r() {
		return this.lessons.find(({ id: e }) => e === this.lesson) ?? this.lessons[0];
	}
	#i() {
		let e = this.#r, t = e.watched ?? 0, n = this.#n ?? t, r = Math.min(11, Math.floor(n / e.duration * c));
		this.query("canvas").getContext("2d").drawImage(this.#e[r], 0, 0);
		let i = this.query(".thumb");
		i.style.setProperty("--_watched", String(t / e.duration)), i.style.setProperty("--_at", String(n / e.duration)), i.toggleAttribute("data-scrubbing", this.#n !== null), this.query(".at").textContent = d(n), i.ariaLabel = `Resume ${e.title} from ${d(n)}`, this.query(".left").textContent = t ? `${f(e.duration - t)} left` : f(e.duration);
	}
	#a(e) {
		if (!e) this.#n = null;
		else {
			let t = this.query(".thumb").getBoundingClientRect();
			this.#n = Math.min(1, Math.max(0, (e.clientX - t.left) / t.width)) * this.#r.duration;
		}
		this.#i();
	}
	#o(e) {
		let t = {
			ArrowRight: 10,
			ArrowLeft: -10
		}[e.key];
		if (!t) return;
		e.preventDefault();
		let n = this.#r;
		this.#n = Math.min(n.duration, Math.max(0, (this.#n ?? n.watched ?? 0) + t)), this.#i();
	}
	#s() {
		let e = this.#r, t = this.#n ?? e.watched ?? 0;
		this.lessons = this.lessons.map((n) => n === e ? {
			...n,
			watched: t
		} : n), this.#n = null, i.matches || this.query(".play").animate([
			{ scale: 1 },
			{ scale: 1.25 },
			{ scale: 1 }
		], {
			duration: 300,
			easing: "ease-out"
		}), this.emit("resume", {
			lesson: e.id,
			time: t
		});
	}
	#c(e) {
		this.lesson = e, i.matches || this.query(".thumb").animate([{ opacity: .4 }, { opacity: 1 }], {
			duration: 240,
			easing: "ease-out"
		}), this.emit("change", { lesson: e });
	}
};
//#endregion
//#region src/components/continue-learning-card/index.js
t("continue-learning-card", m);
//#endregion
export { m as t };
