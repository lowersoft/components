import { t as e } from "./dom-Dlk1FlsZ.js";
import { r as t } from "./icons-Dv1KN71n.js";
import { n, r } from "./menu-BCEGADW6.js";
import { t as i } from "./swap-BK53XQML.js";
import { f as a } from "./lucide-BVbUPHVq.js";
//#region src/core/picker.js
var o = (n, { icon: i = "", label: o = "" } = {}) => `<span class="picker"><button class="picker-trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="${n}">${i}${o ? `<span class="picker-label">${e(o)}</span>` : ""}<span class="picker-value swap"></span>${t(a, 14)}</button>${r(n)}</span>`, s = (e, t, r) => {
	let a = e.querySelector(".picker-trigger"), o = new n({
		trigger: a,
		menu: e.querySelector(".menu"),
		onPick: r
	});
	return o.connect(t), { set(e, t) {
		o.setItems(e), o.setChecked(t), i(a.querySelector(".picker-value"), e.find((e) => e.value === t)?.label ?? "", a);
	} };
};
//#endregion
export { o as n, s as t };
