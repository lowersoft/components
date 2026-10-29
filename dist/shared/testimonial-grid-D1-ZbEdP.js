import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { n as r } from "./motion-CFWhFfc_.js";
import { n as i, t as a } from "./highlight-BSyGT8bg.js";
import { n as o, r as s, t as c } from "./testimonial-Cc4crTCQ.js";
//#region src/components/testimonial-grid/testimonial-grid.scss?inline
var l = ".company{align-items:center;gap:.5rem;font-weight:500;display:inline-flex}.company-mark{background:var(--_mark);color:#fff;border-radius:.3125rem;flex:none;place-items:center;width:1.25rem;height:1.25rem;font-size:.6875rem;font-weight:700;display:grid}.person{align-items:center;gap:.75rem;min-width:0;display:flex}.face{background:var(--lw-color-muted);border-radius:50%;flex:none;width:2rem;height:2rem;display:block;overflow:hidden}.face svg{width:100%;height:100%;display:block}.person-name{font-weight:500;display:block}.person-role{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground);display:block}mark{background:color-mix(in oklab, var(--_tint,var(--lw-color-foreground)) 22%, transparent);color:var(--lw-color-foreground);-webkit-box-decoration-break:clone;box-decoration-break:clone;border-radius:.2em;padding:0 .15em}:host{--_line:var(--lw-color-border);--_muted:var(--lw-color-muted-foreground);font-family:var(--lw-font-sans);font-size:var(--lw-text-sm);color:var(--lw-color-foreground);display:block;container-type:inline-size}h2,p,blockquote,figure{margin:0}button{font:inherit;color:inherit;outline:none}button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.head{flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:1.5rem;margin-bottom:2rem;display:flex}.title{letter-spacing:-.03em;max-width:24rem;font-size:clamp(1.75rem,4vw,2.25rem);font-weight:500;line-height:1.1}.rating{font-size:var(--lw-text-xs);color:var(--_muted);align-items:center;gap:.5rem;margin-top:1rem;display:flex}.faces{margin-right:.25rem;display:flex}.faces .face{width:1.5rem;height:1.5rem;box-shadow:0 0 0 2px var(--lw-color-background)}.faces .face+.face{margin-left:-.375rem}.stars{letter-spacing:.05em;color:var(--lw-color-foreground)}.score{color:var(--lw-color-foreground);font-weight:600}.filters{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--lw-color-foreground) 5%, transparent);flex-wrap:wrap;padding:.25rem;display:flex;position:relative}.filter-pill{border-radius:var(--lw-radius-md);background:var(--lw-color-muted);opacity:0;pointer-events:none;overflow-anchor:none;position:absolute;top:0;left:0}@media (prefers-reduced-motion:no-preference){.filter-pill{transition:translate .2s var(--lw-ease-out), width .2s var(--lw-ease-out), height .2s var(--lw-ease-out), opacity .15s var(--lw-ease-out)}}.filter-pill.visible{opacity:1}.filter-pill{border-radius:var(--lw-radius-full);background:var(--lw-color-background);box-shadow:var(--lw-shadow-sm)}.filter{border-radius:var(--lw-radius-full);font-size:var(--lw-text-xs);color:var(--_muted);cursor:pointer;background:0 0;border:0;gap:.375rem;padding:.375rem .75rem;display:inline-flex;position:relative}.filter[aria-checked=true]{color:var(--lw-color-foreground)}.filter-count{opacity:.6}.grid{grid-auto-flow:dense;gap:.75rem;display:grid}@container (width>=40rem){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@container (width>=60rem){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}.card{border:1px solid var(--_line);background:color-mix(in oklab, var(--lw-color-foreground) 2%, var(--lw-color-background));border-radius:1rem;flex-direction:column;min-height:14rem;padding:1.25rem;display:flex}.card[hidden]{display:none}@container (width>=40rem){.card.wide{grid-column:span 2}}.card .person{margin-top:auto;padding-top:1.5rem}.card-head{font-size:var(--lw-text-xs);justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1.25rem;display:flex}.source{color:var(--_muted)}.text{color:var(--_muted);text-wrap:pretty;line-height:1.6}.wide .text{letter-spacing:-.01em;font-size:clamp(1.125rem,2.4vw,1.5rem);line-height:1.35}.figure{letter-spacing:-.04em;font-size:2.5rem;font-weight:500;line-height:1}.label{font-size:var(--lw-text-xs);color:var(--_muted);margin-top:.5rem}.bars{align-items:flex-end;gap:3px;height:3rem;margin-top:1.25rem;display:flex}.bar{background:color-mix(in oklab, var(--lw-color-foreground) 12%, transparent);border-radius:2px 2px 0 0;flex:1}.bar[data-on]{background:var(--_tint)}.ends{color:var(--_muted);justify-content:space-between;margin-top:.5rem;font-size:.6875rem;display:flex}", u = {
	duration: 450,
	easing: "cubic-bezier(0.23, 1, 0.32, 1)"
}, d = [
	{
		tag: "Engineering",
		wide: !0,
		company: {
			name: "Northwind",
			color: "#3b6ef5"
		},
		source: "G2 · Sep 2026",
		quote: "We deleted four thousand lines of homegrown glue in a week. What replaced it is ==code our team actually reads, profiles and owns==.",
		person: {
			name: "Maya Okafor",
			role: "Staff Engineer, Northwind"
		}
	},
	{
		tag: "Founders",
		company: {
			name: "Lumen",
			color: "#e5484d"
		},
		stat: "4 days",
		label: "from first commit to running in production",
		bars: [
			9,
			9,
			8,
			7,
			5,
			3,
			2
		],
		highlight: 2,
		from: "First build",
		to: "Latest",
		person: {
			name: "Theo Laurent",
			role: "Founder, Lumen"
		}
	},
	{
		tag: "Engineering",
		company: {
			name: "Halcyon",
			color: "#12a594"
		},
		source: "Product Hunt · Oct 2026",
		quote: "Startup time, memory and tail latency finally match the budget, so ==review is about the product again== instead of the allocator.",
		person: {
			name: "Iris Novak",
			role: "Engineering Lead, Halcyon"
		}
	},
	{
		tag: "Engineering",
		company: {
			name: "Parcel",
			color: "#f76b15"
		},
		source: "G2 · Aug 2026",
		quote: "Our sanitizer run came back with ==two findings==. The year before it was forty.",
		person: {
			name: "Sam Whitfield",
			role: "Systems Engineer, Parcel"
		}
	},
	{
		tag: "Performance",
		company: {
			name: "Fieldnote",
			color: "#8e4ec6"
		},
		stat: "−38%",
		label: "peak memory on the ingest service",
		bars: [
			8,
			8.4,
			7.8,
			7.8,
			5.2,
			5,
			4.9
		],
		highlight: 3,
		from: "Mar",
		to: "Sep",
		person: {
			name: "Priya Raman",
			role: "Performance Engineer, Fieldnote"
		}
	},
	{
		tag: "Founders",
		company: {
			name: "Arcadia",
			color: "#30a46c"
		},
		source: "Capterra · Sep 2026",
		quote: "It paid for itself ==in the first sprint==. We now run on half the machines we had.",
		person: {
			name: "Jonas Berg",
			role: "CEO, Arcadia"
		}
	},
	{
		tag: "Performance",
		company: {
			name: "Mosaic",
			color: "#d6409f"
		},
		source: "G2 · Oct 2026",
		quote: "Every hot path has a benchmark in CI, which ==used to be the last week of every release==.",
		person: {
			name: "Lea Fontaine",
			role: "Performance Lead, Mosaic"
		}
	},
	{
		tag: "Engineering",
		company: {
			name: "Tandem",
			color: "#0090ff"
		},
		source: "Product Hunt · Sep 2026",
		quote: "The source is plain C with no runtime. When we needed a variant, ==we just wrote it==.",
		person: {
			name: "Ravi Shah",
			role: "Engineer, Tandem"
		}
	}
], f = {
	score: 4.9,
	reviews: 1284,
	faces: [
		"Maya Okafor",
		"Theo Laurent",
		"Iris Novak",
		"Ravi Shah"
	]
}, p = new Intl.NumberFormat("en-US"), m = class extends e {
	static styles = l;
	static props = {
		heading: { default: "Teams that switched, in their own words" },
		rating: {
			type: Object,
			default: f
		},
		filter: {
			default: "",
			reflect: !0
		},
		items: {
			type: Object,
			default: d
		}
	};
	render() {
		return "<header class=\"head\"><div><h2 class=\"title\"></h2><p class=\"rating\"><span class=\"faces\"></span><span class=\"stars\" aria-hidden=\"true\">★★★★★</span><span class=\"score\"></span><span class=\"reviews\"></span></p></div>\n<div class=\"filters\" role=\"radiogroup\" aria-label=\"Show\"><span class=\"filter-pill\"></span></div></header><div class=\"grid\"></div>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".filters");
		t.addEventListener("click", (e) => {
			let t = e.target.closest(".filter");
			t && this.#a(t.dataset.tag);
		}, e), t.addEventListener("keydown", (e) => {
			let n = {
				ArrowRight: 1,
				ArrowDown: 1,
				ArrowLeft: -1,
				ArrowUp: -1
			}[e.key];
			if (!n) return;
			e.preventDefault();
			let r = [...t.querySelectorAll(".filter")], i = r[(r.findIndex((e) => e.ariaChecked === "true") + n + r.length) % r.length];
			this.#a(i.dataset.tag), i.focus();
		}, e);
		let n = new ResizeObserver(() => this.#r());
		n.observe(t), this.signal.addEventListener("abort", () => n.disconnect());
	}
	updated(e) {
		this.query(".title").textContent = this.heading ?? "", e.has("rating") && this.#e(), e.has("items") && this.#t(), this.#r(), this.#i(!e.has("items"));
	}
	#e() {
		let e = this.rating ?? {}, t = this.query(".faces");
		t.replaceChildren();
		for (let n of e.faces ?? []) {
			let e = Object.assign(document.createElement("span"), { className: "face" });
			o(e, n), t.append(e);
		}
		this.query(".score").textContent = String(e.score ?? ""), this.query(".reviews").textContent = e.reviews ? `from ${p.format(e.reviews)} reviews` : "", this.query(".rating").ariaLabel = `Rated ${e.score} out of 5 from ${p.format(e.reviews ?? 0)} reviews`;
	}
	#t() {
		let e = this.items ?? [], t = /* @__PURE__ */ new Map();
		for (let n of e) t.set(n.tag, (t.get(n.tag) ?? 0) + 1);
		let r = this.query(".filters");
		r.querySelectorAll(".filter").forEach((e) => e.remove()), r.insertAdjacentHTML("beforeend", [[
			"",
			"All",
			e.length
		], ...[...t].map(([e, t]) => [
			e,
			e,
			t
		])].map(([e, t, r]) => `<button class="filter" type="button" role="radio" data-tag="${n(e)}">${n(t)}<span class="filter-count">${r}</span></button>`).join(""));
		let i = this.query(".grid");
		i.innerHTML = e.map((e, t) => this.#n(e, t)).join(""), i.querySelectorAll(".card").forEach((t, n) => o(t.querySelector(".face"), e[n].person?.name));
	}
	#n(e, t) {
		let r = `<footer class="person"><span class="face"></span><span><span class="person-name">${n(e.person?.name ?? "")}</span><span class="person-role">${n(e.person?.role ?? "")}</span></span></footer>`, i = `<header class="card-head">${c(e.company)}${e.source ? `<span class="source">${n(e.source)}</span>` : ""}</header>`, a = `--_tint: ${n(e.company?.color ?? "currentColor")}`;
		if (e.stat) {
			let o = Math.max(...e.bars), s = e.bars.map((t, n) => `<span class="bar"${n >= e.bars.length - e.highlight ? " data-on" : ""} style="height: ${t / o * 100}%"></span>`).join("");
			return `<figure class="card stat" data-index="${t}" style="${a}">${i}<p class="figure">${n(e.stat)}</p><p class="label">${n(e.label)}</p>
<div class="bars" aria-hidden="true">${s}</div><p class="ends" aria-hidden="true"><span>${n(e.from)}</span><span>${n(e.to)}</span></p>${r}</figure>`;
		}
		return `<figure class="card quote${e.wide ? " wide" : ""}" data-index="${t}" style="${a}">${i}<blockquote class="text">${s(e.quote)}</blockquote>${r}</figure>`;
	}
	#r() {
		let e = null;
		for (let t of this.shadowRoot.querySelectorAll(".filter")) {
			let n = t.dataset.tag === (this.filter ?? "");
			t.ariaChecked = String(n), t.tabIndex = n ? 0 : -1, n && (e = t);
		}
		let t = this.query(".filter-pill");
		e?.offsetWidth ? i(t, e) : a(t);
	}
	#i(e) {
		let t = [...this.shadowRoot.querySelectorAll(".card")], n = new Map(t.filter((e) => !e.hidden).map((e) => [e, e.getBoundingClientRect()]));
		for (let e of t) e.hidden = !!this.filter && this.items[Number(e.dataset.index)].tag !== this.filter;
		if (e && !r.matches) for (let e of t) {
			if (e.hidden) continue;
			let t = n.get(e);
			if (!t) {
				e.animate({
					opacity: [0, 1],
					scale: [.97, 1]
				}, u);
				continue;
			}
			let r = e.getBoundingClientRect(), i = t.left - r.left, a = t.top - r.top;
			(i || a) && e.animate({ translate: [`${i}px ${a}px`, "0 0"] }, u);
		}
	}
	#a(e) {
		e !== (this.filter ?? "") && (this.filter = e, this.emit("change", { filter: e }));
	}
};
//#endregion
//#region src/components/testimonial-grid/index.js
t("testimonial-grid", m);
//#endregion
export { m as t };
