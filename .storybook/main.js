/** @type {import('@storybook/web-components-vite').StorybookConfig} */
export default {
  framework: '@storybook/web-components-vite',
  stories: ['../src/**/*.stories.js'],
  core: { disableTelemetry: true },
  // No story logs actions or runs play functions, so their panels stay out
  // of the way and Usage sits next to Controls.
  features: { actions: false, interactions: false },
};
