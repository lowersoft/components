//#region src/core/dates.js
var e = 864e5, t = (e) => /* @__PURE__ */ new Date(`${e}T00:00:00Z`), n = (e) => e.toISOString().slice(0, 10), r = (e) => /^\d{4}-\d{2}-\d{2}$/.test(e ?? "") && !Number.isNaN(t(e).getTime()) ? e : null, i = () => {
	let e = /* @__PURE__ */ new Date();
	return n(new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate())));
}, a = (r, i) => n(new Date(t(r).getTime() + i * e)), o = (e, r) => {
	let i = t(e);
	return n(new Date(Date.UTC(i.getUTCFullYear(), i.getUTCMonth() + r, 1)));
}, s = (e, t) => {
	let n = o(e, t);
	return p(a(o(n, 1), -1), `${n.slice(0, 8)}${e.slice(8)}`);
}, c = (e) => `${e.slice(0, 8)}01`, l = (e) => a(o(e, 1), -1), u = (e, t) => e.slice(0, 7) === t.slice(0, 7), d = (n, r) => Math.round((t(r) - t(n)) / e) + 1, f = (e) => t(e).getUTCDay(), p = (e, t) => e < t ? e : t, m = (e, t) => e > t ? e : t, h = (e, n, r) => new Intl.DateTimeFormat(n, {
	...r,
	timeZone: "UTC"
}).format(t(e));
//#endregion
export { h as a, r as c, c as d, i as f, l as i, u as l, o as n, m as o, f as p, d as r, p as s, a as t, s as u };
