import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const ITEMS = [
  { id: 'share', label: 'Share', icon: 'share2' },
  { id: 'like', label: 'Like', icon: 'heart' },
  { id: 'save', label: 'Save', icon: 'bookmark' },
  { id: 'reply', label: 'Reply', icon: 'messageCircle' },
  { id: 'send', label: 'Send', icon: 'send' },
];

const range = (name, min, max, step = 1) => ({ name, control: { type: 'range', min, max, step } });

export default {
  title: 'Navigation/Menus/Gooey Navigation Menu',
  component: 'lw-gooey-navigation-menu',
  // `count` picks how many demo items show; everything else is an attribute.
  render: ({ count, ...args }) => `<lw-gooey-navigation-menu ${attributes({ ...args, items: JSON.stringify(ITEMS.slice(0, count)) })}></lw-gooey-navigation-menu>`,
  argTypes: {
    direction: { name: 'Arc direction', control: 'select', options: ['up', 'down', 'left', 'right'] },
    count: range('Item count', 2, 5),
    arc: range('Arc width (deg)', 45, 300),
    radius: range('Travel radius', 48, 160),
    size: range('Trigger size', 36, 100),
    'child-size': range('Child size', 28, 72),
  },
  args: { direction: 'up', count: 5, arc: 170, radius: 92, size: 60, 'child-size': 44 },
};

// Press the button: the petals stretch out of it one after another.
export const Default = {};

// Opened, in a full ring and a brand color.
export const Ring = {
  argTypes: { arc: range('Arc width (deg)', 45, 360) },
  args: { open: true, arc: 360, radius: 84, fill: '#e5484d', ink: '#fff' },
};

// A quarter fan to the right, as from a corner.
export const Quarter = { args: { direction: 'right', count: 4, arc: 90, radius: 100 } };
