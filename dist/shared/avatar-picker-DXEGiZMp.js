import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./form-QHOiInAj.js";
import { i, n as a, t as o } from "./motion-CFWhFfc_.js";
import { t as s } from "./visibility--H4IXDjD.js";
import { n as c, r as l, t as u } from "./face-BTqcW8Ou.js";
//#region src/components/avatar-picker/avatar-picker.scss?inline
var d = ":host{--_muted-line:color-mix(in oklab, var(--lw-color-foreground) 18%, transparent);max-width:360px;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);display:block}.card{border:1px solid var(--lw-color-border);background:var(--lw-color-background);border-radius:1rem;padding:1.25rem}button,input{font:inherit;color:inherit}button{cursor:pointer}.icon{width:1rem;height:1rem}.header{gap:.25rem;display:grid}.heading{font-size:var(--lw-text-md);letter-spacing:-.01em;margin:0;font-weight:600}.description{font-size:var(--lw-text-sm);color:var(--lw-color-muted-foreground);margin:0}.stage{flex-direction:column;align-items:center;margin-top:1.25rem;display:flex}.dial{place-items:center;width:176px;height:176px;display:grid;position:relative}.bezel{stroke:var(--_muted-line);stroke-linecap:round;stroke-width:1px;position:absolute;inset:0}.bezel line:not(.long){stroke-opacity:.6}.bezel .long{stroke-width:1.5px}.index{background:var(--lw-color-foreground);border-radius:1px;width:2px;height:.75rem;position:absolute;top:0;left:50%;translate:-50%}.coin{z-index:1;perspective:600px;cursor:grab;touch-action:pan-y;-webkit-user-select:none;user-select:none;border-radius:50%;width:128px;height:128px;position:relative}.coin:active{cursor:grabbing}.coin-body{width:100%;height:100%;transform-style:preserve-3d;position:relative}.disc,.coin-face,.shade{border-radius:50%;position:absolute;inset:0}.disc{background:color-mix(in oklab, var(--lw-color-foreground) 22%, var(--lw-color-background))}.coin-face{overflow:hidden;box-shadow:inset 0 0 0 1px #0000001a}.shade{opacity:0;pointer-events:none;background:#000}.face{width:100%;height:100%;display:block}.blink{transform-box:fill-box;transform-origin:50%;transition:transform 75ms ease-out}.caption{font-size:var(--lw-text-xs);align-items:baseline;gap:.5rem;margin-top:.5rem;display:flex}.caption-name{text-overflow:ellipsis;white-space:nowrap;max-width:180px;font-weight:500;overflow:hidden}.number{font-family:var(--lw-font-mono);font-variant-numeric:tabular-nums;color:var(--lw-color-muted-foreground)}.controls{justify-content:space-between;align-items:center;gap:.75rem;margin-top:1.25rem;display:flex}.slots{gap:.5rem;display:flex}.slot,.shuffle{border-radius:50%;outline:none;flex:none;width:2.5rem;height:2.5rem;padding:0;position:relative}.slot:focus-visible,.shuffle:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.slot{background:0 0;border:0}.socket{border:1px dashed #0000;border-radius:50%;transition:border-color .15s ease-out,background-color .15s ease-out;position:absolute;inset:0}[aria-pressed=true]>.socket{border-color:var(--_muted-line);background:var(--lw-color-muted)}[aria-pressed=true]>.socket:after{content:\"\";background:var(--lw-color-muted-foreground);border-radius:50%;width:6px;height:6px;margin:auto;position:absolute;inset:0}.slot-face{border-radius:50%;transition:box-shadow .15s ease-out;position:absolute;inset:0;overflow:hidden;box-shadow:inset 0 0 0 1px #0000001a}.slot:hover .slot-face{box-shadow:inset 0 0 0 1px #0000001a, 0 0 0 2px var(--_muted-line)}[aria-pressed=true]>.slot-face{visibility:hidden}.shuffle{border:1px solid var(--lw-color-border);color:var(--lw-color-muted-foreground);background:0 0;place-items:center;transition:color .15s ease-out,background-color .15s ease-out;display:grid}.shuffle:hover{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.dice{place-items:center;display:grid}.field{gap:.5rem;margin-top:1.25rem;display:grid}.field label{font-size:var(--lw-text-sm);font-weight:500}.field input{border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);height:2.5rem;font-size:var(--lw-text-sm);background:0 0;outline:none;padding:0 .75rem;transition:border-color .15s ease-out}.field input::placeholder{color:var(--lw-color-muted-foreground)}.field input:focus-visible{border-color:var(--_muted-line);outline:2px solid var(--lw-color-ring);outline-offset:2px}.submit{margin-top:1rem;display:flex}.submit::part(button){width:100%}.arrow{transition:translate .15s ease-out;display:grid}.submit:hover .arrow{translate:2px}.announce{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", f = 5, p = 128, m = 176, h = 60, g = 180 / p, _ = 10, v = 4, y = {
	stiffness: 140,
	damping: 22
}, b = {
	stiffness: 50,
	damping: 11
}, x = {
	stiffness: 180,
	damping: 18
}, S = 1 / 120, C = {
	duration: 450,
	easing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
}, w = 2, T = (e) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`, E = T("<rect width=\"12\" height=\"12\" x=\"2\" y=\"10\" rx=\"2\" ry=\"2\"/><path d=\"m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6\"/><path d=\"M6 18h.01\"/><path d=\"M10 14h.01\"/><path d=\"M15 6h.01\"/><path d=\"M18 9h.01\"/>"), D = T("<path d=\"M5 12h14\"/><path d=\"m12 5 7 7-7 7\"/>"), O = `<svg class="bezel" viewBox="0 0 ${m} ${m}" aria-hidden="true">${Array.from({ length: h }, (e, t) => {
	let n = t / h * Math.PI * 2, r = t % 5 == 0, i = m / 2 - 3, a = i - (r ? 7 : 4), o = m / 2, s = (e) => [(o + Math.sin(n) * e).toFixed(2), (o - Math.cos(n) * e).toFixed(2)], [c, l] = s(a), [u, d] = s(i);
	return `<line x1="${c}" y1="${l}" x2="${u}" y2="${d}"${r ? " class=\"long\"" : ""}/>`;
}).join("")}</svg>`, k = `<div class="coin" part="coin"><div class="coin-body" role="img">${[
	6,
	5,
	4,
	3,
	2,
	1
].map((e) => `<span class="disc" style="transform: translateZ(-${e}px)"></span>`).join("")}<div class="coin-face"><span class="shade"></span></div></div></div>`, A = (e) => String((e % 1e3 + 1e3) % 1e3).padStart(3, "0"), j = class extends r(e) {
	static styles = d;
	static props = {
		displayName: { default: "Robin Vale" },
		variant: {
			type: Number,
			default: 0
		},
		name: {},
		heading: { default: "Pick your avatar" },
		description: { default: "Made from your name. Spin it or pick one." },
		submitLabel: { default: "Continue" }
	};
	#e = new u();
	#t = Array.from({ length: f }, () => new u());
	#n = null;
	#r = 0;
	#i = 0;
	#a = 0;
	#o = 0;
	#s = !1;
	#c = null;
	#l = null;
	#u = {
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		tx: 0,
		ty: 0
	};
	#d = o(S, {
		step: () => this.#N(),
		render: () => this.#P()
	});
	#f = null;
	render() {
		return `<div class="card" part="base"><div class="header"><h2 class="heading"></h2><p class="description"></p></div><div class="stage"><div class="dial">${O}<span class="index" aria-hidden="true"></span>${k}</div><div class="caption"><span class="caption-name"></span><span class="number"></span></div></div><div class="controls"><div class="slots" role="toolbar" aria-label="Avatar options">${Array.from({ length: f }, () => "<button class=\"slot\" type=\"button\" tabindex=\"-1\"><span class=\"socket\" aria-hidden=\"true\"></span><span class=\"slot-face\"></span></button>").join("")}</div><button class="shuffle" type="button" aria-label="Shuffle avatar" title="Shuffle"><span class="dice">${E}</span></button></div><div class="field"><label for="display-name">Display name</label><input id="display-name" type="text" autocomplete="name" maxlength="32" placeholder="Your name" spellcheck="false"></div><lw-button class="submit"><span class="submit-label"></span><span class="arrow" slot="end">${D}</span></lw-button><p class="announce" aria-live="polite"></p></div>`;
	}
	connected() {
		let e = { signal: this.signal };
		this.#n || (this.query(".coin-face").prepend(this.#e.svg), this.shadowRoot.querySelectorAll(".slot-face").forEach((e, t) => e.append(this.#t[t].svg)), this.#n = Array.from({ length: f }, (e, t) => this.variant + t * 7), this.query("input").value = this.displayName);
		let t = this.query(".coin");
		t.addEventListener("pointerdown", (e) => this.#w(e), e), t.addEventListener("pointermove", (e) => this.#T(e), e), t.addEventListener("pointerup", (e) => this.#E(e), e), t.addEventListener("pointercancel", (e) => this.#E(e), e);
		let n = this.query(".slots");
		n.addEventListener("click", (e) => this.#D(this.#m(e.target)), e), n.addEventListener("keydown", (e) => this.#A(e), e), n.addEventListener("focusin", (e) => this.#k(this.#m(e.target)), e), this.query(".shuffle").addEventListener("click", () => this.#C(), e), this.query("input").addEventListener("input", (e) => this.#v(e.target.value), e);
		let r = this.query(".submit");
		r.addEventListener("click", () => !r.disabled && this.#y(), e), s(this, (e) => this.#j(e), this.signal), this.signal.addEventListener("abort", () => {
			this.#j(!1), this.#c?.(), this.#s && this.#S(), this.#e.stop(), this.#t.forEach((e) => e.stop());
		});
	}
	updated(e) {
		for (let [t, n] of [
			["heading", ".heading"],
			["description", ".description"],
			["submitLabel", ".submit-label"]
		]) e.has(t) && (this.query(n).textContent = this[t]);
		if (e.has("variant") && this.#n[this.#r] !== this.variant && (this.#n[this.#r] = this.variant), e.has("displayName")) {
			let e = this.query("input");
			e.value !== this.displayName && (e.value = this.displayName);
		}
		let t = !this.#e.face;
		this.#h(!t);
	}
	get value() {
		let e = this.#n[this.#r], t = c(this.displayName, e);
		return {
			displayName: this.displayName.trim(),
			variant: e,
			seed: t,
			description: l(t).description
		};
	}
	get #p() {
		return c(this.displayName, this.#n[this.#r] + this.#o);
	}
	#m(e) {
		let t = e.closest?.(".slot");
		return t ? [...this.shadowRoot.querySelectorAll(".slot")].indexOf(t) : -1;
	}
	#h(e) {
		let t = this.displayName;
		this.#e.show(this.#p, { morph: e && !this.#s }), this.shadowRoot.querySelectorAll(".slot").forEach((n, r) => {
			let i = c(t, this.#n[r]);
			this.#t[r].show(i, { morph: e }), n.ariaPressed = String(r === this.#r), n.ariaLabel = `Option ${r + 1}: ${l(i).description}`, n.tabIndex = r === this.#i ? 0 : -1;
		}), this.#g(), this.query(".submit").disabled = t.trim().length < w, this[n].setFormValue(this.name ? this.value.seed : null);
	}
	#g() {
		this.query(".caption-name").textContent = this.displayName.trim() || "Anonymous", this.query(".number").textContent = `No. ${A(this.#n[this.#r] + this.#o)}`, this.query(".coin-body").ariaLabel = `Selected avatar: ${this.#e.face.description}`;
	}
	#_(e) {
		let t = this.value;
		this.emit("change", t), e && (this.query(".announce").textContent = `Avatar: ${t.description}`);
	}
	#v(e) {
		this.displayName = e, this.#_(!1);
	}
	#y() {
		this.emit("complete", this.value) && this[n].form?.requestSubmit();
	}
	#b(e) {
		this.#a = e;
		let t = e - 180 * Math.round(e / 180);
		this.query(".coin-body").style.transform = `rotateY(${t.toFixed(2)}deg)`, this.query(".shade").style.opacity = (Math.abs(t) / 90 * .35).toFixed(3), this.query(".bezel").style.transform = `rotate(${(e / 15).toFixed(2)}deg)`, this.query(".dice").style.transform = `rotate(${(e / 4).toFixed(2)}deg)`;
		let n = Math.round(e / 180);
		n !== this.#o && (this.#o = n, this.#e.show(this.#p, { morph: !1 }), this.#g());
	}
	#x(e, t) {
		this.#c?.(), this.#s = !0, a.matches ? (this.#c = null, this.#b(e * 180), this.#S()) : this.#c = i(this.#a, e * 180, {
			...t,
			restDelta: .5,
			restSpeed: 4,
			update: (e) => this.#b(e),
			done: () => this.#S()
		});
	}
	#S() {
		this.#c = null, this.#s = !1;
		let e = Math.round(this.#a / 180);
		this.#n[this.#r] += e, this.#o = 0, this.#b(0), this.variant = this.#n[this.#r], this.#h(!1), e !== 0 && this.#_(!0);
	}
	#C() {
		let e = Math.round(this.#a / 180), t = 5 + Math.floor(Math.random() * 4);
		this.#x(e + t, {
			...b,
			velocity: t * 180 * 1.6
		});
	}
	#w(e) {
		e.button !== 0 || this.#l || (this.#c?.(), this.#c = null, this.#s = !0, e.currentTarget.setPointerCapture(e.pointerId), this.#l = {
			id: e.pointerId,
			x: e.clientX,
			start: this.#a,
			moved: !1,
			samples: [{
				x: e.clientX,
				t: e.timeStamp
			}]
		});
	}
	#T(e) {
		let t = this.#l;
		if (t?.id !== e.pointerId) return;
		let n = e.clientX - t.x;
		Math.abs(n) > v && (t.moved = !0), this.#b(t.start + n * g), t.samples.push({
			x: e.clientX,
			t: e.timeStamp
		}), t.samples.length > 6 && t.samples.shift();
	}
	#E(e) {
		let t = this.#l;
		if (t?.id !== e.pointerId) return;
		if (this.#l = null, !t.moved) {
			this.#x(Math.round(this.#a / 180) + 1, {
				...y,
				velocity: 900
			});
			return;
		}
		let n = t.samples[0], r = Math.max(16, e.timeStamp - n.t) / 1e3, i = (e.clientX - n.x) / r * g, a = Math.round(t.start / 180), o = Math.round((this.#a + i * .28) / 180), s = Math.max(a - _, Math.min(a + _, o));
		this.#x(s, {
			...y,
			velocity: i
		});
	}
	#D(e) {
		if (e < 0 || e === this.#r) return;
		this.#s && (this.#c?.(), this.#S());
		let t = this.#r, n = this.query(".coin"), r = this.shadowRoot.querySelectorAll(".slot-face"), i = {
			coin: n.getBoundingClientRect(),
			slot: r[e].getBoundingClientRect()
		};
		this.#r = e, this.#i = e, this.variant = this.#n[e], this.#h(!1), this.#_(!0), !a.matches && (this.#O(n, i.slot), this.#O(r[t], i.coin));
	}
	#O(e, t) {
		let n = e.getBoundingClientRect(), r = t.left + t.width / 2 - (n.left + n.width / 2), i = t.top + t.height / 2 - (n.top + n.height / 2), a = t.width / n.width;
		e.animate({ transform: [`translate(${r}px, ${i}px) scale(${a})`, "none"] }, C);
	}
	#k(e) {
		e < 0 || (this.#i = e, this.shadowRoot.querySelectorAll(".slot").forEach((t, n) => t.tabIndex = n === e ? 0 : -1));
	}
	#A(e) {
		let t = {
			ArrowRight: 1,
			ArrowDown: 1,
			ArrowLeft: -1,
			ArrowUp: -1
		}, n;
		if (e.key in t) n = this.#i + t[e.key];
		else if (e.key === "Home") n = 0;
		else if (e.key === "End") n = 4;
		else return;
		e.preventDefault();
		let r = (n + f) % f;
		this.#k(r), this.shadowRoot.querySelectorAll(".slot")[r].focus();
	}
	#j(e) {
		if (e === !!this.#f) return;
		if (!e) {
			this.#f?.abort(), this.#f = null, this.#d.stop(), Object.assign(this.#u, {
				x: 0,
				y: 0,
				vx: 0,
				vy: 0,
				tx: 0,
				ty: 0
			}), this.#P(), this.#e.svg.querySelector(".blink").style.transform = "";
			return;
		}
		if (a.matches) return;
		let t = new AbortController();
		this.#f = t, window.addEventListener("pointermove", (e) => this.#M(e), {
			passive: !0,
			signal: t.signal
		});
		let n = this.#e.svg.querySelector(".blink"), r = 0, i = (e) => {
			r = setTimeout(() => {
				n.style.transform = "scaleY(0.1)", r = setTimeout(() => {
					n.style.transform = "", i(2600 + Math.random() * 3400);
				}, 120);
			}, e);
		};
		i(1800), t.signal.addEventListener("abort", () => clearTimeout(r));
	}
	#M(e) {
		let t = this.query(".coin").getBoundingClientRect(), n = e.clientX - (t.left + t.width / 2), r = e.clientY - (t.top + t.height / 2), i = Math.hypot(n, r) || 1, a = Math.min(1, i / 220);
		this.#u.tx = n / i * a * 1.8, this.#u.ty = r / i * a * 1.3, this.#d.wake();
	}
	#N() {
		let e = this.#u, { stiffness: t, damping: n } = x;
		e.vx += ((e.tx - e.x) * t - e.vx * n) * S, e.vy += ((e.ty - e.y) * t - e.vy * n) * S, e.x += e.vx * S, e.y += e.vy * S;
	}
	#P() {
		let { x: e, y: t, tx: n, ty: r, vx: i, vy: a } = this.#u;
		return this.#e.svg.querySelector(".look").style.transform = `translate(${e.toFixed(3)}px, ${t.toFixed(3)}px)`, Math.abs(n - e) + Math.abs(r - t) + Math.abs(i) + Math.abs(a) > .001;
	}
};
//#endregion
//#region src/components/avatar-picker/index.js
t("avatar-picker", j);
//#endregion
export { j as t };
