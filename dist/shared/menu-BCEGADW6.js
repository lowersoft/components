import { t as e } from "./icons-Dv1KN71n.js";
import { n as t, t as n } from "./highlight-BSyGT8bg.js";
//#region src/styles/menu.scss?inline
var r = ".menu{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-lg);background:var(--lw-color-background);width:max-content;max-width:18rem;box-shadow:var(--lw-shadow-md);color:var(--lw-color-foreground);transform-origin:100% 0;margin:0;padding:.25rem;display:grid;position:fixed;inset:auto;overflow:visible}.menu[data-side=top]{transform-origin:100% 100%}.menu:not(:popover-open){opacity:0;display:none;scale:.96}@media (prefers-reduced-motion:no-preference){.menu{transition:opacity .15s var(--lw-ease-out), scale .15s var(--lw-ease-out), display .15s allow-discrete, overlay .15s allow-discrete}@starting-style{.menu{opacity:0;scale:.96}}}.highlight{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.highlight{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.highlight.visible{opacity:1}.item{border-radius:var(--lw-radius-md);cursor:pointer;outline:none;grid-template-columns:1rem 1fr;column-gap:.5rem;padding:.5rem .625rem;display:grid;position:relative}.item .check{visibility:hidden;grid-row:span 2;margin-top:.125rem}.item[aria-checked=true] .check{visibility:visible}.item-label{font-size:var(--lw-text-sm);font-weight:500}.item-description{color:var(--lw-color-muted-foreground);font-size:var(--lw-text-xs);line-height:1.4}.item-description:empty,.item[hidden]{display:none}.item[aria-disabled=true]{cursor:not-allowed}.item[aria-disabled=true] .item-label,.item[aria-disabled=true] .item-description{opacity:.45}.menu[data-search]{flex-direction:column;width:18rem;padding:0}.menu[data-search]:popover-open{display:flex}.menu-search{border-bottom:1px solid var(--lw-color-border);flex:none;padding:.375rem}.menu-search input{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);width:100%;height:2rem;font:inherit;font-size:var(--lw-text-sm);color:inherit;border:0;outline:none;padding:0 .625rem}.menu-search input::placeholder{color:var(--lw-color-muted-foreground)}.menu-search input:focus-visible{box-shadow:0 0 0 2px var(--lw-color-ring)}.menu-list{overscroll-behavior:contain;overflow-anchor:none;flex:1;min-height:0;padding:.25rem;display:grid;position:relative;overflow-y:auto}.menu-empty{font-size:var(--lw-text-sm);text-align:center;color:var(--lw-color-muted-foreground);margin:0;padding:1rem}.menu-empty[hidden]{display:none}.menu-tooltip{z-index:1;border-radius:var(--lw-radius-md);background:var(--lw-color-foreground);width:max-content;max-width:14rem;font-size:var(--lw-text-xs);text-align:center;color:var(--lw-color-background);pointer-events:none;padding:.375rem .625rem;line-height:1.4;position:absolute;translate:-50%}.menu-tooltip[hidden]{display:none}", i = 6, a = null, o = 8, s = (e = "menu") => `<div class="menu" part="menu" id="${e}" role="menu" popover="manual"><span class="highlight" aria-hidden="true"></span></div>`, c = s(), l = (e) => e.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase(), u = class {
	#e;
	#t;
	#n;
	#r = null;
	#i = null;
	#a = null;
	#o;
	#s;
	#c;
	constructor({ trigger: e, menu: t, onPick: n, canOpen: r = () => !0, search: i, flip: a = !i }) {
		this.#e = e, this.#t = t, this.#n = t, this.#o = n, this.#s = r, this.#c = a, i && this.#l(i), this.#a = Object.assign(document.createElement("span"), {
			className: "menu-tooltip",
			role: "tooltip",
			hidden: !0
		}), t.append(this.#a);
	}
	#l(e) {
		let t = Object.assign(document.createElement("div"), { className: "menu-search" });
		this.#r = Object.assign(document.createElement("input"), {
			type: "search",
			placeholder: e,
			autocomplete: "off",
			spellcheck: !1
		}), this.#r.ariaLabel = e, t.append(this.#r), this.#n = Object.assign(document.createElement("div"), {
			className: "menu-list",
			role: "none"
		}), this.#n.append(this.#t.querySelector(".highlight")), this.#i = Object.assign(document.createElement("p"), {
			className: "menu-empty",
			textContent: "No matches",
			hidden: !0
		}), this.#t.append(t, this.#n, this.#i), this.#t.toggleAttribute("data-search", !0);
	}
	connect(e) {
		let t = { signal: e };
		this.#e.addEventListener("click", () => this.#u ? this.close() : this.open(), t), this.#e.addEventListener("keydown", this.#v, t), this.#t.addEventListener("click", (e) => this.#h(e.target.closest(".item")), t), this.#t.addEventListener("keydown", this.#y, t), this.#t.addEventListener("pointermove", (e) => e.target.closest(".item")?.focus({ preventScroll: !0 }), t), this.#t.addEventListener("focusin", (e) => this.#g(e.target.closest(".item")), t), this.#r?.addEventListener("input", () => {
			this.#m(), this.#n.scrollTop = 0;
		}, t), document.addEventListener("pointerdown", (e) => {
			let t = e.composedPath();
			!t.includes(this.#t) && !t.includes(this.#e) && this.close();
		}, t), addEventListener("scroll", (e) => e.composedPath().includes(this.#t) || this.close(), {
			...t,
			capture: !0
		}), addEventListener("resize", () => this.close(), t);
	}
	setItems(t) {
		let n = t.map(({ value: t, label: n, description: r = "", disabled: i = !1, hint: a = "" }) => {
			let o = Object.assign(document.createElement("div"), {
				className: "item",
				role: "menuitemradio",
				tabIndex: -1
			});
			return o.dataset.value = t, o.innerHTML = `${e}<span class="item-label"></span><span class="item-description"></span>`, o.querySelector(".item-label").textContent = n, o.querySelector(".item-description").textContent = r, o.dataset.search = l(`${n} ${r} ${t}`), i && (o.ariaDisabled = "true", o.dataset.hint = a), o;
		});
		this.#n.replaceChildren(this.#n.querySelector(".highlight"), ...n), this.#a.isConnected || this.#t.append(this.#a), this.#m();
	}
	setChecked(e) {
		for (let t of this.#f) t.ariaChecked = String(t.dataset.value === e);
	}
	open(e = !1) {
		if (this.#u || !this.#s()) return;
		a?.close(), a = this, this.#r && (this.#r.value = "", this.#m()), this.#t.showPopover(), this.#d(), this.#e.ariaExpanded = "true";
		let t = this.#p, n = t.find((e) => e.ariaChecked === "true");
		this.#r ? (n?.scrollIntoView({ block: "nearest" }), this.#r.focus()) : (e ? t.at(-1) : n ?? t[0])?.focus();
	}
	close(e = !1) {
		this.#u && (a === this && (a = null), this.#t.hidePopover(), n(this.#n.querySelector(".highlight")), this.#a.hidden = !0, this.#e.ariaExpanded = "false", e && this.#e.focus());
	}
	get #u() {
		return this.#t.matches(":popover-open");
	}
	#d() {
		let e = this.#e.getBoundingClientRect(), t = this.#t;
		t.style.minWidth = `${e.width}px`, t.style.maxHeight = "";
		let { offsetWidth: n, offsetHeight: r } = t, a = innerHeight - o - (e.bottom + i), s = !this.#c || r <= a;
		s && r > a && (t.style.maxHeight = `${Math.max(a, 120)}px`);
		let c = Math.min(Math.max(e.right - n, o), innerWidth - n - o);
		t.style.left = `${c}px`, t.style.top = `${s ? e.bottom + i : e.top - i - r}px`, t.dataset.side = s ? "bottom" : "top";
	}
	get #f() {
		return [...this.#n.querySelectorAll(".item")];
	}
	get #p() {
		return this.#f.filter((e) => !e.hidden);
	}
	#m() {
		if (!this.#r) return;
		let e = l(this.#r.value.trim()), t = 0;
		for (let n of this.#f) n.hidden = !!e && !n.dataset.search.includes(e), n.hidden || (t += 1);
		this.#i.hidden = t > 0, n(this.#n.querySelector(".highlight")), this.#a.hidden = !0;
	}
	#h(e) {
		e && e.ariaDisabled !== "true" && (this.close(!0), this.#o(e.dataset.value));
	}
	#g(e) {
		t(this.#n.querySelector(".highlight"), e), this.#_(e);
	}
	#_(e) {
		let t = this.#a, n = e?.ariaDisabled === "true" ? e.dataset.hint : "";
		if (t.hidden = !n, !n) return;
		t.textContent = n;
		let r = e.getBoundingClientRect(), i = this.#t.getBoundingClientRect(), a = r.top - t.offsetHeight - 4 > i.top + (this.#r ? this.#r.offsetHeight : 0);
		t.style.left = `${r.left - i.left + r.width / 2}px`, t.style.top = `${a ? r.top - i.top - t.offsetHeight - 4 : r.bottom - i.top + 4}px`;
	}
	#v = (e) => {
		(e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), this.open(e.key === "ArrowUp"));
	};
	#y = (e) => {
		let t = this.#p, n = e.target === this.#r;
		if (e.key === "Escape") {
			e.preventDefault(), this.close(!0);
			return;
		}
		if (e.key === "Tab") {
			this.close();
			return;
		}
		if (n) {
			e.key === "ArrowDown" || e.key === "ArrowUp" ? (e.preventDefault(), (e.key === "ArrowDown" ? t[0] : t.at(-1))?.focus()) : e.key === "Enter" && (e.preventDefault(), this.#h(t.find((e) => e.ariaDisabled !== "true")));
			return;
		}
		let r = t.indexOf(e.target.closest(".item"));
		if (this.#r && (e.key === "ArrowUp" && r === 0 || e.key.length === 1 && e.key !== " ")) {
			e.key === "ArrowUp" && e.preventDefault(), this.#r.focus();
			return;
		}
		let i = {
			ArrowDown: r + 1,
			ArrowUp: r - 1,
			Home: 0,
			End: t.length - 1
		};
		e.key in i ? (e.preventDefault(), t.at(i[e.key] % t.length)?.focus()) : (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.#h(t[r]));
	};
};
//#endregion
export { r as i, u as n, s as r, c as t };
