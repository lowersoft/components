import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Forms/Stepper Form',
  component: 'lw-stepper-form',
  render: (args) => `<lw-stepper-form ${attributes(args)}></lw-stepper-form>`,
  args: {},
};

// Fill a step and press Enter: it is checked, folds into a summary, and the next one opens.
export const Default = {};
