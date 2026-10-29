import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Testimonials/Annotated Quote',
  component: 'lw-annotated-quote',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="max-width: 72rem; margin: 4rem auto"><lw-annotated-quote ${attributes(args)}></lw-annotated-quote></div>`,
  args: { active: 0 },
};

// Point at a numbered phrase, or its card: the two light up together.
export const Default = {};
