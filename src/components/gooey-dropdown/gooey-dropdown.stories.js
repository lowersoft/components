import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const SHARE = JSON.stringify([
  { id: 'link', label: 'Copy link', detail: 'Anyone with it can view', icon: 'link2', shortcut: 'C' },
  { id: 'invite', label: 'Invite people', detail: 'Send by email', icon: 'userPlus', shortcut: 'I' },
  { id: 'export', label: 'Export', detail: 'PDF, PNG or SVG', icon: 'download', shortcut: 'E' },
  { id: 'stop', label: 'Stop sharing', icon: 'lock', divider: true, destructive: true },
]);

const stage = (markup) => `<div style="display: flex; justify-content: center; min-height: 24rem; padding-top: 3rem">${markup}</div>`;

export default {
  title: 'Navigation/Menus/Gooey Dropdown',
  component: 'lw-gooey-dropdown',
  parameters: { layout: 'fullscreen' },
  render: (args) => stage(`<lw-gooey-dropdown ${attributes(args)}></lw-gooey-dropdown>`),
  argTypes: {
    label: { name: 'Label' },
    anchor: { name: 'Anchor', control: 'inline-radio', options: ['start', 'center', 'end'] },
    'menu-width': { name: 'Menu width', control: { type: 'range', min: 160, max: 360, step: 10 } },
    gap: { name: 'Gap', control: { type: 'range', min: 0, max: 32, step: 1 } },
    viscosity: { name: 'Viscosity', control: { type: 'range', min: 0, max: 14, step: 1 } },
    open: { name: 'Open', control: 'boolean' },
    fill: { name: 'Fill', control: 'color' },
    ink: { name: 'Ink', control: 'color' },
  },
  args: { label: 'Actions', anchor: 'center', 'menu-width': 240, gap: 14, viscosity: 7, open: false },
};

// Press the capsule: the menu pours out of it. Arrow keys move, a row's letter picks it.
export const Default = {};

// Opened, with detail lines, lined up with the capsule's start.
export const WithDetails = {
  args: {
    open: true,
    anchor: 'start',
    label: 'Share',
    'menu-width': 280,
    actions: SHARE,
  },
};
