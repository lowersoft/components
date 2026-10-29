// The demo deck: LowerSoft posters drawn as flat compositions with one accent, so
// the component ships with no image files. Shapes take the classes `bg`,
// `mid`, `ink`, `accent` and `ring`, which follow the theme.

const art = (inner, dark = false) =>
  `<svg viewBox="0 0 320 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect class="${dark ? 'night' : 'bg'}" width="320" height="320"/>${inner}</svg>`;

const range = (count, fn) => Array.from({ length: count }, (_, i) => fn(i)).join('');
const LIT = new Set([7, 16, 23]);

export const DEMO_CARDS = [
  {
    id: 'low-sun',
    title: 'Cold Start',
    subtitle: 'Poster 01 · Risograph',
    art: art(`<circle class="accent" cx="160" cy="176" r="72"/><rect class="mid" y="176" width="320" height="144"/>${range(7, (i) => `<rect class="accent" x="${100 + i * 7}" y="${190 + i * 14}" width="${120 - i * 14}" height="${4 - i * 0.4}"/>`)}`),
    description: 'A program that is up before the sun clears the water: 9 ms, pulled in two passes on warm cream stock.',
    specs: [
      { label: 'Size', value: 'A3' },
      { label: 'Paper', value: 'Cream 120g' },
      { label: 'Edition', value: 'of 50' },
    ],
    price: '$48',
  },
  {
    id: 'ridge-line',
    title: 'Call Stack',
    subtitle: 'Poster 02 · Screen print',
    art: art('<circle class="accent" cx="232" cy="108" r="22"/><polygon class="mid" points="0,200 64,132 112,172 176,96 248,164 320,120 320,320 0,320"/><polygon class="ink" points="0,240 88,176 148,220 224,160 320,236 320,320 0,320"/>'),
    description: 'Frames on frames, as a flame graph sees them. Hand-pulled in three layers, with a slight misregister on purpose.',
    specs: [
      { label: 'Size', value: '50 × 70' },
      { label: 'Paper', value: 'Natural 300g' },
      { label: 'Edition', value: 'of 30' },
    ],
    price: '$72',
  },
  {
    id: 'tide-pools',
    title: 'Cache Lines',
    subtitle: 'Poster 03 · Risograph',
    art: art(`${range(8, (i) => `<circle class="ring" cx="132" cy="188" r="${24 * (i + 1)}"/>`)}<circle class="accent" cx="132" cy="188" r="14"/><circle class="ink" cx="244" cy="104" r="6"/>`),
    description: 'Eight levels out from one hot value, printed as hairlines around a single accent dot.',
    specs: [
      { label: 'Size', value: 'A3' },
      { label: 'Paper', value: 'White 120g' },
      { label: 'Edition', value: 'of 80' },
    ],
    price: '$40',
  },
  {
    id: 'night-market',
    title: 'Page Table',
    subtitle: 'Poster 04 · Giclée',
    art: art(range(30, (i) => `<rect class="${LIT.has(i) ? 'accent' : 'window'}" x="${52 + (i % 5) * 46}" y="${52 + Math.floor(i / 5) * 40}" width="30" height="30" rx="2"/>`), true),
    description: 'Thirty pages mapped, three of them resident. The rest wait on disk until something touches them.',
    specs: [
      { label: 'Size', value: '40 × 50' },
      { label: 'Paper', value: 'Cotton 310g' },
      { label: 'Edition', value: 'Open' },
    ],
    price: '$56',
  },
  {
    id: 'salt-flats',
    title: 'Zero Alloc',
    subtitle: 'Poster 05 · Screen print',
    art: art('<circle class="accent" cx="96" cy="108" r="14"/><rect class="flat" y="172" width="320" height="148"/><polygon class="mid" points="214,172 40,196 40,200 218,173"/><rect class="ink" x="212" y="116" width="4" height="56"/>'),
    description: 'One pointer and its shadow across an empty heap. Mostly nothing, which is the point.',
    specs: [
      { label: 'Size', value: '50 × 70' },
      { label: 'Paper', value: 'Bright 300g' },
      { label: 'Edition', value: 'of 25' },
    ],
    price: '$64',
  },
];
