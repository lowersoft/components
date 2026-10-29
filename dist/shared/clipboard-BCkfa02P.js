//#region src/core/clipboard.js
var e = (e) => {
	let t = document.activeElement;
	for (; t?.shadowRoot?.activeElement;) t = t.shadowRoot.activeElement;
	let n = Object.assign(document.createElement("textarea"), {
		value: e,
		readOnly: !0
	});
	n.style.cssText = "position: fixed; opacity: 0; pointer-events: none", document.body.append(n), n.select();
	let r = document.execCommand("copy");
	if (n.remove(), t?.focus({ preventScroll: !0 }), !r) throw Error("Copy was refused");
}, t = async (t) => {
	try {
		await navigator.clipboard.writeText(t);
	} catch {
		e(t);
	}
};
//#endregion
export { t };
