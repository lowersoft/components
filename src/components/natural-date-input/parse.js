// Reads a due date written the way it is said: "next fri 3pm", "in 2 weeks",
// "eod", "dec 24 at noon". Each phrase it understands moves the day or sets
// the time; the parts it used are returned so they can be underlined.

const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const NUMBER_WORDS = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
const WORK_DAY_END = 17;

const WEEKDAY = '(mon(?:day)?|tue(?:s(?:day)?)?|wed(?:s|nesday)?|thu(?:r(?:s(?:day)?)?)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?)';
const MONTH = '(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';
const ORDINAL = '(?:st|nd|rd|th)?';

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const weekdayIndex = (name) => WEEKDAYS.indexOf(name.slice(0, 3));
const monthIndex = (name) => MONTHS.indexOf(name.slice(0, 3));
const amount = (word) => NUMBER_WORDS[word] ?? Number(word);

// The next date on `day` of `month`, this year or the next.
const nextDate = (now, month, day) => {
  const date = new Date(now.getFullYear(), month, day);
  return date < startOfDay(now) ? new Date(now.getFullYear() + 1, month, day) : date;
};

// Each rule: a pattern, and what a match does to `{ day, time, now }`.
const RULES = [
  [/\b(?:today|tod)\b/, (s) => (s.day = startOfDay(s.now))],
  [/\b(?:tomorrow|tmrw?|tmw)\b/, (s) => (s.day = addDays(s.now, 1))],
  [/\btonight\b/, (s) => ((s.day = startOfDay(s.now)), (s.time ??= [20, 0]))],
  [/\b(?:eod|end of (?:the )?day)\b/, (s) => ((s.day ??= startOfDay(s.now)), (s.time = [WORK_DAY_END, 0]))],
  [/\b(?:eow|end of (?:the )?week)\b/, (s) => ((s.day = addDays(s.now, (5 - s.now.getDay() + 7) % 7)), (s.time = [WORK_DAY_END, 0]))],
  [/\b(?:eom|end of (?:the )?month)\b/, (s) => ((s.day = new Date(s.now.getFullYear(), s.now.getMonth() + 1, 0)), (s.time = [WORK_DAY_END, 0]))],
  [
    /\bin (\d+|an?|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve) (min(?:ute)?s?|h(?:ou)?rs?|hours?|days?|weeks?|wks?|months?|years?)\b/,
    (s, [, count, unit]) => {
      const n = amount(count);
      if (unit.startsWith('min') || unit.startsWith('h')) {
        const at = new Date(s.now.getTime() + n * (unit.startsWith('min') ? 60_000 : 3_600_000));
        s.day = startOfDay(at);
        s.time = [at.getHours(), at.getMinutes()];
      } else if (unit.startsWith('day')) s.day = addDays(s.now, n);
      else if (unit.startsWith('w')) s.day = addDays(s.now, n * 7);
      else if (unit.startsWith('month')) s.day = new Date(s.now.getFullYear(), s.now.getMonth() + n, s.now.getDate());
      else s.day = new Date(s.now.getFullYear() + n, s.now.getMonth(), s.now.getDate());
    },
  ],
  [/\bnext (week|month|year)\b/, (s, [, unit]) => {
    const { now } = s;
    if (unit === 'week') s.day = addDays(now, ((1 - now.getDay() + 7) % 7) || 7);
    else if (unit === 'month') s.day = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    else s.day = new Date(now.getFullYear() + 1, 0, 1);
  }],
  // "fri" is the coming Friday; "next fri" is the Friday of next week.
  [new RegExp(`\\b(?:(next|this) )?${WEEKDAY}\\b`), (s, [, which, name]) => {
    const target = weekdayIndex(name);
    const { now } = s;
    if (which === 'next') {
      const nextMonday = addDays(now, ((1 - now.getDay() + 7) % 7) || 7);
      s.day = addDays(nextMonday, (target - 1 + 7) % 7);
    } else s.day = addDays(now, ((target - now.getDay() + 7) % 7) || (which === 'this' ? 0 : 7));
  }],
  [new RegExp(`\\b${MONTH} (\\d{1,2})${ORDINAL}\\b`), (s, [, month, day]) => (s.day = nextDate(s.now, monthIndex(month), Number(day)))],
  [new RegExp(`\\b(\\d{1,2})${ORDINAL} (?:of )?${MONTH}\\b`), (s, [, day, month]) => (s.day = nextDate(s.now, monthIndex(month), Number(day)))],
  [/\b(\d{1,2})\/(\d{1,2})\b/, (s, [, month, day]) => (s.day = nextDate(s.now, Number(month) - 1, Number(day)))],
  [/\b(?:at )?(\d{1,2})(?::(\d{2}))? ?(am|pm|a|p)\b/, (s, [, hour, minute = '0', half]) => {
    const h = Number(hour) % 12 + (half.startsWith('p') ? 12 : 0);
    s.time = [h, Number(minute)];
  }],
  [/\b(?:at )?([01]?\d|2[0-3]):([0-5]\d)\b/, (s, [, hour, minute]) => (s.time = [Number(hour), Number(minute)])],
  [/\b(?:at )?(noon|midday)\b/, (s) => (s.time = [12, 0])],
  [/\b(?:at )?midnight\b/, (s) => (s.time = [0, 0])],
  [/\b(?:in the )?(morning|afternoon|evening)\b/, (s, [, part]) => (s.time ??= [{ morning: 9, afternoon: 14, evening: 18 }[part], 0])],
];

/**
 * The date `text` names, relative to `now`: `{ date, hasTime, parts }`, where
 * `parts` are the `[start, end]` ranges it understood. `date` is null when
 * nothing was understood.
 */
export const parseDate = (text, now = new Date()) => {
  const lower = text.toLowerCase();
  const used = new Array(lower.length).fill(false);
  const state = { now, day: null, time: null };
  const parts = [];
  for (const [pattern, apply] of RULES) {
    const global = new RegExp(pattern.source, 'g');
    for (const match of lower.matchAll(global)) {
      const start = match.index + (match[0].length - match[0].trimStart().length);
      const end = match.index + match[0].length;
      if (used.slice(start, end).some(Boolean)) continue;
      used.fill(true, start, end);
      apply(state, match);
      parts.push([start, end]);
    }
  }
  if (!state.day && !state.time) return { date: null, hasTime: false, parts: [] };
  let day = state.day ?? startOfDay(now);
  const [hour, minute] = state.time ?? [0, 0];
  // A time alone that has passed today means tomorrow.
  if (!state.day && state.time && new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute) <= now) day = addDays(day, 1);
  const date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute);
  return { date, hasTime: Boolean(state.time), parts: parts.sort((a, b) => a[0] - b[0]) };
};
