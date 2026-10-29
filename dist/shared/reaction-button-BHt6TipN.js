import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./button-CQIqPjy6.js";
import { a as n, n as r } from "./motion-CFWhFfc_.js";
import { n as i, t as a } from "./rolling-VjfpUD4B.js";
//#region src/components/reaction-button/reaction-button.scss?inline
var o = ".button{touch-action:none;-webkit-touch-callout:none;gap:.5rem;padding-inline-end:.5rem}.mine{place-items:center;font-size:1.1em;line-height:1;display:grid}.mine>*{grid-area:1/1}.mine .chosen{display:flex}.mine .chosen:empty,:host([value]) .mine .like-icon{display:none}:host([value]) .reaction-label{font-weight:600}.summary{align-items:center;gap:.375rem;display:inline-flex}.stack{display:flex}.stack .emoji{border-radius:var(--lw-radius-full);background:var(--lw-color-background);width:1.25rem;height:1.25rem;box-shadow:0 0 0 2px var(--_bg);justify-content:center;align-items:center;font-size:.75rem;line-height:1;display:inline-flex}.stack .emoji+.emoji{margin-inline-start:-.375rem}.tray{z-index:20;border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-full);background:var(--lw-color-background);box-shadow:var(--lw-shadow-md);transform-origin:0 100%;gap:.125rem;padding:.375rem;display:flex;position:absolute;bottom:calc(100% + .5rem);left:0}@media (prefers-reduced-motion:no-preference){.tray{transition:opacity .15s var(--lw-ease-out), scale .2s var(--lw-ease-spring), display .2s allow-discrete}@starting-style{.tray{opacity:0;scale:.8}}}.tray[hidden]{opacity:0;display:none;scale:.8}.option{border-radius:var(--lw-radius-full);cursor:pointer;background:0 0;border:0;outline:none;justify-content:center;align-items:center;width:2.25rem;height:2.25rem;padding:0;font-size:1.375rem;line-height:1;display:inline-flex;position:relative}@media (prefers-reduced-motion:no-preference){.option{transition:scale .18s var(--lw-ease-spring), translate .18s var(--lw-ease-spring)}}.option[aria-checked=true]{background:var(--lw-color-muted)}.option.active{translate:0 -.25rem;scale:1.35}.option:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.tip{border-radius:var(--lw-radius-sm);background:var(--lw-color-foreground);color:var(--lw-color-background);white-space:nowrap;opacity:0;pointer-events:none;transition:opacity var(--lw-duration-fast) var(--lw-ease-out);padding:.125rem .375rem;font-size:.5rem;font-weight:500;position:absolute;bottom:calc(100% + .25rem);left:50%;translate:-50%}.active>.tip{opacity:1}.live{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", s = 350, c = 300, l = 3, u = {
	scale: [
		.4,
		1.2,
		1
	],
	opacity: [
		0,
		1,
		1
	]
}, d = "<svg class=\"icon like-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7 10v12M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 8A2 2 0 0 1 17.4 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.8a2 2 0 0 0 1.8-1.1L12 2a3.1 3.1 0 0 1 3 3.9Z\"/></svg>", f = [
	{
		emoji: "👍",
		name: "Like"
	},
	{
		emoji: "❤️",
		name: "Love"
	},
	{
		emoji: "😂",
		name: "Haha"
	},
	{
		emoji: "😮",
		name: "Wow"
	},
	{
		emoji: "😢",
		name: "Sad"
	},
	{
		emoji: "🙏",
		name: "Thanks"
	}
], p = new Intl.NumberFormat(void 0, { numberingSystem: "latn" }), m = /* @__PURE__ */ new Map(), h = null, g = (e) => {
	let { fontSize: t, fontFamily: n } = getComputedStyle(e), r = `${t} ${n}`, i = r + e.textContent, a = m.get(i);
	if (a === void 0) {
		h ??= document.createElement("canvas").getContext("2d"), h.font = r;
		let t = h.measureText(e.textContent);
		a = (t.actualBoundingBoxDescent - t.actualBoundingBoxAscent) / 2 - (t.fontBoundingBoxDescent - t.fontBoundingBoxAscent) / 2, m.set(i, a);
	}
	e.style.translate = `0 ${-a.toFixed(2)}px`;
}, _ = class extends t {
	static styles = [
		...t.styles,
		i,
		o
	];
	static props = {
		...t.props,
		value: { reflect: !0 },
		reactions: {
			type: Object,
			default: {}
		},
		options: {
			type: Object,
			default: f
		},
		label: { default: "Like" },
		countLabel: { default: "reactions" },
		trayLabel: { default: "Reactions" }
	};
	#e = null;
	#t = !1;
	#n = 0;
	#r = 0;
	#i = [];
	render() {
		return `<button class="button" part="button" type="button" aria-haspopup="menu" aria-controls="tray" aria-expanded="false" aria-keyshortcuts="ArrowUp"><span class="mine" aria-hidden="true">${d}<span class="chosen"></span></span><span class="reaction-label"></span><span class="summary" aria-hidden="true"><span class="stack"></span><span class="count rolling"></span></span></button><div class="tray" part="tray" id="tray" role="menu" hidden></div><span class="live" aria-live="polite"></span>`;
	}
	connected() {
		super.connected();
		let e = this.query(".button"), t = this.query(".tray"), n = { signal: this.signal };
		e.addEventListener("pointerdown", this.#h, n), e.addEventListener("pointermove", this.#g, n), e.addEventListener("pointerup", this.#_, n), e.addEventListener("pointercancel", () => this.#m(), n), e.addEventListener("contextmenu", (e) => e.preventDefault(), n), e.addEventListener("keydown", this.#b, n), t.addEventListener("click", (e) => this.#l(e.target.closest(".option")), n), t.addEventListener("keydown", this.#x, n), t.addEventListener("pointerover", (e) => this.#f(e.target.closest(".option")), n), t.addEventListener("focusin", (e) => this.#f(e.target.closest(".option")), n), this.addEventListener("pointerenter", this.#v, n), this.addEventListener("pointerleave", this.#y, n), document.addEventListener("pointerdown", (e) => e.composedPath().includes(this) || this.#d(), n), this.signal.addEventListener("abort", () => {
			[this.#n, this.#r].forEach(clearTimeout), this.#d();
		});
	}
	updated(e) {
		if (super.updated(e), e.has("options") && this.#o(), e.has("trayLabel") && (this.query(".tray").ariaLabel = this.trayLabel), ["value", "options"].some((t) => e.has(t))) for (let e of this.query(".tray").children) e.ariaChecked = String(e.dataset.emoji === this.value);
		[
			"value",
			"reactions",
			"options",
			"label",
			"countLabel"
		].some((t) => e.has(t)) && this.#s();
	}
	handleClick() {
		this.#t ? this.#t = !1 : (this.#d(), this.#c(this.value ? null : this.options[0]?.emoji));
	}
	#a(e) {
		return this.options.find((t) => t.emoji === e)?.name ?? e;
	}
	#o() {
		let e = this.options.map(({ emoji: e, name: t }) => {
			let n = Object.assign(document.createElement("button"), {
				className: "option",
				type: "button",
				role: "menuitemradio",
				tabIndex: -1,
				ariaLabel: t
			});
			return n.dataset.emoji = e, n.append(Object.assign(document.createElement("span"), {
				className: "tip",
				textContent: t,
				ariaHidden: "true"
			}), Object.assign(document.createElement("span"), {
				className: "glyph",
				textContent: e
			})), n;
		});
		this.query(".tray").replaceChildren(...e), this.shadowRoot.querySelectorAll(".tray .glyph").forEach(g);
	}
	#s() {
		let e = { ...this.reactions };
		this.value && (e[this.value] = (e[this.value] ?? 0) + 1);
		let t = Object.entries(e).filter(([, e]) => e > 0).sort((e, t) => t[1] - e[1]).map(([e]) => e).slice(0, l);
		this.value && !t.includes(this.value) && (t[Math.min(t.length, 2)] = this.value);
		let n = Object.values(e).reduce((e, t) => e + t, 0), i = p.format(n), o = this.query(".button"), s = this.value ? this.#a(this.value) : this.label, c = this.query(".chosen");
		c.textContent = this.value ?? "", this.value && g(c), this.query(".reaction-label").textContent = s, o.ariaPressed = String(!!this.value), o.ariaLabel = n ? `${s}, ${i} ${this.countLabel}` : s;
		let d = t.map((e) => {
			let t = Object.assign(document.createElement("span"), { className: "emoji" });
			return t.append(Object.assign(document.createElement("span"), {
				className: "glyph",
				textContent: e
			})), t;
		});
		this.query(".stack").replaceChildren(...d), d.forEach((e) => g(e.firstChild)), r.matches || d.forEach((e, n) => this.#i.includes(t[n]) || e.animate(u, {
			duration: 300,
			easing: "ease-out"
		})), this.#i = t;
		let f = this.query(".count");
		f.hidden = n === 0, a(f, i);
	}
	#c(e) {
		let t = e ?? null;
		t !== (this.value ?? null) && this.emit("change", { value: t }) && (this.value = t ?? void 0, this.query(".live").textContent = t ? this.#a(t) : "");
	}
	#l(e) {
		if (!e) return;
		let t = this.#e === "keyboard";
		this.#d(t), this.#c(e.dataset.emoji);
	}
	#u(e) {
		if (clearTimeout(this.#r), this.#e || this.disabled) return;
		this.#e = e, this.query(".tray").hidden = !1, this.query(".button").ariaExpanded = "true";
		let t = [...this.query(".tray").children], n = t.find((e) => e.dataset.emoji === this.value) ?? t[0];
		e === "keyboard" ? n?.focus() : this.#f(null);
	}
	#d(e = !1) {
		this.#e && (this.#e = null, this.query(".tray").hidden = !0, this.query(".button").ariaExpanded = "false", this.#f(null), e && this.query(".button").focus());
	}
	#f(e) {
		for (let t of this.query(".tray").children) t.classList.toggle("active", t === e);
	}
	#p(e, t) {
		return this.shadowRoot.elementFromPoint(e, t)?.closest(".option") ?? null;
	}
	#m() {
		clearTimeout(this.#n), this.#e === "hold" && this.#d();
	}
	#h = (e) => {
		e.button === 0 && (this.#t = !1, clearTimeout(this.#n), e.currentTarget.setPointerCapture(e.pointerId), this.#n = setTimeout(() => {
			this.#t = !0, this.#u("hold"), n(8);
		}, s));
	};
	#g = (e) => {
		this.#e === "hold" && this.#f(this.#p(e.clientX, e.clientY));
	};
	#_ = (e) => {
		if (clearTimeout(this.#n), this.#e !== "hold") return;
		let t = this.#p(e.clientX, e.clientY);
		this.#d(), t && this.#c(t.dataset.emoji);
	};
	#v = (e) => {
		clearTimeout(this.#r), e.pointerType === "mouse" && this.#u("hover");
	};
	#y = () => {
		this.#e === "hover" && (this.#r = setTimeout(() => this.#d(), c));
	};
	#b = (e) => {
		e.key === "ArrowUp" && (e.preventDefault(), this.#u("keyboard"));
	};
	#x = (e) => {
		let t = [...this.query(".tray").children], n = t.indexOf(this.shadowRoot.activeElement), r = {
			ArrowRight: n + 1,
			ArrowLeft: n - 1,
			Home: 0,
			End: t.length - 1
		};
		e.key in r ? (e.preventDefault(), t.at(r[e.key] % t.length)?.focus()) : e.key === "Escape" ? (e.preventDefault(), this.#d(!0)) : e.key === "Tab" && this.#d();
	};
};
//#endregion
//#region src/components/reaction-button/index.js
e("reaction-button", _);
//#endregion
export { _ as t };
