import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Date Range Picker',
  component: 'lw-date-range-picker',
  render: (args) => `<lw-date-range-picker ${attributes(args)}></lw-date-range-picker>`,
  argTypes: {
    'week-start': { control: 'inline-radio', options: [0, 1] },
  },
  args: { start: '2026-10-09', end: '2026-10-15', locale: 'en-US', 'week-start': 0 },
};

export const Default = {};

export const Empty = {
  args: { start: '', end: '' },
};

// Monday first, British names, and only the past year can be picked.
export const Bounded = {
  args: { locale: 'en-GB', 'week-start': 1, min: '2025-10-17', max: '2026-10-17' },
};

// The applied range is submitted as an ISO interval.
export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form style="display: grid; gap: 0.75rem; justify-items: start; font: 0.8125rem system-ui">
        <lw-date-range-picker name="period" start="2026-10-01" end="2026-10-16"></lw-date-range-picker>
        <button>Submit</button>
        <output style="font-family: ui-monospace, monospace"></output>
      </form>`;
    const form = template.content.firstElementChild;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelector('output').textContent = `period=${new FormData(form).get('period')}`;
    });
    return form;
  },
};
