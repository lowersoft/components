import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Testimonials/Testimonial Spotlight',
  component: 'lw-testimonial-spotlight',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="max-width: 64rem; margin: 4rem auto"><lw-testimonial-spotlight ${attributes(args)}></lw-testimonial-spotlight></div>`,
  args: { index: 0, interval: 7 },
};

// The ring fills, then the next quote comes. Point at it to hold one; the initials and arrows step through.
export const Default = {};
