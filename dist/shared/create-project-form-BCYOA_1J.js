import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { t as r } from "./icons-HWomdoMw.js";
import { n as i, r as a, t as o } from "./icons-Dv1KN71n.js";
import { i as s } from "./menu-BCEGADW6.js";
import { n as c } from "./swap-BK53XQML.js";
import { Dt as l, j as u } from "./lucide-BVbUPHVq.js";
import { n as d, t as f } from "./picker-CFtn-7gY.js";
//#region src/components/create-project-form/create-project-form.scss?inline
var p = ".picker-trigger{border-radius:var(--lw-radius-md);font:inherit;color:var(--lw-color-foreground);cursor:pointer;background:0 0;border:0;outline:none;align-items:center;gap:.375rem;padding:.375rem .5rem;display:inline-flex}.picker-trigger:hover,.picker-trigger[aria-expanded=true]{background:color-mix(in oklab, var(--lw-color-foreground) 6%, transparent)}.picker-trigger:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.picker-trigger>svg{color:var(--lw-color-muted-foreground);flex:none}.picker-label{color:var(--lw-color-muted-foreground)}:host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);--_well:color-mix(in oklab, var(--lw-color-foreground) 3%, var(--lw-color-background));box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:36rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);font-size:var(--lw-text-sm);border-radius:1.5rem;padding:2rem;display:block}h2,p{margin:0}button,input{font:inherit;color:inherit;outline:none}button:focus-visible,input:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.title{font-size:var(--lw-text-lg);font-weight:600}.description{color:var(--_muted);margin-top:.5rem;line-height:1.5}.field{margin-top:1.75rem}.label{margin-bottom:.625rem;font-weight:500;display:block}.name-box{border:1px solid var(--_line);border-radius:var(--lw-radius-lg);background:var(--_well);overflow:hidden}.name-box:focus-within{border-color:color-mix(in oklab, var(--lw-color-foreground) 35%, transparent)}.name{box-sizing:border-box;width:100%;font-size:var(--lw-text-md);background:0 0;border:0;padding:.875rem 1rem;display:block}.name:focus-visible{outline:none}.name::placeholder{color:var(--_muted)}.address{border-top:1px dashed var(--_line);font-family:var(--lw-font-mono);align-items:center;gap:.5rem;padding:.75rem 1rem;display:flex}.address>svg{color:var(--_muted);flex:none}.domain{color:var(--_muted)}.slug{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;margin-left:-.5rem;overflow:hidden}.slug[data-empty]{color:var(--_muted)}.availability{font-family:var(--lw-font-sans);color:var(--_muted);flex:none;align-items:center;gap:.375rem;display:inline-flex}.availability[data-state=free]{color:var(--lw-color-accent)}.availability[data-state=taken]{color:var(--lw-color-destructive)}.hint{color:var(--_muted);margin-top:.5rem}.templates{grid-template-columns:repeat(auto-fit,minmax(7rem,1fr));gap:.5rem;display:grid}.template{border:1px solid var(--_line);border-radius:var(--lw-radius-lg);text-align:left;cursor:pointer;background:0 0;justify-items:start;gap:.125rem;padding:.5rem .5rem .75rem;display:grid;position:relative}@media (prefers-reduced-motion:no-preference){.template{transition:border-color .15s ease-out,box-shadow .15s ease-out}}.template:hover{border-color:color-mix(in oklab, var(--lw-color-foreground) 30%, transparent)}.template[aria-checked=true]{border-color:var(--lw-color-foreground);box-shadow:0 0 0 1px var(--lw-color-foreground)}.sketch{border-radius:var(--lw-radius-md);background:var(--_well);fill:none;width:100%;height:auto;stroke:var(--_muted);stroke-width:1.5px;stroke-linecap:round;margin-bottom:.5rem}.template-name{padding-inline:.25rem;font-weight:500}.template-detail{color:var(--_muted);padding-inline:.25rem}.tick{border:1px solid var(--_line);background:var(--lw-color-background);border-radius:50%;place-items:center;width:1.125rem;height:1.125rem;display:grid;position:absolute;top:.875rem;right:.875rem}.tick .icon{opacity:0;width:.75rem;height:.75rem}[aria-checked=true]>.tick{border-color:var(--lw-color-foreground);background:var(--lw-color-foreground);color:var(--lw-color-background)}[aria-checked=true]>.tick .icon{opacity:1}.picker,.picker-trigger{width:100%;display:flex}.picker-trigger{border:1px solid var(--_line);background:var(--_well);font-size:var(--lw-text-md);justify-content:space-between;padding:.75rem 1rem}.visibility{border:1px solid var(--_line);border-radius:var(--lw-radius-lg);padding:.25rem;display:inline-flex}.seg{border-radius:var(--lw-radius-md);color:var(--_muted);cursor:pointer;background:0 0;border:0;padding:.375rem 1rem}.seg[aria-checked=true]{background:color-mix(in oklab, var(--lw-color-foreground) 9%, transparent);color:var(--lw-color-foreground)}.foot{justify-content:space-between;align-items:center;gap:1rem;margin-top:2rem;display:flex}.error{color:var(--lw-color-destructive)}", m = 350, h = {
	blank: "<rect x=\"38\" y=\"14\" width=\"44\" height=\"36\" rx=\"3\" stroke-dasharray=\"3 3\"/><path d=\"M60 26v12M54 32h12\"/>",
	cli: "<rect x=\"14\" y=\"10\" width=\"92\" height=\"44\" rx=\"4\"/><path d=\"m24 24 6 5-6 5M36 34h14\"/><path d=\"M24 44h40\" opacity=\".5\"/>",
	library: "<rect x=\"14\" y=\"10\" width=\"40\" height=\"44\" rx=\"4\"/><rect x=\"66\" y=\"10\" width=\"40\" height=\"44\" rx=\"4\"/><path d=\"M22 22h24M22 30h18M74 22h24M74 30h18\"/>",
	firmware: "<rect x=\"34\" y=\"14\" width=\"52\" height=\"36\" rx=\"3\"/><rect x=\"48\" y=\"24\" width=\"24\" height=\"16\" rx=\"2\"/><path d=\"M42 14V8M54 14V8M66 14V8M78 14V8M42 56v-6M54 56v-6M66 56v-6M78 56v-6\"/>"
}, g = [
	{
		id: "blank",
		name: "Blank",
		detail: "Empty repo"
	},
	{
		id: "cli",
		name: "CLI tool",
		detail: "C and Make"
	},
	{
		id: "library",
		name: "Library",
		detail: "Static and shared"
	},
	{
		id: "firmware",
		name: "Firmware",
		detail: "Bare-metal ARM"
	}
], _ = [
	{
		value: "fra1",
		label: "Frankfurt",
		code: "FRA1",
		latency: 18
	},
	{
		value: "iad1",
		label: "Washington, D.C.",
		code: "IAD1",
		latency: 92
	},
	{
		value: "sfo1",
		label: "San Francisco",
		code: "SFO1",
		latency: 148
	},
	{
		value: "nrt1",
		label: "Tokyo",
		code: "NRT1",
		latency: 231
	}
], v = [
	"api",
	"core",
	"web",
	"runtime",
	"lower"
], y = (e) => e.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40), b = class extends e {
	static styles = [
		r,
		s,
		c,
		p
	];
	static props = {
		heading: { default: "New project" },
		description: { default: "Builds on every push to main and ships a release binary for each target. You can change any of this later." },
		domain: { default: "lowersoft.dev" },
		template: { default: "cli" },
		region: { default: "fra1" },
		visibility: { default: "private" },
		templates: {
			type: Object,
			default: g
		},
		regions: {
			type: Object,
			default: _
		},
		taken: {
			type: Object,
			default: v
		}
	};
	#e;
	#t = 0;
	#n = {
		slug: "",
		free: null
	};
	render() {
		return `<form class="form" novalidate><header><h2 class="title"></h2><p class="description"></p></header>
<section class="field"><label class="label" for="name">Project name</label><div class="name-box"><input class="name" id="name" type="text" autocomplete="off" spellcheck="false" placeholder="Billing daemon" aria-describedby="name-hint availability"><p class="address">${a(u, 16)}<span class="domain"></span><span class="slug"></span><span class="availability" id="availability" aria-live="polite"></span></p></div><p class="hint" id="name-hint">Becomes the project's address. Branches get their own.</p></section>
<section class="field"><p class="label" id="template-label">Template</p><div class="templates" role="radiogroup" aria-labelledby="template-label"></div></section>
<section class="field"><p class="label" id="region-label">Build region</p>${d("region-menu")}</section>
<section class="field"><p class="label" id="visibility-label">Visibility</p><div class="visibility" role="radiogroup" aria-labelledby="visibility-label"><button class="seg" type="button" role="radio" data-value="private">Private</button><button class="seg" type="button" role="radio" data-value="public">Public</button></div></section>
<footer class="foot"><p class="error" role="alert"></p><lw-button class="create" type="submit">Create project</lw-button></footer></form>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.#e = f(this.query(".picker"), this.signal, (e) => this.region = e), this.query(".picker-trigger").setAttribute("aria-labelledby", "region-label"), this.query(".name").addEventListener("input", () => this.#o(), e), this.query(".templates").addEventListener("click", (e) => {
			let t = e.target.closest(".template");
			t && (this.template = t.dataset.id);
		}, e), this.query(".visibility").addEventListener("click", (e) => {
			let t = e.target.closest(".seg");
			t && (this.visibility = t.dataset.value);
		}, e);
		for (let t of this.shadowRoot.querySelectorAll("[role=\"radiogroup\"]")) t.addEventListener("keydown", (e) => this.#i(e, t), e);
		this.query(".form").addEventListener("submit", (e) => {
			e.preventDefault(), this.#c();
		}, e), this.signal.addEventListener("abort", () => clearTimeout(this.#t));
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", this.query(".description").textContent = this.description ?? "", this.query(".domain").textContent = `${this.domain}/`, e.has("templates") && (this.query(".templates").innerHTML = this.templates.map((e) => `<button class="template" type="button" role="radio" data-id="${n(e.id)}"><svg class="sketch" viewBox="0 0 120 64" aria-hidden="true">${h[e.id] ?? h.blank}</svg><span class="template-name">${n(e.name)}</span><span class="template-detail">${n(e.detail)}</span><span class="tick" aria-hidden="true">${o}</span></button>`).join(""));
		for (let e of this.shadowRoot.querySelectorAll(".template")) this.#r(e, e.dataset.id === this.template);
		for (let e of this.shadowRoot.querySelectorAll(".seg")) this.#r(e, e.dataset.value === this.visibility);
		this.#e?.set(this.regions.map((e) => ({
			value: e.value,
			label: e.label,
			description: `${e.code} · ~${e.latency} ms`
		})), this.region), this.#s();
	}
	#r(e, t) {
		e.ariaChecked = String(t), e.tabIndex = t ? 0 : -1;
	}
	#i(e, t) {
		let n = {
			ArrowRight: 1,
			ArrowDown: 1,
			ArrowLeft: -1,
			ArrowUp: -1
		}[e.key];
		if (!n) return;
		e.preventDefault();
		let r = [...t.querySelectorAll("[role=\"radio\"]")], i = r[(r.findIndex((e) => e.ariaChecked === "true") + n + r.length) % r.length];
		i.click(), i.focus();
	}
	get #a() {
		return y(this.query(".name").value);
	}
	#o() {
		clearTimeout(this.#t);
		let e = this.#a;
		this.#n = {
			slug: e,
			free: null
		}, this.#s(), e && (this.#t = setTimeout(async () => {
			let t;
			try {
				t = this.check ? await this.check(e) : !this.taken.includes(e);
			} catch {
				t = null;
			}
			this.#a === e && (this.#n = {
				slug: e,
				free: t
			}, this.#s());
		}, m));
	}
	#s() {
		let e = this.#a;
		this.query(".slug").textContent = e || "your-project", this.query(".slug").toggleAttribute("data-empty", !e);
		let t = this.query(".availability"), n = e ? this.#n.slug !== e || this.#n.free === null ? "checking" : this.#n.free ? "free" : "taken" : "";
		t.dataset.state = n, t.innerHTML = {
			"": "",
			checking: `${i}<span>Checking</span>`,
			free: `${o}<span>Available</span>`,
			taken: `${a(l, 16)}<span>Taken</span>`
		}[n], this.query(".create").disabled = n !== "free";
	}
	async #c() {
		if (this.#n.free !== !0 || this.#n.slug !== this.#a) return;
		let e = {
			name: this.query(".name").value.trim(),
			slug: this.#a,
			template: this.template,
			region: this.region,
			visibility: this.visibility
		}, t = this.query(".create"), n = this.query(".error");
		n.textContent = "", t.loading = !0;
		try {
			await this.create?.(e);
		} catch (e) {
			n.textContent = e?.message || "The project could not be created. Try again.";
			return;
		} finally {
			t.loading = !1;
		}
		t.textContent = "Created", t.disabled = !0, this.emit("create", e);
	}
};
//#endregion
//#region src/components/create-project-form/index.js
t("create-project-form", b);
//#endregion
export { b as t };
