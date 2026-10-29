import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { n as a } from "./people-C_zYMoEl.js";
import { i as o, r as s } from "./lucide-BVbUPHVq.js";
import { n as c, r as l, t as u } from "./testimonial-Cc4crTCQ.js";
//#region src/components/testimonial-spotlight/testimonial-spotlight.scss?inline
var d = ".company{align-items:center;gap:.5rem;font-weight:500;display:inline-flex}.company-mark{background:var(--_mark);color:#fff;border-radius:.3125rem;flex:none;place-items:center;width:1.25rem;height:1.25rem;font-size:.6875rem;font-weight:700;display:grid}.person{align-items:center;gap:.75rem;min-width:0;display:flex}.face{background:var(--lw-color-muted);border-radius:50%;flex:none;width:2rem;height:2rem;display:block;overflow:hidden}.face svg{width:100%;height:100%;display:block}.person-name{font-weight:500;display:block}.person-role{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);display:block}mark{background:color-mix(in oklab, var(--_tint,var(--lw-color-foreground)) 22%, transparent);color:var(--lw-color-foreground);-webkit-box-decoration-break:clone;box-decoration-break:clone;border-radius:.2em;padding:0 .15em}:host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block;container-type:inline-size}p,blockquote{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.company-line{font-size:var(--lw-text-md)}.company-line .company-mark{width:1.5rem;height:1.5rem;font-size:var(--lw-text-xs)}.text{letter-spacing:-.03em;max-width:54rem;color:color-mix(in oklab, var(--lw-color-foreground) 55%, transparent);text-wrap:pretty;margin-top:2rem;font-size:clamp(1.75rem,4.5vw,2.75rem);font-weight:500;line-height:1.2}.text mark{color:var(--lw-color-foreground);background:0 0;padding:0}.bar{flex-wrap:wrap;align-items:center;gap:1.25rem 2rem;margin-top:3rem;display:flex}.speaker{align-items:center;gap:.875rem;display:flex}.ring{place-items:center;width:2.75rem;height:2.75rem;display:grid;position:relative}.ring svg{fill:none;stroke-width:1.5px;position:absolute;inset:0;rotate:-90deg}.ring .face{width:2.25rem;height:2.25rem}.track{stroke:var(--_line)}.progress{stroke:var(--lw-color-foreground);stroke-dasharray:1;stroke-dashoffset:1px}@media (prefers-reduced-motion:no-preference){.progress.running{animation:fill var(--_interval,7s) linear forwards}}:host(:hover) .progress,:host(:focus-within) .progress{animation-play-state:paused}@keyframes fill{to{stroke-dashoffset:0}}.others{gap:.25rem;display:flex}.other{width:2.25rem;height:2.25rem;color:var(--_muted);cursor:pointer;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;font-size:.6875rem;font-weight:600;display:grid}@media (prefers-reduced-motion:no-preference){.other{transition:color .15s ease-out,background-color .15s ease-out}}.other:hover{color:var(--lw-color-foreground)}.other[aria-selected=true]{background:color-mix(in oklab, var(--lw-color-foreground) 8%, transparent);color:var(--lw-color-foreground)}.nav{align-items:center;gap:.5rem;margin-left:auto;display:flex}.counter{font:var(--lw-text-xs) var(--lw-font-mono);font-variant-numeric:tabular-nums;color:var(--_muted);margin-right:.75rem}.step{border:1px solid var(--_line);width:2.5rem;height:2.5rem;color:var(--_muted);cursor:pointer;background:0 0;border-radius:50%;place-items:center;padding:0;display:grid}.step:hover{color:var(--lw-color-foreground)}.step:active{scale:.94}", f = [
	{
		company: {
			name: "Northwind",
			color: "#3b6ef5"
		},
		quote: "We replaced three internal libraries with one runtime. Code review stopped being about allocations and ==started being about the product.==",
		person: {
			name: "Maya Okafor",
			role: "Staff Engineer, Northwind"
		}
	},
	{
		company: {
			name: "Halcyon",
			color: "#12a594"
		},
		quote: "Cold starts went from seconds to milliseconds, and ==nobody on the team had to become a compiler expert.==",
		person: {
			name: "Daniel Reyes",
			role: "CTO, Halcyon"
		}
	},
	{
		company: {
			name: "Parcel",
			color: "#f76b15"
		},
		quote: "We ship one 1.4 MB binary to every edge node now. ==The deploy is a file copy.==",
		person: {
			name: "Priya Nair",
			role: "Platform Lead, Parcel"
		}
	},
	{
		company: {
			name: "Mosaic",
			color: "#d6409f"
		},
		quote: "Every hot path has a benchmark next to it, so ==regressions show up in review, not in production.==",
		person: {
			name: "Tomás Alvarez",
			role: "Performance Engineer, Mosaic"
		}
	},
	{
		company: {
			name: "Tandem",
			color: "#0090ff"
		},
		quote: "Half the machines, the same traffic. ==The bill paid for the migration in a month.==",
		person: {
			name: "Sofia Lindgren",
			role: "VP Engineering, Tandem"
		}
	}
], p = (e) => String(e).padStart(2, "0"), m = class extends e {
	static styles = d;
	static props = {
		index: {
			type: Number,
			default: 0,
			reflect: !0
		},
		interval: {
			type: Number,
			default: 7
		},
		items: {
			type: Object,
			default: f
		}
	};
	render() {
		return `<section class="stage" aria-roledescription="carousel" aria-label="Customer stories"><div class="slide" aria-live="off"><p class="company-line"></p><blockquote class="text"></blockquote></div>
<footer class="bar"><div class="speaker"><span class="ring"><svg viewBox="0 0 44 44" aria-hidden="true"><circle class="track" cx="22" cy="22" r="21"/><circle class="progress" cx="22" cy="22" r="21" pathLength="1"/></svg><span class="face"></span></span><span><span class="person-name"></span><span class="person-role"></span></span></div>
<div class="others" role="tablist" aria-label="Stories"></div><div class="nav"><span class="counter" aria-hidden="true"></span><button class="step" type="button" data-step="-1" aria-label="Previous story">${r(s, 16)}</button><button class="step" type="button" data-step="1" aria-label="Next story">${r(o, 16)}</button></div></footer></section>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".nav").addEventListener("click", (e) => {
			let t = e.target.closest(".step");
			t && this.#t(this.index + Number(t.dataset.step), !0);
		}, e), this.query(".others").addEventListener("click", (e) => {
			let t = e.target.closest(".other");
			t && this.#t(Number(t.dataset.index), !0);
		}, e), this.query(".others").addEventListener("keydown", (e) => {
			let t = {
				ArrowLeft: -1,
				ArrowRight: 1
			}[e.key];
			t && (e.preventDefault(), this.#t(this.index + t, !0), this.query(`.other[data-index="${this.index}"]`)?.focus());
		}, e), this.query(".progress").addEventListener("animationend", () => this.#t(this.index + 1, !1), e);
	}
	updated(e) {
		this.style.setProperty("--_interval", `${this.interval}s`), e.has("items") && (this.query(".others").innerHTML = this.items.map((e, t) => `<button class="other" type="button" role="tab" data-index="${t}" aria-label="${n(e.person.name)}, ${n(e.company.name)}">${n(a(e.person.name))}</button>`).join("")), this.#e(!e.has("items"));
	}
	#e(e) {
		let t = this.items ?? [], n = (this.index % t.length + t.length) % t.length, r = t[n];
		if (!r) return;
		let a = this.query(".slide");
		this.query(".company-line").innerHTML = u(r.company), this.query(".text").innerHTML = l(r.quote), c(this.query(".face"), r.person.name), this.query(".person-name").textContent = r.person.name, this.query(".person-role").textContent = r.person.role, this.query(".counter").textContent = `${p(n + 1)} / ${p(t.length)}`, this.shadowRoot.querySelectorAll(".other").forEach((e, t) => {
			e.ariaSelected = String(t === n), e.tabIndex = t === n ? 0 : -1;
		});
		let o = this.query(".progress");
		o.classList.remove("running"), o.getBoundingClientRect(), o.classList.add("running"), e && !i.matches && a.animate({
			opacity: [0, 1],
			filter: ["blur(4px)", "blur(0)"],
			translate: ["0 0.5rem", "0 0"]
		}, {
			duration: 500,
			easing: "cubic-bezier(0.23, 1, 0.32, 1)"
		});
	}
	#t(e, t) {
		let n = this.items.length;
		this.query(".slide").ariaLive = t ? "polite" : "off", this.index = (e % n + n) % n, this.emit("change", { index: this.index });
	}
};
//#endregion
//#region src/components/testimonial-spotlight/index.js
t("testimonial-spotlight", m);
//#endregion
export { m as t };
