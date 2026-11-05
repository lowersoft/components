import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const FIVE = JSON.stringify([
  { id: 'quill', name: 'Quill', score: 52, caption: 'Easiest to start' },
  { id: 'orbita', name: 'Orbita', score: 67 },
  { id: 'sable', name: 'Sable', score: 93, caption: 'Fastest answers', winner: true },
  { id: 'kestrel', name: 'Kestrel', score: 74 },
  { id: 'arcadia', name: 'Arcadia', score: 61 },
]);

export default {
  title: 'Comparisons/Leader Graph',
  component: 'lw-leader-graph',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-leader-graph ${attributes(args)}></lw-leader-graph>`,
  argTypes: {
    accent: { name: 'Accent', control: 'color' },
  },
  args: {},
};

// Four products; the leader's bar is wider and in the accent color.
export const Default = {};

// Five products, the leader in the middle, in violet.
export const FiveProducts = {
  args: { heading: 'Answer quality, head to head', lede: 'Blind ratings of 400 support conversations each.', 'axis-label': 'Rated helpful (%)', products: FIVE, accent: '#8b5cf6' },
};
