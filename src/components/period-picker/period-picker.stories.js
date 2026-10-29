import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Input/Period Picker',
  component: 'lw-period-picker',
  render: (args) => `<lw-period-picker ${attributes(args)}></lw-period-picker>`,
  args: { compare: true },
};

// Pick a preset, or a first and a last day; the band follows the pointer. Compare adds the period before.
export const Default = {};
