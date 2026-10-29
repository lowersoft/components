import { t as e } from "./core-WcEz9YgG.js";
import { t } from "./action-button-CL_BDqUs.js";
//#region src/components/particle-button/particle-button.scss?inline
var n = ".button{overflow:visible}.burst{pointer-events:none;position:absolute}", r = 18, i = .0016, a = .0022, o = 650, s = 64, c = (e) => Array.from({ length: r }, (t, n) => {
	let r = Math.min(Math.max(e / 2 + (Math.random() - .5) * Math.min(e, 120), 4), e - 4), i = r < e / 2 ? -1 : 1, a = .18 + Math.random() * .22, o = -Math.PI / 2 + i * Math.random() * .9, s = n % 3 == 0;
	return {
		x: r,
		y: 0,
		vx: Math.cos(o) * a,
		vy: Math.sin(o) * a,
		angle: Math.random() * Math.PI,
		spin: (Math.random() - .5) * .02,
		w: s ? 5 : 3,
		h: s ? 2 : 3
	};
}), l = class extends t {
	static styles = [...t.styles, n];
	static props = {
		...t.props,
		noParticles: { type: Boolean }
	};
	statusChanged(e, t) {
		super.statusChanged(e, t), e === "success" && t && !this.noParticles && this.#e();
	}
	#e() {
		let e = this.query("button"), { offsetWidth: t, offsetHeight: n } = e, r = getComputedStyle(e), l = r.backgroundColor === "rgba(0, 0, 0, 0)" ? r.color : r.backgroundColor, u = devicePixelRatio || 1, d = document.createElement("canvas");
		d.className = "burst", d.setAttribute("aria-hidden", "true"), d.width = (t + 128) * u, d.height = (n + 128) * u, Object.assign(d.style, {
			left: `${-64 - e.clientLeft}px`,
			top: `${-64 - e.clientTop}px`,
			width: `${t + 128}px`,
			height: `${n + 128}px`
		}), e.append(d);
		let f = d.getContext("2d");
		f.fillStyle = l;
		let p = c(t), m = performance.now(), h = m, g = 0, _ = (e) => {
			let t = (e - m) / o;
			if (t >= 1) return d.remove();
			let n = Math.min(e - h, 32);
			h = e, f.setTransform(1, 0, 0, 1, 0, 0), f.clearRect(0, 0, d.width, d.height), f.globalAlpha = 1 - t * t;
			for (let e of p) e.vx *= 1 - a * n, e.vy = e.vy * (1 - a * n) + i * n, e.x += e.vx * n, e.y += e.vy * n, e.angle += e.spin * n, f.setTransform(u, 0, 0, u, (e.x + s) * u, (e.y + s) * u), f.rotate(e.angle), f.fillRect(-e.w / 2, -e.h / 2, e.w, e.h);
			g = requestAnimationFrame(_);
		};
		g = requestAnimationFrame(_), this.signal.addEventListener("abort", () => {
			cancelAnimationFrame(g), d.remove();
		}, { once: !0 });
	}
};
//#endregion
//#region src/components/particle-button/index.js
e("particle-button", l);
//#endregion
export { l as t };
