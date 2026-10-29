import { t as e } from "./dom-Dlk1FlsZ.js";
//#region src/core/footer.js
var t = (t, n = "/") => `<a class="brand" href="${e(n)}"><span class="brand-tile" aria-hidden="true">${e((t ?? "").charAt(0).toUpperCase())}</span><span class="brand-name">${e(t ?? "")}</span></a>`, n = (t) => `<a class="link" href="${e(t.href ?? "#")}"><span class="link-label">${e(t.label)}</span>${t.badge ? `<span class="badge">${e(t.badge)}</span>` : ""}</a>`, r = (t) => (t ?? []).map((t) => `<nav class="column" aria-label="${e(t.title)}"><h2 class="column-title">${e(t.title)}</h2><ul class="links">${t.links.map((e) => `<li>${n(e)}</li>`).join("")}</ul></nav>`).join("");
//#endregion
export { n, r, t };
