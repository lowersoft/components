import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Sections/Social Proof/Customer Stories',
  component: 'lw-customer-stories',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="max-width: 68rem; margin: 3rem auto"><lw-customer-stories ${attributes(args)}></lw-customer-stories></div>`,
  args: { value: '' },
};

// Pick a company, or use the arrow keys on the tabs: the outline glides and
// the story slides in from that side.
export const Default = {};

// Opens on a story other than the first.
export const OpenOnAStory = {
  args: { value: 'lumen' },
};

// On a phone the tabs scroll sideways and the portrait sits above the story.
export const Narrow = {
  render: (args) => `<div style="max-width: 24rem; margin: 2rem auto"><lw-customer-stories ${attributes(args)}></lw-customer-stories></div>`,
};
