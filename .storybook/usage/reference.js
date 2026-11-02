// Reads a component's API from the JSDoc on its class: the description and
// its @attr, @fires, @slot, @csspart, @cssprop and @see tags.

// Sources load on demand, one component at a time.
const sources = import.meta.glob(['../../src/components/*/*.js', '!../../src/components/*/*.stories.js', '!../../src/components/*/index.js'], {
  query: '?raw',
  import: 'default',
});

const files = Object.keys(sources).map((path) => ({ path, dir: path.split('/').at(-2) }));

// Each entry's index registers its tags: `define('radio', …)` is <lw-radio>.
const entries = new Map(
  Object.entries(import.meta.glob('../../src/components/*/index.js', { query: '?raw', import: 'default', eager: true })).flatMap(([path, source]) =>
    [...source.matchAll(/define\('([\w-]+)'/g)].map(([, name]) => [`lw-${name}`, path.split('/').at(-2)]),
  ),
);

/** The package entry that registers `<lw-name>`. */
export const entryOf = (tag) => entries.get(tag);

const className = (tag) => tag.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());

// `{Array<{id: string}>}` holds braces of its own, so the type is read by depth.
const splitType = (text) => {
  if (!text.startsWith('{')) return ['', text];
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}' && --depth === 0) return [text.slice(1, i), text.slice(i + 1).trim()];
  }
  return ['', text];
};

const parseTag = (kind, text) => {
  const [type, rest] = splitType(text);
  // `@slot - Label` documents the default slot.
  const [, name = '', description] = rest.match(/^(?:-(?=\s|$)|(\S*))\s*(?:-\s+)?([\s\S]*)$/);
  return { kind, type, name, description: description.trim() };
};

// A paragraph, or a paragraph leading into a `- ` list, with the hard wraps
// of the comment undone.
const paragraph = (text) => {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const start = lines.findIndex((line) => line.startsWith('- '));
  const intro = (start === -1 ? lines : lines.slice(0, start)).join(' ');
  const items = [];
  for (const line of start === -1 ? [] : lines.slice(start)) {
    if (line.startsWith('- ')) items.push(line.slice(2));
    else items[items.length - 1] += ` ${line}`;
  }
  return [...(intro ? [{ text: intro }] : []), ...(items.length ? [{ items }] : [])];
};

// Paragraphs, lists and fenced code samples.
const describe = (prose) =>
  prose
    .join('\n')
    .split(/^```(\w*)\n([\s\S]*?)\n```$/m)
    .flatMap((part, i, parts) => {
      // The split keeps each fence's language and code as two extra parts.
      if (i % 3 === 1) return [];
      if (i % 3 === 2) return [{ language: parts[i - 1] || 'html', code: part }];
      return part.split(/\n\s*\n/).flatMap(paragraph);
    });

const parse = (doc) => {
  const lines = doc.split('\n').map((line) => line.replace(/^\s*\*\s?/, ''));
  const prose = [];
  const tags = [];
  for (const line of lines) {
    const tag = line.match(/^@(\w+)\s*(.*)$/);
    if (tag) tags.push({ kind: tag[1], text: tag[2] });
    else if (tags.length) tags.at(-1).text += line.trim() ? ` ${line.trim()}` : '';
    else prose.push(line);
  }
  const parsed = tags.map(({ kind, text }) => parseTag(kind, text.trim()));
  const of = (kind) => parsed.filter((tag) => tag.kind === kind);
  return {
    description: describe(prose),
    attributes: of('attr'),
    events: of('fires'),
    slots: of('slot'),
    parts: of('csspart'),
    properties: of('cssprop'),
    see: of('see').map(({ name, description }) => `${name} ${description}`.trim()),
  };
};

const cache = new Map();

/** The documented API of `<lw-name>`, or null when its class has no JSDoc. */
export const referenceOf = (tag) => {
  if (!cache.has(tag)) cache.set(tag, load(tag));
  return cache.get(tag);
};

// Finds `export class Name`, its doc comment and the class it extends, in
// the given files.
const findClass = async (name, paths) => {
  const pattern = new RegExp(String.raw`(?:/\*\*((?:(?!\*/)[\s\S])*)\*/\s*)?export class ${name}\b(?:\s+extends\s+(\w+))?`);
  for (const path of paths) {
    const source = await sources[path]();
    const match = source.match(pattern);
    if (match) return { path, source, doc: match[1], parent: match[2] };
  }
  return null;
};

// The file a class is imported from, as a key of `sources`.
const importOf = (name, { path, source }) => {
  for (const [, names, from] of source.matchAll(/import\s*\{([^}]*)\}\s*from\s*'([^']+)'/g)) {
    if (!names.split(',').some((part) => part.trim() === name)) continue;
    const resolved = new URL(from, `http://x/${path.replace(/^(\.\.\/)+/, '')}`).pathname;
    return `../..${resolved}` in sources ? `../..${resolved}` : null;
  }
  return null;
};

const tagOf = (name) => name.replace(/[A-Z]/g, (c, i) => (i ? '-' : '') + c.toLowerCase());
const KINDS = ['attributes', 'events', 'slots', 'parts', 'properties'];

const load = async (tag) => {
  const found = await findClass(className(tag), files.filter(({ dir }) => dir === entryOf(tag)).map(({ path }) => path));
  if (!found?.doc) return null;
  const reference = { tag, ...parse(found.doc) };

  // What the classes up the chain document applies too, unless this one
  // documents it again. Each row says where it comes from.
  const inherited = [];
  let current = found;
  while (current?.parent) {
    const name = current.parent;
    current = await findClass(name, [current.path, importOf(name, current)].filter(Boolean));
    if (!current?.doc) continue;
    inherited.push(name);
    const from = entries.has(tagOf(name)) ? `<${tagOf(name)}>` : name;
    const parsed = parse(current.doc);
    for (const kind of KINDS) {
      const own = new Set(reference[kind].map((row) => row.name));
      reference[kind].push(...parsed[kind].filter((row) => !own.has(row.name)).map((row) => ({ ...row, from })));
    }
  }
  // A pointer to a class now merged in says nothing more.
  reference.see = reference.see.filter((line) => !inherited.includes(line.split(' ')[0]));
  return reference;
};
