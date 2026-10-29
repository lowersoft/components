import { escapeHtml } from './dom.js';

// Shared markup of the footer components; style it with the `footer-base` mixin.

/** The brand: a letter tile and the name, linking home. */
export const brandMarkup = (brand, href = '/') =>
  `<a class="brand" href="${escapeHtml(href)}"><span class="brand-tile" aria-hidden="true">${escapeHtml((brand ?? '').charAt(0).toUpperCase())}</span><span class="brand-name">${escapeHtml(brand ?? '')}</span></a>`;

/** A link, with its badge when it has one: `{ label, href?, badge? }`. */
export const footerLink = (link) =>
  `<a class="link" href="${escapeHtml(link.href ?? '#')}"><span class="link-label">${escapeHtml(link.label)}</span>${link.badge ? `<span class="badge">${escapeHtml(link.badge)}</span>` : ''}</a>`;

/** Titled columns of links: `[{ title, links: [{ label, href?, badge? }] }]`. */
export const linkColumns = (columns) =>
  (columns ?? [])
    .map((column) => `<nav class="column" aria-label="${escapeHtml(column.title)}"><h2 class="column-title">${escapeHtml(column.title)}</h2><ul class="links">${column.links.map((link) => `<li>${footerLink(link)}</li>`).join('')}</ul></nav>`)
    .join('');
