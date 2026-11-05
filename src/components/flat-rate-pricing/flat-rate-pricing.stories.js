import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const COLUMNS = JSON.stringify([
  { id: 'retainer', label: 'Retainer' },
  { id: 'agency', label: 'Agency' },
  { id: 'inhouse', label: 'In-house team' },
]);

const ROWS = JSON.stringify([
  { label: 'Senior engineers only', values: { retainer: true, agency: false, inhouse: true } },
  { label: 'Start within a week', values: { retainer: true, agency: true, inhouse: false } },
  { label: 'Code you own outright', values: { retainer: true, agency: false, inhouse: true } },
  { label: 'Scale down any month', values: { retainer: true, agency: false, inhouse: false } },
]);

export default {
  title: 'Pricings/Flat Rate Pricing',
  component: 'lw-flat-rate-pricing',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="margin: 3rem auto"><lw-flat-rate-pricing ${attributes(args)}></lw-flat-rate-pricing></div>`,
  args: {},
};

// The price, the promise and the comparison, in moss and lime.
export const Default = {};

// An engineering retainer in slate and sky blue.
export const Retainer = {
  args: {
    heading: 'Your dev team. One fee.',
    label: 'Retainer',
    price: '$12,000',
    note: 'Third-party services billed at cost.',
    body: 'Two senior engineers working on your roadmap every week, with a shared board, daily notes and a call each Friday.',
    action: 'Plan a first sprint',
    'guarantee-title': 'Scale down any month',
    guarantee: 'Slower quarter ahead? Drop to one engineer, or stop, with a month’s notice.',
    pill: 'No lock-in',
    columns: COLUMNS,
    rows: ROWS,
  },
  render: (args) => `<div style="margin: 3rem auto; --lw-flat-rate-pricing-tone: #273449; --lw-flat-rate-pricing-action: #7dd3fc"><lw-flat-rate-pricing ${attributes(args)}></lw-flat-rate-pricing></div>`,
};
