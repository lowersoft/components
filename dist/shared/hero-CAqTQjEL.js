import { t as e } from "./dom-Dlk1FlsZ.js";
import { r as t } from "./icons-Dv1KN71n.js";
import { i as n } from "./lucide-BVbUPHVq.js";
//#region src/core/hero.js
var r = (r, i) => `<div class="actions"><slot name="actions"><lw-button class="primary">${e(r)}<span slot="end">${t(n, 16)}</span></lw-button>${i ? `<lw-button class="secondary" variant="ghost">${e(i)}</lw-button>` : ""}</slot></div>`, i = (e, t) => `<div class="intro"><div class="lead"><slot name="eyebrow"></slot><h1 class="title"></h1></div><div class="pitch"><p class="description"></p>${r(e, t)}</div></div>`, a = (e) => {
	e.query(".title").textContent = e.heading ?? "", e.query(".description").textContent = e.description ?? "";
};
//#endregion
export { i as n, a as r, r as t };
