import { escapeHtml } from './dom.js';
import { strokeIcon } from './icons.js';
import { arrowUpRight } from './lucide.js';

// Shared markup of the footer components; style it with the `footer-base` mixin.

/** The brand: a letter tile and the name, linking home. */
export const brandMarkup = (brand, href = '/') =>
  `<a class="brand" href="${escapeHtml(href)}"><span class="brand-tile" aria-hidden="true">${escapeHtml((brand ?? '').charAt(0).toUpperCase())}</span><span class="brand-name">${escapeHtml(brand ?? '')}</span></a>`;

/**
 * A link, with its badge when it has one: `{ label, href?, badge?, external? }`.
 * An external link opens in a new tab and says so.
 */
export const footerLink = (link) =>
  `<a class="link" href="${escapeHtml(link.href ?? '#')}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ''}><span class="link-label">${escapeHtml(link.label)}</span>${link.badge ? `<span class="badge">${escapeHtml(link.badge)}</span>` : ''}${link.external ? `<span class="external" aria-hidden="true">${strokeIcon(arrowUpRight, 12)}</span><span class="visually-hidden">(opens in a new tab)</span>` : ''}</a>`;

/** Titled columns of links: `[{ title, links: [{ label, href?, badge?, external? }] }]`. */
export const linkColumns = (columns) =>
  (columns ?? [])
    .map((column) => `<nav class="column" aria-label="${escapeHtml(column.title)}"><h2 class="column-title">${escapeHtml(column.title)}</h2><ul class="links">${column.links.map((link) => `<li>${footerLink(link)}</li>`).join('')}</ul></nav>`)
    .join('');
