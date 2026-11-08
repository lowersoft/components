import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const IMAGES = JSON.stringify([
  { id: 'free', name: 'Free', tagline: 'Sketch a few ideas.', price: 0, credits: '25 images a month', creditLabel: 'Images', action: 'Start free', features: ['Standard quality', 'Personal use'] },
  { id: 'basic', name: 'Basic', tagline: 'For a steady stream of drafts.', creditLabel: 'Images', credits: [{ label: '200 images', monthly: 8, yearly: 6 }, { label: '500 images', monthly: 16, yearly: 12 }], action: 'Choose Basic', features: ['HD quality', 'Commercial use', 'Private gallery'] },
  { id: 'pro', name: 'Pro', tagline: 'For studios producing every day.', creditLabel: 'Images', credits: [{ label: '1,500 images', monthly: 36, yearly: 29 }, { label: '4,000 images', monthly: 80, yearly: 64 }, { label: '10,000 images', monthly: 180, yearly: 144 }], action: 'Choose Pro', featured: true, features: ['4K quality', 'Brand styles', 'Upscaling', 'Priority queue'] },
  { id: 'enterprise', name: 'Enterprise', tagline: 'Volume, contracts and controls.', price: 'custom', credits: 'Custom volume', creditLabel: 'Images', action: 'Contact sales', features: ['Everything in Pro', 'SSO and audit log', 'Indemnity'] },
]);

export default {
  title: 'Sections/Pricing/Plans/Credit Plan Pricing',
  component: 'lw-credit-plan-pricing',
  parameters: { layout: 'padded' },
  argTypes: { accent: { control: 'color' } },
  render: (args) => `<div style="max-width: 72rem; margin: 3rem auto"><lw-credit-plan-pricing ${attributes(args)}></lw-credit-plan-pricing></div>`,
  args: { yearly: false },
};

// Pick more minutes on Pro and its price reprints; the switch moves every column to yearly.
export const Default = {};

// Two credit ladders, yearly on, in violet.
export const ImageCredits = {
  args: { heading: 'Credits for every image you make', description: 'One credit is one image, at any size.', yearly: true, save: '2 months free', footnote: 'Credits reset on your billing date.', accent: '#7c3aed', plans: IMAGES },
};
