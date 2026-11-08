import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Sections/Footers/Signature Footer',
  component: 'lw-signature-footer',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end"><lw-signature-footer ${attributes(args)}></lw-signature-footer></div>`,
  args: {},
};

// The name at the foot writes itself in when it comes into view; move the
// mouse across it and its outline takes colour.
export const Default = {};

// A warm colour for the outline under the mouse.
export const Ember = {
  render: (args) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end"><lw-signature-footer ${attributes(args)} logo="" style="--lw-signature-footer-from: #f97316; --lw-signature-footer-to: #facc15"></lw-signature-footer></div>`,
  args: { brand: 'Firmware', description: 'Bootloaders, drivers and over-the-air updates for devices that cannot afford to fail.' },
};
