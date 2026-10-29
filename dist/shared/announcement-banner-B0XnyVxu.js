import { n as e, t } from "./core-WcEz9YgG.js";
import { r as n } from "./icons-Dv1KN71n.js";
import { n as r } from "./motion-CFWhFfc_.js";
import { n as i, t as a } from "./swap-BK53XQML.js";
import { i as o, it as s, m as c, p as l, tt as u } from "./lucide-BVbUPHVq.js";
import { n as d, t as f } from "./banner-DyZRwpIp.js";
//#region src/components/announcement-banner/announcement-banner.scss?inline
var p = ":host{font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block;overflow:hidden;container-type:inline-size}:host([hidden]){display:none}p{margin:0}a,button{font:inherit;color:inherit;outline:none}a:focus-visible,button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.close,.icon-button{border-radius:var(--lw-radius-md);width:2rem;height:2rem;color:var(--lw-color-muted-foreground);cursor:pointer;background:0 0;border:0;flex:none;place-items:center;padding:0;display:grid}.close:hover,.icon-button:hover{color:var(--lw-color-foreground)}:host{background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background))}.bar{align-items:center;gap:1rem;min-height:3.25rem;padding:.375rem .5rem .375rem 1.25rem;display:flex}.segments{flex:none;gap:.25rem;display:flex}@container (width<=40rem){.segments{display:none}}.segment{background:color-mix(in oklab, var(--lw-color-foreground) 18%, transparent);border-radius:2px;width:1.5rem;height:3px;overflow:hidden}.segment-fill{background:var(--lw-color-foreground);transform-origin:0;height:100%;display:block;scale:0 1}[data-state=done]>.segment-fill{scale:1}[data-state=running]>.segment-fill{animation:fill var(--_interval) linear forwards}:host(:hover) [data-state=running]>.segment-fill,:host(:focus-within) [data-state=running]>.segment-fill,:host([paused]) [data-state=running]>.segment-fill{animation-play-state:paused}@keyframes fill{to{scale:1}}.message{min-width:0;font-size:var(--lw-text-md);flex:1;align-items:center;gap:.75rem;display:flex}.badge{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);font-size:var(--lw-text-sm);flex:none;align-items:center;gap:.375rem;padding:.125rem .5rem;display:inline-flex}.dot{background:#3b82f6;border-radius:50%;width:.375rem;height:.375rem}.text{white-space:nowrap;min-width:0;overflow:hidden}.text span{text-overflow:ellipsis;overflow:hidden}.link{color:var(--lw-color-muted-foreground);flex:none;align-items:center;gap:.5rem;text-decoration:none;display:inline-flex}.link[hidden]{display:none}.link .link-text{text-underline-offset:.25em;text-decoration:underline;text-decoration-thickness:1px}.link:hover{color:var(--lw-color-foreground)}@container (width<=40rem){.link{display:none}}.controls{flex:none;align-items:center;display:flex}", m = [
	{
		badge: "New",
		text: "The profiler now opens straight from a crash report",
		link: "Read the post",
		href: "#"
	},
	{
		badge: "Beta",
		text: "Cross-compile to RISC-V from any machine",
		link: "Try it",
		href: "#"
	},
	{
		badge: "Event",
		text: "Systems Night, Berlin, November 12",
		link: "Save a seat",
		href: "#"
	}
], h = class extends e {
	static styles = [i, p];
	static props = {
		index: {
			type: Number,
			default: 0,
			reflect: !0
		},
		interval: {
			type: Number,
			default: 6
		},
		paused: {
			type: Boolean,
			reflect: !0
		},
		items: {
			type: Object,
			default: m
		}
	};
	render() {
		return `<div class="bar" role="region" aria-roledescription="carousel" aria-label="Announcements"><span class="segments" aria-hidden="true"></span>
<p class="message" aria-live="polite"><span class="badge"><span class="dot"></span><span class="swap badge-text"></span></span><span class="swap text"></span><a class="link"><span class="swap link-text"></span>${n(o, 16)}</a></p>
<div class="controls"><button class="icon-button" type="button" data-step="-1" aria-label="Previous">${n(l, 18)}</button><button class="icon-button" type="button" data-step="1" aria-label="Next">${n(c, 18)}</button><button class="icon-button toggle" type="button"></button>${f()}</div></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".controls").addEventListener("click", (e) => {
			let t = e.target.closest("button");
			t && (t.dataset.step ? this.#e(this.index + Number(t.dataset.step)) : t.classList.contains("toggle") ? this.paused = !this.paused : t.classList.contains("close") && d(this));
		}, e), this.query(".segments").addEventListener("animationend", () => this.#e(this.index + 1), e), r.matches && (this.paused = !0);
	}
	updated(e) {
		this.style.setProperty("--_interval", `${this.interval}s`);
		let t = this.items ?? [], r = (this.index % t.length + t.length) % t.length, i = t[r];
		if (!i) return;
		(e.has("items") || e.has("index")) && (this.query(".segments").innerHTML = t.map((e, t) => `<span class="segment" data-state="${t < r ? "done" : t === r ? "running" : "next"}"><span class="segment-fill"></span></span>`).join("")), a(this.query(".badge-text"), i.badge ?? ""), a(this.query(".text"), i.text);
		let o = this.query(".link");
		o.hidden = !i.link, o.href = i.href ?? "#", a(this.query(".link-text"), i.link ?? "");
		let c = this.query(".toggle");
		c.innerHTML = n(this.paused ? s : u, 18), c.ariaLabel = this.paused ? "Play" : "Pause";
	}
	#e(e) {
		let t = this.items.length;
		this.index = (e % t + t) % t, this.emit("change", { index: this.index });
	}
};
//#endregion
//#region src/components/announcement-banner/index.js
t("announcement-banner", h);
//#endregion
export { h as t };
