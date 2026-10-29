/** The element's `ElementInternals`, kept off its public surface. */
export const INTERNALS = Symbol('internals');

/**
 * Makes an element a form control: form-associated, with its internals at
 * `this[INTERNALS]` and the validation API of a native control on it, so
 * `form`, `validity`, `checkValidity()` and the rest work as on an `<input>`.
 */
export const FormControl = (Base) =>
  class extends Base {
    static formAssociated = true;

    [INTERNALS] = this.attachInternals();

    get form() {
      return this[INTERNALS].form;
    }

    get validity() {
      return this[INTERNALS].validity;
    }

    get validationMessage() {
      return this[INTERNALS].validationMessage;
    }

    get willValidate() {
      return this[INTERNALS].willValidate;
    }

    checkValidity() {
      return this[INTERNALS].checkValidity();
    }

    reportValidity() {
      return this[INTERNALS].reportValidity();
    }
  };
