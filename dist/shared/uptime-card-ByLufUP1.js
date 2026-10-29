import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { Dt as a, bt as o, v as s } from "./lucide-BVbUPHVq.js";
//#region src/components/uptime-card/uptime-card.scss?inline
var c = ":host{--_up:var(--lightningcss-light,#10b981)var(--lightningcss-dark,#34d399);--_degraded:var(--lightningcss-light,#fbbf24)var(--lightningcss-dark,#fcd34d);--_down:var(--lightningcss-light,#f43f5e)var(--lightningcss-dark,#fb7185);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:36rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);-webkit-user-select:none;user-select:none;border-radius:1.5rem;padding:1.25rem;display:block}p{margin:0}.muted{color:var(--lw-color-muted-foreground)}.top{justify-content:space-between;align-items:center;gap:1rem;display:flex}.heading{font-size:var(--lw-text-sm);font-weight:500}.overall{font-size:var(--lw-text-sm);color:var(--lightningcss-light,#059669)var(--lightningcss-dark,#34d399);align-items:center;gap:.375rem;display:flex}.overall[data-issues]{color:var(--lightningcss-light,#d97706)var(--lightningcss-dark,#fbbf24)}.summary{font-size:var(--lw-text-sm);font-variant-numeric:tabular-nums;text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-muted-foreground);margin-top:.25rem;overflow:hidden}.bars{border-radius:var(--lw-radius-md);cursor:pointer;touch-action:pan-y;outline:none;margin-top:1rem}.bars:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:4px}.service+.service{margin-top:.75rem}.service-top{font-size:var(--lw-text-xs);justify-content:space-between;margin-bottom:.375rem;display:flex}.name{font-weight:500}.uptime{font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground)}.row{gap:2px;height:1.75rem;display:flex}.row span{min-width:0;transition:opacity var(--lw-duration-fast) ease-out;border-radius:2px;flex-basis:0}[data-reading] .row span:not([data-lit]){opacity:.6}[data-status=up]{background:var(--_up)}[data-status=degraded]{background:var(--_degraded)}[data-status=down]{background:var(--_down)}[data-status=none]{background:var(--lw-color-border)}.ends{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);justify-content:space-between;margin-top:.5rem;display:flex}.log{opacity:0;grid-template-rows:0fr;display:grid}@media (prefers-reduced-motion:no-preference){.log{transition:grid-template-rows .26s cubic-bezier(.23,1,.32,1),opacity .26s cubic-bezier(.23,1,.32,1)}}.log[data-open]{opacity:1;grid-template-rows:1fr}.log:not([data-open]){visibility:hidden}.log-inner{overflow:hidden}.day{background:var(--lw-color-muted);border-radius:1rem;margin-top:1rem;padding:1rem}.day-top{justify-content:space-between;align-items:center;display:flex}.day-name{font-size:var(--lw-text-sm);font-weight:500}.close{color:var(--lw-color-muted-foreground);cursor:pointer;transition:background-color var(--lw-duration-fast) ease-out, color var(--lw-duration-fast) ease-out;background:0 0;border:0;border-radius:50%;outline:none;place-items:center;padding:.25rem;display:grid}.close:hover{background:var(--lw-color-border);color:var(--lw-color-foreground)}.close:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.none{font-size:var(--lw-text-sm);margin-top:.25rem}.incident{margin-top:.75rem}.what{font-size:var(--lw-text-sm);flex-wrap:wrap;align-items:center;gap:.5rem;display:flex}.badge{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--_degraded) 20%, transparent);color:var(--lightningcss-light,#92400e)var(--lightningcss-dark,#fde68a);padding:.125rem .5rem;font-size:11px;font-weight:500}.badge[data-status=down]{background:color-mix(in oklab, var(--_down) 15%, transparent);color:var(--lightningcss-light,#be123c)var(--lightningcss-dark,#fda4af)}.service-name{font-weight:500}ol{border-left:1px solid var(--lw-color-border);margin:.625rem 0 0 .25rem;padding:0;list-style:none}ol li{font-size:var(--lw-text-sm);padding:0 0 .625rem 1rem;position:relative}ol li:last-child{padding-bottom:0}ol li:before{content:\"\";background:var(--lw-color-ring);border-radius:50%;width:6px;height:6px;position:absolute;top:7px;left:-3.5px}ol b{font-weight:500}.time{font-variant-numeric:tabular-nums}", l = 5, u = 2.4, d = 864e5, f = {
	up: "Operational",
	degraded: "Degraded",
	down: "Outage",
	none: "No data"
}, p = [
	{
		name: "API",
		incidents: {
			19: {
				title: "Elevated error rates on writes",
				status: "degraded",
				minutes: 18,
				updates: [
					{
						time: "14:02",
						label: "Investigating",
						note: "5xx on POST rose to 2%."
					},
					{
						time: "14:11",
						label: "Identified",
						note: "A bad config push to one region."
					},
					{
						time: "14:20",
						label: "Resolved",
						note: "Rolled back; error rates normal."
					}
				]
			},
			84: {
				title: "Slow responses in eu-west",
				status: "degraded",
				minutes: 23,
				updates: [
					{
						time: "09:41",
						label: "Investigating",
						note: "p95 latency up 3x in eu-west."
					},
					{
						time: "09:52",
						label: "Monitoring",
						note: "Added capacity to the pool."
					},
					{
						time: "10:04",
						label: "Resolved"
					}
				]
			}
		}
	},
	{
		name: "Dashboard",
		incidents: { 43: {
			title: "Charts failed to load",
			status: "degraded",
			minutes: 12,
			updates: [{
				time: "18:30",
				label: "Investigating"
			}, {
				time: "18:42",
				label: "Resolved",
				note: "A CDN cache rule was reverted."
			}]
		} }
	},
	{
		name: "Webhooks",
		incidents: { 69: {
			title: "Deliveries delayed",
			status: "down",
			minutes: 48,
			updates: [
				{
					time: "02:15",
					label: "Investigating",
					note: "The delivery queue stopped draining."
				},
				{
					time: "02:38",
					label: "Identified",
					note: "A worker deploy failed health checks."
				},
				{
					time: "03:03",
					label: "Resolved",
					note: "Backlog delivered in order."
				}
			]
		} }
	},
	{
		name: "Database",
		missing: 6,
		incidents: { 27: {
			title: "Failover to replica",
			status: "down",
			minutes: 9,
			updates: [{
				time: "22:07",
				label: "Investigating",
				note: "Primary stopped accepting writes."
			}, {
				time: "22:16",
				label: "Resolved",
				note: "Promoted the replica; no data lost."
			}]
		} }
	}
], m = (e, t, n) => Math.min(n, Math.max(t, e)), h = (e) => new Date(e).toLocaleDateString("en-US", {
	weekday: "short",
	month: "short",
	day: "numeric",
	timeZone: "UTC"
}), g = (e, t) => t < (e.missing ?? 0) ? "none" : e.incidents?.[t]?.status ?? "up", _ = (e, t) => 100 * (1 - Object.values(e.incidents ?? {}).reduce((e, { minutes: t, status: n }) => e + t * (n === "down" ? 1 : .5), 0) / ((t - (e.missing ?? 0)) * 1440)), v = (e, t, n) => {
	for (let r = 0; r < e; r++) n[r] = t === null ? 1 : 1 + l * Math.exp(-(((r - t) / u) ** 2));
	return n;
}, y = (e, t) => {
	let n = t * e.reduce((e, t) => e + t, 0);
	for (let t = 0; t < e.length; t++) if (n -= e[t], n <= 0) return t;
	return e.length - 1;
}, b = class extends e {
	static styles = c;
	static props = {
		heading: { default: "System status" },
		services: {
			type: Object,
			default: p
		},
		days: {
			type: Number,
			default: 90
		},
		endDate: { default: "2026-10-14" }
	};
	#e = null;
	#t = null;
	#n = /* @__PURE__ */ new Float64Array();
	#r = /* @__PURE__ */ new Float64Array();
	#i = 0;
	#a = 0;
	render() {
		return `<div class="top"><p class="heading"></p><p class="overall"></p></div>
<p class="summary" aria-live="polite"></p>
<div class="bars" role="slider" tabindex="0" aria-valuemin="1"><div class="rows"></div><div class="ends"><span class="ago"></span><span>Today</span></div></div>
<div class="log"><div class="log-inner"><div class="day"><div class="day-top"><p class="day-name"></p><button class="close" type="button" aria-label="Close day">${r(a, 14)}</button></div><div class="incidents"></div></div></div></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".bars");
		t.addEventListener("pointerdown", (e) => this.#_(e), e), t.addEventListener("pointermove", (e) => this.#v(e), e), t.addEventListener("lostpointercapture", () => this.#y(), e), t.addEventListener("pointerleave", (e) => e.pointerType === "mouse" && this.#y(), e), t.addEventListener("click", () => this.#e !== null && this.#g(this.#t === this.#e ? null : this.#e), e), t.addEventListener("keydown", (e) => this.#b(e), e), this.query(".close").addEventListener("click", () => this.#g(null), e), this.signal.addEventListener("abort", () => {
			cancelAnimationFrame(this.#i), this.#i = 0;
		});
	}
	updated(e) {
		(e.has("days") || e.has("services")) && (this.#n = new Float64Array(this.days).fill(1), this.#r = new Float64Array(this.days).fill(1), this.#e = this.#t = null, this.#s()), this.#l();
	}
	#o(e) {
		return Date.parse(`${this.endDate}T00:00:00Z`) - (this.days - 1 - e) * d;
	}
	#s() {
		let e = this.days;
		this.query(".rows").innerHTML = this.services.map((t) => {
			let r = Array.from({ length: e }, (e, n) => `<span data-status="${g(t, n)}"></span>`).join("");
			return `<div class="service"><div class="service-top"><span class="name">${n(t.name)}</span><span class="uptime">${_(t, e).toFixed(2)}%</span></div><div class="row">${r}</div></div>`;
		}).join(""), this.query(".ago").textContent = `${e} days ago`, this.#d();
	}
	#c(e) {
		return e === null ? [] : this.services.flatMap((t) => t.incidents?.[e] ? [{
			service: t.name,
			incident: t.incidents[e]
		}] : []);
	}
	#l() {
		let e = this.days, t = this.services.filter((t) => !["up", "none"].includes(g(t, e - 1)));
		this.query(".heading").textContent = this.heading ?? "";
		let n = this.query(".overall");
		n.toggleAttribute("data-issues", t.length > 0), n.innerHTML = t.length ? `${r(o)}${t.length} service${t.length > 1 ? "s" : ""} affected` : `${r(s)}All systems operational`;
		let i = this.#e ?? this.#t, a = "Hover a day to see what happened";
		if (i !== null) {
			let e = this.#c(i), t = e[0], n = t ? `${t.service} ${t.incident.status === "down" ? "down" : "degraded"} for ${t.incident.minutes} min${e.length > 1 ? `, +${e.length - 1} more` : ""}` : "No incidents";
			a = `${h(this.#o(i))} · ${n}`;
		}
		this.query(".summary").textContent = a;
		let c = this.query(".bars");
		c.ariaLabel = `Daily status for the last ${e} days. Use the arrow keys to move between days and Enter to open one.`, c.ariaValueMax = String(e), c.ariaValueNow = String((i ?? e - 1) + 1), c.ariaValueText = a, c.toggleAttribute("data-reading", i !== null);
		for (let e of this.shadowRoot.querySelectorAll(".row")) [...e.children].forEach((e, t) => e.toggleAttribute("data-lit", t === i));
		this.#u();
	}
	#u() {
		let e = this.#t;
		if (this.query(".log").toggleAttribute("data-open", e !== null), e === null) return;
		this.query(".day-name").textContent = h(this.#o(e));
		let t = this.#c(e);
		this.query(".incidents").innerHTML = t.length ? t.map(({ service: e, incident: t }) => `<div class="incident"><p class="what"><span class="badge" data-status="${t.status}">${f[t.status]}</span><span class="service-name">${n(e)}</span><span class="muted">${n(t.title)} · ${t.minutes} min</span></p><ol>${t.updates.map(({ time: e, label: t, note: r }) => `<li><span class="muted time">${n(e)}</span> <b>${n(t)}</b>${r ? ` <span class="muted">${n(r)}</span>` : ""}</li>`).join("")}</ol></div>`).join("") : "<p class=\"muted none\">No incidents recorded. Every service was operational.</p>";
	}
	#d() {
		for (let e of this.shadowRoot.querySelectorAll(".row")) [...e.children].forEach((e, t) => e.style.flexGrow = this.#n[t].toFixed(3));
	}
	#f(e) {
		v(this.days, e, this.#r), i.matches ? (this.#n.set(this.#r), this.#d()) : this.#i ||= requestAnimationFrame((e) => this.#p(e));
	}
	#p(e) {
		this.#i = 0;
		let t = this.#a ? Math.min((e - this.#a) / 1e3, 1 / 30) : 1 / 60;
		this.#a = e;
		let n = 1 - Math.exp(-18 * t), r = !1;
		for (let e = 0; e < this.#n.length; e++) {
			let t = this.#r[e] - this.#n[e];
			Math.abs(t) > .002 ? (this.#n[e] += t * n, r = !0) : this.#n[e] = this.#r[e];
		}
		this.#d(), r ? this.#i = requestAnimationFrame((e) => this.#p(e)) : this.#a = 0;
	}
	#m(e) {
		let t = this.query(".rows").getBoundingClientRect(), n = m((e - t.left) / t.width, 0, 1), r = new Float64Array(this.days), i = Math.round(n * (this.days - 1));
		for (let e = 0; e < 3; e++) i = y(v(this.days, i, r), n);
		return i;
	}
	#h(e) {
		this.#e = e, this.#f(e ?? this.#t), this.#l();
	}
	#g(e) {
		this.#t = e, e === null && this.#f(this.#e), this.#l();
	}
	#_(e) {
		(e.pointerType !== "mouse" || e.button === 0) && (e.pointerType !== "mouse" && e.currentTarget.setPointerCapture?.(e.pointerId), this.#h(this.#m(e.clientX)));
	}
	#v(e) {
		(e.pointerType === "mouse" || e.currentTarget.hasPointerCapture?.(e.pointerId)) && this.#h(this.#m(e.clientX));
	}
	#y() {
		this.#h(null);
	}
	#b(e) {
		let t = this.days, n = this.#e ?? this.#t ?? t - 1;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.#g(this.#t === n ? null : n);
			return;
		}
		if (e.key === "Escape") {
			this.#t = null, this.#y();
			return;
		}
		let r = {
			ArrowLeft: -1,
			ArrowRight: 1,
			Home: -t,
			End: t
		}[e.key];
		r !== void 0 && (e.preventDefault(), this.#h(m(n + r, 0, t - 1)));
	}
};
//#endregion
//#region src/components/uptime-card/index.js
t("uptime-card", b);
//#endregion
export { b as t };
