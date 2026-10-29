import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { m as a } from "./lucide-BVbUPHVq.js";
//#region src/components/order-tracker/order-tracker.scss?inline
var o = ":host{--_go:var(--lightningcss-light,#10b981)var(--lightningcss-dark,#34d399);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:24rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);border-radius:1.5rem;padding:1.25rem;display:block;overflow:hidden}p{margin:0}.head{justify-content:space-between;align-items:flex-start;gap:.75rem;display:flex}.order{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}.eta{font-size:var(--lw-text-lg);margin-top:.125rem;font-weight:600}.carrier{font:var(--lw-text-xs) var(--lw-font-mono);text-align:right;color:var(--lw-color-muted-foreground)}.rail{grid-template-columns:repeat(4,1fr);margin:1.25rem 0 0;padding:0;list-style:none;display:grid;position:relative}.rail[hidden]{display:none}.rail:before,.rail:after{content:\"\";border-radius:1px;height:2px;position:absolute;top:.3125rem;left:12.5%}.rail:before{background:var(--lw-color-border);right:12.5%}.rail:after{width:calc(75% * var(--_progress,0));background:var(--_go)}.rail li{text-align:center;color:var(--lw-color-muted-foreground);justify-items:center;gap:.5rem;font-size:11px;display:grid;position:relative}.rail li[data-state=done],.rail li[data-state=current]{color:var(--lw-color-foreground)}.stop,.dot{z-index:1;box-sizing:border-box;border:2px solid var(--lw-color-border);background:var(--lw-color-background);border-radius:50%;width:.75rem;height:.75rem;position:relative}[data-state=done]>.stop,[data-state=current]>.stop{border-color:var(--_go);background:var(--_go)}[data-state=current]>.stop:after{content:\"\";border:2px solid var(--_go);opacity:0;border-radius:50%;position:absolute;inset:-5px}@media (prefers-reduced-motion:no-preference){[data-state=current]>.stop:after{animation:1.6s ease-out infinite ping}}@keyframes ping{0%{opacity:.6;scale:.6}to{opacity:0;scale:1.4}}.latest{font-size:var(--lw-text-xs);text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-muted-foreground);margin-top:1rem;overflow:hidden}.latest[hidden]{display:none}.latest b{color:var(--lw-color-foreground);font-weight:500}.history{margin:1.25rem 0 0;padding:0;list-style:none}.history[hidden]{display:none}.history li{gap:.75rem;padding-bottom:.875rem;display:flex;position:relative}.history li:not(:last-child):before{content:\"\";background:var(--lw-color-border);width:2px;position:absolute;top:.875rem;bottom:0;left:calc(.375rem - 1px)}.dot{flex:none;margin-top:.1875rem}[data-milestone]>.dot{border-color:var(--_go);background:var(--_go)}[data-latest]>.dot{box-shadow:0 0 0 4px color-mix(in oklab, var(--_go) 25%, transparent)}.scan-label{font-size:var(--lw-text-sm)}[data-milestone] .scan-label{font-weight:500}.scan-meta{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}.details{border:0;border-top:1px solid var(--lw-color-muted);width:100%;font:500 var(--lw-text-sm) var(--lw-font-sans);color:var(--lw-color-muted-foreground);cursor:pointer;background:0 0;outline:none;justify-content:center;align-items:center;gap:.25rem;margin-top:1rem;padding:.5rem;display:flex}.details:hover{color:var(--lw-color-foreground)}.details:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.details svg{transition:rotate .3s cubic-bezier(.23,1,.32,1)}:host([data-open]) .details svg{rotate:-90deg}:host(:not([data-open])) .details svg{rotate:90deg}", s = [
	"Ordered",
	"Shipped",
	"Out for delivery",
	"Delivered"
], c = "cubic-bezier(0.23, 1, 0.32, 1)", l = [
	{
		time: "Oct 15 · 07:42",
		place: "Lisbon, PT",
		label: "Out for delivery",
		milestone: 2
	},
	{
		time: "Oct 15 · 04:10",
		place: "Lisbon, PT",
		label: "Arrived at the local depot"
	},
	{
		time: "Oct 14 · 21:35",
		place: "Madrid, ES",
		label: "Departed the sorting hub"
	},
	{
		time: "Oct 14 · 09:18",
		place: "Madrid, ES",
		label: "Processed at the sorting hub"
	},
	{
		time: "Oct 13 · 18:02",
		place: "Berlin, DE",
		label: "Picked up by the carrier",
		milestone: 1
	},
	{
		time: "Oct 13 · 10:27",
		place: "Online",
		label: "Order placed",
		milestone: 0
	}
], u = class extends e {
	static styles = o;
	static props = {
		order: { default: "#4182" },
		carrier: { default: "DHL Express" },
		tracking: { default: "JD014600006218" },
		eta: { default: "Today by 2 pm" },
		scans: {
			type: Object,
			default: l
		}
	};
	#e = !1;
	render() {
		return `<div class="head"><div><p class="order"></p><p class="eta"></p></div><span class="carrier"></span></div>
<ol class="rail">${s.map((e, t) => `<li data-index="${t}"><span class="stop"></span><span class="stop-label">${e}</span></li>`).join("")}</ol>
<p class="latest"></p>
<ol class="history" hidden></ol>
<button class="details" type="button" aria-expanded="false"><span class="details-label">Details</span>${r(a, 16)}</button>`;
	}
	connected() {
		this.query(".details").addEventListener("click", () => this.#n(), { signal: this.signal });
	}
	updated() {
		let e = this.#t;
		this.query(".order").textContent = `Order ${this.order}`, this.query(".eta").textContent = e === s.length - 1 ? "Delivered" : this.eta ?? "", this.query(".carrier").textContent = `${this.carrier} · ${this.tracking}`, this.query(".rail").style.setProperty("--_progress", String(e / (s.length - 1))), this.shadowRoot.querySelectorAll(".rail li").forEach((t, n) => t.dataset.state = n < e ? "done" : n === e ? "current" : "pending");
		let t = this.scans[0];
		this.query(".latest").innerHTML = t ? `<b>${n(t.label)}</b> · ${n(t.place)} · ${n(t.time)}` : "", this.query(".history").innerHTML = this.scans.map((e, t) => `<li${e.milestone === void 0 ? "" : ` data-milestone="${e.milestone}"`}${t === 0 ? " data-latest" : ""}><span class="dot"></span><div><p class="scan-label">${n(e.label)}</p><p class="scan-meta">${n(e.place)} · ${n(e.time)}</p></div></li>`).join("");
	}
	get #t() {
		return Math.max(0, ...this.scans.map((e) => e.milestone ?? 0));
	}
	#n() {
		let e = !this.#e;
		this.#e = e;
		let t = this.query(".details");
		t.ariaExpanded = String(e), t.querySelector(".details-label").textContent = e ? "Hide details" : "Details", this.toggleAttribute("data-open", e);
		let n = this.query(".rail"), r = this.query(".history"), a = [...n.querySelectorAll(".stop")].map((e) => e.getBoundingClientRect()), o = this.offsetHeight;
		n.hidden = e, this.query(".latest").hidden = e, r.hidden = !e, this.emit("toggle", { open: e }), !i.matches && (this.animate([{ height: `${o}px` }, { height: `${this.offsetHeight}px` }], {
			duration: 360,
			easing: c
		}), e ? r.querySelectorAll("li").forEach((e, t) => {
			let n = e.querySelector(".dot"), r = e.dataset.milestone;
			if (r === void 0) {
				e.animate([{
					opacity: 0,
					translate: "0 -6px"
				}, {
					opacity: 1,
					translate: "0 0"
				}], {
					duration: 280,
					delay: 80 + t * 40,
					easing: c,
					fill: "backwards"
				});
				return;
			}
			let i = a[Number(r)], o = n.getBoundingClientRect();
			n.animate([{ transform: `translate(${i.left + i.width / 2 - (o.left + o.width / 2)}px, ${i.top + i.height / 2 - (o.top + o.height / 2)}px)` }, { transform: "none" }], {
				duration: 480,
				easing: c
			}), e.querySelector("div").animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: 300,
				delay: 160,
				easing: c,
				fill: "backwards"
			});
		}) : n.animate([{ opacity: 0 }, { opacity: 1 }], {
			duration: 260,
			easing: c
		}));
	}
};
//#endregion
//#region src/components/order-tracker/index.js
t("order-tracker", u);
//#endregion
export { u as t };
