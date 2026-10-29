import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Buttons/Reaction',
  component: 'lw-reaction-button',
  parameters: { layout: 'padded' },
  render: (args) => {
    const template = document.createElement('template');
    template.innerHTML = `<div style="padding: 6rem 2rem 2rem"><lw-reaction-button ${attributes(args)}></lw-reaction-button></div>`;
    const frame = template.content.firstElementChild;
    frame.firstElementChild.reactions = { '👍': 18, '❤️': 7, '😂': 3, '🙏': 1 };
    return frame;
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { variant: 'outline', size: 'md' },
};

export const Default = {};

export const Reacted = { args: { value: '😮' } };
