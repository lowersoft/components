import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const photo = (id) => `https://images.unsplash.com/photo-${id}?w=640&h=420&fit=crop&auto=format&q=75`;

const link = 'color: inherit; text-decoration: underline; text-decoration-color: color-mix(in oklab, currentColor 40%, transparent); text-underline-offset: 0.2em';
const tile = 'display: block; overflow: hidden; border-radius: 0.75rem; aspect-ratio: 4 / 3';
const img = 'display: block; width: 100%; height: 100%; object-fit: cover';

const content = `<div style="display: grid; gap: 1.75rem; max-width: 40rem; font-family: system-ui, sans-serif">
  <p style="margin: 0; font-size: 1.5rem; line-height: 1.4; letter-spacing: -0.01em">Hover the <a href="#" data-cursor-label="read" style="${link}">essay</a>, open a <a href="#" data-cursor-label="view" data-cursor-color="#16a34a" data-cursor-ink="#fff" style="${link}">case study</a>, or skim the frames below.</p>
  <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 0.75rem">
    <a href="#" data-cursor-label="open" data-cursor-color="#2563eb" data-cursor-ink="#fff" style="${tile}"><img src="${photo('1501785888041-af3ef285b470')}" alt="Lake below the peaks" style="${img}"></a>
    <a href="#" data-cursor-label="play" data-cursor-color="#e11d48" data-cursor-ink="#fff" style="${tile}"><img src="${photo('1464822759023-fed622ff2c3b')}" alt="Snowy peaks" style="${img}"></a>
    <a href="#" data-cursor-label style="${tile}"><img src="${photo('1441974231531-c6227db76b6e')}" alt="Forest light" style="${img}"></a>
  </div>
  <p style="margin: 0; font-size: 0.875rem; opacity: 0.7">Also works on any element, like <button type="button" data-cursor-label="copy" style="padding: 0.125rem 0.5rem; border: 1px solid currentColor; border-radius: 0.375rem; background: none; color: inherit; font: inherit; cursor: pointer">this button</button>.</p>
</div>`;

export default {
  title: 'Effects/Pointer/Follow Cursor Label',
  component: 'lw-follow-cursor-label',
  render: (args) => `<lw-follow-cursor-label ${attributes(args)}>${content}</lw-follow-cursor-label>`,
  argTypes: { color: { control: 'color' }, ink: { control: 'color' } },
  args: { label: 'click' },
};

// Each target names its own words and colors; the last tile falls back to the default.
export const Default = {};
