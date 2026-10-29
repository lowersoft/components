import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const BARS = [38, 52, 44, 61, 57, 72, 66, 80, 74, 88, 69, 92];
const ACTIVITY = [
  ['Deploy #418 promoted to production', '2m'],
  ['Preview built for fix/auth-redirect', '14m'],
  ['Environment variable rotated', '1h'],
  ['Domain app.example.com verified', '3h'],
];
const MEMBERS = [
  ['AL', 'Avery Lane', 'Owner'],
  ['JR', 'Jordan Reyes', 'Admin'],
  ['SK', 'Sam Kato', 'Developer'],
  ['RM', 'Riley Moss', 'Viewer'],
];

// Demo panel styles, scoped to the story.
const STYLE = `<style>
  .demo { font: 14px/1.4 system-ui, sans-serif; color: var(--lw-color-foreground); }
  .demo .muted { color: var(--lw-color-muted-foreground); font-size: 12px; }
  .demo .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .demo .stat { padding: 10px 12px; border-radius: 8px; background: var(--lw-color-muted); }
  .demo .stat p { margin: 0; }
  .demo .stat b { font-weight: 500; font-variant-numeric: tabular-nums; }
  .demo .bars { display: flex; align-items: flex-end; gap: 6px; height: 96px; margin-top: 16px; }
  .demo .bars span { flex: 1; border-radius: 2px; background: var(--lw-color-border); }
  .demo .bars span:last-child { background: var(--lw-color-primary); }
  .demo ol, .demo ul { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; }
  .demo li { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .demo .avatar { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: var(--lw-color-muted); font-size: 11px; font-weight: 500; }
  .demo .name { flex: 1; }
  .demo .meter { height: 6px; margin-top: 6px; overflow: hidden; border-radius: 99px; background: var(--lw-color-muted); }
  .demo .meter span { display: block; width: 64%; height: 100%; border-radius: inherit; background: var(--lw-color-primary); }
</style>`;

const PANELS = `
  <section data-label="Overview">
    <div class="stats">
      <div class="stat"><p class="muted">Requests</p><p><b>24.1k</b></p></div>
      <div class="stat"><p class="muted">Errors</p><p><b>0.12%</b></p></div>
      <div class="stat"><p class="muted">p95</p><p><b>182 ms</b></p></div>
    </div>
    <div class="bars" aria-hidden="true">${BARS.map((height) => `<span style="height: ${height}%"></span>`).join('')}</div>
  </section>
  <section data-label="Activity">
    <ol>${ACTIVITY.map(([text, time]) => `<li><span>${text}</span><span class="muted">${time}</span></li>`).join('')}</ol>
  </section>
  <section data-label="Members">
    <ul>${MEMBERS.map(([initials, name, role]) => `<li><span class="avatar">${initials}</span><span class="name">${name}</span><span class="muted">${role}</span></li>`).join('')}</ul>
  </section>
  <section data-label="Billing">
    <p style="display: flex; justify-content: space-between; margin: 0 0 20px"><b style="font-weight: 500">Pro plan</b><span class="muted">$20 / month</span></p>
    <p class="muted" style="display: flex; justify-content: space-between; margin: 0">Bandwidth<span>64 / 100 GB</span></p>
    <div class="meter"><span></span></div>
    <p class="muted" style="margin: 20px 0 0">Next invoice on Nov 1 · Card ending 4242</p>
  </section>`;

export default {
  title: 'Navigation/Smooth Tab',
  component: 'lw-smooth-tab',
  render: (args) => `${STYLE}<lw-smooth-tab class="demo" ${attributes(args)}>${PANELS}</lw-smooth-tab>`,
  args: { selected: 0 },
};

// Click a tab, use the arrow keys, or swipe the panel sideways.
export const Default = {};

export const SecondTab = {
  args: { selected: 1 },
};
