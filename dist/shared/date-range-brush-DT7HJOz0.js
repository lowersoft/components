import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./rolling-VjfpUD4B.js";
import { a as i, f as a, p as o, t as s } from "./dates-Cwd3k25x.js";
//#region src/components/date-range-brush/date-range-brush.scss?inline
var c = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:40rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));font-size:var(--lw-text-sm);border:0;border-radius:1.5rem;padding:.5rem;display:block}p{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.head{justify-content:space-between;align-items:center;padding:.25rem .5rem .75rem;display:flex}.title{color:var(--_muted)}.title b{color:var(--lw-color-foreground);font-weight:500}.quick{gap:.25rem;display:flex}.quick-range{border-radius:var(--lw-radius-md);color:var(--_muted);cursor:pointer;background:0 0;border:0;padding:.25rem .5rem}.quick-range:hover,.quick-range[aria-pressed=true]{color:var(--lw-color-foreground)}.quick-range[aria-pressed=true]{background:color-mix(in oklab, var(--lw-color-foreground) 8%, transparent)}.card{border:1px solid var(--_line);background:var(--lw-color-background);border-radius:1.25rem;padding:1.25rem}.top{justify-content:space-between;align-items:baseline;gap:1rem;display:flex}.range{font-size:var(--lw-text-lg);font-weight:600}.total{font-size:var(--lw-text-md);color:var(--_muted)}.total b{color:var(--lw-color-foreground);vertical-align:bottom;font-weight:600;display:inline-flex}.rate{color:var(--_muted);margin-top:.375rem}.chart{cursor:crosshair;touch-action:none;-webkit-user-select:none;user-select:none;height:7rem;margin-top:1.25rem;position:relative}.bars{border-bottom:1px solid var(--_line);align-items:flex-end;gap:1px;height:100%;display:flex}.bar{background:color-mix(in oklab, var(--lw-color-foreground) 18%, transparent);border-radius:1px 1px 0 0;flex:1;min-width:1px}@media (prefers-reduced-motion:no-preference){.bar{transition:background-color .15s ease-out}}.bar[data-in]{background:var(--lw-color-foreground)}.brush{border:1px solid color-mix(in oklab, var(--lw-color-foreground) 25%, transparent);border-radius:var(--lw-radius-md) var(--lw-radius-md) 0 0;background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent);cursor:grab;position:absolute;top:-.5rem;bottom:0}:host([data-dragging]) .brush{cursor:grabbing}.edge{border-radius:var(--lw-radius-full);background:var(--lw-color-foreground);cursor:ew-resize;outline:none;place-items:center;width:.75rem;height:2.25rem;display:grid;position:absolute;top:50%;translate:-50% -50%}.edge:before{content:\"\";background:var(--lw-color-background);width:1px;height:.875rem}.edge[data-edge=from]{left:0}.edge[data-edge=to]{left:100%}.edge:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.axis{height:1.25rem;font-size:var(--lw-text-xs);color:var(--_muted);margin-top:.375rem;position:relative}.axis span{border-left:1px solid var(--_line);padding-left:.375rem;line-height:1;position:absolute}.foot{border-top:1px solid var(--_line);flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.75rem;margin-top:1rem;padding-top:1rem;display:flex}.help{color:var(--_muted)}.show::part(button){border-radius:var(--lw-radius-full)}.busiest{color:var(--_muted);padding:.75rem .75rem .25rem}.busiest b{color:var(--lw-color-foreground);font-weight:500}", l = 120, u = [
	7,
	30,
	90
], d = 2, f = {
	month: "short",
	day: "numeric"
}, p = new Intl.NumberFormat("en-US"), m = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }), h = (e) => {
	let t = 11, n = () => (t = t * 1103515245 + 12345 >>> 0) / 4294967296, r = o(a());
	return Array.from({ length: e }, (t, i) => {
		let a = ((r - (e - 1 - i)) % 7 + 7) % 7 % 6 == 0, o = 1 + i / e * 4 + n() * 4, s = n() > .96 ? 6 : 0;
		return Math.round(a ? o * .3 : o + s);
	});
}, g = (e, t, n) => Math.min(n, Math.max(t, e)), _ = class extends e {
	static styles = [n, c];
	static props = {
		label: { default: "Builds" },
		scope: { default: "main" },
		noun: { default: "builds" },
		counts: { type: Object },
		days: {
			type: Number,
			default: 77
		}
	};
	#e = 0;
	#t = 0;
	#n = null;
	#r = null;
	render() {
		return `<header class="head"><p class="title"><b class="label"></b> · <span class="scope"></span></p><div class="quick">${u.map((e) => `<button class="quick-range" type="button" data-days="${e}">${e}D</button>`).join("")}</div></header>
<div class="card"><div class="top"><p class="range" aria-live="polite"></p><p class="total"><b class="rolling total-count" aria-hidden="true"></b><span class="visually-hidden total-text"></span> <span class="noun"></span></p></div><p class="rate"></p>
<div class="chart"><div class="bars" aria-hidden="true"></div><div class="brush"><span class="edge" data-edge="from" role="slider" tabindex="0" aria-label="First day"></span><span class="edge" data-edge="to" role="slider" tabindex="0" aria-label="Last day"></span></div></div><div class="axis" aria-hidden="true"></div>
<footer class="foot"><p class="help">Drag the edges, or draw a new range</p><lw-button class="show"></lw-button></footer></div><p class="busiest"></p>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".quick").addEventListener("click", (e) => {
			let t = e.target.closest(".quick-range");
			t && this.#s(this.#i.length - Number(t.dataset.days), this.#i.length - 1);
		}, e), this.#u(e), this.query(".brush").addEventListener("keydown", (e) => {
			let t = e.target.closest(".edge")?.dataset.edge, n = {
				ArrowLeft: -1,
				ArrowDown: -1,
				ArrowRight: 1,
				ArrowUp: 1
			}[e.key];
			if (!t || !n) return;
			e.preventDefault();
			let r = n * (e.shiftKey ? 7 : 1);
			t === "from" ? this.#s(this.#e + r, this.#t) : this.#s(this.#e, this.#t + r);
		}, e), this.query(".show").addEventListener("click", () => {
			let { start: e, end: t, total: n } = this.#c;
			this.emit("change", {
				start: e,
				end: t,
				total: n
			});
		}, e);
	}
	updated(e) {
		this.query(".label").textContent = this.label ?? "", this.query(".scope").textContent = this.scope ?? "", this.query(".noun").textContent = this.noun ?? "", e.has("counts") || e.has("days") ? (this.#o(), this.#s(this.#i.length - this.days, this.#i.length - 1)) : this.#l();
	}
	get #i() {
		return this.counts?.length ? this.counts : this.#r ??= h(l);
	}
	#a(e) {
		return s(a(), e - (this.#i.length - 1));
	}
	#o() {
		let e = this.#i, t = Math.max(...e, 1);
		this.query(".bars").innerHTML = e.map((e) => `<span class="bar" style="height: ${Math.max(2, e / t * 100)}%"></span>`).join("");
		let n = "";
		e.forEach((t, r) => {
			let a = this.#a(r);
			a.endsWith("-01") && (n += `<span style="left: ${r / e.length * 100}%">${i(a, "en-US", { month: "short" })}</span>`);
		}), this.query(".axis").innerHTML = n;
	}
	#s(e, t) {
		let n = this.#i.length - 1;
		[e, t] = e > t ? [t, e] : [e, t], this.#e = g(e, 0, n - d + 1), this.#t = g(Math.max(t, this.#e + d - 1), 0, n), this.#l();
	}
	get #c() {
		let e = this.#i.slice(this.#e, this.#t + 1), t = e.reduce((e, t) => e + t, 0), n = e.indexOf(Math.max(...e));
		return {
			start: this.#a(this.#e),
			end: this.#a(this.#t),
			days: e.length,
			total: t,
			busiest: this.#e + n,
			most: e[n]
		};
	}
	#l() {
		let e = this.#i, { start: t, end: n, days: a, total: o, busiest: s, most: c } = this.#c, l = (t) => `${t / e.length * 100}%`, u = this.query(".brush");
		u.style.left = l(this.#e), u.style.width = `calc(${l(this.#t + 1)} - ${l(this.#e)})`, this.query(".bars").querySelectorAll(".bar").forEach((e, t) => e.toggleAttribute("data-in", t >= this.#e && t <= this.#t)), this.query(".range").textContent = `${i(t, "en-US", f)} – ${i(n, "en-US", f)}`, r(this.query(".total-count"), p.format(o)), this.query(".total-text").textContent = p.format(o), this.query(".rate").textContent = `${a} days · ${m.format(o / a)} a day`, this.query(".busiest").innerHTML = `Busiest day <b>${i(this.#a(s), "en-US", {
			weekday: "short",
			month: "short",
			day: "numeric"
		})}</b> · ${p.format(c)} ${this.noun}`, this.query(".show").textContent = `Show ${p.format(o)} ${this.noun}`;
		for (let t of this.shadowRoot.querySelectorAll(".edge")) {
			let n = t.dataset.edge === "from" ? this.#e : this.#t;
			t.setAttribute("aria-valuemin", "0"), t.setAttribute("aria-valuemax", String(e.length - 1)), t.setAttribute("aria-valuenow", String(n)), t.setAttribute("aria-valuetext", i(this.#a(n), "en-US", {
				weekday: "long",
				month: "long",
				day: "numeric"
			}));
		}
		for (let t of this.shadowRoot.querySelectorAll(".quick-range")) t.ariaPressed = String(this.#t === e.length - 1 && a === Number(t.dataset.days));
	}
	#u(e) {
		let t = this.query(".chart"), n = (e) => {
			let n = t.getBoundingClientRect();
			return g(Math.floor((e.clientX - n.left) / n.width * this.#i.length), 0, this.#i.length - 1);
		};
		t.addEventListener("pointerdown", (e) => {
			if (e.button !== 0) return;
			e.preventDefault(), t.setPointerCapture(e.pointerId);
			let r = n(e), i = e.target.closest(".edge")?.dataset.edge;
			i ? this.#n = { mode: i } : e.target.closest(".brush") ? this.#n = {
				mode: "move",
				offset: r - this.#e,
				length: this.#t - this.#e
			} : (this.#n = {
				mode: "draw",
				anchor: r
			}, this.#s(r, r + d - 1)), this.toggleAttribute("data-dragging", !0);
		}, e), t.addEventListener("pointermove", (e) => {
			let t = this.#n;
			if (!t) return;
			let r = n(e);
			if (t.mode === "from") this.#s(Math.min(r, this.#t - d + 1), this.#t);
			else if (t.mode === "to") this.#s(this.#e, Math.max(r, this.#e + d - 1));
			else if (t.mode === "move") {
				let e = g(r - t.offset, 0, this.#i.length - 1 - t.length);
				this.#s(e, e + t.length);
			} else this.#s(t.anchor, r);
		}, e);
		for (let n of ["pointerup", "pointercancel"]) t.addEventListener(n, () => {
			this.#n = null, this.removeAttribute("data-dragging");
		}, e);
	}
};
//#endregion
//#region src/components/date-range-brush/index.js
t("date-range-brush", _);
//#endregion
export { _ as t };
