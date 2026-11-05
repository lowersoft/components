import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const page = (footer) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end">${footer}</div>`;

export default {
  title: 'Footers/Signup Footer',
  component: 'lw-signup-footer',
  parameters: { layout: 'fullscreen' },
  render: (args) => page(`<lw-signup-footer ${attributes(args)}></lw-signup-footer>`),
  argTypes: {
    readers: { name: 'Readers', control: { type: 'number', min: 0, step: 10 } },
    status: { name: 'Status', control: 'inline-radio', options: ['normal', 'degraded', 'outage', ''] },
    wordmark: { name: 'Wordmark', control: 'boolean' },
    accent: { name: 'Accent', control: 'color' },
  },
  args: { brand: 'Lower', readers: 12480, status: 'normal', wordmark: false },
};

// Subscribe with an address. Sending nothing, or half an address, says why;
// success thanks the reader and counts them in.
export const Default = {};

// The sign-up waits on a real request: this one takes a second and turns
// away addresses at example.com.
export const WithRequest = {
  render: (args) => {
    queueMicrotask(() => {
      const footer = document.querySelector('#signup-request');
      footer.subscribe = (email) =>
        new Promise((resolve, reject) =>
          setTimeout(() => (email.endsWith('@example.com') ? reject(new Error('Example addresses cannot subscribe. Try your work email.')) : resolve()), 1000),
        );
    });
    return page(`<lw-signup-footer id="signup-request" ${attributes(args)}></lw-signup-footer>`);
  },
};

// Closes the page with the brand name, oversized and fading out.
export const Wordmark = {
  args: { wordmark: true },
};

// Another brand in another color, mid-incident, without a reader count.
export const Northline = {
  args: {
    brand: 'Northline',
    tagline: 'Route planning for fleets that cannot afford to be late.',
    eyebrow: 'The Dispatch',
    heading: 'Better routes, every other Thursday',
    description: 'Field notes from dispatch teams, product updates and the occasional benchmark.',
    readers: 0,
    'button-label': 'Join',
    status: 'degraded',
    accent: '#14b8a6',
  },
};
