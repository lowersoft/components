import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Buttons/Follow',
  component: 'lw-follow-button',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="height: 14rem; padding: 2rem"><lw-follow-button ${attributes(args)}></lw-follow-button></div>`,
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    notifications: { control: 'inline-radio', options: ['all', 'highlights', 'none'] },
  },
  args: {
    variant: 'primary',
    size: 'md',
    count: 12840,
    following: false,
    notifications: 'all',
  },
};

export const Default = {};

export const Following = { args: { following: true } };
