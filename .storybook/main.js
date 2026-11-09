import { readFileSync } from 'node:fs';

// Lowersoft's badge as the tab's icon, inlined from the brand artwork so the
// favicon has no copy of its own to keep in step.
const mark = readFileSync(new URL('../src/assets/brand/lowersoft-mark.webp', import.meta.url)).toString('base64');

/** @type {import('@storybook/web-components-vite').StorybookConfig} */
export default {
  framework: '@storybook/web-components-vite',
  stories: ['../src/**/*.stories.js'],
  core: { disableTelemetry: true },
  // No story logs actions or runs play functions, so their panels stay out
  // of the way and Usage sits next to Controls.
  features: { actions: false, interactions: false },
  managerHead: (head) => `${head}<link rel="icon" type="image/webp" href="data:image/webp;base64,${mark}">`,
};
