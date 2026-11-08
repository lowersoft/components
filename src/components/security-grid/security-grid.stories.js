import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (inner, width = '64rem') => `<div style="max-width: ${width}; margin: 3rem auto">${inner}</div>`;

export default {
  title: 'Sections/Features/Security Grid',
  component: 'lw-security-grid',
  parameters: { layout: 'padded' },
  render: (args) => frame(`<lw-security-grid ${attributes(args)}></lw-security-grid>`),
  args: {},
};

// Point at a card: the vault wheel turns, a runner's token expires, the seal
// stamps, the masks sweep, the gate fills and the sandbox's dashes march.
export const Default = {};

// With a line under the heading and links of your own as the actions.
export const WithLinks = {
  args: { description: 'lower signs, sandboxes and records every build, so a security review takes an afternoon instead of a quarter.' },
  render: (args) =>
    frame(`<lw-security-grid ${attributes(args)}><div slot="actions" style="display: flex; gap: 1.25rem; font: 500 0.875rem var(--lw-font-sans)"><a href="#trust" style="color: inherit">Visit the trust centre</a><a href="#docs" style="color: var(--lw-color-muted-foreground)">Read the docs</a></div></lw-security-grid>`),
};

// On a tablet the grid folds into two columns, on a phone into one.
export const Narrow = {
  render: (args) => frame(`<lw-security-grid ${attributes(args)}></lw-security-grid>`, '24rem'),
};
