// Calendar dates as ISO strings, "2026-10-09". Plain dates have no time zone,
// so the arithmetic runs in UTC, and ISO strings compare in calendar order.

const DAY_MS = 86_400_000;

const toDate = (iso) => new Date(`${iso}T00:00:00Z`);
const toIso = (date) => date.toISOString().slice(0, 10);

/** A valid ISO date, or null. */
export const parseDate = (value) => (/^\d{4}-\d{2}-\d{2}$/.test(value ?? '') && !Number.isNaN(toDate(value).getTime()) ? value : null);

/** Today on the user's own calendar. */
export const today = () => {
  const now = new Date();
  return toIso(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
};

export const addDays = (iso, days) => toIso(new Date(toDate(iso).getTime() + days * DAY_MS));

/** The first of the month `months` away from the month of `iso`. */
export const addMonths = (iso, months) => {
  const date = toDate(iso);
  return toIso(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1)));
};

/** The same day `months` away, kept inside the shorter month. */
export const shiftMonths = (iso, months) => {
  const first = addMonths(iso, months);
  return minDate(addDays(addMonths(first, 1), -1), `${first.slice(0, 8)}${iso.slice(8)}`);
};

export const startOfMonth = (iso) => `${iso.slice(0, 8)}01`;
export const endOfMonth = (iso) => addDays(addMonths(iso, 1), -1);
export const sameMonth = (a, b) => a.slice(0, 7) === b.slice(0, 7);

/** Whole days from `a` to `b`, counting both. */
export const daysInRange = (a, b) => Math.round((toDate(b) - toDate(a)) / DAY_MS) + 1;

/** 0 for Sunday through 6 for Saturday. */
export const weekday = (iso) => toDate(iso).getUTCDay();

export const minDate = (a, b) => (a < b ? a : b);
export const maxDate = (a, b) => (a > b ? a : b);

/** Formats a date in `locale` with Intl options, in UTC so the day never shifts. */
export const formatDate = (iso, locale, options) => new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(toDate(iso));
