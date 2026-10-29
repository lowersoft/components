import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Contact Card',
  component: 'lw-contact-card',
  render: (args) => `<lw-contact-card ${attributes(args)}></lw-contact-card>`,
  args: { name: 'Lena Fischer', zone: 'Europe/Berlin' },
};

// Scrub the strip to read any time on both clocks; rows copy on click; Save contact downloads a vCard.
export const Default = {};
