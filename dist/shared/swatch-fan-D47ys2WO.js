import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./form-QHOiInAj.js";
import { i, n as a, r as o } from "./motion-CFWhFfc_.js";
import { t as s } from "./clipboard-BCkfa02P.js";
//#region src/components/swatch-fan/palette.js
var c = [
	["Red", 25],
	["Orange", 55],
	["Amber", 75],
	["Yellow", 100],
	["Lime", 125],
	["Green", 150],
	["Teal", 180],
	["Cyan", 210],
	["Blue", 255],
	["Indigo", 275],
	["Violet", 300],
	["Pink", 350]
], l = [
	[
		100,
		.96,
		.03
	],
	[
		300,
		.86,
		.09
	],
	[
		500,
		.72,
		.15
	],
	[
		600,
		.63,
		.17
	],
	[
		700,
		.53,
		.15
	],
	[
		900,
		.36,
		.09
	]
], u = (e) => {
	let t = e <= .0031308 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - .055;
	return Math.round(Math.min(Math.max(t, 0), 1) * 255);
}, d = (e, t, n) => {
	let r = n * Math.PI / 180, i = t * Math.cos(r), a = t * Math.sin(r), o = (e + .3963377774 * i + .2158037573 * a) ** 3, s = (e - .1055613458 * i - .0638541728 * a) ** 3, c = (e - .0894841775 * i - 1.291485548 * a) ** 3;
	return `#${[
		4.0767416621 * o - 3.3077115913 * s + .2309699292 * c,
		-1.2684380046 * o + 2.6097574011 * s - .3413193965 * c,
		-.0041960863 * o - .7034186147 * s + 1.707614701 * c
	].map((e) => u(e).toString(16).padStart(2, "0")).join("")}`;
}, f = c.map(([e, t]) => ({
	name: e,
	hue: t,
	shades: l.map(([e, n, r]) => ({
		step: e,
		hex: d(n, r, t)
	}))
})), p = (e) => {
	let [t, n, r] = [
		1,
		3,
		5
	].map((t) => Number.parseInt(e.slice(t, t + 2), 16) / 255);
	return .299 * t + .587 * n + .114 * r > .6 ? "#18181b" : "#ffffff";
}, m = ":host{--_blade-w:3.25rem;--_blade-h:13.5rem;width:380px;max-width:100%;font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);-webkit-user-select:none;user-select:none;display:block}.deck{height:calc(var(--_blade-h) + 2.5rem);border-radius:var(--lw-radius-lg);cursor:grab;touch-action:pan-y;outline:none;position:relative;overflow:hidden}.deck:active{cursor:grabbing}.deck:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.blade{bottom:.75rem;left:calc(50% - var(--_blade-w) / 2);width:var(--_blade-w);height:var(--_blade-h);background:var(--lw-color-background);box-shadow:0 0 0 1px color-mix(in oklab, var(--lw-color-foreground) 10%, transparent), 0 4px 10px -4px #00000040;transform-origin:50% calc(100% - 1rem);border-radius:.5rem .5rem .625rem .625rem;flex-direction:column;padding:.25rem .25rem 0;display:flex;position:absolute}.swatch{cursor:pointer;border-radius:.25rem;flex:1;transition:box-shadow .15s ease-out}.swatch+.swatch{margin-top:2px}.swatch:hover{box-shadow:inset 0 0 0 2px #fff9}.swatch[aria-selected=true]{box-shadow:inset 0 0 0 2px #fff,inset 0 0 0 3px #00000059}.blade-name{letter-spacing:.04em;text-transform:uppercase;height:1.75rem;color:var(--lw-color-muted-foreground);place-items:start center;padding-top:.25rem;font-size:.5625rem;font-weight:600;display:grid}.rivet{z-index:20;background:radial-gradient(circle at 35% 35%,#fff,#a1a1aa 60%,#52525b);border-radius:50%;width:.625rem;height:.625rem;position:absolute;bottom:1.5rem;left:calc(50% - .3125rem);box-shadow:0 1px 2px #0000004d}.hint{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);opacity:calc(1 - var(--_spread,0) * 3);pointer-events:none;position:absolute;top:.5rem;right:.75rem}.picked{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-lg);align-items:center;gap:.75rem;margin-top:.75rem;padding:.625rem .75rem;display:flex}.chip{border-radius:var(--lw-radius-md);flex:none;width:2.25rem;height:2.25rem;transition:background-color .2s ease-out;box-shadow:inset 0 0 0 1px #00000014}.picked-text{flex:1;min-width:0;display:grid}.picked-name{font-weight:500}.picked-hex{font-family:var(--lw-font-mono);font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);-webkit-user-select:all;user-select:all}.announce{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", h = 150, g = 200, _ = 4, v = o(.45, .25), y = 1500, b = class extends r(e) {
	static styles = m;
	static props = {
		value: { default: "" },
		open: {
			type: Boolean,
			reflect: !0
		},
		name: {},
		label: { default: "Colours" }
	};
	#e = 0;
	#t = null;
	#n = null;
	#r = 8;
	#i = 2;
	#a = 0;
	#o = !1;
	render() {
		return `<div class="deck" part="deck" role="listbox" tabindex="0">${f.map(({ name: e, shades: t }, n) => `<div class="blade" data-hue="${n}">${t.map(({ step: t, hex: r }, i) => `<span class="swatch" id="swatch-${n}-${i}" role="option" aria-selected="false" aria-label="${e} ${t}, ${r}" data-hue="${n}" data-shade="${i}" style="background: ${r}"></span>`).join("")}<span class="blade-name">${e}</span></div>`).join("")}<span class="rivet" aria-hidden="true"></span><span class="hint" aria-hidden="true">Drag to open</span></div><div class="picked"><span class="chip" aria-hidden="true"></span><span class="picked-text"><span class="picked-name"></span><span class="picked-hex"></span></span><lw-button class="copy" size="sm" variant="secondary">Copy hex</lw-button></div><p class="announce" aria-live="polite"></p>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".deck");
		t.addEventListener("pointerdown", (e) => this.#m(e), e), t.addEventListener("pointermove", (e) => this.#h(e), e);
		for (let n of ["pointerup", "pointercancel"]) t.addEventListener(n, (e) => this.#g(e), e);
		t.addEventListener("keydown", (e) => this.#_(e), e), this.query(".copy").addEventListener("click", () => this.#v(), e), this.signal.addEventListener("abort", () => {
			this.#t?.(), clearTimeout(this.#a);
		});
	}
	updated(e) {
		e.has("label") && (this.query(".deck").ariaLabel = this.label ?? ""), e.has("value") && this.value && this.#s(this.value), e.has("open") && !this.#n && this.#d(+!!this.open, this.#o), this.#o = !0, this.#u();
	}
	#s(e) {
		f.forEach(({ shades: t }, n) => t.forEach((t, r) => {
			t.hex === e.toLowerCase() && (this.#r = n, this.#i = r);
		}));
	}
	get #c() {
		let e = f[this.#r];
		return {
			...e.shades[this.#i],
			name: e.name
		};
	}
	#l() {
		let e = f.length, t = h / (e - 1);
		this.shadowRoot.querySelectorAll(".blade").forEach((n, r) => {
			let i = (r - this.#r) * .8, a = i + (-75 + r * t - i) * this.#e, o = r === this.#r ? -14 * this.#e : 0;
			n.style.transform = `rotate(${a.toFixed(2)}deg) translateY(${o.toFixed(1)}px)`, n.style.zIndex = String(r === this.#r ? e + 1 : r);
		}), this.query(".deck").style.setProperty("--_spread", this.#e.toFixed(3));
	}
	#u() {
		this.#l();
		let { hex: e, name: t, step: r } = this.#c;
		this.shadowRoot.querySelectorAll(".swatch").forEach((e) => {
			let t = Number(e.dataset.hue) === this.#r && Number(e.dataset.shade) === this.#i;
			e.ariaSelected = String(t);
		}), this.query(".deck").setAttribute("aria-activedescendant", `swatch-${this.#r}-${this.#i}`);
		let i = this.query(".chip");
		i.style.background = e, i.style.color = p(e), this.query(".picked-name").textContent = `${t} ${r}`, this.query(".picked-hex").textContent = e, this[n].setFormValue(this.name ? e : null);
	}
	#d(e, t = !0) {
		this.#t?.(), this.#t = null, !t || a.matches ? (this.#e = e, this.#l()) : this.#t = i(this.#e, e, {
			...v,
			restDelta: .001,
			update: (e) => {
				this.#e = e, this.#l();
			},
			done: () => this.#t = null
		});
	}
	#f(e) {
		e === !!this.open ? this.#d(+!!e) : this.open = e;
	}
	#p(e, t, n = !0) {
		let r = e !== this.#r || t !== this.#i;
		this.#r = e, this.#i = t;
		let { hex: i, name: a, step: o } = this.#c;
		this.value = i, this.#u(), r && (n && (this.query(".announce").textContent = `${a} ${o}, ${i}`), this.emit("change", {
			hex: i,
			name: a,
			step: o
		}));
	}
	#m(e) {
		e.button === 0 && (this.#t?.(), this.#n = {
			x: e.clientX,
			start: this.#e,
			moved: !1,
			id: e.pointerId
		}, this.query(".deck").setPointerCapture(e.pointerId));
	}
	#h(e) {
		let t = this.#n;
		if (t?.id !== e.pointerId) return;
		let n = e.clientX - t.x;
		!t.moved && Math.abs(n) < _ || (t.moved = !0, this.#e = Math.min(Math.max(t.start + n / g, 0), 1), this.#l());
	}
	#g(e) {
		let t = this.#n;
		if (t?.id !== e.pointerId) return;
		if (this.#n = null, t.moved) {
			let e = this.#e > .35;
			this.open = e, this.#d(+!!e);
			return;
		}
		let n = this.shadowRoot.elementFromPoint?.(e.clientX, e.clientY)?.closest(".swatch") ?? e.target.closest?.(".swatch");
		this.#e < .5 && this.#f(!0), n && this.#p(Number(n.dataset.hue), Number(n.dataset.shade));
	}
	#_(e) {
		let t = f.length, n = f[0].shades.length, r = {
			ArrowLeft: [-1, 0],
			ArrowRight: [1, 0],
			ArrowUp: [0, -1],
			ArrowDown: [0, 1]
		};
		if (e.key in r) {
			e.preventDefault();
			let [i, a] = r[e.key];
			this.open || this.#f(!0), this.#p((this.#r + i + t) % t, Math.min(Math.max(this.#i + a, 0), n - 1));
		} else e.key === "Enter" || e.key === " " ? (e.preventDefault(), this.#v()) : e.key === "Escape" && this.open && (e.preventDefault(), this.#f(!1));
	}
	async #v() {
		let { hex: e } = this.#c, t = this.query(".copy");
		try {
			await s(e);
		} catch {
			this.query(".announce").textContent = "Couldn’t copy. Select the hex and copy it yourself.";
			return;
		}
		t.textContent = "Copied", this.query(".announce").textContent = `Copied ${e}`, this.emit("copy", { hex: e }), clearTimeout(this.#a), this.#a = setTimeout(() => t.textContent = "Copy hex", y);
	}
};
//#endregion
//#region src/components/swatch-fan/index.js
t("swatch-fan", b);
//#endregion
export { b as t };
