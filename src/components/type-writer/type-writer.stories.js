import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const PHRASES = '<span>Typewriter</span><span>Multiple Words</span><span>Auto Loop</span>';

export default {
  title: 'Texts/Type Writer',
  component: 'lw-type-writer',
  render: (args) => `<lw-type-writer ${attributes(args)} style="font-size: 2.5rem">${PHRASES}</lw-type-writer>`,
  argTypes: {
    'delete-mode': { control: 'inline-radio', options: ['backspace', 'select'] },
    typos: { control: { type: 'range', min: 0, max: 0.3, step: 0.01 } },
  },
  args: {
    'typing-speed': 50,
    'delete-speed': 30,
    pause: 1000,
    'delete-mode': 'backspace',
    typos: 0,
    steady: false,
    'no-loop': false,
    paused: false,
  },
};

export const Default = {};

export const SelectToDelete = { args: { 'delete-mode': 'select' } };

export const WithTypos = { args: { typos: 0.08 } };

// A page title that types its last word once and stays.
export const Headline = {
  render: () => `
    <h1 style="font: 600 2.5rem/1.2 system-ui; margin: 0">
      Build something
      <lw-type-writer no-loop style="font-family: inherit"><span>fast</span><span>beautiful</span><span>yours</span></lw-type-writer>
    </h1>`,
};
