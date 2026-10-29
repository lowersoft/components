import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Input/Natural Date Input',
  component: 'lw-natural-date-input',
  render: (args) => `<lw-natural-date-input ${attributes(args)}></lw-natural-date-input>`,
  args: { disabled: false },
};

// Try "next fri 3pm", "in 2 weeks", "eod", "dec 24 at noon" or "tomorrow morning", then Enter.
export const Default = {};

export const WithDate = {
  args: { value: '2026-12-24T12:00' },
};

export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form style="display: grid; gap: 1rem; justify-items: start; font: 0.8125rem system-ui">
        <lw-natural-date-input name="due" required></lw-natural-date-input>
        <div style="display: flex; gap: 0.5rem"><button>Create task</button><button type="reset">Reset</button></div>
        <output style="font-family: ui-monospace, monospace"></output>
      </form>`;
    const form = template.content.firstElementChild;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelector('output').textContent = `due=${new FormData(form).get('due')}`;
    });
    return form;
  },
};
