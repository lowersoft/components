import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const page = (inner) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end">${inner}</div>`;

export default {
  title: 'Sections/Footers/Four Column Footer',
  component: 'lw-four-column-footer',
  parameters: { layout: 'fullscreen' },
  render: (args) => page(`<lw-four-column-footer ${attributes(args)}></lw-four-column-footer>`),
  args: {},
};

// Move the mouse across the name at the foot and an orange light follows it.
export const Default = {};

// Without a logo the brand's initial and name lead, and the name at the
// foot is the brand's; the logo colours stay.
export const Plain = {
  render: (args) => page(`<lw-four-column-footer ${attributes(args)} logo=""></lw-four-column-footer>`),
  args: { wordmark: 'lower', description: 'A native build tool for C, C++ and Rust. One build file, every platform, the same binary from a laptop and from CI.' },
};

// On a phone the columns pair up and the stamp follows them.
export const Narrow = {
  render: (args) => `<div style="max-width: 24rem; margin-inline: auto">${page(`<lw-four-column-footer ${attributes(args)}></lw-four-column-footer>`)}</div>`,
};
