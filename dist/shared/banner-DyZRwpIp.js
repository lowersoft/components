import { r as e } from "./icons-Dv1KN71n.js";
import { n as t } from "./motion-CFWhFfc_.js";
import { Dt as n } from "./lucide-BVbUPHVq.js";
//#region src/core/banner.js
var r = (t = "Dismiss") => `<button class="close" type="button" aria-label="${t}">${e(n, 18)}</button>`, i = async (e) => {
	if (!t.matches) {
		let t = e.offsetHeight;
		await e.animate({
			height: [`${t}px`, "0px"],
			opacity: [1, 0]
		}, {
			duration: 250,
			easing: "cubic-bezier(0.23, 1, 0.32, 1)"
		}).finished.catch(() => {});
	}
	e.hidden = !0, e.emit("dismiss");
};
//#endregion
export { i as n, r as t };
