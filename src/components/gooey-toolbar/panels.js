import { strokeIcon } from '../../core/icons.js';
import { codeXml, fileText, frame, image, layers, link2 as link, search, square, stickyNote, type } from '../../core/lucide.js';

// The demo canvas tools and the panels they open when nothing is slotted
// in. Every panel sets its own width, so the liquid reshapes between them.

export const DEMO_ITEMS = [
  { id: 'insert', label: 'Insert', icon: 'plus' },
  { id: 'color', label: 'Color', icon: 'palette' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'comments', label: 'Comments', icon: 'messageCircle', badge: true },
  { id: 'share', label: 'Share', icon: 'userPlus' },
];

const head = (title, aside = '') => `<p class="demo-head"><span>${title}</span>${aside}</p>`;

const INSERTS = [
  ['Text', type],
  ['Image', image],
  ['Shape', square],
  ['Frame', frame],
  ['Sticky', stickyNote],
  ['Embed', codeXml],
];

const SWATCHES = ['#18181b', '#71717a', '#d4d4d8', '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'];

const LAYERS = [
  ['Hero section', layers, 'Home'],
  ['Pricing table', square, 'Pricing'],
  ['Changelog list', fileText, 'Updates'],
  ['Footer links', link, 'Home'],
];

const COMMENTS = [
  ['Ana Ruiz', 'AR', 220, '4m', 'Can the headline sit one line higher?', true],
  ['Theo Park', 'TP', 150, '22m', 'Swapped the pricing copy for the new plans.', true],
  ['Sam Okafor', 'SO', 30, '1h', 'Footer links point at the new docs now.', false],
];

const PANELS = {
  insert: () =>
    `<div class="demo" style="width: 17.5rem">${head('Insert', '<kbd class="demo-key">/</kbd>')}<div class="demo-grid">${INSERTS.map(([name, icon]) => `<button class="demo-tile" type="button">${strokeIcon(icon, 18, 1.75)}<span>${name}</span></button>`).join('')}</div></div>`,
  color: () =>
    `<div class="demo" style="width: 16.5rem">${head('Fill', '<span class="demo-aside">#3b82f6</span>')}<div class="demo-swatches">${SWATCHES.map((color) => `<button class="demo-swatch" type="button" style="--_swatch: ${color}" aria-label="${color}" aria-pressed="${color === '#3b82f6'}"></button>`).join('')}</div></div>`,
  search: () =>
    `<div class="demo" style="width: 19rem"><label class="demo-search">${strokeIcon(search, 16, 1.75)}<input type="search" placeholder="Jump to a layer" aria-label="Jump to a layer"></label><ul class="demo-list">${LAYERS.map(([name, icon, page], i) => `<li><button class="demo-row" type="button"${i === 0 ? ' data-current' : ''}>${strokeIcon(icon, 16, 1.75)}<span>${name}</span><span class="demo-aside">${page}</span></button></li>`).join('')}</ul></div>`,
  comments: () =>
    `<div class="demo" style="width: 19.5rem">${head('Comments', '<span class="demo-pill">2 new</span>')}<ul class="demo-list">${COMMENTS.map(([name, initials, hue, ago, text, unread]) => `<li class="demo-comment"><span class="demo-avatar" style="--_hue: ${hue}">${initials}</span><span class="demo-comment-text"><span class="demo-comment-head"><b>${name}</b><span class="demo-aside">${ago}</span></span><span class="demo-quote">${text}</span></span>${unread ? '<span class="demo-unread" aria-label="Unread"></span>' : ''}</li>`).join('')}</ul></div>`,
  share: () =>
    `<div class="demo" style="width: 18.5rem">${head('Share this canvas')}<div class="demo-invite"><input type="email" placeholder="name@company.com" aria-label="Email to invite"><button class="demo-primary" type="button">Invite</button></div><button class="demo-row demo-link" type="button">${strokeIcon(link, 16, 1.75)}<span>Copy link</span><span class="demo-aside">Anyone with it can view</span></button></div>`,
};

/** The built-in panel for a demo tool, or nothing for any other id. */
export const demoPanel = (id) => PANELS[id]?.() ?? '';
