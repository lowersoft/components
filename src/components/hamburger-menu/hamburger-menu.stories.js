import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const VARIANTS = ['squeeze', 'pivot', 'arrow', 'stagger', 'duo', 'split', 'wipe', 'loop'];

export default {
  title: 'Controls/Buttons/Toggles/Hamburger Menu',
  component: 'lw-hamburger-menu',
  parameters: { layout: 'centered' },
  render: (args) => `<lw-hamburger-menu ${attributes(args)}></lw-hamburger-menu>`,
  argTypes: {
    variant: { name: 'Variant', control: 'select', options: VARIANTS },
    open: { name: 'Open', control: 'boolean' },
    size: { name: 'Size', control: { type: 'range', min: 16, max: 64, step: 2 } },
    thickness: { name: 'Thickness', control: { type: 'range', min: 1, max: 4, step: 0.25 } },
    duration: { name: 'Duration', control: { type: 'range', min: 0, max: 1200, step: 20 } },
    square: { name: 'Square ends', control: 'boolean' },
  },
  args: { variant: 'squeeze', open: false, size: 32, thickness: 2, duration: 420, square: false },
};

// Click, or press Enter or Space: the bars close together, then cross.
export const Default = {};

// All eight, with their names.
export const Variants = {
  render: (args) =>
    `<div style="display: grid; grid-template-columns: repeat(4, auto); gap: 1.5rem 2.5rem; font: 500 0.75rem var(--lw-font-sans); color: var(--lw-color-muted-foreground)">${VARIANTS.map(
      (variant) => `<label style="display: grid; justify-items: center; gap: 0.5rem"><lw-hamburger-menu ${attributes({ ...args, variant, open: false })}></lw-hamburger-menu>${variant}</label>`,
    ).join('')}</div>`,
};

// Wired to a menu: the button points at it and opens and closes it.
export const WithMenu = {
  render: (args) => {
    queueMicrotask(() => {
      const button = document.querySelector('#hamburger-demo');
      const menu = document.querySelector('#hamburger-panel');
      button.addEventListener('lw-change', (event) => (menu.hidden = !event.detail.open));
      menu.addEventListener('click', (event) => event.target.closest('a') && button.toggle(false));
    });
    return `<div style="display: grid; justify-items: end; gap: 0.5rem; width: 16rem; font-family: var(--lw-font-sans)"><lw-hamburger-menu id="hamburger-demo" aria-controls="hamburger-panel" ${attributes({ ...args, variant: 'pivot' })}></lw-hamburger-menu><nav id="hamburger-panel" hidden style="display: grid; width: 100%; padding: 0.5rem; border: 1px solid var(--lw-color-border); border-radius: var(--lw-radius-lg); background: var(--lw-color-background)">${['Product', 'Pricing', 'Docs', 'Contact'].map((label) => `<a href="#" style="padding: 0.5rem 0.75rem; border-radius: var(--lw-radius-md); color: var(--lw-color-foreground); text-decoration: none">${label}</a>`).join('')}</nav></div>`;
  },
};
