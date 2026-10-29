import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Forms/Booking Picker',
  component: 'lw-booking-picker',
  render: (args) => `<lw-booking-picker ${attributes(args)}></lw-booking-picker>`,
  args: { 'host-name': 'Maya Lindqvist', duration: 30 },
};

// Drag the slot along the free time, or use the arrow keys; it snaps to the quarter hour. The globe switches the time zone.
export const Default = {};
