//#region src/core/dom.js
var e = (e) => {
	let t = e.composedPath()[0];
	return t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
}, t = (e) => String(e).replace(/[&<>"']/g, (e) => `&#${e.charCodeAt(0)};`), n = (e, t) => {
	if (e.nodeType !== t.nodeType || e.nodeName !== t.nodeName) e.replaceWith(t);
	else if (e.nodeType !== Node.ELEMENT_NODE) e.nodeValue !== t.nodeValue && (e.nodeValue = t.nodeValue);
	else {
		for (let { name: n } of [...e.attributes]) t.hasAttribute(n) || e.removeAttribute(n);
		for (let { name: n, value: r } of t.attributes) e.getAttribute(n) !== r && e.setAttribute(n, r);
		r(e, t);
	}
}, r = (e, t) => {
	let r = [...t.childNodes];
	for (; e.childNodes.length > r.length;) e.lastChild.remove();
	r.forEach((t, r) => {
		let i = e.childNodes[r];
		i ? n(i, t) : e.append(t);
	});
};
//#endregion
export { e as n, r, t };
