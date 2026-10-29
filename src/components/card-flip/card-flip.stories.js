import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

// A deterministic, QR-like code: three finder squares and seeded modules.
const qrPath = (size, seed) => {
  let state = seed;
  const random = () => {
    state = (state * 16_807) % 2_147_483_647;
    return state / 2_147_483_647;
  };
  const far = size - 7;
  const inFinder = (x, y) => (x < 8 && y < 8) || (x >= far - 1 && y < 8) || (x < 8 && y >= far - 1);
  const finderCell = (x, y) => {
    const fx = x >= far ? x - far : x;
    const fy = y >= far ? y - far : y;
    if (fx > 6 || fy > 6 || fx < 0 || fy < 0) return false;
    return Math.max(Math.abs(fx - 3), Math.abs(fy - 3)) !== 2;
  };
  let d = '';
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (inFinder(x, y) ? finderCell(x, y) : random() > 0.52) d += `M${x} ${y}h1v1h-1z`;
  return d;
};

const STYLE = `<style>
  .ticket { box-sizing: border-box; display: flex; flex-direction: column; padding: 20px; font: 14px/1.3 system-ui, sans-serif; }
  .ticket .small { font-size: 11px; color: var(--lw-color-muted-foreground); }
  .ticket .caps { font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--lw-color-muted-foreground); }
  .ticket .top { display: flex; align-items: center; justify-content: space-between; }
  .ticket .ga { padding: 2px 6px; border-radius: 6px; background: #f97316; color: #fff; font-size: 11px; font-weight: 500; }
  .ticket h3 { margin: 4px 0 0; font-size: 26px; line-height: 1.05; letter-spacing: -0.02em; }
  .ticket .edition { margin: 24px 0 0; font-size: 12px; font-weight: 500; color: #ea580c; }
  .ticket dl { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; margin: auto 0 0; }
  .ticket dd { margin: 0; font-weight: 500; }
  .ticket dt { font-size: 11px; color: var(--lw-color-muted-foreground); }
  .ticket .wide { grid-column: span 2; }
  .ticket .tear { margin: 16px -20px; border-top: 1px dashed var(--lw-color-border); }
  .ticket .holder { display: flex; align-items: flex-end; justify-content: space-between; }
  .ticket .mono { font: 12px ui-monospace, monospace; color: var(--lw-color-muted-foreground); }
  .ticket .qr { width: 62%; margin: 16px auto 0; padding: 10px; border-radius: 12px; background: #fff; box-shadow: inset 0 0 0 1px #e4e4e7; }
  .ticket .qr svg { display: block; width: 100%; height: auto; }
  .ticket .seats { grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center; }
  .ticket .note { margin: 16px 0 0; padding-top: 12px; border-top: 1px solid var(--lw-color-border); font-size: 11px; color: var(--lw-color-muted-foreground); }
</style>`;

const FRONT = `<div slot="front" class="ticket">
  <div class="top"><span class="caps">Admit one</span><span class="ga">GA</span></div>
  <p class="edition">Vol. 04</p>
  <h3>LowerSoft Systems Night</h3>
  <dl><div><dt>Date</dt><dd>Sat 21 Nov</dd></div><div><dt>Doors</dt><dd>19:30</dd></div><div class="wide"><dt>Venue</dt><dd>Hall B, Pier 7</dd></div></dl>
  <div class="tear"></div>
  <div class="holder"><div><div class="small">Holder</div><div style="font-weight: 500">Jordan Vale</div></div><span class="mono">No. 004182</span></div>
</div>`;

const BACK = `<div slot="back" class="ticket">
  <div class="top"><span class="caps">Scan at entry</span><span class="mono">#004182</span></div>
  <div class="qr"><svg viewBox="0 0 21 21" role="img" aria-label="Entry code 004182" shape-rendering="crispEdges"><path d="${qrPath(21, 4182)}" fill="#18181b"/></svg></div>
  <dl class="seats"><div><dt>Gate</dt><dd>C</dd></div><div><dt>Section</dt><dd>Floor</dd></div><div><dt>Row</dt><dd>F</dd></div><div><dt>Seat</dt><dd>14</dd></div></dl>
  <p class="note">Valid for one entry. Re-entry with wristband only.</p>
</div>`;

export default {
  title: 'Cards/Card Flip',
  component: 'lw-card-flip',
  render: (args) => `${STYLE}<lw-card-flip ${attributes(args)}>${FRONT}${BACK}</lw-card-flip>`,
  argTypes: { axis: { control: 'inline-radio', options: ['y', 'x'] } },
  args: { label: 'Event ticket', axis: 'y', flipped: false },
};

// Drag or flick the ticket, click a half, or press Enter or Space.
export const Default = {};

export const Tumble = {
  args: { axis: 'x' },
};
