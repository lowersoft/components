import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const page = (footer) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end">${footer}</div>`;

export default {
  title: 'Footers/Signup Footer',
  component: 'lw-signup-footer',
  parameters: { layout: 'fullscreen' },
  render: (args) => page(`<lw-signup-footer ${attributes(args)}></lw-signup-footer>`),
  argTypes: {
    accent: { name: 'Accent', control: 'color' },
  },
  args: { brand: 'Lower' },
};

// Subscribe with an address. Sending nothing, or half an address, says why.
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

// Another brand in another color.
export const Teal = {
  args: {
    brand: 'Northline',
    tagline: 'Routing for fleets that cannot be late.',
    heading: 'The dispatch: route-planning tips and release notes, twice a month.',
    'button-label': 'Join',
    accent: '#14b8a6',
  },
};
