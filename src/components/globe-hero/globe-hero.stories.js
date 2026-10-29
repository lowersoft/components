import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Heroes/Globe Hero',
  component: 'lw-globe-hero',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-globe-hero ${attributes(args)}></lw-globe-hero>`,
  args: { heading: 'Every build runs next door.', region: '', paused: false },
};

// Drag the globe to spin it; click a region to bring it to the front and light its routes.
export const Default = {};
