import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { n as r } from "./motion-CFWhFfc_.js";
import { n as i, t as a } from "./rolling-VjfpUD4B.js";
//#region src/components/metric-card/metric-card.scss?inline
var o = ":host{--_ease:cubic-bezier(.23, 1, .32, 1);--_note:var(--lw-metric-card-note,var(--lightningcss-light,#f97316)var(--lightningcss-dark,#fb923c));--_ink:var(--lw-color-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:28rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);-webkit-user-select:none;user-select:none;border-radius:1.5rem;padding:1.25rem;display:block}p{margin:0}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}button{font:inherit;color:inherit;cursor:pointer;background:0 0;border:0;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.top{justify-content:space-between;align-items:center;gap:1rem;display:flex}.label{font-size:var(--lw-text-sm);text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-muted-foreground);overflow:hidden}.segment{color:var(--lw-color-foreground)}.periods{border-radius:var(--lw-radius-full);background:var(--lw-color-muted);font-size:var(--lw-text-xs);flex:none;padding:2px;display:flex;position:relative}.periods button{border-radius:var(--lw-radius-full);font-variant-numeric:tabular-nums;width:2.5rem;color:var(--lw-color-muted-foreground);padding:.25rem 0;font-weight:500;transition:color .2s ease-out;position:relative}.periods button:hover,.periods button[aria-pressed=true]{color:var(--lw-color-foreground)}.pill{inset-block:2px;border-radius:var(--lw-radius-full);background:var(--lw-color-background);width:2.5rem;box-shadow:var(--lw-shadow-sm);position:absolute;left:2px}@media (prefers-reduced-motion:no-preference){.pill{transition:translate .2s var(--_ease)}}.value{letter-spacing:-.025em;margin-top:.75rem;font-size:2.25rem;font-weight:600}@media (prefers-reduced-motion:no-preference){.value .reel{transition:translate .38s var(--_ease)}}.change{min-height:1.25rem;font-size:var(--lw-text-sm);font-variant-numeric:tabular-nums;align-items:center;gap:.5rem;margin-top:.375rem;display:flex}.delta{color:var(--lightningcss-light,#059669)var(--lightningcss-dark,#34d399);flex:none;font-weight:500}.delta[data-down]{color:var(--lightningcss-light,#e11d48)var(--lightningcss-dark,#fb7185)}.caption{text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-muted-foreground);overflow:hidden}.note{color:var(--_note)}.clear{border-radius:var(--lw-radius-full);font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);transition:background-color var(--lw-duration-fast) ease-out, color var(--lw-duration-fast) ease-out;flex:none;margin-left:auto;padding:.125rem .5rem}.clear[hidden]{display:none}.clear:hover{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.chart{border-radius:var(--lw-radius-md);cursor:crosshair;touch-action:pan-y;outline:none;height:8rem;margin-top:1.25rem;position:relative}.chart:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:4px}.chart svg{width:100%;height:100%;position:absolute;inset:0;overflow:visible}.base{stroke:var(--lw-color-border)}.previous{fill:none;stroke:var(--lw-color-border);stroke-dasharray:3 4;stroke-width:1.25px}.area{fill:color-mix(in oklab, var(--_ink) 6%, transparent)}.dim,.line{fill:none;stroke-width:2px;stroke-linecap:round}.dim{stroke:color-mix(in oklab, var(--_ink) 25%, transparent)}.line{stroke:var(--_ink)}.pins,.marks{pointer-events:none;position:absolute;inset:0}.pin{border-left:1px dashed color-mix(in oklab, var(--_note) 30%, transparent);position:absolute;inset-block:0;translate:-50%}.pin:after{content:\"\";background:var(--_note);width:6px;height:6px;box-shadow:0 0 0 2px var(--lw-color-background);border-radius:50%;position:absolute;bottom:0;left:-3.5px;translate:0 50%}.edge,.guide{background:var(--lw-color-border);width:1px;position:absolute;inset-block:0}.edge{background:var(--lw-color-ring)}.dot,.twin,.end{border-radius:50%;position:absolute;translate:-50% -50%}.dot{background:var(--_ink);width:.625rem;height:.625rem;box-shadow:0 0 0 4px var(--lw-color-background)}.twin{box-sizing:border-box;border:1px solid var(--lw-color-ring);background:var(--lw-color-background);width:.5rem;height:.5rem}.end{background:var(--_ink);width:.5rem;height:.5rem;box-shadow:0 0 0 4px var(--lw-color-background);pointer-events:none;right:0;translate:50% -50%}@media (prefers-reduced-motion:no-preference){.end{transition:top .42s cubic-bezier(.65,0,.35,1),opacity .42s cubic-bezier(.65,0,.35,1)}}.end[data-hidden]{opacity:0}.axis{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);justify-content:space-between;margin-top:.5rem;display:flex}.legend{align-items:center;gap:.375rem;display:flex}.dash{border-top:1px dashed var(--lw-color-ring);width:.75rem}.breakdown{border-top:1px solid var(--lw-color-muted);margin-top:1rem;padding-top:1rem}.bar{gap:2px;height:.375rem;display:flex}.bar span{border-radius:var(--lw-radius-full);min-width:0}@media (prefers-reduced-motion:no-preference){.bar span{transition:flex-grow .3s var(--_ease), opacity .3s var(--_ease)}}.bar span[data-faded]{opacity:.25}[data-tone=\"0\"]{background:var(--_ink)}[data-tone=\"1\"]{background:var(--lw-color-muted-foreground)}[data-tone=\"2\"]{background:var(--lw-color-border)}[data-tone=\"3\"]{background:var(--lw-color-ring)}.parts{margin:.625rem -.5rem 0;padding:0;list-style:none}.parts button{border-radius:var(--lw-radius-md);width:100%;font-size:var(--lw-text-sm);text-align:left;transition:background-color var(--lw-duration-fast) ease-out, opacity var(--lw-duration-fast) ease-out;align-items:center;gap:.625rem;padding:.375rem .5rem;display:flex}.parts button:hover,.parts button[aria-pressed=true]{background:var(--lw-color-muted)}.parts button[data-faded]{opacity:.5}.swatch{border-radius:50%;flex:none;width:.5rem;height:.5rem}.part-name{text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-muted-foreground);flex:1;overflow:hidden}.amount{font-variant-numeric:tabular-nums;font-weight:500}.share{font-variant-numeric:tabular-nums;text-align:right;width:2.5rem;color:var(--lw-color-muted-foreground)}", s = 400, c = 120, l = 10, u = 90, d = 420, f = 864e5, p = 6, m = (e, t, n) => Math.min(n, Math.max(t, e)), h = (e) => e.reduce((e, t) => e + t, 0), g = (e) => e < .5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2, _ = ((e, t) => {
	let n = 42, r = () => (n = n * 16807 % 2147483647, n / 2147483647), i = Date.parse(`${t}T00:00:00Z`), a = 820, o = 380;
	return Array.from({ length: e }, (e, t) => {
		let n = i - (179 - t) * f, s = new Date(n).getUTCDay(), c = s === 0 || s === 6;
		a += 1.6 + (r() - .5) * 9, t === 168 && (a *= 1.09), o += .9 + (r() - .5) * 14;
		let l = 150 * (t >= 153 && t <= 158 ? 2.1 : 1) * (.7 + r() * .6);
		return {
			date: new Date(n).toISOString().slice(0, 10),
			parts: [
				Math.round(a * (.97 + r() * .06)),
				Math.round(o * (c ? .72 : 1) * (.9 + r() * .2)),
				Math.round(l * (c ? .5 : 1))
			]
		};
	});
})(180, "2026-10-14"), v = [{
	date: _[153].date,
	label: "Fall promo"
}, {
	date: _[168].date,
	label: "New pricing"
}], y = (e) => (/* @__PURE__ */ new Date(`${e}T00:00:00Z`)).toLocaleDateString("en-US", {
	weekday: "short",
	month: "short",
	day: "numeric",
	timeZone: "UTC"
}), b = (e) => (/* @__PURE__ */ new Date(`${e}T00:00:00Z`)).toLocaleDateString("en-US", {
	month: "short",
	day: "numeric",
	timeZone: "UTC"
}), x = (e, t) => Array.from({ length: t }, (n, r) => {
	let i = r / (t - 1) * (e.length - 1), a = Math.floor(i), o = Math.min(e.length - 1, a + 1);
	return e[a] + (e[o] - e[a]) * (i - a);
}), S = (e) => l + (1 - e) * 100, C = (e) => {
	let t = e.map((t, n) => [n / (e.length - 1) * s, S(t)]), n = `M${t[0][0].toFixed(2)} ${t[0][1].toFixed(2)}`;
	for (let e = 0; e < t.length - 1; e++) {
		let r = t[e - 1] ?? t[e], [i, a] = [t[e], t[e + 1]], o = t[e + 2] ?? a;
		n += `C${(i[0] + (a[0] - r[0]) / 6).toFixed(2)} ${(i[1] + (a[1] - r[1]) / 6).toFixed(2)} ${(a[0] - (o[0] - i[0]) / 6).toFixed(2)} ${(a[1] - (o[1] - i[1]) / 6).toFixed(2)} ${a[0].toFixed(2)} ${a[1].toFixed(2)}`;
	}
	return n;
}, w = (e) => `${e}L${s} ${c}L0 ${c}Z`, T = (e, t, n) => {
	let r = e.slice(-t), i = e.slice(-t * 2, -t), a = (e) => n === null ? h(e.parts) : e.parts[n] ?? 0, o = r.map(a), s = i.map(a), c = [...o, ...s], l = Math.min(...c) * .85, d = Math.max(...c) * 1.04, f = (e) => (e - l) / (d - l || 1);
	return {
		current: r,
		previous: i,
		now: o,
		before: s,
		norm: f,
		shape: {
			current: x(o.map(f), u),
			previous: x(s.map(f), u)
		},
		paths: {
			current: C(o.map(f)),
			previous: C(s.map(f))
		}
	};
}, E = (e, t) => h(t ? e.slice(t.lo, t.hi + 1) : e), D = class extends e {
	static styles = [i, o];
	static props = {
		label: { default: "Revenue" },
		segments: {
			type: Object,
			default: [
				"Plans",
				"Usage",
				"Services"
			]
		},
		data: {
			type: Object,
			default: _
		},
		events: {
			type: Object,
			default: v
		},
		periods: {
			type: Object,
			default: [
				7,
				30,
				90
			]
		},
		period: {
			type: Number,
			default: 30
		},
		format: { default: "currency" },
		currency: { default: "USD" }
	};
	#e = null;
	#t = null;
	#n = null;
	#r = null;
	#i = null;
	#a = null;
	#o = 0;
	render() {
		return `<div class="top"><p class="label"><span class="name"></span><span class="segment"></span></p><div class="periods"><span class="pill" aria-hidden="true"></span></div></div>
<p class="value"><span class="visually-hidden spoken"></span><span class="rolling" aria-hidden="true"></span></p>
<div class="change"><span class="delta"></span><span class="caption" aria-live="polite"></span><button class="clear" type="button" hidden>Clear</button></div>
<div class="chart" role="slider" tabindex="0" aria-valuemin="1">
  <svg viewBox="0 0 ${s} ${c}" preserveAspectRatio="none" aria-hidden="true"><defs><clipPath id="lit"><rect y="-10" height="140"/></clipPath></defs><line class="base" x1="0" x2="${s}" y1="119.5" y2="119.5" vector-effect="non-scaling-stroke"/><path class="previous" vector-effect="non-scaling-stroke"/><path class="area" clip-path="url(#lit)"/><path class="dim" vector-effect="non-scaling-stroke"/><path class="line" clip-path="url(#lit)" vector-effect="non-scaling-stroke"/></svg>
  <div class="pins"></div><div class="marks"></div><span class="end" aria-hidden="true"></span>
</div>
<div class="axis"><span class="first"></span><span class="legend"><span class="dash"></span>Previous period</span><span class="last"></span></div>
<div class="breakdown"><div class="bar" aria-hidden="true"></div><ul class="parts"></ul></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".chart");
		t.addEventListener("pointerdown", (e) => this.#y(e), e), t.addEventListener("pointermove", (e) => this.#b(e), e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, (e) => this.#x(e), e);
		t.addEventListener("pointerleave", () => this.#r === null && !this.#n && this.#d(null, null), e), t.addEventListener("keydown", (e) => this.#S(e), e), t.addEventListener("blur", () => this.#d(this.#n, null), e), this.query(".periods").addEventListener("click", (e) => this.#g(e), e), this.query(".parts").addEventListener("click", (e) => this.#_(e), e), this.query(".clear").addEventListener("click", () => this.#d(null, null), e), this.signal.addEventListener("abort", () => {
			cancelAnimationFrame(this.#o), this.#o = 0;
		});
	}
	updated(e) {
		if (e.has("periods")) {
			let e = this.query(".pill");
			this.query(".periods").replaceChildren(e, ...this.periods.map((e) => Object.assign(document.createElement("button"), {
				type: "button",
				textContent: `${e}D`,
				value: e
			})));
		}
		e.has("segments") && (this.#e = null, this.query(".bar").innerHTML = this.segments.map(() => "<span></span>").join(""), this.query(".parts").innerHTML = this.segments.map((e, t) => `<li><button type="button" data-index="${t}"><span class="swatch"></span><span class="part-name">${n(e)}</span><span class="amount"></span><span class="share"></span></button></li>`).join("")), [
			"data",
			"period",
			"segments",
			"periods"
		].some((t) => e.has(t)) && (this.#t = this.#n = null, this.#l()), this.#m();
	}
	get #s() {
		return new Intl.NumberFormat("en-US", {
			style: this.format === "currency" ? "currency" : "decimal",
			currency: this.currency,
			maximumFractionDigits: 0
		});
	}
	get #c() {
		return this.#i.current.length - 1;
	}
	#l() {
		this.#i = T(this.data, this.period, this.#e);
		let e = this.#a, t = this.#i.shape, n = this.#i.paths;
		if (cancelAnimationFrame(this.#o), !e || r.matches) {
			this.#a = t, this.#u(n);
			return;
		}
		let i = performance.now(), a = (r) => {
			let o = g(Math.min(1, (r - i) / d)), s = (e, t) => e.map((e, n) => e + (t[n] - e) * o);
			this.#a = {
				current: s(e.current, t.current),
				previous: s(e.previous, t.previous)
			}, o < 1 ? (this.#u({
				current: C(this.#a.current),
				previous: C(this.#a.previous)
			}), this.#o = requestAnimationFrame(a)) : (this.#o = 0, this.#a = t, this.#u(n));
		};
		this.#o = requestAnimationFrame(a);
	}
	#u({ current: e, previous: t }) {
		this.query(".line").setAttribute("d", e), this.query(".dim").setAttribute("d", e), this.query(".area").setAttribute("d", w(e)), this.query(".previous").setAttribute("d", t);
	}
	#d(e, t) {
		this.#n = e, this.#t = t, this.#m();
	}
	get #f() {
		let e = this.#n;
		return e && e.a !== e.b ? {
			span: {
				lo: Math.min(e.a, e.b),
				hi: Math.max(e.a, e.b)
			},
			ranged: !0
		} : this.#t !== null && this.#t <= this.#c ? {
			span: {
				lo: this.#t,
				hi: this.#t
			},
			ranged: !1
		} : {
			span: null,
			ranged: !1
		};
	}
	get #p() {
		return this.events.map((e) => ({
			...e,
			at: this.#i.current.findIndex(({ date: t }) => t === e.date)
		})).filter(({ at: e }) => e >= 0);
	}
	#m() {
		let e = this.#i;
		if (!e) return;
		let t = this.#s, r = this.#c, { span: i, ranged: o } = this.#f, l = i && !o ? e.current[i.lo] : void 0, u = i && !o ? e.previous[i.lo] : void 0, d = E(e.now, i), f = E(e.before, i), p = f ? (d - f) / f : 0, m = l ? this.events.find(({ date: e }) => e === l.date) : void 0, h = `vs previous ${this.period} days`;
		o ? h = `${b(e.current[i.lo].date)} – ${b(e.current[i.hi].date)} vs prior ${i.hi - i.lo + 1} days` : l && (h = `${y(l.date)} vs ${b(u?.date ?? l.date)}`);
		let g = t.format(d);
		this.query(".name").textContent = this.label ?? "", this.query(".segment").textContent = this.#e === null ? "" : ` · ${this.segments[this.#e]}`, [...this.query(".periods").querySelectorAll("button")].forEach((e) => e.ariaPressed = String(Number(e.value) === this.period)), this.query(".pill").style.translate = `${Math.max(0, this.periods.indexOf(this.period)) * 100}% 0`, this.query(".spoken").textContent = g, a(this.query(".value .rolling"), g);
		let _ = this.query(".delta");
		_.textContent = `${p >= 0 ? "▲" : "▼"} ${Math.abs(p * 100).toFixed(1)}%`, _.toggleAttribute("data-down", p < 0), this.query(".caption").innerHTML = `${n(h)}${m ? `<span class="note"> · ${n(m.label)}</span>` : ""}`, this.query(".clear").hidden = !o;
		let v = (e) => r ? e / r * s : s, x = (e) => v(e) / s * 100, C = (t) => `${S(e.norm(t)) / c * 100}%`, w = o ? v(i.lo) : 0, T = i ? v(i.hi) : s, D = this.query("#lit rect");
		D.setAttribute("x", w), D.setAttribute("width", Math.max(0, T - w)), this.query(".pins").innerHTML = this.#p.map(({ at: e }) => `<span class="pin" style="left: ${x(e)}%"></span>`).join("");
		let O = "";
		o ? O = [i.lo, i.hi].map((e) => `<span class="edge" style="left: ${x(e)}%"></span>`).join("") : l && (O = `<span class="guide" style="left: ${x(i.lo)}%"></span>${u ? `<span class="twin" style="left: ${x(i.lo)}%; top: ${C(e.before[i.lo])}"></span>` : ""}<span class="dot" style="left: ${x(i.lo)}%; top: ${C(e.now[i.lo])}"></span>`), this.query(".marks").innerHTML = O;
		let k = this.query(".end");
		k.style.top = e.now.length ? C(e.now[r]) : "0", k.toggleAttribute("data-hidden", !!i);
		let A = this.query(".chart"), j = `${g} in total`;
		o ? j = `${h}: ${g}` : l && (j = `${y(l.date)}: ${g}${m ? `, ${m.label}` : ""}`), A.ariaLabel = `${this.label} over the last ${this.period} days. Arrow keys read each day; hold Shift to select a range.`, A.ariaValueMax = String(e.current.length), A.ariaValueNow = String(i ? i.hi + 1 : e.current.length), A.ariaValueText = j, this.query(".first").textContent = e.current[0] ? b(e.current[0].date) : "", this.query(".last").textContent = e.current.at(-1) ? b(e.current.at(-1).date) : "", this.#h(i, t);
	}
	#h(e, t) {
		let n = Array(this.segments.length).fill(0), r = e ? this.#i.current.slice(e.lo, e.hi + 1) : this.#i.current;
		for (let e of r) n.forEach((t, r) => n[r] += e.parts[r] ?? 0);
		let i = h(n), a = (e) => this.#e === e ? 0 : e % 4;
		[...this.query(".bar").children].forEach((e, t) => {
			e.style.flexGrow = String(n[t]), e.dataset.tone = a(t), e.toggleAttribute("data-faded", this.#e !== null && this.#e !== t);
		}), this.shadowRoot.querySelectorAll(".parts button").forEach((e, r) => {
			e.querySelector(".swatch").dataset.tone = a(r), e.querySelector(".amount").textContent = t.format(n[r]), e.querySelector(".share").textContent = `${(i ? n[r] / i * 100 : 0).toFixed(0)}%`, e.ariaPressed = String(this.#e === r), e.ariaLabel = this.#e === r ? `Show all of ${this.label}` : `Show only ${this.segments[r]}`, e.toggleAttribute("data-faded", this.#e !== null && this.#e !== r);
		});
	}
	#g(e) {
		let t = e.target.closest("button");
		t && Number(t.value) !== this.period && (this.period = Number(t.value), this.emit("change", {
			period: this.period,
			segment: this.#e
		}));
	}
	#_(e) {
		let t = e.target.closest("button");
		if (!t) return;
		let n = Number(t.dataset.index);
		this.#e = this.#e === n ? null : n, this.#l(), this.#m(), this.emit("change", {
			period: this.period,
			segment: this.#e
		});
	}
	#v(e) {
		let t = this.query(".chart").getBoundingClientRect(), n = this.#c, r = m((e - t.left) / t.width, 0, 1), i = this.#p.find(({ at: e }) => Math.abs((e / (n || 1) - r) * t.width) < p);
		return i ? i.at : Math.round(r * n);
	}
	#y(e) {
		if (e.pointerType === "mouse" && e.button !== 0) return;
		e.currentTarget.setPointerCapture?.(e.pointerId);
		let t = this.#v(e.clientX);
		this.#r = t, this.#d(null, t);
	}
	#b(e) {
		let t = this.#v(e.clientX);
		if (this.#r !== null) {
			let e = this.#r;
			this.#d(this.#n || t !== e ? {
				a: e,
				b: t
			} : null, t);
		} else e.pointerType === "mouse" && !this.#n && this.#d(null, t);
	}
	#x(e) {
		this.#r !== null && (this.#r = null, e.pointerType !== "mouse" && this.#d(this.#n, null));
	}
	#S(e) {
		if (e.key === "Escape") {
			this.#d(null, null);
			return;
		}
		let t = this.#c, n = {
			ArrowLeft: -1,
			ArrowRight: 1,
			Home: -t,
			End: t
		}[e.key];
		if (n === void 0) return;
		e.preventDefault();
		let r = this.#n ? this.#n.b : this.#t ?? t, i = m(r + n, 0, t);
		this.#d(e.shiftKey ? {
			a: this.#n ? this.#n.a : r,
			b: i
		} : null, i);
	}
};
//#endregion
//#region src/components/metric-card/index.js
t("metric-card", D);
//#endregion
export { D as t };
