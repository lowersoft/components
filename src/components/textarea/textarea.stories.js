import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Input/Textarea',
  component: 'lw-textarea',
  render: (args) => `<lw-textarea ${attributes(args)}></lw-textarea>`,
  argTypes: {
    resize: { control: 'inline-radio', options: ['vertical', 'none'] },
  },
  args: { label: 'Message', placeholder: 'Write a message…', rows: 3, disabled: false, readonly: false, required: false },
};

export const Default = {};

export const Disabled = {
  args: { value: 'Thanks for the quick reply. I will send the files tomorrow.', disabled: true },
};

export const ReadOnly = {
  args: { label: 'Terms', value: 'By joining you agree to the workspace rules.\nAdmins can change them at any time.', readonly: true, rows: 2 },
};

export const WithHint = {
  args: { label: 'Bio', placeholder: 'A few lines about you', hint: 'Shown on your public profile.' },
};

export const WithError = {
  args: { label: 'Feedback', value: 'ok', error: 'Tell us a little more: at least 20 characters.' },
};

export const Counter = {
  args: { label: 'Bio', placeholder: 'A few lines about you', maxlength: 160, counter: true },
};

// Grows with the text from 2 lines up to 6, then scrolls.
export const Autosize = {
  args: { label: 'Comment', placeholder: 'Type a few lines…', rows: 2, autosize: true, 'max-rows': 6 },
};

// Required and at least 20 characters; Ctrl+Enter (⌘+Enter) submits.
export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form novalidate style="display: grid; gap: 1rem; justify-items: start; font: 0.8125rem system-ui">
        <lw-textarea name="feedback" label="Feedback" required minlength="20" autosize hint="At least 20 characters."></lw-textarea>
        <div style="display: flex; gap: 0.5rem"><button>Send</button><button type="reset">Reset</button></div>
        <output style="font-family: ui-monospace, monospace"></output>
      </form>`;
    const form = template.content.firstElementChild;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      form.querySelector('output').textContent = `feedback=${new FormData(form).get('feedback')}`;
    });
    return form;
  },
};
