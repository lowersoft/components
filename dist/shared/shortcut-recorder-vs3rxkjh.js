import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./icons-HWomdoMw.js";
import { t as r } from "./icons-Dv1KN71n.js";
import { t as i } from "./platform-CKi8k97Y.js";
import { a, o, s, t as c } from "./shortcut-kjm7vAXW.js";
import { n as l } from "./motion-CFWhFfc_.js";
//#region src/components/shortcut-recorder/shortcut-recorder.scss?inline
var u = ":host{width:420px;max-width:100%;font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block}.list{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-lg);background:var(--lw-color-background);margin:0;padding:0;list-style:none;overflow:hidden}.row{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.5rem .75rem;min-height:3rem;padding:.5rem .75rem .5rem 1rem;transition:background-color .15s ease-out;display:flex}.row+.row{border-top:1px solid var(--lw-color-border)}.row[data-recording]{background:color-mix(in oklab, var(--lw-color-muted) 60%, transparent)}.name{font-weight:500}.side{align-items:center;gap:.625rem;display:flex}.binding{border-radius:var(--lw-radius-md);min-width:5rem;min-height:2rem;font:inherit;color:inherit;cursor:pointer;background:0 0;border:1px solid #0000;outline:none;justify-content:flex-end;align-items:center;gap:.25rem;padding:.25rem .5rem .375rem;transition:border-color .15s ease-out,background-color .15s ease-out;display:inline-flex}.binding:hover{background:var(--lw-color-muted)}.binding:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.binding[data-recording]{border-color:var(--lw-color-foreground);background:var(--lw-color-background);border-style:dashed}.key{--_edge:color-mix(in oklab, var(--lw-color-foreground) 22%, var(--lw-color-background));border:1px solid var(--_edge);border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--lw-color-foreground) 8%, var(--lw-color-background));min-width:1.5rem;height:1.5rem;box-shadow:0 2px 0 0 var(--_edge);color:inherit;font:inherit;justify-content:center;align-items:center;padding-inline:.375rem;font-size:.6875rem;line-height:1;display:inline-flex}@media (prefers-reduced-motion:no-preference){.key{transition:translate var(--lw-duration-fast) var(--lw-ease-out), box-shadow var(--lw-duration-fast) var(--lw-ease-out)}}.key[data-pressed]{box-shadow:none;transition-duration:75ms;translate:0 2px}.prompt,.none{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}@media (prefers-reduced-motion:no-preference){.prompt{animation:1.2s ease-in-out infinite pulse}}@keyframes pulse{50%{opacity:.45}}.saved{font-size:var(--lw-text-xs);color:var(--lw-color-accent);align-items:center;gap:.25rem;font-weight:500;display:inline-flex}.saved[hidden]{display:none}.saved .check{width:.875rem;height:.875rem}.clash{border-radius:var(--lw-radius-md);background:color-mix(in oklab, var(--lw-color-destructive) 8%, transparent);flex-basis:100%;align-items:center;gap:.5rem;padding:.5rem .625rem;display:flex}.clash[hidden]{display:none}.clash-text{font-size:var(--lw-text-xs);color:var(--lw-color-destructive);flex:1}.announce{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", d = 1600, f = /* @__PURE__ */ new Set(["Escape", "Tab"]), p = [
	{
		id: "search",
		label: "Search",
		keys: "mod+k"
	},
	{
		id: "palette",
		label: "Command palette",
		keys: "mod+shift+p"
	},
	{
		id: "new",
		label: "New document",
		keys: "mod+n"
	},
	{
		id: "save",
		label: "Save",
		keys: "mod+s"
	},
	{
		id: "sidebar",
		label: "Toggle sidebar",
		keys: "mod+b"
	}
], m = (e, t = !1) => e.map((e) => {
	let n = Object.assign(document.createElement("kbd"), {
		className: "key",
		textContent: e
	});
	return n.toggleAttribute("data-pressed", t), n;
}), h = class extends e {
	static styles = [n, u];
	static props = {
		shortcuts: {
			type: Object,
			default: p
		},
		label: { default: "Keyboard shortcuts" }
	};
	#e = null;
	#t = null;
	#n = /* @__PURE__ */ new Map();
	render() {
		return "<ul class=\"list\" part=\"list\"></ul><p class=\"announce\" aria-live=\"polite\"></p>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".list");
		t.addEventListener("click", (e) => this.#c(e), e), t.addEventListener("keydown", (e) => this.#f(e), e), t.addEventListener("keyup", (e) => this.#p(e), e), t.addEventListener("focusout", (e) => {
			this.#e && !this.query(".list").contains(e.relatedTarget) && this.#u();
		}, e), this.signal.addEventListener("abort", () => this.#n.forEach((e) => clearTimeout(e)));
	}
	updated(e) {
		e.has("label") && (this.query(".list").ariaLabel = this.label ?? ""), e.has("shortcuts") && this.#i();
	}
	get #r() {
		return Array.isArray(this.shortcuts) ? this.shortcuts : [];
	}
	#i() {
		this.query(".list").replaceChildren(...this.#r.map(({ id: e, label: t }) => {
			let n = Object.assign(document.createElement("li"), { className: "row" });
			return n.dataset.id = String(e), n.innerHTML = `<span class="name"></span><span class="side"><span class="saved" hidden>${r}Saved</span><button class="binding" type="button"></button></span><div class="clash" role="group" hidden><span class="clash-text"></span><lw-button class="replace" size="sm">Replace</lw-button><lw-button class="keep" size="sm" variant="ghost">Cancel</lw-button></div>`, n.querySelector(".name").textContent = t, this.#s(n), n;
		}));
	}
	#a(e) {
		return this.#r.find((t) => String(t.id) === e);
	}
	#o(e) {
		return this.query(`.row[data-id="${CSS.escape(e)}"]`);
	}
	#s(e) {
		let { label: t, keys: n } = this.#a(e.dataset.id), r = e.querySelector(".binding");
		if (r.removeAttribute("data-recording"), n) {
			let e = o(n);
			r.replaceChildren(...m(e.labels)), r.ariaLabel = `${t}: ${e.aria}. Press to change.`;
		} else r.replaceChildren(Object.assign(document.createElement("span"), {
			className: "none",
			textContent: "Not set"
		})), r.ariaLabel = `${t}: not set. Press to record.`;
	}
	#c(e) {
		let t = e.target.closest(".row");
		t && (e.target.closest(".replace") ? this.#h(!0) : e.target.closest(".keep") ? this.#h(!1) : e.target.closest(".binding") && (this.#e === t.dataset.id ? this.#u() : this.#l(t.dataset.id)));
	}
	#l(e) {
		this.#u(), this.#e = e;
		let t = this.#o(e);
		t.toggleAttribute("data-recording", !0);
		let n = t.querySelector(".binding");
		n.toggleAttribute("data-recording", !0), this.#d(n, []), n.focus(), this.query(".announce").textContent = "Recording. Hold the new keys, or press Escape to cancel.";
	}
	#u() {
		let e = this.#e;
		if (!e) return;
		this.#e = null;
		let t = this.#o(e);
		t && (t.removeAttribute("data-recording"), this.#s(t));
	}
	#d(e, t) {
		t.length === 0 ? e.replaceChildren(Object.assign(document.createElement("span"), {
			className: "prompt",
			textContent: "Press keys…"
		})) : e.replaceChildren(...m(a(t), !0));
	}
	#f(e) {
		let t = this.#e;
		if (!t || !e.target.closest(".binding")) return;
		if (f.has(e.key)) {
			e.key === "Escape" && (e.preventDefault(), this.#u(), this.query(".announce").textContent = "Cancelled.");
			return;
		}
		e.preventDefault();
		let n = e.target.closest(".binding"), r = s(e);
		if (!r) {
			this.#d(n, c(e));
			return;
		}
		if (r === "backspace") {
			this.#_(t, "");
			return;
		}
		let { modifiers: a, key: l } = o(r);
		if (a.length === 0 && l.length === 1) {
			this.query(".announce").textContent = `Add ${i ? "⌘, ⌥ or ⌃" : "Ctrl or Alt"} to that key.`, this.#v(n);
			return;
		}
		let u = this.#r.find((e) => e.keys === r && String(e.id) !== t);
		u ? this.#m(t, r, u) : this.#_(t, r);
	}
	#p(e) {
		let t = e.target.closest?.(".binding");
		this.#e && t?.hasAttribute("data-recording") && this.#d(t, c(e));
	}
	#m(e, t, n) {
		this.#e = null;
		let r = this.#o(e);
		r.removeAttribute("data-recording");
		let i = r.querySelector(".binding");
		i.removeAttribute("data-recording"), i.replaceChildren(...m(o(t).labels)), this.#t = {
			id: e,
			keys: t,
			from: String(n.id)
		};
		let a = r.querySelector(".clash");
		a.querySelector(".clash-text").textContent = `Already used by “${n.label}”.`, a.hidden = !1, l.matches || a.animate({
			opacity: [0, 1],
			translate: ["0 -4px", "0 0"]
		}, {
			duration: 200,
			easing: "ease-out"
		}), a.querySelector(".replace").focus(), this.query(".announce").textContent = `${o(t).aria} is already used by ${n.label}. Replace it?`;
	}
	#h(e) {
		let t = this.#t;
		if (!t) return;
		this.#t = null;
		let n = this.#o(t.id);
		n.querySelector(".clash").hidden = !0, e ? (this.#g(t.from, ""), this.#s(this.#o(t.from)), this.#_(t.id, t.keys)) : (this.#s(n), n.querySelector(".binding").focus(), this.query(".announce").textContent = "Kept the old shortcut.");
	}
	#g(e, t) {
		this.shortcuts = this.#r.map((n) => String(n.id) === e ? {
			...n,
			keys: t
		} : n);
	}
	#_(e, t) {
		this.#e = null, this.#g(e, t), this.#i();
		let n = this.#o(e);
		n.querySelector(".binding").focus();
		let r = n.querySelector(".saved");
		r.hidden = !1, l.matches || r.animate({
			opacity: [0, 1],
			translate: ["4px 0", "0 0"]
		}, {
			duration: 200,
			easing: "ease-out"
		}), clearTimeout(this.#n.get(e)), this.#n.set(e, setTimeout(() => this.#o(e)?.querySelector(".saved")?.setAttribute("hidden", ""), d));
		let { label: i } = this.#a(e);
		this.query(".announce").textContent = t ? `Saved: ${i} is ${o(t).aria}.` : `Cleared the shortcut for ${i}.`, this.emit("change", {
			id: e,
			keys: t,
			shortcuts: this.#r
		});
	}
	#v(e) {
		l.matches || e.animate({ translate: [
			"0",
			"-3px",
			"3px",
			"-2px",
			"0"
		] }, {
			duration: 240,
			easing: "ease-out"
		});
	}
};
//#endregion
//#region src/components/shortcut-recorder/index.js
t("shortcut-recorder", h);
//#endregion
export { h as t };
