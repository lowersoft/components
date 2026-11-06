import { escapeHtml } from './dom.js';
import { strokeIcon } from './icons.js';
import * as lucide from './lucide.js';

// Shared markup of the footer components; style it with the `footer-base` mixin.

/** The brand: a letter tile and the name, linking home. */
export const brandMarkup = (brand, href = '/') =>
  `<a class="brand" href="${escapeHtml(href)}"><span class="brand-tile" aria-hidden="true">${escapeHtml((brand ?? '').charAt(0).toUpperCase())}</span><span class="brand-name">${escapeHtml(brand ?? '')}</span></a>`;

/**
 * A link, with its badge when it has one: `{ label, href?, badge?, external? }`.
 * An external link opens in a new tab and says so.
 */
export const footerLink = (link) =>
  `<a class="link" href="${escapeHtml(link.href ?? '#')}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ''}><span class="link-label">${escapeHtml(link.label)}</span>${link.badge ? `<span class="badge">${escapeHtml(link.badge)}</span>` : ''}${link.external ? `<span class="external" aria-hidden="true">${strokeIcon(lucide.arrowUpRight, 12)}</span><span class="visually-hidden">(opens in a new tab)</span>` : ''}</a>`;

/** Titled columns of links: `[{ title, links: [{ label, href?, badge?, external? }] }]`. */
export const linkColumns = (columns) =>
  (columns ?? [])
    .map((column) => `<nav class="column" aria-label="${escapeHtml(column.title)}"><h2 class="column-title">${escapeHtml(column.title)}</h2><ul class="links">${column.links.map((link) => `<li>${footerLink(link)}</li>`).join('')}</ul></nav>`)
    .join('');

/** A social link's icon: a Lucide name from `core/lucide.js`, or `<svg>` markup as it is. */
export const socialIcon = (icon, size = 16) => {
  if (!icon) return '';
  if (String(icon).trim().startsWith('<svg')) return icon;
  return strokeIcon(lucide[icon] ?? lucide.link2, size);
};

/** Social links as list items, each an icon named by its label: `[{ label, href?, icon }]`. */
export const socialLinks = (socials, size = 16) =>
  (Array.isArray(socials) ? socials : [])
    .map((social) => `<li><a class="social" href="${escapeHtml(social.href ?? '#')}" aria-label="${escapeHtml(social.label)}" title="${escapeHtml(social.label)}">${socialIcon(social.icon, size)}</a></li>`)
    .join('');

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Wires a sign-up form of an `lw-text-input` and an `lw-button`: the button
 * or Enter checks the address, waits on `send(email)` with the button
 * loading, shows a failure's message on the field, and hands the address
 * to `done` once it went through. It sends once; later submits do nothing.
 */
export const wireSignup = (form, { input, button, send, done }, signal) => {
  let sent = false;
  const submit = async () => {
    if (sent) return;
    const email = (input.value ?? '').trim();
    if (!EMAIL.test(email)) {
      input.error = email ? 'That address looks incomplete.' : 'Enter your email to subscribe.';
      input.focus();
      return;
    }
    input.error = '';
    button.loading = true;
    try {
      await send?.(email);
    } catch (error) {
      input.error = error?.message || 'That did not go through. Try again.';
      return;
    } finally {
      button.loading = false;
    }
    sent = true;
    done(email);
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submit();
  }, { signal });
  // The field's input lives in its own shadow root, out of the form's reach for Enter.
  input.addEventListener('keydown', (event) => event.key === 'Enter' && (event.preventDefault(), submit()), { signal });
};
