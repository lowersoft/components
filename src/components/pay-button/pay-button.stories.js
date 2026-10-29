import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  title: 'Buttons/Pay',
  component: 'lw-pay-button',
  render: ({ outcome, ...args }) => {
    const template = document.createElement('template');
    template.innerHTML = `<lw-pay-button ${attributes(args)}></lw-pay-button>`;
    const button = template.content.firstChild;
    button.addEventListener('lw-action', (event) => {
      event.detail.waitUntil(
        wait(1400).then(() => {
          if (outcome === 'declined') throw new Error('Card declined');
        }),
      );
    });
    return button;
  },
  argTypes: {
    outcome: { control: 'inline-radio', options: ['paid', 'declined'] },
    amount: { control: { type: 'number', step: 1 } },
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    outcome: 'paid',
    amount: 49,
    currency: 'USD',
    card: '4242',
    variant: 'primary',
    size: 'lg',
  },
};

export const Default = {};

export const Declined = { args: { outcome: 'declined' } };

// Changing the quantity changes the total, and the digits roll.
export const ChangingTotal = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <div style="display: grid; gap: 1rem; justify-items: center">
        <label style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.875rem">
          Seats <input type="number" min="1" max="250" value="3" style="width: 4rem">
        </label>
        <lw-pay-button amount="87" card="4242" size="lg"></lw-pay-button>
      </div>`;
    const frame = template.content.firstElementChild;
    const input = frame.querySelector('input');
    const button = frame.querySelector('lw-pay-button');
    input.addEventListener('input', () => (button.amount = Number(input.value) * 29));
    button.addEventListener('lw-action', (event) => event.detail.waitUntil(wait(1400)));
    return frame;
  },
};
