//#region src/core/text.js
var e = new Intl.Segmenter(void 0, { granularity: "grapheme" }), t = (t) => Array.from(e.segment(t), ({ segment: e }) => e), n = (e, t) => e.slice(0, t).replace(/\D/g, "").length, r = (e, t) => {
	if (t === 0) return 0;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (/\d/.test(e[r]) && (n += 1), n === t) return r + 1;
	return e.length;
};
//#endregion
export { t as n, r, n as t };
