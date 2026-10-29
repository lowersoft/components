import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Input/Mention Input',
  component: 'lw-mention-input',
  render: (args) => `<lw-mention-input ${attributes(args)}></lw-mention-input>`,
  args: { disabled: false },
};

// Type "@" and a name; Ctrl+Enter (⌘+Enter) sends.
export const Default = {};

export const Disabled = {
  args: { disabled: true },
};

// Sent comments land in a list, with who was notified.
export const Thread = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <div style="display: grid; gap: 0.75rem; width: 440px; font: 0.8125rem system-ui">
        <ul class="sent" style="display: grid; gap: 0.5rem; margin: 0; padding: 0; list-style: none"></ul>
        <lw-mention-input></lw-mention-input>
      </div>`;
    const root = template.content.firstElementChild;
    root.querySelector('lw-mention-input').addEventListener('lw-send', ({ detail }) => {
      const item = document.createElement('li');
      item.textContent = detail.text;
      if (detail.mentions.length) item.title = `Notified ${detail.mentions.map(({ name }) => name).join(', ')}`;
      root.querySelector('.sent').append(item);
    });
    return root;
  },
};
