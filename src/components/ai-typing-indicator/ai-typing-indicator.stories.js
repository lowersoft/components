import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const PHRASES = JSON.stringify(['Thinking', 'Searching the docs', 'Reading three pages', 'Writing a reply', 'Running the tests']);

export default {
  title: 'Feedback/Status & Progress/AI Typing Indicator',
  component: 'lw-ai-typing-indicator',
  render: ({ cycle, ...args }) => `<lw-ai-typing-indicator ${attributes({ ...args, phrases: cycle ? PHRASES : undefined })}></lw-ai-typing-indicator>`,
  argTypes: {
    variant: { name: 'Variant', control: 'inline-radio', options: ['shimmer', 'wave', 'dots', 'matrix'] },
    label: { name: 'Label' },
    cycle: { name: 'Cycle phrases', control: 'boolean' },
    interval: { name: 'Interval', control: { type: 'range', min: 800, max: 6000, step: 100 } },
    'show-elapsed': { name: 'Show elapsed', control: 'boolean' },
    'no-bubble': { name: 'No bubble', control: 'boolean' },
    size: { name: 'Size', control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { variant: 'shimmer', label: 'Thinking', cycle: true, interval: 2400, 'show-elapsed': true, 'no-bubble': false, size: 'md' },
};

// Steps through what the assistant is doing, each phrase with its own glyph.
export const Default = {};

// All four, side by side.
export const Variants = {
  render: () => {
    const cell = (markup, caption) => `<figure style="display: grid; justify-items: center; gap: 1.25rem; margin: 0">${markup}<figcaption style="font: 0.875rem system-ui, sans-serif; opacity: 0.6">${caption}</figcaption></figure>`;
    return `<div style="display: grid; grid-template-columns: repeat(2, minmax(14rem, 1fr)); gap: 4rem 3rem; align-items: center">
  ${cell('<lw-ai-typing-indicator variant="dots" label="Typing"></lw-ai-typing-indicator>', 'Dots')}
  ${cell(`<lw-ai-typing-indicator phrases='${JSON.stringify(['Searching the web', 'Reading sources'])}' show-elapsed></lw-ai-typing-indicator>`, 'Shimmer')}
  ${cell('<lw-ai-typing-indicator variant="wave" label="Writing a reply" size="lg"></lw-ai-typing-indicator>', 'Wave')}
  ${cell('<lw-ai-typing-indicator variant="matrix" label="Working" size="lg"></lw-ai-typing-indicator>', 'Matrix')}
</div>`;
  },
};
