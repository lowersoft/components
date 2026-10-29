import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  title: 'Buttons/Morph Popover',
  component: 'lw-morph-popover',
  parameters: { layout: 'padded' },
  render: (args) => {
    const template = document.createElement('template');
    template.innerHTML = `<div style="height: 16rem; padding: 2rem"><lw-morph-popover ${attributes(args)}></lw-morph-popover></div>`;
    const frame = template.content.firstChild;
    frame.firstChild.addEventListener('lw-submit', (event) => event.detail.waitUntil(wait(700)));
    return frame;
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'end'] },
    width: { control: { type: 'number', step: 10 } },
  },
  args: {
    label: 'Feedback',
    placeholder: 'What would make this better?',
    'sent-label': 'Thanks!',
    align: 'start',
    width: 340,
  },
};

export const Default = {};

export const AlignEnd = {
  args: { align: 'end' },
  render: (args) =>
    `<div style="height: 16rem; padding: 2rem; display: flex; justify-content: flex-end"><lw-morph-popover ${attributes(args)}></lw-morph-popover></div>`,
};
