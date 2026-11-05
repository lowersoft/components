import { attributes } from '../../../.storybook/attributes.js';
import { strokeIcon } from '../../core/icons.js';
import * as lucide from '../../core/lucide.js';
import './index.js';

const BRANDS = ['Lumen', 'Arcadia', 'Halcyon', 'Vertex Labs', 'Quill', 'Orbita', 'Kestrel'];

// Made-up marks for made-up companies, drawn in the current color.
const MARKS = {
  Lumen: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18" stroke="var(--_bg)" stroke-width="3"/>',
  Arcadia: '<path d="M2 20 12 4l10 16z"/><path d="M8 20l4-7 4 7z" fill="var(--_bg)"/>',
  Halcyon: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="12" cy="12" r="3"/>',
  'Vertex Labs': '<rect x="5" y="5" width="14" height="14" rx="2" transform="rotate(45 12 12)"/>',
  Quill: '<path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16z"/>',
  Orbita: '<circle cx="9" cy="12" r="6"/><circle cx="17" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/>',
  Kestrel: '<rect x="3" y="4" width="18" height="4" rx="2"/><rect x="3" y="10" width="12" height="4" rx="2"/><rect x="3" y="16" width="7" height="4" rx="2"/>',
  Monolith: '<rect x="8" y="2" width="8" height="20" rx="1.5"/>',
  Driftwood: '<path d="M2 15c3-4 6-4 10 0s7 4 10 0v5H2z"/><path d="M2 8c3-4 6-4 10 0s7 4 10 0" fill="none" stroke="currentColor" stroke-width="2.5"/>',
  Pinecone: '<path d="M12 2 20 9l-3 11H7L4 9z"/>',
};

const mark = (name) => `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">${MARKS[name]}</svg>`;

const FEATURES = [
  ['Realtime sync', 'activity', 210],
  ['Version history', 'history', 265],
  ['Offline mode', 'hardDrive', 30],
  ['Comments', 'messageCircle', 150],
  ['Branching', 'gitBranch', 320],
  ['Audit log', 'fileSearch', 55],
  ['Single sign-on', 'keyRound', 190],
  ['Webhooks', 'link2', 285],
  ['Templates', 'layers', 95],
  ['Dark mode', 'moon', 240],
  ['API access', 'codeXml', 170],
  ['Custom domains', 'globe', 10],
];

const QUOTES = [
  ['Ayla Demir', 'Design lead, Quill', 'We replaced three tools with it in a week. The team stopped asking where things live.', 15],
  ['Marcus Hale', 'CTO, Orbita', 'The first library where the motion feels considered rather than bolted on.', 210],
  ['Priya Raman', 'Founder, Kestrel', 'Our landing page converts noticeably better since we swapped the hero. Customers mention it.', 145],
  ['Jonas Weber', 'Engineer, Halcyon', 'Drop-in, accessible, and it respects reduced motion out of the box. Rare.', 280],
  ['Sofia Costa', 'PM, Arcadia', 'Shipping a polished settings page took an afternoon instead of a sprint.', 330],
  ['Kenji Mori', 'Frontend, Lumen', 'Web components that just work in our Vue app and our old jQuery admin alike.', 95],
  ['Lea Fischer', 'Brand, Monolith', 'It finally looks like the mockups. Every hover state is already there.', 50],
  ['Omar Haddad', 'Indie hacker', 'I launched with it on a Sunday. By Monday people were asking what I used.', 250],
  ['Nina Petrov', 'Design systems, Pinecone', 'Tokens map cleanly onto ours, so it blends in instead of fighting the theme.', 180],
];

const PHOTOS = [
  '1501785888041-af3ef285b470',
  '1500530855697-b586d89ba3ee',
  '1470071459604-3b5ec3a7fe05',
  '1464822759023-fed622ff2c3b',
  '1469474968028-56623f02e42e',
  '1506905925346-21bda4d32df4',
  '1472214103451-9374bd1c798e',
  '1441974231531-c6227db76b6e',
];

const TICKERS = [
  ['ORBX', '182.40', 2.31],
  ['KSTL', '64.12', -0.84],
  ['HALC', '311.05', 1.12],
  ['QLL', '9.87', 4.65],
  ['DRFT', '47.30', -2.07],
  ['MNLT', '1,204.00', 0.38],
  ['PNCN', '22.64', -0.29],
  ['ARCD', '138.91', 3.02],
  ['LMNA', '73.55', -1.46],
];

