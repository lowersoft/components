//#region src/core/canvas.js
var e = (e, t) => {
	let { width: n, height: r } = e.getBoundingClientRect(), i = Math.min(window.devicePixelRatio || 1, 2);
	return e.width = Math.round(n * i), e.height = Math.round(r * i), t.setTransform(i, 0, 0, i, 0, 0), {
		width: n,
		height: r
	};
};
//#endregion
export { e as t };
