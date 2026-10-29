import { t as e } from "./dom-Dlk1FlsZ.js";
import { n as t, t as n } from "./face-BTqcW8Ou.js";
//#region src/core/testimonial.js
var r = (t) => `<span class="company"><span class="company-mark" style="--_mark: ${e(t?.color ?? "#3b6ef5")}" aria-hidden="true">${e((t?.name ?? "").charAt(0))}</span><span class="company-name">${e(t?.name ?? "")}</span></span>`, i = (t) => e(t).replace(/==(?:(\d+):)?(.+?)==/g, (e, t, n) => t ? `<mark data-note="${t}">${n}<sup class="note">${t}</sup></mark>` : `<mark>${n}</mark>`), a = (e, r) => {
	let i = new n();
	return i.show(t(r || " ", 0), { morph: !1 }), e.replaceChildren(i.svg), i;
};
//#endregion
export { a as n, i as r, r as t };
