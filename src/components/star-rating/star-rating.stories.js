import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const TONES = ['gold', 'silver', 'ember', 'rose', 'violet'];

export default {
  title: 'Controls/Choices/Star Rating',
  component: 'lw-star-rating',
  parameters: { layout: 'centered' },
  render: (args) => `<lw-star-rating ${attributes(args)}></lw-star-rating>`,
  argTypes: {
    value: { name: 'Value', control: { type: 'number', min: 0, max: 10, step: 0.1 } },
    max: { name: 'Max', control: { type: 'range', min: 3, max: 10, step: 1 } },
    precision: { name: 'Precision', control: 'inline-radio', options: [1, 0.5] },
    size: { name: 'Size', control: { type: 'range', min: 16, max: 64, step: 2 } },
    variant: { name: 'Variant', control: 'inline-radio', options: ['cut', 'classic'] },
    tone: { name: 'Tone', control: 'inline-radio', options: TONES },
    readonly: { name: 'Read only', control: 'boolean' },
    'no-clear': { name: 'No clear', control: 'boolean' },
    disabled: { name: 'Disabled', control: 'boolean' },
  },
  args: { value: 3, max: 5, precision: 1, size: 40, variant: 'cut', tone: 'gold', readonly: false, 'no-clear': false, disabled: false },
};

// Move over the stars: the facets catch the light and the rating previews.
export const Default = {};

// Half stars, in soft classic stars.
export const HalfStars = {
  args: { value: 3.5, precision: 0.5, variant: 'classic', size: 36 },
};

// Every tone, in both styles.
export const Tones = {
  render: () =>
    `<div style="display: grid; grid-template-columns: auto auto; gap: 1rem 2.5rem; align-items: center">${TONES.map((tone) => `<lw-star-rating tone="${tone}" value="4" size="30"></lw-star-rating><lw-star-rating tone="${tone}" value="4" size="30" variant="classic"></lw-star-rating>`).join('')}</div>`,
};

// A read-only average shows its exact fraction.
export const Average = {
  render: () =>
    `<div style="display: flex; align-items: center; gap: 0.75rem; font: 500 0.9375rem var(--lw-font-sans); color: var(--lw-color-foreground)"><lw-star-rating value="4.7" readonly size="22" label="Average rating"></lw-star-rating><span>4.7</span><span style="color: var(--lw-color-muted-foreground)">(2,318 reviews)</span></div>`,
};
