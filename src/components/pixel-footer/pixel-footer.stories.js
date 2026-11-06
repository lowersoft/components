import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Footers/Pixel Footer',
  component: 'lw-pixel-footer',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end"><lw-pixel-footer ${attributes(args)}></lw-pixel-footer></div>`,
  args: {},
};

// Move the mouse across the pixel word and its cells light up, leaning
// towards it. Subscribing here waits a moment, then thanks you.
export const Default = {
  render: (args) => {
    const template = document.createElement('template');
    template.innerHTML = `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end"><lw-pixel-footer ${attributes(args)}></lw-pixel-footer></div>`;
    const wrapper = template.content.firstElementChild;
    wrapper.querySelector('lw-pixel-footer').subscribe = () => new Promise((resolve) => setTimeout(resolve, 900));
    return wrapper;
  },
};

// Another word for the foot, and a colour for the light.
export const Phosphor = {
  render: (args) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end"><lw-pixel-footer ${attributes(args)} logo="" style="--lw-pixel-footer-light: #34d399"></lw-pixel-footer></div>`,
  args: { brand: 'Bytewise', wordmark: 'bytewise', description: 'A debugger that shows you the bytes, the registers and the reason, side by side.' },
};
