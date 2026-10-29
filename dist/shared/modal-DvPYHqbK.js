import { n as e } from "./core-WcEz9YgG.js";
import { r as t } from "./icons-Dv1KN71n.js";
import { n } from "./motion-CFWhFfc_.js";
import { Dt as r } from "./lucide-BVbUPHVq.js";
//#region src/styles/modal.scss?inline
var i = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);--_raised:color-mix(in oklab, var(--lw-color-foreground) 4%, var(--lw-color-background));font-family:var(--lw-font-sans);display:contents}.modal{box-sizing:border-box;width:var(--_width,32rem);border:1px solid var(--_line);background:var(--lw-color-background);max-width:calc(100vw - 2rem);max-height:calc(100dvh - 2rem);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);overscroll-behavior:contain;border-radius:1.25rem;padding:0;overflow:auto;box-shadow:0 24px 64px #00000059}.modal::backdrop{-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);background:#00000080}h2,h3,p,ul,ol{margin:0}a,button,input,textarea{font:inherit;color:inherit;outline:none}a:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.close{z-index:2;border-radius:var(--lw-radius-md);width:2rem;height:2rem;color:var(--_muted);cursor:pointer;background:0 0;border:0;place-items:center;padding:0;display:grid;position:absolute;top:1rem;right:1rem}.close:hover{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent);color:var(--lw-color-foreground)}.body{padding:1.5rem}.title{font-size:var(--lw-text-lg);padding-right:2.5rem;font-weight:600;line-height:1.35}.lead{font-size:var(--lw-text-md);color:var(--_muted);margin-top:.5rem;line-height:1.55}.foot{border-top:1px solid var(--_line);flex-wrap:wrap;justify-content:flex-end;align-items:center;gap:.5rem;padding:1rem 1.5rem;display:flex}", a = {
	duration: 220,
	easing: "cubic-bezier(0.23, 1, 0.32, 1)"
}, o = class extends e {
	static props = { open: {
		type: Boolean,
		reflect: !0
	} };
	#e = "dismiss";
	render() {
		return `<dialog class="modal" part="dialog" aria-labelledby="modal-title"><button class="close" type="button" aria-label="Close">${t(r, 18)}</button>${this.renderBody()}</dialog>`;
	}
	renderBody() {
		return "";
	}
	get dialog() {
		return this.query(".modal");
	}
	connected() {
		let e = { signal: this.signal }, t = this.dialog;
		this.query(".close").addEventListener("click", () => this.hide("dismiss"), e), t.addEventListener("cancel", (e) => {
			e.preventDefault(), this.hide("dismiss");
		}, e);
		let n = !1;
		t.addEventListener("pointerdown", (e) => n = e.target === t, e), t.addEventListener("click", (e) => n && e.target === t && this.hide("dismiss"), e);
	}
	updated(e) {
		if (!e.has("open")) return;
		let t = this.dialog;
		this.open && !t.open ? (t.showModal(), n.matches || t.animate({
			opacity: [0, 1],
			scale: [.96, 1],
			translate: ["0 0.5rem", "0 0"]
		}, a), this.opened?.(), this.emit("open")) : !this.open && t.open && this.#t();
	}
	hide(e = "dismiss") {
		this.#e = e, this.open = !1;
	}
	async #t() {
		let e = this.dialog;
		n.matches || await e.animate({
			opacity: [1, 0],
			scale: [1, .97]
		}, {
			...a,
			duration: 160
		}).finished.catch(() => {}), e.close(), this.emit("close", { reason: this.#e }), this.#e = "dismiss";
	}
};
//#endregion
export { i as n, o as t };
