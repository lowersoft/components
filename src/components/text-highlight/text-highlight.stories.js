import { attributes } from '../../../.storybook/attributes.js';
import '../button/index.js';
import './index.js';

const paragraph = (inner) => `<p style="max-width: 34rem; margin: 0; font: 1.25rem/1.7 var(--lw-font-sans); color: var(--lw-color-foreground)">${inner}</p>`;

export default {
  title: 'Effects/Text/Accents/Text Highlight',
  component: 'lw-text-highlight',
  parameters: { layout: 'centered' },
  render: (args) => paragraph(`Most interfaces feel unfinished because of the details. <lw-text-highlight ${attributes(args)}>Motion, focus and empty states are where polish actually lives</lw-text-highlight>, long after the layout is done.`),
  argTypes: {
    color: { name: 'Color', control: 'color' },
    opacity: { name: 'Opacity', control: { type: 'range', min: 0.1, max: 1, step: 0.05 } },
    duration: { name: 'Duration', control: { type: 'range', min: 0, max: 3, step: 0.1 } },
    delay: { name: 'Delay', control: { type: 'range', min: 0, max: 2, step: 0.1 } },
    trigger: { name: 'Trigger', control: 'inline-radio', options: ['view', 'hover', 'mount', 'manual'] },
    drawn: { name: 'Drawn (manual)', control: 'boolean' },
    padding: { name: 'Padding', control: { type: 'range', min: 0, max: 10, step: 1 } },
  },
  args: { opacity: 0.4, duration: 0.9, delay: 0.2, trigger: 'view', drawn: false, padding: 2 },
};

// Sweeps in when it comes into view, carrying on across the line break.
export const Default = {};

// Several marks in different colors, each drawn on hover.
export const OnHover = {
  render: () =>
    paragraph(
      `Hover the marks: <lw-text-highlight trigger="hover">plain web components</lw-text-highlight>, <lw-text-highlight trigger="hover" color="#4ade80" opacity="0.35">themed with tokens</lw-text-highlight> and <lw-text-highlight trigger="hover" color="#f472b6" opacity="0.3">accessible by default</lw-text-highlight>.`,
    ),
};

// Drawn from code.
export const Manual = {
  render: () =>
    `<div style="display: grid; gap: 1.25rem; justify-items: start">${paragraph('Ship the release on <lw-text-highlight id="mark-manual" trigger="manual" color="#60a5fa" opacity="0.35">Thursday at noon</lw-text-highlight>, after the freeze.')}<lw-button variant="secondary" onclick="const m = document.getElementById('mark-manual'); m.drawn = !m.drawn">Toggle highlight</lw-button></div>`,
};
