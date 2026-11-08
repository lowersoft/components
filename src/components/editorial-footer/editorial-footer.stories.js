import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const page = (inner) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end">${inner}</div>`;

export default {
  title: 'Sections/Footers/Editorial Footer',
  component: 'lw-editorial-footer',
  parameters: { layout: 'fullscreen' },
  render: (args) => page(`<lw-editorial-footer ${attributes(args)}></lw-editorial-footer>`),
  args: {},
};

// Move the mouse across the name at the foot and it fills in under it.
export const Default = {};

// Paper and ink with a bronze fill, from the library's own colour tokens
// set on the footer, and the name in the running head as spaced capitals.
export const Paper = {
  render: (args) => page(`<lw-editorial-footer ${attributes(args)} logo="" style="
    --lw-color-background: light-dark(#f4f1ec, #17130f);
    --lw-color-foreground: light-dark(#1c1914, #e9e4d8);
    --lw-color-muted-foreground: light-dark(#7a6b54, #a89a7e);
    --lw-color-border: light-dark(#e2dccf, #2c261e);
    --lw-editorial-footer-fill: light-dark(#a1773a, #d6b36a)"></lw-editorial-footer>`),
};

// On a phone the columns fold to two and the name shrinks with the width.
export const Narrow = {
  render: (args) => `<div style="max-width: 24rem; margin-inline: auto">${page(`<lw-editorial-footer ${attributes(args)}></lw-editorial-footer>`)}</div>`,
};
