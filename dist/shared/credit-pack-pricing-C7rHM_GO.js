import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { n as r } from "./rolling-VjfpUD4B.js";
import { n as i } from "./highlight-BSyGT8bg.js";
import { l as a, o, r as s, s as c } from "./pricing-gtu3N0Z1.js";
//#region src/components/credit-pack-pricing/credit-pack-pricing.scss?inline
var l = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);--_raised:color-mix(in oklab, var(--lw-color-foreground) 5%, var(--lw-color-background));--_ease:cubic-bezier(.23, 1, .32, 1);box-sizing:border-box;border:1px solid var(--_line);background:var(--lw-color-background);border-radius:1rem;width:46rem;max-width:100%;padding:2rem}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:-2px}.title{letter-spacing:-.02em;font-size:1.5rem;font-weight:600}.description{font-size:var(--lw-text-md);color:var(--_muted);margin-top:.5rem}.balance{margin-top:2rem}.balance-line{font-size:var(--lw-text-md);color:var(--_muted);justify-content:space-between;gap:1rem;margin-bottom:.75rem;display:flex}.balance-line b{color:var(--lw-color-foreground);font-weight:600}.now,.after{vertical-align:bottom;display:inline-flex}.low-note{font-size:var(--lw-text-sm);color:var(--lw-color-destructive)}.meter{background:color-mix(in oklab, var(--lw-color-foreground) 10%, transparent);border-radius:1px;height:.375rem;position:relative;overflow:hidden}.now-fill,.after-fill{position:absolute;inset:0 auto 0 0}@media (prefers-reduced-motion:no-preference){.now-fill,.after-fill{transition:width .5s var(--_ease)}}.after-fill{background:color-mix(in oklab, var(--lw-color-foreground) 18%, transparent)}.now-fill{background:var(--lw-color-foreground)}:host([data-low]) .now-fill{background:var(--lw-color-destructive)}.packs{border:1px solid var(--_line);grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));margin-top:2.5rem;display:grid;position:relative}.pack-bar{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.pack-bar{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.pack-bar.visible{opacity:1}.pack-bar{background:var(--_raised);box-shadow:inset 0 2px 0 var(--lw-color-foreground);border-radius:0}.pack{box-shadow:-1px 0 0 var(--_line);text-align:left;cursor:pointer;background:0 0;border:0;justify-items:start;gap:.25rem;padding:1.25rem;display:grid;position:relative}.pack-head{justify-content:space-between;align-items:center;width:100%;margin-bottom:1rem;display:flex}.credits{letter-spacing:-.02em;font-size:1.375rem;font-weight:600}.radio{border:1px solid color-mix(in oklab, var(--lw-color-foreground) 35%, transparent);border-radius:50%;place-items:center;width:1rem;height:1rem;display:grid}.radio:after{content:\"\";background:var(--lw-color-foreground);border-radius:50%;width:.5rem;height:.5rem;scale:0}@media (prefers-reduced-motion:no-preference){.radio:after{transition:scale .25s var(--_ease)}}[aria-checked=true] .radio{border-color:var(--lw-color-foreground)}[aria-checked=true] .radio:after{scale:1}.price{font-size:var(--lw-text-md)}.rate,.saves{color:var(--_muted)}.saves{margin-top:.75rem}.summary{border:1px solid var(--_line);background:var(--_raised);border-top:0;padding:1.5rem}.figures{gap:1rem;margin:0;display:grid}.figure{font-size:var(--lw-text-md);justify-content:space-between;align-items:baseline;gap:1rem;display:flex}.figure dt{color:var(--_muted)}.figure dd{font-variant-numeric:tabular-nums;margin:0}.figure.total dd{letter-spacing:-.03em;font-size:2rem;font-weight:600}.buys{border-top:1px solid var(--_line);color:var(--_muted);margin-top:1.5rem;padding-top:1.25rem;line-height:1.6}.buys b{color:var(--lw-color-foreground);font-weight:500}.buys .dot{margin:0 .5rem}.actions{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;margin-top:1.5rem;display:flex}.auto{color:var(--_muted)}", u = [
	{
		credits: 500,
		price: 12.5
	},
	{
		credits: 2e3,
		price: 40
	},
	{
		credits: 1e4,
		price: 175
	},
	{
		credits: 5e4,
		price: 750
	}
], d = [
	{
		label: "compile minutes",
		credits: 1
	},
	{
		label: "profiler runs",
		credits: 5
	},
	{
		label: "fuzzing hours",
		credits: 25
	}
], f = new Intl.NumberFormat("en-US"), p = (e) => e.price / e.credits, m = (e) => `$${p(e).toFixed(4)}`, h = class extends e {
	static styles = [
		r,
		a,
		l
	];
	static props = {
		heading: { default: "Buy credits" },
		description: { default: "Credits are shared across every build target and never expire." },
		balance: {
			type: Number,
			default: 120
		},
		low: {
			type: Number,
			default: 200
		},
		value: {
			type: Number,
			default: 2e3,
			reflect: !0
		},
		auto: {
			type: Boolean,
			reflect: !0
		},
		packs: {
			type: Object,
			default: u
		},
		units: {
			type: Object,
			default: d
		}
	};
	render() {
		return `<header class="head"><h2 class="title"></h2><p class="description"></p></header>
<div class="balance"><p class="balance-line"><span>Balance <b>${c("now")}</b> credits</span><span class="low-note"></span></p><div class="meter" aria-hidden="true"><span class="after-fill"></span><span class="now-fill"></span></div></div>
<div class="packs" role="radiogroup" aria-label="Credit pack"><span class="pack-bar"></span></div>
<section class="summary" aria-label="Summary"><dl class="figures"><div class="figure total"><dt>Total</dt><dd>${c()}</dd></div><div class="figure"><dt>Per credit</dt><dd class="per-credit"></dd></div><div class="figure"><dt>Balance after</dt><dd>${c("after")} credits</dd></div></dl>
<p class="buys"></p><div class="actions"><lw-switch class="auto" size="sm"></lw-switch><lw-button class="buy"></lw-button></div></section>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".packs");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".pack");
			t && this.#i(Number(t.dataset.credits));
		}, e), t.addEventListener("keydown", (e) => {
			let t = {
				ArrowRight: 1,
				ArrowDown: 1,
				ArrowLeft: -1,
				ArrowUp: -1
			}[e.key];
			if (!t) return;
			e.preventDefault();
			let n = this.packs, r = n[(n.indexOf(this.#e) + t + n.length) % n.length];
			this.#i(r.credits), this.query(`.pack[data-credits="${r.credits}"]`).focus();
		}, e);
		let n = this.query(".auto");
		n.addEventListener("change", () => {
			this.auto = n.checked;
		}, e), this.query(".buy").addEventListener("click", () => this.emit("buy", {
			credits: this.#e.credits,
			price: this.#e.price,
			auto: this.auto
		}), e);
		let r = new ResizeObserver(() => this.#n());
		r.observe(t), this.signal.addEventListener("abort", () => r.disconnect());
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", e.has("packs") && this.#t(), this.#r();
	}
	get #e() {
		return this.packs.find((e) => e.credits === this.value) ?? this.packs[0];
	}
	#t() {
		let e = p(this.packs[0]);
		this.query(".packs").querySelectorAll(".pack").forEach((e) => e.remove()), this.query(".packs").insertAdjacentHTML("beforeend", this.packs.map((t) => {
			let n = Math.round((1 - p(t) / e) * 100);
			return `<button class="pack" type="button" role="radio" data-credits="${t.credits}"><span class="pack-head"><span class="credits">${f.format(t.credits)}</span><span class="radio" aria-hidden="true"></span></span><span class="price">${s(t.price)}</span><span class="rate">${m(t)} / credit</span><span class="saves">${n > 0 ? `save ${n}%` : "base rate"}</span></button>`;
		}).join(""));
	}
	#n() {
		let e = null;
		for (let t of this.shadowRoot.querySelectorAll(".pack")) {
			let n = Number(t.dataset.credits) === this.#e.credits;
			t.ariaChecked = String(n), t.tabIndex = n ? 0 : -1, n && (e = t);
		}
		e?.offsetWidth && i(this.query(".pack-bar"), e);
	}
	#r() {
		let e = this.#e, t = this.balance + e.credits, r = this.balance < this.low;
		this.#n(), this.toggleAttribute("data-low", r), o(this.query(".now"), f.format(this.balance)), this.query(".low-note").textContent = r ? "Running low" : "", this.query(".now-fill").style.width = `${this.balance / t * 100}%`, this.query(".after-fill").style.width = "100%", o(this.query(".amount"), e.price, !0), this.query(".per-credit").textContent = m(e), o(this.query(".after"), f.format(t)), this.query(".buys").innerHTML = `≈ ${(this.units ?? []).map((t) => `<b>${f.format(Math.floor(e.credits / t.credits))}</b> ${n(t.label)}`).join("<span class=\"dot\" aria-hidden=\"true\">·</span>")}`;
		let i = this.query(".auto");
		i.checked = this.auto, i.textContent = `Top up ${f.format(e.credits)} when below ${f.format(this.low)}`, this.query(".buy").textContent = `Buy ${f.format(e.credits)} credits`;
	}
	#i(e) {
		e !== this.value && (this.value = e, this.emit("select", {
			credits: e,
			price: this.#e.price
		}));
	}
};
//#endregion
//#region src/components/credit-pack-pricing/index.js
t("credit-pack-pricing", h);
//#endregion
export { h as t };
