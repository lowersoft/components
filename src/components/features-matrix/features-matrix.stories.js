import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const PLANS = JSON.stringify([
  { id: 'lumen', name: 'Lumen', mark: 'lumen', href: '#' },
  { id: 'quill', name: 'Quill', mark: 'quill', href: '#' },
  { id: 'orbita', name: 'Orbita', mark: 'orbita', href: '#' },
  { id: 'kestrel', name: 'Kestrel', mark: 'kestrel', href: '#' },
]);

const ROWS = JSON.stringify([
  { id: 'storage', title: 'Storage', description: 'Included per workspace', values: { lumen: '1 TB', quill: '100 GB', orbita: '500 GB', kestrel: '250 GB' } },
  { id: 'price', title: 'Price', description: 'Per user, per month', values: { lumen: '$14', quill: '$8', orbita: '$12', kestrel: '$10' } },
  { id: 'sso', title: 'Single sign-on', description: 'SAML login', values: { lumen: true, quill: false, orbita: true, kestrel: false } },
  { id: 'guests', title: 'Guest seats', description: 'Free outside collaborators', values: { lumen: '25', quill: '5', orbita: 'Unlimited', kestrel: '10' } },
]);

export default {
  title: 'Comparisons/Features Matrix',
  component: 'lw-features-matrix',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-features-matrix ${attributes(args)}></lw-features-matrix>`,
  args: {},
};

// Three products, feature by feature; the best in each row stands out.
export const Default = {};

// Four linked products and your own rows. A row mixing a number with
// "Unlimited" is not ranked.
export const FourProducts = {
  render: (args) => `<lw-features-matrix ${attributes(args)} lede=""></lw-features-matrix>`,
  args: { heading: 'How the plans compare', products: PLANS, rows: ROWS },
};
