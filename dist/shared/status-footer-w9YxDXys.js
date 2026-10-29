import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { i } from "./lucide-BVbUPHVq.js";
import { r as a, t as o } from "./footer-CGqCsKWA.js";
//#region src/components/status-footer/status-footer.scss?inline
var s = ":host{border-top:1px solid var(--lw-color-border);background:var(--lw-color-background);font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block;container-type:inline-size}.container{box-sizing:border-box;width:100%;max-width:72rem;margin-inline:auto;padding:4rem clamp(1.5rem,5vw,3rem) 2.5rem;position:relative}h2,p,ul{margin:0}a{color:inherit;outline:none;text-decoration:none}a:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;border-radius:2px}.brand{font-size:var(--lw-text-lg);letter-spacing:-.01em;align-items:center;gap:.625rem;font-weight:600;display:inline-flex}.brand-tile{background:var(--lw-color-foreground);width:1.75rem;height:1.75rem;font-size:var(--lw-text-sm);color:var(--lw-color-background);border-radius:.5rem;place-items:center;font-weight:700;display:grid}.column-title{font-size:var(--lw-text-sm);margin-bottom:1.25rem;font-weight:500}.links{gap:.875rem;padding:0;list-style:none;display:grid}.link{color:var(--lw-color-muted-foreground);align-items:center;gap:.5rem;display:inline-flex}@media (prefers-reduced-motion:no-preference){.link{transition:color .15s ease-out,opacity .2s ease-out}}.link:hover{color:var(--lw-color-foreground)}.badge{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-sm);color:var(--lw-color-muted-foreground);padding:.0625rem .375rem;font-size:.6875rem}:host{--_state:var(--lw-color-accent)}:host([status=degraded]){--_state:#f59e0b}:host([status=outage]){--_state:var(--lw-color-destructive)}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.top{gap:3rem;display:grid}@container (width>=52rem){.top{grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);gap:4rem}}.about{align-content:start;justify-items:start;gap:1.25rem;display:grid}.description{max-width:22rem;font-size:var(--lw-text-md);color:var(--lw-color-muted-foreground);line-height:1.6}.columns{grid-template-columns:repeat(auto-fit,minmax(8rem,1fr));gap:2rem;display:grid}.bottom{border-top:1px solid var(--lw-color-border);flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1.25rem 2rem;margin-top:4.5rem;padding-top:1.75rem;display:flex}.status{font-size:var(--lw-text-md);align-items:center;gap:.625rem;display:inline-flex}.status svg{color:var(--lw-color-muted-foreground)}@media (prefers-reduced-motion:no-preference){.status svg{transition:translate .2s ease-out}}.status:hover svg{translate:3px}.dot{background:var(--_state);border-radius:50%;width:.5rem;height:.5rem;position:relative}.dot:after{content:\"\";border-radius:inherit;background:inherit;opacity:0;position:absolute;inset:0}@media (prefers-reduced-motion:no-preference){.dot:after{animation:2.4s ease-out infinite pulse}}@keyframes pulse{0%{opacity:.5;scale:1}to{opacity:0;scale:2.75}}.uptime{align-items:center;gap:1rem;min-width:0;display:flex}.strip{border-radius:2px;outline:none;align-items:stretch;gap:1px;height:1.25rem;display:flex;position:relative}.strip:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:4px}@container (width<=40rem){.strip{display:none}}.bar{background:color-mix(in oklab, var(--lw-color-accent) 55%, transparent);border-radius:1px;width:3px}@media (prefers-reduced-motion:no-preference){.bar{transition:scale .15s ease-out}}.bar[data-level=minor]{background:#f59e0b}.bar[data-level=major]{background:var(--lw-color-destructive)}.bar[data-active]{filter:brightness(1.2);scale:1 1.3}.tip{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);background:var(--lw-color-background);box-shadow:var(--lw-shadow-md);font-size:var(--lw-text-xs);white-space:nowrap;color:var(--lw-color-muted-foreground);opacity:0;pointer-events:none;padding:.375rem .625rem;position:absolute;bottom:calc(100% + .625rem);left:0;translate:-50% .25rem}@media (prefers-reduced-motion:no-preference){.tip{transition:opacity .15s ease-out,translate .15s ease-out}}.tip.visible{opacity:1;translate:-50%}.tip b{color:var(--lw-color-foreground);margin-right:.25rem;font-weight:500}.uptime-text{font:var(--lw-text-xs) var(--lw-font-mono);white-space:nowrap;color:var(--lw-color-muted-foreground)}", c = 864e5, l = {
	normal: "All systems normal",
	degraded: "Some systems degraded",
	outage: "Major outage"
}, u = [
	{
		title: "Product",
		links: [
			{ label: "Overview" },
			{ label: "Pricing" },
			{ label: "Changelog" },
			{ label: "Roadmap" }
		]
	},
	{
		title: "Developers",
		links: [
			{ label: "Documentation" },
			{ label: "API reference" },
			{ label: "SDKs" },
			{ label: "Status" }
		]
	},
	{
		title: "Company",
		links: [
			{ label: "About" },
			{ label: "Careers" },
			{ label: "Privacy" },
			{ label: "Terms" }
		]
	}
], d = [
	{
		ago: 61,
		level: "minor",
		label: "Slow builds on arm64 runners"
	},
	{
		ago: 23,
		level: "major",
		label: "Queue delays in eu-west"
	},
	{
		ago: 9,
		level: "minor",
		label: "Elevated API latency"
	}
], f = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric"
}), p = class extends e {
	static styles = s;
	static props = {
		brand: { default: "Lower" },
		href: { default: "/" },
		description: { default: "Low-level tools for teams who would rather ship than babysit a runtime." },
		columns: {
			type: Object,
			default: u
		},
		status: {
			default: "normal",
			reflect: !0
		},
		statusHref: { default: "#" },
		uptime: {
			type: Number,
			default: 99.93
		},
		days: {
			type: Number,
			default: 90
		},
		incidents: {
			type: Object,
			default: d
		}
	};
	#e = -1;
	#t = /* @__PURE__ */ new Map();
	render() {
		return `<footer class="container"><div class="top"><div class="about"><span class="brand-slot"></span><p class="description"></p></div><div class="columns"></div></div>
<div class="bottom"><a class="status"><span class="dot" aria-hidden="true"></span><span class="status-text"></span>${r(i, 16)}</a>
<div class="uptime"><div class="strip" tabindex="0" role="img"><span class="tip" aria-hidden="true"></span></div><span class="uptime-text"></span><span class="readout visually-hidden" aria-live="polite"></span></div></div></footer>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".strip");
		t.addEventListener("pointermove", (e) => {
			let t = e.target.closest(".bar");
			t && this.#r(Number(t.dataset.ago));
		}, e), t.addEventListener("pointerleave", () => this.#r(-1), e), t.addEventListener("focus", () => this.#r(0), e), t.addEventListener("blur", () => this.#r(-1), e), t.addEventListener("keydown", (e) => {
			let t = {
				ArrowLeft: 1,
				ArrowRight: -1
			}[e.key], n = {
				Home: this.days - 1,
				End: 0
			}[e.key];
			(t !== void 0 || n !== void 0) && (e.preventDefault(), this.#r(n ?? Math.min(this.days - 1, Math.max(0, this.#e + t))));
		}, e);
	}
	updated(e) {
		(e.has("brand") || e.has("href")) && (this.query(".brand-slot").innerHTML = o(this.brand, this.href)), this.query(".description").textContent = this.description ?? "", e.has("columns") && (this.query(".columns").innerHTML = a(this.columns));
		let t = this.query(".status");
		t.href = this.statusHref ?? "#", this.query(".status-text").textContent = l[this.status] ?? l.normal, this.query(".uptime-text").textContent = `${this.uptime}% uptime · ${this.days} days`, (e.has("days") || e.has("incidents")) && this.#n();
	}
	#n() {
		let e = /* @__PURE__ */ new Map();
		for (let t of this.incidents ?? []) {
			let n = e.get(t.ago) ?? [];
			e.set(t.ago, [...n, t]);
		}
		let t = Array.from({ length: this.days }, (t, n) => {
			let r = this.days - 1 - n, i = e.get(r) ?? [], a = i.some((e) => e.level === "major") ? "major" : i.length ? "minor" : "";
			return `<span class="bar" data-ago="${r}"${a ? ` data-level="${a}"` : ""}></span>`;
		}), n = this.query(".strip");
		n.querySelectorAll(".bar").forEach((e) => e.remove()), n.insertAdjacentHTML("afterbegin", t.join("")), this.#t = e;
		let r = this.incidents?.length ?? 0;
		n.ariaLabel = `Uptime, last ${this.days} days: ${r ? `${r} ${r === 1 ? "incident" : "incidents"}` : "no incidents"}. Use the arrow keys to read each day.`;
	}
	#r(e) {
		this.#e = e;
		let t = this.query(".tip");
		for (let t of this.shadowRoot.querySelectorAll(".bar")) t.toggleAttribute("data-active", Number(t.dataset.ago) === e);
		if (e < 0) {
			t.classList.remove("visible");
			return;
		}
		let r = this.query(`.bar[data-ago="${e}"]`), i = this.#t.get(e) ?? [];
		t.innerHTML = `<b>${e === 0 ? "Today" : f.format(/* @__PURE__ */ new Date(Date.now() - e * c))}</b> ${i.length ? i.map((e) => n(e.label)).join(", ") : "No incidents"}`, t.style.left = `${r.offsetLeft + r.offsetWidth / 2}px`, t.classList.add("visible"), this.shadowRoot.activeElement === this.query(".strip") && (this.query(".readout").textContent = t.textContent);
	}
};
//#endregion
//#region src/components/status-footer/index.js
t("status-footer", p);
//#endregion
export { p as t };
