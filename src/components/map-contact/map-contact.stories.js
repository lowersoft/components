import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (inner, width = '72rem') => `<div style="max-width: ${width}; margin: 3rem auto">${inner}</div>`;

export default {
  title: 'Sections/Contact/Map Contact',
  component: 'lw-map-contact',
  parameters: { layout: 'padded' },
  render: (args) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'max-width: 72rem; margin: 3rem auto';
    wrap.innerHTML = `<lw-map-contact ${attributes(args)}></lw-map-contact>`;
    wrap.firstElementChild.send = () => new Promise((resolve) => setTimeout(resolve, 900));
    return wrap;
  },
  args: {},
};

// The map is drawn in SVG and follows the theme; the form checks its fields.
export const Default = {};

// On a phone the map moves under the form.
export const Narrow = {
  render: (args) => frame(`<lw-map-contact ${attributes(args)}></lw-map-contact>`, '24rem'),
};
