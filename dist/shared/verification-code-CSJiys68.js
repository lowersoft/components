import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./icons-HWomdoMw.js";
import { t as r } from "./icons-Dv1KN71n.js";
import { n as i, t as a } from "./form-QHOiInAj.js";
import { n as o } from "./motion-CFWhFfc_.js";
//#region src/components/verification-code/verification-code.scss?inline
var s = ":host{--_cell:2.75rem;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);display:inline-block}.code{justify-items:center;display:grid;position:relative}.cells{gap:.5rem;display:flex}.cells[hidden]{display:none}.cell{width:var(--_cell);height:calc(var(--_cell) * 1.15);border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);background:var(--lw-color-background);font-variant-numeric:tabular-nums;place-items:center;font-size:1.375rem;font-weight:600;transition:border-color .15s ease-out,box-shadow .15s ease-out;display:grid;position:relative}.cell[data-filled]{border-color:color-mix(in oklab, var(--lw-color-foreground) 30%, transparent)}@media (prefers-reduced-motion:no-preference){.cell[data-filled]{animation:land .18s var(--lw-ease-out)}}.cell[data-active]{border-color:var(--lw-color-foreground);box-shadow:0 0 0 3px color-mix(in oklab, var(--lw-color-ring) 30%, transparent)}.cell[data-active]:empty:after{content:\"\";background:currentColor;border-radius:1px;width:2px;height:1.25rem;animation:1s step-end infinite blink}:host([data-state=rejected]) .cell{border-color:var(--lw-color-destructive)}:host([data-state=checking]) .cell{opacity:.6}@keyframes land{0%{translate:0 3px}}@keyframes blink{50%{opacity:0}}.control{color:#0000;caret-color:#0000;opacity:0;cursor:text;background:0 0;border:0;outline:none;width:100%;height:100%;padding:0;font-size:16px;position:absolute;inset:0}.control:disabled{cursor:not-allowed}:host([data-state=verified]) .control{display:none}:host([disabled]) .cells{opacity:.5}.verified{height:calc(var(--_cell) * 1.15);border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-accent) 14%, transparent);color:var(--lw-color-accent);align-items:center;gap:.375rem;margin:0;padding:0 1.25rem;font-weight:600;display:inline-flex}.verified[hidden]{display:none}.status{min-height:1.25rem;font-size:var(--lw-text-xs);text-align:center;color:var(--lw-color-muted-foreground);margin:.625rem 0 0;line-height:1.25rem}:host([data-state=rejected]) .status{color:var(--lw-color-destructive)}", c = "cubic-bezier(0.23, 1, 0.32, 1)", l = class extends a(e) {
	static styles = [n, s];
	static shadowOptions = {
		mode: "open",
		delegatesFocus: !0
	};
	static props = {
		value: { default: "" },
		length: {
			type: Number,
			default: 6
		},
		type: { default: "numeric" },
		label: { default: "Verification code" },
		name: {},
		disabled: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = "typing";
	#t = !1;
	render() {
		return `<div class="code"><div class="cells" part="cells" aria-hidden="true"></div><input class="control" autocomplete="one-time-code" spellcheck="false" autocapitalize="characters" aria-describedby="status"><p class="verified" hidden>${r}Verified</p></div><p class="status" id="status" aria-live="polite"></p>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".control");
		t.addEventListener("input", () => this.#a(), e);
		for (let n of [
			"focus",
			"select",
			"pointerup",
			"keyup"
		]) t.addEventListener(n, () => this.#i(), e);
		t.addEventListener("focus", () => this.#l(), e), t.addEventListener("blur", () => this.#l(), e);
	}
	updated(e) {
		let t = this.query(".control");
		e.has("length") && (this.query(".cells").replaceChildren(...Array.from({ length: this.#n }, () => Object.assign(document.createElement("span"), { className: "cell" }))), t.maxLength = this.#n), e.has("type") && (t.inputMode = this.type === "alphanumeric" ? "text" : "numeric"), e.has("label") && (t.ariaLabel = this.label ?? ""), t.disabled = !!(this.disabled || this.#t), e.has("value") && t.value !== this.value && (t.value = this.#r(this.value ?? ""), this.value = t.value), this.#l();
	}
	formResetCallback() {
		this.reset();
	}
	formDisabledCallback(e) {
		this.#t = e, this.query(".control").disabled = !!(this.disabled || e);
	}
	reset() {
		this.#e = "typing", this.query(".control").value = "", this.value = "", this.query(".cells").hidden = !1, this.query(".verified").hidden = !0, this.query(".status").textContent = "", this.#l();
	}
	get #n() {
		return Math.max(1, Math.min(this.length || 6, 12));
	}
	#r(e) {
		return (this.type === "alphanumeric" ? e.replace(/[^a-z0-9]/gi, "").toUpperCase() : e.replace(/\D/g, "")).slice(0, this.#n);
	}
	#i() {
		let e = this.query(".control"), t = e.value.length;
		(e.selectionStart !== t || e.selectionEnd !== t) && e.setSelectionRange(t, t);
	}
	#a() {
		if (this.#e === "checking" || this.#e === "verified") return;
		let e = this.query(".control"), t = this.#r(e.value);
		e.value = t, this.value = t, this.#e = "typing", this.query(".status").textContent = "", this.#l(), t.length === this.#n && this.#o(t);
	}
	async #o(e) {
		if (this.emit("complete", { code: e }), !this.verify) return;
		this.#e = "checking", this.#l();
		let t = !1;
		try {
			t = await this.verify(e);
		} catch {
			t = !1;
		}
		this.value === e && (t ? this.#s() : this.#c());
	}
	#s() {
		this.#e = "verified";
		let e = [...this.query(".cells").children], t = this.query(".verified");
		this.query(".status").textContent = "Code verified.", this.query(".control").blur(), this.emit("verified", { code: this.value }), this.#l();
		let n = () => {
			this.query(".cells").hidden = !0, t.hidden = !1, o.matches || t.animate({
				scale: [.6, 1],
				opacity: [0, 1]
			}, {
				duration: 320,
				easing: "cubic-bezier(0.34, 1.4, 0.64, 1)"
			});
		};
		if (o.matches) {
			n();
			return;
		}
		let r = (e.length - 1) / 2, i = this.query(".cells").getBoundingClientRect(), a;
		e.forEach((e, t) => {
			let n = e.getBoundingClientRect(), o = i.left + i.width / 2 - (n.left + n.width / 2);
			a = e.animate({
				translate: ["0 0", `${o}px 0`],
				scale: [1, .5],
				opacity: [1, 0]
			}, {
				duration: 280,
				delay: Math.abs(t - r) * 20,
				easing: c,
				fill: "forwards"
			});
		}), a.finished.then(n, n);
	}
	#c() {
		this.#e = "rejected", this.query(".status").textContent = "That code didn’t work. Try again.", this.emit("rejected", { code: this.value });
		let e = () => {
			this.#e === "rejected" && (this.query(".control").value = "", this.value = "", this.#l(), this.query(".control").focus());
		};
		this.#l(), o.matches ? e() : this.query(".cells").animate({ translate: [
			"0",
			"-6px",
			"6px",
			"-4px",
			"4px",
			"0"
		] }, {
			duration: 360,
			easing: "ease-out"
		}).finished.then(e, e);
	}
	#l() {
		let e = this.query(".control"), t = e.value, n = this.shadowRoot.activeElement === e, r = Math.min(t.length, this.#n - 1);
		[...this.query(".cells").children].forEach((e, i) => {
			e.textContent = t[i] ?? "", e.toggleAttribute("data-filled", i < t.length), e.toggleAttribute("data-active", n && this.#e === "typing" && i === r);
		}), this.dataset.state = this.#e;
		let a = t.length === this.#n;
		this[i].setFormValue(this.name && a ? t : null);
	}
};
//#endregion
//#region src/components/verification-code/index.js
t("verification-code", l);
//#endregion
export { l as t };
