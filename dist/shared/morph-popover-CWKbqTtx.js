import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./icons-HWomdoMw.js";
import { n as r, t as i } from "./icons-Dv1KN71n.js";
import { t as a } from "./platform-CKi8k97Y.js";
import { n as o, t as s } from "./morph-Bksu_5a3.js";
//#region src/components/morph-popover/morph-popover.scss?inline
var c = ":host(:is([status=open],[status=sending])) .shell{border-radius:var(--lw-radius-lg);box-shadow:var(--lw-shadow-md)}.trigger,.sent{white-space:nowrap;align-items:center;gap:.5rem;height:calc(2.25rem - 2px);padding-inline:.875rem;font-weight:500;display:flex}.trigger{width:100%;color:inherit;font:inherit;cursor:pointer;transition:background-color var(--lw-duration-fast) var(--lw-ease-out);background:0 0;border:0}.trigger:hover{background:var(--lw-color-muted)}.trigger:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:-3px}:host(:is([status=open],[status=sending])) .trigger:hover{background:0 0}.glyph{color:var(--lw-color-muted-foreground);display:flex}.panel{flex-direction:column;display:flex}.field{width:100%;height:7rem;color:inherit;font:inherit;resize:none;background:0 0;border:0;outline:none;padding:.5rem .875rem 0;line-height:1.625}.field::placeholder{color:var(--lw-color-muted-foreground)}.field:disabled{opacity:.6}.footer{border-top:1px solid var(--lw-color-border);background:color-mix(in oklab, var(--lw-color-muted) 60%, transparent);justify-content:space-between;align-items:center;gap:.75rem;padding:.5rem .75rem;display:flex}.hint{color:var(--lw-color-muted-foreground);font-size:var(--lw-text-xs);align-items:center;gap:.25rem;display:flex}kbd{border:1px solid var(--lw-color-border);background:var(--lw-color-background);font:inherit;border-radius:.25rem;padding-inline:.25rem;font-size:.6875rem}.hint-text{margin-left:.25rem}:host(:not([status=sending])) .sending{display:none}.panel.leaving{top:calc(2.25rem - 2px)}", l = 200, u = 80, d = 1600, f = {
	opacity: [0, 1],
	filter: ["blur(4px)", "blur(0)"]
}, p = {
	...f,
	translate: ["0 4px", "0 0"]
}, m = {
	idle: ["trigger"],
	open: ["trigger", "panel"],
	sending: ["trigger", "panel"],
	sent: ["sent"]
}, h = "<svg class=\"icon\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M2.75 4.25a1.5 1.5 0 0 1 1.5-1.5h7.5a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H7l-2.75 2.5v-2.5a1.5 1.5 0 0 1-1.5-1.5v-5Z\"/></svg>", g = class extends e {
	static styles = [
		n,
		o,
		c
	];
	static props = {
		status: {
			default: "idle",
			reflect: !0
		},
		label: { default: "Feedback" },
		placeholder: { default: "What would make this better?" },
		sendLabel: { default: "Send" },
		sendingLabel: { default: "Sending" },
		hint: { default: "to send" },
		sentLabel: { default: "Thanks!" },
		align: {
			default: "start",
			reflect: !0
		},
		width: {
			type: Number,
			default: 340
		}
	};
	#e = null;
	#t = null;
	#n = !1;
	#r = 0;
	render() {
		return `<div class="shell" part="shell"><button class="trigger" part="trigger" type="button" aria-controls="panel" aria-expanded="false"><span class="glyph"><slot name="icon">${h}</slot></span><span class="label"></span></button><form class="panel" id="panel" hidden><textarea class="field" aria-keyshortcuts="${a ? "Meta" : "Control"}+Enter"></textarea><div class="footer"><span class="hint" aria-hidden="true"><kbd>${a ? "⌘" : "Ctrl"}</kbd><kbd>↵</kbd><span class="hint-text"></span></span><lw-button class="send" type="submit" size="sm" disabled><span class="sending" slot="start">${r}</span><span class="send-text"></span></lw-button></div></form><div class="sent" hidden>${i}<span class="sent-text"></span></div></div><span class="live" aria-live="polite"></span>`;
	}
	connected() {
		this.#e ??= {
			shell: this.query(".shell"),
			trigger: this.query(".trigger"),
			panel: this.query(".panel"),
			field: this.query(".field"),
			send: this.query(".send"),
			sent: this.query(".sent")
		};
		let { shell: e, trigger: t, panel: n, field: r } = this.#e, i = { signal: this.signal };
		t.addEventListener("click", () => this.#i(), i), n.addEventListener("submit", this.#s, i), r.addEventListener("input", () => this.#c(), i), e.addEventListener("keydown", this.#a, i), document.addEventListener("pointerdown", this.#o, i), this.signal.addEventListener("abort", () => clearTimeout(this.#r));
	}
	updated(e) {
		let { trigger: t, panel: n, field: r } = this.#e;
		for (let [t, n] of Object.entries({
			label: ".label",
			hint: ".hint-text",
			sentLabel: ".sent-text"
		})) e.has(t) && (this.query(n).textContent = this[t]);
		e.has("placeholder") && (r.placeholder = this.placeholder, r.ariaLabel = this.placeholder), e.has("width") && (n.style.width = `${this.width - 2}px`), e.has("status") && this.#l(), [
			"status",
			"sendLabel",
			"sendingLabel"
		].some((t) => e.has(t)) && (this.query(".send-text").textContent = this.status === "sending" ? this.sendingLabel : this.sendLabel), t.ariaExpanded = String(m[this.status]?.includes("panel") ?? !1);
	}
	#i() {
		this.status === "idle" ? this.status = "open" : this.status === "open" && (this.status = "idle");
	}
	#a = (e) => {
		e.key === "Escape" && this.status === "open" && (e.stopPropagation(), this.status = "idle"), e.key === "Enter" && (e.metaKey || e.ctrlKey) && (e.preventDefault(), this.#s());
	};
	#o = (e) => {
		this.status === "open" && !e.composedPath().includes(this) && (this.status = "idle");
	};
	#s = (e) => {
		e?.preventDefault();
		let { field: t } = this.#e, n = t.value.trim();
		if (!n || this.status !== "open") return;
		let r = null;
		this.emit("submit", {
			value: n,
			waitUntil: (e) => r = e
		}) && (this.status = "sending", Promise.resolve(r).then(() => {
			t.value = "", this.status = "sent";
		}, () => this.status = "open"));
	};
	#c() {
		let { field: e, send: t } = this.#e, n = this.status === "sending";
		e.disabled = n, t.disabled = n || !e.value.trim();
	}
	#l() {
		let e = m[this.status] ? this.status : "idle", t = this.#t;
		if (e === t) return;
		this.#t = e;
		let { shell: n, trigger: r, field: i, panel: a } = this.#e;
		s({
			host: this,
			shell: n,
			parts: {
				trigger: r,
				panel: a,
				sent: this.#e.sent
			},
			visible: m[e],
			opening: t === "idle",
			closing: e === "idle" && t !== null,
			animate: t !== null,
			isClosed: () => this.#t === "idle",
			enter: (e) => [e === a ? p : f, {
				duration: l,
				delay: e === a ? u : 100,
				easing: "ease-out",
				fill: "backwards"
			}]
		}), this.#c(), this.query(".live").textContent = e === "sent" ? this.sentLabel : "", clearTimeout(this.#r), e === "sent" && (this.#r = setTimeout(() => this.status = "idle", d)), e === "open" && t === "idle" ? (i.focus({ preventScroll: !0 }), this.#n = !0) : e === "idle" && this.#n && (this.#n = !1, (this.matches(":focus-within") || document.activeElement === document.body) && r.focus({ preventScroll: !0 }));
	}
};
//#endregion
//#region src/components/morph-popover/index.js
t("morph-popover", g);
//#endregion
export { g as t };
