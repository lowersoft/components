import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i } from "./motion-CFWhFfc_.js";
import { A as a, C as o, k as s } from "./lucide-BVbUPHVq.js";
//#region src/components/deployment-card/deployment-card.scss?inline
var c = ":host{--_site:#6366f1;--_ease:cubic-bezier(.23, 1, .32, 1);box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:24rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);border-radius:1.5rem;padding:1.25rem;display:block}p{margin:0}.preview{border:1px solid var(--lw-color-border);background:var(--lw-color-muted);border-radius:.875rem;position:relative;overflow:hidden}.chrome{border-bottom:1px solid var(--lw-color-border);background:var(--lw-color-background);align-items:center;gap:.25rem;padding:.4rem .5rem;display:flex}.chrome span{background:var(--lw-color-border);border-radius:50%;width:.375rem;height:.375rem}.chrome .address{font:normal 9px var(--lw-font-mono);text-align:center;text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-muted-foreground);flex:1;margin-left:.5rem;overflow:hidden}.site{gap:.375rem;padding:.75rem 1rem 1rem;display:grid}.site b{background:var(--lw-color-border);border-radius:3px;display:block}.site .nav{width:30%;height:.375rem;margin-bottom:.375rem}.site .hero{background:color-mix(in oklab, var(--_site) 70%, var(--lw-color-foreground));width:70%;height:.875rem}.site .line{width:85%;height:.3rem}.site .short{width:55%}.site .cta{border-radius:var(--lw-radius-full);background:var(--_site);width:3.5rem;height:.875rem;margin-top:.25rem;transition:background-color .4s ease-out}.tiles{grid-template-columns:repeat(3,1fr);gap:.375rem;margin-top:.375rem;display:grid}.tiles b{background:color-mix(in oklab, var(--_site) 15%, var(--lw-color-background));height:1.75rem}.shimmer{opacity:0;background:linear-gradient(100deg,#0000 30%,#ffffff59 50%,#0000 70%);position:absolute;inset:0;translate:-100%}:host([data-building]) .shimmer{opacity:1}@media (prefers-reduced-motion:no-preference){:host([data-building]) .shimmer{animation:1.4s ease-in-out infinite sweep}}@keyframes sweep{to{translate:100%}}.head{justify-content:space-between;align-items:flex-start;gap:.75rem;margin-top:1rem;display:flex}.names{min-width:0}.project{font-size:var(--lw-text-md);font-weight:600}.domain{font-size:var(--lw-text-sm);color:var(--lw-color-muted-foreground);align-items:center;gap:.25rem;text-decoration:none;display:inline-flex}.domain:hover{color:var(--lw-color-foreground)}.domain:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.status{border-radius:var(--lw-radius-full);font-size:var(--lw-text-xs);--_tone:var(--lightningcss-light,#10b981)var(--lightningcss-dark,#34d399);background:color-mix(in oklab, var(--_tone) 12%, transparent);color:color-mix(in oklab, var(--_tone) 75%, var(--lw-color-foreground));flex:none;align-items:center;gap:.375rem;padding:.125rem .5rem;font-weight:500;display:inline-flex}.status:before{content:\"\";background:var(--_tone);border-radius:50%;width:.375rem;height:.375rem}.status[data-status=building]{--_tone:var(--lightningcss-light,#f59e0b)var(--lightningcss-dark,#fbbf24)}@media (prefers-reduced-motion:no-preference){.status[data-status=building]:before{animation:1s ease-in-out infinite pulse}}.status[data-status=error]{--_tone:var(--lightningcss-light,#e11d48)var(--lightningcss-dark,#fb7185)}@keyframes pulse{50%{opacity:.3}}.commit{font:var(--lw-text-xs) var(--lw-font-mono);color:var(--lw-color-muted-foreground);gap:1rem;margin-top:.75rem;display:flex}.commit>span{align-items:center;gap:.25rem;display:inline-flex}.message{font-size:var(--lw-text-sm);text-overflow:ellipsis;white-space:nowrap;margin-top:.25rem;overflow:hidden}.build{opacity:0;grid-template-rows:0fr;display:grid}@media (prefers-reduced-motion:no-preference){.build{transition:grid-template-rows .32s var(--_ease), opacity .24s var(--_ease)}}:host([data-built]) .build{opacity:1;grid-template-rows:1fr}.build-inner{min-height:0;overflow:hidden}.rail{grid-template-columns:repeat(5,1fr);margin:1rem 0 0;padding:0;list-style:none;display:grid}.rail li{color:var(--lw-color-muted-foreground);justify-items:center;gap:.375rem;font-size:10px;display:grid;position:relative}.rail li:not(:first-child):before{content:\"\";background:linear-gradient(var(--lw-color-foreground) 0 0) 0 0/var(--_fill,0%) 100% no-repeat, var(--lw-color-border);height:2px;margin-inline:.5rem;position:absolute;top:.3125rem;left:-50%;right:50%}@media (prefers-reduced-motion:no-preference){.rail li:not(:first-child):before{transition:background-size .4s var(--_ease)}}.rail li:is([data-state=done],[data-state=active]):before{--_fill:100%}.rail li[data-state=active],.rail li[data-state=done]{color:var(--lw-color-foreground)}.node{box-sizing:border-box;border:2px solid var(--lw-color-border);background:var(--lw-color-background);border-radius:50%;width:.75rem;height:.75rem;transition:border-color .2s ease-out,background-color .2s ease-out;position:relative}[data-state=done] .node{border-color:var(--lw-color-foreground);background:var(--lw-color-foreground)}[data-state=active] .node{border-color:var(--lw-color-foreground)}@media (prefers-reduced-motion:no-preference){[data-state=active] .node{animation:.9s ease-in-out infinite pulse}}[data-step=ready][data-state=active] .node{background:var(--lightningcss-light,#10b981)var(--lightningcss-dark,#34d399);border-color:var(--lightningcss-light,#10b981)var(--lightningcss-dark,#34d399);animation:none}.log{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);font:var(--lw-text-xs) var(--lw-font-mono);align-items:center;gap:.75rem;margin-top:.75rem;padding:.5rem .75rem;display:flex}.timer{font-variant-numeric:tabular-nums;flex:none;min-width:3rem}.line-box{flex:1;min-width:0;height:1rem;display:grid;position:relative;overflow:hidden}.log-line{text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-muted-foreground);grid-area:1/1;overflow:hidden}.foot{border-top:1px solid var(--lw-color-muted);font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);justify-content:space-between;align-items:center;margin-top:1rem;padding-top:.75rem;display:flex}", l = [
	{
		id: "queued",
		label: "Queued",
		ms: 900,
		log: ["Waiting for a build machine…", "Build machine ready: 16 cores, x86_64 and aarch64"]
	},
	{
		id: "building",
		label: "Building",
		ms: 5200,
		log: [
			"Cloning github.com/lowersoft/runtime (main)",
			"Restored the object cache from the last build",
			"Configuring with cmake · 42 targets",
			"Compiling 154 objects with clang -O3",
			"Linking ./build/lower (1.4 MB)"
		]
	},
	{
		id: "checks",
		label: "Checks",
		ms: 2400,
		log: ["Running 128 unit tests under AddressSanitizer", "All 128 tests passed, sanitizers clean"]
	},
	{
		id: "deploying",
		label: "Publishing",
		ms: 1800,
		log: ["Signing the release binary", "Publishing to the nightly channel"]
	},
	{
		id: "ready",
		label: "Ready",
		ms: 0,
		log: []
	}
], u = {
	ready: "Ready",
	building: "Building",
	error: "Error"
}, d = [
	"#6366f1",
	"#0ea5e9",
	"#f97316",
	"#10b981",
	"#e11d48"
], f = (e) => `${(e / 1e3).toFixed(1)}s`, p = class extends e {
	static styles = c;
	static props = {
		project: { default: "lowersoft-runtime" },
		domain: { default: "nightly.lowersoft.dev" },
		branch: { default: "main" },
		commit: { default: "a1c9e3f" },
		message: { default: "Cut cold start below 10 ms" },
		when: { default: "2m ago by Maya" },
		status: {
			default: "ready",
			reflect: !0
		}
	};
	#e = -1;
	#t = 0;
	#n = 0;
	#r = [];
	#i = 0;
	render() {
		let e = l.map(({ id: e, label: t }) => `<li data-step="${e}"><span class="node"></span><span class="step-label">${t}</span></li>`).join("");
		return `<div class="preview" aria-hidden="true"><div class="chrome"><span></span><span></span><span></span><i class="address"></i></div><div class="site"><b class="nav"></b><b class="hero"></b><b class="line"></b><b class="line short"></b><span class="cta"></span><div class="tiles"><b></b><b></b><b></b></div></div><div class="shimmer"></div></div>
<div class="head"><div class="names"><p class="project"></p><a class="domain" target="_blank" rel="noopener noreferrer"></a></div><span class="status"></span></div>
<p class="commit"><span class="branch">${r(s, 14)}<span></span></span><span class="hash">${r(a, 14)}<span></span></span></p>
<p class="message"></p>
<div class="build"><div class="build-inner"><ol class="rail">${e}</ol><div class="log"><span class="timer"></span><span class="line-box"><span class="log-line" aria-live="polite"></span></span></div></div></div>
<div class="foot"><span class="when"></span><lw-button class="redeploy" variant="secondary" size="sm">Rebuild</lw-button></div>`;
	}
	connected() {
		this.query(".redeploy").addEventListener("click", () => this.redeploy(), { signal: this.signal }), this.signal.addEventListener("abort", () => this.#o());
	}
	updated() {
		this.query(".project").textContent = this.project ?? "";
		let e = this.query(".domain");
		e.innerHTML = `${n(this.domain ?? "")}${r(o, 12)}`, e.href = `https://${this.domain}`, this.query(".address").textContent = this.domain ?? "", this.query(".branch span").textContent = this.branch ?? "", this.query(".hash span").textContent = this.commit ?? "", this.query(".message").textContent = this.message ?? "", this.#e < 0 && (this.query(".when").textContent = this.when ?? "");
		let t = this.query(".status");
		t.textContent = u[this.status] ?? this.status, t.dataset.status = this.status, this.query(".redeploy").disabled = this.status === "building";
	}
	redeploy() {
		if (this.status === "building") return;
		this.#o(), this.status = "building", this.toggleAttribute("data-building", !0), this.toggleAttribute("data-built", !0), this.#t = performance.now(), this.emit("redeploy");
		let e = i.matches ? .25 : 1, t = 0;
		l.forEach((n, r) => {
			this.#a(() => this.#c(r), t), n.log.forEach((r, i) => this.#a(() => this.#l(r), t + n.ms * e * i / n.log.length)), t += n.ms * e;
		}), this.#s();
	}
	#a(e, t) {
		this.#r.push(setTimeout(e, t));
	}
	#o() {
		for (let e of this.#r.splice(0)) clearTimeout(e);
		cancelAnimationFrame(this.#n), this.#n = 0;
	}
	#s() {
		this.query(".timer").textContent = f(performance.now() - this.#t), this.#n = requestAnimationFrame(() => this.#s());
	}
	#c(e) {
		this.#e = e, this.query(".rail").querySelectorAll("li").forEach((t, n) => t.dataset.state = n < e ? "done" : n === e ? "active" : "pending"), l[e].id === "ready" && this.#u();
	}
	#l(e) {
		let t = this.query(".line-box"), n = t.querySelector(".log-line"), r = document.createElement("span");
		for (r.className = "log-line", r.ariaLive = "polite", r.textContent = e, t.append(r); t.children.length > 2;) t.firstElementChild.remove();
		i.matches || !n?.textContent ? n?.remove() : (n.removeAttribute("aria-live"), n.animate([{
			opacity: 1,
			transform: "none"
		}, {
			opacity: 0,
			transform: "translateY(-8px)"
		}], {
			duration: 180,
			easing: "ease-in",
			fill: "forwards"
		}).finished.then(() => n.remove(), () => n.remove()), r.animate([{
			opacity: 0,
			transform: "translateY(8px)"
		}, {
			opacity: 1,
			transform: "none"
		}], {
			duration: 220,
			easing: "cubic-bezier(0.23, 1, 0.32, 1)"
		}));
	}
	#u() {
		this.#o();
		let e = performance.now() - this.#t;
		this.query(".timer").textContent = f(e), this.#l(`Published in ${f(e)}`), this.status = "ready", this.removeAttribute("data-building"), this.query(".when").textContent = "Just now", this.#i = (this.#i + 1) % d.length, this.style.setProperty("--_site", d[this.#i]), i.matches || this.query(".site").animate([{
			opacity: .2,
			filter: "blur(4px)"
		}, {
			opacity: 1,
			filter: "blur(0px)"
		}], {
			duration: 420,
			easing: "ease-out"
		}), this.emit("ready", { ms: e });
	}
};
//#endregion
//#region src/components/deployment-card/index.js
t("deployment-card", p);
//#endregion
export { p as t };
