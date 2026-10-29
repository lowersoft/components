//#region src/core/motion.js
var e = matchMedia("(prefers-reduced-motion: reduce)"), t = (e) => navigator.vibrate?.(e), n = (e, { step: t, render: n }) => {
	let r = 0, i = 0, a = 0, o = !1, s = (l) => {
		r = 0, a += i ? Math.min((l - i) / 1e3, .05) : e, i = l;
		let u = !1;
		for (; a >= e && !u;) a -= e, u = t() === !0;
		n(u) === !1 || !o ? c() : r ||= requestAnimationFrame(s);
	}, c = () => {
		o = !1, cancelAnimationFrame(r), r = i = a = 0;
	};
	return {
		wake: () => {
			o = !0, r ||= requestAnimationFrame(s);
		},
		stop: c
	};
}, r = (e, t) => {
	let n = 2 * Math.PI / (e * 1.2);
	return {
		stiffness: n * n,
		damping: 2 * Math.min(Math.max(1 - t, .05), 1) * n
	};
}, i = 1 / 240, a = (e, t, { stiffness: r, damping: a, velocity: o = 0, restDelta: s = .001, restSpeed: c = .01, update: l, done: u }) => {
	let d = e, f = o, p = n(i, {
		step: () => {
			f += ((t - d) * r - f * a) * i, d += f * i;
		},
		render: () => {
			let e = Math.abs(t - d) < s && Math.abs(f) < c;
			return l(e ? t : d), !e || (u?.(), !1);
		}
	});
	return p.wake(), p.stop;
};
//#endregion
export { t as a, a as i, e as n, r, n as t };
