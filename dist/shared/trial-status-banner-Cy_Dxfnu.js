import { n as e, t } from "./core-WcEz9YgG.js";
import { a as n, c as r, f as i, r as a, t as o } from "./dates-Cwd3k25x.js";
import { n as s, t as c } from "./banner-DyZRwpIp.js";
//#region src/components/trial-status-banner/trial-status-banner.scss?inline
var l = ":host{font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block;overflow:hidden;container-type:inline-size}:host([hidden]){display:none}p{margin:0}a,button{font:inherit;color:inherit;outline:none}a:focus-visible,button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.close,.icon-button{border-radius:var(--lw-radius-md);width:2rem;height:2rem;color:var(--lw-color-muted-foreground);cursor:pointer;background:0 0;border:0;flex:none;place-items:center;padding:0;display:grid}.close:hover,.icon-button:hover{color:var(--lw-color-foreground)}:host{--_level:var(--lw-color-foreground);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background))}:host([data-level=urgent]){--_level:#f59e0b}:host([data-level=critical]){--_level:var(--lw-color-destructive)}.bar{align-items:center;gap:1rem;min-height:3.5rem;padding:.5rem .75rem .5rem 1.25rem;display:flex}.ticks{flex:none;align-items:center;gap:3px;height:1.25rem;display:flex}@container (width<=34rem){.ticks{display:none}}.tick{background:var(--_level);border-radius:1px;width:2px;height:100%}.tick[data-spent]{background:color-mix(in oklab, var(--lw-color-foreground) 22%, transparent);height:60%}.text{min-width:0;color:var(--lw-color-muted-foreground);flex:1}.text b{color:var(--_level);font-weight:600}:host([data-level=calm]) .text b{color:var(--lw-color-foreground)}.date{font:var(--lw-text-xs) var(--lw-font-mono)}@container (width<=34rem){.date{display:none}}", u = 3, d = 1, f = class extends e {
	static styles = l;
	static props = {
		plan: { default: "Pro" },
		ends: {},
		length: {
			type: Number,
			default: 14
		},
		action: { default: "Upgrade" }
	};
	render() {
		return `<div class="bar" role="status"><span class="ticks" aria-hidden="true"></span><p class="text"><b class="left"></b> <span class="what"></span><span class="date"></span></p><lw-button class="upgrade" size="sm"></lw-button>${c()}</div>`;
	}
	connected() {
		this.query(".upgrade").addEventListener("click", () => this.emit("upgrade"), { signal: this.signal }), this.query(".close").addEventListener("click", () => s(this), { signal: this.signal });
	}
	updated() {
		let e = r(this.ends) ?? o(i(), 4), t = Math.max(0, a(i(), e) - 1), s = Math.max(0, this.length - t);
		this.dataset.level = t <= d ? "critical" : t <= u ? "urgent" : "calm", this.query(".ticks").innerHTML = Array.from({ length: this.length }, (e, t) => `<span class="tick"${t < s ? " data-spent" : ""}></span>`).join("");
		let c = this.plan ?? "";
		t === 0 ? (this.query(".left").textContent = `Your ${c} trial has ended`, this.query(".what").textContent = "") : (this.query(".left").textContent = `${t} ${t === 1 ? "day" : "days"} left`, this.query(".what").textContent = `in your ${c} trial`), this.query(".date").textContent = ` · ${t ? "Ends" : "Ended"} ${n(e, "en-US", {
			weekday: "short",
			month: "short",
			day: "numeric"
		})}`, this.query(".upgrade").textContent = this.action ?? "";
	}
};
//#endregion
//#region src/components/trial-status-banner/index.js
t("trial-status-banner", f);
//#endregion
export { f as t };
