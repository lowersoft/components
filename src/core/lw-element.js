import { PREFIX } from './config.js';
import { adoptStyles } from './styles.js';

const VALUES = Symbol('values');
const ATTRS = Symbol('attrs');

const toAttribute = (prop) => prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

// Props of type Object (arrays included) take JSON in their attribute.
const fromAttribute = (type, value) => {
  if (type === Boolean) return value !== null;
  if (value === null) return undefined;
  if (type === Number) return Number(value);
  return type === Object ? JSON.parse(value) : value;
};

/** Install accessors for `static props` once per class; returns the observed attribute names. */
const setupProps = (ctor) => {
  if (Object.hasOwn(ctor, ATTRS)) return [...ctor[ATTRS].keys()];
  const attrs = new Map();

  for (const [name, { type = String, reflect = false, default: fallback }] of Object.entries(ctor.props)) {
    const attr = toAttribute(name);
    attrs.set(attr, { name, type });

    Object.defineProperty(ctor.prototype, name, {
      configurable: true,
      get() {
        return this[VALUES].get(name) ?? fallback;
      },
      set(value) {
        if (!reflect) return this.setValue(name, value);
        if (type === Boolean) this.toggleAttribute(attr, Boolean(value));
        else if (value == null) this.removeAttribute(attr);
        else this.setAttribute(attr, value);
      },
    });
  }

  ctor[ATTRS] = attrs;
  return [...attrs.keys()];
};

/**
 * Base class for every lw component.
 *
 * Subclasses declare `static styles` (compiled CSS string), `static props`
 * and implement `render()` (called once) plus optional `connected()` and
 * `updated(changed)` hooks. Prop changes are batched into one `updated()`
 * call per microtask, so DOM is patched instead of re-rendered.
 */
export class LwElement extends HTMLElement {
  /** Compiled CSS string, or an array of them to extend a parent's styles. */
  static styles = '';
  static props = {};
  static shadowOptions = { mode: 'open' };

  static get observedAttributes() {
    return setupProps(this);
  }

  [VALUES] = new Map();
  #changed = new Set();
  #rendered = false;
  #abort = null;

  constructor() {
    super();
    adoptStyles(this.attachShadow(this.constructor.shadowOptions), this.constructor);
  }

  connectedCallback() {
    this.#abort = new AbortController();
    if (!this.#rendered) {
      this.#upgradeProps();
      this.shadowRoot.innerHTML = this.render();
      this.#rendered = true;
      this.#changed = new Set(Object.keys(this.constructor.props));
    }
    this.connected();
    this.#flush();
  }

  disconnectedCallback() {
    this.#abort.abort();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    const { name, type } = this.constructor[ATTRS].get(attr);
    this.setValue(name, fromAttribute(type, newValue));
  }

  /** Aborted on disconnect. Pass to `addEventListener` and animations for automatic cleanup. */
  get signal() {
    return this.#abort.signal;
  }

  /** Store a prop value without touching attributes and schedule an update. */
  setValue(name, value) {
    if (this[VALUES].get(name) === value) return;
    this[VALUES].set(name, value);
    if (this.#changed.size === 0 && this.#rendered) queueMicrotask(() => this.#flush());
    this.#changed.add(name);
  }

  /** Shadow DOM `querySelector` shortcut. */
  query(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  /** Dispatch a `${PREFIX}-${name}` event that crosses shadow boundaries. Returns false if cancelled. */
  emit(name, detail) {
    return this.dispatchEvent(
      new CustomEvent(`${PREFIX}-${name}`, { detail, bubbles: true, composed: true, cancelable: true }),
    );
  }

  /** Return the static shadow DOM markup. Called once. */
  render() {
    return '<slot></slot>';
  }

  /** Called on every connect, after the first render. Bind listeners with `this.signal`. */
  connected() {}

  /** Called with the set of prop names that changed since the last update. */
  updated(changed) {}

  #flush() {
    if (this.#changed.size === 0 || !this.isConnected) return;
    const changed = this.#changed;
    this.#changed = new Set();
    this.updated(changed);
  }

  // Props assigned before the element upgraded shadow the accessors; re-route them.
  #upgradeProps() {
    for (const name of Object.keys(this.constructor.props)) {
      if (!Object.hasOwn(this, name)) continue;
      const value = this[name];
      delete this[name];
      this[name] = value;
    }
  }
}
