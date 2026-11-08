import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const photo = (id) => `https://images.unsplash.com/photo-${id}?w=1600&h=1067&fit=crop&auto=format&q=80`;

const IMAGES = {
  'Red canyon': photo('1500530855697-b586d89ba3ee'),
  'Turquoise lake': photo('1501785888041-af3ef285b470'),
  'Golden valley': photo('1469474968028-56623f02e42e'),
  'Forest light': photo('1441974231531-c6227db76b6e'),
};

const range = (name, min, max, step = 0.01) => ({ name, control: { type: 'range', min, max, step } });

export default {
  title: 'Effects/Surfaces/Fluted Glass',
  component: 'lw-fluted-glass',
  parameters: { layout: 'fullscreen' },
  // `image` picks one of the demo pictures; everything else is an attribute.
  render: ({ image, ...args }) => `<lw-fluted-glass ${attributes({ ...args, src: IMAGES[image] })}></lw-fluted-glass>`,
  argTypes: {
    image: { name: 'Image', control: 'select', options: Object.keys(IMAGES) },
    ribs: range('Ribs', 6, 64, 1),
    diffusion: range('Diffusion', 0, 1),
    refraction: range('Refraction', 0, 1),
    variation: range('Variation', 0, 1),
    aberration: range('Aberration', 0, 1),
    shade: range('Shade', 0, 1),
    glint: range('Glint', 0, 1),
    parallax: range('Parallax', 0, 1),
    speed: range('Speed', 0, 3, 0.1),
  },
  args: { image: 'Red canyon', ribs: 20, diffusion: 0.7, refraction: 0.55, variation: 0.55, aberration: 0.35, shade: 0.7, glint: 0.65, parallax: 0.6, speed: 1 },
};

// Move the pointer over it: the picture slides behind the ribs; still, it sways.
export const Default = {};

// Content sits on the glass.
export const WithContent = {
  render: ({ image, ...args }) => `<lw-fluted-glass ${attributes({ ...args, src: IMAGES[image] })}>
  <div style="display: grid; align-content: end; gap: 0.5rem; box-sizing: border-box; padding: clamp(1.5rem, 5vw, 2.5rem); color: #fff; font-family: system-ui, sans-serif; text-shadow: 0 1px 12px rgb(0 0 0 / 0.45)">
    <p style="margin: 0; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.85">Field notes · 04</p>
    <h2 style="margin: 0; max-width: 18ch; font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1; letter-spacing: -0.03em">Light through reeded glass</h2>
  </div>
</lw-fluted-glass>`,
  args: { image: 'Turquoise lake', ribs: 28 },
};
