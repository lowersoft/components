// The demo dashboard. Each widget's `render(size)` returns its body for a
// small, medium or large cell; the classes are styled by the grid.
import { activity, hardDrive, history, notebookPen, trendingUp, users } from '../../core/lucide.js';

const REVENUE = [31, 34, 33, 36, 35, 39, 38, 41, 40, 43, 42, 45, 44, 48];
const SPARK = REVENUE.map((v, i) => `${Math.round((i / (REVENUE.length - 1)) * 1000) / 10},${Math.round((1 - (v - 30) / 19) * 300) / 10 + 1}`).join(' ');
const sparkline = `<svg class="spark" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true"><polyline points="${SPARK}" vector-effect="non-scaling-stroke"/></svg>`;
const change = (value, text) => `<p class="note"><span class="up">${value}</span><span class="muted"> ${text}</span></p>`;

const revenue = (size) => {
  const head = `<div><p class="value ${size === 's' ? '' : 'big'}">$48,210</p>${change('+12.4%', 'vs last month')}</div>`;
  if (size === 's') return `<div class="stack end">${head}</div>`;
  if (size === 'm') return `<div class="stack between">${head}${sparkline}</div>`;
  const rows = [
    ['New', '$6,140'],
    ['Expansion', '$2,380'],
    ['Churned', '−$1,190'],
  ];
  return `<div class="split"><div class="stack between">${head}${sparkline}</div><dl class="rows">${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl></div>`;
};

const USERS = [1820, 1960, 2010, 1890, 2240, 1450, 1380, 2120, 2380, 2290, 2510, 2640, 1720, 2841];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const bars = (values, labels) => {
  const max = Math.max(...values);
  return `<div class="bars"><div class="columns">${values.map((v, i) => `<span class="${i === values.length - 1 ? 'on' : ''}" style="height: ${Math.round((v / max) * 100)}%"></span>`).join('')}</div><div class="labels">${labels.map((l) => `<span>${l}</span>`).join('')}</div></div>`;
};
const activeUsers = (size) => {
  if (size === 's') return `<div class="stack end"><p class="value">2,841</p>${change('+6.2%', 'today')}</div>`;
  const chart = size === 'm' ? bars(USERS.slice(-7), DAYS) : bars(USERS, [...DAYS, ...DAYS]);
  return `<div class="stack"><div class="inline"><p class="value">2,841</p>${change('+6.2%', 'active today')}</div><div class="fill">${chart}</div></div>`;
};

const EVENTS = [
  ['09:41', 'lower 0.9.2 promoted to stable'],
  ['09:12', 'Nightly build passed on 6 targets'],
  ['08:55', 'New teammate joined Runtime'],
  ['Mon', 'Symbol server backup verified'],
];
const timeline = (size) => {
  const shown = EVENTS.slice(0, { s: 1, m: 3, l: 4 }[size]);
  return `<ol class="timeline">${shown.map(([time, text], i) => `<li><span class="rail"><span class="dot${i === 0 ? ' on' : ''}"></span>${i < shown.length - 1 ? '<span class="line"></span>' : ''}</span><span class="event"><span class="text">${text}</span>${size === 's' ? `<span class="muted">Today, ${time}</span>` : ''}</span>${size === 's' ? '' : `<span class="muted time">${time}</span>`}</li>`).join('')}</ol>`;
};

const NOTES = [
  ['Profile the cold start', true],
  ['Review the allocator patch', true],
  ['Bisect the ARM regression', true],
  ['Book the release review', false],
  ['Write the 0.9 notes', false],
];
const DONE = NOTES.filter(([, done]) => done).length;
const notes = (size) => {
  if (size === 's') return `<div class="stack end"><p class="title">Q4 planning</p><p class="muted">${DONE} of ${NOTES.length} done</p><div class="meter"><span style="width: ${(DONE / NOTES.length) * 100}%"></span></div></div>`;
  const list = size === 'm' ? NOTES.slice(2) : NOTES;
  return `<ul class="todo${size === 'l' ? ' two' : ''}">${list.map(([text, done]) => `<li class="${done ? 'done' : ''}"><span class="box">${done ? '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 5.2 4.1 7.2 8 3"/></svg>' : ''}</span><span class="text">${text}</span></li>`).join('')}</ul>`;
};

const INCIDENT_AGO = 18;
const uptime = (size) => {
  const ticks = size === 'l' ? 45 : 30;
  const strip = `<div class="ticks">${Array.from({ length: ticks }, (_, i) => `<span class="${i === ticks - INCIDENT_AGO ? 'on' : ''}"></span>`).join('')}</div>`;
  return `<div class="stack end"><div class="inline"><p class="value">99.98%</p>${size === 's' ? '' : `<p class="muted">last ${ticks} days</p>`}</div>${size === 's' ? '<p class="muted">All systems normal</p>' : strip}${size === 'l' ? `<p class="muted">One incident ${INCIDENT_AGO} days ago: slower API responses for 4 minutes.</p>` : ''}</div>`;
};

const STORAGE = [
  ['Media', 182, 'accent'],
  ['Documents', 96, 'strong'],
  ['Backups', 64, 'soft'],
];
const TOTAL = 500;
const USED = STORAGE.reduce((sum, [, gb]) => sum + gb, 0);
const storage = (size) => {
  const segments = size === 's' ? [['Used', USED, 'accent']] : STORAGE;
  const legend = size === 's' ? '' : `<ul class="legend">${STORAGE.map(([label, gb, tone]) => `<li><span class="swatch ${tone}"></span><span class="muted">${label}</span>${size === 'l' ? `<span>${gb} GB</span>` : ''}</li>`).join('')}</ul>`;
  return `<div class="stack end"><p class="inline"><span class="value">${USED} GB</span><span class="muted">of ${TOTAL}</span></p><div class="segments">${segments.map(([, gb, tone]) => `<span class="${tone}" style="width: ${(gb / TOTAL) * 100}%"></span>`).join('')}</div>${legend}</div>`;
};

export const DEMO_WIDGETS = [
  { id: 'revenue', title: 'Revenue', icon: trendingUp, span: 2, render: revenue },
  { id: 'users', title: 'Active users', icon: users, span: 4, render: activeUsers },
  { id: 'activity', title: 'Activity', icon: history, span: 3, render: timeline },
  { id: 'notes', title: 'Notes', icon: notebookPen, span: 3, render: notes },
  { id: 'uptime', title: 'Uptime', icon: activity, span: 4, render: uptime },
  { id: 'storage', title: 'Storage', icon: hardDrive, span: 2, render: storage },
];
