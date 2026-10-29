import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion, springFeel } from '../../core/motion.js';
import styles from './morphic-navbar.scss?inline';

// The demo links to in-page anchors so it never navigates away. Use route
// paths ("/", "/work", ...) in a real app.
const DEMO_ITEMS = [
  { href: '#home', label: 'Home' },
  { href: '#work', label: 'Work' },
  { href: '#notes', label: 'Notes' },
  { href: '#blog', label: 'Blog' },
  { href: '#about', label: 'About' },
];

// Gap opened on each side of the active link, and around a hovered one, in px.
const SPLIT = 8;
const HOVER_SPLIT = 2;
// Movement before a press turns into a scrub, in px.
const DRAG_SLOP = 4;
// Seconds of release velocity added to where a flick lands.
const PROJECTION = 0.16;
// Pointer samples older than this (ms) do not count toward release velocity.
const VELOCITY_WINDOW = 90;
// Page scroll past which `compact` folds the bar, in px.
const COMPACT_AFTER = 80;
const CHEVRON_SIZE = 36;
const CHEVRON_GAP = 4;
const SPRING = springFeel(0.32, 0.15);
const SPRING_STEP = 1 / 240;

const KEY_MOVES = {
  ArrowLeft: (i) => i - 1,
  ArrowRight: (i) => i + 1,
  Home: () => 0,
  End: (_, n) => n - 1,
};

const round2 = (value) => Math.round(value * 100) / 100;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const matchesPath = (path, current) => path === current || (path !== '/' && current.startsWith(`${path}/`));

// The longest item path that matches, so "/docs/a" beats "/docs".
const findIndex = (paths, current) => {
  let best = -1;
  paths.forEach((path, i) => {
    if (current && matchesPath(path, current) && (best < 0 || path.length > paths[best].length)) best = i;
  });
  return best;
};

// How much link `k` is "the split one" when the split sits at `focus`.
const bump = (focus, k) => Math.max(0, 1 - Math.abs(focus - k));

// x offset of every link for a split centred on `focus`, which may be
// fractional while scrubbing. Centred so the bar grows evenly on both sides.
const splitOffsets = (count, focus, hover) => {
  const cumulative = [0];
  let total = 0;
  for (let joint = 0; joint < count - 1; joint++) {
    let gap = SPLIT * Math.max(bump(focus, joint), bump(focus, joint + 1));
    if (hover !== null && hover !== Math.round(focus) && (joint === hover - 1 || joint === hover)) {
      gap = Math.max(gap, HOVER_SPLIT);
    }
    total += gap;
    cumulative.push(total);
  }
  return cumulative.map((x) => round2(x - total / 2));
};

// Folded: the active link slides to the middle with the chevron beside it,
// the rest tuck in behind it.
const foldedOffsets = ({ centers, widths, rowWidth }, active) => {
  const activeWidth = widths[active] ?? 0;
  const activeCenter = rowWidth / 2 - (activeWidth + CHEVRON_GAP + CHEVRON_SIZE) / 2 + activeWidth / 2;
  return {
    xs: centers.map((center) => round2(activeCenter - center)),
    chevron: round2(activeCenter + activeWidth / 2 + CHEVRON_GAP + CHEVRON_SIZE / 2),
  };
};

// Fractional link index under a row-local x, from the links' centres.
const indexAt = (centers, x) => {
  const last = centers.length - 1;
  if (last <= 0 || x <= centers[0]) return 0;
  for (let k = 0; k < last; k++) {
    if (x < centers[k + 1]) return k + (x - centers[k]) / Math.max(1, centers[k + 1] - centers[k]);
  }
  return last;
};

const releaseVelocity = (samples, now) => {
  const recent = samples.filter((sample) => now - sample.t <= VELOCITY_WINDOW);
  const first = recent[0];
  const last = recent.at(-1);
  if (!first || last.t === first.t) return 0;
  return ((last.x - first.x) / (last.t - first.t)) * 1000;
};

// A square patch that hides a rounded corner while the neighbour touches.
const capScale = (gap, fold) => `scaleX(${round2(clamp(1 - gap / 1.5, 0, 1) * (1 - clamp(fold * 4, 0, 1)))})`;

