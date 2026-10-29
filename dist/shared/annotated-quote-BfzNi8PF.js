import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { t as i } from "./visibility--H4IXDjD.js";
import { o as a } from "./lucide-BVbUPHVq.js";
import { n as o, r as s, t as c } from "./testimonial-Cc4crTCQ.js";
//#region src/components/annotated-quote/annotated-quote.scss?inline
var l = ".company{align-items:center;gap:.5rem;font-weight:500;display:inline-flex}.company-mark{background:var(--_mark);color:#fff;border-radius:.3125rem;flex:none;place-items:center;width:1.25rem;height:1.25rem;font-size:.6875rem;font-weight:700;display:grid}.person{align-items:center;gap:.75rem;min-width:0;display:flex}.face{background:var(--lw-color-muted);border-radius:50%;flex:none;width:2rem;height:2rem;display:block;overflow:hidden}.face svg{width:100%;height:100%;display:block}.person-name{font-weight:500;display:block}.person-role{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);display:block}mark{background:color-mix(in oklab, var(--_tint,var(--lw-color-foreground)) 22%, transparent);color:var(--lw-color-foreground);-webkit-box-decoration-break:clone;box-decoration-break:clone;border-radius:.2em;padding:0 .15em}:host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);--_ease:cubic-bezier(.23, 1, .32, 1);font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block;container-type:inline-size}p,ul,blockquote{margin:0}a{color:inherit;outline:none}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.layout{gap:2.5rem;display:grid}@container (width>=56rem){.layout{grid-template-columns:minmax(0,1fr) minmax(16rem,22rem);align-items:start;gap:3.5rem}}.head{flex-wrap:wrap;align-items:center;gap:.75rem 1rem;display:flex}.head .company{font-size:var(--lw-text-lg)}.head .company-mark{width:1.75rem;height:1.75rem;font-size:var(--lw-text-sm);border-radius:.5rem}.chips{flex-wrap:wrap;gap:.5rem;padding:0;list-style:none;display:flex}.chips li{border:1px solid var(--_line);border-radius:var(--lw-radius-full);font-size:var(--lw-text-xs);color:var(--_muted);padding:.25rem .75rem}.text{letter-spacing:-.03em;color:color-mix(in oklab, var(--lw-color-foreground) 55%, transparent);margin-top:2rem;font-size:clamp(1.75rem,4.2vw,2.75rem);font-weight:500;line-height:1.3}.text mark{background:color-mix(in oklab, var(--_tint) 16%, transparent);-webkit-text-decoration:underline .06em var(--_tint);text-decoration:underline .06em var(--_tint);text-underline-offset:.18em;cursor:default;border-radius:.15em;outline:none;padding:0 .12em}@media (prefers-reduced-motion:no-preference){.text mark{transition:background-color .2s ease-out,opacity .2s ease-out}}.text mark[data-active]{background:color-mix(in oklab, var(--_tint) 30%, transparent)}.text mark:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.note{background:var(--_tint);letter-spacing:0;vertical-align:super;color:#fff;border-radius:50%;place-items:center;width:1.15em;height:1.15em;margin-left:.15em;font-size:.42em;font-weight:600;line-height:1;display:inline-grid}[data-lit] mark:not([data-active]),[data-lit] .note-card:not([data-active]){opacity:.45}.foot{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1.25rem;margin-top:2.5rem;display:flex}.foot .face{width:2.75rem;height:2.75rem}.foot .person-name{font-size:var(--lw-text-md)}.foot .person-role{font-size:var(--lw-text-sm)}.link{align-items:center;gap:.375rem;display:inline-flex}.link[hidden]{display:none}.link .link-text{-webkit-text-decoration:underline 1px color-mix(in oklab, var(--lw-color-foreground) 35%, transparent);text-decoration:underline 1px color-mix(in oklab, var(--lw-color-foreground) 35%, transparent);text-underline-offset:.3em}.link:hover .link-text{text-decoration-color:currentColor}.link:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;border-radius:2px}.notes{border:1px solid var(--_line);border-radius:1.25rem;overflow:hidden}.note-card{outline:none;padding:1.5rem}@media (prefers-reduced-motion:no-preference){.note-card{transition:opacity .2s ease-out,background-color .2s ease-out}}.note-card+.note-card{border-top:1px solid var(--_line)}.note-card[data-active]{background:color-mix(in oklab, var(--_tint) 6%, transparent)}.note-card:focus-visible{box-shadow:inset 0 0 0 2px var(--lw-color-ring)}.number{background:var(--_tint);color:#fff;border-radius:50%;place-items:center;width:1.25rem;height:1.25rem;font-size:.6875rem;font-weight:600;display:grid}.figure{letter-spacing:-.04em;margin-top:.75rem;font-size:2.25rem;font-weight:500;line-height:1}.label{color:var(--_muted);margin-top:.5rem}.compare{grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:1rem 1.25rem;margin-top:1.5rem;display:grid}.track{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent);height:.375rem;overflow:hidden}.fill{border-radius:inherit;transform-origin:0;width:100%;height:100%;display:block;scale:0 1}@media (prefers-reduced-motion:no-preference){.fill{transition:scale .9s var(--_ease)}}:host([data-shown]) .fill{scale:var(--_share) 1}.fill.before{background:color-mix(in oklab, var(--lw-color-foreground) 30%, transparent)}.fill.after{background:var(--_tint);transition-delay:.15s}.value{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;text-align:right;color:var(--_muted)}", u = {
	company: {
		name: "Northwind",
		color: "#3b6ef5"
	},
	chips: [
		"Developer tools",
		"42 engineers",
		"Switched in March 2026"
	],
	quote: "We moved the whole product onto one runtime in a quarter. ==1:Builds got faster==, ==2:on-call stopped being about memory==, and for the first time ==3:every service passed our sanitizer run== before launch, not after.",
	notes: [
		{
			color: "#3b6ef5",
			figure: "−41%",
			label: "median build time, CI to preview",
			before: {
				value: 11.2,
				text: "11.2 min"
			},
			after: {
				value: 6.6,
				text: "6.6 min"
			}
		},
		{
			color: "#d6409f",
			figure: "−60%",
			label: "memory pages per on-call week",
			before: {
				value: 85,
				text: "85"
			},
			after: {
				value: 34,
				text: "34"
			}
		},
		{
			color: "#12a594",
			figure: "2",
			label: "sanitizer findings at launch",
			before: {
				value: 40,
				text: "40"
			},
			after: {
				value: 2,
				text: "2"
			}
		}
	],
	person: {
		name: "Maya Okafor",
		role: "Staff Engineer, Northwind"
	},
	link: {
		label: "Read the Northwind case study",
		href: "#"
	}
}, d = class extends e {
	static styles = l;
	static props = {
		story: {
			type: Object,
			default: u
		},
		active: {
			type: Number,
			default: 0,
			reflect: !0
		}
	};
	render() {
		return `<div class="layout"><div class="main"><header class="head"><span class="company-slot"></span><ul class="chips"></ul></header><blockquote class="text"></blockquote>
<footer class="foot"><div class="person"><span class="face"></span><span><span class="person-name"></span><span class="person-role"></span></span></div><a class="link"><span class="link-text"></span>${r(a, 14)}</a></footer></div>
<aside class="notes" aria-label="The numbers"></aside></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = (e) => {
			let t = e.target.closest("[data-note]");
			this.active = t ? Number(t.dataset.note) : 0;
		};
		for (let n of ["pointerover", "focusin"]) this.shadowRoot.addEventListener(n, t, e);
		for (let t of ["pointerleave", "focusout"]) this.query(".layout").addEventListener(t, () => this.active = 0, e);
		i(this, (e) => e && this.setAttribute("data-shown", ""), this.signal);
	}
	updated(e) {
		let t = this.story ?? {};
		if (e.has("story")) {
			this.query(".company-slot").innerHTML = c(t.company), this.query(".chips").innerHTML = (t.chips ?? []).map((e) => `<li>${n(e)}</li>`).join(""), this.query(".text").innerHTML = s(t.quote ?? ""), o(this.query(".face"), t.person?.name), this.query(".person-name").textContent = t.person?.name ?? "", this.query(".person-role").textContent = t.person?.role ?? "";
			let e = this.query(".link");
			e.hidden = !t.link, e.href = t.link?.href ?? "#", this.query(".link-text").textContent = t.link?.label ?? "", this.#e();
		}
		for (let e of this.shadowRoot.querySelectorAll("[data-note]")) e.toggleAttribute("data-active", Number(e.dataset.note) === this.active);
		this.query(".layout").toggleAttribute("data-lit", this.active > 0);
	}
	#e() {
		let e = this.story.notes ?? [];
		this.query(".notes").innerHTML = e.map((e, t) => {
			let r = t + 1, i = Math.max(e.before.value, e.after.value) || 1;
			return `<section class="note-card" id="note-${r}" data-note="${r}" tabindex="0" style="--_tint: ${n(e.color)}"><span class="number" aria-hidden="true">${r}</span><p class="figure">${n(e.figure)}</p><p class="label">${n(e.label)}</p>
<div class="compare"><span class="track"><span class="fill before" style="--_share: ${e.before.value / i}"></span></span><span class="value"><span class="visually-hidden">Before: </span>${n(e.before.text)}</span>
<span class="track"><span class="fill after" style="--_share: ${e.after.value / i}"></span></span><span class="value"><span class="visually-hidden">After: </span>${n(e.after.text)}</span></div></section>`;
		}).join("");
		for (let t of this.shadowRoot.querySelectorAll("mark[data-note]")) {
			let n = e[Number(t.dataset.note) - 1];
			n && (t.style.setProperty("--_tint", n.color), t.tabIndex = 0, t.setAttribute("aria-describedby", `note-${t.dataset.note}`));
		}
	}
};
//#endregion
//#region src/components/annotated-quote/index.js
t("annotated-quote", d);
//#endregion
export { d as t };
