import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { i as r, n as i, r as a } from "./motion-CFWhFfc_.js";
import { n as o, t as s } from "./rolling-VjfpUD4B.js";
//#region src/components/status-island/status-island.scss?inline
var c = ":host{--_ease:cubic-bezier(.23, 1, .32, 1);--_spring:cubic-bezier(.34, 1.3, .64, 1);font-family:var(--lw-font-sans);flex-direction:column;align-items:center;display:flex}.announce{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.wrap{position:relative}.wrap[hidden]{display:none}.island{color:#fff;background:#09090b;border-radius:20px;position:relative;overflow:hidden;box-shadow:0 0 0 1px #ffffff0f,0 10px 15px -3px #0003}.peek{z-index:-1;opacity:0;transition:opacity .45s var(--_spring), transform .45s var(--_spring);background:#27272a;border-radius:20px;position:absolute;inset:0;box-shadow:0 0 0 1px #ffffff0d}.peek:first-child{transform:scale(.94)}.peek:nth-child(2){z-index:-2;transform:scale(.88)}.peek[data-shown]:first-child{opacity:.7;transform:translateY(-5px)scale(.94)}.peek[data-shown]:nth-child(2){opacity:.4;transform:translateY(-10px)scale(.88)}[data-open]>.peek{opacity:0;transform:none}.pill{max-width:calc(100vw - 2rem);height:2.5rem;color:inherit;font:inherit;text-align:left;cursor:pointer;background:0 0;border:0;outline:none;align-items:center;padding:0 1rem;display:flex}.pill[hidden]{display:none}.pill .row{min-width:12rem}.list{flex-direction:column;gap:.875rem;width:20rem;max-width:calc(100vw - 2rem);margin:0;padding:.875rem 1rem;list-style:none;display:flex}.list[hidden]{display:none}.row{align-items:center;gap:.625rem;min-width:0;display:flex}.icon{flex:none;width:1rem;height:1rem}.icon.done{color:#34d399}.icon.done path{stroke-dasharray:1;stroke-dashoffset:1px;animation:draw .3s var(--_ease) 80ms forwards}@media (prefers-reduced-motion:reduce){.icon.done path{stroke-dashoffset:0;animation:none}}.icon.error{color:#f87171}.icon.ring{rotate:-90deg}.icon.ring .arc{transition:stroke-dashoffset .25s var(--_ease)}@media (prefers-reduced-motion:no-preference){.icon.spinning{animation:.9s linear infinite spin}}@keyframes draw{to{stroke-dashoffset:0}}@keyframes spin{0%{rotate:-90deg}to{rotate:270deg}}.text{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;font-size:13px;line-height:1rem;overflow:hidden}.detail{color:#ffffff80}.percent{font-size:var(--lw-text-xs);color:#ffffff8c;flex:none;align-items:center;padding-left:.75rem;display:flex}.action{margin-block:-.25rem;border-radius:var(--lw-radius-full);font:500 var(--lw-text-xs) var(--lw-font-sans);color:#fff;background:#ffffff1f;border:0;flex:none;margin-left:.75rem;padding:.25rem .625rem}button.action{cursor:pointer;transition:background-color var(--lw-duration-fast) ease-out}button.action:hover{background:#fff3}button.action:focus-visible{outline:2px solid #fff9}", l = a(.45, .18), u = "cubic-bezier(0.23, 1, 0.32, 1)", d = 2, f = 2 * Math.PI * 6, p = {
	opacity: 0,
	transform: "translateY(8px)",
	filter: "blur(4px)"
}, m = {
	opacity: 1,
	transform: "none",
	filter: "blur(0px)"
}, h = (e) => [e.label, e.detail].filter(Boolean).join(", "), g = (e) => Math.min(1, Math.max(0, e)), _ = (e) => e.status === "running" && typeof e.progress == "number", v = (e) => e.status === "done" ? "<svg class=\"icon done\" viewBox=\"0 0 16 16\" fill=\"none\" aria-hidden=\"true\"><circle cx=\"8\" cy=\"8\" r=\"8\" fill=\"currentColor\" opacity=\"0.18\"/><path d=\"M4.75 8.25 7 10.5l4.25-4.75\" pathLength=\"1\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>" : e.status === "error" ? "<svg class=\"icon error\" viewBox=\"0 0 16 16\" fill=\"none\" aria-hidden=\"true\"><circle cx=\"8\" cy=\"8\" r=\"8\" fill=\"currentColor\" opacity=\"0.18\"/><path d=\"M8 4.5v4\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\"/><circle cx=\"8\" cy=\"11.25\" r=\"1\" fill=\"currentColor\"/></svg>" : `<svg class="icon ring${_(e) ? "" : " spinning"}" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-opacity="0.18" stroke-width="2"/><circle class="arc" cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="${f}" stroke-dashoffset="${f * .75}"/></svg>`, y = class extends e {
	static styles = [o, c];
	static props = {
		tasks: {
			type: Object,
			default: []
		},
		dismissAfter: {
			type: Number,
			default: 4e3
		}
	};
	#e = !1;
	#t = !1;
	#n = "";
	#r = /* @__PURE__ */ new Map();
	#i = /* @__PURE__ */ new Map();
	#a = [];
	#o = [];
	render() {
		return "<output class=\"announce\" aria-live=\"polite\"></output>\n<div class=\"wrap\" hidden>\n  <div class=\"peek\" aria-hidden=\"true\"></div><div class=\"peek\" aria-hidden=\"true\"></div>\n  <div class=\"island\" part=\"island\">\n    <button class=\"pill\" type=\"button\" aria-expanded=\"false\"></button>\n    <ul class=\"list\" hidden></ul>\n  </div>\n</div>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".island");
		t.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && this.#m(!0), e), t.addEventListener("pointerleave", (e) => e.pointerType === "mouse" && this.#m(!1), e), t.addEventListener("focusin", () => this.#m(!0), e), t.addEventListener("focusout", (e) => !t.contains(e.relatedTarget) && this.#m(!1), e), t.addEventListener("keydown", (e) => e.key === "Escape" && this.#m(!1), e), t.addEventListener("click", (e) => this.#h(e), e), document.addEventListener("pointerdown", (e) => !e.composedPath().includes(t) && this.#m(!1), e), this.signal.addEventListener("abort", () => {
			this.#_();
			for (let e of this.#o) e();
		});
	}
	updated(e) {
		e.has("tasks") && (this.#g(), this.#p(() => this.#c())), this.#v();
	}
	get #s() {
		return Array.isArray(this.tasks) ? this.tasks : [];
	}
	#c() {
		let e = this.#s, t = e.at(-1);
		if (this.#f(!!t), !t) return;
		let n = this.#e, r = this.query(".pill"), i = this.query(".list");
		r.hidden = n, i.hidden = !n, this.query(".wrap").toggleAttribute("data-open", n);
		let a = Math.min(e.length - 1, d);
		this.shadowRoot.querySelectorAll(".peek").forEach((e, t) => e.toggleAttribute("data-shown", t < a)), r.ariaLabel = `${h(t)}. ${e.length} ${e.length === 1 ? "task" : "tasks"}, show all`, n ? this.#u(e) : this.#l(t);
	}
	#l(e) {
		let t = this.query(".pill"), n = `${e.id}-${e.status}-${_(e)}`;
		(n !== this.#n || !t.firstElementChild) && (this.#n = n, t.innerHTML = "<div class=\"row\"></div>", !i.matches && this.#t && t.firstElementChild.animate([{
			...p,
			transform: "translateY(6px)"
		}, m], {
			duration: 220,
			easing: u
		})), this.#d(t.firstElementChild, e, !1);
	}
	#u(e) {
		let t = this.query(".list"), n = new Map([...t.children].map((e) => [e.dataset.id, e])), r = !t.children.length;
		for (let r of e) {
			let e = n.get(r.id);
			n.delete(r.id), e || (e = document.createElement("li"), e.dataset.id = r.id, e.innerHTML = "<div class=\"row\"></div>"), t.append(e), this.#d(e.firstElementChild, r, !0);
		}
		for (let e of n.values()) e.remove();
		r && !i.matches && t.animate([{
			opacity: 0,
			filter: "blur(4px)"
		}, {
			opacity: 1,
			filter: "blur(0px)"
		}], {
			duration: 220,
			delay: 50,
			easing: u,
			fill: "backwards"
		});
	}
	#d(e, t, r) {
		let i = `${t.status}-${_(t)}-${t.action?.label ?? ""}-${r}`;
		if (e.dataset.shape !== i) {
			e.dataset.shape = i;
			let a = "";
			if (t.action) {
				let e = n(t.action.label);
				a = r ? `<button class="action" type="button">${e}</button>` : `<span class="action">${e}</span>`;
			} else _(t) && (a = "<span class=\"percent\"><span class=\"rolling\" aria-hidden=\"true\"></span>%</span>");
			e.innerHTML = `${v(t)}<span class="text"><span class="label"></span><span class="detail"></span></span>${a}`;
		}
		if (e.querySelector(".label").textContent = t.label, e.querySelector(".detail").textContent = t.detail ? ` · ${t.detail}` : "", _(t)) {
			let n = g(t.progress);
			e.querySelector(".arc").style.strokeDashoffset = String(f * (1 - n));
			let r = e.querySelector(".rolling");
			r && s(r, String(Math.round(n * 100)));
		}
	}
	#f(e) {
		let t = this.query(".wrap");
		if (e === this.#t) return;
		if (this.#t = e, e) {
			t.hidden = !1, i.matches || t.animate([p, m], {
				duration: 220,
				easing: u
			});
			return;
		}
		this.#e = !1, this.#n = "";
		let n = () => !this.#t && (t.hidden = !0);
		i.matches ? n() : t.animate([m, p], {
			duration: 220,
			easing: u,
			fill: "forwards"
		}).finished.then((e) => {
			n(), e.cancel();
		});
	}
	#p(e) {
		let t = this.query(".island");
		for (let e of this.#o.splice(0)) e();
		let n = t.getBoundingClientRect();
		if (t.style.width = "", t.style.height = "", e(), !this.#t || !n.width || i.matches) return;
		let a = t.getBoundingClientRect();
		if (Math.abs(a.width - n.width) < .5 && Math.abs(a.height - n.height) < .5) return;
		let o = 2;
		this.#o = [[
			"width",
			n.width,
			a.width
		], [
			"height",
			n.height,
			a.height
		]].map(([e, n, i]) => (t.style[e] = `${n}px`, r(n, i, {
			...l,
			restDelta: .5,
			restSpeed: 2,
			update: (n) => t.style[e] = `${n}px`,
			done: () => {
				--o, !o && (t.style.width = "", t.style.height = "");
			}
		})));
	}
	#m(e) {
		let t = e && this.#s.length > 0;
		if (t !== this.#e) {
			if (this.#e = t, this.query(".pill").ariaExpanded = String(t), t || this.query(".list").replaceChildren(), this.#n = "", this.#p(() => this.#c()), t) for (let e of this.#i.keys()) this.#i.set(e, Date.now());
			this.#v();
		}
	}
	#h(e) {
		let t = e.target.closest(".action");
		if (t?.matches("button")) {
			e.stopPropagation();
			let n = this.#s.find(({ id: e }) => e === t.closest("li").dataset.id);
			n?.action?.onClick?.(), n && this.emit("action", { task: n });
		} else e.target.closest(".pill") && this.#m(!0);
	}
	#g() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.#s) e.add(t.id), this.#r.get(t.id) !== t.status && (this.#r.set(t.id, t.status), this.query(".announce").textContent = h(t));
		for (let t of this.#r.keys()) e.has(t) || (this.#r.delete(t), this.#i.delete(t));
	}
	#_() {
		for (let e of this.#a.splice(0)) clearTimeout(e);
	}
	#v() {
		if (this.#_(), this.#e) return;
		let e = Date.now();
		for (let t of this.#s) {
			if (t.status !== "done") continue;
			let n = this.#i.get(t.id) ?? e;
			this.#i.set(t.id, n);
			let r = Math.max(0, this.dismissAfter - (e - n));
			this.#a.push(setTimeout(() => this.#y(t.id), r));
		}
	}
	#y(e) {
		this.emit("dismiss", { id: e }) && (this.tasks = this.#s.filter((t) => t.id !== e));
	}
};
//#endregion
//#region src/components/status-island/index.js
t("status-island", y);
//#endregion
export { y as t };
