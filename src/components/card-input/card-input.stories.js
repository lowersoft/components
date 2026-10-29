import './index.js';

export default {
  title: 'Inputs/Input/Card Input',
  component: 'lw-card-input',
};

// Test numbers: 4242 4242 4242 4242 (Visa), 5555 5555 5555 4444
// (Mastercard), 3782 822463 10005 (American Express), 6011 1111 1111 1117
// (Discover). Any future expiry works.
export const Default = {
  render: () => '<lw-card-input></lw-card-input>',
};

// Only a complete card is submitted.
export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form style="display: grid; gap: 0.75rem; justify-items: start; font: 0.8125rem system-ui">
        <lw-card-input name="card" required></lw-card-input>
        <button>Pay</button>
        <output style="font-family: ui-monospace, monospace"></output>
      </form>`;
    const form = template.content.firstElementChild;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelector('output').textContent = [...new FormData(form)].map(([key, value]) => `${key}=${value}`).join(' ');
    });
    return form;
  },
};
