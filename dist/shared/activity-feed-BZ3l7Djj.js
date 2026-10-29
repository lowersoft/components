import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i } from "./icons-Dv1KN71n.js";
import { n as a } from "./motion-CFWhFfc_.js";
import { t as o } from "./visibility--H4IXDjD.js";
import { it as s, k as c, q as l, tt as u, wt as d } from "./lucide-BVbUPHVq.js";
import { n as f } from "./testimonial-Cc4crTCQ.js";
//#region src/components/activity-feed/activity-feed.scss?inline
var p = ":host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:26rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));font-size:var(--lw-text-sm);border:0;border-radius:1.5rem;padding:.5rem;display:block}h2,p,ol{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.head{justify-content:space-between;align-items:center;padding:.375rem .5rem .625rem;display:flex}.title{font-size:var(--lw-text-md);font-weight:600}.live{font-size:var(--lw-text-xs);color:var(--_muted);margin-left:.25rem;font-weight:400}.live:before{content:\"\";background:var(--lw-color-accent);vertical-align:.05em;border-radius:50%;width:.375rem;height:.375rem;margin-right:.375rem;display:inline-block}.live[data-paused]:before{background:var(--_muted)}.toggle{border-radius:var(--lw-radius-md);width:1.75rem;height:1.75rem;color:var(--_muted);cursor:pointer;background:0 0;border:0;place-items:center;padding:0;display:grid}.toggle:hover{color:var(--lw-color-foreground)}.feed{border:1px solid var(--_line);background:var(--lw-color-background);border-radius:1rem;padding:.25rem;list-style:none;overflow:hidden}.item{gap:.75rem;padding:.625rem;display:flex;overflow:hidden}.avatar{flex:none;position:relative}.face{border-radius:50%;width:2.25rem;height:2.25rem;display:block;overflow:hidden}.face svg{width:100%;height:100%;display:block}.badge{border:2px solid var(--lw-color-background);background:color-mix(in oklab, var(--lw-color-foreground) 12%, var(--lw-color-background));width:1.125rem;height:1.125rem;color:var(--_muted);border-radius:50%;place-items:center;display:grid;position:absolute;bottom:-.25rem;right:-.25rem}.badge[data-kind=deploy]{color:#30a46c}.badge[data-kind=close]{color:#e5484d}.badge[data-kind=merge]{color:#8e4ec6}.text{flex:1;min-width:0}.line,.sub{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.line b{font-weight:500}.line code{font-size:var(--lw-text-xs);color:var(--_muted)}.verb{color:var(--_muted)}.sub{color:var(--_muted);margin-top:.25rem}.project{border-radius:var(--lw-radius-sm);background:color-mix(in oklab, var(--lw-color-foreground) 8%, transparent);font-size:var(--lw-text-xs);margin-right:.5rem;padding:.0625rem .375rem}.age{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;color:var(--_muted);flex:none}.age[data-fresh]{color:#f59e0b}", m = {
	invite: {
		icon: d,
		verb: "invited"
	},
	deploy: {
		icon: "<path d=\"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z\"/><path d=\"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z\"/>",
		verb: "released"
	},
	reply: {
		icon: l,
		verb: "replied on"
	},
	close: {
		icon: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/>",
		verb: "closed"
	},
	merge: {
		icon: c,
		verb: "merged"
	}
}, h = [
	{
		who: "Theo Park",
		kind: "merge",
		ref: "#419",
		what: "Lazy-load the symbol table",
		project: "runtime",
		detail: "+64 −210 in 4 files"
	},
	{
		who: "Ana Ruiz",
		kind: "close",
		ref: "#418",
		what: "ARM build drops debug info",
		project: "toolchain",
		detail: "Fixed by #421"
	},
	{
		who: "Jonas Weber",
		kind: "reply",
		ref: "#412",
		what: "Flame graph depth limit",
		project: "profiler",
		detail: "“Raise it to 2048, then measure.”"
	},
	{
		who: "Maya Lin",
		kind: "deploy",
		ref: "v0.9.2",
		what: "to the nightly channel",
		project: "runtime",
		detail: "Built in 41 s · 1.4 MB"
	},
	{
		who: "Priya Nair",
		kind: "invite",
		ref: "",
		what: "lena@northwind.dev",
		project: "workspace",
		detail: "As an editor on profiler"
	},
	{
		who: "Leo Martins",
		kind: "merge",
		ref: "#423",
		what: "SIMD path for the JSON scanner",
		project: "runtime",
		detail: "+188 −12 in 3 files"
	},
	{
		who: "Sam Okafor",
		kind: "close",
		ref: "#425",
		what: "Cold start regressed on Linux",
		project: "runtime",
		detail: "Back to 9 ms"
	}
], g = 5, _ = (e) => {
	let t = Math.floor(e / 1e3);
	return t < 10 ? "now" : t < 60 ? `${t}s` : `${Math.floor(t / 60)}m`;
}, v = class extends e {
	static styles = [r, p];
	static props = {
		interval: {
			type: Number,
			default: 3.5
		},
		paused: {
			type: Boolean,
			reflect: !0
		},
		events: {
			type: Object,
			default: h
		}
	};
	#e = 0;
	#t = 0;
	#n = 0;
	#r = !1;
	render() {
		return "<header class=\"head\"><h2 class=\"title\">Activity <span class=\"live\">Live</span></h2><button class=\"toggle\" type=\"button\"></button></header><ol class=\"feed\" role=\"log\" aria-label=\"Activity\"></ol>";
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".toggle").addEventListener("click", () => this.paused = !this.paused, e), a.matches && (this.paused = !0), o(this, (e) => {
			this.#r = e, this.#i();
		}, this.signal), this.#n = setInterval(() => this.#o(), 1e3), this.signal.addEventListener("abort", () => {
			clearTimeout(this.#t), clearInterval(this.#n);
		});
	}
	updated(e) {
		e.has("events") && !this.query(".feed").children.length && (this.events.slice(0, g).reverse().forEach((e, t) => this.#a(e, Date.now() - (g - t) * 6e3, !1)), this.#e = g % this.events.length);
		let t = this.query(".toggle");
		t.innerHTML = i(this.paused ? s : u, 16), t.ariaLabel = this.paused ? "Play" : "Pause", this.query(".live").toggleAttribute("data-paused", this.paused), this.query(".feed").ariaLive = this.paused ? "off" : "polite", this.#i();
	}
	add(e) {
		this.#a(e, Date.now(), !a.matches), this.emit("add", { event: e });
	}
	#i() {
		clearTimeout(this.#t), !this.paused && this.#r && this.events?.length && (this.#t = setTimeout(() => {
			this.add(this.events[this.#e]), this.#e = (this.#e + 1) % this.events.length, this.#i();
		}, this.interval * 1e3));
	}
	#a(e, t, r) {
		let a = m[e.kind] ?? m.merge, o = document.createElement("li");
		o.className = "item", o.dataset.at = String(t), o.innerHTML = `<span class="avatar"><span class="face"></span><span class="badge" data-kind="${n(e.kind)}">${i(a.icon, 11)}</span></span>
<div class="text"><p class="line"><b>${n(e.who)}</b> <span class="verb">${a.verb}</span> ${e.ref ? `<code>${n(e.ref)}</code> ` : ""}<span class="what">${n(e.what)}</span></p><p class="sub"><span class="project">${n(e.project)}</span><span class="detail">${n(e.detail)}</span></p></div><time class="age"></time>`, f(o.querySelector(".face"), e.who);
		let s = this.query(".feed");
		if (s.prepend(o), this.#o(), r) {
			let e = o.offsetHeight;
			o.animate({
				height: ["0px", `${e}px`],
				opacity: [0, 1],
				translate: ["0 -0.5rem", "0 0"]
			}, {
				duration: 400,
				easing: "cubic-bezier(0.23, 1, 0.32, 1)"
			});
		}
		for (; s.children.length > g;) s.lastElementChild.remove();
	}
	#o() {
		for (let e of this.shadowRoot.querySelectorAll(".item")) {
			let t = e.querySelector(".age"), n = _(Date.now() - Number(e.dataset.at));
			t.textContent !== n && (t.textContent = n), t.toggleAttribute("data-fresh", n === "now");
		}
	}
};
//#endregion
//#region src/components/activity-feed/index.js
t("activity-feed", v);
//#endregion
export { v as t };
