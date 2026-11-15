// Which page a link leads to, for marking the links to the page you are on.

/** A path without its trailing slash, for an internal href; null for another site's. */
export const pathOf = (href) => {
  try {
    const url = new URL(href, location.href);
    return url.origin === location.origin ? url.pathname.replace(/(.)\/$/, '$1') : null;
  } catch {
    return null;
  }
};

/** The section a page is in: its own path, or one it sits under. */
export const inSection = (path, current) => path !== null && (path === current || (path !== '/' && current.startsWith(`${path}/`)));
