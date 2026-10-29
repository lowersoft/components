//#region src/core/people.js
var e = (e) => e.split(" ").filter(Boolean).slice(0, 2).map((e) => e.charAt(0).toUpperCase()).join(""), t = (e) => {
	let t = 0;
	for (let n of e) t = (t * 31 + n.codePointAt(0)) % 36e5;
	return t % 360;
};
//#endregion
export { e as n, t };
