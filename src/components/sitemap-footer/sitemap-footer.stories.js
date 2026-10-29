import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Footers/Sitemap Footer',
  component: 'lw-sitemap-footer',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end"><lw-sitemap-footer ${attributes(args)}></lw-sitemap-footer></div>`,
  args: { brand: 'Lower' },
};

// Press / and type: links that do not match step back. Enter opens the first match.
export const Default = {};
