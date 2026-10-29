import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { n as a, t as o } from "./highlight-BSyGT8bg.js";
import { Dt as s, ct as c } from "./lucide-BVbUPHVq.js";
import { a as l, c as u, i as d, n as f, o as p, r as m, s as h, t as g } from "./issues-C8uSFb36.js";
//#region src/components/filter-search-bar/filter-search-bar.scss?inline
var _ = ".status-icon{color:var(--lw-color-muted-foreground);flex:none}.status-icon[data-status=progress]{color:#f5a524}.status-icon[data-status=review]{color:#8e4ec6}.status-icon[data-status=done]{color:#30a46c}.priority-icon{flex:none}.priority-icon rect{fill:color-mix(in oklab, var(--lw-color-foreground) 22%, transparent)}.priority-icon rect[data-on]{fill:var(--lw-color-muted-foreground)}.priority-icon[data-priority=urgent] rect{fill:#e5484d}.label-chip{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-full);font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);flex:none;align-items:center;gap:.375rem;padding:.125rem .5rem;display:inline-flex}.label-chip:before{content:\"\";background:var(--_label);border-radius:50%;width:.375rem;height:.375rem}.assignee{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));border-radius:50%;flex:none;place-items:center;width:1.5rem;height:1.5rem;font-size:.5625rem;font-weight:600;display:grid}.assignee[data-none]{border:1px dashed var(--lw-color-muted-foreground);background:0 0}:host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:44rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:.5rem;display:block}p,ul{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.box{cursor:text;flex-wrap:wrap;align-items:center;gap:.5rem;padding:.5rem .75rem;display:flex;position:relative}.icon{color:var(--_muted);display:grid}.tokens{display:contents}.token{border-radius:var(--lw-radius-md);background:color-mix(in oklab, var(--lw-color-foreground) 8%, transparent);align-items:center;gap:.375rem;padding:.25rem .375rem .25rem .625rem;display:inline-flex}@media (prefers-reduced-motion:no-preference){.token{animation:.2s ease-out token-in}}.token[data-armed]{box-shadow:0 0 0 1px var(--lw-color-foreground)}@keyframes token-in{0%{opacity:0;scale:.9}}.field{color:var(--_muted)}.op{cursor:pointer;background:0 0;border:0;padding:0}.op:hover{text-decoration:underline}.value{align-items:center;gap:.375rem;font-weight:500;display:inline-flex}.remove{border-radius:var(--lw-radius-sm);color:var(--_muted);cursor:pointer;background:0 0;border:0;place-items:center;padding:.125rem;display:grid}.remove:hover{color:var(--lw-color-foreground)}.query{min-width:10rem;height:2rem;font:var(--lw-text-md) var(--lw-font-sans);color:var(--lw-color-foreground);background:0 0;border:0;outline:none;flex:1}.query::placeholder{color:var(--_muted)}.suggestions{z-index:3;border:1px solid var(--_line);border-radius:var(--lw-radius-lg);background:var(--lw-color-background);width:min(20rem,100% - 3rem);box-shadow:var(--lw-shadow-md);padding:.25rem;position:absolute;top:calc(100% + .25rem);left:2.5rem}.suggestions[hidden]{display:none}.options{position:relative}.highlight{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.highlight{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.highlight.visible{opacity:1}.option{border-radius:var(--lw-radius-md);cursor:pointer;align-items:center;gap:.5rem;padding:.5rem .625rem;display:flex;position:relative}.option>svg,.option-field{color:var(--_muted)}.issues{border:1px solid var(--_line);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));border-radius:.875rem;padding:.25rem;list-style:none}.issue{align-items:center;gap:.75rem;padding:.625rem;display:flex}@media (prefers-reduced-motion:no-preference){.issue{animation:.2s ease-out token-in}}.id{width:4.5rem;font:var(--lw-text-xs) var(--lw-font-mono);color:var(--_muted);flex:none}.title{min-width:0;font-size:var(--lw-text-md);text-overflow:ellipsis;white-space:nowrap;flex:1;overflow:hidden}.empty{text-align:center;color:var(--_muted);padding:1.5rem}.empty[hidden]{display:none}", v = {
	status: {
		label: "Status",
		values: d.map((e) => ({
			value: e.id,
			label: e.label
		}))
	},
	priority: {
		label: "Priority",
		values: m.map((e) => ({
			value: e.id,
			label: e.label
		}))
	},
	label: {
		label: "Label",
		values: Object.keys(f).map((e) => ({
			value: e,
			label: e
		}))
	}
}, y = 6, b = (e, t) => v[e]?.values.find((e) => e.value === t)?.label ?? t, x = class extends e {
	static styles = [r, _];
	static props = {
		issues: {
			type: Object,
			default: g
		},
		filters: {
			type: Object,
			default: [{
				field: "status",
				op: "is not",
				value: "done"
			}]
		}
	};
	#e = 0;
	#t = [];
	#n = !1;
	render() {
		return `<div class="box"><span class="icon">${i(c, 18)}</span><div class="tokens"></div><input class="query" type="text" role="combobox" aria-controls="suggestions" aria-expanded="false" aria-autocomplete="list" placeholder="Add filter or search…" aria-label="Add a filter or search" autocomplete="off" spellcheck="false">
<div class="suggestions" id="suggestions" role="listbox" aria-label="Suggestions" hidden><span class="highlight"></span><div class="options"></div></div></div><ul class="issues"></ul><p class="empty" hidden>No issues match.</p><p class="live visually-hidden" aria-live="polite"></p>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".query");
		t.addEventListener("input", () => {
			this.#n = !1, this.#e = 0, this.#i(), this.#d();
		}, e), t.addEventListener("focus", () => this.#i(), e), t.addEventListener("blur", () => setTimeout(() => this.#o(), 120), e), t.addEventListener("keydown", (e) => this.#u(e), e), this.query(".tokens").addEventListener("click", (e) => {
			let t = Number(e.target.closest(".token")?.dataset.index);
			e.target.closest(".op") ? this.filters = this.filters.map((e, n) => n === t ? {
				...e,
				op: e.op === "is" ? "is not" : "is"
			} : e) : e.target.closest(".remove") && this.#l(t);
		}, e), this.query(".options").addEventListener("pointerdown", (e) => {
			let t = e.target.closest(".option");
			t && (e.preventDefault(), this.#s(Number(t.dataset.index)));
		}, e), this.query(".box").addEventListener("click", (e) => e.target.closest("button") || t.focus(), e);
	}
	updated(e) {
		e.has("filters") && this.#r(), this.#d();
	}
	#r() {
		this.query(".tokens").innerHTML = this.filters.map((e, t) => `<span class="token" data-index="${t}"><span class="field">${n(v[e.field]?.label ?? e.field)}</span><button class="op" type="button" aria-label="${n(e.op)}, change">${n(e.op)}</button><span class="value">${e.field === "status" ? u(e.value) : ""}${n(b(e.field, e.value))}</span><button class="remove" type="button" aria-label="Remove filter">${i(s, 13)}</button></span>`).join("");
	}
	#i() {
		let e = this.query(".query").value.trim(), t = e.replace(/^-/, "").toLowerCase(), r = [];
		if (t) for (let [n, i] of Object.entries(v)) for (let a of i.values) !this.filters.some((e) => e.field === n && e.value === a.value) && (a.label.toLowerCase().includes(t) || i.label.toLowerCase().startsWith(t)) && r.push({
			field: n,
			value: a.value,
			op: e.startsWith("-") ? "is not" : "is"
		});
		this.#t = r.slice(0, y);
		let a = this.query(".suggestions"), o = this.#t.map((e, t) => `<div class="option" role="option" id="suggestion-${t}" data-index="${t}"><span class="option-field">${n(v[e.field].label)} ${n(e.op)}</span>${e.field === "status" ? u(e.value) : ""}<span>${n(b(e.field, e.value))}</span></div>`);
		t && o.push(`<div class="option search-option" role="option" id="suggestion-${this.#t.length}" data-index="${this.#t.length}">${i(c, 15)}<span>Titles with “${n(e)}”</span></div>`), this.query(".options").innerHTML = o.join(""), a.hidden = !o.length, this.query(".query").ariaExpanded = String(!a.hidden), this.#a();
	}
	#a() {
		let e = [...this.shadowRoot.querySelectorAll(".option")];
		this.#e = Math.min(this.#e, Math.max(0, e.length - 1)), e.forEach((e, t) => e.ariaSelected = String(t === this.#e));
		let t = e[this.#e], n = this.query(".query");
		t ? (a(this.query(".highlight"), t), n.setAttribute("aria-activedescendant", t.id)) : (o(this.query(".highlight")), n.removeAttribute("aria-activedescendant"));
	}
	#o() {
		this.query(".suggestions").hidden = !0, this.query(".query").ariaExpanded = "false";
	}
	#s(e) {
		let t = this.#t[e], n = this.query(".query");
		t && (this.filters = [...this.filters, {
			field: t.field,
			op: t.op,
			value: t.value
		}], n.value = "", this.query(".live").textContent = `Filter added: ${v[t.field].label} ${t.op} ${b(t.field, t.value)}`), this.#o(), n.focus();
	}
	#c(e) {
		let t = e.match(/^(-?)(\w+):(\w+)$/);
		if (!t || !v[t[2]]) return null;
		let n = v[t[2]].values.find((e) => e.value.toLowerCase() === t[3].toLowerCase() || e.label.toLowerCase() === t[3].toLowerCase());
		return n ? {
			field: t[2],
			op: t[1] ? "is not" : "is",
			value: n.value
		} : null;
	}
	#l(e) {
		let [t] = this.filters.slice(e, e + 1);
		this.filters = this.filters.filter((t, n) => n !== e), t && (this.query(".live").textContent = `Filter removed: ${v[t.field]?.label} ${t.op} ${b(t.field, t.value)}`), this.query(".query").focus();
	}
	#u(e) {
		let t = e.target, n = this.shadowRoot.querySelectorAll(".option").length, r = {
			ArrowDown: 1,
			ArrowUp: -1
		}[e.key];
		if (r && n) e.preventDefault(), this.#e = (this.#e + r + n) % n, this.#a();
		else if (e.key === "Enter") {
			e.preventDefault();
			let n = this.#c(t.value.trim());
			n ? (this.filters = [...this.filters, n], t.value = "", this.#o()) : this.#e < this.#t.length ? this.#s(this.#e) : this.#o(), this.#d();
		} else if (e.key === "Escape") this.#o();
		else if (e.key === "Backspace" && !t.value && this.filters.length) {
			e.preventDefault();
			let t = this.shadowRoot.querySelector(".token:last-child");
			this.#n ? (this.#n = !1, this.#l(this.filters.length - 1)) : (this.#n = !0, t?.toggleAttribute("data-armed", !0));
		}
	}
	#d() {
		let e = this.query(".query").value.trim().toLowerCase(), t = this.#c(e) ? "" : e.replace(/^-/, ""), r = this.issues.filter((e) => this.filters.every((t) => e[t.field] === t.value == (t.op === "is")) && (!t || e.title.toLowerCase().includes(t) || e.id.toLowerCase().includes(t)));
		this.query(".issues").innerHTML = r.map((e) => `<li class="issue">${h(e.priority)}<span class="id">${n(e.id)}</span>${u(e.status)}<span class="title">${n(e.title)}</span>${p(e.label)}${l(e.assignee)}</li>`).join(""), this.query(".empty").hidden = r.length > 0, this.emit("change", {
			filters: this.filters,
			query: t,
			count: r.length
		});
	}
};
//#endregion
//#region src/components/filter-search-bar/index.js
t("filter-search-bar", x);
//#endregion
export { x as t };
