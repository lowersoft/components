import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  title: 'Buttons/Particle',
  component: 'lw-particle-button',
  render: ({ label, outcome, ...args }) => {
    const template = document.createElement('template');
    template.innerHTML = `<lw-particle-button ${attributes(args)}>${label}</lw-particle-button>`;
    const button = template.content.firstChild;
    button.addEventListener('lw-action', (event) => {
      if (outcome === 'instant') return;
      event.detail.waitUntil(
        wait(1200).then(() => {
          if (outcome === 'error') throw new Error('Request failed');
        }),
      );
    });
    return button;
  },
  argTypes: {
    outcome: { control: 'inline-radio', options: ['success', 'error', 'instant'] },
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    label: 'Save changes',
    outcome: 'success',
    variant: 'primary',
    size: 'md',
    'pending-label': 'Saving',
    'success-label': 'Saved',
    'error-label': 'Try again',
    'no-particles': false,
    disabled: false,
  },
};

export const Default = {};

export const Failure = { args: { outcome: 'error' } };

export const Variants = {
  render: () => `
    <div style="display: flex; gap: 0.75rem">
      <lw-particle-button>Primary</lw-particle-button>
      <lw-particle-button variant="secondary">Secondary</lw-particle-button>
      <lw-particle-button variant="outline">Outline</lw-particle-button>
      <lw-particle-button variant="ghost">Ghost</lw-particle-button>
    </div>`,
};
