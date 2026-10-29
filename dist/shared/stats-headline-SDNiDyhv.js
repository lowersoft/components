import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { n as r } from "./motion-CFWhFfc_.js";
import { n as i, t as a } from "./rolling-VjfpUD4B.js";
import { t as o } from "./visibility--H4IXDjD.js";
import { n as s } from "./testimonial-Cc4crTCQ.js";
//#region src/components/stats-headline/stats-headline.scss?inline
var c = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);font-family:var(--lw-font-sans);color:var(--lw-color-foreground);text-align:center;display:block;container-type:inline-size}h2,p,dl,dd{margin:0}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.title{letter-spacing:-.035em;font-size:clamp(2.25rem,6vw,3.5rem);font-weight:500;line-height:1.1}.title .line{display:block}.description{max-width:26rem;font-size:var(--lw-text-md);color:var(--_muted);margin:1.25rem auto 0;line-height:1.6}.panel{background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));text-align:left;border-radius:1.25rem;max-width:42rem;margin:3.5rem auto 0;padding:.5rem}.proof{font-size:var(--lw-text-sm);align-items:center;gap:.75rem;padding:.5rem .625rem .75rem;display:flex}.faces{display:flex}.face{width:1.5rem;height:1.5rem;box-shadow:0 0 0 2px var(--lw-color-background);border-radius:50%;overflow:hidden}.face+.face{margin-left:-.375rem}.face svg{width:100%;height:100%;display:block}.stats{border:1px solid var(--_line);background:color-mix(in oklab, var(--lw-color-foreground) 6%, var(--lw-color-background));border-radius:1rem;display:grid}@container (width>=32rem){.stats{grid-auto-columns:minmax(0,1fr);grid-auto-flow:column}}.stat{flex-direction:column-reverse;gap:.375rem;padding:1.25rem;display:flex}.stat+.stat{border-top:1px solid var(--_line)}@container (width>=32rem){.stat+.stat{border-top:0;border-left:1px solid var(--_line)}}.figure{letter-spacing:-.03em;font-size:clamp(1.75rem,4vw,2.25rem);font-weight:500}.label{font-size:var(--lw-text-sm);color:var(--_muted)}.source{font-size:var(--lw-text-xs);color:var(--_muted);padding:.75rem .625rem .375rem}", l = 1200, u = [
	{
		value: 10,
		suffix: "k+",
		label: "Active developers"
	},
	{
		value: 150,
		suffix: "+",
		label: "Countries"
	},
	{
		value: 99.9,
		suffix: "%",
		decimals: 1,
		label: "Build success rate"
	}
], d = [
	"Maya Okafor",
	"Theo Laurent",
	"Iris Novak",
	"Ravi Shah"
], f = class extends e {
	static styles = [i, c];
	static props = {
		heading: { default: "Write it close to the metal.\nShip it everywhere." },
		description: { default: "Components, blocks and runtimes that drop into your app and load before anyone notices." },
		proof: { default: "Join 100,000+ developers worldwide" },
		source: { default: "Last 30 days, from product analytics. Updated monthly." },
		stats: {
			type: Object,
			default: u
		},
		faces: {
			type: Object,
			default: d
		}
	};
	#e = !1;
	render() {
		return "<header class=\"intro\"><h2 class=\"title\"></h2><p class=\"description\"></p></header>\n<section class=\"panel\"><p class=\"proof\"><span class=\"faces\"></span><span class=\"proof-text\"></span></p><dl class=\"stats\"></dl><p class=\"source\"></p></section>";
	}
	connected() {
		o(this, (e) => e && this.#r(), this.signal);
	}
	updated(e) {
		let t = (this.heading ?? "").split("\n");
		if (this.query(".title").innerHTML = t.map((e) => `<span class="line">${n(e)}</span>`).join(""), this.query(".description").textContent = this.description ?? "", this.query(".proof-text").textContent = this.proof ?? "", this.query(".source").textContent = this.source ?? "", e.has("faces")) {
			let e = this.query(".faces");
			e.replaceChildren();
			for (let t of this.faces ?? []) {
				let n = Object.assign(document.createElement("span"), { className: "face" });
				s(n, t), e.append(n);
			}
		}
		e.has("stats") && (this.query(".stats").innerHTML = (this.stats ?? []).map((e) => `<div class="stat"><dt class="label">${n(e.label)}</dt><dd class="figure"><span class="visually-hidden">${n(this.#t(e, e.value))}</span><span class="rolling" aria-hidden="true"></span></dd></div>`).join(""), this.#n(this.#e || r.matches ? 1 : 0));
	}
	#t(e, t) {
		return `${e.prefix ?? ""}${t.toFixed(e.decimals ?? 0)}${e.suffix ?? ""}`;
	}
	#n(e) {
		this.shadowRoot.querySelectorAll(".stat").forEach((t, n) => {
			let r = this.stats[n];
			a(t.querySelector(".rolling"), this.#t(r, r.value * e));
		});
	}
	#r() {
		if (this.#e) return;
		if (this.#e = !0, r.matches) return this.#n(1);
		let e = performance.now(), t = (n) => {
			let r = Math.min(1, (n - e) / l);
			this.#n(1 - (1 - r) ** 3), r < 1 && !this.signal.aborted && requestAnimationFrame(t);
		};
		requestAnimationFrame(t);
	}
};
//#endregion
//#region src/components/stats-headline/index.js
t("stats-headline", f);
//#endregion
export { f as t };
