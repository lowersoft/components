import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Input/Handle Input',
  component: 'lw-handle-input',
  render: (args) => `<lw-handle-input ${attributes(args)}></lw-handle-input>`,
  args: { prefix: 'lowersoft.dev/', label: 'Workspace URL', placeholder: 'your-team' },
};

// Try "Lower Dev!" (rewritten as you type) or a taken name like "studio".
export const Default = {};

// A real check against your API; here, anything with "x" in it is taken.
export const CustomCheck = {
  render: () => {
    const field = document.createElement('lw-handle-input');
    Object.assign(field, { prefix: 'lowersoft.dev/', value: 'xylo' });
    field.checkAvailability = (handle, { signal }) =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => resolve(!handle.includes('x')), 500);
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(signal.reason);
        });
      });
    return field;
  },
};

// The form submits the handle once it is known to be free.
export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form style="display: grid; gap: 0.75rem; justify-items: start; font: 0.8125rem system-ui">
        <lw-handle-input name="handle" required></lw-handle-input>
        <button>Claim</button>
        <output style="font-family: ui-monospace, monospace"></output>
      </form>`;
    const form = template.content.firstElementChild;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelector('output').textContent = `handle=${new FormData(form).get('handle')}`;
    });
    return form;
  },
};
