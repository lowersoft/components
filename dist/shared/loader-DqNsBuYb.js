import { n as e, t } from "./core-WcEz9YgG.js";
//#region src/components/loader/loader.scss?inline
var n = ":host{--_size:8rem;--_gap:.75rem;--_title:var(--lw-text-md);--_subtitle:var(--lw-text-sm);--_max:14rem;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);flex-direction:column;justify-content:center;align-items:center;gap:2rem;padding:2rem;display:flex}:host([size=sm]){--_size:5rem;--_gap:.5rem;--_title:var(--lw-text-sm);--_subtitle:var(--lw-text-xs);--_max:12rem}:host([size=lg]){--_size:10rem;--_gap:1rem;--_title:var(--lw-text-lg);--_subtitle:var(--lw-text-md);--_max:16rem}.rings{width:var(--_size);height:var(--_size);position:relative}.ring{border-radius:50%;animation:2s ease-in-out infinite pulse;position:absolute;inset:0}@media (prefers-reduced-motion:no-preference){.ring{animation:linear infinite spin}}.outer{opacity:.8;background:conic-gradient(#0000 0deg,currentColor 90deg,#0000 180deg);animation-duration:3s;-webkit-mask:radial-gradient(circle,#0000 35%,#000 37% 39%,#0000 41%);mask:radial-gradient(circle,#0000 35%,#000 37% 39%,#0000 41%)}.primary{background:conic-gradient(transparent 0deg, currentcolor 120deg, color-mix(in srgb, currentcolor 50%, transparent) 240deg, transparent 360deg);opacity:.9;animation-duration:1.2s;-webkit-mask:radial-gradient(circle,#0000 42%,#000 44% 48%,#0000 50%);mask:radial-gradient(circle,#0000 42%,#000 44% 48%,#0000 50%)}.counter{background:conic-gradient(from 180deg, transparent 0deg, color-mix(in srgb, currentcolor 60%, transparent) 45deg, transparent 90deg);opacity:.35;animation-duration:4s;animation-direction:reverse;-webkit-mask:radial-gradient(circle,#0000 52%,#000 54% 56%,#0000 58%);mask:radial-gradient(circle,#0000 52%,#000 54% 56%,#0000 58%)}.accent{background:conic-gradient(from 270deg, transparent 0deg, color-mix(in srgb, currentcolor 40%, transparent) 20deg, transparent 40deg);opacity:.5;animation-duration:3.5s;-webkit-mask:radial-gradient(circle,#0000 61%,#000 63% 62%,#0000 64%);mask:radial-gradient(circle,#0000 61%,#000 63% 62%,#0000 64%)}.text{gap:var(--_gap);max-width:var(--_max);text-align:center;-webkit-font-smoothing:antialiased;transition:opacity .2s ease-out;display:grid}@starting-style{.text{opacity:0}}.heading{font-size:var(--_title);letter-spacing:-.02em;color:color-mix(in srgb, currentcolor 90%, transparent);font-weight:500;line-height:1.15}:host([size=lg]) .heading{font-weight:600}.subtitle{font-size:var(--_subtitle);letter-spacing:-.01em;color:color-mix(in srgb, currentcolor 60%, transparent);line-height:1.45}.subtitle[hidden]{display:none}@keyframes spin{to{rotate:1turn}}@keyframes pulse{50%{opacity:.4}}", r = class extends e {
	static styles = n;
	static props = {
		heading: { default: "Configuring your account..." },
		subtitle: { default: "Please wait while we prepare everything for you" },
		size: {
			default: "md",
			reflect: !0
		}
	};
	render() {
		return "<div class=\"rings\" part=\"rings\" aria-hidden=\"true\"><span class=\"ring outer\"></span><span class=\"ring primary\"></span><span class=\"ring counter\"></span><span class=\"ring accent\"></span></div><output class=\"text\" aria-live=\"polite\"><span class=\"heading\" part=\"heading\"></span><span class=\"subtitle\" part=\"subtitle\"></span></output>";
	}
	updated() {
		this.query(".heading").textContent = this.heading;
		let e = this.query(".subtitle");
		e.textContent = this.subtitle, e.hidden = !this.subtitle;
	}
};
//#endregion
//#region src/components/loader/index.js
t("loader", r);
//#endregion
export { r as t };
