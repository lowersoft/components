import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./icons-HWomdoMw.js";
import { t as n } from "./icons-Dv1KN71n.js";
import { n as r } from "./motion-CFWhFfc_.js";
import { t as i } from "./field-DZ1QAD5P.js";
import { t as a } from "./field-_etHxN_N.js";
//#region src/components/password-input/password-input.scss?inline
var o = ":host{--_weak:var(--lw-color-destructive);--_fair:var(--lightningcss-light,#d97706)var(--lightningcss-dark,#fbbf24);--_good:var(--lightningcss-light,#65a30d)var(--lightningcss-dark,#a3e635);--_strong:var(--lw-color-accent)}.field{align-items:center;gap:.25rem;height:2.5rem;padding:0 .25rem 0 .75rem;display:flex}.control-wrap{flex:1;align-self:stretch;min-width:0;position:relative;overflow:hidden}.control{letter-spacing:.02em;width:100%;height:100%}:host(:is([data-revealed],[data-hiding])) .control{color:#0000}.mirror{font:inherit;letter-spacing:.02em;white-space:pre;pointer-events:none;align-items:center;display:none;position:absolute;inset:0}:host(:is([data-revealed],[data-hiding])) .mirror{display:flex}.cell{display:inline-block;position:relative}.dot{opacity:0;background:currentColor;border-radius:50%;width:.375em;height:.375em;margin:-.1875em 0 0 -.1875em;position:absolute;top:50%;left:50%}.peek{border-radius:var(--lw-radius-sm);width:2rem;height:2rem;color:var(--lw-color-muted-foreground);cursor:pointer;touch-action:none;background:0 0;border:0;flex:none;place-items:center;padding:0;transition:color .15s ease-out,background-color .15s ease-out;display:grid}.peek:hover{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.peek:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.peek .icon{grid-area:1/1}.peek .icon:last-child,.peek[aria-pressed=true] .icon:first-child{display:none}.peek[aria-pressed=true] .icon:last-child{display:block}.strength{margin-top:.625rem}.strength[hidden]{display:none}.meter{grid-template-columns:repeat(4,1fr);gap:.25rem;display:grid}.meter span{border-radius:var(--lw-radius-full);background:var(--lw-color-muted);height:.25rem;transition:background-color .25s ease-out}.strength[data-level=\"1\"] .meter span:nth-child(-n+1){background:var(--_weak)}.strength[data-level=\"2\"] .meter span:nth-child(-n+2){background:var(--_fair)}.strength[data-level=\"3\"] .meter span:nth-child(-n+3){background:var(--_good)}.strength[data-level=\"4\"] .meter span:nth-child(-n+4){background:var(--_strong)}.verdict{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);margin:.375rem 0 0}.rules-wrap{margin-top:.625rem;overflow:hidden}.rules{gap:.375rem;margin:0;padding:0;list-style:none;display:grid}.rules[hidden]{display:none}.rule{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);align-items:center;gap:.5rem;transition:color .2s ease-out;display:flex}.rule[data-met]{color:var(--lw-color-foreground)}.mark{border:1px solid var(--lw-color-border);color:#fff;border-radius:50%;flex:none;place-items:center;width:1rem;height:1rem;transition:background-color .2s ease-out,border-color .2s ease-out;display:grid}.mark .check{width:.625rem;height:.625rem;display:none}[data-met]>.mark{border-color:var(--lw-color-accent);background:var(--lw-color-accent)}[data-met]>.mark .check{display:block}.strong{font-size:var(--lw-text-xs);color:var(--lw-color-accent);align-items:center;gap:.375rem;margin:0;font-weight:500;display:flex}.strong[hidden]{display:none}.strong .check{width:.875rem;height:.875rem}", s = 1e10, c = /* @__PURE__ */ new Set([
	"password",
	"password1",
	"passw0rd",
	"123456",
	"1234567",
	"12345678",
	"123456789",
	"1234567890",
	"qwerty",
	"qwerty123",
	"abc123",
	"letmein",
	"welcome",
	"admin",
	"iloveyou",
	"monkey",
	"dragon",
	"football",
	"baseball",
	"sunshine",
	"princess",
	"trustno1",
	"111111",
	"000000"
]), l = [
	{
		test: /[a-z]/,
		size: 26
	},
	{
		test: /[A-Z]/,
		size: 26
	},
	{
		test: /\d/,
		size: 10
	},
	{
		test: /[^a-zA-Z\d]/,
		size: 33
	}
], u = (e) => [
	{
		key: "length",
		label: `At least ${e} characters`,
		test: (t) => t.length >= e
	},
	{
		key: "case",
		label: "Upper and lowercase letters",
		test: (e) => /[a-z]/.test(e) && /[A-Z]/.test(e)
	},
	{
		key: "number",
		label: "A number",
		test: (e) => /\d/.test(e)
	},
	{
		key: "symbol",
		label: "A symbol, like ! or #",
		test: (e) => /[^a-zA-Z\d\s]/.test(e)
	}
], d = (e) => {
	let t = 0;
	for (let n = 2; n < e.length; n++) {
		let [r, i, a] = [
			e.charCodeAt(n - 2),
			e.charCodeAt(n - 1),
			e.charCodeAt(n)
		];
		(r === i && i === a || i - r === a - i && Math.abs(a - i) === 1) && (t += 1);
	}
	return t;
}, f = (e) => {
	if (!e) return 0;
	if (c.has(e.toLowerCase())) return 2;
	let t = l.reduce((t, { test: n, size: r }) => t + (n.test(e) ? r : 0), 0);
	return Math.max(1, e.length - d(e)) * Math.log10(t);
}, p = [
	["year", 31557600],
	["month", 2629800],
	["day", 86400],
	["hour", 3600],
	["minute", 60],
	["second", 1]
], m = (e) => {
	if (e < 1) return "less than a second";
	if (e > 315576e4) return "centuries";
	let [t, n] = p.find(([, t]) => e >= t), r = Math.round(e / n);
	return `${r} ${t}${r === 1 ? "" : "s"}`;
}, h = (e, t = []) => {
	if (!e) return {
		level: 0,
		label: "",
		crack: ""
	};
	let n = 10 ** f(e) / s, r = 4;
	n < 3600 ? r = 1 : n < 31557600 ? r = 2 : n < 315576e5 && (r = 3), t.some((t) => !t.test(e)) && (r = Math.min(r, 2));
	let i = [
		"",
		"Weak",
		"Fair",
		"Good",
		"Strong"
	][r];
	return {
		level: r,
		label: i,
		crack: m(n)
	};
}, g = 18, _ = 160, v = "cubic-bezier(0.23, 1, 0.32, 1)", y = (e) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, b = y("<path d=\"M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>"), x = y("<path d=\"M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-2.5 3.3M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6\"/><path d=\"m3 3 18 18\"/><path d=\"M9.9 9.9a3 3 0 0 0 4.2 4.2\"/>"), S = class extends a {
	static styles = [
		t,
		i,
		o
	];
	static props = {
		...a.props,
		label: { default: "Password" },
		minlength: {
			type: Number,
			default: 8
		},
		autocomplete: { default: "new-password" }
	};
	#e = !1;
	#t = null;
	render() {
		return `${super.render()}<div class="strength" part="meter" hidden><div class="meter" aria-hidden="true"><span></span><span></span><span></span><span></span></div><p class="verdict" aria-live="polite"></p></div><div class="rules-wrap"><ul class="rules" part="rules" aria-label="Password requirements"></ul><p class="strong" hidden>${n}Strong password</p></div>`;
	}
	renderControl() {
		return `<span class="control-wrap"><input id="control" class="control" type="password" part="input" spellcheck="false" autocapitalize="none"><span class="mirror" aria-hidden="true"></span></span><button class="peek" type="button" aria-label="Show password" aria-pressed="false">${b}${x}</button>`;
	}
	connected() {
		super.connected();
		let e = { signal: this.signal }, t = this.query(".peek");
		t.addEventListener("pointerdown", (e) => {
			e.button === 0 && (e.preventDefault(), t.setPointerCapture(e.pointerId), this.#n(!0));
		}, e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, () => this.#n(!1), e);
		t.addEventListener("click", (e) => e.detail === 0 && this.#n(!this.#e), e), this.control.addEventListener("blur", () => this.#n(!1), e), this.control.addEventListener("scroll", () => this.#i(), e);
	}
	updated(e) {
		super.updated(e), e.has("minlength") && this.#a(), this.#o();
	}
	typed() {
		super.typed(), this.#e && this.#r(!1), this.#o();
	}
	customValidity() {
		let e = this.value ?? "";
		if (!e) return "";
		let t = u(this.minlength || 8).find((t) => !t.test(e));
		return t ? `Add ${t.label.charAt(0).toLowerCase()}${t.label.slice(1)}.` : "";
	}
	#n(e) {
		if (e === this.#e) return;
		this.#e = e;
		let t = this.control, n = this.query(".peek");
		if (n.ariaPressed = String(e), n.ariaLabel = e ? "Hide password" : "Show password", this.toggleAttribute("data-revealed", e), e) {
			let { selectionStart: e, selectionEnd: n } = t;
			t.type = "text", document.activeElement === this && t.setSelectionRange(e, n), this.#r(!0);
		} else this.toggleAttribute("data-hiding", !0), this.#r(!0, () => {
			this.#e || (t.type = "password", this.removeAttribute("data-hiding"));
		});
	}
	#r(e, t) {
		let n = this.query(".mirror"), i = [...this.value ?? ""];
		(n.childElementCount !== i.length || !e) && n.replaceChildren(...i.map((e) => {
			let t = Object.assign(document.createElement("span"), { className: "cell" });
			return t.append(Object.assign(document.createElement("span"), {
				className: "char",
				textContent: e
			}), Object.assign(document.createElement("span"), { className: "dot" })), t;
		})), this.#i();
		let a = this.#e, o = [...n.children];
		if (!e || r.matches || o.length === 0) {
			t?.();
			return;
		}
		let s;
		o.forEach((e, t) => {
			let n = {
				duration: _,
				delay: t * g,
				easing: v,
				fill: "both"
			}, r = e.querySelector(".char").animate({
				opacity: a ? [0, 1] : [1, 0],
				translate: a ? ["0 40%", "0 0"] : ["0 0", "0 -40%"]
			}, n);
			e.querySelector(".dot").animate({
				opacity: a ? [1, 0] : [0, 1],
				scale: a ? [1, .2] : [.2, 1]
			}, n), s = r;
		}), t && s.finished.then(t, t);
	}
	#i() {
		this.query(".mirror").style.translate = `${-this.control.scrollLeft}px 0`;
	}
	#a() {
		let e = u(this.minlength || 8);
		this.query(".rules").replaceChildren(...e.map(({ key: e, label: t }) => {
			let r = Object.assign(document.createElement("li"), { className: "rule" });
			return r.dataset.rule = e, r.insertAdjacentHTML("afterbegin", `<span class="mark" aria-hidden="true">${n}</span>`), r.append(Object.assign(document.createElement("span"), { textContent: t })), r;
		})), this.#t = null;
	}
	#o() {
		let e = this.value ?? "", t = u(this.minlength || 8), { level: n, label: r, crack: i } = h(e, t), a = this.query(".strength");
		a.hidden = !e, a.dataset.level = String(n);
		let o = `cracked in about ${i}`;
		i === "centuries" ? o = "would take centuries to crack" : i.startsWith("less") && (o = `cracked in ${i}`), this.query(".verdict").textContent = e ? `${r} · ${o}` : "";
		let s = 0;
		for (let n of t) {
			let t = n.test(e);
			t && (s += 1);
			let r = this.query(`.rule[data-rule="${n.key}"]`);
			r?.toggleAttribute("data-met", t), r && (r.ariaLabel = `${n.label}: ${t ? "done" : "not yet"}`);
		}
		this.#s(s === t.length);
	}
	#s(e) {
		if (e === this.#t) return;
		let t = this.#t === null;
		this.#t = e;
		let n = this.query(".rules"), i = this.query(".strong"), [a, o] = e ? [n, i] : [i, n];
		if (t || r.matches) {
			a.hidden = !0, o.hidden = !1;
			return;
		}
		let s = a.offsetHeight;
		a.hidden = !0, o.hidden = !1;
		let c = o.offsetHeight;
		this.query(".rules-wrap").animate({ height: [`${s}px`, `${c}px`] }, {
			duration: 260,
			easing: v
		}), o.animate({
			opacity: [0, 1],
			translate: ["0 -4px", "0 0"]
		}, {
			duration: 220,
			easing: v
		});
	}
};
//#endregion
//#region src/components/password-input/index.js
e("password-input", S);
//#endregion
export { S as t };
