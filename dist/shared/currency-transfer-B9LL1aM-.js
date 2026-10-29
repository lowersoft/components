import { n as e, t } from "./core-WcEz9YgG.js";
import { r as n } from "./icons-Dv1KN71n.js";
import { n as r } from "./motion-CFWhFfc_.js";
import { n as i, t as a } from "./rolling-VjfpUD4B.js";
import { t as o } from "./clipboard-BCkfa02P.js";
import { Dt as s, b as c, d as l, ot as u } from "./lucide-BVbUPHVq.js";
//#region src/components/currency-transfer/currency-transfer.scss?inline
var d = ":host{--_ease:cubic-bezier(.23, 1, .32, 1);--_rail:.35s;box-sizing:border-box;background:var(--lw-color-background);width:24rem;max-width:100%;box-shadow:0 0 0 1px var(--lw-color-border), 0 1px 2px #0000000a, 0 8px 24px -12px #0000001f;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);border-radius:1rem;padding:1.25rem;display:block}p{margin:0}.announce,.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.who{align-items:center;gap:.75rem;display:flex}.initials{background:var(--lw-color-muted);width:2.25rem;height:2.25rem;font-size:var(--lw-text-xs);border-radius:50%;flex:none;place-items:center;font-weight:500;display:grid}.names{flex:1;min-width:0;line-height:1.25}.names p{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.recipient{font-size:var(--lw-text-sm);font-weight:500}.account{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}.pill{border-radius:var(--lw-radius-full);background:var(--lw-color-muted);height:1.5rem;color:var(--lw-color-muted-foreground);flex:none;align-items:center;padding-inline:.5rem;font-size:11px;font-weight:500;transition:background-color .2s ease-out,color .2s ease-out;display:inline-grid}.pill[data-status=completed]{color:var(--lightningcss-light,#047857)var(--lightningcss-dark,#6ee7b7);background:#10b9811f;background:lab(66.6921% -50.6678 17.0591/.12)}.pill[data-status=failed]{color:var(--lightningcss-light,#b91c1c)var(--lightningcss-dark,#fca5a5);background:#ef44441f;background:lab(55.7852% 65.6164 40.7976/.12)}.pill span{text-align:center;grid-area:1/1;transition:opacity .2s ease-out,filter .2s ease-out}.pill span[aria-hidden=true]{opacity:0;filter:blur(2px)}.amount{margin-top:1.5rem}.big{letter-spacing:-.025em;font-size:2.25rem;font-weight:600}.symbol{display:inline-grid}.symbol span{text-align:right;transition:opacity .2s var(--_ease), filter .2s var(--_ease);grid-area:1/1}.symbol[data-to] .from,.symbol:not([data-to]) .to{opacity:0;filter:blur(3px)}@media (prefers-reduced-motion:no-preference){.amount .reel{transition:translate .55s var(--_ease) calc(var(--_order,0) * 30ms)}}.sums{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);margin-top:.25rem}.steps{margin:1.5rem 0 0;padding:0;list-style:none}.steps li{gap:.75rem;display:flex}.track{flex-direction:column;align-items:center;display:flex}.node{box-sizing:border-box;border:1.5px solid var(--lw-color-border);border-radius:50%;flex:none;place-items:center;width:1.25rem;height:1.25rem;transition:background-color .2s ease-out,border-color .2s ease-out;display:grid;position:relative}[data-state=done] .node{border-color:var(--lw-color-primary);background:var(--lw-color-primary);color:var(--lw-color-primary-foreground)}[data-state=failed] .node{color:#fff;background:#ef4444;border-color:#ef4444}.node>svg{width:.75rem;height:.75rem}.node path{fill:none;stroke:currentColor;stroke-width:1.75px;stroke-linecap:round;stroke-linejoin:round}[data-state=done] .node path{stroke-dasharray:1}@media (prefers-reduced-motion:no-preference){[data-state=done] .node path{animation:draw .3s var(--_ease) both}}.spinner{position:absolute;inset:-1.5px}@media (prefers-reduced-motion:no-preference){.spinner{animation:blur-in .2s ease-out calc(var(--_rail) - .1s) both}}.spinner svg{width:100%;height:100%;color:var(--lw-color-foreground)}@media (prefers-reduced-motion:no-preference){.spinner svg{animation:.75s linear infinite spin}}.spinner path{stroke-width:1.5px}.rail{border-radius:var(--lw-radius-full);background:var(--lw-color-border);flex:1;width:1.5px;margin-block:.25rem;position:relative;overflow:hidden}.rail span{background:var(--lw-color-primary);transform-origin:top;position:absolute;inset:0;scale:1 0}@media (prefers-reduced-motion:no-preference){.rail span{transition:scale var(--_rail) cubic-bezier(.77, 0, .175, 1)}}[data-state=done] .rail span{scale:1}.step{flex:1;min-width:0}li:not(:last-child) .step{padding-bottom:1rem}.title{font-size:var(--lw-text-sm);line-height:1.25rem;transition:color .2s ease-out}[data-state=pending] .title{color:var(--lw-color-muted-foreground)}[data-state=failed] .title{color:var(--lightningcss-light,#dc2626)var(--lightningcss-dark,#f87171)}.detail{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);margin-top:.125rem}[data-state=pending] .detail{opacity:.75}.retry{border-radius:var(--lw-radius-md);background:var(--lw-color-primary);height:1.75rem;font:500 var(--lw-text-xs) var(--lw-font-sans);color:var(--lw-color-primary-foreground);cursor:pointer;border:0;align-items:center;gap:.375rem;margin-top:.5rem;padding-inline:.625rem;display:inline-flex}@media (prefers-reduced-motion:no-preference){.retry{animation:.2s ease-out .15s both blur-in}}.retry:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.footer{border-top:1px solid var(--lw-color-muted);font-size:var(--lw-text-xs);justify-content:space-between;align-items:center;margin-top:1.25rem;padding-top:1rem;display:flex}.copy{border-radius:var(--lw-radius-sm);font:var(--lw-text-xs) var(--lw-font-mono);color:var(--lw-color-muted-foreground);cursor:pointer;transition:background-color var(--lw-duration-fast) ease-out, color var(--lw-duration-fast) ease-out;background:0 0;border:0;align-items:center;gap:.375rem;margin:-.25rem -.375rem;padding:.25rem .375rem;display:inline-flex}.copy:hover{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.copy:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.icons{display:grid}.icons svg{transition:opacity var(--lw-duration-fast) ease-out, filter var(--lw-duration-fast) ease-out;grid-area:1/1}.icons svg:last-child{color:var(--lightningcss-light,#059669)var(--lightningcss-dark,#34d399);opacity:0;filter:blur(2px)}.icons svg:first-child{opacity:.6}[data-copied] .icons svg:first-child{opacity:0;filter:blur(2px)}[data-copied] .icons svg:last-child{opacity:1;filter:none}.locked{color:var(--lw-color-muted-foreground)}@keyframes draw{0%{stroke-dashoffset:1px}to{stroke-dashoffset:0}}@keyframes blur-in{0%{opacity:0;filter:blur(2px)}}@keyframes spin{to{rotate:1turn}}", f = {
	amount: 500,
	currency: "USD",
	symbol: "$",
	bank: "Chase",
	last4: "4589"
}, p = {
	amount: 460,
	currency: "EUR",
	symbol: "€",
	bank: "Deutsche Bank",
	last4: "7823",
	name: "Lena Fischer"
}, m = 1100, h = 1, g = 3, _ = 1500, v = /[^\p{L}]+/u, y = {
	processing: "In progress",
	completed: "Arrived",
	failed: "Failed"
}, b = (e, t, n) => new Intl.NumberFormat(t, {
	minimumFractionDigits: n,
	maximumFractionDigits: n
}).format(e), x = (e, t) => {
	if (e.symbol) return e.symbol;
	try {
		return new Intl.NumberFormat(t, {
			style: "currency",
			currency: e.currency,
			currencyDisplay: "narrowSymbol"
		}).formatToParts(0).find(({ type: e }) => e === "currency")?.value ?? e.currency.charAt(0);
	} catch {
		return e.currency.charAt(0);
	}
}, S = (e) => e.split(v).filter(Boolean).slice(0, 2).map((e) => e.charAt(0).toUpperCase()).join(""), C = (e) => `${e.bank}${e.last4 ? ` ••${e.last4}` : ""}`, w = class extends e {
	static styles = [i, d];
	static props = {
		from: {
			type: Object,
			default: f
		},
		to: {
			type: Object,
			default: p
		},
		rate: {
			type: Number,
			default: .92
		},
		txn: { default: "TXN-DAB3UL494" },
		timestamp: { default: "10:45 AM" },
		status: { default: null },
		locale: { default: "en-US" },
		retry: { type: Boolean }
	};
	#e = h;
	#t = "processing";
	#n = null;
	#r = 0;
	#i = 0;
	render() {
		let e = Array.from({ length: 4 }, (e, t) => `<li data-state="pending"><div class="track"><span class="node"></span>${t < 3 ? "<span class=\"rail\"><span></span></span>" : ""}</div><div class="step"><p class="title"></p><p class="detail"></p></div></li>`).join("");
		return `<output class="announce" aria-live="polite"></output>
<div class="who"><span class="initials" aria-hidden="true"></span><div class="names"><p class="recipient"></p><p class="account"></p></div><span class="pill">${Object.entries(y).map(([e, t]) => `<span data-key="${e}">${t}</span>`).join("")}</span></div>
<div class="amount"><p class="big"><span class="visually-hidden spoken"></span><span class="symbol" aria-hidden="true"><span class="from"></span><span class="to"></span></span><span class="rolling" aria-hidden="true"></span></p><p class="sums"></p></div>
<ol class="steps">${e}</ol>
<div class="footer"><button class="copy" type="button"><span class="ref"></span><span class="icons" aria-hidden="true">${n(c, 12)}${n(l, 12, 3)}</span></button><span class="locked"></span></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".copy").addEventListener("click", () => this.#l(), e), this.query(".steps").addEventListener("click", (e) => e.target.closest(".retry") && this.emit("retry"), e), this.signal.addEventListener("abort", () => {
			clearTimeout(this.#r), clearTimeout(this.#i);
		});
	}
	updated() {
		this.#s();
	}
	get #a() {
		return this.status ?? this.#t;
	}
	#o() {
		clearTimeout(this.#r);
		let e = this.#a;
		this.#n !== e && (this.#n = e, e === "processing" && (this.#e = h)), e === "processing" && (this.#e < g ? this.#r = setTimeout(() => {
			this.#e += 1, this.#s();
		}, m) : this.status === null && (this.#r = setTimeout(() => {
			this.#t = "completed", this.#s();
		}, m)));
	}
	#s() {
		this.#o();
		let { from: e, to: t, locale: n } = this, r = this.#a, i = r === "completed" ? 4 : this.#e, o = r === "completed", s = t.name ?? t.bank, c = `1 ${e.currency} = ${b(this.rate, n, 4)} ${t.currency}`, l = [
			["Payment received", `From ${C(e)}`],
			[`Converted to ${t.currency}`, c],
			[`Sent to ${t.bank}`, C(t)],
			o ? ["Arrived", `${s} can use it now`] : ["Arriving", "Usually within a minute"]
		];
		this.query(".initials").textContent = S(s), this.query(".recipient").textContent = s, this.query(".account").textContent = C(t);
		let u = this.query(".pill");
		u.dataset.status = r;
		for (let e of u.children) e.ariaHidden = String(e.dataset.key !== r);
		let d = i >= 2, f = d ? t : e, p = this.query(".symbol");
		p.querySelector(".from").textContent = x(e, n), p.querySelector(".to").textContent = x(t, n), p.toggleAttribute("data-to", d), this.query(".spoken").textContent = `${b(f.amount, n, 2)} ${f.currency}`;
		let m = this.query(".amount .rolling");
		a(m, b(f.amount, n, 2)), [...m.children].reverse().forEach((e, t) => e.style.setProperty("--_order", t)), this.query(".sums").textContent = `${b(e.amount, n, 2)} ${e.currency} sent · ${b(t.amount, n, 2)} ${t.currency} received`, this.shadowRoot.querySelectorAll(".steps li").forEach((t, n) => {
			let a = n < i ? "done" : n === i ? r === "failed" ? "failed" : "active" : "pending", o = a === "failed";
			this.#c(t, a, o ? "Couldn't complete" : l[n][0], o ? `Refunded to ${C(e)}` : l[n][1], o && this.retry);
		});
		let h = l[Math.min(i, 3)][0];
		o && (h = `Transfer arrived. ${b(t.amount, n, 2)} ${t.currency} to ${s}.`), r === "failed" && (h = `Transfer failed. Refunded to ${C(e)}.`), this.query(".announce").textContent = h, this.query(".ref").textContent = this.txn, this.query(".copy").hasAttribute("data-copied") || (this.query(".copy").ariaLabel = `Copy reference ${this.txn}`), this.query(".locked").textContent = `Rate locked ${this.timestamp}`;
	}
	#c(e, t, i, a, o) {
		if (e.dataset.state !== t) {
			e.dataset.state = t;
			let r = e.querySelector(".node");
			r.innerHTML = t === "done" ? "<svg viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M2.5 6.25 5 8.5l4.5-5\" pathLength=\"1\"/></svg>" : t === "failed" ? n(s, 12, 3) : t === "active" ? "<span class=\"spinner\"><svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M10 1.25A8.75 8.75 0 0 1 18.75 10\"/></svg></span>" : "";
		}
		for (let [t, n] of [[e.querySelector(".title"), i], [e.querySelector(".detail"), a]]) t.textContent !== n && (t.textContent = n, !r.matches && e.parentElement.dataset.painted && t.animate([{
			opacity: 0,
			filter: "blur(2px)"
		}, {
			opacity: 1,
			filter: "blur(0px)"
		}], {
			duration: 200,
			easing: "ease-out"
		}));
		e.parentElement.dataset.painted = "";
		let c = e.querySelector(".retry");
		o && !c && e.querySelector(".step").insertAdjacentHTML("beforeend", `<button class="retry" type="button">${n(u, 12)}Retry</button>`), o || c?.remove();
	}
	async #l() {
		let e = this.query(".copy");
		try {
			await o(this.txn);
		} catch {
			return;
		}
		e.toggleAttribute("data-copied", !0), e.ariaLabel = "Reference copied", clearTimeout(this.#i), this.#i = setTimeout(() => {
			e.removeAttribute("data-copied"), e.ariaLabel = `Copy reference ${this.txn}`;
		}, _);
	}
};
//#endregion
//#region src/components/currency-transfer/index.js
t("currency-transfer", w);
//#endregion
export { w as t };
