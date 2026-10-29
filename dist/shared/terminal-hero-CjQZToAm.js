import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i, t as a } from "./icons-Dv1KN71n.js";
import { n as o } from "./motion-CFWhFfc_.js";
import { t as s } from "./visibility--H4IXDjD.js";
import { ot as c, pt as l } from "./lucide-BVbUPHVq.js";
import { n as u, r as d } from "./hero-CAqTQjEL.js";
//#region src/components/terminal-hero/terminal-hero.scss?inline
var f = ":host{--_ink:var(--lw-color-foreground);--_muted:var(--lw-color-muted-foreground);--_line:var(--lw-color-border);--_ok:var(--lightningcss-light,#059669)var(--lightningcss-dark,#34d399);--_ease:cubic-bezier(.23, 1, .32, 1);box-sizing:border-box;background:var(--lw-color-background);width:100%;min-height:760px;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);justify-content:center;align-items:flex-start;padding:6rem clamp(1.5rem,5vw,4rem) 0;display:flex;position:relative;overflow:hidden;container-type:inline-size}.container{width:100%;max-width:72rem;margin-inline:auto;position:relative}.intro{gap:2rem;display:grid}@container (width>=56rem){.intro{grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);align-items:center;column-gap:4rem}}.title{letter-spacing:-.05em;text-wrap:balance;margin:0;font-size:clamp(3rem,7vw,5.75rem);font-weight:600;line-height:.95}::slotted([slot=eyebrow]){margin-bottom:1.25rem}.description{max-width:30rem;font-size:var(--lw-text-lg);text-wrap:pretty;color:var(--lw-color-muted-foreground);margin:0;line-height:1.6}.actions{flex-wrap:wrap;align-items:center;gap:.75rem;margin-top:2rem;display:flex}.primary::part(button),.secondary::part(button){border-radius:var(--lw-radius-full)}.window{border:1px solid var(--lw-color-border);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));height:100%;font-size:var(--lw-text-sm);border-radius:1rem;overflow:hidden}.bar{border-bottom:1px solid var(--lw-color-border);align-items:center;gap:.75rem;height:3.25rem;padding:0 1rem;display:flex}.logo{background:var(--lw-color-foreground);width:1.5rem;height:1.5rem;font-size:var(--lw-text-xs);color:var(--lw-color-background);border-radius:.375rem;flex:none;place-items:center;font-weight:700;display:grid}.crumbs{white-space:nowrap;align-items:center;min-width:0;display:flex}.crumbs span+span:before{content:\"/\";color:color-mix(in oklab, var(--lw-color-muted-foreground) 60%, transparent);margin:0 .625rem}.stage{height:40rem;margin:4.5rem -2rem 0;padding:0 2rem;position:relative;-webkit-mask-image:linear-gradient(#000 50%,#0000 96%);mask-image:linear-gradient(#000 50%,#0000 96%)}.window{grid-template-rows:auto 1fr;display:grid}.bar{height:3.5rem;padding:0 .625rem}.tab{border-radius:var(--lw-radius-md);background:color-mix(in oklab, var(--_ink) 7%, transparent);min-width:0;font:var(--lw-text-sm) var(--lw-font-mono);white-space:nowrap;align-items:center;gap:.5rem;padding:.375rem .75rem;display:flex}.tab svg{color:var(--_muted);flex:none}.path{text-overflow:ellipsis;overflow:hidden}.shell{color:var(--_muted)}.copy{font-size:var(--lw-text-xs);margin-left:auto;display:none}@container (width>=40rem){.copy{display:inline-flex}}.replay{margin-left:auto}@container (width>=40rem){.copy+.replay{margin-left:0}}.screen{font:var(--lw-text-md)/1.75 var(--lw-font-mono);color:var(--_muted);padding:1.5rem 1.5rem 2rem;overflow:hidden}.line{white-space:pre;align-items:center;gap:.625rem;margin:0;display:flex}@media (prefers-reduced-motion:no-preference){.line{animation:line-in .22s var(--_ease)}}@keyframes line-in{0%{opacity:0;translate:0 .25rem}}.gap{height:1rem}.ink{color:var(--_ink)}.dim{color:var(--_muted)}.caret,.ok{color:var(--_ok)}.link{color:var(--_ink);text-decoration:underline;-webkit-text-decoration-color:var(--_line);text-decoration-color:var(--_line);text-underline-offset:.2em}.cursor{background:var(--_ink);width:.6em;height:1.1em}@media (prefers-reduced-motion:no-preference){.cursor{animation:1s step-end infinite caret}}@keyframes caret{50%{opacity:0}}.when{font-size:var(--lw-text-sm);color:var(--_muted);margin-left:auto}.mark{border:2px solid var(--_line);border-radius:50%;flex:none;place-items:center;width:1rem;height:1rem;display:grid}.mark .icon{opacity:0;width:.75rem;height:.75rem}.mark[data-state=running]{border-top-color:var(--_ink)}@media (prefers-reduced-motion:no-preference){.mark[data-state=running]{animation:.8s linear infinite spin}}.mark[data-state=done]{color:var(--_ok);border:0}.mark[data-state=done] .icon{opacity:1}@keyframes spin{to{rotate:1turn}}.layers{opacity:0;pointer-events:none;flex-direction:column;gap:.75rem;width:min(22rem,45%);display:none;position:absolute;top:7rem;right:0;translate:1.5rem}@media (prefers-reduced-motion:no-preference){.layers{transition:opacity .5s var(--_ease), translate .5s var(--_ease)}}@container (width>=48rem){.layers{display:flex}}:host([data-live]) .layers{opacity:1;pointer-events:auto;translate:0}.preview,.checks{border:1px solid var(--_line);background:var(--lw-color-background);box-shadow:var(--lw-shadow-md), 0 24px 48px -24px #00000059;border-radius:.875rem}.preview{overflow:hidden}.preview-bar{border-bottom:1px solid var(--_line);font:var(--lw-text-xs) var(--lw-font-mono);color:var(--_muted);align-items:center;gap:.5rem;padding:.625rem .75rem;display:flex}.lights{gap:.3125rem;display:flex}.lights i{background:var(--_line);border-radius:50%;width:.5rem;height:.5rem}.preview-title{text-align:center;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.ready{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--_ok) 15%, transparent);font-family:var(--lw-font-sans);color:var(--_ok);padding:.0625rem .5rem}.gui{grid-template-columns:5.5rem minmax(0,1fr);font-size:.6875rem;display:grid}.gui-side{border-right:1px solid var(--_line);color:var(--_muted);align-content:start;gap:.125rem;padding:.625rem .5rem;display:grid}.gui-side span{border-radius:var(--lw-radius-sm);padding:.25rem .5rem}.gui-side [data-on]{background:color-mix(in oklab, var(--_ink) 8%, transparent);color:var(--_ink)}.gui-main{gap:.625rem;padding:.75rem;display:grid}.gui-tiles{grid-template-columns:1fr 1fr;gap:.5rem;display:grid}.gui-tiles span{border:1px solid var(--_line);border-radius:var(--lw-radius-md);color:var(--_muted);padding:.5rem .625rem;display:grid}.gui-tiles b{font-size:var(--lw-text-sm);font-variant-numeric:tabular-nums;color:var(--_ink);font-weight:600}.gui-chart{align-items:flex-end;gap:3px;height:3.5rem;display:flex}.gui-chart i{background:color-mix(in oklab, var(--_ok) 70%, transparent);border-radius:2px 2px 0 0;flex:1}.gui-list{gap:.25rem;margin:0;padding:0;list-style:none;display:grid}.gui-list li{font-family:var(--lw-font-mono);color:var(--_muted);justify-content:space-between;display:flex}.checks{font-size:var(--lw-text-sm);gap:.5rem;margin:0;padding:.875rem 1rem;list-style:none;display:grid}.checks li{align-items:center;gap:.625rem;display:flex}.tick{background:color-mix(in oklab, var(--_ok) 18%, transparent);width:1.125rem;height:1.125rem;color:var(--_ok);border-radius:50%;place-items:center;display:grid}.tick .icon{width:.75rem;height:.75rem}", p = 45, m = 260, h = 6e3, g = [
	{
		label: "Configuring",
		ms: 600,
		detail: "cmake · 42 targets"
	},
	{
		label: "Compiling",
		ms: 3200,
		detail: "154 objects"
	},
	{
		label: "Linking",
		ms: 900,
		detail: "1.4 MB"
	},
	{
		label: "Running tests",
		ms: 1600,
		detail: "128 passed"
	}
], _ = [
	"Release build · -O3",
	"Tests · 128 passed",
	"AddressSanitizer · clean",
	"Static binary · 1.4 MB"
], v = (e) => `${(e / 1e3).toFixed(1)}s`, y = (e) => new Promise((t) => setTimeout(t, e)), b = [
	.32,
	.45,
	.38,
	.6,
	.52,
	.7,
	.44,
	.36,
	.58,
	.81,
	.62,
	.48,
	.55,
	.4
], x = class extends e {
	static styles = [r, f];
	static props = {
		heading: { default: "Build it with one command." },
		description: { default: "Run it from your terminal or push to main. lower configures, compiles, tests and links one native binary in seconds, with no runtime to install and nothing between your code and the machine." },
		project: { default: "lower-web" },
		command: { default: "make release" },
		binary: { default: "./build/lower" },
		toolchain: { default: "clang 18.1 · x86_64-linux · release (-O3)" },
		steps: {
			type: Object,
			default: g
		},
		checks: {
			type: Object,
			default: _
		}
	};
	#e = 0;
	#t = !1;
	#n = !1;
	#r = 0;
	render() {
		let e = b.map((e) => `<i style="height: ${e * 100}%"></i>`).join("");
		return `<div class="container">${u("Start building", "Read the build docs")}
<div class="stage"><div class="window">
<header class="bar"><span class="tab">${i(l, 16)}<span class="path"></span><span class="shell">zsh</span></span>
<lw-copy-button class="copy" label="Copy the command"></lw-copy-button><lw-button class="replay" variant="outline" size="sm"><span slot="start">${i(c, 14)}</span>Replay</lw-button></header>
<div class="screen" role="log" aria-live="polite" aria-label="Build output"></div></div>
<aside class="layers" aria-label="Result"><div class="preview" role="img" aria-label="The running program's window">
<div class="preview-bar"><span class="lights" aria-hidden="true"><i></i><i></i><i></i></span><span class="preview-title"></span><span class="ready">Running</span></div>
<div class="gui" aria-hidden="true"><nav class="gui-side"><span data-on>CPU</span><span>Memory</span><span>Disk</span><span>Network</span></nav>
<div class="gui-main"><div class="gui-tiles"><span><b>23%</b>CPU</span><span><b>4.1 GB</b>Memory</span></div><div class="gui-chart">${e}</div>
<ul class="gui-list"><li><span>compositor</span><span>8.2%</span></li><li><span>lower</span><span>1.1%</span></li><li><span>audio</span><span>0.6%</span></li></ul></div></div></div>
<ul class="checks"></ul></aside></div></div>`;
	}
	connected() {
		this.signal.addEventListener("abort", () => {
			this.#e++, clearTimeout(this.#r);
		}), s(this, (e) => {
			this.#t = e, e && !this.#n && (this.#n = !0, this.#a());
		}, this.signal), this.query(".replay").addEventListener("click", () => this.#a(), { signal: this.signal });
	}
	updated() {
		d(this), this.query(".path").textContent = `~/code/${this.project}`, this.query(".copy").value = this.command ?? "", this.query(".preview-title").textContent = (this.binary ?? "").split("/").pop(), this.query(".checks").innerHTML = (this.checks ?? []).map((e) => `<li><span class="tick">${a}</span>${n(e)}</li>`).join("");
	}
	#i(e, t = "") {
		let n = document.createElement("p");
		return n.className = `line ${t}`.trim(), n.innerHTML = e, this.query(".screen").append(n), n;
	}
	async #a() {
		let e = ++this.#e, t = () => e === this.#e, r = o.matches, i = async (e) => (r || await y(e), t());
		clearTimeout(this.#r), this.query(".screen").innerHTML = "", this.toggleAttribute("data-live", !1);
		let s = this.#i(`<span class="ink">${n(this.project ?? "")}</span> <span class="dim">git:(main)</span> <span class="caret">›</span> <span class="typed"></span><span class="cursor"></span>`), c = s.querySelector(".typed"), l = this.command ?? "";
		for (let e = 1; e <= l.length; e++) {
			if (!await i(p)) return;
			c.textContent = l.slice(0, e);
		}
		if (c.textContent = l, s.querySelector(".cursor").remove(), !await i(m) || (this.#i(n(this.toolchain ?? ""), "dim"), !await i(m))) return;
		this.#i(`<span class="dim">›</span> Target <span class="ink">${n(this.binary ?? "")}</span>`), this.#i("", "gap");
		let u = 0;
		for (let e of this.steps) {
			let t = this.#i(`<span class="mark" data-state="running">${a}</span><span class="ink">${n(e.label)}…</span><span class="when"></span>`);
			if (!await i(e.ms)) return;
			u += e.ms, t.querySelector(".mark").dataset.state = "done", t.querySelector(".ink").textContent = e.label, t.querySelector(".when").textContent = `${e.detail ?? ""} · ${v(e.ms)}`;
		}
		this.#i("", "gap"), this.#i(`<span class="ok">✓</span> <span class="ink">Built in ${v(u)}</span>`), this.#i(`<span class="dim">Run</span>  <span class="link">${n(this.binary ?? "")}</span>`), this.toggleAttribute("data-live", !0), this.emit("complete", { ms: u }), r || (this.#r = setTimeout(() => this.#t && this.#a(), h));
	}
};
//#endregion
//#region src/components/terminal-hero/index.js
t("terminal-hero", x);
//#endregion
export { x as t };
