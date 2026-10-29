// A handle is a URL slug: lowercase letters, digits and single dashes.

const ALLOWED = /[a-z0-9]/;
// Typed as separators, these become a dash.
const SEPARATORS = /[\s_.\-/\\+]/;

/** What one typed character becomes: itself, another character, or nothing. */
const rewriteChar = (char) => {
  // "É" -> "e", "ß" stays unknown and is dropped.
  const plain = char.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
  if (plain.length === 1 && ALLOWED.test(plain)) return plain;
  if (SEPARATORS.test(char)) return '-';
  return '';
};

/**
 * Rewrites raw text into a slug, character by character. Returns the slug,
 * where each character of `raw` landed (`at`), and what happened to it:
 * `kept`, `changed` (with the character it was) or `dropped`.
 */
export const slugify = (raw, maxLength = Infinity) => {
  let slug = '';
  const marks = [];
  for (const char of raw) {
    let next = rewriteChar(char);
    // No leading dash, no double dash, nothing past the limit.
    if (next === '-' && (slug === '' || slug.endsWith('-'))) next = '';
    if (slug.length >= maxLength) next = '';
    if (next) slug += next;
    marks.push({ from: char, at: slug.length - (next ? 1 : 0), fate: next === char ? 'kept' : next ? 'changed' : 'dropped' });
  }
  return { slug, marks };
};

/** Alternatives to a taken handle, most natural first. */
export const candidates = (slug, maxLength) =>
  [`${slug}-hq`, `${slug}-team`, `get-${slug}`, `${slug}-app`, `try-${slug}`, `${slug}-studio`, ...[2, 3, 4, 5].map((n) => `${slug}${n}`)].filter(
    (name) => name.length <= maxLength,
  );
