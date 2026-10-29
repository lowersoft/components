import { t as e } from "./icons-HWomdoMw.js";
import { n as t, t as n } from "./button-CQIqPjy6.js";
import { n as r } from "./motion-CFWhFfc_.js";
//#region src/components/button/status-button.scss?inline
var i = ".button{position:relative}.content{justify-content:center;align-self:stretch;align-items:center;display:flex;position:relative;overflow:hidden}.label{white-space:nowrap;flex-shrink:0;align-items:center;gap:.5rem;display:inline-flex}.label[hidden]{display:none}.label.leaving{justify-content:center;position:absolute;inset:0}.live{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", a = {
	opacity: [0, 1],
	translate: ["0 8px", "0 0"],
	filter: ["blur(2px)", "blur(0)"]
}, o = {
	opacity: [1, 0],
	translate: ["0 0", "0 -8px"],
	filter: ["blur(0)", "blur(2px)"]
}, s = 200, c = 350, l = class extends n {
	static styles = [
		t,
		e,
		i
	];
	static statuses = {};
	static props = {
		...n.props,
		status: {
			default: "idle",
			reflect: !0
		}
	};
	#e = null;
	#t = null;
	render(e = "") {
		let t = Object.entries(this.constructor.statuses).map(([e, { icon: t = "", after: n = "" }]) => `<span class="label" data-status="${e}" hidden>${t}<span class="text"></span>${n}</span>`).join("");
		return `<button class="button" part="button">${e}<span class="content"><span class="label" data-status="idle">${this.renderIdle()}</span>${t}</span><span class="live" aria-live="polite"></span></button>`;
	}
	renderIdle() {
		return "<slot name=\"start\"></slot><slot></slot><slot name=\"end\"></slot>";
	}
	connected() {
		super.connected(), this.#e ??= Object.fromEntries([...this.shadowRoot.querySelectorAll(".label")].map((e) => [e.dataset.status, e]));
	}
	updated(e) {
		super.updated(e);
		for (let [t, { label: n }] of Object.entries(this.constructor.statuses)) e.has(n) && (this.#e[t].querySelector(".text").textContent = this[n]);
		e.has("status") && this.#n();
	}
	statusChanged(e, t) {}
	#n() {
		let e = this.#e[this.status] ? this.status : "idle", t = this.#t;
		if (e === t) return;
		this.#t = e;
		let n = this.constructor.statuses[e] ?? {}, i = this.query("button");
		i.setAttribute("aria-busy", String(!!n.busy)), i.setAttribute("aria-disabled", String(!!n.locked)), this.query(".live").textContent = n.label && !n.silent ? this[n.label] : "";
		let o = this.#e[e], l = t !== null && !r.matches, u = i.offsetWidth;
		if (o.getAnimations().forEach((e) => e.cancel()), o.classList.remove("leaving"), o.hidden = !1, t !== null) this.#r(this.#e[t], l);
		else for (let e of Object.values(this.#e)) e.hidden = e !== o;
		if (l) {
			let e = getComputedStyle(this).getPropertyValue("--lw-ease-out").trim() || "ease-out";
			o.animate(a, {
				duration: s,
				easing: e
			});
			let t = i.offsetWidth;
			t !== u && i.animate({ width: [`${u}px`, `${t}px`] }, {
				duration: c,
				easing: e
			});
		}
		this.statusChanged(e, l);
	}
	#r(e, t) {
		t ? (e.classList.add("leaving"), e.animate(o, {
			duration: s,
			easing: "ease-out"
		}).finished.then(() => {
			e.classList.remove("leaving"), e.hidden = !0;
		}, () => {})) : e.hidden = !0;
	}
};
//#endregion
export { l as t };
