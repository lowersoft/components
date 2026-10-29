//#region src/core/highlight.js
var e = (e, t) => {
	if (!t) return;
	let n = !e.classList.contains("visible");
	n && (e.style.transition = "none"), e.style.translate = `${t.offsetLeft}px ${t.offsetTop}px`, e.style.width = `${t.offsetWidth}px`, e.style.height = `${t.offsetHeight}px`, n && (e.getBoundingClientRect(), e.style.transition = ""), e.classList.add("visible");
}, t = (e) => e.classList.remove("visible");
//#endregion
export { e as n, t };
