import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Loader',
  component: 'lw-loader',
  render: (args) => `<lw-loader ${attributes(args)}></lw-loader>`,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { size: 'md' },
};

export const Default = {};

export const Sizes = {
  render: () => `
    <div style="display: flex; align-items: center; flex-wrap: wrap">
      <lw-loader size="sm" subtitle=""></lw-loader>
      <lw-loader size="md" subtitle=""></lw-loader>
      <lw-loader size="lg" subtitle=""></lw-loader>
    </div>`,
};

// The rings take the text color.
export const Tinted = {
  render: () => '<lw-loader heading="Deploying" subtitle="Building 3 of 7 functions" style="color: #6366f1"></lw-loader>',
};
