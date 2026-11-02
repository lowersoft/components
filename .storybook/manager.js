import { createElement } from 'react';
import { addons, types } from 'storybook/manager-api';
import { UsagePanel } from './usage/panel.js';

addons.register('lw/usage', () => {
  addons.add('lw/usage/panel', {
    type: types.PANEL,
    title: 'Usage',
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => createElement(UsagePanel, { active }),
  });
});
