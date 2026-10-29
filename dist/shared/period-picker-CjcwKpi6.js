import { n as e, t } from "./core-WcEz9YgG.js";
import { r as n } from "./icons-Dv1KN71n.js";
import { a as r, c as i, d as a, f as o, i as s, l as c, n as l, o as u, p as d, r as f, s as p, t as m } from "./dates-Cwd3k25x.js";
import { i as h, m as g, p as _ } from "./lucide-BVbUPHVq.js";
//#region src/components/period-picker/period-picker.scss?inline
var v = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);--_accent:#f97316;--_band:color-mix(in oklab, var(--lw-color-foreground) 10%, transparent);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:24rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));font-size:var(--lw-text-sm);border:0;border-radius:1.5rem;padding:.5rem;display:block}p{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.head{color:var(--_muted);justify-content:space-between;padding:.375rem .5rem .75rem;display:flex}.clear{color:var(--_muted);cursor:pointer;background:0 0;border:0;padding:0}.clear:hover:not(:disabled){color:var(--lw-color-foreground)}.clear:disabled{cursor:default;opacity:.5}.card{border:1px solid var(--_line);background:var(--lw-color-background);border-radius:1.25rem;overflow:hidden}.top{border-bottom:1px solid var(--_line);padding:1rem 1rem .75rem}.summary{font-size:var(--lw-text-md);font-weight:600}.summary .count{color:var(--_muted);margin-left:.375rem;font-weight:400}.presets{flex-wrap:wrap;gap:.125rem;margin:.625rem -.5rem 0;display:flex}.preset{border-radius:var(--lw-radius-md);color:var(--_muted);cursor:pointer;background:0 0;border:0;padding:.25rem .5rem}.preset:hover{color:var(--lw-color-foreground)}.preset[aria-pressed=true]{background:var(--_band);color:var(--lw-color-foreground)}.month-head{align-items:center;gap:.25rem;padding:.875rem .75rem .25rem 1rem;display:flex}.month{flex:1;font-weight:600}.nav{border-radius:var(--lw-radius-md);width:1.75rem;height:1.75rem;color:var(--_muted);cursor:pointer;background:0 0;border:0;place-items:center;padding:0;display:grid}.nav:disabled{cursor:default;opacity:.3}.grid{padding:0 .75rem .75rem}.weekdays,.week{grid-template-columns:repeat(7,1fr);display:grid}.weekdays span{font-size:var(--lw-text-xs);text-align:center;color:var(--_muted);padding:.5rem 0}.week+.week{margin-top:2px}.day{height:2.5rem;font-size:var(--lw-text-md);font-variant-numeric:tabular-nums;cursor:pointer;background:0 0;border:0;place-items:center;padding:0;line-height:1;display:grid;position:relative}.day[data-outside]{color:color-mix(in oklab, var(--_muted) 60%, transparent)}.day:disabled{color:color-mix(in oklab, var(--_muted) 45%, transparent);cursor:default}.day:hover:not(:disabled,[data-edge]){border-radius:var(--lw-radius-md);background:var(--_band)}.day[data-in]{background:var(--_band)}.day[data-edge]{background:var(--lw-color-foreground);color:var(--lw-color-background)}.day[data-edge=start]{border-radius:var(--lw-radius-md) 0 0 var(--lw-radius-md)}.day[data-edge=end]{border-radius:0 var(--lw-radius-md) var(--lw-radius-md) 0}.day[data-edge=start][data-edge=end]{border-radius:var(--lw-radius-md)}.day[data-today]:after{content:\"\";background:var(--_accent);border-radius:50%;width:3px;height:3px;position:absolute;bottom:.3125rem}.day small{color:var(--_muted);font-size:.5625rem;position:absolute;top:.1875rem}.foot{border-top:1px solid var(--_line);justify-content:space-between;align-items:center;padding:.75rem .75rem .75rem 1rem;display:flex}.compare{--lw-color-primary:var(--_accent)}.apply{border-radius:var(--lw-radius-full);background:var(--lw-color-primary);color:var(--lw-color-primary-foreground);cursor:pointer;border:0;align-items:center;gap:.5rem;padding:.5rem 1rem;display:inline-flex}.apply:disabled{background:var(--_band);color:var(--_muted);cursor:default}.hint{color:var(--_muted);padding:.75rem .75rem .25rem}", y = 42, b = {
	month: "short",
	day: "numeric"
}, x = [
	{
		id: "7",
		label: "7 days",
		range: (e) => [m(e, -6), e]
	},
	{
		id: "30",
		label: "30 days",
		range: (e) => [m(e, -29), e]
	},
	{
		id: "90",
		label: "90 days",
		range: (e) => [m(e, -89), e]
	},
	{
		id: "month",
		label: "This month",
		range: (e) => [a(e), e]
	},
	{
		id: "last",
		label: "Last month",
		range: (e) => [l(e, -1), m(a(e), -1)]
	}
], S = (e, t) => `${r(e, "en-US", b)} – ${r(t, "en-US", b)}`, C = class extends e {
	static styles = v;
	static props = {
		label: { default: "Reporting period" },
		start: {
			default: "",
			reflect: !0
		},
		end: {
			default: "",
			reflect: !0
		},
		compare: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = a(o());
	#t = null;
	#n = null;
	render() {
		return `<header class="head"><span class="label"></span><button class="clear" type="button">Clear</button></header>
<div class="card"><div class="top"><p class="summary" aria-live="polite"></p><div class="presets"></div></div>
<div class="month-head"><p class="month" aria-live="polite"></p><button class="nav" type="button" data-step="-1" aria-label="Previous month">${n(_, 16)}</button><button class="nav" type="button" data-step="1" aria-label="Next month">${n(g, 16)}</button></div>
<div class="grid" role="grid"><div class="weekdays" role="row">${[
			"S",
			"M",
			"T",
			"W",
			"T",
			"F",
			"S"
		].map((e) => `<span role="columnheader">${e}</span>`).join("")}</div><div class="days"></div></div>
<footer class="foot"><lw-switch class="compare" size="sm">Compare</lw-switch><button class="apply" type="button" disabled><span>Apply</span>${n(h, 15)}</button></footer></div><p class="hint"></p>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".presets").innerHTML = x.map((e) => `<button class="preset" type="button" data-id="${e.id}">${e.label}</button>`).join(""), this.query(".presets").addEventListener("click", (e) => {
			let t = x.find((t) => t.id === e.target.closest(".preset")?.dataset.id);
			if (!t) return;
			let [n, r] = t.range(o());
			this.#n = null, this.#e = a(r), Object.assign(this, {
				start: n,
				end: r
			});
		}, e), this.query(".clear").addEventListener("click", () => {
			this.#n = null, Object.assign(this, {
				start: "",
				end: ""
			});
		}, e);
		for (let t of this.shadowRoot.querySelectorAll(".nav")) t.addEventListener("click", () => this.#a(l(this.#e, Number(t.dataset.step))), e);
		let t = this.query(".days");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".day");
			t && !t.disabled && this.#s(t.dataset.date);
		}, e), t.addEventListener("pointerover", (e) => this.#o(e.target.closest(".day")?.dataset.date ?? null), e), t.addEventListener("pointerleave", () => this.#o(null), e), t.addEventListener("keydown", (e) => this.#u(e), e), t.addEventListener("focusin", (e) => this.#o(e.target.closest(".day")?.dataset.date ?? null), e);
		let n = this.query(".compare");
		n.addEventListener("change", () => this.compare = n.checked, e), this.query(".apply").addEventListener("click", () => this.#d(), e);
	}
	updated(e) {
		this.query(".label").textContent = this.label ?? "", (e.has("end") || e.has("start")) && i(this.end) && (this.#e = a(p(this.end, o()))), this.query(".compare").checked = this.compare, this.#c();
	}
	get #r() {
		let e = i(this.start), t = i(this.end);
		return e && t ? [p(e, t), u(e, t)] : null;
	}
	get #i() {
		if (this.#n) {
			let e = this.#t ?? this.#n;
			return [p(this.#n, e), u(this.#n, e)];
		}
		return this.#r;
	}
	#a(e) {
		this.#e = a(p(e, o())), this.#c();
	}
	#o(e) {
		e !== this.#t && (this.#t = e, this.#n && this.#l());
	}
	#s(e) {
		if (!this.#n) {
			this.#n = e, this.#c();
			return;
		}
		let [t, n] = [p(this.#n, e), u(this.#n, e)];
		this.#n = null, Object.assign(this, {
			start: t,
			end: n
		});
	}
	#c() {
		let e = this.#r, t = o(), n = e && x.find((n) => n.range(t).join() === e.join());
		for (let e of this.shadowRoot.querySelectorAll(".preset")) e.ariaPressed = String(e.dataset.id === n?.id);
		this.query(".summary").innerHTML = e ? `${S(...e)} <span class="count">${f(...e)} days</span>` : this.#n ? `${r(this.#n, "en-US", b)} – …` : "No dates", this.query(".month").textContent = r(this.#e, "en-US", {
			month: "long",
			year: "numeric"
		}), this.query(".nav[data-step=\"1\"]").disabled = c(this.#e, t), this.query(".apply").disabled = !e, this.query(".clear").disabled = !e && !this.#n;
		let i = "Click a first and a last day";
		if (this.#n) i = "Now the last day";
		else if (e && this.compare) {
			let t = f(...e);
			i = `Compared with ${S(m(e[0], -t), m(e[0], -1))}`;
		} else e && (i = `${f(...e)} days, through ${r(e[1], "en-US", b)}`);
		this.query(".hint").textContent = i, this.#l();
	}
	#l() {
		let e = o(), t = m(this.#e, -d(this.#e)), n = this.#i, i = this.shadowRoot.activeElement?.dataset?.date, a = i && c(i, this.#e) ? i : n && c(n[1], this.#e) ? n[1] : p(s(this.#e), e), l = "";
		for (let i = 0; i < y / 7; i++) {
			l += "<div class=\"week\" role=\"row\">";
			for (let o = 0; o < 7; o++) {
				let s = m(t, i * 7 + o), u = !c(s, this.#e), d = s > e, f = n && s >= n[0] && s <= n[1], p = n && (s === n[0] ? "start" : s === n[1] ? "end" : ""), h = Number(s.slice(8));
				l += `<button class="day" type="button" role="gridcell" data-date="${s}" tabindex="${s === a ? 0 : -1}"${d ? " disabled" : ""}${u ? " data-outside" : ""}${f ? " data-in" : ""}${p ? ` data-edge="${p}"` : ""}${s === e ? " data-today" : ""} aria-selected="${!!f}" aria-label="${r(s, "en-US", {
					weekday: "long",
					month: "long",
					day: "numeric"
				})}">${h === 1 ? `<small>${r(s, "en-US", { month: "short" })}</small>` : ""}${h}</button>`;
			}
			l += "</div>";
		}
		let u = this.query(".days");
		u.innerHTML = l, i && u.querySelector(`[data-date="${a}"]`)?.focus();
	}
	#u(e) {
		let t = e.target.closest(".day");
		if (!t) return;
		let n = t.dataset.date, r = {
			ArrowLeft: -1,
			ArrowRight: 1,
			ArrowUp: -7,
			ArrowDown: 7
		}, i = null;
		if (e.key in r) i = m(n, r[e.key]);
		else if (e.key === "PageUp") i = l(n, -1);
		else if (e.key === "PageDown") i = l(n, 1);
		else if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), t.disabled || this.#s(n), this.query(`[data-date="${n}"]`)?.focus();
			return;
		}
		i && (e.preventDefault(), i = p(i, o()), c(i, this.#e) || (this.#e = a(i), this.#c()), this.#t = i, this.#l(), this.query(`[data-date="${i}"]`)?.focus());
	}
	#d() {
		let e = this.#r;
		if (!e) return;
		let t = f(...e), n = this.compare ? {
			start: m(e[0], -t),
			end: m(e[0], -1)
		} : void 0;
		this.emit("change", {
			start: e[0],
			end: e[1],
			days: t,
			previous: n
		});
	}
};
//#endregion
//#region src/components/period-picker/index.js
t("period-picker", C);
//#endregion
export { C as t };
