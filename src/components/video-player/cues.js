// Reading the timed text a video player is given: WebVTT and SRT files for
// captions, chapters and thumbnails, or the same as plain arrays.

const TIMESTAMP = /^(?:(\d+):)?(\d{1,2}):(\d{2})(?:[.,](\d{1,3}))?$/;

/** Seconds from `01:02:03.500`, `02:03.500`, `02:03,500` or `02:03`; NaN otherwise. */
export const parseTimestamp = (text) => {
  const match = TIMESTAMP.exec(String(text).trim());
  if (!match) return Number.NaN;
  const [, hours = '0', minutes, seconds, fraction = '0'] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds) + Number(fraction.padEnd(3, '0')) / 1000;
};

/**
 * The cues of a WebVTT or SRT file, as `{ start, end, text }` in seconds.
 * Headers, notes, styles and regions are skipped, and so is any block whose
 * timing does not read.
 */
export const parseCues = (source) => {
  const cues = [];
  const blocks = String(source).replace(/^\ufeff/, '').replace(/\r\n?/g, '\n').split(/\n{2,}/);
  for (const block of blocks) {
    const lines = block.split('\n');
    const at = lines.findIndex((line) => line.includes('-->'));
    if (at < 0) continue;
    const [from, rest = ''] = lines[at].split('-->');
    const start = parseTimestamp(from);
    const end = parseTimestamp(rest.trim().split(/\s+/)[0]);
    if (Number.isNaN(start) || Number.isNaN(end)) continue;
    cues.push({ start, end, text: lines.slice(at + 1).join('\n').trim() });
  }
  return cues;
};

/** WebVTT from WebVTT or SRT text: SRT only needs a header and dots for commas. */
export const toVtt = (source) => {
  const text = String(source).replace(/^\ufeff/, '').replace(/\r\n?/g, '\n');
  if (/^WEBVTT/.test(text)) return text;
  return `WEBVTT\n\n${text.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')}`;
};

/** The text at `url`; rejects on a network error or a status that is not OK. */
export const fetchText = async (url, signal) => {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.text();
};

// The first of `values` that is a finite number; null and empty strings are not 0.
const number = (...values) => values.filter((value) => value != null && value !== '').map(Number).find((value) => Number.isFinite(value));

/**
 * Chapters from an array of `{ start, end?, title }`, also read as
 * `startTime`, `endTime`, `time` and `text`. Sorted, each one ends where the
 * next begins unless it says otherwise, the last at `Infinity` until the
 * duration is known.
 */
export const normalizeChapters = (list) => {
  const chapters = (Array.isArray(list) ? list : [])
    .map((item) => ({ start: number(item.start, item.startTime, item.time) ?? Number.NaN, end: number(item.end, item.endTime), title: String(item.title ?? item.text ?? '') }))
    .filter((item) => Number.isFinite(item.start))
    .sort((a, b) => a.start - b.start);
  return chapters.map((chapter, i) => ({ ...chapter, end: chapter.end ?? chapters[i + 1]?.start ?? Number.POSITIVE_INFINITY }));
};

/** Chapters from the cues of a chapters file. */
export const chaptersFromCues = (cues) => normalizeChapters(cues.map(({ start, end, text }) => ({ start, end, title: text })));

/**
 * Thumbnails from the cues of a thumbnails file: each cue names an image,
 * relative to the file, with an optional `#xywh=` tile of a sprite sheet.
 */
export const thumbnailsFromCues = (cues, base) =>
  cues.map(({ start, end, text }) => {
    const [path, hash = ''] = text.split('#');
    const tile = /xywh=(\d+),(\d+),(\d+),(\d+)/.exec(hash);
    const [x, y, width, height] = tile ? tile.slice(1).map(Number) : [];
    return { start, end, url: new URL(path, base).href, x, y, width, height };
  });

/**
 * Thumbnails from an array of `{ start, end?, url, x?, y?, width?, height? }`,
 * also read as `startTime`, `endTime` and `src`.
 */
export const normalizeThumbnails = (list, base = document.baseURI) =>
  (Array.isArray(list) ? list : [])
    .map((item) => ({
      start: number(item.start, item.startTime) ?? Number.NaN,
      end: number(item.end, item.endTime),
      url: new URL(item.url ?? item.src ?? '', base).href,
      x: number(item.x),
      y: number(item.y),
      width: number(item.width, item.w),
      height: number(item.height, item.h),
    }))
    .filter((item) => Number.isFinite(item.start))
    .sort((a, b) => a.start - b.start);

/** The last item that starts at or before `time`, by binary search over items sorted by `start`. */
export const itemAt = (items, time) => {
  let lo = 0;
  let hi = items.length - 1;
  let found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (items[mid].start <= time) {
      found = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return found;
};

/** A list from a property that takes an array or JSON for one, or null for a URL. */
export const listOrUrl = (value) => {
  if (Array.isArray(value)) return { list: value };
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) return { list: [] };
  if (text.startsWith('[')) {
    try {
      return { list: JSON.parse(text) };
    } catch {
      return { list: [] };
    }
  }
  return { url: text };
};
