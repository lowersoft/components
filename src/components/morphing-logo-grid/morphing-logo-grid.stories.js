import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Sections/Social Proof/Morphing Logo Grid',
  component: 'lw-morphing-logo-grid',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="max-width: 64rem; margin: 4rem auto"><lw-morphing-logo-grid ${attributes(args)}></lw-morphing-logo-grid></div>`,
  args: {},
};

// Every 2.6 seconds half the grid changes, in a checkerboard. Point at a
// cell to hold it.
export const Default = {};

// Twelve cells over three rows, each taking turns between its own logos.
export const ThreeRows = {
  args: { cells: 12, heading: 'In production at', description: '' },
  render: (args) => {
    const names = ['Cacheline', 'Branchless', 'Kernelspace', 'Hotpath', 'Zerocopy', 'Lockfree', 'Fieldnote', 'Halcyon', 'Parcel', 'Tandem', 'Arcadia', 'Mosaic', 'Lumen', 'Stackline', 'Bitforge', 'Northwind', 'Quarry', 'Ember', 'Vertex', 'Solace', 'Driftwood', 'Keystone', 'Monolith', 'Pebble'];
    const marks = ['disc', 'peak', 'ring', 'diamond', 'leaf', 'orbit', 'bars', 'pillar', 'wave', 'spark', 'ring', 'leaf'];
    const grid = document.createElement('lw-morphing-logo-grid');
    Object.assign(grid, args, { logos: names.map((name, index) => ({ name, mark: marks[index % marks.length] })) });
    const frame = document.createElement('div');
    frame.style.cssText = 'max-width: 64rem; margin: 4rem auto';
    frame.append(grid);
    return frame;
  },
};

// On a phone the grid folds into two columns.
export const Narrow = {
  render: (args) => `<div style="max-width: 24rem; margin: 3rem auto"><lw-morphing-logo-grid ${attributes(args)}></lw-morphing-logo-grid></div>`,
};
