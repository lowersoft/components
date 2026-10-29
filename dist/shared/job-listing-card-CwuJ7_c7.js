import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { E as a, St as o, d as s } from "./lucide-BVbUPHVq.js";
//#region src/components/job-listing-card/job-listing-card.scss?inline
var c = ":host{box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:24rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);border-radius:1.5rem;padding:1.25rem;display:block;overflow:hidden}p{margin:0}.top{align-items:center;gap:.625rem;display:flex}.logo{border-radius:var(--lw-radius-md);background:var(--lw-color-primary);width:2.25rem;height:2.25rem;color:var(--lw-color-primary-foreground);flex:none;place-items:center;font-weight:700;display:grid}.company{font-size:var(--lw-text-sm);font-weight:500}.posted{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}.title{font-size:var(--lw-text-lg);letter-spacing:-.01em;margin-top:.875rem;font-weight:600}.meta{font-size:var(--lw-text-sm);color:var(--lw-color-muted-foreground);margin-top:.125rem}.tags{flex-wrap:wrap;gap:.375rem;margin:.75rem 0 0;padding:0;list-style:none;display:flex}.tags li{border-radius:var(--lw-radius-full);background:var(--lw-color-muted);font-size:var(--lw-text-xs);padding:.125rem .5rem}.pay{border-radius:var(--lw-radius-lg);border:1px solid var(--lw-color-muted);margin-top:1rem;padding:.75rem}.pay-head{justify-content:space-between;align-items:baseline;gap:.5rem;display:flex}.band-text{font-size:var(--lw-text-sm);font-variant-numeric:tabular-nums;font-weight:600}.median-text{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}.range{border-radius:var(--lw-radius-full);background:var(--lw-color-muted);height:.5rem;margin-top:.625rem;position:relative}.band{inset-block:0;left:var(--_from);right:calc(100% - var(--_to));border-radius:var(--lw-radius-full);background:var(--lw-color-foreground);position:absolute}.median{top:-.25rem;bottom:-.25rem;left:var(--_median);width:2px;box-shadow:0 0 0 2px var(--lw-color-background);background:var(--lightningcss-light,#f97316)var(--lightningcss-dark,#fb923c);border-radius:1px;position:absolute;translate:-50%}.ends{font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);justify-content:space-between;margin-top:.375rem;font-size:11px;display:flex}.stage{margin-top:1rem}.stage[hidden]{display:none}.listing lw-button{display:flex}.apply{gap:.75rem;display:grid}.drop{border:1.5px dashed var(--lw-color-border);border-radius:var(--lw-radius-lg);font-size:var(--lw-text-sm);text-align:center;cursor:pointer;justify-items:center;gap:.125rem;padding:.875rem;transition:border-color .15s ease-out,background-color .15s ease-out;display:grid}.drop:hover,.drop[data-over]{border-color:var(--lw-color-ring);background:var(--lw-color-muted)}.drop[data-file]{border-style:solid}.drop:focus-within{outline:2px solid var(--lw-color-ring);outline-offset:2px}.drop u{text-underline-offset:2px}.drop-icon{color:var(--lw-color-muted-foreground);display:grid}.drop-text{text-overflow:ellipsis;white-space:nowrap;max-width:100%;font-weight:500;overflow:hidden}.drop-note{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}.form-actions{justify-content:flex-end;gap:.5rem;display:flex}.track{grid-template-columns:repeat(3,1fr);margin:0;padding:0;list-style:none;display:grid}.track li{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);justify-items:center;gap:.375rem;display:grid;position:relative}.track li:not(:first-child):before{content:\"\";background:var(--lw-color-border);height:2px;margin-inline:.75rem;position:absolute;top:.5625rem;left:-50%;right:50%}.track li[data-state=done]{color:var(--lw-color-foreground)}.dot{box-sizing:border-box;border:2px solid var(--lw-color-border);background:var(--lw-color-background);color:#0000;border-radius:50%;place-items:center;width:1.25rem;height:1.25rem;display:grid;position:relative}[data-state=done] .dot{color:#fff;background:var(--lightningcss-light,#10b981)var(--lightningcss-dark,#34d399);border-color:var(--lightningcss-light,#10b981)var(--lightningcss-dark,#34d399)}@media (prefers-reduced-motion:no-preference){[data-state=done] .dot{animation:.4s cubic-bezier(.34,1.56,.64,1) .2s backwards pop}}[data-state=next] .dot{border-color:var(--lw-color-foreground)}@media (prefers-reduced-motion:no-preference){[data-state=next] .dot{animation:1.2s ease-in-out infinite pulse}}@keyframes pop{0%{scale:.4}}@keyframes pulse{50%{border-color:var(--lw-color-border)}}.applied-text{font-size:var(--lw-text-sm);text-align:center;color:var(--lw-color-muted-foreground);margin-top:.875rem}.undo{border-radius:var(--lw-radius-full);background:var(--lw-color-muted);font:500 var(--lw-text-xs) var(--lw-font-sans);color:inherit;cursor:pointer;border:0;margin:.5rem auto 0;padding:.25rem .625rem;display:block}.undo[hidden]{display:none}.undo:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}", l = [
	"Applied",
	"In review",
	"Interview"
], u = 8e3, d = "cubic-bezier(0.23, 1, 0.32, 1)", f = (e, t) => new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: t,
	notation: "compact",
	maximumFractionDigits: 0
}).format(e), p = class extends e {
	static styles = c;
	static props = {
		company: { default: "LowerSoft" },
		title: { default: "Senior Systems Engineer" },
		location: { default: "Remote · Europe" },
		kind: { default: "Full-time" },
		posted: { default: "3 days ago" },
		tags: {
			type: Object,
			default: [
				"C",
				"SIMD",
				"Profiling"
			]
		},
		salary: {
			type: Object,
			default: {
				min: 11e4,
				max: 135e3
			}
		},
		market: {
			type: Object,
			default: {
				min: 7e4,
				max: 165e3,
				median: 118e3
			}
		},
		currency: { default: "EUR" }
	};
	#e = "listing";
	#t = null;
	#n = 0;
	render() {
		return `<div class="top"><span class="logo" aria-hidden="true"></span><div class="org"><p class="company"></p><p class="posted"></p></div></div>
<p class="title"></p><p class="meta"></p><ul class="tags"></ul>
<div class="pay"><p class="pay-head"><span class="band-text"></span><span class="median-text"></span></p><div class="range" aria-hidden="true"><span class="band"></span><span class="median"></span></div><p class="ends"><span class="lo"></span><span class="hi"></span></p></div>
<div class="stage listing"><lw-button class="quick">Quick apply</lw-button></div>
<form class="stage apply" hidden novalidate><lw-text-input class="applicant" label="Name" name="name" required autocomplete="name"></lw-text-input><lw-text-input class="email" label="Email" name="email" type="email" required autocomplete="email"></lw-text-input>
<label class="drop"><input type="file" accept=".pdf,.doc,.docx" hidden><span class="drop-icon">${r(o, 18)}</span><span class="drop-text">Drop your résumé, or <u>browse</u></span><span class="drop-note">PDF or Word, up to 10 MB</span></label>
<div class="form-actions"><lw-button class="cancel" variant="ghost" type="button">Cancel</lw-button><lw-button class="send" type="submit">Send application</lw-button></div></form>
<div class="stage applied" hidden><ol class="track">${l.map((e) => `<li><span class="dot">${r(s, 12)}</span>${e}</li>`).join("")}</ol><p class="applied-text" aria-live="polite"></p><button class="undo" type="button">Undo</button></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".quick").addEventListener("click", () => this.#r("apply"), e), this.query(".cancel").addEventListener("click", () => this.#r("listing"), e), this.query(".apply").addEventListener("submit", (e) => {
			e.preventDefault(), this.#a();
		}, e);
		let t = this.query(".drop"), n = t.querySelector("input");
		n.addEventListener("change", () => this.#i(n.files[0]), e), t.addEventListener("dragover", (e) => {
			e.preventDefault(), t.toggleAttribute("data-over", !0);
		}, e), t.addEventListener("dragleave", () => t.removeAttribute("data-over"), e), t.addEventListener("drop", (e) => {
			e.preventDefault(), t.removeAttribute("data-over"), this.#i(e.dataTransfer.files[0]);
		}, e), this.query(".undo").addEventListener("click", () => this.#o(), e), this.signal.addEventListener("abort", () => clearTimeout(this.#n));
	}
	updated() {
		let e = this.query(".logo");
		e.textContent = (this.company ?? "?").charAt(0), this.query(".company").textContent = this.company ?? "", this.query(".posted").textContent = this.posted ?? "", this.query(".title").textContent = this.title ?? "", this.query(".meta").textContent = [this.location, this.kind].filter(Boolean).join(" · "), this.query(".tags").innerHTML = (this.tags ?? []).map((e) => `<li>${n(e)}</li>`).join("");
		let { min: t, max: r, median: i } = this.market, a = (e) => `${((e - t) / (r - t) * 100).toFixed(2)}%`, o = this.query(".range");
		o.style.setProperty("--_from", a(this.salary.min)), o.style.setProperty("--_to", a(this.salary.max)), o.style.setProperty("--_median", a(i)), this.query(".band-text").textContent = `${f(this.salary.min, this.currency)} – ${f(this.salary.max, this.currency)}`, this.query(".median-text").textContent = `Market median ${f(i, this.currency)}`, this.query(".lo").textContent = f(t, this.currency), this.query(".hi").textContent = f(r, this.currency);
	}
	#r(e) {
		let t = this.query(`.stage.${this.#e}`), n = this.query(`.stage.${e}`), r = this.offsetHeight;
		t.hidden = !0, n.hidden = !1, this.#e = e, this.dataset.stage = e, i.matches || (this.animate([{ height: `${r}px` }, { height: `${this.offsetHeight}px` }], {
			duration: 300,
			easing: d
		}), n.animate([{
			opacity: 0,
			translate: "0 6px"
		}, {
			opacity: 1,
			translate: "0 0"
		}], {
			duration: 260,
			delay: 60,
			easing: d,
			fill: "backwards"
		})), e === "apply" && this.query(".applicant").focus(), e === "listing" && this.query(".quick").focus();
	}
	#i(e) {
		if (!e) return;
		this.#t = e;
		let t = this.query(".drop");
		t.toggleAttribute("data-file", !0), t.querySelector(".drop-icon").innerHTML = r(a, 18), t.querySelector(".drop-text").textContent = e.name, t.querySelector(".drop-note").textContent = `${Math.max(1, Math.round(e.size / 1024))} KB · click to replace`;
	}
	#a() {
		let e = this.query(".applicant"), t = this.query(".email");
		if (!e.reportValidity() || !t.reportValidity()) return;
		this.#r("applied");
		let n = e.value.trim().split(" ")[0];
		this.query(".applied-text").textContent = `Thanks, ${n}. ${this.company} usually replies within a week.`, this.shadowRoot.querySelectorAll(".track li").forEach((e, t) => e.dataset.state = t === 0 ? "done" : t === 1 ? "next" : "pending");
		let r = this.query(".undo");
		r.hidden = !1, clearTimeout(this.#n), this.#n = setTimeout(() => r.hidden = !0, u), this.emit("apply", {
			name: e.value,
			email: t.value,
			file: this.#t
		});
	}
	#o() {
		clearTimeout(this.#n), this.#r("apply"), this.emit("withdraw");
	}
};
//#endregion
//#region src/components/job-listing-card/index.js
t("job-listing-card", p);
//#endregion
export { p as t };
