import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

// Room above the pill for the panel to pour into.
const stage = (markup) => `<div style="display: grid; min-height: 34rem; place-items: end center; padding-bottom: 3rem">${markup}</div>`;

export default {
  title: 'Toolbars/Gooey Toolbar',
  component: 'lw-gooey-toolbar',
  parameters: { layout: 'fullscreen' },
  render: (args) => stage(`<lw-gooey-toolbar ${attributes(args)}></lw-gooey-toolbar>`),
  argTypes: { fill: { control: 'color' }, ink: { control: 'color' }, viscosity: { control: { type: 'range', min: 0, max: 14, step: 1 } } },
  args: { value: 'insert', open: true, viscosity: 7 },
};

// Pick a tool: the panel pours out of its icon. Pick another and a neck stretches across; pick it again, press Escape or click outside and it drains.
export const Default = {};

// Starts closed.
export const Closed = { args: { open: false } };

const CUSTOM_ITEMS = JSON.stringify([
  { id: 'notes', label: 'Notes', icon: 'notebookPen' },
  { id: 'timer', label: 'Timer', icon: 'timer' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: true },
]);

const CUSTOM_PANELS = [
  '<div slot="notes" style="width: 15rem; padding: 1rem">Three notes on this page.</div>',
  '<div slot="timer" style="width: 12rem; padding: 1rem">25:00 of focus left.</div>',
  '<div slot="inbox" style="width: 18rem; padding: 1rem">Two messages since this morning.</div>',
].join('');

// Your own tools and panels: each panel goes in the slot named after its tool.
export const CustomPanels = {
  render: () => stage(`<lw-gooey-toolbar value="notes" open items='${CUSTOM_ITEMS}'>${CUSTOM_PANELS}</lw-gooey-toolbar>`),
};
