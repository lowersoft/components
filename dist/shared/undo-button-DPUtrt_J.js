import { t as e } from "./core-WcEz9YgG.js";
import { n as t } from "./dom-Dlk1FlsZ.js";
import { t as n } from "./icons-Dv1KN71n.js";
import { t as r } from "./platform-CKi8k97Y.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { t as a } from "./status-button-DsS9mbNz.js";
//#region src/components/undo-button/undo-button.scss?inline
var o = ":host([status=done]){--_bg:var(--lw-color-muted);--_fg:var(--lw-color-muted-foreground);--_border:var(--lw-color-border)}:host([status=done]) .button{cursor:default}.ring{pointer-events:none;opacity:0;width:calc(100% + 2px);height:calc(100% + 2px);transition:opacity .2s var(--lw-ease-out);position:absolute;top:-1px;left:-1px;overflow:visible}:host([status=pending]) .ring{opacity:1;transition-duration:.15s}.ring path{fill:none;stroke:var(--_fg);stroke-linecap:round;stroke-width:1.5px}.past,.seconds,kbd{color:color-mix(in oklab, var(--_fg) 60%, transparent)}.divider{background:color-mix(in oklab, var(--_fg) 20%, transparent);width:1px;height:1rem}.seconds{font-variant-numeric:tabular-nums;justify-content:center;width:1ch;height:1.25rem;line-height:1.25rem;display:inline-flex;position:relative;overflow:hidden}.seconds span{position:absolute}kbd{border:1px solid color-mix(in oklab, var(--_fg) 20%, transparent);font:inherit;border-radius:.25rem;padding-inline:.25rem;font-size:.6875rem}", s = 1.5, c = 200, l = "cubic-bezier(0.23, 1, 0.32, 1)", u = "<svg class=\"icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9 14 4 9l5-5\"/><path d=\"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5 5.5 5.5 0 0 1-5.5 5.5H11\"/></svg>", d = (e, t, n) => {
	let r = s / 2, i = Math.min(n, t / 2) - r, [a, o, c, l] = [
		r,
		e - r,
		r,
		t - r
	];
	return [
		`M ${e / 2} ${c}`,
		`H ${o - i}`,
		`A ${i} ${i} 0 0 1 ${o} ${c + i}`,
		`V ${l - i}`,
		`A ${i} ${i} 0 0 1 ${o - i} ${l}`,
		`H ${a + i}`,
		`A ${i} ${i} 0 0 1 ${a} ${l - i}`,
		`V ${c + i}`,
		`A ${i} ${i} 0 0 1 ${a + i} ${c}`,
		"Z"
	].join(" ");
}, f = class extends a {
	static styles = [...a.styles, o];
	static statuses = {
		pending: {
			icon: `<span class="past"></span><span class="divider"></span>${u}`,
			label: "undoLabel",
			after: `<span class="seconds"></span><kbd>${r ? "⌘Z" : "Ctrl Z"}</kbd>`,
			silent: !0
		},
		done: {
			icon: n,
			label: "doneLabel",
			locked: !0
		}
	};
	static props = {
		...a.props,
		doneLabel: { default: "Archived" },
		undoLabel: { default: "Undo" },
		duration: {
			type: Number,
			default: 5e3
		},
		resetAfter: {
			type: Number,
			default: 2400
		}
	};
	#e = null;
	#t = 1;
	#n = 0;
	#r = !1;
	#i = 0;
	#a = 0;
	render() {
		return super.render("<svg class=\"ring\" aria-hidden=\"true\"><path/></svg>");
	}
	connected() {
		super.connected();
		let e = this.query(".button"), t = { signal: this.signal };
		this.#e = this.query(".ring path");
		let n = (e) => (t) => t.pointerType === "mouse" && (this.#r = e);
		e.addEventListener("pointerenter", n(!0), t), e.addEventListener("pointerleave", n(!1), t), addEventListener("keydown", this.#o, t);
		let r = new ResizeObserver(() => this.#d());
		r.observe(e), this.signal.addEventListener("abort", () => {
			r.disconnect(), this.#c(), clearTimeout(this.#a);
		});
	}
	updated(e) {
		super.updated(e), e.has("doneLabel") && (this.query(".past").textContent = this.doneLabel);
	}
	handleClick() {
		this.status === "idle" ? this.emit("action") && (this.status = "pending") : this.status === "pending" && this.#l();
	}
	statusChanged(e) {
		let t = this.query(".button");
		e === "pending" ? (t.setAttribute("aria-keyshortcuts", r ? "Meta+Z" : "Control+Z"), this.query(".live").textContent = this.doneLabel, this.#s()) : (t.removeAttribute("aria-keyshortcuts"), this.#c()), e === "done" && this.resetAfter > 0 && (this.#a = setTimeout(() => this.status = "idle", this.resetAfter));
	}
	#o = (e) => {
		let n = (e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === "z";
		this.status === "pending" && n && !t(e) && (e.preventDefault(), this.#l());
	};
	#s() {
		let e = 0, t = performance.now();
		this.#t = 1, this.#d(), this.#n = 0, this.query(".seconds").replaceChildren(), this.#p(Math.ceil(this.duration / 1e3));
		let n = (r) => {
			!this.#r && !document.hidden && (e += r - t), t = r;
			let i = Math.max(0, this.duration - e);
			this.#t = i / this.duration, this.#f(), this.#p(Math.ceil(i / 1e3)), i === 0 ? (this.#i = 0, this.#u()) : this.#i = requestAnimationFrame(n);
		};
		this.#i = requestAnimationFrame(n);
	}
	#c() {
		cancelAnimationFrame(this.#i), this.#i = 0;
	}
	#l() {
		this.#c(), this.status = "idle", this.emit("undo");
	}
	#u() {
		this.status = "done", this.emit("commit");
	}
	#d() {
		let e = this.query(".button"), t = parseFloat(getComputedStyle(e).borderTopLeftRadius) || 0;
		this.#e.setAttribute("d", d(e.offsetWidth, e.offsetHeight, t)), this.#f();
	}
	#f() {
		let e = this.#e.getTotalLength();
		this.#e.style.strokeDasharray = `${e * this.#t} ${e}`;
	}
	#p(e) {
		if (e === this.#n) return;
		let t = this.query(".seconds"), n = t.lastElementChild, r = Object.assign(document.createElement("span"), { textContent: e });
		t.append(r);
		let a = n && this.#n !== 0 && !i.matches;
		if (this.#n = e, !a) {
			n?.remove();
			return;
		}
		let o = {
			duration: c,
			easing: l
		};
		r.animate({
			translate: ["0 10px", "0 0"],
			opacity: [0, 1]
		}, o), n.animate({
			translate: ["0 0", "0 -10px"],
			opacity: [1, 0]
		}, o).finished.then(() => n.remove(), () => n.remove());
	}
};
//#endregion
//#region src/components/undo-button/index.js
e("undo-button", f);
//#endregion
export { f as t };
