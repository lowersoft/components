import { n as e } from "./motion-CFWhFfc_.js";
//#region src/styles/morph.scss?inline
var t = ":host{width:var(--_idle-width,auto);height:2.25rem;font-size:var(--lw-text-sm);vertical-align:top;display:inline-block;position:relative}[hidden]{display:none!important}.shell{z-index:20;border:1px solid var(--lw-color-border);border-radius:var(--lw-radius-md);background:var(--lw-color-background);box-shadow:var(--lw-shadow-sm);color:var(--lw-color-foreground);top:0;left:0;overflow:hidden}@media (prefers-reduced-motion:no-preference){.shell{transition:border-radius .42s var(--lw-ease-out), box-shadow .3s var(--lw-ease-out)}}:host([status]:not([status=idle])) .shell,.shell.floating{position:absolute}:host([align=end]) .shell{left:auto;right:0}.leaving{position:absolute;top:0;left:0}.live{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}", n = 420, r = "cubic-bezier(0.32, 1.18, 0.5, 1)", i = 100, a = ({ host: t, shell: a, parts: o, visible: s, opening: c, closing: l, animate: u, isClosed: d, enter: f }) => {
	l && a.classList.add("floating");
	let p = a.getBoundingClientRect();
	for (let e of a.getAnimations()) e instanceof CSSTransition || e.cancel();
	c && t.style.setProperty("--_idle-width", `${p.width}px`);
	let m = [], h = [];
	for (let [e, t] of Object.entries(o)) {
		let n = s.includes(e);
		n && t.hidden && m.push(t), !n && !t.hidden && h.push(t), t.getAnimations().forEach((e) => e.cancel()), t.classList.remove("leaving"), t.hidden = !n;
	}
	let g = a.getBoundingClientRect(), _ = () => {
		d() && (a.classList.remove("floating"), t.style.removeProperty("--_idle-width"));
	};
	if (!u || e.matches) return _();
	a.animate({
		width: [`${p.width}px`, `${g.width}px`],
		height: [`${p.height}px`, `${g.height}px`]
	}, {
		duration: n,
		easing: r
	}).finished.then(_, () => {});
	for (let e of h) e.hidden = !1, e.classList.add("leaving"), e.animate({ opacity: [1, 0] }, { duration: i }).finished.then(() => {
		e.hidden = !0, e.classList.remove("leaving");
	}, () => {});
	for (let e of m) e.animate(...f(e));
};
//#endregion
export { t as n, a as t };
