import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./icons-HWomdoMw.js";
import { t as r } from "./icons-Dv1KN71n.js";
import { n as i, t as a } from "./morph-Bksu_5a3.js";
//#region src/components/confirm-delete-button/confirm-delete-button.scss?inline
var o = ".shell{color:var(--lw-color-destructive)}:host(:is([status=confirming],[status=deleting])) .shell{border-radius:var(--lw-radius-lg);box-shadow:var(--lw-shadow-md);color:var(--lw-color-foreground)}.trigger,.done{white-space:nowrap;align-items:center;gap:.5rem;height:calc(2.25rem - 2px);padding-inline:.875rem;font-weight:500;display:flex}.trigger{width:100%;color:inherit;font:inherit;cursor:pointer;transition:background-color var(--lw-duration-fast) var(--lw-ease-out);background:0 0;border:0}.trigger:hover{background:color-mix(in oklab, var(--lw-color-destructive) 8%, transparent)}.trigger:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:-3px}.done{color:var(--lw-color-muted-foreground)}.card{gap:.75rem;padding:1rem;display:grid;position:relative}.heading{margin:0;font-weight:600}.details{color:var(--lw-color-muted-foreground);font-size:var(--lw-text-sm);line-height:1.5}.details ::slotted(*){margin:0}.confirm{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);gap:.375rem;display:grid}.confirm code{background:var(--lw-color-muted);color:var(--lw-color-foreground);font-family:var(--lw-font-mono);border-radius:.25rem;padding:0 .25rem}.field{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);height:2rem;color:var(--lw-color-foreground);font-family:var(--lw-font-mono);font-size:var(--lw-text-sm);background:0 0;padding-inline:.625rem}.field:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.field:disabled{opacity:.6}.actions{justify-content:flex-end;gap:.5rem;display:flex}.hairline{background:var(--lw-color-destructive);transform-origin:0;height:2px;position:absolute;bottom:0;left:0;right:0}", s = 200, c = 80, l = {
	opacity: [0, 1],
	filter: ["blur(4px)", "blur(0)"]
}, u = {
	...l,
	translate: ["0 4px", "0 0"]
}, d = { scale: ["1 1", "0 1"] }, f = {
	idle: ["trigger"],
	confirming: ["card"],
	deleting: ["card"],
	done: ["done"]
}, p = "<svg class=\"icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3\"/></svg>", m = class extends e {
	static styles = [
		n,
		i,
		o
	];
	static props = {
		status: {
			default: "idle",
			reflect: !0
		},
		label: { default: "Delete" },
		heading: { default: "Delete this?" },
		confirmText: {},
		confirmHint: { default: "Type {text} to confirm" },
		cancelLabel: { default: "Cancel" },
		deleteLabel: { default: "Delete" },
		doneLabel: { default: "Deleted" },
		timeout: {
			type: Number,
			default: 8e3
		},
		resetAfter: {
			type: Number,
			default: 0
		},
		width: {
			type: Number,
			default: 320
		},
		align: {
			default: "start",
			reflect: !0
		}
	};
	#e = null;
	#t = null;
	#n = null;
	#r = !1;
	#i = !1;
	#a = !1;
	#o = 0;
	render() {
		return `<div class="shell" part="shell"><button class="trigger" type="button" aria-haspopup="dialog" aria-controls="card" aria-expanded="false"><slot name="icon">${p}</slot><span class="label"></span></button><div class="card" id="card" role="alertdialog" aria-labelledby="heading" aria-describedby="details" hidden><p class="heading" id="heading"></p><div class="details" id="details"><slot></slot></div><label class="confirm" hidden><span class="hint"></span><input class="field" autocomplete="off" spellcheck="false"></label><div class="actions"><lw-button class="cancel" variant="ghost" size="sm"></lw-button><lw-button class="delete" variant="destructive" size="sm"></lw-button></div><span class="hairline"></span></div><div class="done" hidden>${r}<span class="done-text"></span></div></div><span class="live" aria-live="polite"></span>`;
	}
	connected() {
		this.#e ??= {
			shell: this.query(".shell"),
			trigger: this.query(".trigger"),
			card: this.query(".card"),
			done: this.query(".done"),
			field: this.query(".field"),
			cancel: this.query(".cancel"),
			remove: this.query(".delete")
		};
		let { trigger: e, card: t, field: n, cancel: r, remove: i } = this.#e, a = { signal: this.signal }, o = (e) => () => {
			this.#r = e, this.#d();
		};
		e.addEventListener("click", (e) => {
			this.#i = e.detail === 0, this.status = "confirming";
		}, a), r.addEventListener("click", () => this.#l(), a), i.addEventListener("click", () => this.#u(), a), n.addEventListener("input", () => this.#c(), a), t.addEventListener("keydown", (e) => {
			if (e.key === "Escape") return this.#l();
			this.#i = !0, this.#d();
		}, a), t.addEventListener("pointerenter", o(!0), a), t.addEventListener("pointerleave", o(!1), a), t.addEventListener("focusout", () => queueMicrotask(() => {
			this.matches(":focus-within") || (this.#i = !1), this.#d();
		}), a), this.signal.addEventListener("abort", () => {
			this.#n?.cancel(), clearTimeout(this.#o);
		});
	}
	updated(e) {
		let { card: t, field: n, cancel: r, remove: i } = this.#e;
		for (let [t, n] of Object.entries({
			label: ".label",
			heading: ".heading",
			doneLabel: ".done-text"
		})) e.has(t) && (this.query(n).textContent = this[t]);
		e.has("cancelLabel") && (r.textContent = this.cancelLabel), e.has("deleteLabel") && (i.textContent = this.deleteLabel), e.has("width") && (t.style.width = `${this.width - 2}px`), (e.has("confirmText") || e.has("confirmHint")) && (this.query(".confirm").hidden = !this.confirmText, this.#s(), n.value = ""), e.has("status") && this.#p(), this.#c();
	}
	#s() {
		let [e, t = ""] = this.confirmHint.split("{text}"), n = Object.assign(document.createElement("code"), { textContent: this.confirmText ?? "" });
		this.query(".hint").replaceChildren(e, n, t), this.#e.field.ariaLabel = `${e}${this.confirmText ?? ""}${t}`;
	}
	#c() {
		let { field: e, cancel: t, remove: n } = this.#e, r = this.status === "deleting";
		n.disabled = !(!this.confirmText || e.value.trim() === this.confirmText) && !r, n.loading = r, t.disabled = r, e.disabled = r;
	}
	#l() {
		this.status === "confirming" && (this.status = "idle", this.emit("cancel"));
	}
	#u() {
		let e = null;
		this.emit("confirm", { waitUntil: (t) => e = t }) && (this.status = "deleting", Promise.resolve(e).then(() => this.status = "done", () => this.status = "confirming"));
	}
	#d() {
		this.#n && (this.#r || this.#i && this.matches(":focus-within") || this.status === "deleting" ? this.#n.pause() : this.#n.play());
	}
	#f() {
		this.#n?.cancel(), this.#n = this.query(".hairline").animate(d, {
			duration: this.timeout,
			fill: "forwards"
		}), this.#n.finished.then(() => this.#l(), () => {}), this.#d();
	}
	#p() {
		let e = f[this.status] ? this.status : "idle", t = this.#t;
		if (e === t) return;
		this.#t = e;
		let { shell: n, trigger: r, card: i, done: o, field: d, cancel: p } = this.#e;
		a({
			host: this,
			shell: n,
			parts: {
				trigger: r,
				card: i,
				done: o
			},
			visible: f[e],
			opening: t === "idle",
			closing: e === "idle" && t !== null,
			animate: t !== null,
			isClosed: () => this.#t === "idle",
			enter: (e) => [e === i ? u : l, {
				duration: s,
				delay: e === i ? c : 100,
				easing: "ease-out",
				fill: "backwards"
			}]
		}), r.ariaExpanded = String(f[e].includes("card")), this.query(".live").textContent = e === "done" ? this.doneLabel : "", clearTimeout(this.#o), e === "done" && this.resetAfter > 0 && (this.#o = setTimeout(() => this.status = "idle", this.resetAfter)), e === "confirming" && t === "idle" ? (d.value = "", (this.confirmText ? d : p).focus({ preventScroll: !0 }), this.#a = !0, this.#f()) : e !== "confirming" && e !== "deleting" ? (this.#n?.cancel(), this.#n = null) : this.#d(), e === "idle" && this.#a && (this.#a = !1, (this.matches(":focus-within") || document.activeElement === document.body) && r.focus({ preventScroll: !0 }));
	}
};
//#endregion
//#region src/components/confirm-delete-button/index.js
t("confirm-delete-button", m);
//#endregion
export { m as t };
