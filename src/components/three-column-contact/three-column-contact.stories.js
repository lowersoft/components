import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (inner, width = '72rem') => `<div style="max-width: ${width}; margin: 3rem auto">${inner}</div>`;

export default {
  title: 'Sections/Contact/Three Column Contact',
  component: 'lw-three-column-contact',
  parameters: { layout: 'padded' },
  render: (args) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'max-width: 72rem; margin: 3rem auto';
    wrap.innerHTML = `<lw-three-column-contact ${attributes(args)}></lw-three-column-contact>`;
    wrap.firstElementChild.send = () => new Promise((resolve) => setTimeout(resolve, 900));
    return wrap;
  },
  args: {},
};

// The form checks its fields; sending waits a moment, then says so.
export const Default = {};

// When sending fails, the form says why and keeps what was written.
export const SendFails = {
  render: (args) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'max-width: 72rem; margin: 3rem auto';
    wrap.innerHTML = `<lw-three-column-contact ${attributes(args)}></lw-three-column-contact>`;
    wrap.firstElementChild.send = () => new Promise((_, reject) => setTimeout(() => reject(new Error('The inbox is busy. Try again in a minute.')), 700));
    return wrap;
  },
};

// On a phone the columns stack, the channels after the form.
export const Narrow = {
  render: (args) => frame(`<lw-three-column-contact ${attributes(args)}></lw-three-column-contact>`, '24rem'),
};
