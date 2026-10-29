import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Navigation/Morphic Navbar',
  component: 'lw-morphic-navbar',
  render: (args) => `<lw-morphic-navbar ${attributes(args)}></lw-morphic-navbar>`,
  args: { compact: false },
};

// Click a link, or drag across the bar and flick to throw the split.
export const Default = {};

export const ActiveLink = {
  args: { value: '#blog' },
};

// Scroll the page: past 80px the bar folds to the active link and a chevron.
export const Compact = {
  parameters: { layout: 'fullscreen' },
  render: () => `
    <div style="height: 200vh">
      <lw-morphic-navbar compact style="position: sticky; top: 1rem"></lw-morphic-navbar>
      <p style="text-align: center; font: 14px system-ui; color: #71717a">Scroll down</p>
    </div>`,
};
