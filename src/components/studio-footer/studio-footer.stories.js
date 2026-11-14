import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const page = (markup) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end; background: var(--lw-color-background)">${markup}</div>`;

export default {
  title: 'Sections/Footers/Studio Footer',
  component: 'lw-studio-footer',
  parameters: { layout: 'fullscreen' },
  render: (args) => page(`<lw-studio-footer ${attributes(args)}></lw-studio-footer>`),
  args: {},
};

// Hover the links: one soft highlight slides between them, across the
// columns too. Resize the page and the name across the foot keeps to the
// width beside the sign-off, or the whole width on a phone.
export const Default = {};

// Another brand, set as text without a logo, with its own colour for the
// square, one credit and no social links.
export const TextBrand = {
  render: (args) => page(`<lw-studio-footer ${attributes(args)} mark="" logo="" socials="[]" style="--lw-studio-footer-square: #2563eb; --lw-studio-footer-underline: #2563eb"></lw-studio-footer>`),
  args: {
    brand: 'Syscall',
    company: 'Syscall Labs',
    email: 'team@syscall.dev',
    tagline: 'Tracing for the kernel and everything above it, with overhead you will not find in a profile.',
    credits: JSON.stringify([{ name: 'Syscall Labs' }]),
    columns: JSON.stringify([
      { title: 'Product', links: [{ label: 'Tracing', href: '/tracing' }, { label: 'Profiles', href: '/profiles' }, { label: 'Pricing', href: '/pricing' }] },
      { title: 'Developers', links: [{ label: 'Docs', href: '/docs' }, { label: 'API', href: '/api' }, { label: 'Status', href: 'https://status.syscall.dev', external: true }] },
    ]),
  },
};
