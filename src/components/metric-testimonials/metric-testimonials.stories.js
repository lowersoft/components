import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Sections/Social Proof/Metric Testimonials',
  component: 'lw-metric-testimonials',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="max-width: 68rem; margin: 3rem auto"><lw-metric-testimonials ${attributes(args)}></lw-metric-testimonials></div>`,
  args: {},
};

// The number rolls up the first time the grid comes into view.
export const Default = {};

// Another story: a different metric, and no rating row.
export const Performance = {
  render: () => {
    const section = document.createElement('lw-metric-testimonials');
    Object.assign(section, {
      eyebrow: 'Performance',
      heading: 'Faster binaries, measured in production',
      description: 'Profile-guided builds, on by default. Here is what the first teams saw.',
      clients: '',
      rating: {},
      reviewsLabel: '',
      quotes: [
        { metric: '−38%', metricLabel: 'peak memory on the ingest service', quote: 'The profiler found the allocations we had stopped seeing. ==We shipped the fix the same afternoon==.', person: { name: 'Iris Novak', role: 'Engineering Lead, Mosaic' }, company: { name: 'Mosaic', color: '#d6409f' } },
        { quote: 'Every hot path has a benchmark in CI now. A regression shows up ==in the pull request that caused it==, not three releases later in a customer ticket.', person: { name: 'Lea Fontaine', role: 'Performance Lead, Tandem' }, company: { name: 'Tandem', color: '#0090ff' } },
        { quote: 'Tail latency on checkout dropped below ==4 ms at p99==.', person: { name: 'Sam Whitfield', role: 'Systems Engineer, Parcel' }, company: { name: 'Parcel', color: '#f76b15' } },
        { quote: 'It paid for itself ==in the first sprint==.', person: { name: 'Ravi Shah', role: 'CEO, Hotpath' }, company: { name: 'Hotpath', color: '#3b6ef5' }, inverted: true },
      ],
    });
    const frame = document.createElement('div');
    frame.style.cssText = 'max-width: 68rem; margin: 3rem auto';
    frame.append(section);
    return frame;
  },
};

// On a phone the cards stack in one column.
export const Narrow = {
  render: (args) => `<div style="max-width: 24rem; margin: 2rem auto"><lw-metric-testimonials ${attributes(args)}></lw-metric-testimonials></div>`,
};
