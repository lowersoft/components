import { t as e } from "./platform-CKi8k97Y.js";
//#region src/core/shortcut.js
var t = [
	"mod",
	"ctrl",
	"alt",
	"shift"
], n = e ? {
	mod: "⌘",
	ctrl: "⌃",
	alt: "⌥",
	shift: "⇧"
} : {
	mod: "Ctrl",
	ctrl: "Ctrl",
	alt: "Alt",
	shift: "Shift"
}, r = {
	mod: e ? "Meta" : "Control",
	ctrl: "Control",
	alt: "Alt",
	shift: "Shift"
}, i = {
	enter: "↵",
	space: "Space",
	up: "↑",
	down: "↓",
	left: "←",
	right: "→",
	backspace: "⌫",
	delete: "Del",
	tab: "Tab",
	escape: "Esc"
}, a = {
	enter: "Enter",
	space: "Space",
	up: "ArrowUp",
	down: "ArrowDown",
	left: "ArrowLeft",
	right: "ArrowRight",
	backspace: "Backspace",
	delete: "Delete",
	tab: "Tab",
	escape: "Escape"
}, o = (e, t) => t[e] ?? (e.length === 1 || /^f\d+$/.test(e) ? e.toUpperCase() : e), s = (e) => {
	let s = e.toLowerCase().split("+").map((e) => e.trim()).filter(Boolean), c = t.filter((e) => s.includes(e)), l = s.find((e) => !t.includes(e)) ?? "";
	return {
		modifiers: c,
		key: l,
		labels: [...c.map((e) => n[e]), o(l, i)],
		aria: [...c.map((e) => r[e]), o(l, a)].join("+"),
		allowedWhileTyping: c.some((e) => e !== "shift")
	};
}, c = (e, t) => t === "space" ? e.code === "Space" : e.key.toLowerCase() === t || e.code === `Key${t.toUpperCase()}` || e.code === `Digit${t}`, l = (t, n) => ({
	mod: e ? n.metaKey : n.ctrlKey,
	ctrl: n.ctrlKey,
	alt: n.altKey,
	shift: n.shiftKey
})[t], u = (t, { modifiers: n, key: r }) => {
	let i = (e) => n.includes(e);
	return c(t, r) && t.metaKey === (i("mod") && e) && t.ctrlKey === (i("ctrl") || i("mod") && !e) && t.altKey === i("alt") && t.shiftKey === i("shift");
}, d = {
	Space: "space",
	Enter: "enter",
	Backspace: "backspace",
	Delete: "delete",
	Tab: "tab",
	Escape: "escape",
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "left",
	ArrowRight: "right",
	Slash: "/",
	Backslash: "\\",
	Comma: ",",
	Period: ".",
	Semicolon: ";",
	Quote: "'",
	BracketLeft: "[",
	BracketRight: "]",
	Minus: "-",
	Equal: "=",
	Backquote: "`"
}, f = (n) => t.filter((t) => t !== "ctrl" || e).filter((e) => l(e, n)), p = (e) => {
	let { code: t } = e, n = d[t];
	return !n && /^Key[A-Z]$/.test(t) && (n = t.slice(3).toLowerCase()), !n && /^Digit\d$/.test(t) && (n = t.slice(5)), !n && /^F\d{1,2}$/.test(t) && (n = t.toLowerCase()), n ? [...f(e), n].join("+") : null;
}, m = (e) => e.map((e) => n[e]);
//#endregion
export { m as a, u as i, c as n, s as o, l as r, p as s, f as t };
