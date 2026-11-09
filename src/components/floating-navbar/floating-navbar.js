import '../button/index.js';
import '../hamburger-menu/index.js';
import '../switch-button/index.js';
import { LOWERSOFT, themedImage } from '../../core/brand.js';
import { escapeHtml } from '../../core/dom.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowUpRight, chevronDown } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './floating-navbar.scss?inline';

// Every link is a route of its own, never an anchor on one long page.
const DEMO_ITEMS = [
  {
    label: 'Products',
    featured: {
      label: 'lw components',
      description: 'Web components for any framework, themed with tokens and accessible from the start.',
      href: '/products/components',
      image: LOWERSOFT.mark,
    },
    links: [
      { label: 'LowerAuth', description: 'Sign-in, sessions and two-factor in one drop-in flow.', href: '/products/auth' },
      { label: 'LowerSync', description: 'Keeps every device up to date, even offline.', href: '/products/sync' },
      { label: 'LowerCloud', description: 'Deploys apps and databases close to your users.', href: '/products/cloud' },
    ],
  },
  {
    label: 'Support',
    links: [
      { label: 'Documentation', description: 'Guides, API reference and examples for every product.', href: '/docs' },
      { label: 'Report Issue', description: 'Found a bug? Tell us about it on GitHub.', href: 'https://github.com/lowersoft/components/issues/new', external: true },
      { label: 'Support Portal', description: 'Talk to our team about your account and plan.', href: '/support' },
      { label: 'FAQ', description: 'Quick answers to the questions we hear most.', href: '/faq' },
    ],
  },
  { label: 'LowerDB', href: '/lowerdb' },
];

// Hovering a trigger opens its menu after this long (ms), so a pointer only
// passing over does not; another opens at once while one is open, and for
// SKIP_DELAY after one closes.
const OPEN_DELAY = 200;
const SKIP_DELAY = 300;
// The pointer can leave the trigger and the menu for this long (ms), as it
// crosses the gap between them, before the menu closes.
const CLOSE_DELAY = 150;
// A click this soon (ms) after hovering opened the menu meant to open it,
// so it leaves the menu open.
const HOVER_CLICK_GRACE = 400;

const CHEVRON = `<span class="chevron" aria-hidden="true">${strokeIcon(chevronDown, 12, 2.25)}</span>`;
const EXTERNAL = `<span class="external" aria-hidden="true">${strokeIcon(arrowUpRight, 12)}</span><span class="visually-hidden">(opens in a new tab)</span>`;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const hasMenu = (item) => Boolean(item.featured || item.links?.length);
const linksOf = (item) => [item.featured, ...(item.links ?? [])].filter(Boolean);

const linkAttributes = (link) =>
  `href="${escapeHtml(link.href ?? '#')}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ''}`;

// A path without its trailing slash, for an internal href; null for another site's.
const pathOf = (href) => {
  try {
    const url = new URL(href, location.href);
    return url.origin === location.origin ? url.pathname.replace(/(.)\/$/, '$1') : null;
  } catch {
    return null;
  }
};

// The section a page is in: its own path, or one it sits under.
const inSection = (path, current) => path !== null && (path === current || (path !== '/' && current.startsWith(`${path}/`)));

const featureMarkup = (link) =>
  `<li class="feature-cell"><a class="feature" ${linkAttributes(link)}>${link.image ? `<img class="feature-image" src="${escapeHtml(link.image)}" alt="" decoding="async">` : ''}<span class="feature-title">${escapeHtml(link.label)}${link.external ? EXTERNAL : ''}</span>${link.description ? `<span class="feature-text">${escapeHtml(link.description)}</span>` : ''}</a></li>`;

const linkMarkup = (link) =>
  `<li><a class="link" ${linkAttributes(link)}><span class="link-title">${escapeHtml(link.label)}${link.external ? EXTERNAL : ''}</span>${link.description ? `<span class="link-text">${escapeHtml(link.description)}</span>` : ''}</a></li>`;

