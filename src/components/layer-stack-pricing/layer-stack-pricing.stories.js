import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Pricings/Layer Stack Pricing',
  component: 'lw-layer-stack-pricing',
  parameters: { layout: 'padded' },
  argTypes: {
    billing: { control: 'inline-radio', options: ['monthly', 'yearly'] },
    value: { control: 'inline-radio', options: ['hobby', 'pro', 'team'] },
  },
  render: (args) => `<div style="max-width: 58rem; margin: 3rem auto"><lw-layer-stack-pricing ${attributes(args)}></lw-layer-stack-pricing></div>`,
  args: { billing: 'monthly', value: 'team' },
};

// Choose a plan, or click a layer: those above it lift away and what they add steps back.
export const Default = {};
