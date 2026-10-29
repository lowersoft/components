import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./icons-HWomdoMw.js";
import { n as r, t as i } from "./icons-Dv1KN71n.js";
import { n as a, t as o } from "./form-QHOiInAj.js";
import { n as s, t as c } from "./swap-BK53XQML.js";
//#region src/components/handle-input/handle-input.scss?inline
var l = ":host{--_line:color-mix(in oklab, var(--lw-color-foreground) 22%, transparent);width:360px;max-width:100%;font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block}.label{margin-bottom:.5rem;font-weight:500;display:block}.field{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);background:var(--lw-color-background);align-items:center;height:2.5rem;padding:0 .625rem 0 .75rem;transition:border-color .15s ease-out,box-shadow .15s ease-out;display:flex}.field:focus-within{border-color:var(--_line);box-shadow:0 0 0 3px color-mix(in oklab, var(--lw-color-ring) 30%, transparent)}:host([data-state=taken]) .field{border-color:color-mix(in oklab, var(--lw-color-destructive) 60%, transparent)}:host([disabled]) .field{opacity:.5}.prefix{color:var(--lw-color-muted-foreground);white-space:pre;flex:none}.control{flex:1;align-self:stretch;min-width:0;position:relative;overflow:hidden}.mirror,input{font:inherit;letter-spacing:inherit}.mirror{white-space:pre;pointer-events:none;align-items:center;display:flex;position:absolute;inset:0}input{color:#0000;width:100%;height:100%;caret-color:var(--lw-color-foreground);background:0 0;border:0;outline:none;padding:0}input::placeholder{color:var(--lw-color-muted-foreground);opacity:.6}input::selection{background:color-mix(in oklab, var(--lw-color-ring) 35%, transparent)}.flash{animation:settle .7s var(--lw-ease-out);position:relative}.flash:before{content:attr(data-from);color:var(--lw-color-muted-foreground);animation:lift .7s var(--lw-ease-out) forwards;position:absolute;left:50%;translate:-50%}.dropped{width:0;display:inline-block;position:relative}.dropped:before{content:attr(data-from);color:var(--lw-color-destructive);animation:drop .7s var(--lw-ease-out) forwards;text-decoration:line-through;position:absolute;left:0;translate:-50% -50%}@keyframes settle{0%{color:var(--lw-color-accent)}}@keyframes lift{to{opacity:0}}@keyframes drop{to{opacity:0}}@media (prefers-reduced-motion:no-preference){@keyframes lift{to{opacity:0;filter:blur(1px);translate:-50% -70%}}@keyframes drop{to{opacity:0;translate:-50% 20%}}}.state{flex:none;place-items:center;width:1rem;margin-left:.5rem;display:grid}.state>*{grid-area:1/1;display:none}:host([data-state=checking]) .state .spinner-wrap,:host([data-state=available]) .state .ok,:host([data-state=taken]) .state .no{display:grid}.spinner-wrap{color:var(--lw-color-muted-foreground)}.ok{color:var(--lw-color-accent)}.no{color:var(--lw-color-destructive)}.status{min-height:1.25rem;font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);margin:.5rem 0 0;line-height:1.25rem}:host([data-state=available]) .status{color:var(--lw-color-accent)}:host(:is([data-state=taken],[data-state=error])) .status{color:var(--lw-color-destructive)}.suggestions{flex-wrap:wrap;gap:.375rem;margin-top:.5rem;display:flex}.suggestions[hidden]{display:none}.suggestion{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-full);background:var(--lw-color-background);height:1.75rem;font:inherit;font-size:var(--lw-text-xs);color:var(--lw-color-foreground);cursor:pointer;outline:none;padding:0 .625rem;transition:background-color .15s ease-out,border-color .15s ease-out}@media (prefers-reduced-motion:no-preference){.suggestion{animation:rise .26s var(--lw-ease-out) backwards}.suggestion:nth-child(2){animation-delay:40ms}.suggestion:nth-child(3){animation-delay:80ms}}.suggestion:hover{border-color:var(--_line);background:var(--lw-color-muted)}.suggestion:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}@keyframes rise{0%{opacity:0;translate:0 4px}}", u = /[a-z0-9]/, d = /[\s_.\-/\\+]/, f = (e) => {
	let t = e.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
	return t.length === 1 && u.test(t) ? t : d.test(e) ? "-" : "";
}, p = (e, t = Infinity) => {
	let n = "", r = [];
	for (let i of e) {
		let e = f(i);
		e === "-" && (n === "" || n.endsWith("-")) && (e = ""), n.length >= t && (e = ""), e && (n += e), r.push({
			from: i,
			at: n.length - +!!e,
			fate: e === i ? "kept" : e ? "changed" : "dropped"
		});
	}
	return {
		slug: n,
		marks: r
	};
}, m = (e, t) => [
	`${e}-hq`,
	`${e}-team`,
	`get-${e}`,
	`${e}-app`,
	`try-${e}`,
	`${e}-studio`,
	...[
		2,
		3,
		4,
		5
	].map((t) => `${e}${t}`)
].filter((e) => e.length <= t), h = 450, g = 700, _ = 3, v = "<svg class=\"icon\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"m4.5 4.5 7 7m0-7-7 7\"/></svg>", y = /* @__PURE__ */ new Set([
	"lowersoft",
	"admin",
	"api",
	"app",
	"blog",
	"design",
	"docs",
	"help",
	"hello",
	"home",
	"mail",
	"studio",
	"support",
	"team",
	"www"
]), b = (e, { signal: t }) => new Promise((n, r) => {
	let i = setTimeout(() => n(!y.has(e)), 400 + Math.random() * 400);
	t.addEventListener("abort", () => {
		clearTimeout(i), r(t.reason);
	});
}), x = class extends o(e) {
	static styles = [
		n,
		s,
		l
	];
	static shadowOptions = {
		mode: "open",
		delegatesFocus: !0
	};
	static props = {
		value: { default: "" },
		prefix: { default: "lowersoft.dev/" },
		label: { default: "Workspace URL" },
		placeholder: { default: "your-team" },
		minLength: {
			type: Number,
			default: 3
		},
		maxLength: {
			type: Number,
			default: 32
		},
		name: {},
		required: { type: Boolean },
		disabled: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = "idle";
	#t = 0;
	#n = null;
	#r = null;
	#i = !1;
	render() {
		return `<label class="label" for="input"></label><div class="field" part="field"><span class="prefix"></span><span class="control"><span class="mirror" aria-hidden="true"></span><input id="input" part="input" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" aria-describedby="status"></span><span class="state" aria-hidden="true"><span class="spinner-wrap">${r}</span><span class="ok">${i}</span><span class="no">${v}</span></span></div><p class="status swap" id="status" aria-live="polite"></p><div class="suggestions" role="group" aria-label="Free alternatives" hidden></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query("input");
		t.addEventListener("input", () => this.#o(), e), t.addEventListener("change", () => this.value.endsWith("-") && this.#s(this.value.replace(/-+$/, ""), t.value.length), e);
		for (let n of [
			"scroll",
			"keyup",
			"select",
			"pointerup"
		]) t.addEventListener(n, () => this.#l(), e);
		this.query(".suggestions").addEventListener("click", (e) => this.#f(e.target.closest("button")?.dataset.handle), e), this.signal.addEventListener("abort", () => {
			clearTimeout(this.#t), this.#n?.abort(), this.#n = null;
		});
	}
	updated(e) {
		this.#r ??= this.value;
		let t = this.query("input");
		if (e.has("label") && (this.query(".label").textContent = this.label), e.has("prefix") && (this.query(".prefix").textContent = this.prefix), e.has("placeholder") && (t.placeholder = this.placeholder), t.maxLength = this.maxLength, t.required = this.required, e.has("disabled") && this.#a(), e.has("value") && t.value !== this.value) {
			let { slug: e } = p(this.value, this.maxLength);
			t.value = e, this.value = e, this.#c(), this.#u(0);
		} else (e.has("value") || this.#e === "idle") && this.#m();
	}
	formResetCallback() {
		this.value = this.#r ?? "";
	}
	formDisabledCallback(e) {
		this.#i = e, this.#a();
	}
	#a() {
		this.query("input").disabled = this.disabled || this.#i;
	}
	#o() {
		let e = this.query("input");
		this.#s(e.value, e.selectionStart ?? e.value.length);
	}
	#s(e, t) {
		let n = this.query("input"), r = this.value, { slug: i, marks: a } = p(e, this.maxLength), o = 0, s = 0;
		for (let e of a) {
			if (o >= t) break;
			o += e.from.length, s = e.fate === "dropped" ? e.at : e.at + 1;
		}
		n.value !== i && (n.value = i, n.setSelectionRange(s, s)), this.value = i, this.#c(a), i !== r && this.#u(h);
	}
	#c(e = null) {
		let t = this.query(".mirror"), n = (e, t, n) => {
			let r = Object.assign(document.createElement("span"), {
				className: e,
				textContent: t
			});
			return n && (r.dataset.from = n), r;
		}, r = e ? e.flatMap(({ from: e, at: t, fate: r }) => r === "kept" ? [n("", this.value[t])] : r === "changed" ? [n("flash", this.value[t], e)] : e.trim() ? [n("dropped", "", e)] : []) : [...this.value].map((e) => n("", e)), i = [...t.children].filter((e) => e.className !== "dropped"), a = 0;
		for (; a < i.length && a < r.length && !r[a].className && i[a].textContent === r[a].textContent;) a += 1;
		i.slice(a).forEach((e) => e.remove()), t.append(...r.slice(a)), r.some((e) => e.className === "dropped") && setTimeout(() => t.querySelectorAll(".dropped").forEach((e) => e.remove()), g), this.#l();
	}
	#l() {
		this.query(".mirror").style.translate = `${-this.query("input").scrollLeft}px 0`;
	}
	#u(e) {
		clearTimeout(this.#t), this.#n?.abort(), this.#n = null;
		let t = this.value, n = "checking";
		t ? t.length < this.minLength ? n = "short" : t.endsWith("-") && (n = "dash") : n = "idle", this.#p(n === "checking" ? "typing" : n), n === "checking" && (this.#t = setTimeout(() => this.#d(t), e));
	}
	async #d(e) {
		let t = new AbortController();
		this.#n = t, this.#p("checking");
		let n = this.checkAvailability ?? b;
		try {
			let r = await n(e, { signal: t.signal });
			if (t.signal.aborted) return;
			if (r) {
				this.#p("available"), this.emit("change", {
					value: e,
					available: !0
				});
				return;
			}
			let i = m(e, this.maxLength), a = await Promise.all(i.map((e) => n(e, { signal: t.signal }).catch(() => !1)));
			if (t.signal.aborted) return;
			this.#p("taken", i.filter((e, t) => a[t]).slice(0, _)), this.emit("change", {
				value: e,
				available: !1
			});
		} catch {
			t.signal.aborted || this.#p("error");
		} finally {
			this.#n === t && (this.#n = null);
		}
	}
	#f(e) {
		if (!e) return;
		clearTimeout(this.#t), this.#n?.abort();
		let t = this.query("input");
		t.value = e, this.value = e, this.#c(), t.focus(), t.setSelectionRange(e.length, e.length), this.#p("available"), this.emit("change", {
			value: e,
			available: !0
		});
	}
	#p(e, t = []) {
		this.#e = e, this.#m(t);
	}
	#m(e = []) {
		let t = `${this.prefix}${this.value}`, n = {
			idle: "Letters, numbers and dashes.",
			typing: "Letters, numbers and dashes.",
			short: `Use at least ${this.minLength} characters.`,
			dash: "A handle can’t end with a dash.",
			checking: `Checking ${t}…`,
			available: `${t} is available.`,
			taken: e.length ? `${t} is taken. Try one of these:` : `${t} is taken.`,
			error: "Couldn’t check right now. Try again in a moment."
		}, r = this.#e;
		this.dataset.state = r, c(this.query(".status"), n[r]);
		let i = this.query(".suggestions");
		i.hidden = r !== "taken" || e.length === 0, r === "taken" && (i.replaceChildren(...e.map((e) => Object.assign(document.createElement("button"), {
			type: "button",
			className: "suggestion",
			textContent: e,
			ariaLabel: `Use ${this.prefix}${e}`
		}))), i.querySelectorAll("button").forEach((t, n) => t.dataset.handle = e[n])), this.#h();
	}
	#h() {
		let e = this.query("input"), t = this.value;
		this[a].setFormValue(this.name && t ? t : null);
		let n = {
			short: [{ tooShort: !0 }, `Use at least ${this.minLength} characters.`],
			dash: [{ patternMismatch: !0 }, "A handle can’t end with a dash."],
			taken: [{ customError: !0 }, "That handle is taken."],
			typing: [{ customError: !0 }, "Still checking the handle."],
			checking: [{ customError: !0 }, "Still checking the handle."]
		};
		this.required && !t ? this[a].setValidity({ valueMissing: !0 }, "Choose a handle.", e) : n[this.#e] ? this[a].setValidity(...n[this.#e], e) : this[a].setValidity({});
	}
};
//#endregion
//#region src/components/handle-input/index.js
t("handle-input", x);
//#endregion
export { x as t };
