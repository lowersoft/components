import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MERGE_ICON =
  '<svg slot="start" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></svg>';

const OPTIONS = `
  <option value="merge" data-description="All commits from this branch are added to main with a merge commit." data-pending="Merging" data-done="Merged">Merge pull request</option>
  <option value="squash" data-description="The commits are combined into one commit on main." data-pending="Squashing" data-done="Squashed">Squash and merge</option>
  <option value="rebase" data-description="The commits are replayed on top of main, one by one." data-pending="Rebasing" data-done="Rebased">Rebase and merge</option>`;

export default {
  title: 'Buttons/Split',
  component: 'lw-split-button',
  parameters: { layout: 'padded' },
  render: (args) => {
    const template = document.createElement('template');
    template.innerHTML = `<div style="display: flex; justify-content: center; padding-bottom: 16rem"><lw-split-button ${attributes(args)}>${MERGE_ICON}${OPTIONS}</lw-split-button></div>`;
    const frame = template.content.firstElementChild;
    frame.firstElementChild.addEventListener('lw-action', (event) => event.detail.waitUntil(wait(1200)));
    return frame;
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    variant: 'primary',
    size: 'md',
    'storage-key': 'lw-story-merge-method',
  },
};

export const Default = {};
