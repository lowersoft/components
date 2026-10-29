import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./form-QHOiInAj.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { n as a, t as o } from "./highlight-BSyGT8bg.js";
import { n as s, t as c } from "./people-C_zYMoEl.js";
//#region src/components/mention-input/caret.js
var l = (e) => {
	let t = e.getSelection?.() ?? document.getSelection();
	if (!t || t.rangeCount === 0) return null;
	let n = t.getRangeAt(0);
	if (!e.contains(n.startContainer) && t.getComposedRanges) {
		let [r] = t.getComposedRanges({ shadowRoots: [e] });
		if (!r) return null;
		n = document.createRange(), n.setStart(r.startContainer, r.startOffset), n.setEnd(r.endContainer, r.endOffset);
	}
	return e.contains(n.startContainer) && n.collapsed ? n : null;
}, u = (e, t) => {
	let n = e.getSelection?.() ?? document.getSelection(), r = document.createRange();
	r.setStartAfter(t), r.collapse(!0), n.removeAllRanges(), n.addRange(r);
}, d = (e, t) => {
	let n = e.getSelection?.() ?? document.getSelection(), r = document.createRange();
	r.selectNodeContents(t), r.collapse(!1), n.removeAllRanges(), n.addRange(r);
}, f = ":host{--_line:color-mix(in oklab, var(--lw-color-foreground) 22%, transparent);width:440px;max-width:100%;font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block}.box{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-lg);background:var(--lw-color-background);transition:border-color .15s ease-out,box-shadow .15s ease-out;position:relative}.box:focus-within{border-color:var(--_line);box-shadow:0 0 0 3px color-mix(in oklab, var(--lw-color-ring) 30%, transparent)}:host([disabled]) .box{background:var(--lw-color-muted);opacity:.6}.editor{white-space:pre-wrap;overflow-wrap:anywhere;cursor:text;outline:none;min-height:4.5rem;max-height:12rem;padding:.75rem .875rem .25rem;line-height:1.5;overflow-y:auto}:host([data-empty]) .editor:before{content:attr(data-placeholder);color:var(--lw-color-muted-foreground);pointer-events:none}:host([disabled]) .editor{cursor:not-allowed}.mention{border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--lw-color-accent) 14%, transparent);color:var(--lw-color-accent);white-space:nowrap;-webkit-user-select:all;user-select:all;padding:0 .25rem;font-weight:500;display:inline-block}.listbox{z-index:10;overflow-anchor:none;border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-lg);background:var(--lw-color-background);width:15rem;max-height:16rem;box-shadow:var(--lw-shadow-md);margin:0;padding:.25rem;list-style:none;position:absolute;overflow-y:auto}.listbox[hidden]{display:none}@media (prefers-reduced-motion:no-preference){.listbox{animation:drop .14s var(--lw-ease-out)}}@keyframes drop{0%{opacity:0;translate:0 -4px}}.highlight{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.highlight{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.highlight.visible{opacity:1}[role=option]{border-radius:var(--lw-radius-md);cursor:pointer;align-items:center;gap:.625rem;padding:.375rem .5rem;display:flex;position:relative}.person-text{min-width:0;display:grid}.person-name{text-overflow:ellipsis;white-space:nowrap;font-weight:500;overflow:hidden}.person-handle{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}.empty{font-size:var(--lw-text-xs);text-align:center;color:var(--lw-color-muted-foreground);padding:.625rem}.avatar{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));width:1.75rem;height:1.75rem;color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));border-radius:50%;flex:none;place-items:center;font-size:.6875rem;font-weight:600;display:grid;overflow:hidden}.avatar img{object-fit:cover;width:100%;height:100%}.footer{justify-content:space-between;align-items:center;gap:.75rem;padding:.375rem .5rem .5rem .875rem;display:flex}.notify{min-width:0;font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);opacity:0;align-items:center;gap:.5rem;transition:opacity .2s ease-out;display:flex}.notify[data-shown]{opacity:1}.notify-label{white-space:nowrap}.stack{display:flex}.stack .avatar{width:1.5rem;height:1.5rem;box-shadow:0 0 0 2px var(--lw-color-background);margin-left:-.375rem;font-size:.625rem}.stack .avatar:first-child{margin-left:0}.names{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}", p = 6, m = 4, h = "cubic-bezier(0.23, 1, 0.32, 1)", g = /(?:^|\s)@([\p{L}\p{N}._-]{0,24})$/u, _ = [
	{
		id: "ada",
		name: "Ada Lovelace",
		handle: "ada"
	},
	{
		id: "alan",
		name: "Alan Turing",
		handle: "alan"
	},
	{
		id: "grace",
		name: "Grace Hopper",
		handle: "grace"
	},
	{
		id: "katherine",
		name: "Katherine Johnson",
		handle: "kjohnson"
	},
	{
		id: "linus",
		name: "Linus Torvalds",
		handle: "linus"
	},
	{
		id: "margaret",
		name: "Margaret Hamilton",
		handle: "margaret"
	},
	{
		id: "tim",
		name: "Tim Berners-Lee",
		handle: "timbl"
	}
], v = (e) => e.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase(), y = ({ name: e, avatarUrl: t }) => {
	let n = Object.assign(document.createElement("span"), { className: "avatar" });
	return t ? n.append(Object.assign(document.createElement("img"), {
		src: t,
		alt: ""
	})) : n.textContent = s(e), n.style.setProperty("--_hue", c(e)), n;
}, b = class extends r(e) {
	static styles = f;
	static props = {
		people: {
			type: Object,
			default: _
		},
		placeholder: { default: "Add a comment… Type @ to mention someone" },
		label: { default: "Comment" },
		sendLabel: { default: "Send" },
		name: {},
		disabled: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = null;
	#t = [];
	#n = 0;
	#r = !1;
	render() {
		return "<div class=\"box\"><div class=\"editor\" part=\"editor\" contenteditable=\"true\" role=\"textbox\" aria-multiline=\"true\" aria-autocomplete=\"list\" aria-controls=\"listbox\" aria-expanded=\"false\"></div><ul class=\"listbox\" id=\"listbox\" role=\"listbox\" part=\"listbox\" aria-label=\"People\" hidden><li class=\"highlight\" role=\"presentation\" aria-hidden=\"true\"></li></ul><div class=\"footer\"><div class=\"notify\" aria-live=\"polite\"><span class=\"notify-label\">Will notify</span><span class=\"stack\"></span><span class=\"names\"></span></div><lw-button class=\"send\" size=\"sm\"></lw-button></div></div>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".editor");
		t.addEventListener("input", () => this.#c(), e), t.addEventListener("keydown", (e) => this.#m(e), e), t.addEventListener("keyup", (e) => [
			"ArrowLeft",
			"ArrowRight",
			"Home",
			"End"
		].includes(e.key) && this.#l(), e), t.addEventListener("pointerup", () => this.#l(), e), t.addEventListener("blur", () => setTimeout(() => this.#d(), 120), e), t.addEventListener("paste", (e) => this.#h(e), e);
		let n = this.query(".listbox");
		n.addEventListener("pointerdown", (e) => e.preventDefault(), e), n.addEventListener("click", (e) => this.#p(Number(e.target.closest("[role=\"option\"]")?.dataset.index)), e), n.addEventListener("pointermove", (e) => {
			let t = e.target.closest("[role=\"option\"]");
			t && this.#f(Number(t.dataset.index), !1);
		}, e);
		let r = this.query(".send");
		r.addEventListener("click", () => !r.disabled && this.#g(), e);
	}
	updated(e) {
		let t = this.query(".editor");
		e.has("placeholder") && (t.dataset.placeholder = this.placeholder ?? ""), e.has("label") && (t.ariaLabel = this.label ?? ""), e.has("sendLabel") && (this.query(".send").textContent = this.sendLabel), this.#i();
	}
	formResetCallback() {
		this.clear();
	}
	formDisabledCallback(e) {
		this.#r = e, this.#i();
	}
	#i() {
		let e = this.query(".editor"), t = !!(this.disabled || this.#r);
		e.contentEditable = t ? "false" : "true", e.ariaDisabled = t ? "true" : null, this.#_();
	}
	get value() {
		return {
			text: this.#o(this.query(".editor")).trim(),
			mentions: this.#s()
		};
	}
	clear() {
		this.query(".editor").replaceChildren(), this.#d(), this.#_();
	}
	get #a() {
		return Array.isArray(this.people) ? this.people : [];
	}
	#o(e) {
		let t = "";
		for (let n of e.childNodes) n.nodeType === Node.TEXT_NODE ? t += n.data.replace(/ /g, " ") : n.classList?.contains("mention") ? t += `@${n.dataset.handle}` : n.nodeName === "BR" ? t += "\n" : ((n.nodeName === "DIV" || n.nodeName === "P") && t && !t.endsWith("\n") && (t += "\n"), t += this.#o(n));
		return t;
	}
	#s() {
		let e = /* @__PURE__ */ new Map();
		for (let t of this.query(".editor").querySelectorAll(".mention")) {
			let n = this.#a.find(({ id: e }) => String(e) === t.dataset.id);
			n && !e.has(n.id) && e.set(n.id, n);
		}
		return [...e.values()];
	}
	#c() {
		let e = this.query(".editor");
		!e.textContent && !e.querySelector(".mention") && e.replaceChildren(), this.#l(), this.#_();
	}
	#l() {
		let e = l(this.shadowRoot), t = e?.startContainer;
		if (!t || t.nodeType !== Node.TEXT_NODE || t.parentElement?.closest(".mention")) {
			this.#d();
			return;
		}
		let n = t.data.slice(0, e.startOffset).match(g);
		if (!n) {
			this.#d();
			return;
		}
		let r = n[1];
		this.#e = {
			node: t,
			start: e.startOffset - r.length - 1,
			end: e.startOffset
		}, this.#u(r, e);
	}
	#u(e, t) {
		let n = v(e), r = this.#a.filter(({ name: e, handle: t }) => !n || v(t ?? "").startsWith(n) || v(e).split(/\s+/).some((e) => e.startsWith(n))).slice(0, p);
		this.#t = r;
		let i = this.query(".listbox"), a = i.querySelector(".highlight");
		o(a);
		let s = r.map((e, t) => {
			let n = Object.assign(document.createElement("li"), {
				id: `person-${t}`,
				role: "option"
			});
			n.dataset.index = t;
			let r = Object.assign(document.createElement("span"), { className: "person-text" });
			return r.append(Object.assign(document.createElement("span"), {
				className: "person-name",
				textContent: e.name
			}), Object.assign(document.createElement("span"), {
				className: "person-handle",
				textContent: `@${e.handle}`
			})), n.append(y(e), r), n;
		});
		s.length === 0 && s.push(Object.assign(document.createElement("li"), {
			className: "empty",
			textContent: `No one called “${e}”`
		})), i.replaceChildren(a, ...s), i.hidden = !1, this.query(".editor").ariaExpanded = "true";
		let c = t.getBoundingClientRect(), l = this.query(".box").getBoundingClientRect(), u = Math.min(Math.max(c.left - l.left - 8, 0), l.width - i.offsetWidth);
		i.style.left = `${u}px`, i.style.top = `${c.bottom - l.top + 6}px`, r.length && this.#f(0);
	}
	#d() {
		this.#e = null, this.#t = [];
		let e = this.query(".listbox");
		if (e.hidden) return;
		e.hidden = !0, o(e.querySelector(".highlight"));
		let t = this.query(".editor");
		t.ariaExpanded = "false", t.removeAttribute("aria-activedescendant");
	}
	#f(e, t = !0) {
		let n = [...this.shadowRoot.querySelectorAll("[role=\"option\"]")];
		if (n.length === 0) return;
		this.#n = (e + n.length) % n.length, n.forEach((e, t) => e.ariaSelected = String(t === this.#n));
		let r = n[this.#n];
		a(this.query(".listbox .highlight"), r), t && r.scrollIntoView({ block: "nearest" }), this.query(".editor").setAttribute("aria-activedescendant", r.id);
	}
	#p(e) {
		let t = this.#t[e], n = this.#e;
		if (!t || !n) return;
		let r = document.createRange();
		r.setStart(n.node, n.start), r.setEnd(n.node, Math.min(n.end, n.node.length)), r.deleteContents();
		let a = Object.assign(document.createElement("span"), {
			className: "mention",
			contentEditable: "false",
			textContent: `@${t.name}`
		});
		a.dataset.id = String(t.id), a.dataset.handle = t.handle;
		let o = document.createTextNode("\xA0");
		r.insertNode(o), r.insertNode(a), this.#d(), this.query(".editor").focus(), u(this.shadowRoot, o), i.matches || a.animate({
			scale: [.85, 1],
			opacity: [0, 1]
		}, {
			duration: 220,
			easing: h
		}), this.#_();
	}
	#m(e) {
		let t = !this.query(".listbox").hidden && this.#t.length > 0;
		t && (e.key === "ArrowDown" || e.key === "ArrowUp") ? (e.preventDefault(), this.#f(this.#n + (e.key === "ArrowDown" ? 1 : -1))) : t && (e.key === "Enter" || e.key === "Tab") ? (e.preventDefault(), this.#p(this.#n)) : e.key === "Escape" && !this.query(".listbox").hidden ? (e.preventDefault(), this.#d()) : e.key === "Enter" && (e.ctrlKey || e.metaKey) && (e.preventDefault(), this.#g());
	}
	#h(e) {
		e.preventDefault();
		let t = e.clipboardData.getData("text/plain"), n = l(this.shadowRoot) ?? (this.shadowRoot.getSelection?.() ?? document.getSelection()).getRangeAt(0);
		n.deleteContents();
		let r = document.createTextNode(t);
		n.insertNode(r), u(this.shadowRoot, r), this.#c();
	}
	#g() {
		let e = this.value;
		!e.text || this.disabled || this.#r || this.emit("send", e) && (this.clear(), d(this.shadowRoot, this.query(".editor")));
	}
	#_() {
		let { text: e, mentions: t } = this.value, r = !!(this.disabled || this.#r);
		this.query(".send").disabled = r || !e, this.toggleAttribute("data-empty", !this.query(".editor").textContent && !this.query(".editor").querySelector(".mention")), this[n].setFormValue(this.name && e ? e : null), this.#v(t);
	}
	#v(e) {
		let t = this.query(".notify"), n = this.query(".stack");
		t.toggleAttribute("data-shown", e.length > 0);
		let r = e.slice(0, m), a = new Map([...n.children].map((e) => [e.dataset.id, e])), o = new Set(r.map(({ id: e }) => String(e)));
		for (let [e, t] of a) o.has(e) || (i.matches ? t.remove() : t.animate({
			scale: [1, .6],
			opacity: [1, 0]
		}, {
			duration: 150,
			easing: h
		}).onfinish = () => t.remove());
		r.forEach((e, t) => {
			let r = a.get(String(e.id));
			r || (r = y(e), r.dataset.id = String(e.id), r.title = e.name, i.matches || r.animate({
				scale: [.6, 1],
				opacity: [0, 1]
			}, {
				duration: 220,
				easing: "cubic-bezier(0.34, 1.4, 0.64, 1)"
			})), r.style.zIndex = String(m - t), n.append(r);
		});
		let s = e.map(({ name: e }) => e.split(" ")[0]);
		this.query(".names").textContent = s.length > 2 ? `${s.slice(0, 2).join(", ")} and ${s.length - 2} more` : s.join(" and ");
	}
};
//#endregion
//#region src/components/mention-input/index.js
t("mention-input", b);
//#endregion
export { b as t };
