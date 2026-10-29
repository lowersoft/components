import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./dom-Dlk1FlsZ.js";
import { t as n } from "./icons-HWomdoMw.js";
import { t as r } from "./icons-Dv1KN71n.js";
import { n as i, t as a } from "./modal-DvPYHqbK.js";
//#region src/components/newsletter-dialog/newsletter-dialog.scss?inline
var o = ".modal{--_width:32rem}.latest{border:1px solid var(--_line);border-radius:1rem;margin-top:1.5rem;padding:1.25rem}.latest-meta,.latest-time{color:var(--_muted)}.latest-title{font-size:var(--lw-text-lg);margin-top:.75rem;font-weight:500}.latest-excerpt{font-size:var(--lw-text-md);color:var(--_muted);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin-top:.375rem;line-height:1.5;display:-webkit-box;overflow:hidden}.latest-time{margin-top:.75rem}.form{margin-top:1.5rem}.form[hidden]{display:none}.label{font-size:var(--lw-text-md);margin-bottom:.625rem;font-weight:500}.often{grid-template-columns:1fr 1fr;gap:.5rem;display:grid}.option{border:1px solid var(--_line);text-align:left;cursor:pointer;background:0 0;border-radius:.875rem;gap:.375rem;padding:.875rem 1rem;display:grid}.option[aria-checked=true]{border-color:var(--lw-color-foreground);box-shadow:0 0 0 1px var(--lw-color-foreground)}.option-label{font-size:var(--lw-text-md);font-weight:500}.option-detail{color:var(--_muted)}.row{align-items:flex-start;gap:.5rem;margin-top:1rem;display:flex}.row .email{flex:1;min-width:0}.row .email::part(label){clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.done{border:1px solid var(--_line);font-size:var(--lw-text-md);border-radius:1rem;align-items:center;gap:.75rem;margin-top:1.5rem;padding:1rem;display:flex}.done[hidden]{display:none}.done-mark{background:var(--lw-color-accent);width:2rem;height:2rem;color:var(--lw-color-background);border-radius:50%;flex:none;place-items:center;display:grid}", s = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, c = {
	number: 42,
	date: "Oct 9",
	title: "Designing for the second run",
	excerpt: "Most tools are tuned for the first launch. This week: caches that survive restarts, builds that pick up where they stopped, and why incremental beats fast.",
	minutes: 6
}, l = [{
	id: "every",
	label: "Every issue",
	detail: "2 emails a month"
}, {
	id: "monthly",
	label: "Monthly digest",
	detail: "1 email a month"
}], u = class extends a {
	static styles = [
		i,
		n,
		o
	];
	static props = {
		...a.props,
		name: { default: "The Lower Dispatch" },
		description: { default: "One short read on building software that starts fast and stays fast. Every other Thursday." },
		latest: {
			type: Object,
			default: c
		},
		frequencies: {
			type: Object,
			default: l
		},
		frequency: {
			default: "every",
			reflect: !0
		}
	};
	renderBody() {
		return `<div class="body"><h2 class="title" id="modal-title"></h2><p class="lead description"></p>
<article class="latest"><p class="latest-meta"></p><h3 class="latest-title"></h3><p class="latest-excerpt"></p><p class="latest-time"></p></article>
<form class="form" novalidate><p class="label" id="often-label">How often</p><div class="often" role="radiogroup" aria-labelledby="often-label"></div>
<div class="row"><lw-text-input class="email" type="email" label="Email" placeholder="you@company.com" autocomplete="email"></lw-text-input><lw-button class="subscribe" type="submit">Subscribe</lw-button></div></form>
<div class="done" role="status" hidden><span class="done-mark">${r}</span><p class="done-text"></p></div></div>`;
	}
	connected() {
		super.connected();
		let e = { signal: this.signal }, t = this.query(".often");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".option");
			t && (this.frequency = t.dataset.id);
		}, e), t.addEventListener("keydown", (e) => {
			let n = {
				ArrowRight: 1,
				ArrowDown: 1,
				ArrowLeft: -1,
				ArrowUp: -1
			}[e.key];
			if (!n) return;
			e.preventDefault();
			let r = this.frequencies.findIndex((e) => e.id === this.frequency);
			this.frequency = this.frequencies[(r + n + this.frequencies.length) % this.frequencies.length].id, t.querySelector(`[data-id="${CSS.escape(this.frequency)}"]`).focus();
		}, e), this.query(".form").addEventListener("submit", (e) => {
			e.preventDefault(), this.#e();
		}, e), this.query(".email").addEventListener("keydown", (e) => e.key === "Enter" && (e.preventDefault(), this.#e()), e);
	}
	updated(e) {
		super.updated(e), this.query("#modal-title").textContent = this.name ?? "", this.query(".description").textContent = this.description ?? "";
		let n = this.latest ?? {};
		this.query(".latest-meta").textContent = `Latest · No. ${n.number} · ${n.date}`, this.query(".latest-title").textContent = n.title ?? "", this.query(".latest-excerpt").textContent = n.excerpt ?? "", this.query(".latest-time").textContent = `${n.minutes} min read`, e.has("frequencies") && (this.query(".often").innerHTML = this.frequencies.map((e) => `<button class="option" type="button" role="radio" data-id="${t(e.id)}"><span class="option-label">${t(e.label)}</span><span class="option-detail">${t(e.detail)}</span></button>`).join(""));
		for (let e of this.shadowRoot.querySelectorAll(".option")) {
			let t = e.dataset.id === this.frequency;
			e.ariaChecked = String(t), e.tabIndex = t ? 0 : -1;
		}
	}
	async #e() {
		let e = this.query(".email"), t = (e.value ?? "").trim();
		if (!s.test(t)) {
			e.error = t ? "That address looks incomplete." : "Enter your email to subscribe.", e.focus();
			return;
		}
		e.error = "";
		let n = this.query(".subscribe");
		n.loading = !0;
		try {
			await this.subscribe?.({
				email: t,
				frequency: this.frequency
			});
		} catch (t) {
			e.error = t?.message || "That did not go through. Try again.";
			return;
		} finally {
			n.loading = !1;
		}
		let r = this.frequencies.find((e) => e.id === this.frequency);
		this.query(".form").hidden = !0, this.query(".done").hidden = !1, this.query(".done-text").textContent = `You're in. ${r?.label ?? "The next issue"} goes to ${t}.`, this.emit("subscribe", {
			email: t,
			frequency: this.frequency
		});
	}
};
//#endregion
//#region src/components/newsletter-dialog/index.js
e("newsletter-dialog", u);
//#endregion
export { u as t };
