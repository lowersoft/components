import { n as e, t } from "./core-WcEz9YgG.js";
import { r as n } from "./icons-Dv1KN71n.js";
import { n as r, t as i } from "./people-C_zYMoEl.js";
import { a, f as o, p as s, t as c } from "./dates-Cwd3k25x.js";
import { j as l, m as u, p as d } from "./lucide-BVbUPHVq.js";
//#region src/components/booking-picker/booking-picker.scss?inline
var f = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);--_hatch:repeating-linear-gradient(-45deg, color-mix(in oklab, var(--lw-color-foreground) 22%, transparent) 0 1px, transparent 1px 7px);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:40rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:0;display:block;overflow:hidden}h2,p{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.head{border-bottom:1px solid var(--_line);align-items:center;gap:1rem;padding:1.5rem;display:flex}.avatar{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));width:3rem;height:3rem;font-size:var(--lw-text-md);border-radius:50%;flex:none;place-items:center;font-weight:600;display:grid;position:relative}.online{border:2px solid var(--lw-color-background);background:var(--lw-color-accent);border-radius:50%;width:.75rem;height:.75rem;position:absolute;bottom:0;right:0}.title-block{flex:1;min-width:0}.title{font-size:var(--lw-text-lg);font-weight:500}.meta{font-size:var(--lw-text-md);color:var(--_muted);align-items:center;gap:.375rem;margin-top:.25rem;display:flex}.zone{border:1px solid var(--_line);border-radius:var(--lw-radius-md);font-size:var(--lw-text-md);cursor:pointer;background:0 0;align-items:center;gap:.5rem;padding:.5rem .75rem;display:inline-flex}.zone:hover{background:color-mix(in oklab, var(--lw-color-foreground) 5%, transparent)}.body{padding:1.25rem 1.5rem 1.5rem}.day-nav{align-items:center;gap:.5rem;display:flex}.nav{border-radius:var(--lw-radius-md);cursor:pointer;background:0 0;border:0;place-items:center;width:2rem;height:2rem;padding:0;display:grid}.nav:disabled{cursor:default;opacity:.3}.day{min-width:7.5rem;font-size:var(--lw-text-lg);text-align:center;font-weight:500}.today{border:1px solid var(--_line);border-radius:var(--lw-radius-sm);cursor:pointer;background:0 0;margin-left:.5rem;padding:.125rem .5rem}.today:disabled{cursor:default;opacity:.5}.dots{align-items:center;gap:.375rem;margin-left:auto;display:flex}.dot{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-foreground) 30%, transparent);width:.375rem;height:.375rem}@media (prefers-reduced-motion:no-preference){.dot{transition:width .25s ease-out}}.dot[data-current]{background:var(--lw-color-foreground);width:1rem}.dot[data-full]{opacity:.35}.open{font-size:var(--lw-text-md);color:var(--_muted);margin-left:.5rem}.hours{height:1.25rem;color:var(--_muted);margin:1.5rem 0 .5rem;position:relative}.hours span{white-space:nowrap;position:absolute;translate:-50%}.hours span:first-child{translate:0}.hours span:last-child{translate:-100%}.track{border:1px solid var(--_line);border-radius:var(--lw-radius-lg);background:color-mix(in oklab, var(--lw-color-foreground) 2%, transparent);cursor:pointer;touch-action:none;-webkit-user-select:none;user-select:none;height:4.5rem;position:relative}.block{background:var(--_hatch);color:var(--_muted);place-items:center;display:grid;position:absolute;top:0;bottom:0;overflow:hidden}.block span{border-radius:var(--lw-radius-sm);background:var(--lw-color-background);padding:.125rem .375rem}.block span:empty{display:none}.now{background:var(--lw-color-destructive);width:1px;position:absolute;top:-.25rem;bottom:0}.now:before{content:\"\";border:3.5px solid #0000;border-top-color:var(--lw-color-destructive);position:absolute;top:0;left:-3px}.now[hidden]{display:none}.handle{border:2px solid var(--lw-color-foreground);border-radius:var(--lw-radius-md);background:color-mix(in oklab, var(--lw-color-foreground) 12%, var(--lw-color-background));cursor:grab;outline:none;place-items:center;display:grid;position:absolute;top:.25rem;bottom:.25rem}@media (prefers-reduced-motion:no-preference){.handle{transition:left .2s cubic-bezier(.23,1,.32,1)}:host([data-dragging]) .handle{transition:none}}.handle:before{content:\"\";border-inline:1px solid var(--_muted);width:4px;height:1rem}.handle:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.handle[hidden]{display:none}:host([data-dragging]) .handle{cursor:grabbing}.slots{flex-wrap:wrap;gap:.5rem;margin-top:1rem;display:flex}.slot{border:1px solid var(--_line);border-radius:var(--lw-radius-md);font-size:var(--lw-text-md);font-variant-numeric:tabular-nums;cursor:pointer;background:0 0;align-items:baseline;gap:.25rem;padding:.5rem .875rem;display:inline-flex}.slot small{font-size:var(--lw-text-xs);color:var(--_muted)}.slot[aria-checked=true]{border-color:var(--lw-color-foreground);box-shadow:0 0 0 1px var(--lw-color-foreground)}.confirm{border-top:1px solid var(--_line);justify-content:space-between;align-items:center;gap:1rem;margin-top:1.25rem;padding-top:1.25rem;display:flex}.picked{color:var(--_muted)}", p = 480, m = 1080, h = 15, g = 5, _ = [
	{
		label: "GMT+2",
		shift: 0
	},
	{
		label: "GMT",
		shift: -120
	},
	{
		label: "GMT−5",
		shift: -420
	}
], v = "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" aria-hidden=\"true\"><path fill=\"#00832d\" d=\"M13.5 12 15.8 14.6l3.1 2V7.4l-3.1 2z\"/><path fill=\"#0066da\" d=\"M2 15.7v2.6c0 .6.5 1.2 1.2 1.2h2.6l.5-1.9-.5-1.9-1.8-.5z\"/><path fill=\"#e94235\" d=\"M5.8 4.5 2 8.3l1.9.5 1.9-.5.6-1.9z\"/><path fill=\"#2684fc\" d=\"M5.8 8.3H2v7.4h3.8z\"/><path fill=\"#00ac47\" d=\"M17.4 6.2 15.8 7.5v4.5l3.1-2.6V5.7c0-.5-.6-.8-1-.5zM13.5 12v3.9H5.8v3.8h10c.6 0 1.2-.5 1.2-1.2v-2.4z\"/><path fill=\"#ffba00\" d=\"M15.8 4.5H5.8v3.8h7.7v3.7l3.5-3V5.7c0-.7-.5-1.2-1.2-1.2\"/></svg>", y = (e) => {
	let t = [...e].reduce((e, t) => e * 31 + t.charCodeAt(0) >>> 0, 7), n = () => (t = t * 1103515245 + 12345 >>> 0) / 4294967296, r = [], i = 540 + Math.floor(n() * 4) * 30;
	for (; i < 1020;) {
		let e = (2 + Math.floor(n() * 4)) * 30;
		r.push([i, Math.min(m, i + e)]), i += e + (2 + Math.floor(n() * 4)) * 30;
	}
	return r;
}, b = (e) => {
	let t = Math.floor(e / 60) % 24;
	return {
		time: `${t % 12 || 12}:${String(e % 60).padStart(2, "0")}`,
		half: t < 12 ? "AM" : "PM"
	};
}, x = (e) => {
	let { time: t, half: n } = b(e);
	return `${t} ${n}`;
}, S = class extends e {
	static styles = f;
	static props = {
		hostName: { default: "Maya Lindqvist" },
		duration: {
			type: Number,
			default: 30
		},
		where: { default: "Google Meet" },
		busy: { type: Object }
	};
	#e = [];
	#t = 0;
	#n = null;
	#r = 0;
	#i = 0;
	render() {
		return `<header class="head"><span class="avatar"><span class="initials"></span><span class="online"></span></span><div class="title-block"><h2 class="title"></h2><p class="meta"><span class="duration"></span> · ${v}<span class="where"></span></p></div>
<button class="zone" type="button">${n(l, 16)}<span class="zone-label"></span></button></header>
<div class="body"><div class="day-nav"><button class="nav prev" type="button" aria-label="Previous day">${n(d, 18)}</button><p class="day" aria-live="polite"></p><button class="nav next" type="button" aria-label="Next day">${n(u, 18)}</button><button class="today" type="button">Today</button><span class="dots" aria-hidden="true"></span><span class="open"></span></div>
<div class="hours" aria-hidden="true"></div><div class="track"><div class="blocks"></div><span class="now" aria-hidden="true"></span><span class="handle" role="slider" tabindex="0" aria-label="Start time"></span></div>
<div class="slots" role="radiogroup" aria-label="Open times"></div><div class="confirm"><p class="picked"></p><lw-button class="book"></lw-button></div></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.#i = (/* @__PURE__ */ new Date()).getHours() * 60 + (/* @__PURE__ */ new Date()).getMinutes();
		let t = o();
		for (let e = t; this.#e.length < g; e = c(e, 1)) s(e) % 6 && this.#e.push(e);
		this.query(".prev").addEventListener("click", () => this.#l(this.#t - 1), e), this.query(".next").addEventListener("click", () => this.#l(this.#t + 1), e), this.query(".today").addEventListener("click", () => this.#l(0), e), this.query(".zone").addEventListener("click", () => {
			this.#r = (this.#r + 1) % _.length, this.#h();
		}, e), this.query(".slots").addEventListener("click", (e) => {
			let t = e.target.closest(".slot");
			t && this.#u(Number(t.dataset.start));
		}, e), this.#f(e), this.query(".book").addEventListener("click", () => this.#g(), e), this.#t = Math.max(0, this.#e.findIndex((e) => this.#c(e).length));
	}
	updated() {
		this.query(".title").textContent = `Intro call with ${this.hostName}`, this.query(".initials").textContent = r(this.hostName ?? ""), this.style.setProperty("--_hue", i(this.hostName ?? "")), this.query(".duration").textContent = `${this.duration} min`, this.query(".where").textContent = this.where ?? "", this.#e.length && this.#l(this.#t);
	}
	get #a() {
		return this.#e[this.#t];
	}
	#o(e) {
		let t = this.busy?.[e] ?? y(e);
		if (e !== this.#e[0] || this.#i <= p) return t;
		let n = Math.min(m, Math.ceil(this.#i / h) * h);
		return [[p, n], ...t.filter(([, e]) => e > n).map(([e, t]) => [Math.max(e, n), t])];
	}
	#s(e, t) {
		let n = t + this.duration;
		return t >= p && n <= m && this.#o(e).every(([e, r]) => n <= e || t >= r);
	}
	#c(e) {
		let t = [];
		for (let n = p; n + this.duration <= m; n += h) this.#s(e, n) && !this.#s(e, n - h) && t.push(n);
		return t;
	}
	#l(e) {
		this.#t = Math.min(this.#e.length - 1, Math.max(0, e)), this.#n = this.#c(this.#a)[0] ?? null, this.#h();
	}
	#u(e) {
		this.#s(this.#a, e) && (this.#n = e, this.#h());
	}
	#d(e, t = 0) {
		let n = Math.round(e / h) * h;
		for (let e = 0; e <= 600; e += h) for (let r of t ? [t] : [-1, 1]) {
			let t = n + r * e;
			if (this.#s(this.#a, t)) return t;
		}
		return this.#n;
	}
	#f(e) {
		let t = this.query(".track"), n = this.query(".handle"), r = (e) => {
			let n = t.getBoundingClientRect();
			return p + (e.clientX - n.left) / n.width * 600 - this.duration / 2;
		};
		t.addEventListener("pointerdown", (e) => {
			e.button === 0 && (e.preventDefault(), n.focus(), t.setPointerCapture(e.pointerId), this.toggleAttribute("data-dragging", !0), this.#n = this.#d(r(e)), this.#h());
		}, e), t.addEventListener("pointermove", (e) => {
			if (!this.hasAttribute("data-dragging")) return;
			let t = this.#d(r(e));
			t !== this.#n && (this.#n = t, this.#h());
		}, e);
		for (let n of ["pointerup", "pointercancel"]) t.addEventListener(n, () => this.removeAttribute("data-dragging"), e);
		n.addEventListener("keydown", (e) => {
			let t = {
				ArrowRight: 1,
				ArrowUp: 1,
				ArrowLeft: -1,
				ArrowDown: -1
			}[e.key];
			if (e.key === "Home" || e.key === "End") {
				e.preventDefault();
				let t = this.#c(this.#a);
				this.#n = e.key === "Home" ? t[0] : this.#d(m - this.duration, -1), this.#h();
			} else t && this.#n != null && (e.preventDefault(), this.#n = this.#d(this.#n + t * h, t), this.#h());
		}, e);
	}
	#p(e) {
		return ((e + _[this.#r].shift) % 1440 + 1440) % 1440;
	}
	#m(e) {
		return `${(e - p) / 600 * 100}%`;
	}
	#h() {
		let e = this.#a, t = _[this.#r];
		this.query(".zone-label").textContent = t.label, this.query(".zone").ariaLabel = `Time zone ${t.label}; change`, this.query(".day").textContent = a(e, "en-US", {
			weekday: "short",
			month: "short",
			day: "numeric"
		}), this.query(".prev").disabled = this.#t === 0, this.query(".next").disabled = this.#t === this.#e.length - 1, this.query(".today").disabled = this.#t === 0, this.query(".dots").innerHTML = this.#e.map((e, t) => `<span class="dot"${t === this.#t ? " data-current" : ""}${this.#c(e).length ? "" : " data-full"}></span>`).join("");
		let n = this.#c(e);
		this.query(".open").textContent = `${n.length} open`;
		let r = "";
		for (let e = p; e <= m; e += 60) {
			let t = this.#p(e), { time: n, half: i } = b(t), a = e === p || t % 720 == 0;
			r += `<span style="left: ${this.#m(e)}">${n.replace(":00", "")}${a ? ` ${i}` : ""}</span>`;
		}
		this.query(".hours").innerHTML = r;
		let i = e === this.#e[0] && this.#i > p;
		this.query(".blocks").innerHTML = this.#o(e).map(([e, t], n) => `<span class="block" style="left: ${this.#m(e)}; width: calc(${this.#m(t)} - ${this.#m(e)})"><span>${i && n === 0 ? "Past" : t - e >= 60 ? "Busy" : ""}</span></span>`).join("");
		let o = this.query(".now");
		o.hidden = !(e === this.#e[0] && this.#i > p && this.#i < m), o.style.left = this.#m(this.#i);
		let s = this.query(".handle");
		s.hidden = this.#n == null, this.query(".slots").innerHTML = n.map((e) => {
			let { time: t, half: n } = b(this.#p(e));
			return `<button class="slot" type="button" role="radio" aria-checked="${e === this.#n}" data-start="${e}">${t}<small>${n}</small></button>`;
		}).join("");
		let c = this.query(".book");
		if (this.#n == null) {
			this.query(".picked").textContent = "No time left this day", c.disabled = !0, c.textContent = "Book";
			return;
		}
		s.style.left = this.#m(this.#n), s.style.width = `calc(${this.#m(this.#n + this.duration)} - ${this.#m(this.#n)})`;
		let l = `${x(this.#p(this.#n))} – ${x(this.#p(this.#n + this.duration))}`;
		s.setAttribute("aria-valuetext", l), this.query(".picked").textContent = l, c.disabled = !1, c.textContent = `Book ${x(this.#p(this.#n))}`;
	}
	#g() {
		if (this.#n == null) return;
		let e = _[this.#r].label;
		this.emit("book", {
			date: this.#a,
			start: this.#n,
			end: this.#n + this.duration,
			zone: e
		}), this.query(".picked").textContent = "Booked. The invite is on its way.", this.query(".book").disabled = !0;
	}
};
//#endregion
//#region src/components/booking-picker/index.js
t("booking-picker", S);
//#endregion
export { S as t };
