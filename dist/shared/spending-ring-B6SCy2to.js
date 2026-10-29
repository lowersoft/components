import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { n as r, t as i } from "./motion-CFWhFfc_.js";
//#region src/components/spending-ring/spending-ring.scss?inline
var a = ":host{box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:24rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);border-radius:1.5rem;padding:1.25rem;display:block}p{margin:0}.top{font-size:var(--lw-text-sm);justify-content:space-between;align-items:baseline;gap:1rem;display:flex}.heading{color:var(--lw-color-muted-foreground)}.total{font-variant-numeric:tabular-nums;font-weight:500}.dial{aspect-ratio:1;cursor:grab;touch-action:none;-webkit-user-select:none;user-select:none;border-radius:50%;outline:none;width:100%;max-width:240px;margin:.75rem auto 0;position:relative}.dial[data-spinning]{cursor:grabbing}.dial:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:4px}.dial svg{width:100%;height:100%;position:absolute;inset:0}.ring path{fill:none;stroke-width:22px;opacity:.45;transition:stroke-width .2s cubic-bezier(.23,1,.32,1),opacity .2s cubic-bezier(.23,1,.32,1)}.ring path[data-on]{stroke-width:30px;opacity:1}.marker{fill:var(--lw-color-foreground)}.readout{text-align:center;pointer-events:none;place-items:center;display:grid;position:absolute;inset:0}.what{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);justify-content:center;align-items:center;gap:.375rem;display:flex}.what .dot{width:.375rem;height:.375rem}.spent{font-variant-numeric:tabular-nums;letter-spacing:-.02em;margin-top:.125rem;font-size:1.5rem;font-weight:600}.share,.change{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);margin-top:.125rem}.change[data-trend=\"1\"]{color:var(--lightningcss-light,#e11d48)var(--lightningcss-dark,#fb7185)}.change[data-trend=\"-1\"]{color:var(--lightningcss-light,#059669)var(--lightningcss-dark,#34d399)}.dot{border-radius:50%;flex:none;width:.5rem;height:.5rem}.legend{grid-template-columns:1fr 1fr;gap:.25rem;margin:1rem 0 0;padding:0;list-style:none;display:grid}.legend button{border-radius:var(--lw-radius-md);width:100%;font:var(--lw-text-xs) var(--lw-font-sans);text-align:left;color:var(--lw-color-muted-foreground);cursor:pointer;transition:background-color var(--lw-duration-fast) ease-out, color var(--lw-duration-fast) ease-out;background:0 0;border:0;outline:none;align-items:center;gap:.5rem;padding:.375rem .5rem;display:flex}.legend button:hover,.legend button[aria-pressed=true]{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.legend button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.name{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.amount{font-variant-numeric:tabular-nums}", o = 240, s = o / 2, c = 90, l = 2.4, u = 11, d = .78, f = .2, p = 5, m = 1 / 240, h = [
	{
		name: "Build farm",
		amount: 1250,
		change: 0,
		color: "light-dark(#0ea5e9, #38bdf8)"
	},
	{
		name: "Storage",
		amount: 486.2,
		change: -6.1,
		color: "light-dark(#10b981, #34d399)"
	},
	{
		name: "Bandwidth",
		amount: 398.1,
		change: 22.4,
		color: "light-dark(#f43f5e, #fb7185)"
	},
	{
		name: "Symbol server",
		amount: 312.75,
		change: 12.8,
		color: "light-dark(#fbbf24, #fcd34d)"
	},
	{
		name: "CI runners",
		amount: 214.4,
		change: -3.5,
		color: "light-dark(#8b5cf6, #a78bfa)"
	},
	{
		name: "Licenses",
		amount: 86.97,
		change: 0,
		color: "light-dark(#a1a1aa, #71717a)"
	}
], g = (e) => ((e + 180) % 360 + 360) % 360 - 180, _ = (e) => {
	let t = e * Math.PI / 180;
	return [s + c * Math.sin(t), s - c * Math.cos(t)];
}, v = (e, t) => {
	let [n, r] = _(e), [i, a] = _(t);
	return `M${n.toFixed(2)} ${r.toFixed(2)} A${c} ${c} 0 ${+(t - e > 180)} 1 ${i.toFixed(2)} ${a.toFixed(2)}`;
}, y = (e, t) => {
	let n = (t % 360 + 360) % 360;
	return Math.max(0, e.findIndex((e) => n >= e.from && n < e.to));
}, b = class extends e {
	static styles = a;
	static props = {
		heading: { default: "October infrastructure" },
		categories: {
			type: Object,
			default: h
		},
		currency: { default: "USD" }
	};
	#e = 0;
	#t = [];
	#n = 0;
	#r = 0;
	#i = 0;
	#a = !1;
	#o = null;
	#s = i(m, {
		step: () => {
			this.#r += (-121 * (this.#n - this.#i) - 2 * d * u * this.#r) * m, this.#n += this.#r * m;
		},
		render: () => this.#g()
	});
	render() {
		return `<div class="top"><p class="heading"></p><p class="total"></p></div>
<div class="dial" role="slider" tabindex="0" aria-valuemin="1" aria-label="Spending by category. Use the arrow keys to turn the ring.">
  <svg viewBox="0 0 ${o} ${o}" aria-hidden="true"><g class="ring"></g><path class="marker" d="M115 2 L125 2 L${s} 8 Z"/></svg>
  <div class="readout"><div class="read"></div></div>
</div>
<ul class="legend"></ul>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".dial");
		t.addEventListener("pointerdown", (e) => this.#y(e), e), t.addEventListener("pointermove", (e) => this.#b(e), e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, (e) => this.#x(e), e);
		t.addEventListener("keydown", (e) => this.#S(e), e), this.query(".legend").addEventListener("click", (e) => {
			let t = e.target.closest("button");
			t && this.#_(Number(t.dataset.index));
		}, e), this.signal.addEventListener("abort", () => this.#s.stop());
	}
	updated(e) {
		e.has("categories") && this.#u(), this.query(".heading").textContent = this.heading ?? "", this.query(".total").textContent = this.#c.format(this.#l), this.#f(), this.#p();
	}
	get #c() {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: this.currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});
	}
	get #l() {
		return this.categories.reduce((e, { amount: t }) => e + t, 0);
	}
	#u() {
		let e = this.#l, t = 0;
		this.#t = this.categories.map(({ amount: n }) => {
			let r = e ? n / e * 360 : 360 / this.categories.length, i = {
				from: t,
				to: t + r,
				mid: t + r / 2
			};
			return t += r, i;
		}), this.query(".ring").innerHTML = this.#t.map((e, t) => `<path d="${v(e.from + l / 2, e.to - l / 2)}" style="stroke: ${n(this.categories[t].color ?? "currentColor")}"/>`).join(""), this.query(".legend").innerHTML = this.categories.map((e, t) => `<li><button type="button" data-index="${t}"><span class="dot" style="background: ${n(e.color ?? "currentColor")}"></span><span class="name">${n(e.name)}</span><span class="amount"></span></button></li>`).join(""), this.#e = Math.min(this.#e, this.#t.length - 1), this.#s.stop(), this.#n = this.#i = -(this.#t[this.#e]?.mid ?? 0), this.#r = 0, this.#d();
	}
	#d() {
		this.query(".ring").setAttribute("transform", `rotate(${this.#n.toFixed(3)} ${s} ${s})`);
	}
	#f() {
		let e = this.#c;
		this.shadowRoot.querySelectorAll(".legend button").forEach((t, n) => {
			t.ariaPressed = String(n === this.#e), t.querySelector(".amount").textContent = e.format(Math.round(this.categories[n].amount)).replace(".00", "");
		}), this.shadowRoot.querySelectorAll(".ring path").forEach((e, t) => e.toggleAttribute("data-on", t === this.#e));
	}
	#p() {
		let e = this.categories[this.#e];
		if (!e) return;
		let t = this.#c, i = this.#l ? e.amount / this.#l * 100 : 0, a = e.change ?? 0, o = this.query(".read"), s = a === 0 ? "Same as last month" : `${a > 0 ? "▲" : "▼"} ${Math.abs(a).toFixed(1)}% vs last month`, c = `<p class="what"><span class="dot" style="background: ${n(e.color ?? "currentColor")}"></span>${n(e.name)}</p><p class="spent">${t.format(e.amount)}</p><p class="share">${i.toFixed(0)}% of total</p><p class="change" data-trend="${Math.sign(a)}">${s}</p>`;
		if (o.innerHTML !== c) {
			let t = o.dataset.name !== e.name;
			o.innerHTML = c, o.dataset.name = e.name, t && !r.matches && o.animate([{
				opacity: 0,
				translate: "0 4px"
			}, {
				opacity: 1,
				translate: "0 0"
			}], {
				duration: 200,
				easing: "ease-out"
			});
		}
		let l = this.query(".dial");
		l.ariaValueMax = String(this.categories.length), l.ariaValueNow = String(this.#e + 1), l.ariaValueText = `${e.name}, ${t.format(e.amount)}`;
	}
	#m(e) {
		e !== this.#e && (this.#e = e, this.#f(), this.#p(), this.emit("change", {
			index: e,
			category: this.categories[e]
		}));
	}
	#h() {
		this.#m(y(this.#t, -this.#n));
	}
	#g() {
		let e = Math.abs(this.#n - this.#i) < .05 && Math.abs(this.#r) < 2;
		return e && (this.#n = this.#i, this.#r = 0), this.#d(), this.#a && this.#h(), !e || (this.#a = !1, this.query(".dial").removeAttribute("data-spinning"), !1);
	}
	#_(e, t = this.#n, n = !1) {
		this.#i = t + g(-(this.#t[e]?.mid ?? 0) - t), this.#a = n, n || this.#m(e), r.matches ? (this.#n = this.#i, this.#r = 0, this.#a = !1, this.#d(), this.#h()) : (this.query(".dial").toggleAttribute("data-spinning", !0), this.#s.wake());
	}
	#v(e) {
		let t = this.query(".dial").getBoundingClientRect();
		return Math.atan2(e.clientX - t.left - t.width / 2, -(e.clientY - t.top - t.height / 2)) * 180 / Math.PI;
	}
	#y(e) {
		this.#o || e.pointerType === "mouse" && e.button !== 0 || (e.currentTarget.setPointerCapture?.(e.pointerId), this.#s.stop(), this.#r = 0, this.#o = {
			id: e.pointerId,
			angle: this.#v(e),
			time: e.timeStamp,
			moved: 0,
			x: e.clientX,
			y: e.clientY
		});
	}
	#b(e) {
		let t = this.#o;
		if (t?.id !== e.pointerId || (t.moved = Math.max(t.moved, Math.hypot(e.clientX - t.x, e.clientY - t.y)), t.moved < p)) return;
		let n = this.#v(e), r = g(n - t.angle), i = Math.max((e.timeStamp - t.time) / 1e3, m);
		this.#n += r, this.#r = this.#r * .6 + r / i * .4, Object.assign(t, {
			angle: n,
			time: e.timeStamp
		}), this.query(".dial").toggleAttribute("data-spinning", !0), this.#d(), this.#h();
	}
	#x(e) {
		let t = this.#o;
		if (t?.id !== e.pointerId) return;
		if (this.#o = null, t.moved < p) {
			let t = this.query(".dial").getBoundingClientRect();
			Math.hypot(e.clientX - t.left - t.width / 2, e.clientY - t.top - t.height / 2) > 68 / o * t.width && this.#_(y(this.#t, this.#v(e) - this.#n));
			return;
		}
		e.timeStamp - t.time > 80 && (this.#r = 0), this.#r = Math.max(-1440, Math.min(1440, this.#r));
		let n = this.#n + this.#r * f;
		this.#_(y(this.#t, -n), n, !0);
	}
	#S(e) {
		let t = this.categories.length, n = {
			ArrowRight: 1,
			ArrowDown: 1,
			ArrowLeft: -1,
			ArrowUp: -1
		}[e.key], r = null;
		n ? r = (this.#e + n + t) % t : e.key === "Home" ? r = 0 : e.key === "End" && (r = t - 1), r !== null && (e.preventDefault(), this.#_(r));
	}
};
//#endregion
//#region src/components/spending-ring/index.js
t("spending-ring", b);
//#endregion
export { b as t };
