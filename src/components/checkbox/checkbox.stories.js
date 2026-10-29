import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Input/Checkbox',
  component: 'lw-checkbox',
  render: ({ label, ...args }) => `<lw-checkbox ${attributes(args)}>${label}</lw-checkbox>`,
  args: { label: 'Remember me', checked: false, indeterminate: false, disabled: false, required: false },
};

export const Default = {};

export const Checked = {
  args: { checked: true },
};

export const Disabled = {
  render: () => `
    <div style="display: grid; gap: 0.75rem">
      <lw-checkbox disabled>Disabled</lw-checkbox>
      <lw-checkbox disabled checked>Disabled and checked</lw-checkbox>
    </div>`,
};

export const WithDescription = {
  args: { label: 'Product updates', description: 'A short email when something new ships. No more than once a month.' },
};

// "Select all" shows a dash while only some of the items are checked.
export const Indeterminate = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <div style="display: grid; gap: 0.75rem">
        <lw-checkbox class="all">All notifications</lw-checkbox>
        <div style="display: grid; gap: 0.75rem; padding-left: 1.625rem">
          <lw-checkbox class="item" checked>Mentions</lw-checkbox>
          <lw-checkbox class="item">Replies</lw-checkbox>
          <lw-checkbox class="item">New followers</lw-checkbox>
        </div>
      </div>`;
    const root = template.content.firstElementChild;
    const all = root.querySelector('.all');
    const items = [...root.querySelectorAll('.item')];
    const update = () => {
      const count = items.filter((item) => item.checked).length;
      all.checked = count === items.length;
      all.indeterminate = count > 0 && count < items.length;
    };
    all.addEventListener('change', () => {
      for (const item of items) item.checked = all.checked;
    });
    for (const item of items) item.addEventListener('change', update);
    update();
    return root;
  },
};

export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form style="display: grid; gap: 0.75rem; justify-items: start; font: 0.8125rem system-ui">
        <lw-checkbox name="newsletter" value="yes">Send me the newsletter</lw-checkbox>
        <lw-checkbox name="terms" required>I agree to the terms</lw-checkbox>
        <div style="display: flex; gap: 0.5rem"><button>Submit</button><button type="reset">Reset</button></div>
        <output style="font-family: ui-monospace, monospace"></output>
      </form>`;
    const form = template.content.firstElementChild;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelector('output').textContent = new URLSearchParams(new FormData(form)).toString() || '(nothing checked)';
    });
    return form;
  },
};
