// Fuzzy matching and the sections a palette page shows.

const WORD_BREAK = /[\s\-_/.]/;
const WHITESPACE = /\s+/g;

const isWordStart = (text, i) => i === 0 || WORD_BREAK.test(text[i - 1] ?? '');

// The first word start at or after `from` that holds `ch`, else `from`.
const nextWordStart = (text, ch, from) => {
  for (let j = from; j < text.length; j++) if (text[j] === ch && isWordStart(text, j)) return j;
  return from;
};

const subsequence = (text, query, preferWordStarts) => {
  const matches = [];
  let score = 0;
  let from = 0;
  for (const ch of query) {
    let i = text.indexOf(ch, from);
    if (i < 0) return null;
    const prev = matches.at(-1);
    // Unless it continues a run, jump ahead to a word start holding `ch`.
    if (preferWordStarts && (prev === undefined || i !== prev + 1)) i = nextWordStart(text, ch, i);
    score += prev !== undefined && i === prev + 1 ? 6 : 1;
    score += isWordStart(text, i) ? 8 : 0;
    score -= prev === undefined ? i * 0.5 : (i - prev - 1) * 0.2;
    matches.push(i);
    from = i + 1;
  }
  return { score, matches };
};

/**
 * Fuzzy match: the matched character indices and a score that favours
 * contiguous runs, word starts and early matches; null when `query` is not
 * a subsequence of `text`.
 */
export const fuzzyMatch = (text, query) => {
  const t = text.toLowerCase();
  const q = query.toLowerCase().replace(WHITESPACE, '');
  if (!q) return { score: 0, matches: [] };
  const at = t.indexOf(q);
  if (at >= 0) return { score: 100 - at + (isWordStart(t, at) ? 30 : 0), matches: Array.from(q, (_, k) => at + k) };
  return subsequence(t, q, true) ?? subsequence(t, q, false);
};

// Parent labels and keywords still find a row, ranked lower and unbolded.
const scoreEntry = ({ item, path }, query) => {
  const onLabel = fuzzyMatch(item.label, query);
  if (onLabel) return onLabel;
  let best = null;
  for (const word of [...path.map(({ label }) => label), ...(item.keywords ?? [])]) {
    const hit = fuzzyMatch(word, query);
    if (hit && (best === null || hit.score > best)) best = hit.score;
  }
  return best === null ? null : { score: best / 2, matches: [] };
};

/** Every item with the ancestors below `items`, depth first. */
export const flatten = (items, path = []) =>
  items.flatMap((item) => [{ item, path }, ...(item.children ? flatten(item.children, [...path, item]) : [])]);

const groupRows = (rows, fallback) => {
  const groups = new Map();
  for (const row of rows) {
    const label = row.path[0]?.group ?? row.item.group ?? fallback ?? '';
    groups.set(label, [...(groups.get(label) ?? []), row]);
  }
  return [...groups].map(([label, list]) => ({ key: label || 'items', label, rows: list }));
};

/**
 * The sections on `page` (an item with children, or none for the root):
 * every item grouped, with Recent first at the root; or, while searching,
 * the matches from the page and the pages nested in it, best first.
 */
export const buildSections = (page, rootItems, query, recent) => {
  const items = page?.children ?? rootItems;
  if (!query.trim()) {
    const sections = groupRows(
      items.map((item) => ({ item, path: [], key: item.id, matches: [] })),
      page?.label,
    );
    if (!page && recent.length) sections.unshift({ key: 'recent', label: 'Recent', rows: recent.map((entry) => ({ ...entry, key: `recent-${entry.item.id}`, matches: [] })) });
    return sections;
  }
  const rows = flatten(items).flatMap((entry) => {
    const hit = scoreEntry(entry, query);
    return hit ? [{ ...entry, key: entry.item.id, ...hit }] : [];
  });
  const sections = groupRows(rows, page?.label);
  for (const section of sections) section.rows.sort((a, b) => b.score - a.score);
  return sections;
};
