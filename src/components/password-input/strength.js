// How strong a password is, roughly: the guesses an attacker would need, and
// how long those take offline against a fast hash.

const GUESSES_PER_SECOND = 1e10;
// Passwords people pick first; any of these is cracked at once.
const COMMON = new Set([
  'password', 'password1', 'passw0rd', '123456', '1234567', '12345678', '123456789', '1234567890', 'qwerty', 'qwerty123', 'abc123',
  'letmein', 'welcome', 'admin', 'iloveyou', 'monkey', 'dragon', 'football', 'baseball', 'sunshine', 'princess', 'trustno1', '111111', '000000',
]);

const CLASSES = [
  { test: /[a-z]/, size: 26 },
  { test: /[A-Z]/, size: 26 },
  { test: /\d/, size: 10 },
  { test: /[^a-zA-Z\d]/, size: 33 },
];

/** The rules a new password is held to; `min` is the shortest length. */
export const rulesFor = (min) => [
  { key: 'length', label: `At least ${min} characters`, test: (value) => value.length >= min },
  { key: 'case', label: 'Upper and lowercase letters', test: (value) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { key: 'number', label: 'A number', test: (value) => /\d/.test(value) },
  { key: 'symbol', label: 'A symbol, like ! or #', test: (value) => /[^a-zA-Z\d\s]/.test(value) },
];

// Characters that repeat the one before or continue a run ("aaa", "abc",
// "321") add almost nothing for an attacker.
const predictable = (value) => {
  let count = 0;
  for (let i = 2; i < value.length; i++) {
    const [a, b, c] = [value.charCodeAt(i - 2), value.charCodeAt(i - 1), value.charCodeAt(i)];
    if ((a === b && b === c) || (b - a === c - b && Math.abs(c - b) === 1)) count += 1;
  }
  return count;
};

/** log10 of the guesses needed for `value`. */
const log10Guesses = (value) => {
  if (!value) return 0;
  if (COMMON.has(value.toLowerCase())) return 2;
  const pool = CLASSES.reduce((sum, { test, size }) => sum + (test.test(value) ? size : 0), 0);
  const length = Math.max(1, value.length - predictable(value));
  return length * Math.log10(pool);
};

const UNITS = [
  ['year', 31_557_600],
  ['month', 2_629_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
  ['second', 1],
];

/** "3 hours", "less than a second", "centuries". */
const formatDuration = (seconds) => {
  if (seconds < 1) return 'less than a second';
  if (seconds > 31_557_600 * 100) return 'centuries';
  const [unit, size] = UNITS.find(([, size]) => seconds >= size);
  const count = Math.round(seconds / size);
  return `${count} ${unit}${count === 1 ? '' : 's'}`;
};

/**
 * The strength of `value` on four steps (0 when empty, then 1 weak to 4
 * strong) and how long it would take to crack. While a rule is missed it
 * rates no better than fair, so the meter never praises what the rules
 * still turn down.
 */
export const strengthOf = (value, rules = []) => {
  if (!value) return { level: 0, label: '', crack: '' };
  const seconds = 10 ** log10Guesses(value) / GUESSES_PER_SECOND;
  let level = 4;
  if (seconds < 3_600) level = 1;
  else if (seconds < 31_557_600) level = 2;
  else if (seconds < 31_557_600 * 1000) level = 3;
  if (rules.some((rule) => !rule.test(value))) level = Math.min(level, 2);
  const label = ['', 'Weak', 'Fair', 'Good', 'Strong'][level];
  return { level, label, crack: formatDuration(seconds) };
};
