// For contexts that refuse the Clipboard API, such as iframes without
// `allow="clipboard-write"`: copy through a selected, off-screen field.
const legacyCopy = (text) => {
  // The deepest focused element: the document only sees the outermost shadow host.
  let previous = document.activeElement;
  while (previous?.shadowRoot?.activeElement) previous = previous.shadowRoot.activeElement;
  const field = Object.assign(document.createElement('textarea'), { value: text, readOnly: true });
  field.style.cssText = 'position: fixed; opacity: 0; pointer-events: none';
  document.body.append(field);
  field.select();
  const copied = document.execCommand('copy');
  field.remove();
  previous?.focus({ preventScroll: true });
  if (!copied) throw new Error('Copy was refused');
};

/** Copy text, falling back to the legacy path where the Clipboard API is refused. */
export const writeClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    legacyCopy(text);
  }
};
