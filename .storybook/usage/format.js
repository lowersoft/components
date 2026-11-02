// Pretty-prints a story's markup: one element per line, nested by two
// spaces, short elements kept on one line and long tags broken one
// attribute per line.

const WIDTH = 88;
const INDENT = '  ';
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW = new Set(['script', 'style']);

const escapeText = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const escapeAttribute = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const collapse = (value) => value.replace(/\s+/g, ' ');

const tagName = (el) => (el.namespaceURI === 'http://www.w3.org/1999/xhtml' ? el.localName : el.tagName);
const childrenOf = (node) => [...(node.localName === 'template' ? node.content.childNodes : node.childNodes)];
// JSON reads better in single quotes than with every quote escaped.
const attributeList = (el) =>
  [...el.attributes].map(({ name, value }) => {
    if (value === '') return name;
    if (value.includes('"') && !value.includes("'")) return `${name}='${value.replaceAll('&', '&amp;')}'`;
    return `${name}="${escapeAttribute(value)}"`;
  });

const isElement = (node) => node.nodeType === Node.ELEMENT_NODE;
const hasComponent = (el) => el.localName.startsWith('lw-') || [...el.querySelectorAll('*')].some((child) => child.localName.startsWith('lw-'));
// A div with nothing but inline style only lays the demo out.
const isLayout = (node) => isElement(node) && node.localName === 'div' && [...node.attributes].every(({ name }) => name === 'style');
// Hidden from everyone and holding no component: a sketch of the page around it.
const isDecoration = (node) => isElement(node) && node.getAttribute('aria-hidden') === 'true' && !hasComponent(node);
const isBlank = (node) => node.nodeType === Node.TEXT_NODE && !node.data.trim();

/** The story's markup without the scaffolding it is shown in. */
const unwrap = (nodes) => {
  let kept = nodes.filter((node) => !isBlank(node) && !isDecoration(node));
  while (kept.length === 1 && isLayout(kept[0])) kept = childrenOf(kept[0]).filter((node) => !isBlank(node) && !isDecoration(node));
  return kept;
};

// Drops the indentation a template literal gave a script or style.
const dedent = (text) => {
  const lines = text.replace(/^\s*\n|\n\s*$/g, '').split('\n');
  const indent = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)[0].length));
  return lines.map((line) => line.slice(indent).trimEnd());
};

/** The node on a single line. */
const inline = (node) => {
  if (node.nodeType === Node.TEXT_NODE) return escapeText(collapse(node.data));
  if (node.nodeType === Node.COMMENT_NODE) return `<!-- ${node.data.trim()} -->`;
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  const name = tagName(node);
  const open = [name, ...attributeList(node)].join(' ');
  if (VOID.has(name)) return `<${open}>`;
  const inner = RAW.has(name) ? collapse(node.textContent).trim() : childrenOf(node).map(inline).join('').trim();
  return `<${open}>${inner}</${name}>`;
};

const block = (node, depth) => {
  const pad = INDENT.repeat(depth);
  if (node.nodeType === Node.TEXT_NODE) {
    const text = collapse(node.data).trim();
    return text ? [pad + escapeText(text)] : [];
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return node.nodeType === Node.COMMENT_NODE ? [pad + inline(node)] : [];

  const name = tagName(node);
  const line = inline(node);
  // Inline SVG is drawing data, not structure: it stays on one line.
  if (pad.length + line.length <= WIDTH || name === 'svg') return [pad + line];

  const attributes = attributeList(node);
  const head = `${pad}<${[name, ...attributes].join(' ')}>`;
  const close = VOID.has(name) ? '' : `</${name}>`;
  const inner = RAW.has(name)
    ? dedent(node.textContent).map((text) => (text ? pad + INDENT + text : ''))
    : childrenOf(node).flatMap((child) => block(child, depth + 1));
  // An empty element closes on the line that opens it.
  const end = inner.length ? '' : close;

  const open = head.length <= WIDTH || !attributes.length ? [head + end] : [`${pad}<${name}`, ...attributes.map((attribute) => pad + INDENT + attribute), `${pad}>${end}`];
  return inner.length ? [...open, ...inner, pad + close] : open;
};

/** Format a story's markup, given as a string or as nodes. */
export const formatMarkup = (source) => {
  let nodes;
  if (typeof source === 'string') {
    const template = document.createElement('template');
    template.innerHTML = source;
    nodes = [...template.content.childNodes];
  } else if (source instanceof DocumentFragment) {
    nodes = [...source.childNodes];
  } else if (source instanceof Node) {
    nodes = [source];
  } else {
    return { markup: '', tags: [] };
  }
  nodes = unwrap(nodes);

  const tags = new Set();
  const collect = (node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.localName.startsWith('lw-')) tags.add(node.localName);
    childrenOf(node).forEach(collect);
  };
  nodes.forEach(collect);

  return { markup: nodes.flatMap((node) => block(node, 0)).join('\n'), tags: [...tags] };
};
