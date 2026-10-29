import { circle, hand, messageCircle, mousePointer, penTool, slash, square, type } from '../../core/lucide.js';

/** The demo's tools: an editor in the style of Figma or tldraw. */
export const DEMO_TOOLS = [
  { id: 'select', label: 'Select', icon: mousePointer, shortcut: 'V', cursor: 'default' },
  { id: 'hand', label: 'Hand', icon: hand, shortcut: 'H', cursor: 'grab' },
  {
    id: 'shapes',
    label: 'Shapes',
    icon: square,
    tools: [
      { id: 'rectangle', label: 'Rectangle', icon: square, shortcut: 'R', cursor: 'crosshair' },
      { id: 'ellipse', label: 'Ellipse', icon: circle, shortcut: 'O', cursor: 'crosshair' },
      { id: 'line', label: 'Line', icon: slash, shortcut: 'L', cursor: 'crosshair' },
    ],
  },
  { id: 'pen', label: 'Pen', icon: penTool, shortcut: 'P', cursor: 'crosshair' },
  { id: 'text', label: 'Text', icon: type, shortcut: 'T', cursor: 'text' },
  { id: 'comment', label: 'Comment', icon: messageCircle, shortcut: 'C', cursor: 'crosshair' },
];
