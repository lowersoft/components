import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./dom-Dlk1FlsZ.js";
import { t as n } from "./icons-HWomdoMw.js";
import { t as r } from "./icons-Dv1KN71n.js";
import { n as i, t as a } from "./modal-DvPYHqbK.js";
//#region src/components/feedback-dialog/feedback-dialog.scss?inline
var o = ".modal{--_width:34rem}.scale{grid-template-columns:repeat(11,minmax(0,1fr));gap:.375rem;margin-top:1.5rem;display:grid}.score{border-radius:var(--lw-radius-md);background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent);height:2.75rem;font-size:var(--lw-text-md);font-variant-numeric:tabular-nums;cursor:pointer;border:1px solid #0000;padding:0}@media (prefers-reduced-motion:no-preference){.score{transition:background-color .15s ease-out,translate .15s ease-out}}.score:hover{background:color-mix(in oklab, var(--lw-color-foreground) 12%, transparent);translate:0 -1px}.score[aria-checked=true]{background:var(--lw-color-foreground);color:var(--lw-color-background)}.ends{color:var(--_muted);justify-content:space-between;margin-top:.75rem;display:flex}.follow{border:1px dashed var(--_line);border-radius:1rem;min-height:12rem;margin-top:1.5rem;padding:1.25rem;display:grid}.follow[data-picked]{border-style:solid}.waiting{font-size:var(--lw-text-md);color:var(--_muted);place-self:center}.asked{gap:.875rem;display:grid}.asked[hidden]{display:none}@media (prefers-reduced-motion:no-preference){.asked{animation:.3s ease-out rise}}@keyframes rise{0%{opacity:0;translate:0 .375rem}}.question{font-size:var(--lw-text-md);font-weight:500}.chips{flex-wrap:wrap;gap:.375rem;display:flex}.chip{border:1px solid var(--_line);border-radius:var(--lw-radius-full);cursor:pointer;background:0 0;padding:.375rem .75rem}.chip[aria-pressed=true]{border-color:var(--lw-color-foreground);background:var(--lw-color-foreground);color:var(--lw-color-background)}.comment{box-sizing:border-box;border:1px solid var(--_line);border-radius:var(--lw-radius-lg);resize:none;background:0 0;width:100%;padding:.625rem .75rem;line-height:1.5}.comment::placeholder{color:var(--_muted)}.send-row{justify-content:flex-end;display:flex}.thanks{font-size:var(--lw-text-md);place-self:center;justify-items:center;gap:.75rem;display:grid}.thanks[hidden]{display:none}.thanks-mark{background:var(--lw-color-accent);width:2.5rem;height:2.5rem;color:var(--lw-color-background);border-radius:50%;place-items:center;display:grid}", s = [
	{
		max: 6,
		kind: "detractor",
		question: "What's the one thing we should fix first?",
		chips: [
			"Build times",
			"Docs",
			"Crash reports",
			"Pricing"
		]
	},
	{
		max: 8,
		kind: "passive",
		question: "What would make it a 10?",
		chips: [
			"More targets",
			"Faster profiler",
			"Better docs",
			"Integrations"
		]
	},
	{
		max: 10,
		kind: "promoter",
		question: "What do you like most?",
		chips: [
			"Binary size",
			"Speed",
			"The profiler",
			"Support"
		]
	}
], c = class extends a {
	static styles = [
		i,
		n,
		o
	];
	static props = {
		...a.props,
		product: { default: "LowerSoft" },
		score: { type: Number }
	};
	#e = /* @__PURE__ */ new Set();
	#t = 0;
	renderBody() {
		return `<div class="body"><h2 class="title" id="modal-title"></h2><p class="lead">Two questions, about 20 seconds.</p>
<div class="scale" role="radiogroup" aria-labelledby="modal-title">${Array.from({ length: 11 }, (e, t) => `<button class="score" type="button" role="radio" data-score="${t}">${t}</button>`).join("")}</div><p class="ends"><span>Not likely</span><span>Very likely</span></p>
<div class="follow"><p class="waiting">Pick a score and we'll ask one more thing</p><div class="asked" hidden><p class="question" id="follow-question"></p><div class="chips" role="group" aria-labelledby="follow-question"></div><textarea class="comment" rows="3" placeholder="Anything else? (optional)" aria-label="Comment"></textarea><div class="send-row"><lw-button class="send">Send</lw-button></div></div>
<div class="thanks" hidden><span class="thanks-mark">${r}</span><p>Thank you. We read every one.</p></div></div></div>`;
	}
	connected() {
		super.connected();
		let e = { signal: this.signal }, t = this.query(".scale");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".score");
			t && (this.score = Number(t.dataset.score));
		}, e), t.addEventListener("keydown", (e) => {
			let n = {
				ArrowRight: 1,
				ArrowUp: 1,
				ArrowLeft: -1,
				ArrowDown: -1
			}[e.key];
			n && (e.preventDefault(), this.score = Math.min(10, Math.max(0, (this.score ?? 5) + (this.score == null ? 0 : n))), t.querySelector(`[data-score="${this.score}"]`).focus());
		}, e), this.dialog.addEventListener("keydown", (e) => {
			if (!/^\d$/.test(e.key) || e.target.closest?.("textarea")) return;
			let t = Number(e.key);
			this.score = this.score === 1 && t === 0 && this.#t > Date.now() - 600 ? 10 : t, this.#t = Date.now(), this.query(`.score[data-score="${this.score}"]`).focus();
		}, e), this.query(".chips").addEventListener("click", (e) => {
			let t = e.target.closest(".chip");
			if (!t) return;
			let n = t.dataset.reason;
			this.#e.has(n) ? this.#e.delete(n) : this.#e.add(n), t.ariaPressed = String(this.#e.has(n));
		}, e), this.query(".send").addEventListener("click", () => this.#r(), e);
	}
	opened() {
		requestAnimationFrame(() => this.query(".score")?.focus());
	}
	updated(e) {
		super.updated(e), this.query("#modal-title").textContent = `How likely are you to recommend ${this.product} to a colleague?`;
		let n = this.score != null && !Number.isNaN(this.score);
		for (let e of this.shadowRoot.querySelectorAll(".score")) {
			let t = n && Number(e.dataset.score) === this.score;
			e.ariaChecked = String(t), e.tabIndex = t || !n && e.dataset.score === "0" ? 0 : -1;
		}
		if (this.query(".follow").toggleAttribute("data-picked", n), this.query(".waiting").hidden = n, this.query(".asked").hidden = !n, !n || !e.has("score")) return;
		let r = this.#n;
		this.query(".asked").dataset.kind !== r.kind && (this.query(".asked").dataset.kind = r.kind, this.#e.clear(), this.query(".question").textContent = r.question, this.query(".chips").innerHTML = r.chips.map((e) => `<button class="chip" type="button" aria-pressed="false" data-reason="${t(e)}">${t(e)}</button>`).join(""));
	}
	get #n() {
		return s.find((e) => this.score <= e.max);
	}
	#r() {
		let e = {
			score: this.score,
			kind: this.#n.kind,
			reasons: [...this.#e],
			comment: this.query(".comment").value.trim()
		};
		this.query(".asked").hidden = !0, this.query(".thanks").hidden = !1, this.emit("feedback", e), setTimeout(() => this.hide("sent"), 1200);
	}
};
//#endregion
//#region src/components/feedback-dialog/index.js
e("feedback-dialog", c);
//#endregion
export { c as t };
