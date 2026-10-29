import { n as e, t } from "./core-WcEz9YgG.js";
import { r as n, t as r } from "./dom-Dlk1FlsZ.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { i as a, n as o, r as s } from "./motion-CFWhFfc_.js";
import { d as c, m as l, p as u } from "./lucide-BVbUPHVq.js";
//#region src/components/stack-panel/stack-panel.scss?inline
var d = ":host{width:24rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);display:block}.panel{border:1px solid var(--lw-color-border);background:var(--lw-color-background);border-radius:1rem;position:relative;overflow:hidden}.header{z-index:1;border-bottom:1px solid var(--lw-color-muted);background:var(--lw-color-background);align-items:center;height:3rem;padding-inline:.5rem;display:flex;position:relative}.back{z-index:1;border-radius:var(--lw-radius-md);max-width:30%;font:var(--lw-text-sm) var(--lw-font-sans);color:var(--lw-color-muted-foreground);cursor:pointer;transition:background-color var(--lw-duration-fast) ease-out, color var(--lw-duration-fast) ease-out;background:0 0;border:0;outline:none;align-items:center;padding:.375rem .5rem .375rem .25rem;display:flex;position:relative}@media (prefers-reduced-motion:no-preference){.back{animation:.18s ease-out fade-in}}.back[hidden]{display:none}.back:hover{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.back:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.back span{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}@keyframes fade-in{0%{opacity:0}}.titles{pointer-events:none;position:absolute;inset:0}.title{inset-inline:0;text-overflow:ellipsis;white-space:nowrap;transform-origin:0;width:-moz-fit-content;width:fit-content;max-width:55%;margin:-.625rem auto 0;font-size:15px;font-weight:600;line-height:1.25rem;position:absolute;top:50%;overflow:hidden}.body{position:relative}.layer{inset-inline:0;background:var(--lw-color-background);top:0}.layer.under{pointer-events:none;position:absolute}.layer.under[hidden]{display:none}.layer.top{touch-action:pan-y;position:relative}.layer.top.lifted{box-shadow:-8px 0 24px -12px #0000002e}.shade{background:#000;position:absolute;inset:0}.page{flex-direction:column;gap:1.25rem;padding:.5rem .75rem 1rem;display:flex}section{margin:0}h3{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);margin:0 0 .375rem;padding-inline:.75rem;font-weight:500}ul{border-radius:var(--lw-radius-lg);background:color-mix(in oklab, var(--lw-color-muted) 60%, var(--lw-color-background));margin:0;padding:0;list-style:none;overflow:hidden}li+li{border-top:1px solid var(--lw-color-muted)}.footer{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);margin:.375rem 0 0;padding-inline:.75rem;line-height:1.25rem}.row{box-sizing:border-box;width:100%;min-height:2.75rem;font:inherit;text-align:left;color:inherit;background:0 0;border:0;align-items:center;gap:.5rem;padding:.5rem .75rem;display:flex}button.row{cursor:pointer;transition:background-color var(--lw-duration-fast) ease-out;outline:none}button.row:hover,button.row:focus-visible,button.row:active{background:var(--lw-color-muted)}.label{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;font-size:15px;overflow:hidden}.label.danger{color:var(--lw-color-destructive)}.detail{max-width:45%;font-size:var(--lw-text-sm);text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-muted-foreground);flex:none;overflow:hidden}.check,.chevron{flex:none;display:grid}.check.off{visibility:hidden}.chevron{color:var(--lw-color-muted-foreground);margin-right:-.25rem}.toggle{border-radius:var(--lw-radius-full);background:var(--lw-color-border);flex:none;width:2.25rem;height:22px;transition:background-color .2s ease-out;position:relative}.toggle:after{content:\"\";background:var(--lw-color-background);width:18px;height:18px;box-shadow:var(--lw-shadow-sm);border-radius:50%;transition:translate .2s cubic-bezier(.23,1,.32,1);position:absolute;top:2px;left:2px}.toggle.on{background:var(--lw-color-primary)}.toggle.on:after{translate:.875rem}", f = s(.42, 0), p = s(.34, 0), m = s(.38, 0), h = "cubic-bezier(0.23, 1, 0.32, 1)", g = .35, _ = 500, v = 6, y = (e) => !!(e.to || e.action || e.selected !== void 0 || e.checked !== void 0), b = (e) => {
	let t = [`<span class="label${e.tone === "danger" ? " danger" : ""}">${r(e.label)}</span>`];
	if (e.detail && t.push(`<span class="detail">${r(e.detail)}</span>`), e.checked !== void 0 && t.push(`<span class="toggle${e.checked ? " on" : ""}" aria-hidden="true"></span>`), e.selected !== void 0 && t.push(`<span class="check${e.selected ? "" : " off"}">${i(c)}</span>`), e.to && t.push(`<span class="chevron">${i(l)}</span>`), !y(e)) return `<div class="row">${t.join("")}</div>`;
	let n = e.checked === void 0 ? e.selected === void 0 ? "" : ` aria-pressed="${e.selected}"` : ` role="switch" aria-checked="${e.checked}"`;
	return `<button class="row" type="button" data-row="${r(e.id)}"${n}>${t.join("")}</button>`;
}, x = (e) => (e?.sections ?? []).map((e) => `<section>${e.title ? `<h3>${r(e.title)}</h3>` : ""}<ul>${e.rows.map((e) => `<li>${b(e)}</li>`).join("")}</ul>${e.footer ? `<p class="footer">${r(e.footer)}</p>` : ""}</section>`).join(""), S = class extends e {
	static styles = d;
	static props = {
		pages: {
			type: Object,
			default: {}
		},
		root: { default: "" }
	};
	#e = [];
	#t = 0;
	#n = 0;
	#r = !1;
	#i = null;
	#a = !1;
	#o = {
		x: null,
		height: null
	};
	render() {
		return `<div class="panel" part="panel">
  <div class="header"><button class="back" type="button" hidden>${i(u)}<span></span></button><div class="titles"></div></div>
  <div class="body">
    <div class="layer under" inert aria-hidden="true"><div class="page"></div><div class="shade"></div></div>
    <div class="layer top"><div class="page"></div></div>
  </div>
</div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".top");
		this.query(".back").addEventListener("click", () => this.#h(), e), t.addEventListener("click", (e) => this.#p(e), e), t.addEventListener("pointerdown", (e) => this.#_(e), e), t.addEventListener("pointermove", (e) => this.#v(e), e), t.addEventListener("pointerup", (e) => this.#y(e, !1), e), t.addEventListener("pointercancel", (e) => this.#y(e, !0), e), t.addEventListener("click", (e) => this.#b(e), {
			...e,
			capture: !0
		}), this.query(".panel").addEventListener("keydown", (e) => this.#g(e), e);
		let n = new ResizeObserver(() => !this.#r && !this.#o.height && this.#u(!0));
		n.observe(t), this.signal.addEventListener("abort", () => {
			n.disconnect();
			for (let e of Object.values(this.#o)) e?.();
		});
	}
	updated(e) {
		(e.has("root") || !this.#e.length) && (this.#e = [this.root || Object.keys(this.pages)[0]].filter(Boolean)), this.#e = this.#e.filter((e) => this.pages[e]), !this.#e.length && this.root && this.pages[this.root] && (this.#e = [this.root]), this.#c(), this.query(".titles").childElementCount || this.#f(null, 0);
	}
	get #s() {
		return this.query(".body").clientWidth || 360;
	}
	#c(e = !0) {
		let [t, r] = [this.#e.at(-2), this.#e.at(-1)], i = (e, t) => {
			let r = document.createElement("template");
			r.innerHTML = t ? x(t) : "", n(this.query(e), r.content);
		};
		i(".top .page", this.pages[r]), i(".under .page", t && this.pages[t]), this.query(".under").hidden = !t, this.query(".top").classList.toggle("lifted", !!t);
		let a = this.query(".back");
		a.hidden = !t, a.querySelector("span").textContent = t ? this.pages[t].title : "", a.ariaLabel = t ? `Back to ${this.pages[t].title}` : "", this.#l(), this.#u(e);
	}
	#l() {
		let e = this.#s;
		this.query(".top").style.transform = `translate3d(${this.#t}px, 0, 0)`, this.query(".under").style.transform = `translate3d(${-.3 * (e - this.#t)}px, 0, 0)`, this.query(".shade").style.opacity = String(.06 * (1 - this.#t / e));
	}
	#u(e) {
		let t = this.query(".top .page").offsetHeight, n = this.query(".body");
		this.#o.height?.(), this.#o.height = null;
		let r = (e) => {
			this.#n = e, n.style.height = `${e}px`;
		};
		e || !this.#n || o.matches ? r(t) : this.#o.height = a(this.#n, t, {
			...m,
			restDelta: .5,
			restSpeed: 2,
			update: r,
			done: () => this.#o.height = null
		});
	}
	#d(e, t, n = 0) {
		return this.#o.x?.(), new Promise((r) => {
			if (o.matches) {
				this.#t = e, this.#l(), r();
				return;
			}
			let i = () => {
				s(), this.#o.x = null, r();
			}, s = a(this.#t, e, {
				...t,
				velocity: n,
				update: (t) => {
					this.#t = Math.abs(t - e) < 1 ? e : t, this.#l(), this.#t === e && i();
				}
			});
			this.#o.x = i;
		});
	}
	#f(e, t) {
		let n = this.query(".titles");
		for (let e of n.children) e.classList.add("leaving"), e.animate([{ opacity: 1 }, {
			opacity: 0,
			translate: `${t * -40}px 0`
		}], {
			duration: o.matches ? 0 : 180,
			easing: h,
			fill: "forwards"
		}).finished.then(() => e.remove());
		let r = document.createElement("span");
		if (r.className = "title", r.textContent = this.pages[this.#e.at(-1)]?.title ?? "", n.append(r), !t) return;
		if (!e || o.matches) {
			r.animate([{
				opacity: 0,
				translate: `${t * 24}px 0`
			}, {
				opacity: 1,
				translate: "0 0"
			}], {
				duration: o.matches ? 0 : 280,
				easing: h
			});
			return;
		}
		let i = r.getBoundingClientRect(), s = e.fontSize / Number.parseFloat(getComputedStyle(r).fontSize), c = e.rect.left - i.left, l = e.rect.top + e.rect.height / 2 - (i.top + i.height / 2), u = 0, d = () => {
			let e = 1 - u;
			r.style.transform = `translate(${c * e}px, ${l * e}px) scale(${1 + (s - 1) * e})`;
		};
		d(), a(0, 1, {
			...f,
			restDelta: .001,
			update: (e) => {
				u = e, d();
			},
			done: () => r.style.transform = ""
		});
	}
	#p(e) {
		let t = e.target.closest("[data-row]");
		if (!t) return;
		let n = this.#e.at(-1), r = this.pages[n]?.sections.flatMap(({ rows: e }) => e).find(({ id: e }) => e === t.dataset.row);
		r && (this.emit("select", {
			page: n,
			row: r
		}), r.to && this.pages[r.to] && this.#m(r.to, t.querySelector(".label")));
	}
	#m(e, t) {
		if (this.#r) return;
		let n = {
			rect: t.getBoundingClientRect(),
			fontSize: Number.parseFloat(getComputedStyle(t).fontSize)
		};
		this.#e = [...this.#e, e], this.#t = this.#s, this.#c(!1), this.#f(n, 1), this.query(".back").focus({ preventScroll: !0 }), this.emit("navigate", {
			page: e,
			depth: this.#e.length - 1
		}), this.#d(0, f);
	}
	async #h(e = 0) {
		this.#e.length < 2 || this.#r || (this.#r = !0, await this.#d(this.#s, p, e), this.#e = this.#e.slice(0, -1), this.#t = 0, this.#c(!1), this.#f(null, -1), this.#r = !1, this.#e.length > 1 ? this.query(".back").focus({ preventScroll: !0 }) : this.query(".top [data-row]")?.focus({ preventScroll: !0 }), this.emit("navigate", {
			page: this.#e.at(-1),
			depth: this.#e.length - 1
		}));
	}
	#g(e) {
		e.key !== "Escape" || this.#e.length < 2 || (e.preventDefault(), this.#h());
	}
	#_(e) {
		this.#e.length < 2 || this.#r || e.button !== 0 || (this.#i = {
			id: e.pointerId,
			x: e.clientX,
			y: e.clientY,
			axis: null,
			samples: [{
				x: 0,
				t: e.timeStamp
			}]
		});
	}
	#v(e) {
		let t = this.#i;
		if (t?.id !== e.pointerId) return;
		let n = e.clientX - t.x;
		if (!t.axis) {
			if (Math.max(Math.abs(n), Math.abs(e.clientY - t.y)) < v) return;
			t.axis = Math.abs(n) > Math.abs(e.clientY - t.y) ? "x" : "y", t.axis === "x" && (this.query(".top").setPointerCapture?.(e.pointerId), this.#o.x?.());
		}
		t.axis === "x" && (this.#t = Math.min(Math.max(n, 0), this.#s), t.samples.push({
			x: this.#t,
			t: e.timeStamp
		}), t.samples.length > 6 && t.samples.shift(), this.#l());
	}
	#y(e, t) {
		let n = this.#i;
		if (n?.id !== e.pointerId) return;
		if (n.axis !== "x") {
			this.#i = null;
			return;
		}
		let r = n.samples[0], i = n.samples.at(-1), a = (i.x - r.x) / Math.max(i.t - r.t, 1) * 1e3;
		!t && (this.#t > this.#s * g || a > _) ? this.#h(a).then(() => this.#i = null) : (this.#i = null, this.#d(0, f, a)), this.#a = !0, setTimeout(() => this.#a = !1);
	}
	#b(e) {
		this.#a && (this.#a = !1, e.preventDefault(), e.stopImmediatePropagation());
	}
};
//#endregion
//#region src/components/stack-panel/index.js
t("stack-panel", S);
//#endregion
export { S as t };
