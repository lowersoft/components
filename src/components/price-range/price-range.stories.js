import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Input/Price Range',
  component: 'lw-price-range',
  render: (args) => `<lw-price-range ${attributes(args)}></lw-price-range>`,
  args: { min: 0, max: 1000, step: 10, from: 120, to: 480, currency: 'USD', disabled: false },
};

// Drag a thumb, or the dark stretch between them to slide the window.
export const Default = {};

export const Euros = {
  args: { currency: 'EUR', from: 200, to: 600, label: 'Budget' },
};

export const Disabled = {
  args: { disabled: true },
};

// The submitted range is `price-min` and `price-max`.
export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form style="display: grid; gap: 1rem; justify-items: start; font: 0.8125rem system-ui">
        <lw-price-range name="price" from="100" to="400"></lw-price-range>
        <div style="display: flex; gap: 0.5rem"><button>Apply filter</button><button type="reset">Reset</button></div>
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
