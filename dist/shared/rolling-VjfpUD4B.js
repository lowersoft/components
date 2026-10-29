//#region src/styles/rolling.scss?inline
var e = ".rolling{font-variant-numeric:tabular-nums;line-height:1.25em;display:inline-flex}.digit{height:1.25em;display:inline-block;overflow:hidden}.reel{flex-direction:column;display:flex}@media (prefers-reduced-motion:no-preference){.reel{transition:translate .3s var(--lw-ease-out)}}.count{border-radius:var(--lw-radius-full);background:color-mix(in oklab, var(--_fg) 10%, transparent);color:color-mix(in oklab, var(--_fg) 70%, transparent);font-size:var(--lw-text-xs);padding:.25rem .625rem;display:inline-flex}.count[hidden]{display:none}", t = `<span class="reel">${[..."0123456789"].map((e) => `<span>${e}</span>`).join("")}</span>`, n = (e, n) => {
	let r = [...n];
	for (; e.children.length > r.length;) e.firstElementChild.remove();
	for (; e.children.length < r.length;) e.prepend(document.createElement("span"));
	r.forEach((n, r) => {
		let i = e.children[r], a = n >= "0" && n <= "9";
		if (a !== i.classList.contains("digit")) {
			let e = document.createElement("span");
			a && Object.assign(e, {
				className: "digit",
				innerHTML: t
			}), i.replaceWith(e), i = e;
		}
		a ? i.firstChild.style.translate = `0 ${-Number(n) * 10}%` : i.textContent = n === " " ? "\xA0" : n;
	});
};
//#endregion
export { e as n, n as t };
