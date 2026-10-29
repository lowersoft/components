import './index.js';

const pad = (i) => String(i).padStart(2, '0');
const options = (count, label, selected) =>
  Array.from({ length: count }, (_, i) => `<option value="${i}"${i === selected ? ' selected' : ''}>${label(i)}</option>`).join('');

const MINUTES = `<select name="minute" aria-label="Minutes" data-loop>${options(60, pad, 41)}</select>`;

// 24-hour clock: hours 00 to 23, no AM or PM.
const TIME = `
  <select name="hour" aria-label="Hours" data-loop>${options(24, pad, 8)}</select>
  ${MINUTES}`;

const TIME_12 = `
  <select name="hour" aria-label="Hours" data-loop>${options(12, (i) => i + 1, 7)}</select>
  ${MINUTES}
  <select name="period" aria-label="AM or PM"><option value="am">AM</option><option value="pm">PM</option></select>`;

export default {
  title: 'Inputs/Wheel Picker',
  component: 'lw-wheel-picker',
};

export const Time = {
  render: () => `<lw-wheel-picker label="Time">${TIME}</lw-wheel-picker>`,
};

export const TwelveHour = {
  render: () => `<lw-wheel-picker label="Time">${TIME_12}</lw-wheel-picker>`,
};

// The selects are real form fields: the form submits them as usual.
export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form style="display: grid; gap: 0.75rem; justify-items: start; font: 0.8125rem system-ui">
        <lw-wheel-picker label="Alarm">${TIME}</lw-wheel-picker>
        <div style="display: flex; gap: 0.5rem"><button>Submit</button><button type="reset">Reset</button></div>
        <output style="font-family: ui-monospace, monospace"></output>
      </form>`;
    const form = template.content.firstElementChild;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelector('output').textContent = new URLSearchParams(new FormData(form)).toString();
    });
    return form;
  },
};

export const Calendar = {
  render: () => `
    <lw-wheel-picker label="Date">
      <select name="month" aria-label="Month" data-loop data-width="8.5rem">${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => `<option>${m}</option>`).join('')}</select>
      <select name="day" aria-label="Day" data-loop>${options(31, (i) => i + 1)}</select>
      <select name="year" aria-label="Year">${options(11, (i) => 2020 + i)}</select>
    </lw-wheel-picker>`,
};