// A menu with a featured link puts it in a tall card beside the rest; one
// without lays its links out in two columns.
const panelMarkup = (item, index) => {
  const links = (item.links ?? []).map(linkMarkup).join('');
  const body = item.featured
    ? `<ul class="links" style="--rows: ${Math.max(1, item.links?.length ?? 0)}">${featureMarkup(item.featured)}${links}</ul>`
    : `<ul class="links">${links}</ul>`;
  return `<div class="content ${item.featured ? 'with-feature' : 'columns'}" id="panel-${index}" data-index="${index}" hidden>${body}</div>`;
};

const mobileMarkup = (item, index) => {
  if (!hasMenu(item)) return `<li><a class="m-link" ${linkAttributes(item)}>${escapeHtml(item.label)}</a></li>`;
  const links = linksOf(item)
    .map((link) => `<li><a class="m-sublink" ${linkAttributes(link)}>${escapeHtml(link.label)}${link.external ? EXTERNAL : ''}</a></li>`)
    .join('');
  return `<li class="m-group"><button class="m-link m-trigger" type="button" aria-expanded="false" aria-controls="m-panel-${index}"><span>${escapeHtml(item.label)}</span>${CHEVRON}</button><div class="m-panel" id="m-panel-${index}" inert><div class="m-clip"><ul class="m-sublist">${links}</ul></div></div></li>`;
};

/**
 * A site's navigation bar that floats at the top of the page in a double
 * frame of frosted glass: the brand, the main links and the actions. A link
 * with a menu opens it in one panel below the bar, which grows or shrinks
 * to fit the next menu while the menus slide past each other, and an arrow
 * on the panel follows the open trigger. A pill slides behind the link
 * under the pointer and rests on the open menu or the current page's link.
 *
 * Hovering a trigger opens its menu after a moment, and moving to another
 * switches at once; a click or Enter does it too. Tab goes from an open
 * trigger into its menu and on to the next link, the arrow keys move along
 * the bar and through a menu, and Escape closes it. On a narrow screen the
 * links fold into a menu button, with each menu as a list that opens in
 * place.
 *
 * Items are `{ label, href }` for a link, or `{ label, links, featured? }`
 * for a menu, whose links are `{ label, href, description?, external? }`
 * and whose featured link may also have an `image`. The link for the page
 * you are on is marked current, and its section gets the pill.
 *
 * @attr {Array<object>} items - The links and menus, in order (JSON)
 * @attr {string} current - Path of the page you are on; the address bar's by default
 * @attr {string} brand - The brand's name, read out for its logo
 * @attr {string} logo - The brand's wordmark, beside the mark; the name as text without one
 * @attr {string} logo-dark - The wordmark for a dark theme
 * @attr {string} mark - The brand's mark, before the wordmark; none when empty
 * @attr {string} action - The main action's label; none when empty
 * @attr {string} label - Accessible name of the navigation
 * @slot actions - Your own actions, such as links, instead of the theme switch and the button
 * @csspart frame - The bar's outer frame
 * @csspart bar - The row inside it
 * @csspart viewport - The panel the menus open in
 */
export class LwFloatingNavbar extends LwElement {
  static styles = styles;
  static props = {
    items: { type: Object, default: DEMO_ITEMS },
    current: { default: '' },
    brand: { default: LOWERSOFT.name },
    logo: { default: LOWERSOFT.wordmark.light },
    logoDark: { default: LOWERSOFT.wordmark.dark },
    mark: { default: LOWERSOFT.mark },
    action: { default: 'Get started' },
    label: { default: 'Main' },
  };

  // Index in `items` of the open menu, -1 when none is.
  #open = -1;
  #hovered = null;
  #openTimer = 0;
  #closeTimer = 0;
  #skipDelayUntil = 0;
  #hoverOpenedAt = -Infinity;
  // A menu closed by a click stays closed while the pointer stays on its trigger.
  #clickClosed = -1;

