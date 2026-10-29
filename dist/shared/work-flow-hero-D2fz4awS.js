import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { r as i, t as a } from "./icons-Dv1KN71n.js";
import { n as o } from "./motion-CFWhFfc_.js";
import { t as s } from "./visibility--H4IXDjD.js";
import { c, it as l, k as u, lt as d, ot as f, pt as p, tt as m, v as h } from "./lucide-BVbUPHVq.js";
import { n as g, r as _ } from "./hero-CAqTQjEL.js";
//#region src/components/work-flow-hero/work-flow-hero.scss?inline
var v = ":host{--_ink:var(--lw-color-foreground);--_muted:var(--lw-color-muted-foreground);--_line:var(--lw-color-border);--_done:var(--lightningcss-light,#10b981)var(--lightningcss-dark,#34d399);--_card:var(--lw-color-background);box-sizing:border-box;background:var(--lw-color-background);width:100%;min-height:760px;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);justify-content:center;align-items:flex-start;padding:6rem clamp(1.5rem,5vw,4rem) 0;display:flex;position:relative;overflow:hidden;container-type:inline-size}.container{width:100%;max-width:72rem;margin-inline:auto;position:relative}.intro{gap:2rem;display:grid}@container (width>=56rem){.intro{grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);align-items:center;column-gap:4rem}}.title{letter-spacing:-.05em;text-wrap:balance;margin:0;font-size:clamp(3rem,7vw,5.75rem);font-weight:600;line-height:.95}::slotted([slot=eyebrow]){margin-bottom:1.25rem}.description{max-width:30rem;font-size:var(--lw-text-lg);text-wrap:pretty;color:var(--lw-color-muted-foreground);margin:0;line-height:1.6}.actions{flex-wrap:wrap;align-items:center;gap:.75rem;margin-top:2rem;display:flex}.primary::part(button),.secondary::part(button){border-radius:var(--lw-radius-full)}.window{border:1px solid var(--lw-color-border);background:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));height:100%;font-size:var(--lw-text-sm);border-radius:1rem;overflow:hidden}.bar{border-bottom:1px solid var(--lw-color-border);align-items:center;gap:.75rem;height:3.25rem;padding:0 1rem;display:flex}.logo{background:var(--lw-color-foreground);width:1.5rem;height:1.5rem;font-size:var(--lw-text-xs);color:var(--lw-color-background);border-radius:.375rem;flex:none;place-items:center;font-weight:700;display:grid}.crumbs{white-space:nowrap;align-items:center;min-width:0;display:flex}.crumbs span+span:before{content:\"/\";color:color-mix(in oklab, var(--lw-color-muted-foreground) 60%, transparent);margin:0 .625rem}.stage{height:44rem;margin-top:4.5rem;-webkit-mask-image:linear-gradient(#000 50%,#0000 96%);mask-image:linear-gradient(#000 50%,#0000 96%)}.window{grid-template-rows:auto auto minmax(0,1fr);display:grid}.status{font-size:var(--lw-text-sm);font-variant-numeric:tabular-nums;color:var(--_muted);align-items:center;gap:.5rem;margin-left:auto;display:none}@container (width>=40rem){.status{display:flex}}.pause{margin-left:auto}@container (width>=40rem){.status+.pause{margin-left:0}}@container (width<=40rem){.crumbs{display:none}}.dot{background:var(--_ink);border-radius:50%;width:.5rem;height:.5rem}@media (prefers-reduced-motion:no-preference){[data-state=running]>.dot{animation:1.2s ease-in-out infinite blink}}[data-state=done]>.dot{background:var(--_done)}[data-state=paused]>.dot{background:var(--_muted)}@keyframes blink{50%{opacity:.3}}.state{color:var(--_ink)}.canvas{border-bottom:1px solid var(--_line);background-image:radial-gradient(color-mix(in oklab, var(--_ink) 16%, transparent) 1px, transparent 1px);background-size:1.25rem 1.25rem;overflow-x:auto}.graph{min-width:52rem;padding:2.5rem 2rem;position:relative}.nodes{grid-template-columns:repeat(var(--_cols,4), minmax(0, 1fr));grid-template-rows:repeat(var(--_rows,3), auto);align-items:center;gap:1.25rem 3rem;display:grid;position:relative}.edges{pointer-events:none;width:100%;height:100%;position:absolute;inset:0;overflow:visible}.edge{fill:none;stroke:var(--_line);stroke-width:1.25px}@media (prefers-reduced-motion:no-preference){.edge{transition:stroke .3s ease-out}}.edge[data-on]{stroke:color-mix(in oklab, var(--_ink) 45%, transparent)}.pulse{fill:var(--_ink);opacity:0}.pulse[data-on]{opacity:1}.node{border:1px solid var(--_line);background:var(--_card);font:inherit;text-align:left;color:var(--_ink);cursor:pointer;border-radius:.875rem;outline:none;grid-template-columns:auto 1fr auto;grid-template-areas:\"icon kind state\"\"icon title state\"\"meta meta state\";gap:0 .75rem;padding:.875rem 1rem;display:grid;position:relative}@media (prefers-reduced-motion:no-preference){.node{transition:border-color .2s ease-out,box-shadow .2s ease-out}}.node:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.node[aria-pressed=true]{border-color:var(--_ink)}.node[data-state=running]{box-shadow:0 0 0 4px color-mix(in oklab, var(--_ink) 8%, transparent)}.node-icon{border:1px solid var(--_line);width:2.25rem;height:2.25rem;color:var(--_muted);border-radius:.5rem;grid-area:icon;place-items:center;display:grid}[data-state=done]>.node-icon,[data-state=running]>.node-icon{background:var(--_ink);color:var(--lw-color-background);border-color:#0000}.node-kind{font-size:var(--lw-text-xs);color:var(--_muted);grid-area:kind}.node-title{text-overflow:ellipsis;white-space:nowrap;grid-area:title;font-weight:500;overflow:hidden}.node-meta{font:var(--lw-text-xs) var(--lw-font-mono);color:var(--_muted);grid-area:meta;margin-top:.625rem}.node-state{border:1.5px dashed var(--_line);border-radius:50%;grid-area:state;align-self:end;place-items:center;width:1.125rem;height:1.125rem;display:grid}.node-state .icon{opacity:0;width:.75rem;height:.75rem}[data-state=running]>.node-state{border-style:solid;border-color:var(--_line);border-top-color:var(--_ink)}@media (prefers-reduced-motion:no-preference){[data-state=running]>.node-state{animation:.8s linear infinite spin}}[data-state=done]>.node-state{background:var(--_done);color:#fff;border:0}[data-state=done]>.node-state .icon{opacity:1}@keyframes spin{to{rotate:1turn}}.panels{gap:1rem;padding:1.25rem;display:grid}@container (width>=56rem){.panels{grid-template-columns:22rem minmax(0,1fr)}}.inspector,.trace{border:1px solid var(--_line);background:var(--_card);border-radius:.875rem;padding:1rem 1.25rem}.inspector-head{align-items:center;gap:.75rem;display:flex}.inspector-head div{flex:1;min-width:0}.inspector-title,.inspector-step{margin:0}.inspector-title{font-weight:500}.inspector-step{font-size:var(--lw-text-xs);color:var(--_muted)}.pill{border:1px solid var(--_line);border-radius:var(--lw-radius-full);font-size:var(--lw-text-xs);color:var(--_muted);padding:.125rem .625rem}.pill[data-state=done]{background:color-mix(in oklab, var(--_done) 15%, transparent);color:var(--_done);border-color:#0000}.io{gap:.75rem;margin:1rem 0 0;display:grid}.io dt{font-size:var(--lw-text-xs);color:var(--_muted)}.io dd{font:var(--lw-text-xs) var(--lw-font-mono);margin:.25rem 0 0}.trace-head{justify-content:space-between;gap:1rem;margin-bottom:.75rem;font-weight:500;display:flex}.totals{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;color:var(--_muted);font-weight:400}.lane{font-size:var(--lw-text-xs);grid-template-columns:9rem minmax(0,1fr);align-items:center;gap:1rem;padding:.25rem 0;display:grid}.lane-name{text-overflow:ellipsis;white-space:nowrap;color:var(--_muted);overflow:hidden}.lane-track{height:.375rem;position:relative}.lane-bar{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--_ink) 10%, transparent);position:absolute;top:0;bottom:0;overflow:hidden}.lane-fill{background:var(--_ink);transform-origin:0;height:100%;display:block;scale:0 1}", y = 4e3, b = 700, x = [
	{
		id: "push",
		kind: "Trigger",
		title: "Push to main",
		icon: "push",
		col: 0,
		row: 1,
		ms: 300,
		result: "a1c9e3f · git",
		input: "git push origin main",
		output: "3 files changed, 41 insertions"
	},
	{
		id: "configure",
		kind: "Configure",
		title: "Configure build",
		icon: "configure",
		col: 1,
		row: 1,
		ms: 1100,
		after: ["push"],
		result: "cmake · 42 targets",
		input: "cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Release",
		output: "42 targets, release flags -O3 -flto"
	},
	{
		id: "core",
		kind: "Compile",
		title: "Compile core",
		icon: "compile",
		col: 2,
		row: 0,
		ms: 1300,
		after: ["configure"],
		result: "86 objects · 1.3s",
		input: "clang -O3 -c src/core/*.c",
		output: "86 objects, 0 warnings",
		objects: 86
	},
	{
		id: "gui",
		kind: "Compile",
		title: "Compile GUI",
		icon: "compile",
		col: 2,
		row: 1,
		ms: 1600,
		after: ["configure"],
		result: "68 objects · 1.6s",
		input: "clang -O3 -c src/gui/*.c",
		output: "68 objects, 0 warnings",
		objects: 68
	},
	{
		id: "tests",
		kind: "Test",
		title: "Run unit tests",
		icon: "test",
		col: 2,
		row: 2,
		ms: 900,
		after: ["configure"],
		result: "128 passed · 0.9s",
		input: "ctest --test-dir build -j 8",
		output: "128 passed, 0 failed, ASan clean"
	},
	{
		id: "link",
		kind: "Output",
		title: "Link binary",
		icon: "link",
		col: 3,
		row: 1,
		ms: 800,
		after: [
			"core",
			"gui",
			"tests"
		],
		result: "./build/lower · 1.4 MB",
		input: "ld.lld build/**/*.o -o build/lower",
		output: "Static ELF, stripped, 1.4 MB",
		size: "1.4 MB"
	}
], S = {
	push: u,
	configure: d,
	compile: p,
	test: h,
	link: c
}, C = (e) => `${(e / 1e3).toFixed(2)}s`, w = class extends e {
	static styles = [r, v];
	static props = {
		heading: { default: "Builds that show their work." },
		description: { default: "Every stage of a native build, traced live: configure, compile, test and link. Open any step to see the exact command and what it produced, and nothing ships without the receipts." },
		project: { default: "lower" },
		run: { default: "Build #4821" },
		steps: {
			type: Object,
			default: x
		},
		step: { default: "gui" },
		paused: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = /* @__PURE__ */ new Map();
	#t = 0;
	#n = 0;
	#r = 0;
	#i = 0;
	#a = !1;
	#o = 0;
	render() {
		return `<div class="container">${g("Start building", "Read the docs")}
<div class="stage"><div class="window">
<header class="bar"><span class="logo" aria-hidden="true"></span><nav class="crumbs" aria-label="Location"><span class="project"></span><span class="run"></span></nav>
<span class="status" role="status"><span class="dot"></span><span class="state"></span><span class="elapsed"></span></span>
<lw-button class="pause" variant="outline" size="sm"></lw-button><lw-button class="replay" variant="outline" size="sm"><span slot="start">${i(f, 14)}</span>Replay</lw-button></header>
<div class="canvas"><div class="graph"><svg class="edges" aria-hidden="true"></svg><div class="nodes"></div></div></div>
<div class="panels"><section class="inspector" aria-label="Step" aria-live="polite"></section><section class="trace" aria-label="Trace"><header class="trace-head"><span>Trace</span><span class="totals"></span></header><div class="lanes"></div></section></div>
</div></div></div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = new ResizeObserver(() => this.#l());
		t.observe(this.query(".graph")), this.signal.addEventListener("abort", () => {
			t.disconnect(), cancelAnimationFrame(this.#i), this.#i = 0, clearTimeout(this.#o);
		}), s(this, (e) => {
			this.#a = e, this.#m();
		}, this.signal), this.query(".nodes").addEventListener("click", (e) => {
			let t = e.target.closest(".node");
			t && this.#f(t.dataset.id);
		}, e), this.query(".pause").addEventListener("click", () => this.paused = !this.paused, e), this.query(".replay").addEventListener("click", () => this.#p(), e);
	}
	updated(e) {
		_(this), this.query(".logo").textContent = (this.project ?? "").charAt(0).toUpperCase(), this.query(".project").textContent = this.project ?? "", this.query(".run").textContent = this.run ?? "", e.has("steps") && this.#s(), e.has("paused") && (this.query(".pause").innerHTML = `<span slot="start">${i(this.paused ? l : m, 14)}</span>${this.paused ? "Resume" : "Pause"}`, this.#m()), this.#u();
	}
	#s() {
		this.#e.clear();
		for (let e of this.steps) {
			let t = Math.max(0, ...(e.after ?? []).map((e) => this.#e.get(e)?.end ?? 0));
			this.#e.set(e.id, {
				start: t,
				end: t + e.ms
			});
		}
		this.#t = Math.max(0, ...[...this.#e.values()].map((e) => e.end)), this.#n = o.matches ? this.#t : 0;
		let e = this.query(".graph");
		e.style.setProperty("--_cols", String(Math.max(...this.steps.map((e) => e.col)) + 1)), e.style.setProperty("--_rows", String(Math.max(...this.steps.map((e) => e.row)) + 1)), this.query(".nodes").innerHTML = this.steps.map((e) => `<button class="node" type="button" data-id="${n(e.id)}" style="grid-area: ${e.row + 1} / ${e.col + 1}"><span class="node-icon">${i(S[e.icon] ?? asterisk, 18)}</span><span class="node-kind">${n(e.kind)}</span><span class="node-title">${n(e.title)}</span><span class="node-meta"></span><span class="node-state" aria-hidden="true">${a}</span></button>`).join(""), this.query(".lanes").innerHTML = this.steps.map((e) => {
			let { start: t } = this.#e.get(e.id);
			return `<div class="lane"><span class="lane-name">${n(e.title)}</span><span class="lane-track"><span class="lane-bar" style="left: ${t / this.#t * 100}%; width: ${e.ms / this.#t * 100}%"><span class="lane-fill"></span></span></span></div>`;
		}).join(""), requestAnimationFrame(() => this.#l());
	}
	#c(e) {
		let { start: t, end: n } = this.#e.get(e.id);
		return this.#n >= n ? "done" : this.#n >= t ? "running" : "queued";
	}
	#l() {
		let e = this.query(".graph"), t = this.query(".edges"), r = e.getBoundingClientRect();
		if (!r.width) return;
		t.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
		let i = (e) => this.query(`.node[data-id="${e}"]`)?.getBoundingClientRect();
		t.innerHTML = this.steps.flatMap((e) => (e.after ?? []).map((t) => {
			let a = i(t), o = i(e.id);
			if (!a || !o) return "";
			let s = a.right - r.left, c = a.top + a.height / 2 - r.top, l = o.left - r.left, u = o.top + o.height / 2 - r.top, d = (s + l) / 2;
			return `<path class="edge" data-to="${n(e.id)}" d="M${s} ${c} C${d} ${c} ${d} ${u} ${l} ${u}"/><circle class="pulse" data-to="${n(e.id)}" r="3"/>`;
		})).join(""), this.#u();
	}
	#u() {
		if (!this.#e.size) return;
		let e = this.#n, t = e >= this.#t;
		for (let e of this.steps) {
			let t = this.query(`.node[data-id="${e.id}"]`);
			if (!t) continue;
			let n = this.#c(e);
			t.dataset.state = n, t.ariaPressed = String(e.id === this.step), t.querySelector(".node-meta").textContent = n === "done" ? e.result : n === "running" ? "Running…" : "Queued";
		}
		for (let t of this.shadowRoot.querySelectorAll(".pulse")) {
			let n = this.steps.find((e) => e.id === t.dataset.to), r = t.previousElementSibling, i = n && this.#c(n) === "running";
			if (t.toggleAttribute("data-on", i), r.toggleAttribute("data-on", i || n && this.#c(n) === "done"), !i) continue;
			let a = r.getPointAtLength(e % b / b * r.getTotalLength());
			t.setAttribute("cx", a.x.toFixed(1)), t.setAttribute("cy", a.y.toFixed(1));
		}
		this.query(".state").textContent = t ? "Done" : this.paused ? "Paused" : "Running", this.query(".status").dataset.state = t ? "done" : this.paused ? "paused" : "running", this.query(".elapsed").textContent = C(Math.min(e, this.#t)), this.shadowRoot.querySelectorAll(".lane-fill").forEach((t, n) => {
			let { start: r } = this.#e.get(this.steps[n].id);
			t.style.scale = `${Math.min(1, Math.max(0, (e - r) / this.steps[n].ms))} 1`;
		});
		let n = this.steps.filter((e) => this.#c(e) === "done"), r = n.reduce((e, t) => e + (t.objects ?? 0), 0), i = n.find((e) => e.size)?.size;
		this.query(".totals").textContent = `Objects ${r || "—"} · Binary ${i ?? "—"}`, this.#d();
	}
	#d() {
		let e = this.steps.findIndex((e) => e.id === this.step), t = this.steps[e], r = this.query(".inspector");
		if (!t) {
			r.innerHTML = "";
			return;
		}
		let a = this.#c(t), o = {
			done: "Done",
			running: "Running",
			queued: "Queued"
		}[a], s = `${t.id}:${a}`;
		r.dataset.key !== s && (r.dataset.key = s, r.innerHTML = `<header class="inspector-head"><span class="node-icon">${i(S[t.icon] ?? asterisk, 18)}</span><div><p class="inspector-title">${n(t.title)}</p><p class="inspector-step">${n(t.kind)} · step ${e + 1} of ${this.steps.length}</p></div><span class="pill" data-state="${a}">${o}</span></header>
<dl class="io"><div><dt>Input</dt><dd>${n(t.input ?? "")}</dd></div><div><dt>Output</dt><dd>${a === "done" ? n(t.output ?? "") : "—"}</dd></div></dl>`);
	}
	#f(e) {
		e !== this.step && (this.step = e, this.emit("select", { step: this.steps.find((t) => t.id === e) }));
	}
	#p() {
		clearTimeout(this.#o), this.#n = o.matches ? this.#t : 0, this.paused = !1, this.#u(), this.#m();
	}
	#m() {
		this.#i || !this.#a || this.paused || o.matches || this.#n >= this.#t || (this.#r = performance.now(), this.#i = requestAnimationFrame((e) => this.#h(e)));
	}
	#h(e) {
		this.#i = 0, this.#a && !this.paused && (this.#n = Math.min(this.#t, this.#n + Math.min(e - this.#r, 100)), this.#r = e, this.#u(), this.#n < this.#t ? this.#i = requestAnimationFrame((e) => this.#h(e)) : (this.emit("complete", { ms: this.#t }), this.#o = setTimeout(() => this.#p(), y)));
	}
};
//#endregion
//#region src/components/work-flow-hero/index.js
t("work-flow-hero", w);
//#endregion
export { w as t };
