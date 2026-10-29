//#region src/core/config.js
var e = "lw", t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new WeakMap(), r = (e) => {
	let n = t.get(e);
	return n || (n = new CSSStyleSheet(), n.replaceSync(e), t.set(e, n)), n;
}, i = (e, t) => {
	let i = n.get(t);
	i || (i = [":host{box-sizing:border-box;font-family:var(--lw-font-sans)}:host([hidden]){display:none!important}*,:before,:after{box-sizing:inherit}", t.styles].flat().filter(Boolean).map(r), n.set(t, i)), e.adoptedStyleSheets = i;
}, a = (e) => {
	let t = r(e);
	document.adoptedStyleSheets.includes(t) || (document.adoptedStyleSheets = [t, ...document.adoptedStyleSheets]);
}, o = () => a(":where(:root){--lw-font-sans:ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif;--lw-font-mono:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;--lw-text-xs:.75rem;--lw-text-sm:.875rem;--lw-text-md:1rem;--lw-text-lg:1.125rem;--lw-radius-sm:.375rem;--lw-radius-md:.5rem;--lw-radius-lg:.75rem;--lw-radius-full:9999px;--lw-duration-fast:.15s;--lw-duration-normal:.25s;--lw-duration-slow:.4s;--lw-ease-out:cubic-bezier(.22, 1, .36, 1);--lw-ease-in-out:cubic-bezier(.65, 0, .35, 1);--lw-ease-spring:cubic-bezier(.34, 1.56, .64, 1);--lw-color-background:#fff;--lw-color-foreground:#09090b;--lw-color-muted:#f4f4f5;--lw-color-muted-foreground:#71717a;--lw-color-border:#e4e4e7;--lw-color-primary:#18181b;--lw-color-primary-foreground:#fafafa;--lw-color-secondary:#f4f4f5;--lw-color-secondary-foreground:#18181b;--lw-color-ring:#a1a1aa;--lw-color-destructive:#dc2626;--lw-color-accent:#059669;--lw-color-destructive-foreground:#fff;--lw-shadow-sm:0 1px 2px #0000000d;--lw-shadow-md:0 4px 12px #00000014;--lightningcss-light:initial;--lightningcss-dark: ;color-scheme:light}@media (prefers-color-scheme:dark){:where(:root:not([data-theme=light])){--lw-color-background:#09090b;--lw-color-foreground:#fafafa;--lw-color-muted:#27272a;--lw-color-muted-foreground:#a1a1aa;--lw-color-border:#27272a;--lw-color-primary:#fafafa;--lw-color-primary-foreground:#18181b;--lw-color-secondary:#27272a;--lw-color-secondary-foreground:#fafafa;--lw-color-ring:#52525b;--lw-color-destructive:#ef4444;--lw-color-accent:#34d399;--lw-color-destructive-foreground:#fff;--lw-shadow-sm:0 1px 2px #0006;--lw-shadow-md:0 4px 12px #00000080;--lightningcss-light: ;--lightningcss-dark:initial;color-scheme:dark}}:where(:root[data-theme=dark]){--lw-color-background:#09090b;--lw-color-foreground:#fafafa;--lw-color-muted:#27272a;--lw-color-muted-foreground:#a1a1aa;--lw-color-border:#27272a;--lw-color-primary:#fafafa;--lw-color-primary-foreground:#18181b;--lw-color-secondary:#27272a;--lw-color-secondary-foreground:#fafafa;--lw-color-ring:#52525b;--lw-color-destructive:#ef4444;--lw-color-accent:#34d399;--lw-color-destructive-foreground:#fff;--lw-shadow-sm:0 1px 2px #0006;--lw-shadow-md:0 4px 12px #00000080;--lightningcss-light: ;--lightningcss-dark:initial;color-scheme:dark}"), s = Symbol("values"), c = Symbol("attrs"), l = (e) => e.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`), u = (e, t) => {
	if (e === Boolean) return t !== null;
	if (t !== null) return e === Number ? Number(t) : e === Object ? JSON.parse(t) : t;
}, d = (e) => {
	if (Object.hasOwn(e, c)) return [...e[c].keys()];
	let t = /* @__PURE__ */ new Map();
	for (let [n, { type: r = String, reflect: i = !1, default: a }] of Object.entries(e.props)) {
		let o = l(n);
		t.set(o, {
			name: n,
			type: r
		}), Object.defineProperty(e.prototype, n, {
			configurable: !0,
			get() {
				return this[s].get(n) ?? a;
			},
			set(e) {
				if (!i) return this.setValue(n, e);
				r === Boolean ? this.toggleAttribute(o, !!e) : e == null ? this.removeAttribute(o) : this.setAttribute(o, e);
			}
		});
	}
	return e[c] = t, [...t.keys()];
}, f = class extends HTMLElement {
	static styles = "";
	static props = {};
	static shadowOptions = { mode: "open" };
	static get observedAttributes() {
		return d(this);
	}
	[s] = /* @__PURE__ */ new Map();
	#e = /* @__PURE__ */ new Set();
	#t = !1;
	#n = null;
	constructor() {
		super(), i(this.attachShadow(this.constructor.shadowOptions), this.constructor);
	}
	connectedCallback() {
		this.#n = new AbortController(), this.#t || (this.#i(), this.shadowRoot.innerHTML = this.render(), this.#t = !0, this.#e = new Set(Object.keys(this.constructor.props))), this.connected(), this.#r();
	}
	disconnectedCallback() {
		this.#n.abort();
	}
	attributeChangedCallback(e, t, n) {
		if (t === n) return;
		let { name: r, type: i } = this.constructor[c].get(e);
		this.setValue(r, u(i, n));
	}
	get signal() {
		return this.#n.signal;
	}
	setValue(e, t) {
		this[s].get(e) !== t && (this[s].set(e, t), this.#e.size === 0 && this.#t && queueMicrotask(() => this.#r()), this.#e.add(e));
	}
	query(e) {
		return this.shadowRoot.querySelector(e);
	}
	emit(e, t) {
		return this.dispatchEvent(new CustomEvent(`lw-${e}`, {
			detail: t,
			bubbles: !0,
			composed: !0,
			cancelable: !0
		}));
	}
	render() {
		return "<slot></slot>";
	}
	connected() {}
	updated(e) {}
	#r() {
		if (this.#e.size === 0 || !this.isConnected) return;
		let e = this.#e;
		this.#e = /* @__PURE__ */ new Set(), this.updated(e);
	}
	#i() {
		for (let e of Object.keys(this.constructor.props)) {
			if (!Object.hasOwn(this, e)) continue;
			let t = this[e];
			delete this[e], this[e] = t;
		}
	}
}, p = (e, t) => {
	let n = `lw-${e}`;
	return customElements.get(n) || (o(), customElements.define(n, t)), n;
};
//#endregion
export { e as i, f as n, a as r, p as t };
