import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./dom-Dlk1FlsZ.js";
import { t as n } from "./icons-HWomdoMw.js";
import { r, t as i } from "./icons-Dv1KN71n.js";
import { n as a } from "./rolling-VjfpUD4B.js";
import { i as o } from "./lucide-BVbUPHVq.js";
import { n as s, t as c } from "./modal-DvPYHqbK.js";
import { a as l, c as u, l as d, n as f, o as p, r as m, s as h } from "./pricing-gtu3N0Z1.js";
import { n as g } from "./testimonial-Cc4crTCQ.js";
//#region src/components/upgrade-dialog/upgrade-dialog.scss?inline
var _ = ".modal{--_width:28rem;background:var(--_raised)}.top{align-items:center;gap:.625rem;padding:1rem 3.5rem .75rem 1rem;display:flex}.faces{display:flex}.face{width:1.5rem;height:1.5rem;box-shadow:0 0 0 2px var(--_raised);border-radius:50%;overflow:hidden}.face+.face{margin-left:-.375rem}.face svg{width:100%;height:100%;display:block}.where{color:var(--_muted)}.where b{color:var(--lw-color-foreground);font-weight:500}.close{top:.75rem;right:.75rem}.body{border:1px solid var(--_line);background:var(--lw-color-background);border-bottom:0;border-radius:1rem 1rem 0 0;margin:0 .5rem}.usage{color:var(--_muted);align-items:center;gap:.5rem;display:flex}.ticks{gap:2px;display:flex}.ticks span{background:color-mix(in oklab, var(--lw-color-foreground) 25%, transparent);border-radius:1px;width:2px;height:.75rem}.ticks span[data-used]{background:var(--lw-color-foreground)}.reached{font-size:var(--lw-text-md);color:var(--_muted);margin-top:.875rem;line-height:1.5}.reached b{color:var(--lw-color-foreground);font-weight:600}.label{font-size:var(--lw-text-md);font-weight:500}.plan-head{justify-content:space-between;align-items:center;margin:1.5rem 0 .75rem;display:flex}.billing,.billing-pill,.billing-option{border-radius:var(--lw-radius-full)}.save{color:var(--_muted)}.plans{grid-template-columns:1fr 1fr;gap:.5rem;display:grid}.plan{border:1px solid var(--_line);text-align:left;cursor:pointer;background:0 0;border-radius:1rem;align-content:start;gap:.25rem;padding:.875rem;display:grid}@media (prefers-reduced-motion:no-preference){.plan{transition:border-color .15s ease-out,box-shadow .15s ease-out}}.plan[aria-checked=true]{border-color:var(--lw-color-foreground);box-shadow:0 0 0 1px var(--lw-color-foreground)}.plan-top{justify-content:space-between;align-items:center;margin-bottom:.375rem;display:flex}.plan-name{font-size:var(--lw-text-md);font-weight:500}.tick{border:1px solid var(--_line);border-radius:50%;place-items:center;width:1.25rem;height:1.25rem;display:grid}.tick .icon{opacity:0;width:.75rem;height:.75rem}[aria-checked=true] .tick{border-color:var(--lw-color-foreground);background:var(--lw-color-foreground);color:var(--lw-color-background)}[aria-checked=true] .tick .icon{opacity:1}.price{align-items:baseline;gap:.125rem;display:flex}.price small{color:var(--_muted)}.amount{letter-spacing:-.02em;font-size:1.5rem;font-weight:600}.billed,.blurb{color:var(--_muted)}.blurb{margin-top:.5rem;line-height:1.4}.gets{margin-top:1.5rem}.changes{margin:.5rem 0 0}.change{border-bottom:1px solid var(--_line);justify-content:space-between;align-items:center;gap:1rem;padding:.5rem 0;display:flex}.change dt{color:var(--_muted)}.change dd{align-items:center;gap:.375rem;margin:0;display:inline-flex}.change dd svg{color:var(--_muted)}.change b{font-weight:600}.was{color:var(--_muted)}.foot{border:1px solid var(--_line);background:var(--lw-color-background);border-top:0;border-radius:0 0 1rem 1rem;justify-content:space-between;margin:0 .5rem}.go{border-radius:var(--lw-radius-full);background:var(--lw-color-primary);color:var(--lw-color-primary-foreground);cursor:pointer;border:0;align-items:center;gap:.75rem;padding:.375rem .375rem .375rem 1.25rem;font-weight:500;display:inline-flex}.go-arrow{background:color-mix(in oklab, var(--lw-color-primary-foreground) 10%, transparent);border-radius:50%;place-items:center;width:2rem;height:2rem;display:grid}@media (prefers-reduced-motion:no-preference){.go-arrow{transition:translate .2s ease-out}}.go:hover .go-arrow{translate:3px}.billed-today{color:var(--_muted);padding:.75rem 1rem 1rem}.billed-today b{color:var(--lw-color-foreground);font-weight:500}", v = [{
	id: "pro",
	name: "Pro",
	monthly: 19,
	yearly: 190,
	blurb: "For one person shipping real work",
	limits: {
		Projects: "Unlimited",
		Seats: "1",
		"Build history": "90 days",
		Support: "Email, 1 day"
	}
}, {
	id: "team",
	name: "Team",
	monthly: 49,
	yearly: 490,
	blurb: "Shared projects, roles and review",
	limits: {
		Projects: "Unlimited",
		Seats: "10",
		"Build history": "1 year",
		Support: "Priority, 4 hours"
	}
}], y = {
	name: "Free",
	limits: {
		Projects: "3",
		Seats: "1",
		"Build history": "7 days",
		Support: "Community"
	}
}, b = class extends c {
	static styles = [
		s,
		n,
		a,
		d,
		_
	];
	static props = {
		...c.props,
		workspace: { default: "Northwind" },
		used: {
			type: Number,
			default: 3
		},
		limit: {
			type: Number,
			default: 3
		},
		noun: { default: "projects" },
		billing: {
			default: "yearly",
			reflect: !0
		},
		value: {
			default: "pro",
			reflect: !0
		},
		plans: {
			type: Object,
			default: v
		},
		current: {
			type: Object,
			default: y
		},
		team: {
			type: Object,
			default: [
				"Maya Chen",
				"Theo Okafor",
				"Ines Alves"
			]
		}
	};
	renderBody() {
		return `<header class="top"><span class="faces"></span><p class="where"><b id="modal-title"></b> · <span class="current"></span></p></header>
<div class="body"><p class="usage"><span class="ticks" aria-hidden="true"></span><span class="usage-text"></span></p><p class="reached"><b>You've reached the <span class="current-name"></span> limit.</b> Pick a plan to add more <span class="noun"></span>; everything you've made stays as it is.</p>
<div class="plan-head"><h3 class="label" id="plan-label">Plan</h3>${f()}</div><div class="plans" role="radiogroup" aria-labelledby="plan-label"></div>
<h3 class="label gets"></h3><dl class="changes"></dl></div>
<footer class="foot"><lw-button class="later" variant="ghost">Not now</lw-button><button class="go" type="button"><span class="go-text"></span><span class="go-arrow">${r(o, 16)}</span></button></footer><p class="billed-today"></p>`;
	}
	connected() {
		super.connected();
		let e = { signal: this.signal };
		u(this);
		let t = this.query(".plans");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".plan");
			t && (this.value = t.dataset.id);
		}, e), t.addEventListener("keydown", (e) => {
			let n = {
				ArrowRight: 1,
				ArrowDown: 1,
				ArrowLeft: -1,
				ArrowUp: -1
			}[e.key];
			if (!n) return;
			e.preventDefault();
			let r = this.plans.indexOf(this.#e);
			this.value = this.plans[(r + n + this.plans.length) % this.plans.length].id, t.querySelector(`[data-id="${CSS.escape(this.value)}"]`).focus();
		}, e), this.query(".later").addEventListener("click", () => this.hide("later"), e), this.query(".go").addEventListener("click", () => {
			this.emit("upgrade", {
				plan: this.#e.id,
				billing: this.billing,
				total: this.#t
			}), this.hide("upgrade");
		}, e);
	}
	updated(e) {
		if (super.updated(e), e.has("team")) {
			let e = this.query(".faces");
			e.replaceChildren();
			for (let t of this.team ?? []) {
				let n = Object.assign(document.createElement("span"), { className: "face" });
				g(n, t), e.append(n);
			}
		}
		this.query("#modal-title").textContent = `Upgrade ${this.workspace}`, this.query(".current").textContent = `${this.current.name} plan`, this.query(".current-name").textContent = this.current.name, this.query(".noun").textContent = this.noun, this.query(".ticks").innerHTML = Array.from({ length: this.limit }, (e, t) => `<span${t < this.used ? " data-used" : ""}></span>`).join(""), this.query(".usage-text").textContent = `${this.used} of ${this.limit} ${this.noun} used`, e.has("plans") && (this.query(".plans").innerHTML = this.plans.map((e) => `<button class="plan" type="button" role="radio" data-id="${t(e.id)}"><span class="plan-top"><span class="plan-name">${t(e.name)}</span><span class="tick">${i}</span></span><span class="price">${h()}<small>/mo</small></span><span class="billed"></span><span class="blurb">${t(e.blurb)}</span></button>`).join("")), l(this), this.#n();
	}
	get #e() {
		return this.plans.find((e) => e.id === this.value) ?? this.plans[0];
	}
	get #t() {
		return this.billing === "yearly" ? this.#e.yearly : this.#e.monthly;
	}
	#n() {
		let e = this.billing === "yearly", n = Math.round(Math.max(...this.plans.map((e) => 1 - e.yearly / (e.monthly * 12))) * 100);
		this.query(".billing-option[data-billing=\"yearly\"]").innerHTML = `Yearly <span class="save">−${n}%</span>`;
		for (let t of this.shadowRoot.querySelectorAll(".plan")) {
			let n = this.plans.find((e) => e.id === t.dataset.id), r = n === this.#e;
			t.ariaChecked = String(r), t.tabIndex = r ? 0 : -1, p(t.querySelector(".amount"), e ? Math.round(n.yearly / 12 * 100) / 100 : n.monthly, e), t.querySelector(".billed").textContent = e ? `${m(n.yearly)} billed yearly` : `${m(n.monthly)} billed monthly`;
		}
		let i = this.#e;
		this.query(".gets").textContent = `What you get on ${i.name}`, this.query(".changes").innerHTML = Object.entries(i.limits).map(([e, n]) => {
			let i = this.current.limits?.[e], a = i && i !== n ? `<span class="was">${t(i)}</span>${r(o, 13)}<b>${t(n)}</b>` : `<span class="same">${t(n)}</span>`;
			return `<div class="change"><dt>${t(e)}</dt><dd>${a}</dd></div>`;
		}).join(""), this.query(".go-text").textContent = `Upgrade to ${i.name}`;
		let a = i.monthly * 12 - i.yearly;
		this.query(".billed-today").innerHTML = `<b>${m(this.#t, !0)}</b> billed today · ${e ? `renews yearly, saving ${m(a)}` : "renews monthly"}`;
	}
};
//#endregion
//#region src/components/upgrade-dialog/index.js
e("upgrade-dialog", b);
//#endregion
export { b as t };
