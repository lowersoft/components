import { createElement } from 'react';
import { addons, types } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import lockupBlack from '../src/assets/brand/lowersoft-lockup-black.webp';
import lockupWhite from '../src/assets/brand/lowersoft-lockup-white.webp';
import { UsagePanel } from './usage/panel.js';

// The sidebar carries Lowersoft's lockup in place of Storybook's logo. Like
// Storybook's own theme, it follows the system's colour scheme on load: the
// black lockup on the light theme, the white one on the dark.
const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
addons.setConfig({
  theme: create({
    base: dark ? 'dark' : 'light',
    brandTitle: `<img src="${dark ? lockupWhite : lockupBlack}" alt="Lowersoft components" style="display: block; height: 2.25rem">`,
  }),
});

addons.register('lw/usage', () => {
  addons.add('lw/usage/panel', {
    type: types.PANEL,
    title: 'Usage',
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => createElement(UsagePanel, { active }),
  });
});
