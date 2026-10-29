import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { t as i } from "./clipboard-BCkfa02P.js";
import { n as a, t as o } from "./people-C_zYMoEl.js";
import { G as s, K as c, b as l, d as u, rt as d } from "./lucide-BVbUPHVq.js";
//#region src/components/contact-card/contact-card.scss?inline
var f = ":host{box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:24rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);border-radius:1.5rem;padding:1.25rem;display:block}p{margin:0}.head{align-items:center;gap:.75rem;display:flex}.avatar{background:var(--lightningcss-light,oklch(.94 .025 var(--_hue)))var(--lightningcss-dark,oklch(.32 .03 var(--_hue)));color:var(--lightningcss-light,oklch(.42 .05 var(--_hue)))var(--lightningcss-dark,oklch(.86 .04 var(--_hue)));width:2.75rem;height:2.75rem;font-size:var(--lw-text-sm);border-radius:50%;flex:none;place-items:center;font-weight:600;display:grid}.who{flex:1;min-width:0}.name{font-size:var(--lw-text-md);font-weight:600}.role{font-size:var(--lw-text-sm);color:var(--lw-color-muted-foreground)}.now{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);flex:none;align-items:center;gap:.375rem;display:inline-flex}.now:before{content:\"\";background:var(--lw-color-ring);border-radius:50%;width:.375rem;height:.375rem}.now[data-working]:before{background:var(--lightningcss-light,#10b981)var(--lightningcss-dark,#34d399)}.day{border-radius:var(--lw-radius-lg);background:var(--lw-color-muted);margin-top:1rem;padding:.75rem}.read{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-muted-foreground);overflow:hidden}:host([data-scrubbing]) .read{color:var(--lw-color-foreground)}.strip{border-radius:var(--lw-radius-sm);cursor:ew-resize;touch-action:pan-y;-webkit-user-select:none;user-select:none;outline:none;gap:.25rem;margin-top:.5rem;display:grid;position:relative}.strip:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:4px}.track{align-items:center;gap:.5rem;display:flex}.label{text-overflow:ellipsis;white-space:nowrap;width:2.75rem;color:var(--lw-color-muted-foreground);flex:none;font-size:11px;overflow:hidden}.cells{flex:1;grid-template-columns:repeat(24,1fr);gap:1px;height:1rem;display:grid}.cells span{background:var(--lw-color-background);border-radius:2px;transition:background-color .2s ease-out}.cells span[data-on]{background:var(--lw-color-border)}.cells span[data-both]{background:var(--lw-color-foreground)}.cursor{inset-block:-.25rem;left:calc(3.25rem + (100% - 3.25rem) * var(--_at,0));pointer-events:none;background:var(--lightningcss-light,#f97316)var(--lightningcss-dark,#fb923c);border-radius:1px;width:2px;position:absolute;translate:-50%}.ticks{font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);justify-content:space-between;margin:.25rem 0 0 3.25rem;font-size:10px;display:flex}.rows{margin:.75rem -.5rem 0;padding:0;list-style:none}.rows button{border-radius:var(--lw-radius-md);width:100%;font:var(--lw-text-sm) var(--lw-font-sans);text-align:left;color:inherit;cursor:copy;transition:background-color var(--lw-duration-fast) ease-out;background:0 0;border:0;outline:none;align-items:center;gap:.625rem;padding:.5rem;display:flex}.rows button>svg{color:var(--lw-color-muted-foreground);flex:none}.rows button:hover{background:var(--lw-color-muted)}.rows button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.value{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.hint{color:var(--lw-color-muted-foreground);opacity:0;transition:opacity var(--lw-duration-fast) ease-out;display:grid}.hint svg{transition:opacity var(--lw-duration-fast) ease-out;grid-area:1/1}.hint svg:last-child{opacity:0;color:var(--lightningcss-light,#059669)var(--lightningcss-dark,#34d399)}button:hover .hint,button:focus-visible .hint,[data-copied] .hint{opacity:1}[data-copied] .hint svg:first-child{opacity:0}[data-copied] .hint svg:last-child{opacity:1}.save{margin-top:.75rem;display:flex}", p = 24, m = 1500, h = (e) => {
	let t = /* @__PURE__ */ new Date(), n = new Date(t.toLocaleString("en-US", { timeZone: e })), r = new Date(t.toLocaleString("en-US", { timeZone: "UTC" }));
	return Math.round((n - r) / 6e4);
}, g = (e) => {
	let t = (Math.round(e) % 1440 + 1440) % 1440;
	return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}, _ = (e, { start: t, end: n }) => t <= n ? e >= t && e < n : e >= t || e < n, v = (e) => String(e ?? "").replace(/[\\,;]/g, (e) => `\\${e}`), y = class extends e {
	static styles = f;
	static props = {
		name: { default: "Lena Fischer" },
		role: { default: "Staff engineer · Platform" },
		email: { default: "lena@lowersoft.dev" },
		phone: { default: "+49 30 901820" },
		location: { default: "Berlin, Germany" },
		zone: { default: "Europe/Berlin" },
		hours: {
			type: Object,
			default: {
				start: 9,
				end: 18
			}
		},
		yourZone: { default: Intl.DateTimeFormat().resolvedOptions().timeZone },
		yourHours: {
			type: Object,
			default: {
				start: 9,
				end: 17
			}
		}
	};
	#e = null;
	#t = 0;
	#n = 0;
	render() {
		let e = Array.from({ length: p }, () => "<span></span>").join("");
		return `<div class="head"><span class="avatar" aria-hidden="true"></span><div class="who"><p class="name"></p><p class="role"></p></div><span class="now"></span></div>
<div class="day"><p class="read" aria-live="polite"></p>
<div class="strip" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="23"><div class="track"><span class="label">You</span><div class="cells you">${e}</div></div><div class="track"><span class="label them-label"></span><div class="cells them">${e}</div></div><span class="cursor" aria-hidden="true"></span></div>
<div class="ticks" aria-hidden="true"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div></div>
<ul class="rows"></ul>
<lw-button class="save" variant="secondary">Save contact</lw-button>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".strip");
		t.addEventListener("pointerdown", (e) => {
			e.currentTarget.setPointerCapture?.(e.pointerId), this.#s(e.clientX);
		}, e), t.addEventListener("pointermove", (e) => (e.pointerType === "mouse" || e.currentTarget.hasPointerCapture?.(e.pointerId)) && this.#s(e.clientX), e), t.addEventListener("pointerleave", () => this.#o(null), e), t.addEventListener("keydown", (e) => this.#c(e), e), this.query(".rows").addEventListener("click", (e) => {
			let t = e.target.closest("button");
			t && this.#l(t);
		}, e), this.query(".save").addEventListener("click", () => this.#u(), e), this.#t = setInterval(() => this.#i(), 3e4), this.signal.addEventListener("abort", () => {
			clearInterval(this.#t), clearTimeout(this.#n);
		});
	}
	updated() {
		let e = this.query(".avatar");
		e.textContent = a(this.name ?? ""), e.style.setProperty("--_hue", o(this.name ?? "")), this.query(".name").textContent = this.name ?? "", this.query(".role").textContent = this.role ?? "", this.query(".them-label").textContent = (this.name ?? "").split(" ")[0];
		let t = [
			[
				"email",
				s,
				this.email
			],
			[
				"phone",
				d,
				this.phone
			],
			[
				"location",
				c,
				this.location
			]
		].filter(([, , e]) => e);
		this.query(".rows").innerHTML = t.map(([e, t, i]) => `<li><button type="button" data-field="${e}" data-value="${n(i)}" aria-label="Copy ${e}: ${n(i)}">${r(t)}<span class="value">${n(i)}</span><span class="hint">${r(l, 14)}${r(u, 14)}</span></button></li>`).join(""), this.#i();
	}
	get #r() {
		return h(this.zone) - h(this.yourZone);
	}
	#i() {
		let e = this.#r, t = (t) => ((t + e / 60) % p + p) % p, n = [...this.query(".cells.you").children], r = [...this.query(".cells.them").children];
		for (let e = 0; e < p; e++) {
			let i = _(e, this.yourHours), a = _(Math.floor(t(e)), this.hours);
			n[e].toggleAttribute("data-on", i), r[e].toggleAttribute("data-on", a), n[e].toggleAttribute("data-both", i && a), r[e].toggleAttribute("data-both", i && a);
		}
		let i = /* @__PURE__ */ new Date(), a = i.getUTCHours() * 60 + i.getUTCMinutes() + h(this.yourZone), o = a + e, s = (a % 1440 + 1440) % 1440;
		this.style.setProperty("--_now", String(s / 1440));
		let c = _(Math.floor((o % 1440 + 1440) % 1440 / 60), this.hours), l = this.query(".now");
		l.textContent = `${g(o)} ${c ? "· working" : "· off"}`, l.toggleAttribute("data-working", c);
		let u = (this.name ?? "").split(" ")[0], d = this.#e ?? s;
		this.query(".read").textContent = this.#e === null ? `${g(o)} for ${u} now · ${this.#a()}` : `${g(d)} for you · ${g(d + e)} for ${u}`, this.style.setProperty("--_at", String(d / 1440)), this.toggleAttribute("data-scrubbing", this.#e !== null);
		let f = this.query(".strip");
		f.ariaLabel = `Working hours, yours and ${u}'s. Use the arrow keys to read a time.`, f.ariaValueNow = String(Math.floor(d / 60)), f.ariaValueText = `${g(d)} for you, ${g(d + e)} for ${u}`;
	}
	#a() {
		let e = [...this.query(".cells.you").children].map((e) => e.hasAttribute("data-both")), t = e.filter(Boolean).length;
		return t ? `${t} h overlap from ${g(e.findIndex(Boolean) * 60)}` : "no overlap";
	}
	#o(e) {
		this.#e = e, this.#i();
	}
	#s(e) {
		let t = this.query(".cells.you").getBoundingClientRect(), n = Math.min(1, Math.max(0, (e - t.left) / t.width));
		this.#o(Math.min(1439, Math.round(n * 1440 / 15) * 15));
	}
	#c(e) {
		let t = {
			ArrowRight: 60,
			ArrowLeft: -60,
			ArrowUp: 15,
			ArrowDown: -15
		}[e.key];
		if (e.key === "Escape") {
			this.#o(null);
			return;
		}
		if (!t) return;
		e.preventDefault();
		let n = Number.parseFloat(this.style.getPropertyValue("--_now")) * 1440;
		this.#o((((this.#e ?? Math.round(n / 15) * 15) + t) % 1440 + 1440) % 1440);
	}
	async #l(e) {
		try {
			await i(e.dataset.value);
		} catch {
			return;
		}
		for (let e of this.shadowRoot.querySelectorAll("[data-copied]")) e.removeAttribute("data-copied");
		e.toggleAttribute("data-copied", !0), clearTimeout(this.#n), this.#n = setTimeout(() => e.removeAttribute("data-copied"), m), this.emit("copy", {
			field: e.dataset.field,
			value: e.dataset.value
		});
	}
	#u() {
		let [e = "", ...t] = (this.name ?? "").split(" "), n = [
			"BEGIN:VCARD",
			"VERSION:3.0",
			`N:${v(t.join(" "))};${v(e)};;;`,
			`FN:${v(this.name)}`,
			this.role && `TITLE:${v(this.role)}`,
			this.email && `EMAIL;TYPE=INTERNET:${v(this.email)}`,
			this.phone && `TEL;TYPE=CELL:${v(this.phone)}`,
			this.location && `ADR;TYPE=WORK:;;${v(this.location)};;;;`,
			`TZ:${v(this.zone)}`,
			"END:VCARD"
		].filter(Boolean).join("\r\n"), r = URL.createObjectURL(new Blob([n], { type: "text/vcard" }));
		Object.assign(document.createElement("a"), {
			href: r,
			download: `${(this.name ?? "contact").replace(/\s+/g, "-").toLowerCase()}.vcf`
		}).click(), setTimeout(() => URL.revokeObjectURL(r));
	}
};
//#endregion
//#region src/components/contact-card/index.js
t("contact-card", y);
//#endregion
export { y as t };
