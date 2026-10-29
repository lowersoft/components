import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Input/Number Input',
  component: 'lw-number-input',
  render: (args) => `<lw-number-input ${attributes(args)}></lw-number-input>`,
  args: { label: 'Guests', value: '2', min: 1, max: 10, disabled: false, readonly: false },
};

export const Default = {};

export const Disabled = {
  args: { disabled: true },
};

export const Decimal = {
  args: { label: 'Weight (kg)', value: '2.5', min: 0, max: 50, step: 0.5, hint: 'In steps of half a kilo.' },
};

export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form style="display: grid; gap: 1rem; justify-items: start; font: 0.8125rem system-ui">
        <lw-number-input name="seats" label="Seats" value="3" min="1" max="20" required></lw-number-input>
        <div style="display: flex; gap: 0.5rem"><button>Submit</button><button type="reset">Reset</button></div>
        <output style="font-family: ui-monospace, monospace"></output>
      </form>`;
    const form = template.content.firstElementChild;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelector('output').textContent = new URLSearchParams(new FormData(form)).toString();
    });
    return form;
  },
};
