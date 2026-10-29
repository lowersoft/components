/** True when a keyboard event comes from a text field, so global shortcuts should not act. */
export const isTyping = (event) => {
  const target = event.composedPath()[0];
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
};

/** Escapes text for use inside markup or a quoted attribute. */
export const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Updates `target` in place to match `source`, reusing the nodes that stay,
 * so focus, transitions and running animations survive a re-render.
 */
export const morph = (target, source) => {
  if (target.nodeType !== source.nodeType || target.nodeName !== source.nodeName) {
    target.replaceWith(source);
    return;
  }
  if (target.nodeType !== Node.ELEMENT_NODE) {
    if (target.nodeValue !== source.nodeValue) target.nodeValue = source.nodeValue;
    return;
  }
  for (const { name } of [...target.attributes]) if (!source.hasAttribute(name)) target.removeAttribute(name);
  for (const { name, value } of source.attributes) if (target.getAttribute(name) !== value) target.setAttribute(name, value);
  morphChildren(target, source);
};

/** `morph()` for the children of `target` only. */
export const morphChildren = (target, source) => {
  const next = [...source.childNodes];
  while (target.childNodes.length > next.length) target.lastChild.remove();
  next.forEach((node, i) => {
    const current = target.childNodes[i];
    if (current) morph(current, node);
    else target.append(node);
  });
};
