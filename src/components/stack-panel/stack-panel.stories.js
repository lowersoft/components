import './index.js';

// Workspace settings, three levels deep. Choices live here and the pages are
// rebuilt from them whenever a row is pressed.
const settings = () => {
  const state = {
    theme: 'System',
    density: 'Comfortable',
    quiet: '22:00 – 07:00',
    alerts: { mentions: true, deploys: true, digest: false },
  };
  const choice = (key, value) => ({ id: `${key}:${value}`, label: value, selected: state[key] === value });
  const alert = (id, label) => ({ id: `alert:${id}`, label, checked: state.alerts[id] });

  const pages = () => ({
    settings: {
      title: 'Settings',
      sections: [
        {
          rows: [
            { id: 'account', label: 'Account', detail: 'Maya Chen', to: 'account' },
            { id: 'appearance', label: 'Appearance', detail: state.theme, to: 'appearance' },
            { id: 'notifications', label: 'Notifications', to: 'notifications' },
          ],
        },
        {
          rows: [
            { id: 'billing', label: 'Billing', detail: 'Pro', to: 'billing' },
            { id: 'shortcuts', label: 'Keyboard shortcuts', detail: '34' },
          ],
        },
      ],
    },
    account: {
      title: 'Account',
      sections: [
        {
          rows: [
            { id: 'name', label: 'Name', detail: 'Maya Chen' },
            { id: 'email', label: 'Email', detail: 'maya@lowersoft.dev' },
            { id: 'security', label: 'Password & security', to: 'security' },
          ],
        },
        { rows: [{ id: 'sign-out', label: 'Sign out', tone: 'danger', action: true }] },
      ],
    },
    security: {
      title: 'Password & security',
      sections: [
        {
          rows: [
            { id: 'password', label: 'Password', detail: 'Changed 3 months ago' },
            { id: '2fa', label: 'Two-factor', detail: 'Authenticator app' },
            { id: 'sessions', label: 'Active sessions', detail: '3' },
          ],
          footer: 'Signing out of a session takes effect on its next request.',
        },
      ],
    },
    appearance: {
      title: 'Appearance',
      sections: [
        { title: 'Theme', rows: ['Light', 'Dark', 'System'].map((value) => choice('theme', value)) },
        { title: 'Density', rows: ['Comfortable', 'Compact'].map((value) => choice('density', value)) },
      ],
    },
    notifications: {
      title: 'Notifications',
      sections: [
        { rows: [alert('mentions', 'Mentions'), alert('deploys', 'Failed deploys'), alert('digest', 'Weekly digest')] },
        {
          rows: [{ id: 'quiet', label: 'Quiet hours', detail: state.quiet, to: 'quiet' }],
          footer: 'Nothing but failed deploys gets through in quiet hours.',
        },
      ],
    },
    quiet: {
      title: 'Quiet hours',
      sections: [{ rows: ['Off', '22:00 – 07:00', '20:00 – 09:00', 'Weekends'].map((value) => choice('quiet', value)) }],
    },
    billing: {
      title: 'Billing',
      sections: [
        {
          rows: [
            { id: 'plan', label: 'Plan', detail: 'Pro, yearly' },
            { id: 'next', label: 'Next invoice', detail: 'Nov 1 · $96' },
            { id: 'card', label: 'Card', detail: 'Visa ·· 4242' },
          ],
        },
      ],
    },
  });

  const panel = document.createElement('lw-stack-panel');
  panel.root = 'settings';
  panel.pages = pages();
  panel.addEventListener('lw-select', ({ detail: { row } }) => {
    const [key, value] = row.id.split(':');
    if (key === 'alert') state.alerts[value] = !state.alerts[value];
    else if (value) state[key] = value;
    else return;
    panel.pages = pages();
  });
  return panel;
};

export default {
  title: 'Navigation/Stack Panel',
  component: 'lw-stack-panel',
  render: settings,
};

// Open a row, swipe the page right or press Escape to go back.
export const Default = {};
