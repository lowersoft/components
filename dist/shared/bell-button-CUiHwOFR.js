import { t as e } from "./core-WcEz9YgG.js";
import { n as t, t as n } from "./button-CQIqPjy6.js";
import { a as r, n as i, t as a } from "./motion-CFWhFfc_.js";
import { n as o, t as s } from "./rolling-VjfpUD4B.js";
//#region src/components/bell-button/bell-button.scss?inline
var c = ":host([subscribed]:is([variant=secondary],[variant=outline],[variant=ghost])){--_bg:var(--lw-color-primary);--_fg:var(--lw-color-primary-foreground);--_border:var(--lw-color-primary)}.button{gap:.625rem}@media (prefers-reduced-motion:no-preference){.button{transition:background-color .2s var(--lw-ease-out), border-color .2s var(--lw-ease-out), color .2s var(--lw-ease-out), transform var(--lw-duration-fast) var(--lw-ease-out)}}:host([count]:not([icon-only])) .button{padding-inline-end:.375rem}:host([icon-only]) :is(.labels,.count){display:none}.icon{flex:none;width:1.4em;height:1.4em;overflow:visible}.wave{opacity:0}.shell{fill:#0000;transition:fill .2s var(--lw-ease-out)}:host([subscribed]) .shell{fill:currentColor}.slash{stroke-dasharray:26;stroke-dashoffset:0}@media (prefers-reduced-motion:no-preference){.slash{transition:stroke-dashoffset .3s var(--lw-ease-out)}}:host([subscribed]) .slash{stroke-dashoffset:26px}.labels{display:grid}.label{white-space:nowrap;transition:opacity .2s var(--lw-ease-out), filter .2s var(--lw-ease-out);grid-area:1/1}:host([subscribed]) .label-off,:host(:not([subscribed])) .label-on{opacity:0;filter:blur(2px)}", l = 1 / 240, u = {
	stiffness: 380,
	damping: 5
}, d = {
	stiffness: 150,
	damping: 4
}, f = 13, p = .18, m = 260, h = 600, g = 160, _ = 700, v = .05, y = "12 2.5", b = 420, x = "cubic-bezier(0.23, 1, 0.32, 1)", S = "<svg class=\"icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path class=\"wave\" data-side=\"1\" d=\"M21.5 4.5c1.2 1.6 1.8 3.4 1.8 5.5\"/><path class=\"wave\" data-side=\"-1\" d=\"M2.5 4.5C1.3 6.1.7 7.9.7 10\"/><path class=\"clapper\" d=\"M10.27 21a2 2 0 0 0 3.46 0\"/><g class=\"bell\"><path class=\"shell\" d=\"M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33\"/><path class=\"slash\" d=\"M3 3l18 18\"/></g></svg>", C = new Intl.NumberFormat(void 0, { numberingSystem: "latn" }), w = class extends n {
	static styles = [
		t,
		o,
		c
	];
	static props = {
		...n.props,
		subscribed: {
			type: Boolean,
			reflect: !0
		},
		count: {
			type: Number,
			reflect: !0
		},
		label: { default: "Notify me" },
		subscribedLabel: { default: "Subscribed" },
		countLabel: { default: "subscribers" }
	};
	#e = {
		bell: 0,
		bellSpeed: 0,
		clapper: 0,
		clapperSpeed: 0
	};
	#t = -Infinity;
	#n = a(l, {
		step: () => this.#a(),
		render: () => this.#o()
	});
	render() {
		return `<button class="button" part="button">${S}<span class="labels" aria-hidden="true"><span class="label label-off"></span><span class="label label-on"></span></span><span class="count rolling" aria-hidden="true" hidden></span></button>`;
	}
	connected() {
		super.connected(), this.query(".button").addEventListener("pointerenter", this.#r, { signal: this.signal }), this.signal.addEventListener("abort", () => {
			this.#n.stop(), this.#s();
		});
	}
	updated(e) {
		super.updated(e), e.has("label") && (this.query(".label-off").textContent = this.label), e.has("subscribedLabel") && (this.query(".label-on").textContent = this.subscribedLabel), e.has("subscribed") && (this.query(".button").ariaPressed = String(this.subscribed)), [
			"label",
			"count",
			"countLabel",
			"subscribed"
		].some((t) => e.has(t)) && this.#u();
	}
	handleClick(e) {
		super.handleClick(e);
		let t = !this.subscribed;
		if (!this.emit("change", { subscribed: t })) return;
		this.subscribed = t;
		let n = this.#e;
		t ? (this.#i(n.bellSpeed >= 0 ? h : -600), i.matches && (this.#l(1, .6), this.#l(-1, .6)), r(10)) : this.#i(-300);
	}
	#r = (e) => {
		e.pointerType === "mouse" && this.subscribed && (e.timeStamp - this.#t < _ || (this.#t = e.timeStamp, this.#i(this.#e.bellSpeed >= 0 ? g : -160)));
	};
	#i(e) {
		i.matches || (this.#e.bellSpeed += e, this.#n.wake());
	}
	#a() {
		let e = this.#e;
		if (e.bellSpeed += (-e.bell * u.stiffness - e.bellSpeed * u.damping) * l, e.bell += e.bellSpeed * l, !this.subscribed) {
			e.clapper = e.bell, e.clapperSpeed = e.bellSpeed;
			return;
		}
		e.clapperSpeed += (-e.clapper * d.stiffness - e.clapperSpeed * d.damping) * l, e.clapper += e.clapperSpeed * l;
		let t = e.clapper - e.bell;
		if (Math.abs(t) <= f) return;
		let n = Math.sign(t), i = (e.clapperSpeed - e.bellSpeed) * n;
		e.clapper = e.bell + n * f, !(i <= 0) && (e.clapperSpeed -= n * i * 1.45, e.bellSpeed += n * i * p, i > m && (this.#l(n, i / 1600), r(6)));
	}
	#o() {
		let e = this.#e;
		return Math.abs(e.bell) + Math.abs(e.bellSpeed) * .02 + Math.abs(e.clapper) + Math.abs(e.clapperSpeed) * .02 < v ? (this.#s(), !1) : (this.#c(), !0);
	}
	#s() {
		Object.assign(this.#e, {
			bell: 0,
			bellSpeed: 0,
			clapper: 0,
			clapperSpeed: 0
		}), this.#c();
	}
	#c() {
		let { bell: e, clapper: t } = this.#e;
		this.query(".bell").setAttribute("transform", `rotate(${e.toFixed(2)} ${y})`), this.query(".clapper").setAttribute("transform", `rotate(${t.toFixed(2)} ${y})`);
	}
	#l(e, t) {
		this.query(`.wave[data-side="${e}"]`).animate({
			opacity: [Math.min(1, .45 + t * .55), 0],
			translate: ["0", `${e * 3}px`]
		}, {
			duration: b,
			easing: x
		});
	}
	#u() {
		let e = this.query(".count"), t = this.query(".button");
		if (e.hidden = this.count == null, e.hidden) {
			t.ariaLabel = this.label;
			return;
		}
		let n = C.format(this.count + +!!this.subscribed);
		t.ariaLabel = `${this.label}, ${n} ${this.countLabel}`, s(e, n);
	}
};
//#endregion
//#region src/components/bell-button/index.js
e("bell-button", w);
//#endregion
export { w as t };
