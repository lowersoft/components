import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (inner, width = '68rem') => `<div style="max-width: ${width}; margin: 3rem auto">${inner}</div>`;

export default {
  title: 'Sections/Contact/Quote Contact',
  component: 'lw-quote-contact',
  parameters: { layout: 'padded' },
  render: (args) => frame(`<lw-quote-contact ${attributes(args)}></lw-quote-contact>`),
  args: {},
};

// The form checks its fields; step through the quotes with the arrows.
// Sending waits a moment, as if it went to a server, then says so.
export const Default = {
  render: (args) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'max-width: 68rem; margin: 3rem auto';
    wrap.innerHTML = `<lw-quote-contact ${attributes(args)}></lw-quote-contact>`;
    wrap.firstElementChild.send = () => new Promise((resolve) => setTimeout(resolve, 900));
    return wrap;
  },
};

// A colour for the glow behind the card.
export const Glow = {
  render: (args) => frame(`<lw-quote-contact style="--lw-quote-contact-glow: #14b8a6" ${attributes(args)}></lw-quote-contact>`),
};

// On a phone the quote follows the form.
export const Narrow = {
  render: (args) => frame(`<lw-quote-contact ${attributes(args)}></lw-quote-contact>`, '24rem'),
};
