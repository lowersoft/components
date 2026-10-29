/** Serialize story args into an HTML attribute string. `false`/empty values are omitted. */
export const attributes = (args) =>
  Object.entries(args)
    .filter(([, value]) => value !== false && value !== '' && value != null)
    // Quotes are escaped, so JSON values survive as attributes.
    .map(([name, value]) => (value === true ? name : `${name}="${String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`))
    .join(' ');
