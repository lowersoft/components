import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const PLANS = `
  <lw-radio value="free" description="For trying it out.">Free</lw-radio>
  <lw-radio value="pro" description="For small teams, billed monthly.">Pro</lw-radio>
  <lw-radio value="enterprise" description="Talk to us." disabled>Enterprise</lw-radio>`;

export default {
  title: 'Inputs/Input/Radio Group',
  component: 'lw-radio-group',
  render: (args) => `<lw-radio-group ${attributes(args)}>${PLANS}</lw-radio-group>`,
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
  },
  args: { label: 'Plan', value: 'pro', orientation: 'vertical', disabled: false },
};

export const Default = {};

export const Disabled = {
  args: { disabled: true },
};

export const Horizontal = {
  render: () => `
    <lw-radio-group label="Size" value="m" orientation="horizontal">
      <lw-radio value="s">Small</lw-radio>
      <lw-radio value="m">Medium</lw-radio>
      <lw-radio value="l">Large</lw-radio>
    </lw-radio-group>`,
};

// Required: the form will not submit until an option is picked.
export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form style="display: grid; gap: 1rem; justify-items: start; font: 0.8125rem system-ui">
        <lw-radio-group name="delivery" label="Delivery" required hint="Express arrives the next working day.">
          <lw-radio value="standard">Standard</lw-radio>
          <lw-radio value="express">Express</lw-radio>
          <lw-radio value="pickup">Pick up in store</lw-radio>
        </lw-radio-group>
        <div style="display: flex; gap: 0.5rem"><button>Submit</button><button type="reset">Reset</button></div>
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
