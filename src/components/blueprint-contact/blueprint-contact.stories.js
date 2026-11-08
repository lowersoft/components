import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (inner, width = '64rem') => `<div style="max-width: ${width}; margin: 2rem auto">${inner}</div>`;

const withSend = (args, style = '') => {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'max-width: 64rem; margin: 2rem auto';
  wrap.innerHTML = `<lw-blueprint-contact ${style ? `style="${style}"` : ''} ${attributes(args)}></lw-blueprint-contact>`;
  wrap.firstElementChild.send = () => new Promise((resolve) => setTimeout(resolve, 900));
  return wrap;
};

export default {
  title: 'Sections/Contact/Blueprint Contact',
  component: 'lw-blueprint-contact',
  parameters: { layout: 'padded' },
  render: (args) => withSend(args),
  args: {},
};

// The form checks its fields; sending waits a moment, then says so.
export const Default = {};

// The send button in a colour of its own, through the library's primary tokens.
export const Accent = {
  render: (args) => withSend(args, '--lw-color-primary: #fcc659; --lw-color-primary-foreground: #18181b'),
};

// On a phone the guides draw in and the actions wrap.
export const Narrow = {
  render: (args) => frame(`<lw-blueprint-contact ${attributes(args)}></lw-blueprint-contact>`, '24rem'),
};
