import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i, t as a } from "./motion-CFWhFfc_.js";
import { m as o, p as s } from "./lucide-BVbUPHVq.js";
//#region src/components/carousel-cards/carousel-cards.scss?inline
var c = ":host{width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);display:block;container:rail/inline-size}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}p,h2,h3{margin:0}section{--_card:13.5rem;padding-block:1rem}@container rail (width>=28rem){section{--_card:15rem}}@container rail (width>=48rem){section{--_card:16rem}}.muted{color:var(--lw-color-muted-foreground)}.top{justify-content:space-between;align-items:flex-end;gap:1rem;margin-bottom:.5rem;padding-inline:1rem;display:flex}.titles{min-width:0}.eyebrow{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}h2{font-size:var(--lw-text-lg);letter-spacing:-.01em;text-overflow:ellipsis;white-space:nowrap;font-weight:600;overflow:hidden}.controls{flex:none;align-items:center;gap:.5rem;display:flex}.controls button{border:1px solid var(--lw-color-border);background:var(--lw-color-background);width:2rem;height:2rem;color:var(--lw-color-foreground);cursor:pointer;transition:background-color var(--lw-duration-fast) ease-out, opacity var(--lw-duration-fast) ease-out;border-radius:50%;place-items:center;padding:0;display:grid}.controls button:hover:not([aria-disabled=true]){background:var(--lw-color-muted)}.controls button[aria-disabled=true]{cursor:default;opacity:.4}.controls button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.count{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);margin-right:.25rem}.scroller{overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scrollbar-width:none;outline:none;padding-block:1.5rem;position:relative;overflow-x:auto}.scroller::-webkit-scrollbar{display:none}.scroller[data-free]{scroll-snap-type:none}.scroller[data-dragging]{cursor:grabbing}@media (pointer:fine){.scroller{cursor:grab;-webkit-user-select:none;user-select:none}}.scroller:focus-visible{box-shadow:inset 0 0 0 2px var(--lw-color-ring)}.track{width:max-content;padding:0 calc(50cqw - var(--_card) / 2);gap:1rem;margin:0;list-style:none;display:flex;position:relative}.card{width:var(--_card);scroll-snap-align:center;flex:none}.tilt{position:relative}.picture{aspect-ratio:4/5;background:var(--lw-color-muted);border-radius:1rem;position:relative;overflow:hidden}.card:has(.link:focus-visible) .picture{outline:2px solid var(--lw-color-foreground);outline-offset:2px}.scene{background:var(--lw-color-border);position:absolute;inset:0}.layer{inset-block:0;width:130%;position:absolute;left:-15%}.layer svg,.layer img{width:100%;height:100%;display:block}.layer img{object-fit:cover}.sun{fill:var(--lightningcss-light,#fff)var(--lightningcss-dark,#a1a1aa)}.far{fill:var(--lightningcss-light,#d4d4d8)var(--lightningcss-dark,#27272a)}.mid{fill:var(--lightningcss-light,#a1a1aa)var(--lightningcss-dark,#18181b)}.near{fill:var(--lightningcss-light,#52525b)var(--lightningcss-dark,#09090b)}.sky{fill:var(--lightningcss-light,#e4e4e7)var(--lightningcss-dark,#3f3f46)}.badge{border-radius:var(--lw-radius-sm);background:var(--lw-color-background);box-shadow:var(--lw-shadow-sm);padding:.125rem .375rem;font-size:11px;font-weight:500;position:absolute;top:.75rem;left:.75rem}.heart{z-index:1;background:var(--lw-color-background);width:2.25rem;height:2.25rem;box-shadow:var(--lw-shadow-sm), 0 0 0 1px #0000000d;color:var(--lw-color-foreground);cursor:pointer;transition:background-color var(--lw-duration-fast) ease-out;border:0;border-radius:50%;place-items:center;padding:0;display:grid;position:absolute;top:.625rem;right:.625rem}.heart:hover{background:var(--lw-color-muted)}.heart:focus-visible{outline:2px solid var(--lw-color-foreground);outline-offset:2px}.heart svg{fill:none;stroke:currentColor;stroke-width:2px;stroke-linejoin:round;width:100%;height:100%;transition:color .2s ease-out;position:absolute;inset:0}.heart[aria-pressed=true]{color:#f43f5e}.glyph{width:1.125rem;height:1.125rem;position:relative}.fill{clip-path:inset(100% 0 0);position:absolute;inset:0}@media (prefers-reduced-motion:no-preference){.fill{transition:clip-path .3s cubic-bezier(.23,1,.32,1)}}.fill svg{fill:#f43f5e;stroke:#f43f5e}[aria-pressed=true] .fill{clip-path:inset(0)}.text{padding:.75rem .125rem 0}h3{font-size:var(--lw-text-sm);letter-spacing:-.01em;text-overflow:ellipsis;white-space:nowrap;font-weight:500;overflow:hidden}.link{font:inherit;color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;outline:none;padding:0;text-decoration:none}.link:after{content:\"\";border-radius:1rem;position:absolute;inset:0}.location{font-size:var(--lw-text-xs);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.details{font-size:var(--lw-text-xs);align-items:center;gap:.375rem;margin-top:.5rem;display:flex}.rating{font-variant-numeric:tabular-nums;align-items:center;gap:.125rem;display:flex}.star{fill:currentColor;width:.75rem;height:.75rem}.dates{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.price{font-variant-numeric:tabular-nums;flex:none;margin-left:auto;font-weight:500}.price .muted{font-weight:400}@keyframes tilt{0%{transform:perspective(900px)translateZ(-180px)rotateY(-14deg)}50%{transform:perspective(900px)translateZ(0)rotateY(0)}to{transform:perspective(900px)translateZ(-180px)rotateY(14deg)}}@keyframes parallax{0%{transform:translate3d(calc(var(--_depth) * -1), 0, 0)}to{transform:translate3d(var(--_depth), 0, 0)}}@keyframes details{0%,32%{opacity:0;transform:translateY(6px)}45%,55%{opacity:1;transform:none}68%,to{opacity:0;transform:translateY(6px)}}@supports (animation-timeline:view()){.card{view-timeline:--rail inline}.details{animation:linear both details;animation-timeline:--rail}@media (prefers-reduced-motion:no-preference){.tilt{animation:linear both tilt;animation-timeline:--rail}.layer{animation:linear both parallax;animation-timeline:--rail}}}", l = (e, t, n) => e.map((e, r) => `M${e - 5} ${t}L${e} ${t - n - r % 3 * 4}L${e + 5} ${t}Z`).join(""), u = (e, t, n, r) => {
	let i = "";
	for (let a = 0; a < r; a++) for (let r = 0; r < n; r++) (a * 7 + r * 3) % 4 != 0 && (i += `<rect class="sky" x="${e + r * 7}" y="${t + a * 9}" width="3" height="3"/>`);
	return i;
}, d = (e, t) => `<path class="${e}" d="${t}"/>`, f = (e, t, n) => `<circle class="sun" cx="${e}" cy="${t}" r="${n}"/>`, p = {
	city: [
		[2, f(150, 56, 16)],
		[4, d("far", "M0 128Q60 98 120 116T208 106V200H0Z")],
		[7, d("mid", "M0 152H18V138L26 130L34 138V146H48V128H62V140H76V132L84 124L92 132V150H110V136H126V146H140V126L150 118L160 126V148H176V138H192V150H208V200H0Z")],
		[11, `${d("near", "M0 180Q104 164 208 178V200H0Z")}${d("near", "M74 170V152Q74 148 78 148H118Q122 148 122 152V168Z")}<rect class="sky" x="80" y="152" width="8" height="7"/><rect class="sky" x="94" y="152" width="8" height="7"/><rect class="sky" x="108" y="152" width="8" height="7"/>`]
	],
	mountains: [
		[2, f(54, 48, 12)],
		[4, `${d("far", "M0 122L30 92L52 108L84 60L112 100L140 72L172 110L208 86V200H0Z")}${d("sun", "M74 75L84 60L94 75L88 71L83 77Z")}${d("sun", "M133 82L140 72L148 82L143 79Z")}`],
		[7, d("mid", "M0 152L40 118L70 140L104 110L140 146L176 120L208 140V200H0Z")],
		[11, d("near", `M0 182Q60 164 120 174T208 168V200H0Z${l([
			18,
			30,
			42,
			162,
			176,
			190
		], 178, 20)}`)]
	],
	dunes: [
		[2, f(128, 66, 22)],
		[4, d("far", "M0 128Q50 104 100 124Q150 142 208 112V200H0Z")],
		[7, d("mid", "M0 158Q70 120 130 150Q170 168 208 146V200H0Z")],
		[11, d("near", "M0 188Q40 160 96 176Q150 194 208 170V200H0Z")]
	],
	lake: [
		[2, f(160, 42, 8)],
		[4, d("far", `M0 142V130H208V142Z${l([
			8,
			20,
			32,
			44,
			56,
			68,
			80,
			92,
			104,
			116,
			128,
			140,
			152,
			164,
			176,
			188,
			200
		], 132, 14)}`)],
		[7, `<rect class="mid" x="0" y="142" width="208" height="58"/>${d("sky", "M40 156H96V158H40ZM120 166H184V168H120ZM24 176H76V178H24Z")}`],
		[11, `${d("near", "M0 184Q60 172 120 182T208 178V200H0Z")}${d("near", "M132 180V162L148 148L164 162V180Z")}<rect class="sun" x="145" y="166" width="6" height="6"/>`]
	],
	islands: [
		[2, f(52, 54, 14)],
		[4, `<rect class="mid" x="0" y="130" width="208" height="70"/>${d("far", "M96 131Q130 104 176 126L188 131Z")}${d("far", "M10 131Q30 120 52 131Z")}`],
		[7, `${d("near", "M52 160H88L82 167H58Z")}${d("sun", "M70 157V122L90 157Z")}${d("sky", "M66 157V130L54 157Z")}${d("far", "M20 178H60V180H20ZM110 172H170V174H110Z")}`],
		[11, d("near", "M0 200V182Q20 170 44 180Q60 187 70 200ZM150 200Q170 176 208 176V200Z")]
	],
	skyline: [
		[2, f(40, 40, 9)],
		[4, d("far", "M0 200V120H16V96H30V120H44V80H58V112H76V60H82V40H86V60H92V110H110V90H128V118H150V70H166V112H180V96H196V124H208V200Z")],
		[7, `${d("mid", "M0 200V140H24V118H50V146H70V108H100V150H120V126H148V134H170V112H196V144H208V200Z")}${u(74, 116, 3, 4)}${u(174, 120, 3, 3)}${u(28, 126, 3, 2)}`],
		[11, d("near", "M0 170H208V178H0ZM10 178H18V200H10ZM70 178H78V200H70ZM130 178H138V200H130ZM190 178H198V200H190Z")]
	],
	terraces: [
		[2, f(104, 58, 15)],
		[4, d("far", "M0 108Q104 76 208 102V200H0Z")],
		[7, d("mid", "M0 136Q104 112 208 132V200H0ZM0 148Q104 126 208 146V150Q104 130 0 152ZM0 164Q104 142 208 162V166Q104 146 0 168Z")],
		[11, d("near", "M0 184Q104 162 208 180V200H0ZM24 184Q20 166 27 148H30Q24 166 28 184ZM28 148Q15 140 6 148Q16 143 28 151ZM28 148Q41 138 51 146Q39 142 28 151ZM28 148Q23 134 12 132Q24 136 29 149ZM28 148Q35 134 45 132Q33 138 29 149Z")]
	],
	coast: [
		[2, f(56, 92, 13)],
		[4, `<rect class="mid" x="0" y="112" width="208" height="88"/>${d("far", "M118 200V122Q150 96 208 98V200Z")}`],
		[7, `${d("near", "M208 200V128Q172 132 150 160Q136 182 112 200Z")}${d("sun", "M208 146Q178 150 162 170Q150 186 136 200H140Q154 188 166 172Q182 154 208 150Z")}`],
		[11, d("near", "M0 200V172Q50 156 100 200Z")]
	]
}, m = (e) => `<div class="scene" aria-hidden="true">${(p[e] ?? p.mountains).map(([e, t]) => `<div class="layer" style="--_depth: ${e}%"><svg viewBox="0 0 208 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${t}</svg></div>`).join("")}</div>`, h = [
	{
		id: "lisbon",
		title: "Profiling week in Lisbon",
		location: "Lisbon, Portugal",
		scene: "city",
		badge: "2 days",
		dates: "Oct 24 – 26",
		price: 340,
		rating: 4.92,
		reviewCount: 318
	},
	{
		id: "dolomites",
		title: "Rewrite it in C, in the Dolomites",
		location: "Val Gardena, Italy",
		scene: "mountains",
		badge: "4 days",
		dates: "Nov 3 – 7",
		price: 610,
		rating: 4.97,
		reviewCount: 142
	},
	{
		id: "dunes",
		title: "Benchmarks in the dunes",
		location: "Merzouga, Morocco",
		scene: "dunes",
		badge: "2 days",
		dates: "Nov 14 – 16",
		price: 280,
		rating: 4.88,
		reviewCount: 96
	},
	{
		id: "lapland",
		title: "SIMD by hand, under the aurora",
		location: "Inari, Finland",
		scene: "lake",
		badge: "3 days",
		dates: "Dec 5 – 8",
		price: 520,
		rating: 4.95,
		reviewCount: 210
	},
	{
		id: "naxos",
		title: "Firmware on an island",
		location: "Naxos, Greece",
		scene: "islands",
		badge: "5 days",
		dates: "May 9 – 14",
		price: 740,
		rating: 4.9,
		reviewCount: 187
	},
	{
		id: "tokyo",
		title: "Low-latency week in Tokyo",
		location: "Tokyo, Japan",
		scene: "skyline",
		badge: "4 days",
		dates: "Mar 20 – 24",
		price: 890,
		rating: 4.96,
		reviewCount: 402
	},
	{
		id: "ubud",
		title: "Real-time audio in Ubud",
		location: "Ubud, Indonesia",
		scene: "terraces",
		badge: "3 days",
		dates: "Jan 12 – 15",
		price: 390,
		rating: 4.91,
		reviewCount: 133
	},
	{
		id: "coast-road",
		title: "Build a tiny OS in Big Sur",
		location: "Big Sur, United States",
		scene: "coast",
		badge: "3 days",
		dates: "Apr 2 – 5",
		price: 560,
		rating: 4.89,
		reviewCount: 158
	}
], g = 26, _ = .997, v = 4, y = 1 / 240, b = "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z", x = "<svg class=\"star\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"/></svg>", S = (e, t, n) => Math.min(n, Math.max(t, e)), C = (e, t) => Math.sign(e) * (1 - 1 / (Math.abs(e) * .55 / t + 1)) * t, w = (e, t) => e.reduce((n, r, i) => Math.abs(r - t) < Math.abs(e[n] - t) ? i : n, 0), T = (e) => String(e).padStart(2, "0"), E = (e, t) => {
	let n = e[0], r = e.at(-1), i = r.t - n.t;
	return i <= 0 || t - r.t > 60 ? 0 : -(r.x - n.x) / i;
}, D = class extends e {
	static styles = c;
	static props = {
		items: {
			type: Object,
			default: h
		},
		heading: { default: "Workshops this season" },
		eyebrow: { default: "Hands-on systems programming" },
		favorites: {
			type: Object,
			default: []
		}
	};
	#e = "idle";
	#t = -1;
	#n = 0;
	#r = 0;
	#i = 0;
	#a = 0;
	#o = 0;
	#s = [];
	#c = !1;
	#l = 0;
	#u = 0;
	#d = a(y, {
		step: () => {
			this.#a += (-170 * (this.#i - this.#o) - g * this.#a) * y, this.#i += this.#a * y;
		},
		render: () => this.#x()
	});
	render() {
		return `<section aria-roledescription="carousel">
  <div class="top"><div class="titles"><p class="eyebrow"></p><h2></h2></div><div class="controls"><span class="count" aria-live="polite"></span><button class="prev" type="button" aria-label="Previous">${r(s)}</button><button class="next" type="button" aria-label="Next">${r(o)}</button></div></div>
  <div class="scroller" tabindex="0"><ul class="track"></ul></div>
</section>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".scroller");
		t.addEventListener("keydown", (e) => this.#A(e), e), t.addEventListener("scroll", () => this.#w(), {
			...e,
			passive: !0
		}), t.addEventListener("pointerdown", (e) => this.#T(e), e), t.addEventListener("pointermove", (e) => this.#E(e), e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, (e) => this.#D(e), e);
		t.addEventListener("click", (e) => this.#O(e), {
			...e,
			capture: !0
		}), t.addEventListener("click", (e) => this.#j(e), e);
		for (let n of ["wheel", "touchstart"]) t.addEventListener(n, () => this.#k(), {
			...e,
			passive: !0
		});
		this.query(".prev").addEventListener("click", () => this.#C(this.#v - 1), e), this.query(".next").addEventListener("click", () => this.#C(this.#v + 1), e), this.signal.addEventListener("abort", () => {
			this.#d.stop(), cancelAnimationFrame(this.#u), this.#u = 0;
		});
	}
	updated(e) {
		e.has("heading") && (this.query("h2").textContent = this.heading ?? "", this.query("section").ariaLabel = this.heading ?? "", this.query(".scroller").ariaLabel = `${this.heading}, use arrow keys to move`), e.has("eyebrow") && (this.query(".eyebrow").textContent = this.eyebrow ?? ""), e.has("items") && this.#f(), (e.has("favorites") || e.has("items")) && this.#p(), this.#m();
	}
	#f() {
		this.query(".track").innerHTML = this.items.map((e) => {
			let t = e.image ? `<div class="layer" style="--_depth: 8%"><img src="${n(e.image)}" alt="${n(e.imageAlt ?? "")}" width="520" height="500" loading="lazy" decoding="async" draggable="false"></div>` : m(e.scene), r = n(e.title), i = e.href ? `<a class="link" href="${n(e.href)}" draggable="false">${r}</a>` : `<button class="link" type="button">${r}</button>`, a = e.rating === void 0 ? "" : `<span class="rating">${x}${e.rating.toFixed(2)}${e.reviewCount === void 0 ? "" : `<span class="muted">(${e.reviewCount})</span>`}</span>`, o = e.dates ? `<span class="muted dates">· ${n(e.dates)}</span>` : "", s = `<span class="price">${n(e.currency ?? "€")}${e.price}<span class="muted"> ${n(e.priceLabel ?? "total")}</span></span>`;
			return `<li class="card" data-id="${n(e.id)}"><div class="tilt"><div class="picture">${t}${e.badge ? `<span class="badge">${n(e.badge)}</span>` : ""}<button class="heart" type="button" aria-label="Save ${r}" aria-pressed="false"><span class="glyph"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${b}"/></svg><span class="fill"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${b}"/></svg></span></span></button></div><div class="text"><h3>${i}</h3><p class="muted location">${n(e.location)}</p><div class="details">${a}${o}${s}</div></div></div></li>`;
		}).join("");
	}
	#p() {
		let e = new Set(this.favorites ?? []);
		for (let t of this.shadowRoot.querySelectorAll(".card")) t.querySelector(".heart").ariaPressed = String(e.has(t.dataset.id));
	}
	#m() {
		let e = this.items.length;
		this.query(".count").innerHTML = `<span class="visually-hidden">Card </span>${T(this.#l + 1)}<span aria-hidden="true"> / </span><span class="visually-hidden"> of </span>${T(e)}`, this.query(".prev").ariaDisabled = String(this.#l === 0), this.query(".next").ariaDisabled = String(this.#l >= e - 1);
	}
	get #h() {
		return this.query(".scroller");
	}
	get #g() {
		return this.#h.scrollWidth - this.#h.clientWidth;
	}
	get #_() {
		let e = this.#h, t = this.query(".track");
		return [...t.children].map((n) => S(t.offsetLeft + n.offsetLeft + n.offsetWidth / 2 - e.clientWidth / 2, 0, this.#g));
	}
	get #v() {
		return w(this.#_, this.#e === "spring" ? this.#o : this.#h.scrollLeft);
	}
	#y(e) {
		let t = this.#h, n = S(e, 0, this.#g);
		t.scrollLeft = n;
		let r = e - n;
		this.query(".track").style.transform = Math.abs(r) > .1 ? `translate3d(${(-C(r, t.clientWidth)).toFixed(2)}px,0,0)` : "";
	}
	#b(e) {
		this.#h.toggleAttribute("data-free", e);
	}
	#x() {
		return Math.abs(this.#i - this.#o) < .5 && Math.abs(this.#a) < 8 ? (this.#i = this.#o, this.#a = 0, this.#e = "idle", this.#y(this.#o), this.#b(!1), !1) : (this.#y(this.#i), !0);
	}
	#S(e, t) {
		this.#d.stop(), this.#e !== "spring" && this.#e !== "dragging" && (this.#i = this.#h.scrollLeft), this.#o = e, this.#a = t, i.matches ? (this.#e = "idle", this.#i = e, this.#y(e), this.#b(!1)) : (this.#e = "spring", this.#b(!0), this.#d.wake());
	}
	#C(e) {
		let t = this.#_;
		this.#S(t[S(e, 0, t.length - 1)], this.#e === "spring" ? this.#a : 0);
	}
	#w() {
		cancelAnimationFrame(this.#u), this.#u = requestAnimationFrame(() => {
			this.#u = 0;
			let e = w(this.#_, this.#h.scrollLeft);
			e !== this.#l && (this.#l = e, this.#m());
		});
	}
	#T(e) {
		e.pointerType !== "mouse" || e.button !== 0 || e.target.closest("button:not(.link)") || (this.#d.stop(), this.#e !== "spring" && (this.#i = this.#h.scrollLeft), this.#e = "pressing", this.#t = e.pointerId, this.#n = e.clientX, this.#r = this.#i, this.#s = [{
			t: e.timeStamp,
			x: e.clientX
		}]);
	}
	#E(e) {
		if (e.pointerId !== this.#t) return;
		let t = e.clientX - this.#n;
		if (this.#e === "pressing" && Math.abs(t) > v && (this.#e = "dragging", this.#h.setPointerCapture?.(e.pointerId), this.#h.toggleAttribute("data-dragging", !0), this.#b(!0)), this.#e === "dragging") for (this.#i = this.#r - t, this.#y(this.#i), this.#s.push({
			t: e.timeStamp,
			x: e.clientX
		}); this.#s.length > 2 && e.timeStamp - this.#s[0].t > 100;) this.#s.shift();
	}
	#D(e) {
		if (e.pointerId !== this.#t) return;
		if (this.#t = -1, this.#e !== "dragging") {
			this.#e = "idle", this.#b(!1);
			return;
		}
		this.#h.removeAttribute("data-dragging"), this.#c = !0, setTimeout(() => this.#c = !1);
		let t = E(this.#s, e.timeStamp), n = this.#i + t * _ / .0030000000000000027, r = this.#_;
		this.#S(r[w(r, n)], t * 1e3);
	}
	#O(e) {
		this.#c &&= (e.preventDefault(), e.stopImmediatePropagation(), !1);
	}
	#k() {
		this.#e === "spring" && (this.#d.stop(), this.#e = "idle", this.#y(S(this.#i, 0, this.#g)), this.#b(!1));
	}
	#A(e) {
		if (e.target !== this.#h) return;
		let t = this.#v, n = {
			ArrowLeft: t - 1,
			ArrowRight: t + 1,
			Home: 0,
			End: this.items.length - 1
		}[e.key];
		n !== void 0 && (e.preventDefault(), this.#C(n));
	}
	#j(e) {
		let t = e.target.closest(".card");
		if (!t) return;
		let n = this.items.find(({ id: e }) => e === t.dataset.id);
		if (e.target.closest(".heart")) {
			let e = !(this.favorites ?? []).includes(n.id);
			this.favorites = e ? [...this.favorites ?? [], n.id] : this.favorites.filter((e) => e !== n.id), this.emit("favorite", {
				id: n.id,
				favorite: e
			});
		} else e.target.closest("button.link") && this.emit("select", { item: n });
	}
};
//#endregion
//#region src/components/carousel-cards/index.js
t("carousel-cards", D);
//#endregion
export { D as t };
