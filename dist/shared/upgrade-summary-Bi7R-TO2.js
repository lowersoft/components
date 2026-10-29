import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./rolling-VjfpUD4B.js";
import { n as a } from "./highlight-BSyGT8bg.js";
import { i as o } from "./lucide-BVbUPHVq.js";
import { a as s, c, l, n as u, o as d, r as f, s as p } from "./pricing-gtu3N0Z1.js";
//#region src/components/upgrade-summary/upgrade-summary.scss?inline
var m = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);--_raised:color-mix(in oklab, var(--lw-color-foreground) 4%, var(--lw-color-background));--_ease:cubic-bezier(.23, 1, .32, 1);box-sizing:border-box;border:1px solid var(--_line);background:var(--lw-color-background);border-radius:1rem;width:34rem;max-width:100%;overflow:hidden}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:-2px}section,.head{padding:1.5rem}section+section,section+.head,.head+section,.head+.head{border-top:1px solid var(--_line)}.route{font-size:var(--lw-text-lg);align-items:center;gap:.5rem;font-weight:500;display:flex}.route svg,.route .from{color:var(--_muted)}.lead{color:var(--_muted);margin-top:.375rem}.choose{justify-items:start;gap:1rem;display:grid}.targets{border:1px solid var(--_line);border-radius:var(--lw-radius-lg);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;width:100%;display:grid;position:relative}.target-bar{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.target-bar{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.target-bar.visible{opacity:1}.target-bar{border-radius:var(--lw-radius-lg);background:var(--_raised);box-shadow:inset 0 2px 0 var(--lw-color-foreground)}.target{text-align:left;cursor:pointer;background:0 0;border:0;gap:.25rem;padding:.875rem 1rem;display:grid;position:relative}.target+.target{border-left:1px solid var(--_line)}.target-name{font-size:var(--lw-text-md);font-weight:500}.target-price{color:var(--_muted)}.section-title{color:var(--_muted);margin-bottom:1rem}.meter{padding:.875rem 0}.meter+.meter{border-top:1px solid var(--_line)}.meter-head{font-size:var(--lw-text-md);flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:.25rem 1rem;margin-bottom:.625rem;display:flex}.meter-value{font-variant-numeric:tabular-nums;align-items:center;gap:.375rem;display:inline-flex}.meter-value svg,.used{color:var(--_muted)}[data-near] .used{color:var(--lw-color-destructive)}.track{grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;display:grid;position:relative}.segment{background:color-mix(in oklab, var(--lw-color-foreground) 10%, transparent);border-radius:1px;height:.5rem}@media (prefers-reduced-motion:no-preference){.segment{transition:background-color .3s ease-out}}.segment[data-state=used]{background:var(--lw-color-foreground)}[data-near] .segment[data-state=used]{background:var(--lw-color-destructive)}.segment[data-state=now]{background:color-mix(in oklab, var(--lw-color-foreground) 30%, transparent)}.mark{background:var(--lw-color-foreground);width:1px;position:absolute;top:-.25rem;bottom:-.25rem;translate:-1px}@media (prefers-reduced-motion:no-preference){.mark{transition:left .4s var(--_ease)}}.bill{background:var(--_raised)}.lines{gap:.75rem;margin:0;display:grid}.line{color:var(--_muted);justify-content:space-between;align-items:baseline;gap:1rem;display:flex}.line:first-child{font-size:var(--lw-text-md);color:var(--lw-color-foreground)}.line dt{gap:.125rem;display:grid}.line dd{margin:0}.line.total{border-top:1px solid var(--_line);font-size:var(--lw-text-lg);color:var(--lw-color-foreground);margin-top:.25rem;padding-top:1rem;font-weight:600}.line-detail{font-size:var(--lw-text-xs);color:var(--_muted)}.line-detail:empty{display:none}.confirm{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;margin-top:1.5rem;display:flex}.then{font-size:var(--lw-text-xs);color:var(--_muted)}", h = 864e5, g = 32, _ = .8, v = [
	{
		id: "starter",
		name: "Starter",
		monthly: 19,
		limits: {
			minutes: 1e4,
			seats: 5,
			storage: 10
		}
	},
	{
		id: "pro",
		name: "Pro",
		monthly: 49,
		limits: {
			minutes: 5e4,
			seats: 10,
			storage: 100
		}
	},
	{
		id: "team",
		name: "Team",
		monthly: 99,
		limits: {
			minutes: 25e4,
			seats: 25,
			storage: 1e3
		}
	}
], y = [
	{
		key: "minutes",
		label: "Build minutes"
	},
	{
		key: "seats",
		label: "Seats"
	},
	{
		key: "storage",
		label: "Storage",
		unit: "GB"
	}
], b = {
	minutes: 8420,
	seats: 3,
	storage: 4.2
}, x = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }), S = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric"
}), C = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric"
}), w = (e) => Math.round(e * 100) / 100, T = (e, t) => t === "GB" ? e >= 1e3 ? `${x.format(e / 1e3)} TB` : `${x.format(e)} GB` : x.format(e), E = class extends e {
	static styles = [
		i,
		l,
		m
	];
	static props = {
		current: { default: "starter" },
		value: {
			default: "pro",
			reflect: !0
		},
		billing: {
			default: "monthly",
			reflect: !0
		},
		daysLeft: {
			type: Number,
			default: 12
		},
		cycleDays: {
			type: Number,
			default: 30
		},
		tax: {
			type: Number,
			default: 8
		},
		plans: {
			type: Object,
			default: v
		},
		meters: {
			type: Object,
			default: y
		},
		usage: {
			type: Object,
			default: b
		}
	};
	#e = !1;
	render() {
		return `<header class="head"><h2 class="route"><span class="from"></span>${r(o, 18)}<span class="to"></span></h2><p class="lead">Review what changes before you confirm.</p></header>
<section class="choose"><div class="targets" role="radiogroup" aria-label="Plan"><span class="target-bar"></span></div>${u({
			monthly: "Monthly",
			yearly: "Yearly · 2 months free"
		})}</section>
<section class="usage" aria-labelledby="usage-title"><h3 class="section-title" id="usage-title">Usage this cycle</h3><div class="meters"></div></section>
<section class="bill" aria-label="Due today"><dl class="lines"></dl><div class="confirm"><p class="then"></p><lw-button class="go"></lw-button></div></section>`;
	}
	connected() {
		c(this);
		let e = { signal: this.signal }, t = this.query(".targets");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".target");
			t && this.#u(t.dataset.id);
		}, e), t.addEventListener("keydown", (e) => {
			let n = {
				ArrowRight: 1,
				ArrowDown: 1,
				ArrowLeft: -1,
				ArrowUp: -1
			}[e.key];
			if (!n) return;
			e.preventDefault();
			let r = [...t.querySelectorAll(".target")], i = r[(r.findIndex((e) => e.ariaChecked === "true") + n + r.length) % r.length];
			this.#u(i.dataset.id), i.focus();
		}, e), this.query(".go").addEventListener("click", () => this.#d(), e);
		let n = new ResizeObserver(() => this.#o());
		n.observe(t), this.signal.addEventListener("abort", () => n.disconnect());
	}
	updated(e) {
		["plans", "current"].some((t) => e.has(t)) && this.#i(), ["meters", "plans"].some((t) => e.has(t)) && this.#a(), s(this), this.#l();
	}
	get #t() {
		return this.plans.find((e) => e.id === this.current) ?? this.plans[0];
	}
	get #n() {
		return this.#r.find((e) => e.id === this.value) ?? this.#r[0] ?? this.#t;
	}
	get #r() {
		return this.plans.slice(this.plans.indexOf(this.#t) + 1);
	}
	#i() {
		this.query(".targets").querySelectorAll(".target").forEach((e) => e.remove()), this.query(".targets").insertAdjacentHTML("beforeend", this.#r.map((e) => `<button class="target" type="button" role="radio" data-id="${n(e.id)}"><span class="target-name">${n(e.name)}</span><span class="target-price"></span></button>`).join(""));
	}
	#a() {
		let e = "<span class=\"segment\"></span>".repeat(g);
		this.query(".meters").innerHTML = (this.meters ?? []).map((t) => `<div class="meter" data-key="${n(t.key)}"><div class="meter-head"><span>${n(t.label)}</span><span class="meter-value"><span class="used"></span>${r(o, 14)}<span class="next"></span></span></div><div class="track" aria-hidden="true">${e}<span class="mark"></span></div></div>`).join("");
	}
	#o() {
		let e = null;
		for (let t of this.shadowRoot.querySelectorAll(".target")) {
			let n = t.dataset.id === this.#n.id, r = this.plans.find((e) => e.id === t.dataset.id);
			t.ariaChecked = String(n), t.tabIndex = n ? 0 : -1, t.querySelector(".target-price").textContent = this.billing === "yearly" ? `${f(r.monthly * 10)} / year` : `${f(r.monthly)} / month`, n && (e = t);
		}
		e?.offsetWidth && a(this.query(".target-bar"), e);
	}
	#s() {
		for (let e of this.meters ?? []) {
			let t = this.query(`.meter[data-key="${CSS.escape(e.key)}"]`);
			if (!t) continue;
			let n = this.usage?.[e.key] ?? 0, r = this.#t.limits[e.key], i = this.#n.limits[e.key], a = g / Math.max(i, r, n), o = n > 0 ? Math.max(1, Math.round(n * a)) : 0, s = Math.round(r * a);
			t.toggleAttribute("data-near", n / r >= _), t.querySelectorAll(".segment").forEach((e, t) => {
				e.dataset.state = t < o ? "used" : t < s ? "now" : "next";
			}), t.querySelector(".mark").style.left = `${s / g * 100}%`, t.querySelector(".used").textContent = `${T(n, e.unit)} of ${T(r, e.unit)}`, t.querySelector(".next").textContent = T(i, e.unit);
		}
	}
	get #c() {
		let e = this.#t, t = this.#n, n = this.billing === "yearly", r = /* @__PURE__ */ new Date(), i = new Date(r.getTime() + this.daysLeft * h), a = this.daysLeft / this.cycleDays, o = w(n ? t.monthly * 10 : t.monthly * a), s = w(e.monthly * a), c = w(Math.max(0, o - s) * this.tax / 100), l = new Date(r.getFullYear() + 1, r.getMonth(), r.getDate()), u = n ? `${C.format(r)} – ${C.format(l)}` : `${S.format(r)} – ${S.format(i)}, prorated`;
		return {
			lines: [
				{
					label: `${t.name}, ${this.billing}`,
					detail: u,
					amount: o
				},
				{
					label: `Credit for ${this.daysLeft} unused days on ${e.name}`,
					amount: -s
				},
				{
					label: `Tax (${this.tax}%)`,
					amount: c
				}
			],
			total: w(Math.max(0, o - s) + c),
			then: n ? `Then ${f(t.monthly * 10)} a year from ${C.format(l)}.` : `Then ${f(t.monthly)} a month from ${S.format(i)}.`
		};
	}
	#l() {
		this.query(".from").textContent = this.#t.name, this.query(".to").textContent = this.#n.name, this.#o(), this.#s();
		let e = this.#c, t = this.query(".lines");
		t.children.length !== e.lines.length + 1 && (t.innerHTML = [...e.lines, null].map((e, t, n) => `<div class="line${t === n.length - 1 ? " total" : ""}"><dt><span class="line-label"></span><span class="line-detail"></span></dt><dd>${p()}</dd></div>`).join("")), [...e.lines, {
			label: "Due today",
			amount: e.total
		}].forEach((e, n) => {
			let r = t.children[n];
			r.querySelector(".line-label").textContent = e.label, r.querySelector(".line-detail").textContent = e.detail ?? "", d(r.querySelector(".amount"), e.amount, !0);
		}), this.query(".then").textContent = e.then;
		let n = this.query(".go");
		n.textContent = this.#e ? `You're on ${this.#n.name}` : `Upgrade to ${this.#n.name}`, n.disabled = this.#e;
	}
	#u(e) {
		e === this.value || this.#e || (this.value = e, this.emit("select", { plan: e }));
	}
	async #d() {
		if (this.#e) return;
		let e = this.query(".go"), t = {
			plan: this.#n.id,
			billing: this.billing,
			total: this.#c.total
		};
		e.loading = !0;
		try {
			await this.confirm?.(t);
		} catch {
			return;
		} finally {
			e.loading = !1;
		}
		this.#e = !0, this.#l(), this.emit("confirm", t);
	}
};
//#endregion
//#region src/components/upgrade-summary/index.js
t("upgrade-summary", E);
//#endregion
export { E as t };
