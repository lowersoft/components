import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Testimonials/Testimonial Grid',
  component: 'lw-testimonial-grid',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="max-width: 64rem; margin: 3rem auto"><lw-testimonial-grid ${attributes(args)}></lw-testimonial-grid></div>`,
  args: { filter: '' },
};

// Filter by kind of story: the cards that stay glide to their new places.
export const Default = {};
