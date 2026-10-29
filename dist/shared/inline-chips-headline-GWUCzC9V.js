import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { n as i, r as a, t as o } from "./icons-Dv1KN71n.js";
import { n as s } from "./motion-CFWhFfc_.js";
import { n as c, t as l } from "./swap-BK53XQML.js";
import { t as u } from "./visibility--H4IXDjD.js";
import { n as d, t as f } from "./people-C_zYMoEl.js";
import { E as p } from "./lucide-BVbUPHVq.js";
//#region src/components/inline-chips-headline/inline-chips-headline.scss?inline
var m = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);font-family:var(--lw-font-sans);color:var(--lw-color-foreground);text-align:center;display:block}h2,p{margin:0}.title{letter-spacing:-.035em;text-wrap:balance;max-width:64rem;margin:0 auto;font-size:clamp(2rem,6vw,4.5rem);font-weight:500;line-height:1.3}.chip{border:1px solid var(--_line);border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-foreground) 4%, var(--lw-color-background));letter-spacing:-.01em;vertical-align:.3em;align-items:center;gap:.25em;height:1.1em;margin:0 .1em;padding:0 .35em 0 .12em;font-size:.5em;line-height:1;display:inline-flex}@media (prefers-reduced-motion:no-preference){.chip{opacity:0;transition:opacity .3s ease-out calc(var(--_order) * .18s), scale .5s cubic-bezier(.34, 1.56, .64, 1) calc(var(--_order) * .18s);scale:.6}:host([data-shown]) .chip{opacity:1;scale:1}}.doc-icon{color:#f76b15;background:#f76b1540;background:lab(62.7433% 52.1968 67.6599/.25);border-radius:.4em;place-items:center;width:1.6em;height:1.6em;display:grid}.doc-icon svg{width:.9em;height:.9em}.team{background:0 0;border:0;padding:0}.avatar{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));width:1.85em;height:1.85em;box-shadow:0 0 0 .1em var(--lw-color-background);border-radius:50%;place-items:center;font-size:.7em;font-weight:500;display:grid}@media (prefers-reduced-motion:no-preference){.avatar{transition:margin .3s cubic-bezier(.23,1,.32,1)}}.avatar+.avatar{margin-left:-.45em}.team:hover .avatar+.avatar{margin-left:.1em}.status{color:inherit;cursor:pointer;outline:none;padding-right:.6em;font-family:inherit}.status:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.status-icon{background:color-mix(in oklab, var(--lw-color-foreground) 10%, transparent);border-radius:50%;place-items:center;width:1.6em;height:1.6em;display:grid}.status-icon .icon{width:.9em;height:.9em}[data-state=done] .status-icon{background:var(--lw-color-accent);color:var(--lw-color-background)}.description{max-width:32rem;font-size:var(--lw-text-lg);color:var(--_muted);margin:2rem auto 0;line-height:1.6}", h = 1800, g = class extends e {
	static styles = [
		r,
		c,
		m
	];
	static props = {
		heading: { default: "Write the patch {doc}, review it with {team} your team, and ship it {status} before lunch." },
		description: { default: "One workspace for the diff, the review and the release, so the work never waits on a handoff." },
		doc: { default: "alloc-fix.c" },
		team: {
			type: Object,
			default: [
				"Ana Moreno",
				"Jules Laurent",
				"Sam Okafor"
			]
		},
		working: { default: "Building" },
		done: { default: "Deployed" }
	};
	#e = 0;
	#t = !1;
	render() {
		return "<h2 class=\"title\"></h2><p class=\"description\"></p>";
	}
	connected() {
		this.shadowRoot.addEventListener("click", (e) => e.target.closest(".status") && this.#r(), { signal: this.signal }), u(this, (e) => e && this.#n(), this.signal), this.signal.addEventListener("abort", () => clearTimeout(this.#e));
	}
	updated() {
		let e = {
			doc: `<span class="chip doc"><span class="doc-icon">${a(p, 18)}</span>${n(this.doc ?? "")}</span>`,
			team: `<span class="chip team" role="img" aria-label="${n((this.team ?? []).join(", "))}">${(this.team ?? []).map((e) => `<span class="avatar" style="--_hue: ${f(e)}">${n(d(e))}</span>`).join("")}</span>`,
			status: "<button class=\"chip status\" type=\"button\" aria-label=\"Run again\"><span class=\"status-icon\"></span><span class=\"swap status-text\" aria-live=\"polite\"></span></button>"
		}, t = n(this.heading ?? "").split(/(\{doc\}|\{team\}|\{status\})/);
		this.query(".title").innerHTML = t.map((t) => e[t.slice(1, -1)] ?? t).join(""), this.query(".description").textContent = this.description ?? "", this.shadowRoot.querySelectorAll(".chip").forEach((e, t) => e.style.setProperty("--_order", t)), this.toggleAttribute("data-shown", this.#t || s.matches), this.#i();
	}
	#n() {
		this.#t || (this.#t = !0, this.setAttribute("data-shown", ""), this.#r());
	}
	#r() {
		clearTimeout(this.#e);
		let e = this.query(".status");
		e && (e.dataset.state = "working", e.querySelector(".status-icon").innerHTML = i, l(e.querySelector(".status-text"), this.working ?? ""), this.#e = setTimeout(() => {
			this.#i(), this.emit("done");
		}, s.matches ? 0 : h));
	}
	#i() {
		let e = this.query(".status");
		e && (e.dataset.state = "done", e.querySelector(".status-icon").innerHTML = o, l(e.querySelector(".status-text"), this.done ?? ""));
	}
};
//#endregion
//#region src/components/inline-chips-headline/index.js
t("inline-chips-headline", g);
//#endregion
export { g as t };
