import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const GITHUB =
  '<svg slot="provider" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5Z"/></svg>';

export default {
  title: 'Buttons/Connect',
  component: 'lw-connect-button',
  render: ({ outcome, label, ...args }) => {
    const template = document.createElement('template');
    template.innerHTML = `<lw-connect-button ${attributes(args)}>${GITHUB}${label}</lw-connect-button>`;
    const button = template.content.firstElementChild;
    button.addEventListener('lw-connect', (event) =>
      event.detail.waitUntil(
        wait(1600).then(() => {
          if (outcome === 'error') throw new Error('Denied');
          return '@dana';
        }),
      ),
    );
    return button;
  },
  argTypes: {
    outcome: { control: 'inline-radio', options: ['connected', 'error'] },
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    label: 'Connect GitHub',
    outcome: 'connected',
    variant: 'outline',
    size: 'lg',
  },
};

export const Default = {};

export const AlreadyConnected = { args: { status: 'connected', account: '@dana' } };

export const Failure = { args: { outcome: 'error' } };
