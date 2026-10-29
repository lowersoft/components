//#region src/core/noise.js
var e = (e) => {
	let t = Array.from({ length: 256 }, (e, t) => t), n = e >>> 0 || 1, r = () => (n = n * 1664525 + 1013904223 >>> 0, n / 4294967296);
	for (let e = 255; e > 0; e--) {
		let n = Math.floor(r() * (e + 1));
		[t[e], t[n]] = [t[n], t[e]];
	}
	let i = /* @__PURE__ */ new Uint8Array(512);
	for (let e = 0; e < 512; e++) i[e] = t[e & 255];
	let a = (e) => e * e * e * (e * (e * 6 - 15) + 10), o = (e, t, n) => e + (t - e) * n, s = (e, t, n, r) => {
		let i = e & 15, a = i < 8 ? t : n, o = i < 4 ? n : i === 12 || i === 14 ? t : r;
		return (i & 1 ? -a : a) + (i & 2 ? -o : o);
	};
	return (e, t, n) => {
		let r = Math.floor(e) & 255, c = Math.floor(t) & 255, l = Math.floor(n) & 255, u = e - Math.floor(e), d = t - Math.floor(t), f = n - Math.floor(n), p = a(u), m = a(d), h = a(f), g = i[r] + c, _ = i[g] + l, v = i[g + 1] + l, y = i[r + 1] + c, b = i[y] + l, x = i[y + 1] + l;
		return o(o(o(s(i[_], u, d, f), s(i[b], u - 1, d, f), p), o(s(i[v], u, d - 1, f), s(i[x], u - 1, d - 1, f), p), m), o(o(s(i[_ + 1], u, d, f - 1), s(i[b + 1], u - 1, d, f - 1), p), o(s(i[v + 1], u, d - 1, f - 1), s(i[x + 1], u - 1, d - 1, f - 1), p), m), h);
	};
};
//#endregion
export { e as t };
