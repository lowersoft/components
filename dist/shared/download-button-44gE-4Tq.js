import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./icons-HWomdoMw.js";
import { n, t as r } from "./button-CQIqPjy6.js";
//#region src/components/download-button/download-button.scss?inline
var i = ".button{text-align:start;min-width:16rem;height:auto;padding:0;position:relative;overflow:hidden}.button:active{transform:none}.face{flex:1;align-items:center;gap:.75rem;min-width:0;padding:.5rem 1rem;display:flex}.ink{background:var(--_fg);color:var(--_bg);clip-path:inset(0 calc(100% - var(--_progress,0) * 100%) 0 0);pointer-events:none;display:flex;position:absolute;inset:0}@media (prefers-reduced-motion:no-preference){.ink{transition:clip-path .15s linear}}.ink .meta{color:color-mix(in oklab, currentColor 70%, transparent)}:host(:is([variant=outline],[variant=ghost])) .ink{color:var(--lw-color-background)}.glyph{flex:none;display:flex}.glyph .icon{display:none}:host(:not([status=downloading],[status=done],[status=error])) .download,:host([status=downloading]) .download,:host([status=done]) .open,:host([status=error]) .retry{display:block}:host([status=downloading]) .button:is(:hover,:focus-visible) .download{display:none}:host([status=downloading]) .button:is(:hover,:focus-visible) .stop{display:block}.lines{min-width:0;line-height:1.3;display:grid}.name,.cancel{text-overflow:ellipsis;white-space:nowrap;transition:opacity var(--lw-duration-fast) var(--lw-ease-out);grid-area:1/1;font-weight:500;overflow:hidden}.cancel,:host([status=downloading]) .button:is(:hover,:focus-visible) .name{opacity:0}:host([status=downloading]) .button:is(:hover,:focus-visible) .cancel{opacity:1}.meta{color:color-mix(in oklab, var(--_fg) 65%, transparent);font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;white-space:nowrap}.live{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", a = (e, t) => `<svg class="icon ${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${t}"/></svg>`, o = `<span class="face"><span class="glyph">${[
	a("download", "M12 3v12m-5-5 5 5 5-5M5 21h14"),
	a("stop", "M18 6 6 18M6 6l12 12"),
	a("open", "M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"),
	a("retry", "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5")
].join("")}</span><span class="lines"><span class="name"></span><span class="cancel"></span><span class="meta"></span></span></span>`, s = [
	"kilobyte",
	"megabyte",
	"gigabyte"
], c = .2, l = (e) => {
	let t = e / 1e3, n = Math.min(Math.max(Math.floor(Math.log10(Math.max(t, 1)) / 3), 0), s.length - 1), r = t / 1e3 ** n;
	return new Intl.NumberFormat(void 0, {
		style: "unit",
		unit: s[n],
		unitDisplay: "short",
		maximumFractionDigits: r >= 100 ? 0 : 1
	}).format(r);
}, u = new Intl.NumberFormat(void 0, {
	style: "unit",
	unit: "second",
	unitDisplay: "narrow"
}), d = class extends r {
	static styles = [
		n,
		t,
		i
	];
	static props = {
		...r.props,
		status: {
			default: "idle",
			reflect: !0
		},
		href: {},
		filename: {},
		type: {},
		size: { type: Number },
		cancelLabel: { default: "Cancel" },
		openLabel: { default: "Open" },
		failedLabel: { default: "Download failed" },
		retryLabel: { default: "Retry" },
		leftLabel: { default: "left" }
	};
	#e = null;
	#t = null;
	render() {
		return `<button class="button" part="button" type="button">${o}<span class="ink" aria-hidden="true">${o}</span></button><span class="live" aria-live="polite"></span>`;
	}
	connected() {
		super.connected(), this.signal.addEventListener("abort", () => {
			this.#e?.abort(), this.#c(), this.#s();
		});
	}
	updated(e) {
		super.updated(e), this.#u(".cancel", this.cancelLabel), this.#u(".name", this.#n), this.status !== "downloading" && this.#o();
	}
	get #n() {
		return this.filename ?? decodeURIComponent(this.href?.split(/[?#]/)[0].split("/").pop() ?? "");
	}
	handleClick() {
		this.status === "downloading" ? this.#e.abort() : this.status === "done" ? open(this.#t, "_blank", "noopener") : this.#r();
	}
	async #r() {
		let e = new AbortController(), { signal: t } = e, n = null;
		if (this.emit("start", {
			signal: t,
			respondWith: (e) => n = e
		})) {
			this.#e = e, this.#c(), this.status = "downloading", this.query(".button").ariaLabel = `${this.cancelLabel}, ${this.#n}`, this.#a(0, this.size);
			try {
				let e = await this.#i(await (n ?? fetch(this.href, { signal: t })), t);
				this.#t = URL.createObjectURL(e), this.status = "done", this.#l(`${this.#n}, ${this.openLabel}`), this.emit("complete", { blob: e }) && Object.assign(document.createElement("a"), {
					href: this.#t,
					download: this.#n
				}).click();
			} catch (e) {
				if (t.aborted) {
					this.#s(), this.emit("cancel");
					return;
				}
				this.status = "error", this.#l(this.failedLabel), this.emit("error", { error: e });
			} finally {
				this.#e = null;
			}
		}
	}
	async #i(e, t) {
		if (!e.ok) throw Error(`HTTP ${e.status}`);
		let n = Number(e.headers.get("content-length")) || this.size || 0, r = e.body.getReader();
		t.addEventListener("abort", () => r.cancel(), { once: !0 });
		let i = [], a = performance.now(), o = 0, s = 0;
		for (;;) {
			let { done: e, value: l } = await r.read();
			if (t.aborted) throw t.reason;
			if (e) break;
			i.push(l), o += l.length;
			let u = (performance.now() - a) / 1e3;
			s = s ? s + (o / u - s) * c : o / u, this.#a(o, n, s);
		}
		return new Blob(i, { type: e.headers.get("content-type") ?? "" });
	}
	#a(e, t, n = 0) {
		let r = t ? Math.min(e / t, 1) : 0;
		this.query(".button").style.setProperty("--_progress", r);
		let i = t ? `${l(e)} / ${l(t)}` : l(e), a = n && t ? ` · ${u.format(Math.ceil((t - e) / n))} ${this.leftLabel}` : "";
		this.#u(".meta", i + a);
	}
	#o() {
		let e = [this.type, this.size ? l(this.size) : null].filter(Boolean).join(" · "), t = {
			done: [this.openLabel, e].filter(Boolean).join(" · "),
			error: `${this.failedLabel} · ${this.retryLabel}`
		}[this.status] ?? e;
		this.#u(".meta", t), this.query(".button").style.setProperty("--_progress", +(this.status === "done")), this.query(".button").ariaLabel = [this.#n, t].filter(Boolean).join(", ");
	}
	#s() {
		this.status = "idle", this.#l("");
	}
	#c() {
		this.#t && URL.revokeObjectURL(this.#t), this.#t = null;
	}
	#l(e) {
		this.query(".live").textContent = e;
	}
	#u(e, t) {
		for (let n of this.shadowRoot.querySelectorAll(e)) n.textContent = t ?? "";
	}
};
//#endregion
//#region src/components/download-button/index.js
e("download-button", d);
//#endregion
export { d as t };
