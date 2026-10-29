import { appFrame } from '../../../.storybook/app-frame.js';
import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Banners/Sale Strip Banner',
  component: 'lw-sale-strip-banner',
  parameters: { layout: 'padded' },
  render: (args) => appFrame(`<lw-sale-strip-banner ${attributes(args)}></lw-sale-strip-banner>`),
  args: { offer: '30% off', code: 'LOWER30' },
};

// Press the coupon to copy it; the countdown's digits roll. Works in both schemes.
export const Default = {};
