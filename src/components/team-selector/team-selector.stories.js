import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Team Selector',
  component: 'lw-team-selector',
  render: (args) => `<lw-team-selector ${attributes(args)}></lw-team-selector>`,
  argTypes: {
    value: { control: { type: 'number', min: 1, max: 12 } },
  },
  args: { value: 3, min: 1, max: 12 },
};

export const Default = {};

// The monthly total rolls along with the seats.
export const Priced = {
  args: { value: 4, 'price-per-seat': 24 },
};

export const CustomMembers = {
  args: {
    value: 2,
    members: JSON.stringify([
      { id: 'a', name: 'Ada Lovelace' },
      { id: 'b', name: 'Grace Hopper' },
    ]),
  },
};
