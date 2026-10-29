import { n as e } from "./motion-CFWhFfc_.js";
//#region src/styles/swap.scss?inline
var t = ".swap{clip-path:inset(0 -100vmax);display:inline-flex;position:relative}.swap .leaving{position:absolute;left:0}", n = 250, r = {
	translate: ["0 0", "0 -100%"],
	opacity: [1, 0],
	filter: ["blur(0)", "blur(2px)"]
}, i = {
	translate: ["0 100%", "0 0"],
	opacity: [0, 1],
	filter: ["blur(2px)", "blur(0)"]
}, a = (t, a, o) => {
	let s = t.lastElementChild;
	if (s?.textContent === a) return;
	let c = o?.offsetWidth, l = Object.assign(document.createElement("span"), { textContent: a });
	if (t.append(l), !s || e.matches) {
		s?.remove();
		return;
	}
	t.querySelectorAll(".leaving").forEach((e) => e.remove()), s.classList.add("leaving");
	let u = o?.offsetWidth, d = {
		duration: n,
		easing: getComputedStyle(t).getPropertyValue("--lw-ease-out").trim() || "ease-out"
	};
	l.animate(i, d), s.animate(r, d).finished.then(() => s.remove(), () => s.remove()), o && u !== c && o.animate({ width: [`${c}px`, `${u}px`] }, d);
};
//#endregion
export { t as n, a as t };