const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('');

const marquee = (args, items) => `<lw-infinite-marquee ${attributes(args)}>${items}</lw-infinite-marquee>`;

export default {
  title: 'Media/Infinite Marquee',
  component: 'lw-infinite-marquee',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<style>
  .mq-words { padding: 5rem 0; }
  .mq-words span { font: 600 clamp(1.5rem, 3vw, 2.25rem)/1 var(--lw-font-sans); letter-spacing: -0.03em; color: var(--lw-color-muted-foreground); white-space: nowrap; }
</style>
<div class="mq-words">${marquee(args, BRANDS.map((name) => `<span>${name}</span>`).join(''))}</div>`,
  argTypes: {
    speed: { name: 'Speed', control: { type: 'range', min: 5, max: 90, step: 1 } },
    direction: { name: 'Direction', control: 'inline-radio', options: ['left', 'right'] },
    gap: { name: 'Gap', control: 'text' },
    'pause-on-hover': { name: 'Pause on hover', control: 'boolean' },
    'no-fade': { name: 'No fade', control: 'boolean' },
    'fade-size': { name: 'Fade size', control: 'text' },
  },
  args: { speed: 28, direction: 'left', gap: '5rem', 'pause-on-hover': true, 'no-fade': false, 'fade-size': '12%' },
};

// Names slide by forever; the edges fade into the page and the strip
// coasts to a stop under the pointer.
export const Default = {};

// A logo cloud under a heading: marks and names in one muted color, each
// lighting up under the pointer.
export const LogoCloud = {
  args: { speed: 36, gap: '3.5rem', 'fade-size': '18%' },
  render: (args) => `<style>
  .mq-logos { --_bg: var(--lw-color-background); display: grid; gap: 2rem; padding: 5rem 0; background: var(--_bg); }
  .mq-logos p { margin: 0; text-align: center; font: 500 0.8125rem/1 var(--lw-font-sans); letter-spacing: 0.08em; text-transform: uppercase; color: var(--lw-color-muted-foreground); }
  .mq-logo { display: inline-flex; align-items: center; gap: 0.625rem; font: 650 1.375rem/1 var(--lw-font-sans); letter-spacing: -0.03em; white-space: nowrap; color: color-mix(in oklab, var(--lw-color-foreground) 42%, var(--_bg)); transition: color 200ms ease-out; }
  .mq-logo:hover { color: var(--lw-color-foreground); }
</style>
<section class="mq-logos"><p>Trusted by product teams at</p>${marquee(args, Object.keys(MARKS).map((name) => `<span class="mq-logo">${mark(name)}${name}</span>`).join(''))}</section>`,
};

// Two rows of feature pills running against each other at different paces.
export const StackedRows = {
  args: { gap: '0.75rem', 'fade-size': '10%' },
  render: (args) => {
    const pill = ([label, icon, hue]) =>
      `<span class="mq-pill" style="--_hue: ${hue}"><span class="mq-pill-icon">${strokeIcon(lucide[icon], 15, 2)}</span>${label}</span>`;
    const half = Math.ceil(FEATURES.length / 2);
    return `<style>
  .mq-rows { display: grid; gap: 0.875rem; padding: 4.5rem 0; }
  .mq-pill { display: inline-flex; align-items: center; gap: 0.625rem; padding: 0.5rem 1.125rem 0.5rem 0.5rem; border: 1px solid var(--lw-color-border); border-radius: 999px; background: color-mix(in oklab, var(--lw-color-muted) 55%, var(--lw-color-background)); font: 500 0.9375rem/1 var(--lw-font-sans); color: var(--lw-color-foreground); white-space: nowrap; }
  .mq-pill-icon { display: grid; width: 1.875rem; height: 1.875rem; place-items: center; border-radius: 50%; background: light-dark(oklch(0.93 0.05 var(--_hue)), oklch(0.32 0.07 var(--_hue))); color: light-dark(oklch(0.45 0.14 var(--_hue)), oklch(0.85 0.1 var(--_hue))); }
</style>
<div class="mq-rows">
  ${marquee({ ...args, speed: args.speed * 1.2 }, FEATURES.slice(0, half).map(pill).join(''))}
  ${marquee({ ...args, direction: args.direction === 'left' ? 'right' : 'left', speed: args.speed * 1.5 }, FEATURES.slice(half).map(pill).join(''))}
</div>`;
  },
};

// A wall of testimonials: columns drift up and down at their own paces.
export const Testimonials = {
  args: { gap: '1rem', 'fade-size': '16%', speed: 40 },
  argTypes: { direction: { control: false } },
  render: (args) => {
    const card = ([name, role, quote, hue]) => `<figure class="mq-quote" style="--_hue: ${hue}">
      <blockquote>${quote}</blockquote>
      <figcaption><span class="mq-avatar">${initials(name)}</span><span><strong>${name}</strong><small>${role}</small></span></figcaption>
    </figure>`;
    const column = (index, direction, pace) =>
      marquee({ ...args, direction, speed: args.speed * pace }, QUOTES.filter((_, i) => i % 3 === index).map(card).join(''));
    return `<style>
  .mq-wall { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; max-width: 64rem; height: 34rem; margin: 0 auto; padding: 3rem 1.5rem; box-sizing: content-box; }
  .mq-wall lw-infinite-marquee { height: 100%; }
  .mq-quote { display: grid; gap: 1.125rem; margin: 0; padding: 1.25rem; border: 1px solid var(--lw-color-border); border-radius: 1rem; background: var(--lw-color-background); box-shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -12px rgb(0 0 0 / 0.12); font-family: var(--lw-font-sans); }
  .mq-quote blockquote { margin: 0; font-size: 0.9375rem; line-height: 1.55; color: var(--lw-color-foreground); text-wrap: pretty; }
  .mq-quote figcaption { display: flex; align-items: center; gap: 0.75rem; }
  .mq-quote figcaption > span:last-child { display: grid; gap: 0.125rem; }
  .mq-quote strong { font-size: 0.875rem; font-weight: 600; color: var(--lw-color-foreground); }
  .mq-quote small { font-size: 0.8125rem; color: var(--lw-color-muted-foreground); }
  .mq-avatar { display: grid; width: 2.25rem; height: 2.25rem; flex: none; place-items: center; border-radius: 50%; font-size: 0.8125rem; font-weight: 600; background: light-dark(oklch(0.93 0.04 var(--_hue)), oklch(0.32 0.05 var(--_hue))); color: light-dark(oklch(0.42 0.08 var(--_hue)), oklch(0.86 0.06 var(--_hue))); }
  @media (max-width: 720px) { .mq-wall { grid-template-columns: repeat(2, minmax(0, 1fr)); } .mq-wall > :last-child { display: none; } }
  @media (max-width: 480px) { .mq-wall { gap: 0.625rem; padding: 2rem 0.75rem; } .mq-quote { gap: 0.875rem; padding: 0.875rem; } .mq-quote blockquote { font-size: 0.875rem; } .mq-avatar { display: none; } }
</style>
<div class="mq-wall">${column(0, 'up', 1)}${column(1, 'down', 1.25)}${column(2, 'up', 1.1)}</div>`;
  },
};

// Two bold ribbons crossing the page, running opposite ways.
export const Ribbons = {
  args: { speed: 18, gap: '2rem', 'no-fade': true, 'pause-on-hover': false },
  render: (args) => {
    const words = ['New season', 'Free shipping', 'Limited run', 'Made to last', 'Back in stock'];
    const strip = words.map((word) => `<span class="mq-word">${word}</span><span class="mq-star" aria-hidden="true">✦</span>`).join('');
    return `<style>
  .mq-ribbons { position: relative; display: grid; height: 22rem; place-items: center; overflow: hidden; }
  .mq-ribbon { grid-area: 1 / 1; width: 116%; padding: 1.125rem 0; box-shadow: 0 12px 30px -12px rgb(0 0 0 / 0.35); }
  .mq-ribbon.one { rotate: -5deg; background: var(--lw-color-foreground); color: var(--lw-color-background); z-index: 1; }
  .mq-ribbon.two { rotate: 4deg; background: #facc15; color: #18181b; }
  .mq-ribbon span { font: 800 clamp(1.25rem, 3vw, 2rem)/1 var(--lw-font-sans); letter-spacing: -0.01em; text-transform: uppercase; white-space: nowrap; }
  .mq-ribbon .mq-star { font-size: 1.25rem; opacity: 0.7; }
</style>
<div class="mq-ribbons">
  <div class="mq-ribbon two">${marquee({ ...args, direction: args.direction === 'left' ? 'right' : 'left', speed: args.speed * 1.15 }, strip)}</div>
  <div class="mq-ribbon one">${marquee(args, strip)}</div>
</div>`;
  },
};

// A strip of photo cards with captions; a card lifts under the pointer.
export const Gallery = {
  args: { speed: 55, gap: '1.25rem', 'fade-size': '8%' },
  render: (args) => {
    const card = (id, i) => `<figure class="mq-photo">
      <img src="https://images.unsplash.com/photo-${id}?w=520&h=680&fit=crop&auto=format&q=75" alt="Landscape ${i + 1}" loading="lazy" width="260" height="340">
      <figcaption><span>No. ${String(i + 1).padStart(2, '0')}</span>Landscape series</figcaption>
    </figure>`;
    return `<style>
  .mq-gallery { padding: 4rem 0; }
  .mq-photo { position: relative; width: 15rem; height: 20rem; margin: 0; overflow: hidden; border-radius: 1.25rem; background: var(--lw-color-muted); box-shadow: 0 10px 30px -14px rgb(0 0 0 / 0.45); transition: translate 300ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 300ms ease-out; }
  .mq-photo img { display: block; width: 100%; height: 100%; object-fit: cover; transition: scale 600ms cubic-bezier(0.23, 1, 0.32, 1); }
  .mq-photo::after { content: ''; position: absolute; inset: 45% 0 0; background: linear-gradient(transparent, rgb(0 0 0 / 0.6)); pointer-events: none; }
  .mq-photo figcaption { position: absolute; z-index: 1; right: 1rem; bottom: 0.875rem; left: 1rem; display: grid; gap: 0.25rem; font: 500 0.875rem/1.2 var(--lw-font-sans); color: #fff; }
  .mq-photo figcaption span { font-size: 0.75rem; letter-spacing: 0.08em; opacity: 0.75; }
  .mq-photo:hover { translate: 0 -6px; box-shadow: 0 18px 40px -16px rgb(0 0 0 / 0.55); }
  .mq-photo:hover img { scale: 1.05; }
</style>
<div class="mq-gallery">${marquee(args, PHOTOS.map(card).join(''))}</div>`;
  },
};

// One giant line, filled words trading places with outlined ones.
export const Headline = {
  args: { speed: 24, gap: '2.5rem', 'fade-size': '6%', 'pause-on-hover': false },
  render: (args) => {
    const words = ['Design', 'Build', 'Ship', 'Repeat'];
    const strip = words.map((word, i) => `<span class="mq-big${i % 2 ? ' outline' : ''}">${word}</span><span class="mq-dot" aria-hidden="true"></span>`).join('');
    return `<style>
  .mq-headline { padding: 4rem 0; }
  .mq-big { font: 800 clamp(3.5rem, 11vw, 8.5rem)/1 var(--lw-font-sans); letter-spacing: -0.05em; color: var(--lw-color-foreground); white-space: nowrap; }
  .mq-big.outline { color: transparent; -webkit-text-stroke: 2px var(--lw-color-foreground); }
  .mq-dot { width: clamp(0.75rem, 2vw, 1.25rem); aspect-ratio: 1; border-radius: 50%; background: #f97316; }
</style>
<div class="mq-headline">${marquee(args, strip)}</div>`;
  },
};

// A market ticker between hairlines: symbol, price and the day's move.
export const Ticker = {
  args: { speed: 40, gap: '0rem', 'fade-size': '4rem' },
  render: (args) => {
    const quote = ([symbol, price, change]) => {
      const up = change >= 0;
      return `<span class="mq-tick"><b>${symbol}</b><span>${price}</span><span class="${up ? 'up' : 'down'}">${up ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%</span></span>`;
    };
    return `<style>
  .mq-ticker { margin: 5rem 0; border-block: 1px solid var(--lw-color-border); background: color-mix(in oklab, var(--lw-color-muted) 40%, var(--lw-color-background)); }
  .mq-tick { display: inline-flex; align-items: baseline; gap: 0.625rem; padding: 0.875rem 1.5rem; border-right: 1px solid var(--lw-color-border); font: 500 0.875rem/1 ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums; color: var(--lw-color-muted-foreground); white-space: nowrap; }
  .mq-tick b { font-weight: 700; color: var(--lw-color-foreground); }
  .mq-tick .up { color: light-dark(#15803d, #4ade80); }
  .mq-tick .down { color: light-dark(#b91c1c, #f87171); }
</style>
<div class="mq-ticker">${marquee(args, TICKERS.map(quote).join(''))}</div>`;
  },
};
