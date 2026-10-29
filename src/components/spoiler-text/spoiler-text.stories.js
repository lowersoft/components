import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const TEXT = 'font: 15px/1.6 system-ui; max-width: 28rem';

export default {
  title: 'Texts/Spoiler Text',
  component: 'lw-spoiler-text',
  render: (args) =>
    `<p style="${TEXT}">Same. When it turned out <lw-spoiler-text ${attributes(args)}>the lighthouse keeper had been writing the letters all along</lw-spoiler-text> I had to pause it for a minute.</p>`,
  args: { revealed: false },
};

export const Default = {};

// A chat where two messages hide a spoiler; "Hide again" puts the specks back.
export const Chat = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <div style="${TEXT}; display: grid; gap: 0.75rem">
        <p style="margin: 0"><b>Maya</b> Finished the finale last night. I'm still not over it.</p>
        <p style="margin: 0"><b>Jun</b> Same. When it turned out <lw-spoiler-text>the lighthouse keeper had been writing the letters all along</lw-spoiler-text> I had to pause it for a minute.</p>
        <p style="margin: 0"><b>You</b> Don't. I'm two episodes behind and I know someone <lw-spoiler-text>doesn't make it off the island</lw-spoiler-text> already.</p>
        <button type="button" style="justify-self: start">Hide again</button>
      </div>`;
    const frame = template.content.firstElementChild;
    frame.querySelector('button').addEventListener('click', () => {
      frame.querySelectorAll('lw-spoiler-text').forEach((spoiler) => (spoiler.revealed = false));
    });
    return frame;
  },
};
