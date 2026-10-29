import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Input/Phone Input',
  component: 'lw-phone-input',
  render: (args) => `<lw-phone-input ${attributes(args)}></lw-phone-input>`,
  argTypes: {
    country: { control: 'text' },
  },
  // A few countries show as not served, to show the disabled state.
  args: { country: 'US', unavailable: 'RU,BY,IR,KP,SY,CU' },
};

// Try pasting "+44 7700 900123" or "+90 532 123 45 67": the country follows.
export const Default = {};

export const Prefilled = {
  args: { value: '+905321234567' },
};

// The form submits the number in E.164 form, and only a mobile.
export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form style="display: grid; gap: 0.75rem; justify-items: start; font: 0.8125rem system-ui">
        <lw-phone-input name="phone" country="GB" required></lw-phone-input>
        <button>Continue</button>
        <output style="font-family: ui-monospace, monospace"></output>
      </form>`;
    const form = template.content.firstElementChild;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelector('output').textContent = `phone=${new FormData(form).get('phone')}`;
    });
    return form;
  },
};
