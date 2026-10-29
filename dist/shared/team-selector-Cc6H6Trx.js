import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./form-QHOiInAj.js";
import { i, n as a } from "./motion-CFWhFfc_.js";
import { n as o, t as s } from "./rolling-VjfpUD4B.js";
import { n as c, t as l } from "./people-C_zYMoEl.js";
//#region src/components/team-selector/team-selector.scss?inline
var u = ":host{--_hover:color-mix(in oklab, var(--lw-color-foreground) 4%, transparent);--_press:color-mix(in oklab, var(--lw-color-foreground) 8%, transparent);max-width:20rem;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);display:block}.card{border:1px solid var(--lw-color-border);background:var(--lw-color-background);border-radius:1rem;padding:1.25rem;box-shadow:0 1px 4px #0000000a}.label{color:var(--lw-color-muted-foreground);font-size:.8125rem;font-weight:500;display:block}.icon{width:.875rem;height:.875rem}.seats{justify-content:center;align-items:center;height:2.5rem;margin:1rem 0 1.5rem;display:flex;position:relative}.seat{width:2.5rem;height:2.5rem;box-shadow:0 0 0 2px var(--lw-color-background);font-variant-numeric:tabular-nums;border-radius:50%;flex:none;justify-content:center;align-items:center;margin-left:-.5rem;font-size:.75rem;font-weight:500;display:flex;overflow:hidden}.seat.first{margin-left:0}.seat img{object-fit:cover;width:100%;height:100%}.person{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)))}.photo{background:var(--lw-color-muted)}.open{background:var(--lw-color-background);outline:1px dashed color-mix(in oklab, var(--lw-color-foreground) 22%, transparent);outline-offset:-3px;color:var(--lw-color-muted-foreground);font-size:.6875rem}.chip{border-radius:var(--lw-radius-full);background:var(--lw-color-muted);width:auto;min-width:2.5rem;color:var(--lw-color-muted-foreground);padding-inline:.5rem}.stepper{justify-content:center;align-items:center;gap:1rem;display:flex}.step{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-lg);background:var(--lw-color-background);width:2.25rem;height:2.25rem;color:var(--lw-color-muted-foreground);cursor:pointer;outline:none;flex:none;justify-content:center;align-items:center;padding:0;transition:color .15s ease-out,background-color .15s ease-out,opacity .15s ease-out;display:flex}.step:hover:not([aria-disabled=true]){background:var(--_hover);color:var(--lw-color-foreground)}.step:active:not([aria-disabled=true]){background:var(--_press)}.step[aria-disabled=true]{cursor:not-allowed;opacity:.4}.step:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.spin{border-radius:var(--lw-radius-lg);touch-action:pan-y;-webkit-user-select:none;user-select:none;outline:none;flex-direction:column;align-items:center;min-width:5rem;padding:.25rem .5rem;transition:background-color .15s ease-out;display:flex}@media (pointer:fine){.spin{cursor:ew-resize}}.spin:hover{background:var(--_hover)}.spin[data-scrubbing]{background:var(--_press)}.spin:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.number{font-size:1.875rem;font-weight:600;line-height:1.25em}.unit{color:var(--lw-color-muted-foreground);font-size:.6875rem}.price{border-top:1px solid var(--lw-color-muted);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);justify-content:center;align-items:center;gap:.375rem;margin:1.25rem 0 0;padding-top:1rem;font-size:.8125rem;display:flex}.price[hidden]{display:none}.dot{opacity:.5}.total{color:var(--lw-color-foreground);font-weight:500}.announce{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", d = 24, f = 14, p = 5, m = 5, h = "cubic-bezier(0.23, 1, 0.32, 1)", g = {
	stiffness: 600,
	damping: 32
}, _ = [
	{
		id: "member-1",
		name: "Alex Rivera"
	},
	{
		id: "member-2",
		name: "Blair Kim"
	},
	{
		id: "member-3",
		name: "Casey Lin"
	},
	{
		id: "member-4",
		name: "Devon Marsh"
	}
], v = (e) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">${e}</svg>`, y = v("<path d=\"M5 12h14\"/>"), b = v("<path d=\"M5 12h14\"/><path d=\"M12 5v14\"/>"), x = class t extends r(e) {
	static styles = [o, u];
	static props = {
		value: {
			type: Number,
			default: 3
		},
		min: {
			type: Number,
			default: 1
		},
		max: {
			type: Number,
			default: 12
		},
		label: { default: "Team size" },
		pricePerSeat: { type: Number },
		currency: { default: "USD" },
		name: {},
		members: {
			type: Object,
			default: _
		}
	};
	#e = null;
	#t = null;
	#n = null;
	#r = 0;
	#i = null;
	render() {
		return `<div class="card" part="base"><span class="label" id="label"></span><div class="seats" aria-hidden="true"></div><div class="stepper"><button class="step" type="button" data-delta="-1" aria-label="Remove a seat">${y}</button><div class="spin" part="value" role="spinbutton" tabindex="0" aria-labelledby="label"><span class="number rolling"></span><span class="unit"></span></div><button class="step" type="button" data-delta="1" aria-label="Add a seat">${b}</button></div><p class="price" hidden><span class="per"></span><span class="dot" aria-hidden="true">·</span><span><span class="total rolling"></span> / month</span></p><output class="announce" aria-live="polite"></output></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".spin");
		this.shadowRoot.querySelectorAll(".step").forEach((t) => t.addEventListener("click", () => this.#c(Number(t.dataset.delta)), e)), t.addEventListener("keydown", (e) => this.#u(e), e), t.addEventListener("pointerdown", (e) => this.#d(e), e), t.addEventListener("pointermove", (e) => this.#f(e), e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, () => this.#p(), e);
		this.signal.addEventListener("abort", () => {
			this.#i?.(), this.#n = null, this.#m(0);
		});
	}
	updated(e) {
		e.has("label") && (this.query(".label").textContent = this.label), this.#g(this.#e !== null);
	}
	formResetCallback() {
		let e = this.getAttribute("value");
		this.#s(e === null ? t.props.value.default : Number(e));
	}
	get #a() {
		return Math.max(this.min, this.max);
	}
	get #o() {
		return Math.min(Math.max(Math.round(this.value) || 0, this.min), this.#a);
	}
	#s(e) {
		let t = Math.min(Math.max(e, this.min), this.#a);
		t !== this.#o && (this.value = t, this.emit("change", { value: t }));
	}
	#c(e) {
		let t = this.#o + e;
		t < this.min || t > this.#a ? this.#l() : this.#s(t);
	}
	#l() {
		a.matches || this.#t || (this.#t = this.query(".stepper").animate({ translate: [
			"-3px",
			"3px",
			"-2px",
			"2px",
			"0"
		] }, {
			duration: 280,
			easing: h
		}), this.#t.onfinish = this.#t.oncancel = () => this.#t = null);
	}
	#u(e) {
		let t = this.#o, n = {
			ArrowUp: 1,
			ArrowRight: 1,
			ArrowDown: -1,
			ArrowLeft: -1
		};
		if (e.key in n) this.#c(n[e.key]);
		else if (e.key === "PageUp") this.#s(t + m);
		else if (e.key === "PageDown") this.#s(t - m);
		else if (e.key === "Home") this.#s(this.min);
		else if (e.key === "End") this.#s(this.#a);
		else return;
		e.preventDefault();
	}
	#d(e) {
		e.button === 0 && (e.currentTarget.setPointerCapture(e.pointerId), this.#i?.(), this.#n = {
			startX: e.clientX,
			startCount: this.#o
		}, this.query(".spin").toggleAttribute("data-scrubbing", !0));
	}
	#f(e) {
		let t = this.#n;
		if (!t) return;
		let n = t.startCount + (e.clientX - t.startX) / d;
		this.#s(Math.round(n));
		let r = 0;
		n < this.min ? r = (n - this.min) * d : n > this.#a && (r = (n - this.#a) * d), this.#m(Math.sign(r) * f * (1 - Math.exp(-Math.abs(r) / 56)));
	}
	#p() {
		this.#n && (this.#n = null, this.query(".spin").removeAttribute("data-scrubbing"), a.matches ? this.#m(0) : this.#i = i(this.#r, 0, {
			...g,
			restDelta: .05,
			update: (e) => this.#m(e)
		}));
	}
	#m(e) {
		this.#r = e, this.query(".spin").style.translate = e ? `${e.toFixed(2)}px 0` : "";
	}
	#h(e) {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: this.currency,
			maximumFractionDigits: Number.isInteger(this.pricePerSeat) ? 0 : 2
		}).format(e);
	}
	#g(e) {
		let t = this.#o, r = t === 1 ? "seat" : "seats", i = this.query(".spin");
		s(this.query(".number"), String(t)), this.query(".unit").textContent = r, Object.assign(i, {
			ariaValueNow: String(t),
			ariaValueMin: String(this.min),
			ariaValueMax: String(this.#a),
			ariaValueText: `${t} ${r}`
		}), this.shadowRoot.querySelectorAll(".step").forEach((e) => {
			let n = Number(e.dataset.delta) < 0 ? t <= this.min : t >= this.#a;
			e.ariaDisabled = String(n);
		});
		let o = this.pricePerSeat != null;
		this.query(".price").hidden = !o;
		let c = `${t} ${r}`;
		if (o) {
			let e = this.#h(this.pricePerSeat * t);
			this.query(".per").textContent = `${this.#h(this.pricePerSeat)} / seat`, s(this.query(".total"), e), c += `, ${e} per month`;
		}
		this.#e !== null && this.#e !== t && (this.query(".announce").textContent = c), this.#e = t, this[n].setFormValue(this.name ? String(t) : null), this.#_(e && !a.matches);
	}
	#_(e) {
		let t = this.query(".seats"), n = this.#o, r = Array.isArray(this.members) ? this.members : [], i = n > p ? n - 4 : 0, a = Array.from({ length: i ? 4 : n }, (e, t) => {
			let n = r[t];
			return n ? {
				...n,
				key: `member:${n.id ?? t}`
			} : {
				key: `open:${t}`,
				name: `Seat ${t + 1}`,
				open: !0,
				index: t
			};
		});
		i && a.push({ key: "overflow" });
		let o = new Map([...t.children].filter((e) => !e.hasAttribute("data-leaving")).map((e) => [e.dataset.key, e])), c = new Map([...o].map(([e, t]) => [e, t.getBoundingClientRect().left])), l = new Set(a.map(({ key: e }) => e));
		for (let [t, n] of o) l.has(t) || (e ? (n.dataset.leaving = "", Object.assign(n.style, {
			position: "absolute",
			left: `${n.offsetLeft}px`,
			top: `${n.offsetTop}px`,
			margin: "0"
		}), n.animate({
			opacity: [1, 0],
			scale: [1, .85]
		}, {
			duration: 160,
			easing: h,
			fill: "forwards"
		}).onfinish = () => n.remove()) : n.remove());
		let u = [];
		if (a.forEach((e, n) => {
			let r = o.get(e.key);
			r || (r = this.#v(e), u.push(r)), r.style.zIndex = e.key === "overflow" ? "0" : String(p - n), r.classList.toggle("first", n === 0), e.key === "overflow" && s(r.querySelector(".rolling"), String(i)), t.append(r);
		}), t.querySelectorAll("[data-leaving]").forEach((e) => t.append(e)), e) {
			for (let [e, t] of c) {
				let n = o.get(e);
				if (!l.has(e)) continue;
				let r = t - n.getBoundingClientRect().left;
				Math.abs(r) > .5 && n.animate({ transform: [`translateX(${r}px)`, "none"] }, {
					duration: 200,
					easing: h
				});
			}
			for (let e of u) e.animate({
				opacity: [0, 1],
				scale: [.85, 1]
			}, {
				duration: 260,
				easing: "cubic-bezier(0.34, 1.4, 0.64, 1)"
			});
		}
	}
	#v(e) {
		let t = document.createElement("span");
		return t.dataset.key = e.key, e.key === "overflow" ? (t.className = "seat chip", t.innerHTML = "+<span class=\"rolling\"></span>", t) : (t.title = e.name, e.avatarUrl ? (t.className = "seat photo", t.append(Object.assign(document.createElement("img"), {
			src: e.avatarUrl,
			alt: "",
			width: 40,
			height: 40,
			draggable: !1
		}))) : e.open ? (t.className = "seat open", t.textContent = e.index + 1) : (t.className = "seat person", t.style.setProperty("--_hue", l(e.name)), t.textContent = c(e.name)), t);
	}
};
//#endregion
//#region src/components/team-selector/index.js
t("team-selector", x);
//#endregion
export { x as t };
