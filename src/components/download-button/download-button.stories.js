import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const SIZE = 2_400_000;
const CHUNK = 60_000;

// A slow, in-memory file, so the demo shows its progress without a server.
const slowFile = (bytesPerSecond) => {
  let sent = 0;
  const body = new ReadableStream({
    async pull(controller) {
      await new Promise((resolve) => setTimeout(resolve, (CHUNK / bytesPerSecond) * 1000));
      const size = Math.min(CHUNK, SIZE - sent);
      controller.enqueue(new Uint8Array(size));
      sent += size;
      if (sent >= SIZE) controller.close();
    },
  });
  return new Response(body, { headers: { 'content-length': String(SIZE), 'content-type': 'application/pdf' } });
};

export default {
  title: 'Buttons/Download',
  component: 'lw-download-button',
  render: ({ speed, fail, ...args }) => {
    const template = document.createElement('template');
    template.innerHTML = `<lw-download-button ${attributes(args)}></lw-download-button>`;
    const button = template.content.firstElementChild;
    button.addEventListener('lw-start', (event) =>
      event.detail.respondWith(fail ? Promise.reject(new Error('Network error')) : slowFile(speed)),
    );
    // The demo file is empty, so it is not saved to the visitor's downloads.
    button.addEventListener('lw-complete', (event) => event.preventDefault());
    return button;
  },
  argTypes: {
    speed: { control: { type: 'range', min: 200_000, max: 2_000_000, step: 100_000 } },
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline'] },
  },
  args: {
    filename: 'Q3-report.pdf',
    type: 'PDF',
    size: SIZE,
    variant: 'outline',
    speed: 600_000,
    fail: false,
  },
};

export const Default = {};

export const Failure = { args: { fail: true } };
