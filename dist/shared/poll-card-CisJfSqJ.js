import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { d as a } from "./lucide-BVbUPHVq.js";
//#region src/components/poll-card/poll-card.scss?inline
var o = ":host{--_ease:cubic-bezier(.23, 1, .32, 1);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:22rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);border-radius:1.5rem;padding:1.25rem;display:block}p{margin:0}.question{font-size:var(--lw-text-md);font-weight:600}.options{gap:.5rem;margin:1rem 0 0;padding:0;list-style:none;display:grid}.options button{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-lg);width:100%;height:2.5rem;font:var(--lw-text-sm) var(--lw-font-sans);text-align:left;color:inherit;cursor:pointer;background:0 0;outline:none;align-items:center;gap:.5rem;padding:0 .875rem;transition:border-color .2s ease-out,background-color .2s ease-out;display:flex;position:relative;overflow:hidden}.options button:hover{background:var(--lw-color-muted)}.options button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}:host([data-voted]) .options button:hover{background:0 0}.options button[data-chosen]{border-color:var(--lw-color-foreground)}.fill{width:var(--_share,0%);background:var(--lw-color-muted);position:absolute;inset:0 auto 0 0}@media (prefers-reduced-motion:no-preference){.fill{transition:width .6s var(--_ease)}}[data-leading]>.fill{background:color-mix(in oklab, var(--lw-color-foreground) 12%, transparent)}.label{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;position:relative;overflow:hidden}[data-chosen]>.label{font-weight:500}.mark{opacity:0;transition:opacity .2s ease-out,scale .2s cubic-bezier(.34,1.56,.64,1);display:grid;position:relative;scale:.5}[data-chosen]>.mark{opacity:1;scale:1}.share{font-variant-numeric:tabular-nums;text-align:right;min-width:2.5rem;color:var(--lw-color-muted-foreground);opacity:0;transition:opacity .2s ease-out;position:relative}:host([data-voted]) .share{opacity:1}[data-leading] .share{color:var(--lw-color-foreground);font-weight:600}.foot{min-height:1.75rem;font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);justify-content:space-between;align-items:center;margin-top:.75rem;display:flex}.undo{border-radius:var(--lw-radius-full);background:var(--lw-color-muted);font:500 var(--lw-text-xs) var(--lw-font-sans);color:var(--lw-color-foreground);cursor:pointer;border:0;outline:none;padding:.25rem .625rem;position:relative;overflow:hidden}.undo[hidden]{display:none}.undo:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}@media (prefers-reduced-motion:no-preference){.undo{animation:pop .2s var(--_ease)}}.undo-bar{background:var(--lw-color-foreground);transform-origin:0;height:2px;position:absolute;inset:auto 0 0}.running .undo-bar{animation:drain var(--_undo) linear forwards}.undo-label{position:relative}@keyframes drain{to{scale:0 1}}@keyframes pop{0%{opacity:0;scale:.9}}", s = [
	{
		id: "tabs",
		label: "Tabs",
		votes: 412
	},
	{
		id: "spaces",
		label: "Spaces",
		votes: 538
	},
	{
		id: "both",
		label: "Whatever the formatter says",
		votes: 291
	}
], c = 5e3, l = 600, u = class extends e {
	static styles = o;
	static props = {
		question: { default: "Tabs or spaces?" },
		options: {
			type: Object,
			default: s
		},
		vote: { default: "" },
		note: { default: "2 days left" }
	};
	#e = 0;
	#t = !1;
	#n = 0;
	render() {
		return "<p class=\"question\"></p><ul class=\"options\" role=\"radiogroup\"></ul><div class=\"foot\"><span class=\"total\" aria-live=\"polite\"></span><button class=\"undo\" type=\"button\" hidden><span class=\"undo-bar\" aria-hidden=\"true\"></span><span class=\"undo-label\">Undo</span></button></div>";
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".options").addEventListener("click", (e) => {
			let t = e.target.closest("button");
			t && this.#o(t.dataset.id);
		}, e), this.query(".undo").addEventListener("click", () => this.#s(), e), this.signal.addEventListener("abort", () => {
			clearTimeout(this.#e), cancelAnimationFrame(this.#n);
		});
	}
	updated(e) {
		this.query(".question").textContent = this.question ?? "", this.query(".options").ariaLabel = this.question ?? "", e.has("options") && (this.query(".options").innerHTML = this.options.map((e) => `<li><button type="button" role="radio" data-id="${n(e.id)}"><span class="fill"></span><span class="label">${n(e.label)}</span><span class="mark">${r(a, 14)}</span><span class="share">0%</span></button></li>`).join("")), this.#t || this.#i(!1), this.#t = !1;
	}
	get #r() {
		return this.options.map((e) => e.votes + +(e.id === this.vote));
	}
	#i(e) {
		let t = !!this.vote, n = this.#r, r = n.reduce((e, t) => e + t, 0);
		this.toggleAttribute("data-voted", t);
		let i = n.map((e) => r ? e / r * 100 : 0);
		this.shadowRoot.querySelectorAll(".options button").forEach((e, r) => {
			let a = e.dataset.id === this.vote;
			e.ariaChecked = String(a), e.toggleAttribute("data-chosen", a), e.style.setProperty("--_share", t ? `${i[r]}%` : "0%"), e.toggleAttribute("data-leading", t && n[r] === Math.max(...n));
		}), this.#a(t ? i : i.map(() => 0), e), this.query(".total").textContent = `${r.toLocaleString("en-US")} votes${this.note ? ` · ${this.note}` : ""}`;
	}
	#a(e, t) {
		cancelAnimationFrame(this.#n);
		let n = [...this.shadowRoot.querySelectorAll(".share")], r = n.map((e) => Number.parseFloat(e.textContent) || 0), a = (t) => n.forEach((n, i) => n.textContent = `${Math.round(r[i] + (e[i] - r[i]) * t)}%`);
		if (!t || i.matches) {
			a(1);
			return;
		}
		let o = performance.now(), s = (e) => {
			let t = Math.min(1, (e - o) / l);
			a(1 - (1 - t) ** 3), t < 1 && (this.#n = requestAnimationFrame(s));
		};
		this.#n = requestAnimationFrame(s);
	}
	#o(e) {
		if (e === this.vote) return;
		this.#t = !0, this.vote = e, this.#i(!0), this.emit("vote", { option: this.options.find((t) => t.id === e) });
		let t = this.query(".undo");
		t.hidden = !1, t.style.setProperty("--_undo", `${c}ms`), t.classList.remove("running"), t.getBoundingClientRect(), t.classList.add("running"), clearTimeout(this.#e), this.#e = setTimeout(() => t.hidden = !0, c);
	}
	#s() {
		clearTimeout(this.#e), this.query(".undo").hidden = !0, this.#t = !0, this.vote = "", this.#i(!0), this.query(".options button")?.focus(), this.emit("undo");
	}
};
//#endregion
//#region src/components/poll-card/index.js
t("poll-card", u);
//#endregion
export { u as t };
