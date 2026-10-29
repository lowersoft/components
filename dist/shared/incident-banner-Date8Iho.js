import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { f as i } from "./lucide-BVbUPHVq.js";
import { n as a, t as o } from "./banner-DyZRwpIp.js";
//#region src/components/incident-banner/incident-banner.scss?inline
var s = ":host{font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block;overflow:hidden;container-type:inline-size}:host([hidden]){display:none}p{margin:0}a,button{font:inherit;color:inherit;outline:none}a:focus-visible,button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.close,.icon-button{border-radius:var(--lw-radius-md);width:2rem;height:2rem;color:var(--lw-color-muted-foreground);cursor:pointer;background:0 0;border:0;flex:none;place-items:center;padding:0;display:grid}.close:hover,.icon-button:hover{color:var(--lw-color-foreground)}:host{--_state:var(--lw-color-destructive);border-bottom:1px solid var(--lw-color-border);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background))}:host([severity=minor]){--_state:#f59e0b}:host([data-resolved]){--_state:var(--lw-color-accent)}.bar{align-items:center;gap:1rem;min-height:3.5rem;padding:.375rem .75rem .375rem 1.25rem;display:flex}.state{background:var(--_state);border-radius:2px;flex:none;width:.625rem;height:.625rem}@media (prefers-reduced-motion:no-preference){.state{animation:2s ease-in-out infinite breathe}:host([data-resolved]) .state{animation:none}}@keyframes breathe{50%{opacity:.45}}.heading{min-width:0;font-size:var(--lw-text-md);text-overflow:ellipsis;white-space:nowrap;flex:1;font-weight:500;overflow:hidden}.steps{gap:.25rem;display:flex}@container (width<=44rem){.steps{display:none}}.step{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-foreground) 18%, transparent);width:1.125rem;height:.25rem}.step[data-done]{background:var(--lw-color-foreground)}.stage{font-family:var(--lw-font-mono);white-space:nowrap;color:var(--lw-color-muted-foreground)}@container (width<=36rem){.stage{display:none}}.clock{font-variant-numeric:tabular-nums}.toggle{border-radius:var(--lw-radius-md);font-size:var(--lw-text-md);cursor:pointer;background:0 0;border:0;align-items:center;gap:.375rem;padding:.375rem .5rem;display:inline-flex}.toggle:hover{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent)}@media (prefers-reduced-motion:no-preference){.toggle svg{transition:rotate .25s ease-out}}:host([open]) .toggle svg{rotate:180deg}.count{color:var(--lw-color-muted-foreground)}.timeline{grid-template-rows:0fr;display:grid}@media (prefers-reduced-motion:no-preference){.timeline{transition:grid-template-rows .3s cubic-bezier(.23,1,.32,1)}}:host([open]) .timeline{grid-template-rows:1fr}.updates{min-height:0;margin:0;padding:0 1.25rem 0 3.125rem;list-style:none;overflow:hidden}:host([open]) .updates{padding-bottom:1rem}.update{border-top:1px solid var(--lw-color-border);grid-template-columns:auto 1fr;gap:.25rem .75rem;padding:.75rem 0;display:grid;position:relative}.update:before{content:\"\";border:1px solid var(--lw-color-muted-foreground);border-radius:50%;width:.5rem;height:.5rem;position:absolute;top:1.05rem;left:-1.25rem}.update:first-child:before{border-color:var(--_state);background:var(--_state)}.update-stage{font-weight:500}.update-at{font:var(--lw-text-xs) var(--lw-font-mono);color:var(--lw-color-muted-foreground)}.update-text{max-width:44rem;color:var(--lw-color-muted-foreground);grid-column:1/-1;line-height:1.5}", c = [
	"Investigating",
	"Identified",
	"Monitoring",
	"Resolved"
], l = 872e3, u = [
	{
		stage: "Monitoring",
		at: "14:41",
		text: "A fix is out on every region. Error rates are back to normal; we are watching them."
	},
	{
		stage: "Identified",
		at: "14:33",
		text: "A bad config push to the API gateway is returning 502s for about 4% of requests."
	},
	{
		stage: "Investigating",
		at: "14:27",
		text: "We are seeing elevated error rates on API requests and are looking into it."
	}
], d = (e) => String(e).padStart(2, "0"), f = (e) => {
	let t = Math.max(0, Math.floor(e / 1e3)), n = Math.floor(t / 3600), r = `${d(Math.floor(t % 3600 / 60))}:${d(t % 60)}`;
	return n ? `${n}:${r}` : r;
}, p = class extends e {
	static styles = s;
	static props = {
		severity: {
			default: "major",
			reflect: !0
		},
		heading: { default: "Elevated error rates on API requests" },
		started: {},
		updates: {
			type: Object,
			default: u
		},
		open: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = 0;
	#t = 0;
	render() {
		return `<div class="bar"><span class="state" aria-hidden="true"></span><p class="heading"></p><span class="steps" aria-hidden="true"></span><p class="stage"><span class="stage-name"></span> <span class="clock"></span></p>
<button class="toggle" type="button" aria-controls="timeline"><span>Updates</span><span class="count"></span>${r(i, 16)}</button>${o()}</div>
<div class="timeline" id="timeline" role="region" aria-label="Incident updates"><ol class="updates"></ol></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".toggle").addEventListener("click", () => this.open = !this.open, e), this.query(".close").addEventListener("click", () => a(this), e), this.#t = setInterval(() => this.#n(), 1e3), this.signal.addEventListener("abort", () => clearInterval(this.#t));
	}
	updated(e) {
		e.has("started") && (this.#e = this.started ? new Date(this.started).getTime() : Date.now() - l);
		let t = this.updates ?? [], r = Math.max(0, c.indexOf(t[0]?.stage ?? c[0])), i = r === c.length - 1;
		this.toggleAttribute("data-resolved", i), this.setAttribute("role", i ? "status" : "alert"), this.query(".heading").textContent = this.heading ?? "", this.query(".steps").innerHTML = c.map((e, t) => `<span class="step"${t <= r ? " data-done" : ""}></span>`).join(""), this.query(".stage-name").textContent = c[r], this.query(".count").textContent = String(t.length), this.query(".toggle").ariaExpanded = String(this.open), this.query(".timeline").inert = !this.open, e.has("updates") && (this.query(".updates").innerHTML = t.map((e) => `<li class="update"><span class="update-stage">${n(e.stage)}</span><span class="update-at">${n(e.at ?? "")}</span><p class="update-text">${n(e.text)}</p></li>`).join("")), this.#n();
	}
	#n() {
		this.hasAttribute("data-resolved") ? (clearInterval(this.#t), this.query(".clock").textContent = "") : this.query(".clock").textContent = f(Date.now() - this.#e);
	}
};
//#endregion
//#region src/components/incident-banner/index.js
t("incident-banner", p);
//#endregion
export { p as t };
