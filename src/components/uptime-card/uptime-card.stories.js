import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Uptime Card',
  component: 'lw-uptime-card',
  render: (args) => `<lw-uptime-card ${attributes(args)}></lw-uptime-card>`,
  args: { heading: 'System status', days: 90 },
};

// Hover the bars to read a day; click or press Enter to open its incident log.
export const Default = {};
