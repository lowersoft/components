import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const page = (kicker, heading, text) => `<div style="display: grid; gap: 0.5rem; align-content: start">
  <p style="margin: 0; font-size: 0.5625rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.5">${kicker}</p>
  <h4 style="margin: 0; font-size: 0.875rem; line-height: 1.2">${heading}</h4>
  <p style="margin: 0; font-size: 0.6875rem; line-height: 1.5; opacity: 0.7">${text}</p>
</div>`;

export default {
  title: 'Cards/Dimensional Book Cover',
  component: 'lw-dimensional-book-cover',
  render: (args) => `<lw-dimensional-book-cover ${attributes(args)}></lw-dimensional-book-cover>`,
  argTypes: {
    variant: { name: 'Variant', control: 'inline-radio', options: ['banded', 'solid'] },
    accent: { name: 'Accent', control: 'color' },
    'text-color': { name: 'Text color', control: 'color' },
    width: { name: 'Width', control: { type: 'range', min: 160, max: 300, step: 2 } },
    title: { name: 'Title' },
    subtitle: { name: 'Subtitle' },
  },
  args: { title: 'Interface Field Guide', subtitle: 'Tokens, surfaces and the motion between them', variant: 'banded', accent: '#c45a45', width: 214 },
};

// Hover to tilt it; click to open, click again to turn pages, and once more after the last to close.
export const Default = {};

// Three books side by side, with their own pages.
export const Shelf = {
  parameters: { layout: 'padded' },
  render: () => `<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 3rem 8rem; padding: 3rem 2rem">
  <lw-dimensional-book-cover title="Interface Field Guide" subtitle="Tokens, surfaces and the motion between them" accent="#b54b3a" width="208"></lw-dimensional-book-cover>
  <lw-dimensional-book-cover variant="solid" title="Motion Notes" subtitle="A small guide to motion that survives production" accent="#2e3d5c" width="196">
    ${page('Part one', 'Ease out, mostly', 'Things that arrive should slow down as they land. Ease-in belongs to things leaving.')}
    ${page('Part two', 'Springs for touch', 'When a finger drives it, let a spring finish it, so it keeps the speed it was given.')}
  </lw-dimensional-book-cover>
  <lw-dimensional-book-cover title="Release Ledger" subtitle="Every version, what changed and why" accent="#d4953a" width="208">
    <svg slot="artwork" viewBox="0 0 100 100" preserveAspectRatio="none" style="width: 100%; height: 100%"><g fill="none" stroke="rgb(0 0 0 / 0.2)" stroke-width="1.2"><rect x="14" y="16" width="72" height="52"/><rect x="22" y="24" width="56" height="36"/><rect x="30" y="32" width="40" height="20"/></g></svg>
    ${page('v4.2', 'Faster first paint', 'Styles load with the element, so nothing flashes unstyled on a cold start.')}
    ${page('v4.1', 'Quieter motion', 'Every animation now waits for reduced motion before it runs.')}
    ${page('v4.0', 'One theme file', 'Colors, radii and type all come from one set of tokens.')}
  </lw-dimensional-book-cover>
</div>`,
};
