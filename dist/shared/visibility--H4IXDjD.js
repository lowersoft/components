//#region src/core/visibility.js
var e = (e, t, n) => {
	let r = !1, i = () => t(r && document.visibilityState === "visible"), a = new IntersectionObserver((e) => {
		r = e.some((e) => e.isIntersecting), i();
	});
	a.observe(e), document.addEventListener("visibilitychange", i, { signal: n }), n.addEventListener("abort", () => a.disconnect());
};
//#endregion
export { e as t };