  render() {
    return `<div class="shell">
<div class="frame" part="frame"><div class="inner">
<div class="bar" part="bar">
<a class="brand" href="/"></a>
<nav class="nav"><ul class="list"></ul><span class="pill" aria-hidden="true"></span>
<div class="stage" hidden><span class="indicator" aria-hidden="true"><span class="arrow"></span></span><div class="bridge"><div class="viewport" part="viewport"></div></div></div>
</nav>
<div class="end"><slot name="actions"><lw-switch-button class="theme" variant="outline" icon-only dark-label="Dark theme"></lw-switch-button><lw-button class="cta"></lw-button></slot><lw-hamburger-menu class="burger" variant="duo" size="20" aria-controls="mobile"></lw-hamburger-menu></div>
</div>
<div class="mobile" id="mobile" inert><div class="m-clip"><nav class="m-nav"><ul class="m-list"></ul></nav><lw-button class="cta m-cta"></lw-button></div></div>
</div></div>
</div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const list = this.query('.list');
    const bridge = this.query('.bridge');
    const nav = this.query('.nav');

    list.addEventListener('pointerover', (event) => this.#pointerOver(event), options);
    list.addEventListener('pointerout', (event) => this.#pointerOut(event), options);
    list.addEventListener('pointerleave', () => this.#paintPill(null), options);
    list.addEventListener('click', (event) => this.#clickTrigger(event), options);
    list.addEventListener('keydown', (event) => this.#listKey(event), options);
    // Moving along the bar from the keyboard leaves the open menu behind.
    list.addEventListener('focusin', (event) => {
      const item = event.target.closest('.item');
      if (item && item !== this.#trigger(this.#open) && item.matches(':focus-visible')) this.#setOpen(-1);
    }, options);
    bridge.addEventListener('pointerenter', (event) => event.pointerType !== 'touch' && clearTimeout(this.#closeTimer), options);
    bridge.addEventListener('pointerleave', (event) => event.pointerType !== 'touch' && this.#closeSoon(), options);
    this.query('.viewport').addEventListener('keydown', (event) => this.#panelKey(event), options);
    // Following a link in the menu closes it.
    this.query('.viewport').addEventListener('click', (event) => event.target.closest('a') && this.#setOpen(-1), options);
    // Focus moving out of the bar's links and menus closes the menu; focus
    // lost to nothing (a click on the panel's padding) does not.
    nav.addEventListener('focusout', (event) => {
      if (event.relatedTarget && !nav.contains(event.relatedTarget)) this.#setOpen(-1);
    }, options);
    document.addEventListener('pointerdown', (event) => {
      if (!event.composedPath().includes(nav)) this.#setOpen(-1);
    }, options);

    const burger = this.query('.burger');
    burger.addEventListener('lw-change', (event) => this.#setMobile(event.detail.open), options);
    const mobile = this.query('.mobile');
    mobile.addEventListener('click', (event) => {
      const trigger = event.target.closest('.m-trigger');
      if (trigger) this.#toggleGroup(trigger);
      else if (event.target.closest('a')) burger.toggle(false);
    }, options);
    this.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !burger.open) return;
      burger.toggle(false);
      burger.focus();
    }, options);

    // Your own actions replace the button at the foot of the narrow menu too.
    const slot = this.query('slot[name=actions]');
    const actions = () => this.toggleAttribute('data-own-actions', slot.assignedNodes().length > 0);
    slot.addEventListener('slotchange', actions, options);
    actions();

    // The bar lifts off the page once it scrolls.
    const scrolled = () => this.toggleAttribute('data-scrolled', scrollY > 0);
    addEventListener('scroll', scrolled, { passive: true, signal: this.signal });
    scrolled();

    addEventListener('popstate', () => this.#paintCurrent(), options);

    // Whichever layout the width leaves out closes: the menus when the links
    // fold away, the narrow menu when they come back.
    const resize = new ResizeObserver(() => {
      const narrow = burger.checkVisibility();
      if (narrow) this.#setOpen(-1);
      else if (burger.open) burger.toggle(false);
      this.#paintPill();
      if (this.#open === -1) return;
      this.#size(this.query('.viewport'), this.#panel(this.#open), true);
      this.#placeIndicator(false);
    });
    resize.observe(this);
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      clearTimeout(this.#openTimer);
      clearTimeout(this.#closeTimer);
    });
  }

  updated(changed) {
    if (changed.has('items')) this.#build();
    if (changed.has('items') || changed.has('current')) this.#paintCurrent();
    if (['brand', 'logo', 'logoDark', 'mark'].some((name) => changed.has(name))) this.#paintBrand();
    if (changed.has('label')) {
      this.query('.nav').ariaLabel = this.label;
      this.query('.m-nav').ariaLabel = this.label;
    }
    if (changed.has('action')) {
      for (const button of this.shadowRoot.querySelectorAll('.cta')) {
        button.textContent = this.action ?? '';
        button.hidden = !this.action;
      }
    }
  }

  get #items() {
    return Array.isArray(this.items) ? this.items : [];
  }

  get #triggers() {
    return [...this.shadowRoot.querySelectorAll('.trigger')];
  }

  #trigger(index) {
    return this.query(`.trigger[data-index="${index}"]`);
  }

  #panel(index) {
    return this.query(`.content[data-index="${index}"]`);
  }

  #build() {
    this.#setOpen(-1, { instant: true });
    const items = this.#items;
    this.query('.list').innerHTML = items
      .map((item, index) =>
        hasMenu(item)
          ? `<li><button class="item trigger" type="button" id="trigger-${index}" data-index="${index}" aria-expanded="false" aria-controls="panel-${index}"><span>${escapeHtml(item.label)}</span>${CHEVRON}</button></li>`
          : `<li><a class="item" ${linkAttributes(item)} data-index="${index}">${escapeHtml(item.label)}</a></li>`,
      )
      .join('');
    this.query('.viewport').innerHTML = items.map((item, index) => (hasMenu(item) ? panelMarkup(item, index) : '')).join('');
    this.query('.m-list').innerHTML = items.map(mobileMarkup).join('');
  }

  #paintBrand() {
    const name = this.brand ?? '';
    const mark = this.mark ? `<img class="brand-mark" src="${escapeHtml(this.mark)}" alt="${this.logo ? '' : escapeHtml(name)}" decoding="async">` : '';
    const words = this.logo
      ? themedImage({ light: this.logo, dark: this.logoDark }, name, 'brand-logo')
      : `<span class="brand-name">${escapeHtml(name)}</span>`;
    const brand = this.query('.brand');
    brand.innerHTML = mark + words;
    // With the mark alone, its image names the link.
    if (this.mark && !this.logo) brand.querySelector('.brand-name')?.setAttribute('aria-hidden', 'true');
  }

  // Marks the links to the page you are on, and the item of its section.
  #paintCurrent() {
    const current = pathOf(this.current || location.pathname) ?? '';
    for (const link of this.shadowRoot.querySelectorAll('.viewport a, .list a, .mobile a')) {
      const path = pathOf(link.getAttribute('href'));
      if (path !== null && path === current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    this.#items.forEach((item, index) => {
      const section = [item, ...linksOf(item)].some((link) => link.href && inSection(pathOf(link.href), current));
      this.query(`.item[data-index="${index}"]`)?.toggleAttribute('data-current', section);
      this.query(`.m-trigger[aria-controls="m-panel-${index}"]`)?.toggleAttribute('data-current', section);
    });
    this.#paintPill();
  }

  // The pill sits behind the item under the pointer, else the open menu's
  // trigger, else the current section's item.
  #paintPill(hovered = this.#hovered) {
    this.#hovered = hovered;
    const pill = this.query('.pill');
    const target = hovered ?? this.#trigger(this.#open) ?? this.query('.item[data-current]');
    if (target && target.offsetParent) moveHighlight(pill, target);
    else hideHighlight(pill);
  }

  #pointerOver(event) {
    if (event.pointerType === 'touch') return;
    const item = event.target.closest('.item');
    if (!item || item.contains(event.relatedTarget)) return;
    this.#paintPill(item);
    if (!item.classList.contains('trigger')) return;
    const index = Number(item.dataset.index);
    clearTimeout(this.#closeTimer);
    clearTimeout(this.#openTimer);
    if (this.#clickClosed === index) return;
    if (this.#open !== -1 || performance.now() < this.#skipDelayUntil) this.#hoverOpen(index);
    else this.#openTimer = setTimeout(() => this.#hoverOpen(index), OPEN_DELAY);
  }

  #pointerOut(event) {
    if (event.pointerType === 'touch') return;
    const trigger = event.target.closest('.trigger');
    if (!trigger || trigger.contains(event.relatedTarget)) return;
    clearTimeout(this.#openTimer);
    if (this.#clickClosed === Number(trigger.dataset.index)) this.#clickClosed = -1;
    if (this.#open !== -1) this.#closeSoon();
  }

  #hoverOpen(index) {
    if (this.#open === index) return;
    if (this.#open === -1) this.#hoverOpenedAt = performance.now();
    this.#setOpen(index);
  }

  #closeSoon() {
    clearTimeout(this.#closeTimer);
    this.#closeTimer = setTimeout(() => this.#setOpen(-1), CLOSE_DELAY);
  }

  #clickTrigger(event) {
    const trigger = event.target.closest('.trigger');
    if (!trigger) return;
    const index = Number(trigger.dataset.index);
    clearTimeout(this.#openTimer);
    clearTimeout(this.#closeTimer);
    if (this.#open !== index) {
      this.#hoverOpenedAt = -Infinity;
      this.#setOpen(index);
    } else if (performance.now() - this.#hoverOpenedAt > HOVER_CLICK_GRACE) {
      this.#clickClosed = index;
      this.#setOpen(-1);
    }
  }

  /**
   * Opens the menu of item `index`, or closes the open one with -1. From
   * closed, the panel scales in at the new menu's size; between menus it
   * resizes while the old menu slides out to one side and the new one in
   * from the other, after the order of their triggers.
   */
  #setOpen(index, { instant = false } = {}) {
    clearTimeout(this.#openTimer);
    clearTimeout(this.#closeTimer);
    const previous = this.#open;
    if (index === previous) return;
    this.#open = index;
    const stage = this.query('.stage');
    const viewport = this.query('.viewport');

    for (const trigger of this.#triggers) trigger.ariaExpanded = String(Number(trigger.dataset.index) === index);

    if (index === -1) {
      this.#skipDelayUntil = performance.now() + SKIP_DELAY;
      this.#clickClosed = this.#clickClosed === previous ? previous : -1;
      stage.dataset.state = 'closed';
      const hide = () => {
        if (this.#open !== -1) return;
        stage.hidden = true;
        for (const panel of viewport.children) {
          panel.hidden = true;
          delete panel.dataset.motion;
        }
      };
      if (instant) hide();
      else this.#afterAnimations(stage, hide);
      this.#paintPill();
      return;
    }

    const panel = this.#panel(index);
    const opening = previous === -1 || stage.hidden;
    panel.hidden = false;

    if (opening) {
      for (const other of viewport.children) {
        if (other !== panel) other.hidden = true;
        delete other.dataset.motion;
      }
      stage.hidden = false;
      stage.dataset.state = 'open';
      this.#size(viewport, panel, true);
      this.#placeIndicator(false);
    } else {
      const forward = index > previous;
      const old = this.#panel(previous);
      if (old) {
        old.dataset.motion = forward ? 'to-start' : 'to-end';
        this.#afterAnimations(old, () => {
          if (this.#open === Number(old.dataset.index)) return;
          old.hidden = true;
          delete old.dataset.motion;
        });
      }
      panel.dataset.motion = forward ? 'from-end' : 'from-start';
      this.#afterAnimations(panel, () => {
        if (panel.dataset.motion?.startsWith('from')) delete panel.dataset.motion;
      });
      stage.dataset.state = 'open';
      this.#size(viewport, panel, false);
      this.#placeIndicator(true);
    }
    this.#paintPill();
  }

  // Fits the panel to `content`; at once when it first opens.
  #size(viewport, content, instant) {
    const apply = () => {
      viewport.style.setProperty('--_width', `${content.offsetWidth}px`);
      viewport.style.setProperty('--_height', `${content.offsetHeight}px`);
    };
    if (!instant) return apply();
    viewport.style.transition = 'none';
    apply();
    viewport.getBoundingClientRect();
    viewport.style.transition = '';
  }

  // Points the arrow at the open trigger, sliding there from the last one.
  #placeIndicator(slide) {
    const trigger = this.#trigger(this.#open);
    if (!trigger || !trigger.offsetParent) return;
    const indicator = this.query('.indicator');
    if (!slide) indicator.style.transition = 'none';
    indicator.style.translate = `${trigger.offsetLeft + trigger.offsetWidth / 2}px 0`;
    if (!slide) {
      indicator.getBoundingClientRect();
      indicator.style.transition = '';
    }
  }

  // Runs `done` once the animations running on `element` end; at once with
  // none (reduced motion), and not at all when another state replaces them.
  #afterAnimations(element, done) {
    const animations = element.getAnimations({ subtree: true }).filter((animation) => animation instanceof CSSAnimation);
    if (!animations.length) return done();
    Promise.all(animations.map((animation) => animation.finished)).then(done, () => {});
  }

  #focusables(root) {
    return [...root.querySelectorAll(FOCUSABLE)];
  }

  #listKey(event) {
    const item = event.target.closest('.item');
    if (!item) return;
    const items = [...this.shadowRoot.querySelectorAll('.list .item')];
    const at = items.indexOf(item);
    const isTrigger = item.classList.contains('trigger');
    const index = Number(item.dataset.index);
    const move = { ArrowLeft: at - 1, ArrowRight: at + 1, Home: 0, End: items.length - 1 }[event.key];
    if (move !== undefined) {
      event.preventDefault();
      items[(move + items.length) % items.length].focus();
      return;
    }
    if (event.key === 'Escape' && this.#open !== -1) {
      event.preventDefault();
      const open = this.#trigger(this.#open);
      this.#setOpen(-1);
      open?.focus();
      return;
    }
    if (!isTrigger) return;
    // Down opens the menu and goes into it, as Tab does from an open trigger.
    if (event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey && this.#open === index)) {
      event.preventDefault();
      if (this.#open !== index) this.#setOpen(index);
      this.#focusables(this.#panel(index))[0]?.focus();
    }
  }

  #panelKey(event) {
    const panel = event.target.closest('.content');
    if (!panel) return;
    const index = Number(panel.dataset.index);
    const links = this.#focusables(panel);
    const at = links.indexOf(event.target.closest(FOCUSABLE));
    const trigger = this.#trigger(index);
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#setOpen(-1);
      trigger?.focus();
      return;
    }
    const move = { ArrowDown: at + 1, ArrowRight: at + 1, ArrowUp: at - 1, ArrowLeft: at - 1, Home: 0, End: links.length - 1 }[event.key];
    if (move !== undefined) {
      event.preventDefault();
      if (move < 0) trigger?.focus();
      else links[Math.min(move, links.length - 1)].focus();
      return;
    }
    if (event.key !== 'Tab') return;
    // Out of the menu, Tab carries on from its trigger: back to the
    // trigger, or on to the next link on the bar.
    if (event.shiftKey && at === 0) {
      event.preventDefault();
      trigger?.focus();
    } else if (!event.shiftKey && at === links.length - 1) {
      const next = trigger?.closest('li').nextElementSibling?.querySelector('.item');
      if (next) {
        event.preventDefault();
        next.focus();
      }
    }
  }

  #setMobile(open) {
    const mobile = this.query('.mobile');
    mobile.toggleAttribute('data-open', open);
    mobile.inert = !open;
    if (!open) for (const trigger of mobile.querySelectorAll('.m-trigger[aria-expanded="true"]')) this.#toggleGroup(trigger, false);
  }

  #toggleGroup(trigger, open = trigger.ariaExpanded !== 'true') {
    trigger.ariaExpanded = String(open);
    const panel = this.query(`#${trigger.getAttribute('aria-controls')}`);
    panel.toggleAttribute('data-open', open);
    panel.inert = !open;
  }
}
