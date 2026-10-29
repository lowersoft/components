import { setTheme } from '../../core/theme.js';
import './index.js';

const THEMES = { 'theme-light': 'light', 'theme-dark': 'dark', 'theme-system': 'system' };
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// A demo `run`: themes apply at once, links and actions take a moment.
const run = (item) => {
  if (THEMES[item.id]) {
    setTheme(THEMES[item.id]);
    return undefined;
  }
  return wait(item.href ? 300 : 900);
};

export default {
  title: 'Navigation/Action Search Bar',
  component: 'lw-action-search-bar',
  parameters: { layout: 'padded' },
  render: (args) => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: flex; justify-content: center; height: 440px; padding-top: 2rem';
    const palette = document.createElement('lw-action-search-bar');
    palette.toggleAttribute('shortcut', args.shortcut);
    palette.run = run;
    wrap.append(palette);
    return wrap;
  },
  args: { shortcut: true },
};

// Press ⌘K / Ctrl+K, type to search, open "Move to…" for a nested page.
export const Default = {};
