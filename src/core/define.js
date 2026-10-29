import { PREFIX } from './config.js';
import { installTheme } from './styles.js';

/**
 * Register a component as `<${PREFIX}-${name}>`. Safe to call repeatedly,
 * so multiple bundles can import the same component.
 */
export const define = (name, ctor) => {
  const tag = `${PREFIX}-${name}`;
  if (!customElements.get(tag)) {
    installTheme();
    customElements.define(tag, ctor);
  }
  return tag;
};
