import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const STYLE = `<style>
  .notes { max-width: 36rem; margin: 0 auto; font: 15px/1.65 system-ui, sans-serif; }
  .notes .meta { margin: 0; font-size: 12px; font-weight: 500; color: var(--lw-color-muted-foreground); }
  .notes h2 { margin: 3rem 0 0; font-size: 1.25rem; letter-spacing: -0.01em; }
  .notes h2.title { margin-top: 0.5rem; font-size: 1.5rem; }
  .notes h3 { margin: 2rem 0 0; font-size: 1rem; font-weight: 500; }
  .notes p { margin: 0.75rem 0 0; color: var(--lw-color-muted-foreground); }
  .notes .last { padding-bottom: 10rem; }
</style>`;

const ARTICLE = `<article class="notes">
  <p class="meta">Field notes · 8 min read</p>
  <h2 class="title">Building a component library</h2>
  <p>A component library is a promise: that the next screen will be faster to build than the last, and that it will feel like the same product. These notes cover what we learned keeping that promise for two years.</p>
  <p>Most of it is about saying no. Every prop is a decision someone else has to make, and every variant is a screen that drifts.</p>
  <h2>Principles</h2>
  <p>Three rules settled most arguments before they started. Write them down early, and point to them often.</p>
  <h3>Restraint</h3>
  <p>Ship the smallest component that solves the problem in front of you. A button with four sizes is easier to live with than one with nine, and nobody has ever asked for the fifth.</p>
  <h3>Motion with a purpose</h3>
  <p>Animation explains where something came from and where it went. Anything else is decoration, and decoration ages quickly. Keep interface motion under 300 ms and let people interrupt it.</p>
  <h2>Tokens</h2>
  <p>Tokens are the vocabulary. Color, type, spacing and radius live in one place, so a rebrand is a pull request rather than a quarter.</p>
  <h3>Color</h3>
  <p>Name colors by job, not by hue. A surface, a border and a muted label survive a palette change; a zinc-150 never does.</p>
  <h3>Type</h3>
  <p>Two families and five sizes cover nearly everything. Line height is part of the size, never a separate choice.</p>
  <h2>Components</h2>
  <p>Build from the inside out: primitives first, then the pieces that compose them. A dialog is a portal, a focus trap and a surface before it is ever a confirmation box.</p>
  <p>Keep the API close to the platform. If it behaves like a button, it is a button element, with every attribute a button takes.</p>
  <h2>Accessibility</h2>
  <p>Keyboard first. If a component can't be used without a mouse, it is not finished. Test with a screen reader before review, not after launch, and treat reduced motion as a real setting.</p>
  <h2>Shipping</h2>
  <p>Release small and often. A changelog people actually read is worth more than a migration guide nobody finds.</p>
  <p>Every release gets a short note: what changed, why, and what to do about it, in that order.</p>
  <h2>What's next</h2>
  <p>Theming per product, a token pipeline that feeds design and code from the same file, and fewer components, not more.</p>
  <p class="last">Thanks for reading. Drag the rail on the right to move through these notes, or hover it to see where each section starts.</p>
</article>`;

export default {
  title: 'Navigation/Scroll Index',
  component: 'lw-scroll-index',
  parameters: { layout: 'padded' },
  render: (args) => `${STYLE}<lw-scroll-index ${attributes(args)}>${ARTICLE}</lw-scroll-index>`,
  args: { selector: 'h2, h3' },
};

// Hover the rail on the right, drag it to scrub, or flick it to a section.
export const Default = {};

// The page scrolls, and the rail sticks beside the article.
export const WindowScroll = {
  args: { scroller: 'window' },
};
