import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (inner, width = '68rem') => `<div style="max-width: ${width}; margin: 3rem auto">${inner}</div>`;

export default {
  title: 'Sections/Features/Upload Stage',
  component: 'lw-upload-stage',
  parameters: { layout: 'padded' },
  render: (args) => frame(`<lw-upload-stage ${attributes(args)}></lw-upload-stage>`),
  args: {},
};

// The drop zone works: choose files or drop them on it, and the line under
// the section lists what arrived through lw-files.
export const Default = {
  render: (args) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'max-width: 68rem; margin: 3rem auto';
    wrap.innerHTML = `<lw-upload-stage ${attributes(args)}></lw-upload-stage><p data-files style="margin: 1.5rem 0 0; text-align: center; font: 0.75rem var(--lw-font-mono); color: var(--lw-color-muted-foreground)">No files yet</p>`;
    const output = wrap.querySelector('[data-files]');
    wrap.querySelector('lw-upload-stage').addEventListener('lw-files', (event) => {
      output.textContent = event.detail.files.map((file) => `${file.name} (${Math.max(1, Math.round(file.size / 1024))} KB)`).join(' · ');
    });
    return wrap;
  },
};

// Only crash dumps and symbol files, with a hint that says so.
export const CrashDumps = {
  args: {
    eyebrow: 'Crash desk',
    heading: 'Drop the crash, get the stack',
    description: 'lower symbolicates a crash dump against the build that shipped it and opens the frame that failed.',
    'button-label': 'Add a dump',
    hint: '.dmp, .core and .dSYM up to 4 GB',
    accept: '.dmp,.core,.dsym',
  },
};

// On a phone the three cards stack under the drop zone.
export const Narrow = {
  render: (args) => frame(`<lw-upload-stage ${attributes(args)}></lw-upload-stage>`, '24rem'),
};
