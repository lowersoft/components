import { n as e, t } from "./core-WcEz9YgG.js";
import { r as n } from "./icons-Dv1KN71n.js";
import { n as r } from "./motion-CFWhFfc_.js";
import { t as i } from "./clipboard-BCkfa02P.js";
import { S as a, b as o, d as s, g as c } from "./lucide-BVbUPHVq.js";
//#region src/components/image-generation-card/scene.js
var l = (e) => {
	let t = e % 2147483647 || 1;
	return () => (t = t * 16807 % 2147483647, t / 2147483647);
}, u = [
	[
		236,
		224,
		210
	],
	[
		224,
		200,
		178
	],
	[
		205,
		172,
		148
	],
	[
		176,
		140,
		118
	],
	[
		138,
		104,
		88
	],
	[
		104,
		78,
		68
	]
], d = [
	214,
	122,
	92
], f = ([e, t, n], r) => `rgb(${e + r}, ${t + r * .4}, ${n - r * .6})`, p = (e, t, n = 0) => {
	let { width: r, height: i } = e.canvas, a = l(t * 7919 + n * 104729), o = Math.round((a() - .5) * 18), s = e.createLinearGradient(0, 0, 0, i);
	s.addColorStop(0, f(u[0], o)), s.addColorStop(1, f(u[1], o)), e.fillStyle = s, e.fillRect(0, 0, r, i);
	let c = n % 2 == 1, p = i * (c ? .58 : .72);
	e.fillStyle = f(d, o / 2), e.beginPath(), e.arc(r * (.25 + a() * .5), p - i * (.12 + a() * .14), Math.min(r, i) * (.05 + a() * .03), 0, Math.PI * 2), e.fill();
	for (let t = 0; t < 4; t++) {
		let n = p - i * .16 + t * i * (c ? .05 : .08), s = i * (.03 + a() * .05), l = 1.5 + a() * 2.5, d = a() * Math.PI * 2;
		e.fillStyle = f(u[t + 2], o), e.beginPath(), e.moveTo(0, i);
		for (let t = 0; t <= r; t += r / 48) {
			let i = t / r;
			e.lineTo(t, n - Math.sin(i * l * Math.PI + d) * s - Math.sin(i * l * 2.7 + d) * s * .4);
		}
		e.lineTo(r, c ? p : i), e.lineTo(0, c ? p : i), e.closePath(), e.fill();
	}
	c && (e.save(), e.globalAlpha = .45, e.translate(0, p * 2), e.scale(1, -1), e.drawImage(e.canvas, 0, 0, r, p, 0, 0, r, p), e.restore(), e.fillStyle = "rgb(255 255 255 / 0.12)", e.fillRect(0, p, r, i - p));
}, m = ":host{box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:26rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);border-radius:1.5rem;padding:.5rem;display:block}.preview{aspect-ratio:var(--_ratio,4/3);background:var(--lw-color-muted);border-radius:1rem;position:relative;overflow:hidden}@media (prefers-reduced-motion:no-preference){.preview{transition:aspect-ratio .3s cubic-bezier(.23,1,.32,1)}}.preview canvas{width:100%;height:100%;display:block}.steps{border-radius:var(--lw-radius-full);font:500 var(--lw-text-xs) var(--lw-font-mono);color:#fff;background:#0000008c;margin:0;padding:.25rem .5rem;position:absolute;bottom:.75rem;left:.75rem}.steps:empty{display:none}.meta{border-top:1px solid var(--lw-color-muted);font-size:var(--lw-text-sm);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);justify-content:space-between;align-items:center;margin:.25rem .5rem 0;padding:.5rem 0;display:flex}.actions{gap:.25rem;display:flex}button{font:inherit;color:inherit;cursor:pointer;background:0 0;border:0;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.copy,.download{border-radius:var(--lw-radius-md);width:1.75rem;height:1.75rem;transition:background-color var(--lw-duration-fast) ease-out, color var(--lw-duration-fast) ease-out;place-items:center;padding:0;display:grid}.copy:hover,.download:hover{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.copy svg,.download svg{transition:opacity var(--lw-duration-fast) ease-out;grid-area:1/1}.copy svg:last-child,.copy[data-copied] svg:first-child{opacity:0}.copy[data-copied] svg:last-child{opacity:1;color:var(--lightningcss-light,#059669)var(--lightningcss-dark,#34d399)}.variations{grid-template-columns:repeat(4,1fr);gap:.5rem;margin:0 .5rem;padding:0;list-style:none;display:grid}.variations:empty{display:none}.variations button{aspect-ratio:1;border-radius:var(--lw-radius-lg);width:100%;box-shadow:0 0 0 0 var(--lw-color-foreground);padding:0;transition:box-shadow .2s ease-out;display:block;overflow:hidden}.variations button[aria-pressed=true]{box-shadow:0 0 0 2px var(--lw-color-background), 0 0 0 4px var(--lw-color-foreground)}.variations canvas{object-fit:cover;width:100%;height:100%;display:block}.composer{border:1px solid var(--lw-color-border);border-radius:1rem;margin-top:.5rem;padding:.75rem}.prompt{box-sizing:border-box;width:100%;font:var(--lw-text-md)/1.5 var(--lw-font-sans);color:inherit;resize:none;field-sizing:content;background:0 0;border:0;outline:none;padding:0;display:block}:host([data-busy]) .prompt{color:var(--lw-color-muted-foreground)}.controls{font-size:var(--lw-text-sm);color:var(--lw-color-muted-foreground);align-items:center;gap:.25rem;margin-top:.5rem;display:flex}.controls lw-button{margin-left:auto}.model,.ratio{border-radius:var(--lw-radius-md);transition:background-color var(--lw-duration-fast) ease-out, color var(--lw-duration-fast) ease-out;align-items:center;gap:.375rem;padding:.25rem .375rem;display:flex}.model:hover,.ratio:hover{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.frame{width:.875rem;aspect-ratio:var(--_ratio,4/3);border:1.5px solid;border-radius:3px;max-height:.875rem}", h = {
	"4:3": [1152, 864],
	"1:1": [1024, 1024],
	"3:4": [864, 1152],
	"16:9": [1344, 768]
}, g = [
	"Path tracer",
	"Rasterizer",
	"Ray marcher"
], _ = 4, v = 24, y = 90, b = 640, x = 1500, S = class extends e {
	static styles = m;
	static props = {
		prompt: { default: "A quiet valley at dusk, layered hills, low sun, muted film tones" },
		seed: {
			type: Number,
			default: 89702
		},
		ratio: { default: "4:3" },
		model: { default: g[0] }
	};
	#e = 0;
	#t = null;
	#n = !1;
	#r = 0;
	#i = 0;
	render() {
		return `<div class="preview"><canvas class="main"></canvas><p class="steps" aria-live="polite"></p></div>
<div class="meta"><span class="size"></span><span class="actions"><button class="copy" type="button" aria-label="Copy image">${n(o)}${n(s)}</button><button class="download" type="button" aria-label="Download image">${n(a)}</button></span></div>
<ul class="variations" aria-label="Variations"></ul>
<div class="composer"><textarea class="prompt" rows="2" aria-label="Scene"></textarea><div class="controls"><button class="model" type="button"></button><button class="ratio" type="button"><span class="frame"></span><span class="ratio-text"></span></button><lw-button class="generate">Render</lw-button></div></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.query(".generate").addEventListener("click", () => this.#p(), e), this.query(".variations").addEventListener("click", (e) => {
			let t = e.target.closest("button");
			t && this.#u(Number(t.dataset.index));
		}, e), this.query(".ratio").addEventListener("click", () => this.#d("ratio", Object.keys(h)), e), this.query(".model").addEventListener("click", () => this.#d("model", g), e), this.query(".prompt").addEventListener("input", (e) => this.prompt = e.target.value, e), this.query(".prompt").addEventListener("keydown", (e) => {
			e.key === "Enter" && (e.metaKey || e.ctrlKey) && (e.preventDefault(), this.#p());
		}, e), this.query(".copy").addEventListener("click", () => this.#h(), e), this.query(".download").addEventListener("click", () => this.#g(), e), this.signal.addEventListener("abort", () => {
			this.#i++, clearTimeout(this.#r);
		});
	}
	updated(e) {
		let t = this.query(".prompt");
		t.value !== this.prompt && (t.value = this.prompt ?? "");
		let [r, i] = this.#a;
		this.query(".size").textContent = `${r} × ${i} · Seed ${this.seed}`, this.query(".model").innerHTML = `${this.model}${n(c, 14)}`, this.query(".model").ariaLabel = `Renderer: ${this.model}`, this.query(".ratio-text").textContent = this.ratio, this.query(".ratio").ariaLabel = `Aspect ratio ${this.ratio}. Change`, this.style.setProperty("--_ratio", `${r} / ${i}`), (e.has("ratio") || e.has("seed")) && !this.#n && this.#c();
	}
	get #a() {
		return h[this.ratio] ?? h["4:3"];
	}
	#o(e, t) {
		let [n, r] = this.#a;
		return e.width = t, e.height = Math.round(t * r / n), e.getContext("2d");
	}
	async #s(e, t, n) {
		let r = this.#o(e, t), i = this.#t?.[n];
		if (!i) {
			p(r, this.seed + n, n);
			return;
		}
		let a = new Image();
		a.crossOrigin = "anonymous", a.src = i, await a.decode().catch(() => void 0), r.drawImage(a, 0, 0, e.width, e.height);
	}
	#c() {
		this.#s(this.query(".main"), b, this.#e), this.query(".variations").innerHTML = Array.from({ length: _ }, (e, t) => `<li><button type="button" data-index="${t}" aria-label="Variation ${t + 1}" aria-pressed="${t === this.#e}"><canvas></canvas></button></li>`).join(""), this.shadowRoot.querySelectorAll(".variations canvas").forEach((e, t) => this.#s(e, 160, t)), this.#l();
	}
	#l() {
		this.query(".preview").ariaLabel = `Variation ${this.#e + 1} of ${_}: ${this.prompt}`, this.query(".preview").role = "img";
	}
	#u(e) {
		if (this.#n || e === this.#e) return;
		this.#e = e;
		for (let t of this.shadowRoot.querySelectorAll(".variations button")) t.ariaPressed = String(Number(t.dataset.index) === e);
		let t = this.query(".main");
		this.#s(t, b, e), r.matches || t.animate([{ opacity: .4 }, { opacity: 1 }], {
			duration: 200,
			easing: "ease-out"
		}), this.#l(), this.emit("select", { index: e });
	}
	#d(e, t) {
		this.#n || (this[e] = t[(t.indexOf(this[e]) + 1) % t.length]);
	}
	async #f(e) {
		let t = this.query(".main"), n = t.getContext("2d"), i = this.query(".steps"), a = this.#i, o = document.createElement("canvas");
		for (let s = 1; s <= v; s++) {
			if (a !== this.#i) return !1;
			let c = s / v, l = Math.max(1, Math.round(t.width / 6 * (1 - c) ** 2.2));
			o.width = Math.max(1, Math.round(t.width / l)), o.height = Math.max(1, Math.round(t.height / l)), o.getContext("2d").drawImage(e, 0, 0, o.width, o.height), n.imageSmoothingEnabled = !1, n.drawImage(o, 0, 0, t.width, t.height), i.textContent = `Step ${s} / ${v}`, r.matches || await new Promise((e) => setTimeout(e, y));
		}
		return n.imageSmoothingEnabled = !0, n.drawImage(e, 0, 0, t.width, t.height), !0;
	}
	async #p() {
		if (this.#n) return;
		this.#n = !0;
		let e = ++this.#i, t = this.query(".generate");
		t.loading = !0, this.toggleAttribute("data-busy", !0), this.#e = 0, this.seed = Math.floor(1e4 + Math.random() * 89999);
		let n = {
			prompt: this.prompt,
			seed: this.seed,
			model: this.model,
			ratio: this.ratio
		};
		if (this.#t = this.generate ? await this.generate(n).catch(() => null) : null, e !== this.#i) return;
		let i = document.createElement("canvas");
		await this.#s(i, b, 0), this.query(".variations").innerHTML = "";
		let a = await this.#f(i);
		this.query(".steps").textContent = "", this.#n = !1, t.loading = !1, this.removeAttribute("data-busy"), a && (this.#c(), r.matches || this.shadowRoot.querySelectorAll(".variations li").forEach((e, t) => e.animate([{
			opacity: 0,
			transform: "translateY(8px) scale(0.92)"
		}, {
			opacity: 1,
			transform: "none"
		}], {
			duration: 320,
			delay: t * 70,
			easing: "cubic-bezier(0.23, 1, 0.32, 1)",
			fill: "backwards"
		})), this.emit("generate", n));
	}
	#m() {
		let e = document.createElement("canvas");
		return this.#s(e, this.#a[0], this.#e).then(() => new Promise((t) => e.toBlob(t, "image/png")));
	}
	async #h() {
		let e = this.query(".copy");
		try {
			let e = await this.#m();
			window.ClipboardItem && navigator.clipboard?.write ? await navigator.clipboard.write([new ClipboardItem({ "image/png": e })]) : await i(this.prompt);
		} catch {
			return;
		}
		e.toggleAttribute("data-copied", !0), e.ariaLabel = "Copied", clearTimeout(this.#r), this.#r = setTimeout(() => {
			e.removeAttribute("data-copied"), e.ariaLabel = "Copy image";
		}, x);
	}
	async #g() {
		let e = await this.#m(), t = URL.createObjectURL(e);
		Object.assign(document.createElement("a"), {
			href: t,
			download: `generation-${this.seed}-${this.#e + 1}.png`
		}).click(), setTimeout(() => URL.revokeObjectURL(t));
	}
};
//#endregion
//#region src/components/image-generation-card/index.js
t("image-generation-card", S);
//#endregion
export { S as t };
