import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  title: 'Buttons/Confirm Delete',
  component: 'lw-confirm-delete-button',
  parameters: { layout: 'padded' },
  render: (args) => {
    const template = document.createElement('template');
    template.innerHTML = `<div style="height: 18rem; padding: 2rem"><lw-confirm-delete-button ${attributes(args)}><p>This deletes <strong>lower-sandbox</strong> with its 128 builds, 3 release channels and all traces. It can't be undone.</p></lw-confirm-delete-button></div>`;
    const frame = template.content.firstElementChild;
    frame.firstElementChild.addEventListener('lw-confirm', (event) => event.detail.waitUntil(wait(1000)));
    return frame;
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'end'] },
    timeout: { control: { type: 'number', step: 1000 } },
  },
  args: {
    label: 'Delete project',
    heading: 'Delete lower-sandbox?',
    'done-label': 'Project deleted',
    timeout: 8000,
    'reset-after': 2400,
  },
};

export const Default = {};

export const TypeToConfirm = { args: { 'confirm-text': 'lower-sandbox' } };
