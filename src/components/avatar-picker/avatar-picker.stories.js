import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Avatar Picker',
  component: 'lw-avatar-picker',
  render: (args) => `<lw-avatar-picker ${attributes(args)}></lw-avatar-picker>`,
  args: { 'display-name': 'Robin Vale', variant: 0 },
};

export const Default = {};

// In a form, the avatar seed is submitted under `name`.
export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form style="display: grid; gap: 0.75rem; justify-items: start">
        <lw-avatar-picker name="avatar" display-name="Sam Rivers"></lw-avatar-picker>
        <output style="font: 0.8125rem ui-monospace, monospace"></output>
      </form>`;
    const form = template.content.firstElementChild;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelector('output').textContent = `avatar=${new FormData(form).get('avatar')}`;
    });
    return form;
  },
};
