//#region src/core/form.js
var e = Symbol("internals"), t = (t) => class extends t {
	static formAssociated = !0;
	[e] = this.attachInternals();
	get form() {
		return this[e].form;
	}
	get validity() {
		return this[e].validity;
	}
	get validationMessage() {
		return this[e].validationMessage;
	}
	get willValidate() {
		return this[e].willValidate;
	}
	checkValidity() {
		return this[e].checkValidity();
	}
	reportValidity() {
		return this[e].reportValidity();
	}
};
//#endregion
export { e as n, t };
