import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const withCheck = (code) => (element) => {
  element.verify = (entered) => new Promise((resolve) => setTimeout(() => resolve(entered === code), 500));
  return element;
};

export default {
  title: 'Inputs/Input/Verification Code',
  component: 'lw-verification-code',
  render: (args) => {
    const template = document.createElement('template');
    template.innerHTML = `<lw-verification-code ${attributes(args)}></lw-verification-code>`;
    return withCheck('424242')(template.content.firstElementChild);
  },
  args: { length: 6, type: 'numeric', disabled: false },
};

// The right code is 424242; anything else shakes and clears.
export const Default = {};

// Letters and digits, uppercased; the right code is AB12CD.
export const Alphanumeric = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = '<lw-verification-code type="alphanumeric"></lw-verification-code>';
    return withCheck('AB12CD')(template.content.firstElementChild);
  },
};

export const FourDigits = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = '<lw-verification-code length="4"></lw-verification-code>';
    return withCheck('2024')(template.content.firstElementChild);
  },
};

export const Disabled = {
  args: { disabled: true },
};
