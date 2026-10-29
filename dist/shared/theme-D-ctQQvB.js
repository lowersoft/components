//#region src/core/theme.js
var e = document.documentElement, t = matchMedia("(prefers-color-scheme: dark)"), n = () => ["light", "dark"].includes(e.dataset.theme) ? e.dataset.theme : "system", r = () => {
	let e = n();
	return e === "system" ? t.matches ? "dark" : "light" : e;
}, i = (t) => {
	t === "system" ? delete e.dataset.theme : e.dataset.theme = t;
}, a = (n, r) => {
	let i = new MutationObserver(n);
	i.observe(e, { attributeFilter: ["data-theme"] }), t.addEventListener("change", n, { signal: r }), r.addEventListener("abort", () => i.disconnect());
};
//#endregion
export { a, n as i, t as n, i as r, r as t };
