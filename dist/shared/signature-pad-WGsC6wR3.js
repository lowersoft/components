import { n as e, t } from "./core-WcEz9YgG.js";
import { n, t as r } from "./form-QHOiInAj.js";
import { n as i, t as a } from "./motion-CFWhFfc_.js";
import { a as o } from "./theme-D-ctQQvB.js";
//#region src/components/signature-pad/ink.js
var s = 7, c = "#1e3a8a", l = (e, t, n) => {
	let r = Math.min(1, (t + 1) / s), i = n ? 1 : Math.min(1, (e.length - t) / s);
	return e[t].w * (.35 + .65 * Math.min(r, i));
}, u = (e, t) => {
	let n = 0;
	for (let e = 0; e < 8; e += 2) {
		let r = (e + 2) % 8;
		n += t[e] * t[r + 1] - t[r] * t[e + 1];
	}
	let r = n >= 0 ? [
		0,
		2,
		4,
		6
	] : [
		6,
		4,
		2,
		0
	];
	e.moveTo(t[r[0]], t[r[0] + 1]);
	for (let n = 1; n < 4; n++) e.lineTo(t[r[n]], t[r[n] + 1]);
	e.closePath();
}, d = (e, t, n, r, i) => {
	e.beginPath();
	for (let a = Math.max(n, 0); a < r; a++) {
		let n = t[a], r = t.length === 1 && !i ? n.w * .8 : l(t, a, i);
		if (a > 0) {
			let o = t[a - 1], s = l(t, a - 1, i), c = Math.hypot(n.x - o.x, n.y - o.y) || 1, d = -(n.y - o.y) / c, f = (n.x - o.x) / c;
			u(e, [
				o.x + d * s / 2,
				o.y + f * s / 2,
				n.x + d * r / 2,
				n.y + f * r / 2,
				n.x - d * r / 2,
				n.y - f * r / 2,
				o.x - d * s / 2,
				o.y - f * s / 2
			]);
		}
		e.moveTo(n.x + r / 2, n.y), e.arc(n.x, n.y, r / 2, 0, Math.PI * 2);
	}
	e.fill();
}, f = (e, t, n) => {
	let r = e.map((e) => {
		if (e.length === 1) {
			let [t] = e;
			return `<circle cx="${t.x.toFixed(1)}" cy="${t.y.toFixed(1)}" r="${(t.w * .4).toFixed(2)}"/>`;
		}
		let t = [], n = [];
		return e.forEach((r, i) => {
			let a = e[Math.max(i - 1, 0)], o = e[Math.min(i + 1, e.length - 1)], s = o.x - a.x, c = o.y - a.y, u = Math.hypot(s, c) || 1, d = l(e, i, !1) / 2;
			t.push(`${(r.x - c / u * d).toFixed(1)} ${(r.y + s / u * d).toFixed(1)}`), n.push(`${(r.x + c / u * d).toFixed(1)} ${(r.y - s / u * d).toFixed(1)}`);
		}), `<path d="M${t.join("L")}L${n.reverse().join("L")}Z"/>`;
	}).join("");
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.round(t)} ${Math.round(n)}" fill="${c}">${r}</svg>`;
}, p = ":host{width:380px;max-width:100%;font-family:var(--lw-font-sans);color:var(--lw-color-foreground);-webkit-user-select:none;user-select:none;display:block}:host([disabled]){opacity:.5}.card{border:1px solid var(--lw-color-border);background:var(--lw-color-background);border-radius:1rem;overflow:hidden}.pad{height:200px;position:relative}.line{border-bottom:1px solid color-mix(in oklab, var(--lw-color-foreground) 18%, transparent);color:var(--lw-color-muted-foreground);pointer-events:none;align-items:flex-end;gap:.5rem;padding-bottom:.375rem;display:flex;position:absolute;inset:auto 1.5rem 3rem}.cross{font-size:var(--lw-text-lg);opacity:.7;line-height:1}.hint{font-size:var(--lw-text-sm);opacity:0;filter:blur(2px);transition:opacity .2s ease-out,filter .2s ease-out}[data-empty] .hint{opacity:.7;filter:none}canvas{width:100%;height:100%;color:var(--lw-signature-pad-ink,var(--lightningcss-light,#1e3a8a)var(--lightningcss-dark,#93c5fd));cursor:crosshair;touch-action:none;outline:none;position:absolute;inset:0}canvas:focus-visible{box-shadow:inset 0 0 0 2px var(--lw-color-ring)}:host([disabled]) canvas{cursor:not-allowed}.footer{border-top:1px solid var(--lw-color-border);justify-content:space-between;align-items:center;gap:.75rem;padding:.625rem 1rem;display:flex}.status{font-size:var(--lw-text-sm);text-overflow:ellipsis;white-space:nowrap;color:var(--lw-color-muted-foreground);margin:0;overflow:hidden}.actions{flex:none;gap:.25rem;display:flex}.actions button{border-radius:var(--lw-radius-sm);font:inherit;font-size:var(--lw-text-sm);color:var(--lw-color-muted-foreground);cursor:pointer;background:0 0;border:0;outline:none;padding:.25rem .625rem;transition:color .15s ease-out,background-color .15s ease-out}.actions button:hover{background:var(--lw-color-muted);color:var(--lw-color-foreground)}.actions button:focus-visible{outline:2px solid var(--lw-color-ring);outline-offset:2px}.actions button:disabled{opacity:.4;pointer-events:none}", m = 1 / 240, h = 2600, g = 78, _ = 3.6, v = 1800, y = .08, b = .6, x = 420, S = (e, t, n) => Math.min(Math.max(e, t), n), C = (e) => e < .5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2, w = class extends r(e) {
	static styles = p;
	static props = {
		label: { default: "Signature" },
		name: {},
		required: { type: Boolean },
		disabled: {
			type: Boolean,
			reflect: !0
		}
	};
	#e = [];
	#t = 0;
	#n = {
		held: !1,
		pressure: .5,
		usesPressure: !1,
		targetX: 0,
		targetY: 0,
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		width: _,
		speed: 0
	};
	#r = a(m, {
		step: () => this.#g(),
		render: () => this.#_()
	});
	#i = {
		width: 0,
		height: 0
	};
	#a = 0;
	#o = !1;
	#s = !1;
	render() {
		return "<div class=\"card\" part=\"base\"><div class=\"pad\" part=\"pad\"><div class=\"line\" aria-hidden=\"true\"><span class=\"cross\">×</span><span class=\"hint\">Sign here</span></div><canvas role=\"img\" tabindex=\"0\"></canvas></div><div class=\"footer\"><p class=\"status\" aria-live=\"polite\"></p><div class=\"actions\"><button class=\"undo\" type=\"button\">Undo</button><button class=\"clear\" type=\"button\">Clear</button></div></div></div>";
	}
	connected() {
		let e = { signal: this.signal }, t = this.query("canvas");
		t.addEventListener("pointerdown", (e) => this.#y(e), e), t.addEventListener("pointermove", (e) => this.#b(e), e);
		for (let n of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(n, () => this.#x(), e);
		t.addEventListener("keydown", (e) => this.#S(e), e), this.query(".undo").addEventListener("click", () => this.undo(), e), this.query(".clear").addEventListener("click", () => this.clear(), e);
		let n = new ResizeObserver(() => this.#m());
		n.observe(this.query(".pad")), o(() => this.#h(), this.signal), this.signal.addEventListener("abort", () => {
			n.disconnect(), this.#r.stop(), cancelAnimationFrame(this.#a), this.#a && this.#l(), this.#n.held = !1, this.#o = !1;
		}), this.#m();
	}
	updated(e) {
		e.has("disabled") && this.#u(), this.#d();
	}
	formResetCallback() {
		this.#e = [], this.#h(), this.#d();
	}
	formDisabledCallback(e) {
		this.#s = e, this.#u();
	}
	get value() {
		return this.#e.length ? f(this.#e, this.#i.width, this.#i.height) : null;
	}
	undo() {
		this.#n.held || this.#a || this.#e.length === 0 || (this.#e.pop(), this.#h(), this.#f());
	}
	clear() {
		if (this.#n.held || this.#a || this.#e.length === 0) return;
		if (i.matches) {
			this.#l();
			return;
		}
		let e = performance.now(), t = (n) => {
			let r = S((n - e) / x, 0, 1);
			this.#h(1 - C(r)), r < 1 ? this.#a = requestAnimationFrame(t) : this.#l();
		};
		this.#a = requestAnimationFrame(t), this.#d();
	}
	get #c() {
		return !this.disabled && !this.#s;
	}
	#l() {
		this.#a = 0, this.#e = [], this.#h(), this.#f();
	}
	#u() {
		this.query("canvas").tabIndex = this.#c ? 0 : -1, this.#d();
	}
	#d() {
		let e = this.#e.length, t = this.query("canvas");
		t.ariaLabel = `${this.label}${e ? `, ${e} stroke${e === 1 ? "" : "s"}` : ", empty"}`, this.query(".status").textContent = e ? "Signed" : "Draw your signature", this.query(".pad").toggleAttribute("data-empty", e === 0 && !this.#n.held);
		let r = e === 0 || !!this.#a || !this.#c;
		this.query(".undo").disabled = r, this.query(".clear").disabled = r;
		let i = this.value;
		this[n].setFormValue(this.name ? i : null), this.required && !i ? this[n].setValidity({ valueMissing: !0 }, "Please sign.", t) : this[n].setValidity({});
	}
	#f() {
		this.#d(), this.emit("change", { value: this.value });
	}
	#p() {
		let e = this.query("canvas").getContext("2d");
		return e.fillStyle = getComputedStyle(this.query("canvas")).color, e;
	}
	#m() {
		let e = this.query(".pad").getBoundingClientRect(), t = this.query("canvas"), n = Math.min(devicePixelRatio || 1, 3);
		this.#i = {
			width: e.width,
			height: e.height
		}, t.width = Math.round(e.width * n), t.height = Math.round(e.height * n), t.getContext("2d").setTransform(n, 0, 0, n, 0, 0), this.#h();
	}
	#h(e = 1) {
		let t = this.#p();
		t.clearRect(0, 0, this.#i.width, this.#i.height);
		let n = Math.round(this.#e.reduce((e, t) => e + t.length, 0) * e);
		this.#e.forEach((e, r) => {
			if (n <= 0) return;
			let i = this.#n.held && r === this.#e.length - 1;
			d(t, e, 0, Math.min(e.length, n), i), n -= e.length;
		});
	}
	#g() {
		let e = this.#n;
		e.vx += ((e.targetX - e.x) * h - e.vx * g) * m, e.vy += ((e.targetY - e.y) * h - e.vy * g) * m, e.x += e.vx * m, e.y += e.vy * m, e.speed = Math.hypot(e.vx, e.vy);
		let t = e.usesPressure ? .45 + e.pressure * .9 : 1, n = (_ - 2.5 * S(e.speed / v, 0, 1)) * t;
		e.width += (n - e.width) * y;
		let r = this.#e.at(-1), i = r?.at(-1);
		i && Math.hypot(e.x - i.x, e.y - i.y) >= b && r.push({
			x: e.x,
			y: e.y,
			w: e.width
		});
	}
	#_() {
		let e = this.#n, t = this.#e.at(-1);
		t && (d(this.#p(), t, this.#t - 1, t.length, !0), this.#t = t.length);
		let n = Math.hypot(e.targetX - e.x, e.targetY - e.y) < .3 && e.speed < 5;
		return e.held || !n ? !0 : (this.#o = !1, this.#h(), this.#f(), !1);
	}
	#v(e) {
		let t = this.query(".pad").getBoundingClientRect();
		return {
			x: e.clientX - t.left,
			y: e.clientY - t.top
		};
	}
	#y(e) {
		let t = this.#n;
		if (!this.#c || this.#a || t.held || e.pointerType === "mouse" && e.button !== 0) return;
		e.preventDefault(), e.currentTarget.focus({ preventScroll: !0 }), e.currentTarget.setPointerCapture(e.pointerId), this.#r.stop(), this.#o && (this.#o = !1, this.#f());
		let { x: n, y: r } = this.#v(e);
		Object.assign(t, {
			held: !0,
			usesPressure: e.pointerType === "pen",
			pressure: e.pressure || .5,
			x: n,
			y: r,
			targetX: n,
			targetY: r,
			vx: 0,
			vy: 0,
			width: _,
			speed: 0
		}), this.#e.push([{
			x: n,
			y: r,
			w: _
		}]), this.#t = 0, this.#h(), this.#d(), this.#r.wake();
	}
	#b(e) {
		let t = this.#n;
		if (!t.held) return;
		let { x: n, y: r } = this.#v(e);
		t.targetX = n, t.targetY = r, t.usesPressure && (t.pressure = e.pressure), i.matches && Object.assign(t, {
			x: n,
			y: r,
			vx: 0,
			vy: 0
		});
	}
	#x() {
		this.#n.held && (this.#n.held = !1, this.#o = !0, this.#r.wake());
	}
	#S(e) {
		this.#c && (e.key.toLowerCase() === "z" && (e.metaKey || e.ctrlKey) ? (e.preventDefault(), this.undo()) : (e.key === "Backspace" || e.key === "Delete") && (e.preventDefault(), this.clear()));
	}
};
//#endregion
//#region src/components/signature-pad/index.js
t("signature-pad", w);
//#endregion
export { w as t };
