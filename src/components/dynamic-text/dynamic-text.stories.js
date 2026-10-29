import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const words = (list) => list.map(([text, lang]) => `<span${lang ? ` lang="${lang}"` : ''}>${text}</span>`).join('');

const MORPH = words([['Create'], ['Iterate'], ['Repeat'], ['Ship']]);
const DECODE = words([['Hello, world'], ['Build 4096 ready'], ['All systems go']]);
const GREETINGS = words([
  ['Hello', 'en'],
  ['こんにちは', 'ja'],
  ['Bonjour', 'fr'],
  ['Hola', 'es'],
  ['안녕하세요', 'ko'],
  ['Ciao', 'it'],
  ['Hallo', 'de'],
  ['Hello', 'en'],
]);

export default {
  title: 'Texts/Dynamic Text',
  component: 'lw-dynamic-text',
  render: (args) => `<lw-dynamic-text ${attributes(args)} style="font: 600 3rem/1.2 system-ui">${MORPH}</lw-dynamic-text>`,
  argTypes: {
    interval: { control: { type: 'number', step: 100 } },
  },
  args: { interval: 2200, 'no-loop': false },
};

export const Morph = {};

export const Decode = {
  render: () => `<lw-dynamic-text mode="decode" style="font-size: 2rem">${DECODE}</lw-dynamic-text>`,
};

// The greeting rhythm: a long first word, faster middle words, a hold on the last.
export const Cycle = {
  render: () => `<lw-dynamic-text mode="cycle" no-loop style="font: 600 3rem/1.2 system-ui">${GREETINGS}</lw-dynamic-text>`,
};

// Driven by `text`: digits roll like a counter as the price changes.
export const Price = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <div style="display: grid; gap: 1rem; justify-items: center">
        <lw-dynamic-text text="$1,299" style="font: 600 3rem/1.2 system-ui"></lw-dynamic-text>
        <button type="button">Change plan</button>
      </div>`;
    const frame = template.content.firstElementChild;
    const text = frame.querySelector('lw-dynamic-text');
    const prices = ['$1,299', '$2,450', '$999', '$12,000'];
    let i = 0;
    frame.querySelector('button').addEventListener('click', () => (text.text = prices[++i % prices.length]));
    return frame;
  },
};