/**
 * A navigation bar that splits around the active link. Drag across it to
 * scrub the split, flick to throw it further, and with `compact` it folds
 * down to the active link and a chevron once the page scrolls. The arrow
 * keys, Home and End move between links.
 *
 * Items are `{ href, label }`. In-page anchors ("#work") scroll to their
 * target; any other href navigates as a normal link.
 *
 * @attr {Array<{href: string, label: string}>} items - The links, in order (JSON)
 * @attr {string} value - The active link's href; defaults to the one matching the page, else the first
 * @attr {boolean} compact - Fold after 80px of page scroll
 * @attr {string} label - Accessible name of the navigation
 * @fires lw-change - The active link changed; `detail: { href, index }`
 * @csspart nav
 * @csspart link
 * @cssprop --lw-navbar-mark - Colour of the active link's mark
 */
export class LwMorphicNavbar extends LwElement {
  static styles = styles;
  static props = {
    items: { type: Object, default: DEMO_ITEMS },
    value: { default: '' },
    compact: { type: Boolean, reflect: true },
    label: { default: 'Main' },
  };

  // Where a scrub or keyboard focus has moved the split, before committing.
  #preview = null;
  #hover = null;
  #keyboardInside = false;
  #drag = null;
  #suppressClick = false;
  #scrolledPast = false;
  #openedAt = null;
  #layout = null;
  // Spring state: one offset per link, then the chevron's x, then the fold.
  #pos = [];
  #target = [];
  #speed = [];
  #loop = fixedStepLoop(SPRING_STEP, {
    step: () => this.#step(),
    render: () => this.#frame(),
  });

  render() {
    return '<nav part="nav"><div class="row"></div></nav>';
  }

  connected() {
    const options = { signal: this.signal };
    const row = this.query('.row');
    row.addEventListener('pointerdown', (event) => this.#down(event), options);
    row.addEventListener('pointermove', (event) => this.#move(event), options);
    row.addEventListener('pointerup', (event) => this.#end(event, true), options);
    row.addEventListener('pointercancel', (event) => this.#end(event, false), options);
    row.addEventListener('click', (event) => this.#click(event), { ...options, capture: true });
    row.addEventListener('keydown', (event) => this.#key(event), options);
    row.addEventListener('focusin', (event) => this.#focusIn(event), options);
    row.addEventListener('focusout', (event) => !row.contains(event.relatedTarget) && this.#leaveKeyboard(), options);
    row.addEventListener('dragstart', (event) => event.preventDefault(), options);
    row.addEventListener('pointerover', (event) => this.#hovered(event, true), options);
    row.addEventListener('pointerout', (event) => this.#hovered(event, false), options);
    window.addEventListener('scroll', () => this.#scrolled(), { ...options, passive: true });
    window.addEventListener('popstate', () => this.#followRoute(), options);
    const resize = new ResizeObserver(() => this.#measure());
    resize.observe(row);
    this.signal.addEventListener('abort', () => {
      this.#loop.stop();
      resize.disconnect();
    });
  }

  updated(changed) {
    if (changed.has('label')) this.query('nav').ariaLabel = this.label ?? '';
    if (changed.has('items')) this.#build();
    if (changed.has('items') && !this.value) this.#followRoute();
    this.#scrolled();
    this.#sync(changed.has('items'));
  }

  get #links() {
    return [...this.shadowRoot.querySelectorAll('.link')];
  }

  get #active() {
    return findIndex(this.items.map(({ href }) => href), this.value);
  }

  get #highlight() {
    return this.#preview ?? this.#active;
  }

  get #folded() {
    return Boolean(this.compact) && this.#scrolledPast && this.#openedAt === null && !this.#keyboardInside && !this.#drag?.scrubbing && this.#active >= 0;
  }

  #build() {
    const segments = this.items
      .map(
        ({ href, label }, i) =>
          `<div class="segment" data-index="${i}"><a class="link" part="link" href="${escapeHtml(href)}" draggable="false"><span class="cap start" aria-hidden="true"></span><span class="cap end" aria-hidden="true"></span><span class="name">${escapeHtml(label)}</span><span class="mark" aria-hidden="true"></span></a></div>`,
      )
      .join('');
    const chevron = '<button class="chevron" type="button" aria-label="Show all links"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>';
    this.query('.row').innerHTML = segments + chevron;
    const count = this.items.length;
    this.#pos = [...splitOffsets(count, this.#active, null), 0, 0];
    this.#target = [...this.#pos];
    this.#speed = this.#pos.map(() => 0);
    this.#layout = null;
  }

  // Measures the links' natural (untransformed) positions.
  #measure() {
    const segments = [...this.shadowRoot.querySelectorAll('.segment')];
    this.#layout = {
      centers: segments.map((box) => box.offsetLeft + box.offsetWidth / 2),
      widths: segments.map((box) => box.offsetWidth),
      rowWidth: this.query('.row').offsetWidth,
    };
    this.#retarget(true);
  }

  // Applies state that changes with a decision rather than every frame.
  #sync(instant = false) {
    const active = this.#active;
    const highlight = this.#highlight;
    const folded = this.#folded;
    this.#links.forEach((link, i) => {
      if (i === active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
      link.toggleAttribute('data-highlighted', i === highlight);
      link.parentElement.classList.toggle('pinned', i === active);
      link.parentElement.inert = folded && i !== active;
    });
    const chevron = this.query('.chevron');
    chevron.hidden = !this.compact;
    chevron.ariaExpanded = String(!folded);
    chevron.ariaHidden = String(!folded);
    chevron.tabIndex = folded ? 0 : -1;
    chevron.classList.toggle('shown', folded);
    this.#retarget(instant);
  }

  // Sends every value towards where the current state says it belongs.
  #retarget(instant) {
    if (!this.#layout) {
      if (!this.isConnected) return;
      this.#measure();
      return;
    }
    const count = this.items.length;
    const active = this.#active;
    const drag = this.#drag;
    let xs;
    let chevron;
    if (this.#folded) {
      ({ xs, chevron } = foldedOffsets(this.#layout, active));
    } else {
      const scrubbing = Boolean(drag?.scrubbing);
      xs = splitOffsets(count, scrubbing ? drag.focus : this.#highlight, scrubbing ? null : this.#hover);
      // Unfolded, the chevron waits tucked behind the active link.
      const anchor = Math.max(0, active);
      chevron = (this.#layout.centers[anchor] ?? 0) + (xs[anchor] ?? 0);
    }
    this.#target = [...xs, round2(chevron - CHEVRON_SIZE / 2), this.#folded ? 1 : 0];
    if (instant || reducedMotion.matches) {
      this.#pos = [...this.#target];
      this.#speed = this.#pos.map(() => 0);
      this.#loop.stop();
      this.#draw();
    } else {
      this.#loop.wake();
    }
  }

  #step() {
    for (let i = 0; i < this.#pos.length; i++) {
      this.#speed[i] += ((this.#target[i] - this.#pos[i]) * SPRING.stiffness - this.#speed[i] * SPRING.damping) * SPRING_STEP;
      this.#pos[i] += this.#speed[i] * SPRING_STEP;
    }
  }

  #frame() {
    const resting = this.#pos.every((pos, i) => Math.abs(this.#target[i] - pos) < 0.01 && Math.abs(this.#speed[i]) < 0.01);
    if (resting) this.#pos = [...this.#target];
    this.#draw();
    return !resting;
  }

  #draw() {
    const count = this.items.length;
    const xs = this.#pos.slice(0, count);
    const [chevron, fold] = this.#pos.slice(count);
    const active = this.#active;
    this.shadowRoot.querySelectorAll('.segment').forEach((segment, i) => {
      segment.style.transform = `translate3d(${round2(xs[i])}px,0,0)`;
      segment.style.opacity = i === active ? '' : String(round2(clamp(1 - fold * 1.8, 0, 1)));
      const [start, end] = segment.querySelectorAll('.cap');
      start.style.transform = i > 0 ? capScale(xs[i] - xs[i - 1], fold) : 'scaleX(0)';
      end.style.transform = i < count - 1 ? capScale(xs[i + 1] - xs[i], fold) : 'scaleX(0)';
    });
    const button = this.query('.chevron');
    button.style.transform = `translate3d(${round2(chevron)}px,0,0)`;
    button.style.opacity = String(round2(fold));
  }

  // Selects a link: the split moves to it and `lw-change` fires.
  #select(index) {
    const item = this.items[index];
    if (!item || index === this.#active) return;
    this.value = item.href;
    this.#sync();
    this.emit('change', { href: item.href, index });
  }

  // Follows the page's route when it matches an item, so the active link
  // stays right after the back button or navigation from elsewhere.
  #followRoute() {
    const paths = this.items.map(({ href }) => href);
    const index = [location.hash, location.pathname].map((current) => findIndex(paths, current)).find((i) => i >= 0);
    if (index !== undefined) this.value = paths[index];
    else if (!this.value) this.value = paths[0] ?? '';
  }

  #scrolled() {
    const past = Boolean(this.compact) && window.scrollY > COMPACT_AFTER;
    // Opened by the chevron, it folds again after another stretch of scroll.
    const reclose = this.#openedAt !== null && (!past || Math.abs(window.scrollY - this.#openedAt) > COMPACT_AFTER);
    if (past === this.#scrolledPast && !reclose) return;
    this.#scrolledPast = past;
    if (reclose) this.#openedAt = null;
    this.#sync();
  }

  #unfold() {
    this.#openedAt = window.scrollY;
    this.#sync();
    this.#links[this.#active]?.focus({ preventScroll: true });
  }

  // Pointer over and out, delegated from the row: only crossing a segment's
  // edge counts.
  #hovered(event, entering) {
    const segment = event.target.closest('.segment');
    if (!segment || segment.contains(event.relatedTarget) || event.pointerType !== 'mouse' || this.#drag?.scrubbing) return;
    const index = Number(segment.dataset.index);
    if (entering) this.#hover = index;
    else if (this.#hover === index) this.#hover = null;
    else return;
    this.#retarget(false);
  }

  #focusAt(clientX, drag) {
    return clamp(indexAt(this.#layout?.centers ?? [], clientX - drag.rowLeft), 0, this.items.length - 1);
  }

  #down(event) {
    if (event.button !== 0 || this.#folded || event.target.closest('.chevron')) return;
    this.#drag = {
      id: event.pointerId,
      startX: event.clientX,
      rowLeft: event.currentTarget.getBoundingClientRect().left,
      scrubbing: false,
      focus: this.#highlight,
      samples: [{ x: event.clientX, t: event.timeStamp }],
    };
  }

  #move(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    if (!drag.scrubbing) {
      if (Math.abs(event.clientX - drag.startX) < DRAG_SLOP) return;
      drag.scrubbing = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      this.#hover = null;
    }
    drag.samples.push({ x: event.clientX, t: event.timeStamp });
    if (drag.samples.length > 12) drag.samples.shift();
    drag.focus = this.#focusAt(event.clientX, drag);
    this.#preview = Math.round(drag.focus);
    this.#sync();
  }

  #end(event, commit) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    this.#drag = null;
    if (!drag.scrubbing) return;
    this.#preview = null;
    if (!commit) {
      this.#sync();
      return;
    }
    // A flick lands where its velocity would carry it, so it can skip links.
    const velocity = releaseVelocity(drag.samples, event.timeStamp);
    const index = Math.round(this.#focusAt(event.clientX + velocity * PROJECTION, drag));
    // The browser still sends a click for this press; swallow it and click
    // the chosen link instead, so an anchor or a router handles it.
    this.#suppressClick = true;
    setTimeout(() => (this.#suppressClick = false));
    this.#links[index]?.click();
    this.#sync();
  }

  #click(event) {
    if (this.#suppressClick && event.isTrusted) {
      this.#suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.target.closest('.chevron')) {
      this.#unfold();
      return;
    }
    const link = event.target.closest('.link');
    if (!link) return;
    this.#select(this.#links.indexOf(link));
    this.#followHash(event, link.getAttribute('href'));
  }

  // In-page anchors scroll to their target and record the hash with
  // pushState instead of a fragment navigation. A hash with no element (like
  // the demo's) only moves the split.
  #followHash(event, href) {
    if (!href.startsWith('#') || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const target = document.getElementById(decodeURIComponent(href.slice(1)));
    if (!target) return;
    target.scrollIntoView();
    if (location.hash !== href) history.pushState(null, '', href);
  }

  #key(event) {
    const links = this.#links;
    const move = KEY_MOVES[event.key];
    const from = links.indexOf(this.shadowRoot.activeElement);
    if (!move || from < 0) return;
    event.preventDefault();
    links[clamp(move(from, links.length), 0, links.length - 1)].focus();
  }

  // Keyboard moves are instant: no spring for something done this often.
  #focusIn(event) {
    const index = this.#links.indexOf(event.target);
    if (index < 0 || !event.target.matches(':focus-visible')) return;
    this.#keyboardInside = true;
    this.#preview = index;
    this.#sync(true);
  }

  #leaveKeyboard() {
    if (!this.#keyboardInside && this.#preview === null) return;
    this.#keyboardInside = false;
    if (!this.#drag) this.#preview = null;
    this.#sync(true);
  }
}
