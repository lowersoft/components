// Addresses are `{ street, apt, city, region, postal, country }`.

/** The parts in the order they are read and laid out. */
export const PARTS = ['street', 'apt', 'city', 'region', 'postal', 'country'];

// Photon: an OpenStreetMap geocoder made for search as you type. Its data
// is © OpenStreetMap contributors, which the suggestions credit.
const PHOTON = 'https://photon.komoot.io/api/';
const LIMIT = 6;
// Where the house number comes first: "12 Market Street", not "Market Street 12".
const NUMBER_FIRST = new Set(['US', 'CA', 'GB', 'IE', 'AU', 'NZ', 'FR', 'IN', 'ZA', 'SG', 'MY', 'PH', 'LU']);

/** The second line of a suggestion: "New York, NY 10002, United States". */
export const placeOf = ({ city, region, postal, country }) => [city, [region, postal].filter(Boolean).join(' '), country].filter(Boolean).join(', ');

// Photon's result as an address. Names stay local, as a letter is addressed;
// the country is named in the page's language.
const toAddress = ({ housenumber, street, name, city, town, district, locality, county, state, postcode, country, countrycode }, countries) => {
  const code = countrycode?.toUpperCase();
  let line = street ?? name ?? '';
  if (housenumber && street) line = NUMBER_FIRST.has(code) ? `${housenumber} ${street}` : `${street} ${housenumber}`;
  return {
    street: line,
    apt: '',
    city: city ?? town ?? district ?? locality ?? county ?? '',
    region: state && state !== city ? state : '',
    postal: postcode ?? '',
    country: (code && countries.of(code)) || country || '',
  };
};

/**
 * Searches addresses anywhere in the world: houses and streets that match
 * `query`, most relevant first. `lang` names the countries.
 */
export const searchAddresses = async (query, { signal, lang = 'en' } = {}) => {
  const url = new URL(PHOTON);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(LIMIT * 2));
  url.searchParams.set('lang', 'default');
  for (const layer of ['house', 'street']) url.searchParams.append('layer', layer);
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Address search failed: ${response.status}`);
  const { features = [] } = await response.json();
  let countries;
  try {
    countries = new Intl.DisplayNames([lang, 'en'], { type: 'region' });
  } catch {
    countries = new Intl.DisplayNames(['en'], { type: 'region' });
  }
  // The same address can come back more than once, for its building and
  // its entrance: each is listed once.
  const seen = new Set();
  return features
    .map(({ properties }) => toAddress(properties, countries))
    .filter((address) => {
      const key = `${address.street}|${placeOf(address)}`;
      if (!address.street || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, LIMIT);
};

// Lowercase without accents, so "kurfursten" finds "Kurfürstendamm".
const fold = (text) => text.normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase('en');

const words = (query) => fold(query).split(/[\s,]+/).filter(Boolean);

// Where `term` starts a word in `text`: "st" in "Market Street", not in "Austin".
const wordStarts = (text, term) => {
  const found = [];
  let at = text.indexOf(term);
  while (at !== -1) {
    if (at === 0 || !/[\p{L}\p{N}]/u.test(text[at - 1])) found.push(at);
    at = text.indexOf(term, at + 1);
  }
  return found;
};

/**
 * `text` as DOM nodes with the word starts that match a word of `query`
 * in `<mark>`. Folding keeps one character per character for most scripts;
 * where it does not, the text is shown as it is.
 */
export const highlight = (text, query) => {
  const folded = fold(text);
  if (folded.length !== text.length) return [document.createTextNode(text)];
  const marked = new Array(text.length).fill(false);
  for (const term of words(query)) {
    for (const at of wordStarts(folded, term)) marked.fill(true, at, at + term.length);
  }
  const nodes = [];
  let start = 0;
  for (let i = 1; i <= text.length; i++) {
    if (i < text.length && marked[i] === marked[start]) continue;
    const part = text.slice(start, i);
    nodes.push(marked[start] ? Object.assign(document.createElement('mark'), { textContent: part }) : document.createTextNode(part));
    start = i;
  }
  return nodes;
};
