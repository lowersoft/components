import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Input/Password Input',
  component: 'lw-password-input',
  render: (args) => `<lw-password-input ${attributes(args)}></lw-password-input>`,
  args: { label: 'Password', minlength: 8, disabled: false },
};

// Hold the eye to peek; meet every rule to fold the list away.
export const Default = {};

export const Strong = {
  args: { value: 'Tide-Mint-42!river' },
};

export const Disabled = {
  args: { value: 'secret', disabled: true },
};

// A password that misses a rule does not submit.
export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form style="display: grid; gap: 1rem; justify-items: start; font: 0.8125rem system-ui">
        <lw-password-input name="password" required minlength="10"></lw-password-input>
        <div style="display: flex; gap: 0.5rem"><button>Create account</button><button type="reset">Reset</button></div>
        <output style="font-family: ui-monospace, monospace"></output>
      </form>`;
    const form = template.content.firstElementChild;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      form.querySelector('output').textContent = 'Account created.';
    });
    return form;
  },
};
