import { n as e, t } from "./core-WcEz9YgG.js";
import { t as n } from "./dom-Dlk1FlsZ.js";
import { r } from "./icons-Dv1KN71n.js";
import { n as i, t as a } from "./motion-CFWhFfc_.js";
import { Dt as o, m as s, p as c } from "./lucide-BVbUPHVq.js";
//#region src/components/card-stack/cards.js
var l = (e, t = !1) => `<svg viewBox="0 0 320 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect class="${t ? "night" : "bg"}" width="320" height="320"/>${e}</svg>`, u = (e, t) => Array.from({ length: e }, (e, n) => t(n)).join(""), d = /* @__PURE__ */ new Set([
	7,
	16,
	23
]), f = [
	{
		id: "low-sun",
		title: "Cold Start",
		subtitle: "Poster 01 · Risograph",
		art: l(`<circle class="accent" cx="160" cy="176" r="72"/><rect class="mid" y="176" width="320" height="144"/>${u(7, (e) => `<rect class="accent" x="${100 + e * 7}" y="${190 + e * 14}" width="${120 - e * 14}" height="${4 - e * .4}"/>`)}`),
		description: "A program that is up before the sun clears the water: 9 ms, pulled in two passes on warm cream stock.",
		specs: [
			{
				label: "Size",
				value: "A3"
			},
			{
				label: "Paper",
				value: "Cream 120g"
			},
			{
				label: "Edition",
				value: "of 50"
			}
		],
		price: "$48"
	},
	{
		id: "ridge-line",
		title: "Call Stack",
		subtitle: "Poster 02 · Screen print",
		art: l("<circle class=\"accent\" cx=\"232\" cy=\"108\" r=\"22\"/><polygon class=\"mid\" points=\"0,200 64,132 112,172 176,96 248,164 320,120 320,320 0,320\"/><polygon class=\"ink\" points=\"0,240 88,176 148,220 224,160 320,236 320,320 0,320\"/>"),
		description: "Frames on frames, as a flame graph sees them. Hand-pulled in three layers, with a slight misregister on purpose.",
		specs: [
			{
				label: "Size",
				value: "50 × 70"
			},
			{
				label: "Paper",
				value: "Natural 300g"
			},
			{
				label: "Edition",
				value: "of 30"
			}
		],
		price: "$72"
	},
	{
		id: "tide-pools",
		title: "Cache Lines",
		subtitle: "Poster 03 · Risograph",
		art: l(`${u(8, (e) => `<circle class="ring" cx="132" cy="188" r="${24 * (e + 1)}"/>`)}<circle class="accent" cx="132" cy="188" r="14"/><circle class="ink" cx="244" cy="104" r="6"/>`),
		description: "Eight levels out from one hot value, printed as hairlines around a single accent dot.",
		specs: [
			{
				label: "Size",
				value: "A3"
			},
			{
				label: "Paper",
				value: "White 120g"
			},
			{
				label: "Edition",
				value: "of 80"
			}
		],
		price: "$40"
	},
	{
		id: "night-market",
		title: "Page Table",
		subtitle: "Poster 04 · Giclée",
		art: l(u(30, (e) => `<rect class="${d.has(e) ? "accent" : "window"}" x="${52 + e % 5 * 46}" y="${52 + Math.floor(e / 5) * 40}" width="30" height="30" rx="2"/>`), !0),
		description: "Thirty pages mapped, three of them resident. The rest wait on disk until something touches them.",
		specs: [
			{
				label: "Size",
				value: "40 × 50"
			},
			{
				label: "Paper",
				value: "Cotton 310g"
			},
			{
				label: "Edition",
				value: "Open"
			}
		],
		price: "$56"
	},
	{
		id: "salt-flats",
		title: "Zero Alloc",
		subtitle: "Poster 05 · Screen print",
		art: l("<circle class=\"accent\" cx=\"96\" cy=\"108\" r=\"14\"/><rect class=\"flat\" y=\"172\" width=\"320\" height=\"148\"/><polygon class=\"mid\" points=\"214,172 40,196 40,200 218,173\"/><rect class=\"ink\" x=\"212\" y=\"116\" width=\"4\" height=\"56\"/>"),
		description: "One pointer and its shadow across an empty heap. Mostly nothing, which is the point.",
		specs: [
			{
				label: "Size",
				value: "50 × 70"
			},
			{
				label: "Paper",
				value: "Bright 300g"
			},
			{
				label: "Edition",
				value: "of 25"
			}
		],
		price: "$64"
	}
], p = ":host{--_accent:#f97316;--_lift:0 2px 4px #0000000d, 0 28px 48px -16px #0000004d;width:28rem;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);display:block;position:relative}.visually-hidden{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}.wrap{flex-direction:column;justify-content:center;align-items:center;min-height:32rem;padding-block:2rem;display:flex;position:relative}.deck{aspect-ratio:4/5;width:min(16rem,100% - 5rem);position:relative}.card{font:inherit;color:inherit;text-align:left;transform-origin:bottom;touch-action:pan-y;-webkit-user-select:none;user-select:none;will-change:transform;background:0 0;border:0;border-radius:1rem;outline:none;padding:0;transition:box-shadow .2s ease-out;position:absolute;inset:0;box-shadow:0 1px 2px #0000000d,0 4px 12px -4px #0000001f}.card:not([inert]){cursor:grab}.card[data-state=drag]{cursor:grabbing}.card:is([data-state=drag],[data-state=fly]){box-shadow:var(--_lift)}.card:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px;outline-offset:4px}.card.opened{visibility:hidden}.face{box-sizing:border-box;border:1px solid var(--lw-color-border);background:var(--lw-color-background);border-radius:1rem;flex-direction:column;height:100%;padding:.5rem;display:flex}.art{border-radius:var(--lw-radius-lg);display:block;position:relative;overflow:hidden}.face .art{flex:1;min-height:0}.art svg{width:100%;height:100%;position:absolute;inset:0}.art .bg{fill:var(--lw-color-muted)}.art .mid,.art .window{fill:var(--lw-color-border)}.art .flat{fill:color-mix(in oklab, var(--lw-color-border) 60%, var(--lw-color-muted))}.art .ink{fill:color-mix(in oklab, var(--lw-color-foreground) 85%, transparent)}.art .night{fill:#18181b}.art .window{fill:#3f3f46}.art .ring{fill:none;stroke:var(--lw-color-border);stroke-width:2px}.art .accent{fill:var(--_accent)}.caption{justify-content:space-between;align-items:flex-end;gap:.75rem;padding:.625rem .375rem .25rem;display:flex}.names{min-width:0;display:grid}.title,.subtitle{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.title{font-size:var(--lw-text-sm);font-weight:500}.subtitle{font-size:var(--lw-text-xs);color:var(--lw-color-muted-foreground)}.price{font-size:var(--lw-text-sm);font-variant-numeric:tabular-nums;flex:none}.nav{justify-content:space-between;align-items:center;gap:.5rem;width:min(16rem,100% - 5rem);margin-top:2rem;display:flex}.nav button{border:1px solid var(--lw-color-border);width:2rem;height:2rem;color:var(--lw-color-muted-foreground);cursor:pointer;transition:background-color var(--lw-duration-fast) ease-out, color var(--lw-duration-fast) ease-out;background:0 0;border-radius:50%;flex:none;place-items:center;padding:0;display:grid}.nav button:hover{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.nav button:active{translate:0 1px}.nav button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.count{font-size:var(--lw-text-xs);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground);margin:0}.count b{color:var(--lw-color-foreground);font-weight:400}.details{z-index:2000;background:color-mix(in oklab, var(--lw-color-background) 85%, transparent);justify-content:center;align-items:center;padding:.75rem;display:flex;position:absolute;inset:0}.details[hidden]{display:none}.dialog{border:1px solid var(--lw-color-border);background:var(--lw-color-background);transform-origin:50%;border-radius:1rem;flex-direction:column;width:100%;max-width:24rem;max-height:100%;padding:.5rem;display:flex;position:relative;overflow:hidden;box-shadow:0 24px 48px -12px #00000040}.dialog .art{aspect-ratio:2;flex:none;width:100%}.info{min-height:0;padding:.75rem .5rem .25rem;overflow-y:auto}.head{justify-content:space-between;align-items:baseline;gap:.75rem;display:flex}h3{font-size:var(--lw-text-md);margin:0;font-weight:500}.description{font-size:var(--lw-text-sm);color:color-mix(in oklab, var(--lw-color-foreground) 75%, transparent);margin:.5rem 0 0;line-height:1.6}.info .subtitle{margin:0}dl{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);background:var(--lw-color-border);grid-template-columns:repeat(3,1fr);gap:1px;margin:.75rem 0 0;display:grid;overflow:hidden}dl div{background:var(--lw-color-background);min-width:0;padding:.5rem .625rem}dt{color:var(--lw-color-muted-foreground);font-size:11px}dd{font-size:var(--lw-text-xs);text-overflow:ellipsis;white-space:nowrap;margin:0;overflow:hidden}.action{border-radius:var(--lw-radius-md);background:var(--_accent);width:100%;height:2.25rem;font:500 var(--lw-text-sm) var(--lw-font-sans);color:#fff;cursor:pointer;transition:filter var(--lw-duration-fast) ease-out;border:0;margin-top:.75rem}.action:hover{filter:brightness(1.1)}.action:active{filter:brightness(.95)}.action:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.close{background:var(--lw-color-background);width:1.75rem;height:1.75rem;color:var(--lw-color-muted-foreground);cursor:pointer;border:0;border-radius:50%;place-items:center;padding:0;display:grid;position:absolute;top:1rem;right:1rem}.close:hover{color:var(--lw-color-foreground)}.close:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}", m = [
	0,
	-2,
	1.5,
	-1
], h = 9, g = .035, _ = m.length - 1, v = 18, y = .5, b = .35, x = 5, S = 90, C = {
	k: 420,
	c: 30
}, w = {
	k: 150,
	c: 15
}, T = {
	k: 240,
	c: 26
}, E = 1 / 240, D = 1e3, O = "cubic-bezier(0.23, 1, 0.32, 1)", k = [
	["x", "vx"],
	["y", "vy"],
	["r", "vr"],
	["s", "vs"]
], A = (e) => {
	let t = Math.min(e, _);
	return {
		x: 0,
		y: t * h,
		r: m[t],
		s: 1 - t * g
	};
}, j = (e, t, n) => ({
	x: e.x + (t.x - e.x) * n,
	y: e.y + (t.y - e.y) * n,
	r: e.r + (t.r - e.r) * n,
	s: e.s + (t.s - e.s) * n
}), M = (e) => ({
	...A(e),
	vx: 0,
	vy: 0,
	vr: 0,
	vs: 0,
	phase: "rest",
	out: null,
	dx: 1,
	dy: 0,
	z: null,
	apexZ: null
}), N = (e, t) => Math.abs(e.x - t.x) < .1 && Math.abs(e.y - t.y) < .1 && Math.abs(e.r - t.r) < .02 && Math.abs(e.s - t.s) < 5e-4 && Math.abs(e.vx) + Math.abs(e.vy) < 2 && Math.abs(e.vr) < 1 && Math.abs(e.vs) < .01, P = (e, t, n, r) => Math.min(n ? e / Math.abs(n) : Infinity, r ? t / Math.abs(r) : Infinity) + 24, F = (e) => {
	let t = e.at(-1), n = e.find((e) => t && t.t - e.t <= S);
	if (!n || !t || t.t - n.t < 8) return {
		vx: 0,
		vy: 0
	};
	let r = t.t - n.t;
	return {
		vx: (t.x - n.x) / r,
		vy: (t.y - n.y) / r
	};
}, I = (e) => String(e).padStart(2, "0"), L = class extends e {
	static styles = p;
	static props = {
		cards: {
			type: Object,
			default: f
		},
		accent: { default: "#f97316" },
		actionLabel: { default: "Add to cart" }
	};
	#e = [];
	#t = [];
	#n = null;
	#r = 0;
	#i = !1;
	#a = null;
	#o = a(E, {
		step: () => this.#f(),
		render: () => this.#p()
	});
	render() {
		return `<div class="wrap">
  <section class="deck" aria-label="Card deck. Drag a card away or use the arrow keys to cycle."></section>
  <div class="nav"><button class="prev" type="button" aria-label="Previous card">${r(c)}</button><p class="count" aria-live="polite"></p><button class="next" type="button" aria-label="Next card">${r(s)}</button></div>
  <div class="details" hidden><div class="dialog" role="dialog" aria-modal="true"><div class="art"></div><div class="info"></div><button class="close" type="button" aria-label="Close details">${r(o, 14)}</button></div></div>
</div>`;
	}
	connected() {
		let e = { signal: this.signal }, t = this.query(".deck");
		t.addEventListener("pointerdown", (e) => this.#v(e), e), t.addEventListener("pointermove", (e) => this.#y(e), e), t.addEventListener("pointerup", (e) => this.#b(e, !1), e), t.addEventListener("pointercancel", (e) => this.#b(e, !0), e), t.addEventListener("lostpointercapture", (e) => this.#b(e, !0), e), t.addEventListener("click", (e) => this.#x(e), e), t.addEventListener("keydown", (e) => this.#S(e), e), this.query(".prev").addEventListener("click", () => this.#_(-1), e), this.query(".next").addEventListener("click", () => this.#_(1), e);
		let n = this.query(".details");
		n.addEventListener("click", (e) => this.#D(e), e), n.addEventListener("keydown", (e) => e.key === "Escape" && (e.preventDefault(), this.#E()), e), this.signal.addEventListener("abort", () => this.#o.stop());
	}
	updated(e) {
		e.has("accent") && this.style.setProperty("--_accent", this.accent), e.has("cards") && this.#s(), e.has("actionLabel") && this.#a !== null && this.#C(this.cards[this.#a]);
	}
	#s() {
		this.#e = this.cards.map((e, t) => t), this.#t = this.cards.map((e, t) => M(t)), this.query(".deck").innerHTML = this.cards.map((e, t) => `<button class="card" type="button" data-index="${t}" data-state="rest" aria-label="${n(`${e.title}, ${e.subtitle}. Open details`)}"><span class="face"><span class="art">${e.art ?? ""}</span><span class="caption"><span class="names"><span class="title">${n(e.title)}</span><span class="subtitle">${n(e.subtitle)}</span></span>${e.price ? `<span class="price">${n(e.price)}</span>` : ""}</span></span></button>`).join(""), this.#e.forEach((e, t) => this.#l(e, t)), this.#u();
	}
	get #c() {
		return [...this.shadowRoot.querySelectorAll(".card")];
	}
	#l(e, t) {
		let n = this.#c[e], r = this.#t[e];
		n.style.transform = `translate3d(${r.x.toFixed(2)}px, ${r.y.toFixed(2)}px, 0) rotate(${r.r.toFixed(3)}deg) scale(${r.s.toFixed(4)})`, n.style.zIndex = String(r.z ?? this.#e.length - t);
		let i = r.phase === "drag" ? "drag" : r.phase === "rest" ? "rest" : "fly";
		n.dataset.state !== i && (n.dataset.state = i);
	}
	#u() {
		let e = this.#e[0] ?? 0;
		this.#c.forEach((t, n) => {
			t.inert = n !== e, t.tabIndex = n === e ? 0 : -1;
		}), this.query(".count").innerHTML = `<b>${I(e + 1)}</b> / ${I(this.cards.length)}<span class="visually-hidden">: ${n(this.cards[e]?.title ?? "")}</span>`;
	}
	#d(e, t) {
		if (e.phase === "out") return e.out;
		let n = A(t);
		return t > 0 && this.#r > 0 ? j(n, A(t - 1), this.#r * .6) : n;
	}
	#f() {
		this.#e.forEach((e, t) => {
			let n = this.#t[e];
			if (n.phase === "drag") return;
			let r = n.phase === "out" ? w : n.phase === "return" ? T : C, i = this.#d(n, t);
			for (let [e, t] of k) n[t] += (-r.k * (n[e] - i[e]) - r.c * n[t]) * E, n[e] += n[t] * E;
			n.phase === "out" && n.vx * n.dx + n.vy * n.dy <= 0 && (n.phase = "return", n.z = n.apexZ);
		});
	}
	#p() {
		let e = !1;
		return this.#e.forEach((t, n) => {
			let r = this.#t[t];
			if (r.phase === "drag") e = !0;
			else {
				let t = this.#d(r, n);
				i.matches && Object.assign(r, t, {
					vx: 0,
					vy: 0,
					vr: 0,
					vs: 0,
					phase: "rest",
					z: null
				}), N(r, t) && r.phase !== "out" ? (r.phase = "rest", r.z = null) : e = !0;
			}
			this.#l(t, n);
		}), e;
	}
	#m(e) {
		this.#e = e, this.#u(), this.emit("change", { card: this.cards[e[0]] }), this.#o.wake();
	}
	#h(e, t, n, r) {
		let i = this.#e[0];
		if (i === void 0 || this.#e.length < 2) return;
		let a = this.#t[i], o = this.#c[i], s = Math.hypot(e, t), c = s > .05 ? e : n, l = s > .05 ? t : r, u = Math.hypot(c, l) || 1, d = c / u, f = l / u, p = P(o.offsetWidth, o.offsetHeight, d, f) + Math.min(s * 50, 90), m = Math.max(s, .9) * 1e3;
		Object.assign(a, {
			phase: "out",
			dx: d,
			dy: f,
			out: {
				x: d * p,
				y: f * p,
				r: Math.max(-40, Math.min(40, a.r + d * 26)),
				s: 1
			},
			vx: d * m,
			vy: f * m,
			vr: a.vr + d * m * .05,
			z: D,
			apexZ: null
		}), this.#m([...this.#e.slice(1), i]);
	}
	#g() {
		let e = this.#e.at(-1);
		if (e === void 0 || this.#e.length < 2) return;
		let t = this.#c[e], [n, r] = [-.97, -.24], i = P(t.offsetWidth, t.offsetHeight, n, r) + 20;
		Object.assign(this.#t[e], {
			phase: "out",
			dx: n,
			dy: r,
			out: {
				x: n * i,
				y: r * i,
				r: -16,
				s: 1
			},
			vx: n * 1100,
			vy: r * 1100,
			z: 0,
			apexZ: 999
		}), this.#m([e, ...this.#e.slice(0, -1)]);
	}
	#_(e, t = !1) {
		e === 1 ? this.#h(1.3, -.35, 1, 0) : this.#g(), t && this.#c[this.#e[0]]?.focus({ preventScroll: !0 });
	}
	#v(e) {
		this.#i = !1;
		let t = e.target.closest(".card"), n = Number(t?.dataset.index);
		if (!t || this.#n || this.#e[0] !== n || e.pointerType === "mouse" && e.button !== 0) return;
		let r = this.#t[n], i = t.getBoundingClientRect();
		t.setPointerCapture?.(e.pointerId), this.#n = {
			id: e.pointerId,
			node: t,
			index: n,
			x: e.clientX,
			y: e.clientY,
			baseX: r.x,
			baseY: r.y,
			width: t.offsetWidth,
			lever: e.clientY - i.top < i.height / 2 ? 1 : -1,
			moved: !1,
			samples: [{
				t: e.timeStamp,
				x: e.clientX,
				y: e.clientY
			}]
		};
	}
	#y(e) {
		let t = this.#n;
		if (t?.id !== e.pointerId) return;
		let n = e.clientX - t.x, r = e.clientY - t.y;
		if (!t.moved) {
			if (Math.hypot(n, r) < x) return;
			if (e.pointerType !== "mouse" && Math.abs(r) > Math.abs(n)) {
				this.#n = null, t.node.hasPointerCapture?.(e.pointerId) && t.node.releasePointerCapture(e.pointerId);
				return;
			}
		}
		t.moved = !0, t.samples.push({
			t: e.timeStamp,
			x: e.clientX,
			y: e.clientY
		}), t.samples.length > 24 && t.samples.shift();
		let i = this.#t[t.index];
		Object.assign(i, {
			phase: "drag",
			x: t.baseX + n,
			y: t.baseY + r,
			s: 1,
			vx: 0,
			vy: 0,
			vr: 0,
			vs: 0
		}), i.r = Math.max(-1, Math.min(1, i.x / t.width)) * v * t.lever, this.#r = Math.min(Math.hypot(i.x, i.y) / (t.width * b), 1), this.#o.wake();
	}
	#b(e, t) {
		let n = this.#n;
		if (n?.id !== e.pointerId) return;
		this.#n = null, this.#r = 0;
		let r = this.#t[n.index];
		if (!n.moved || t) {
			r.phase === "drag" && (r.phase = "rest"), this.#o.wake();
			return;
		}
		this.#i = !0;
		let { vx: i, vy: a } = F(n.samples), o = Math.hypot(i, a), s = Math.hypot(r.x, r.y), c = s > 0 ? (i * r.x + a * r.y) / s : 0, l = o > y && c > -.2, u = s > n.width * b && c > -.3;
		l || u ? this.#h(i, a, r.x / (s || 1), r.y / (s || 1)) : (Object.assign(r, {
			phase: "rest",
			vx: i * 1e3,
			vy: a * 1e3,
			vr: i * 1e3 / n.width * v * n.lever
		}), this.#o.wake());
	}
	#x(e) {
		let t = e.target.closest(".card");
		t && (this.#i ? this.#i = !1 : this.#e[0] === Number(t.dataset.index) && this.#T(Number(t.dataset.index)));
	}
	#S(e) {
		this.#i = !1;
		let t = {
			ArrowRight: 1,
			ArrowDown: 1,
			ArrowLeft: -1,
			ArrowUp: -1
		}[e.key];
		t && (e.preventDefault(), this.#_(t, !0));
	}
	#C(e) {
		let t = (e.specs ?? []).map(({ label: e, value: t }) => `<div><dt>${n(e)}</dt><dd>${n(t)}</dd></div>`).join("");
		this.query(".info").innerHTML = `<div class="head"><h3>${n(e.title)}</h3>${e.price ? `<span class="price">${n(e.price)}</span>` : ""}</div><p class="subtitle">${n(e.subtitle)}</p><p class="description">${n(e.description ?? "")}</p><dl>${t}</dl><button class="action" type="button">${n(this.actionLabel)}</button>`;
	}
	#w(e, t, n) {
		if (i.matches) return Promise.resolve();
		let r = t.getBoundingClientRect(), a = e.getBoundingClientRect(), o = [{ transform: `translate(${r.left + r.width / 2 - (a.left + a.width / 2)}px, ${r.top + r.height / 2 - (a.top + a.height / 2)}px) scale(${r.width / a.width}, ${r.height / a.height})` }, { transform: "none" }], s = e.animate(n ? o : o.reverse(), {
			duration: 450,
			easing: O
		}), c = this.query(".details").animate([{ opacity: 0 }, { opacity: 1 }], {
			duration: 200,
			easing: O,
			direction: n ? "normal" : "reverse"
		});
		return Promise.all([s.finished, c.finished]).catch(() => void 0);
	}
	#T(e) {
		let t = this.cards[e], n = this.#c[e];
		this.#a = e, this.#C(t);
		let r = this.query(".dialog");
		r.ariaLabel = t.title, r.querySelector(".art").innerHTML = t.art ?? "", this.query(".details").hidden = !1, n.classList.add("opened"), this.#w(r, n, !0), r.querySelector(".info").animate([{
			opacity: 0,
			transform: "translateY(6px)"
		}, {
			opacity: 1,
			transform: "none"
		}], {
			duration: 250,
			delay: 80,
			easing: O,
			fill: "backwards"
		}), this.query(".close").focus({ preventScroll: !0 });
	}
	async #E() {
		if (this.#a === null) return;
		let e = this.#c[this.#a];
		this.#a = null, await this.#w(this.query(".dialog"), e, !1), this.query(".details").hidden = !0, e.classList.remove("opened"), this.#c[this.#e[0]]?.focus({ preventScroll: !0 });
	}
	#D(e) {
		e.target === e.currentTarget || e.target.closest(".close") ? this.#E() : e.target.closest(".action") && this.#a !== null && this.emit("action", { card: this.cards[this.#a] });
	}
};
//#endregion
//#region src/components/card-stack/index.js
t("card-stack", L);
//#endregion
export { L as t };
