import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (inner) => `<div style="max-width: 64rem; margin: 3rem auto">${inner}</div>`;

export default {
  title: 'Sections/Social Proof/Metric Testimonials',
  component: 'lw-metric-testimonials',
  parameters: { layout: 'padded' },
  render: (args) => frame(`<lw-metric-testimonials ${attributes(args)}></lw-metric-testimonials>`),
  args: {},
};

// The number rolls up the first time the grid comes into view.
export const Default = {};

// A colour for the quote marks and the eyebrow's corners.
export const Accent = {
  render: (args) => frame(`<lw-metric-testimonials style="--lw-metric-testimonials-accent: #e5484d" ${attributes(args)}></lw-metric-testimonials>`),
};

// Another set of proof, without the rating row.
export const Performance = {
  render: () => {
    const section = document.createElement('lw-metric-testimonials');
    Object.assign(section, {
      eyebrow: 'Performance',
      heading: 'Faster binaries',
      subheading: 'measured in production',
      description: 'Profile-guided builds, on by default. Here is what the first teams saw.',
      clients: '',
      rating: {},
      reviewsLabel: '',
      quotes: [
        { metric: '−38%', metricLabel: 'Peak memory on the ingest service', quote: 'The profiler found the allocations we had stopped seeing. We shipped the fix the same afternoon, and the pager has been quiet since.', person: { name: 'Iris Novak', role: 'Engineering Lead, Mosaic' }, company: { name: 'Mosaic', color: '#d6409f' } },
        { metric: '4 ms', metricLabel: 'Checkout latency at p99', quote: 'Every hot path has a benchmark in CI now. A regression shows up in the pull request that caused it, not three releases later in a customer ticket.', person: { name: 'Lea Fontaine', role: 'Performance Lead, Tandem' }, company: { name: 'Tandem', color: '#0090ff' } },
        { quote: 'Half the machines, the same traffic. Finance noticed before engineering did.', person: { name: 'Jonas Berg', role: 'CTO, Arcadia' }, company: { name: 'Arcadia', color: '#30a46c' } },
        { quote: 'It paid for itself in the first sprint.', person: { name: 'Ravi Shah', role: 'CEO, Hotpath' }, company: { name: 'Hotpath', color: '#3b6ef5' }, inverted: true },
      ],
    });
    const wrap = document.createElement('div');
    wrap.style.cssText = 'max-width: 64rem; margin: 3rem auto';
    wrap.append(section);
    return wrap;
  },
};

// On a phone the cards stack in one column.
export const Narrow = {
  render: (args) => `<div style="max-width: 24rem; margin: 2rem auto"><lw-metric-testimonials ${attributes(args)}></lw-metric-testimonials></div>`,
};
