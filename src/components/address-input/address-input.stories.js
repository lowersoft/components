import './index.js';

export default {
  title: 'Inputs/Input/Address Input',
  component: 'lw-address-input',
};

// Searches the whole world: try "10 downing street", "istiklal caddesi 27" or
// "kurfürstendamm 21 berlin".
export const Default = {
  render: () => '<lw-address-input></lw-address-input>',
};

export const Prefilled = {
  render: () => {
    const field = document.createElement('lw-address-input');
    field.value = { street: '48 Orchard Street', apt: 'Apt 3B', city: 'New York', region: 'NY', postal: '10002', country: 'United States' };
    return field;
  },
};

// Street, city, postal code and country are required; each line is submitted.
export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form style="display: grid; gap: 1rem; justify-items: start; font: 0.8125rem system-ui">
        <lw-address-input name="ship" required></lw-address-input>
        <div style="display: flex; gap: 0.5rem"><button>Continue</button><button type="reset">Reset</button></div>
        <output style="max-width: 440px; font-family: ui-monospace, monospace; word-break: break-all"></output>
      </form>`;
    const form = template.content.firstElementChild;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelector('output').textContent = new URLSearchParams(new FormData(form)).toString();
    });
    return form;
  },
};
