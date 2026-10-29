import { i as e, n as t, r as n } from "./motion-CFWhFfc_.js";
//#region src/core/face.js
var r = [
	{
		name: "gray",
		rgb: [
			228,
			228,
			231
		]
	},
	{
		name: "sand",
		rgb: [
			233,
			226,
			214
		]
	},
	{
		name: "sage",
		rgb: [
			217,
			225,
			213
		]
	},
	{
		name: "slate",
		rgb: [
			218,
			225,
			233
		]
	},
	{
		name: "clay",
		rgb: [
			235,
			221,
			214
		]
	},
	{
		name: "mist",
		rgb: [
			226,
			223,
			233
		]
	}
], i = [
	[
		246,
		233,
		222
	],
	[
		236,
		210,
		187
	],
	[
		214,
		176,
		142
	],
	[
		176,
		128,
		96
	],
	[
		128,
		88,
		66
	]
], a = [
	[
		39,
		39,
		42
	],
	[
		63,
		45,
		36
	],
	[
		113,
		84,
		62
	],
	[
		161,
		161,
		170
	],
	[
		82,
		82,
		91
	]
], o = [
	[
		39,
		39,
		42
	],
	[
		82,
		82,
		91
	],
	[
		113,
		113,
		122
	],
	[
		244,
		244,
		245
	]
], s = "#18181b", c = n(.42, .22), l = (e) => {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
	return t >>> 0;
}, u = (e) => {
	let t = e;
	return () => {
		t = t + 1831565813 | 0;
		let e = Math.imul(t ^ t >>> 15, 1 | t);
		return e ^= e + Math.imul(e ^ e >>> 7, 61 | e), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}, d = (e) => Math.round(e * 100) / 100, f = (e, t) => e[Math.min(e.length - 1, Math.floor(t * e.length))], p = (e, t) => {
	let n = "short hair";
	e.hairLength > .62 ? n = "long hair" : e.hairVolume < .22 && (n = "cropped hair");
	let r = "a slight smile";
	return e.mouthOpen > .5 ? r = "an open smile" : e.mouthCurve > 3.2 ? r = "a wide smile" : e.mouthCurve < 1 && (r = "a calm expression"), `${e.headSquare > .55 ? "Square face" : "Round face"}, ${n}${e.glasses > .5 ? ", glasses" : ""}, ${r}, on ${t}`;
}, m = (e, t) => `${e.trim().toLowerCase()}:${t}`, h = (e) => {
	let t = u(l(e)), n = f(r, t()), s = {
		headW: 18 + t() * 5,
		headH: 22 + t() * 4,
		headSquare: t(),
		chin: .75 + t() * .25,
		hairVolume: t(),
		hairFringe: t(),
		hairPart: t() * 2 - 1,
		hairLength: t() ** 1.6,
		eyeGap: 7.5 + t() * 3,
		eyeY: -2 + t() * 4,
		eyeRx: 1.7 + t() * .9,
		eyeRy: 1.9 + t() * 1.4,
		browTilt: -2 + t() * 4,
		browLift: 4.2 + t() * 2,
		browWeight: t() < .65 ? 1.3 + t() * .8 : 0,
		mouthW: 3.5 + t() * 3,
		mouthCurve: t() * 4.5,
		mouthOpen: t() < .3 ? .6 + t() * .4 : 0,
		nose: t(),
		glasses: +(t() < .25),
		cheeks: t(),
		shoulders: t()
	};
	for (let e of Object.keys(s)) s[e] = d(s[e]);
	return {
		shape: s,
		bg: n.rgb,
		skin: f(i, t()),
		hair: f(a, t()),
		shirt: f(o, t()),
		description: p(s, n.name)
	};
}, g = (e, t, n) => e + (t - e) * n, _ = (e, t, n) => e.map((e, r) => Math.max(0, Math.min(255, Math.round(g(e, t[r], n))))), v = (e, t, n) => {
	let r = {};
	for (let i of Object.keys(t.shape)) r[i] = g(e.shape[i], t.shape[i], n);
	let i = Math.min(1, n);
	return {
		shape: r,
		bg: _(e.bg, t.bg, i),
		skin: _(e.skin, t.skin, i),
		hair: _(e.hair, t.hair, i),
		shirt: _(e.shirt, t.shirt, i),
		description: t.description
	};
}, y = (e, t = 1) => `rgb(${Math.round(e[0] * t)} ${Math.round(e[1] * t)} ${Math.round(e[2] * t)})`, b = d, x = (e, t, n, r, i, a, o = 1) => {
	let s = .552 + a * .28, c = s * o;
	return `M${b(e)} ${b(t - r)}C${b(e + s * n)} ${b(t - r)} ${b(e + n)} ${b(t - s * r)} ${b(e + n)} ${b(t)}C${b(e + n)} ${b(t + c * i)} ${b(e + c * n)} ${b(t + i)} ${b(e)} ${b(t + i)}C${b(e - c * n)} ${b(t + i)} ${b(e - n)} ${b(t + c * i)} ${b(e - n)} ${b(t)}C${b(e - n)} ${b(t - s * r)} ${b(e - s * n)} ${b(t - r)} ${b(e)} ${b(t - r)}Z`;
}, S = (e, t, n) => {
	let r = e.headW, i = e.headH, a = e.hairVolume, o = n - i * .12, s = n - i - 1.5 - a * 4, c = r + 1.5 + a * 2.5, l = .552 + e.headSquare * .28, u = n - i * (.66 - e.hairFringe * .36), d = t + e.hairPart * r * .55;
	return `M${b(t - c)} ${b(o)}C${b(t - c)} ${b(n - i * l - a * 3)} ${b(t - l * c)} ${b(s)} ${b(t)} ${b(s)}C${b(t + l * c)} ${b(s)} ${b(t + c)} ${b(n - i * l - a * 3)} ${b(t + c)} ${b(o)}L${b(t + r - 1)} ${b(o)}Q${b(t + r * .75)} ${b(u + 1 - e.hairPart * 5)} ${b(d)} ${b(u - 2.5)}Q${b(t - r * .75)} ${b(u + 1 + e.hairPart * 5)} ${b(t - r + 1)} ${b(o)}Z`;
}, C = (e, t, n) => {
	let r = e.mouthCurve * 2, i = e.mouthOpen * 5;
	return `M${b(t - e.mouthW)} ${b(n)}Q${b(t)} ${b(n + r)} ${b(t + e.mouthW)} ${b(n)}Q${b(t)} ${b(n + r + i)} ${b(t - e.mouthW)} ${b(n)}Z`;
}, w = document.createElement("template");
w.innerHTML = `<svg class="face" viewBox="12 14 76 76" aria-hidden="true"><rect data-part="bg" width="100" height="100"/><path data-part="backHair"/><path data-part="shirt"/><rect data-part="neck" rx="3" width="12" x="44"/><ellipse data-part="earL" rx="3" ry="4.5"/><ellipse data-part="earR" rx="3" ry="4.5"/><path data-part="head"/><path data-part="hair"/><g data-part="cheeks" fill="${s}"><circle data-part="cheekL" r="3.4"/><circle data-part="cheekR" r="3.4"/></g><g data-part="brows" stroke="${s}" stroke-linecap="round" stroke-opacity="0.85"><path data-part="browL"/><path data-part="browR"/></g><g class="look"><g class="blink"><ellipse data-part="eyeL" fill="${s}"/><ellipse data-part="eyeR" fill="${s}"/></g></g><path data-part="nose" fill="none" stroke="${s}" stroke-linecap="round" stroke-opacity="0.35" stroke-width="1.2"/><path data-part="mouth" fill="${s}" stroke="${s}" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/><g data-part="glasses" fill="none" stroke="${s}" stroke-width="1.2"><circle data-part="glassL"/><circle data-part="glassR"/><path data-part="bridge"/></g></svg>`;
var T = (e, t) => {
	for (let [n, r] of Object.entries(t)) e.setAttribute(n, r);
}, E = class {
	svg = w.content.firstElementChild.cloneNode(!0);
	parts = Object.fromEntries([...this.svg.querySelectorAll("[data-part]")].map((e) => [e.dataset.part, e]));
	#e = null;
	#t = null;
	#n = null;
	#r = null;
	get face() {
		return this.#t;
	}
	show(n, { morph: r = !0 } = {}) {
		if (n === this.#n) return;
		let i = h(n);
		if (this.#r?.(), this.#n = n, this.#t = i, !r || !this.#e || t.matches) {
			this.#i(i);
			return;
		}
		let a = this.#e;
		this.#r = e(0, 1, {
			...c,
			update: (e) => this.#i(v(a, i, e)),
			done: () => this.#r = null
		});
	}
	stop() {
		this.#r?.(), this.#r = null;
	}
	#i(e) {
		this.#e = e;
		let t = e.shape, n = this.parts, r = 50 + t.eyeY, i = Math.max(t.eyeRx, t.eyeRy) + 3.2, a = 50 + t.headH - 6, o = 50 + t.headH + 3, s = 30 + t.shoulders * 8;
		T(n.bg, { fill: y(e.bg) }), T(n.backHair, {
			fill: y(e.hair, .9),
			d: x(50, 50 - t.headH * .15, t.headW + 1 + t.hairVolume * 2.5, t.headH * .85 + t.hairVolume * 4, t.headH * .15 + t.hairLength * (t.headH + 14), t.headSquare * .6)
		}), T(n.shirt, {
			fill: y(e.shirt),
			d: `M${b(50 - s)} 100C${b(50 - s)} ${b(o + 6)} ${b(50 - s * .55)} ${b(o)} 50 ${b(o)}C${b(50 + s * .55)} ${b(o)} ${b(50 + s)} ${b(o + 6)} ${b(50 + s)} 100Z`
		}), T(n.neck, {
			fill: y(e.skin, .9),
			y: b(a),
			height: b(o - a + 3)
		}), T(n.earL, {
			fill: y(e.skin, .95),
			cx: b(50 - t.headW),
			cy: b(52)
		}), T(n.earR, {
			fill: y(e.skin, .95),
			cx: b(50 + t.headW),
			cy: b(52)
		}), T(n.head, {
			fill: y(e.skin),
			d: x(50, 50, t.headW, t.headH, t.headH, t.headSquare, t.chin)
		}), T(n.hair, {
			fill: y(e.hair),
			d: S(t, 50, 50)
		}), T(n.cheeks, { opacity: b(.045 * t.cheeks) }), T(n.cheekL, {
			cx: b(50 - t.eyeGap - 3),
			cy: b(r + 7)
		}), T(n.cheekR, {
			cx: b(50 + t.eyeGap + 3),
			cy: b(r + 7)
		}), T(n.brows, { "stroke-width": b(Math.max(0, t.browWeight)) });
		let c = r - t.browLift;
		T(n.browL, { d: `M${b(50 - t.eyeGap - 3.2)} ${b(c + t.browTilt)}L${b(50 - t.eyeGap + 3.2)} ${b(c - t.browTilt)}` }), T(n.browR, { d: `M${b(50 + t.eyeGap - 3.2)} ${b(c - t.browTilt)}L${b(50 + t.eyeGap + 3.2)} ${b(c + t.browTilt)}` });
		for (let [e, i] of [[n.eyeL, 50 - t.eyeGap], [n.eyeR, 50 + t.eyeGap]]) T(e, {
			cx: b(i),
			cy: b(r),
			rx: b(t.eyeRx),
			ry: b(t.eyeRy)
		});
		let l = r + 8 + t.nose * 1.5;
		T(n.nose, { d: `M${b(48.5 - t.nose)} ${b(l)}Q50 ${b(l + 1.5)} ${b(51.5 + t.nose)} ${b(l)}` }), T(n.mouth, { d: C(t, 50, 50 + t.headH * .5) }), T(n.glasses, { opacity: b(Math.max(0, Math.min(1, t.glasses))) }), T(n.glassL, {
			cx: b(50 - t.eyeGap),
			cy: b(r),
			r: b(i)
		}), T(n.glassR, {
			cx: b(50 + t.eyeGap),
			cy: b(r),
			r: b(i)
		}), T(n.bridge, { d: `M${b(50 - t.eyeGap + i)} ${b(r)}Q50 ${b(r - 2)} ${b(50 + t.eyeGap - i)} ${b(r)}` });
	}
};
//#endregion
export { m as n, h as r, E as t };
