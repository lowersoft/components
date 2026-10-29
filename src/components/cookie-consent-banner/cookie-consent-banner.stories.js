import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Banners/Cookie Consent Banner',
  component: 'lw-cookie-consent-banner',
  render: (args) => `<lw-cookie-consent-banner ${attributes(args)}></lw-cookie-consent-banner>`,
  args: {},
};

// Switch categories on, then save; or reject or accept all. The banner folds away.
export const Default = {};
