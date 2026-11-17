import { escapeHtml } from './dom.js';

// Markdown as a forum writes it, made into HTML that is safe to show: the
// text is escaped before anything is marked up, links keep to http, https,
// mailto and the site's own addresses, and nothing else becomes a tag.
//
// Blocks: paragraphs, `#` to `###` headings, `>` quotes, `-` and `1.`
// lists with `- [ ]` tasks, ``` fenced code and `---` rules. Inline:
// **bold**, _italic_, ~~struck~~, `code`, [links](https://…), bare
// addresses, ![pictures](https://…) and @mentions.

const SAFE_URL = /^(?:https?:\/\/|mailto:|\/(?!\/)|#|\.{0,2}\/)/i;

const TOKEN = '\u0000';
const LIST = /^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/;
const FENCE = /^\s*```\s*([\w+#.-]*)\s*$/;
const HEADING = /^(#{1,3})\s+(.+?)\s*#*\s*$/;
const RULE = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/;
const QUOTE = /^\s*>\s?(.*)$/;

const isBlockStart = (line) => FENCE.test(line) || HEADING.test(line) || RULE.test(line) || QUOTE.test(line) || LIST.test(line);

/**
 * Inline markdown in one stretch of text, as HTML. `mentions` maps a handle,
 * lowercase, to the member's address, which its @mention links to.
 */
export const renderInline = (text, { mentions } = {}) => {
  const kept = [];
  const keep = (html) => `${TOKEN}${kept.push(html) - 1}${TOKEN}`;
  let html = escapeHtml(text);

  // Code first, so nothing inside it is marked up.
  html = html.replace(/`([^`\n]+)`/g, (_, code) => keep(`<code>${code}</code>`));
  html = html.replace(/!\[([^\]\n]*)\]\(([^)\s]+)\)/g, (match, alt, url) => (SAFE_URL.test(url) && !/^mailto:/i.test(url) ? keep(`<img src="${url}" alt="${alt}" loading="lazy" decoding="async">`) : match));
  html = html.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (match, label, url) => (SAFE_URL.test(url) ? keep(linkTag(url, label)) : match));
  html = html.replace(/(^|[\s(])(https?:\/\/[^\s<]+[^\s<.,:;!?)'"])/g, (_, before, url) => `${before}${keep(linkTag(url, url))}`);

  html = html
    .replace(/\*\*(?=\S)([^\n]*?\S)\*\*/g, '<strong>$1</strong>')
    .replace(/__(?=\S)([^\n]*?\S)__/g, '<strong>$1</strong>')
    .replace(/~~(?=\S)([^\n]*?\S)~~/g, '<s>$1</s>')
    .replace(/(^|[^\w*])\*(?=\S)([^*\n]*?\S)\*(?![\w*])/g, '$1<em>$2</em>')
    .replace(/(^|[^\w])_(?=\S)([^_\n]*?\S)_(?!\w)/g, '$1<em>$2</em>')
    .replace(/(^|[^\w@/&#])@([a-z0-9](?:[\w.-]*[\w])?)/gi, (_, before, handle) => {
      const href = mentions?.get?.(handle.toLowerCase());
      return `${before}${href ? `<a class="mention" href="${escapeHtml(href)}">@${handle}</a>` : `<span class="mention">@${handle}</span>`}`;
    });

  return html.replace(new RegExp(`${TOKEN}(\\d+)${TOKEN}`, 'g'), (_, index) => kept[Number(index)]);
};

const linkTag = (url, label) => {
  const external = /^https?:\/\//i.test(url);
  return `<a href="${url}"${external ? ' target="_blank" rel="noopener noreferrer nofollow"' : ''}>${label}</a>`;
};

/** A whole piece of markdown as HTML: blocks, and inline markdown inside them. */
export const renderMarkdown = (source, options = {}) => {
  const lines = String(source ?? '').replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.match(FENCE);
    if (fence) {
      const code = [];
      index += 1;
      while (index < lines.length && !FENCE.test(lines[index])) code.push(lines[index++]);
      index += 1;
      const language = fence[1] ? ` data-language="${escapeHtml(fence[1])}"` : '';
      out.push(`<pre${language}><code>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      const level = heading[1].length + 2;
      out.push(`<h${level}>${renderInline(heading[2], options)}</h${level}>`);
      index += 1;
      continue;
    }

    if (RULE.test(line)) {
      out.push('<hr>');
      index += 1;
      continue;
    }

    if (QUOTE.test(line)) {
      const quoted = [];
      while (index < lines.length && QUOTE.test(lines[index])) quoted.push(lines[index++].match(QUOTE)[1]);
      out.push(`<blockquote>${renderMarkdown(quoted.join('\n'), options)}</blockquote>`);
      continue;
    }

    const item = line.match(LIST);
    if (item) {
      const ordered = /\d/.test(item[2]);
      const items = [];
      while (index < lines.length) {
        const next = lines[index].match(LIST);
        if (!next || /\d/.test(next[2]) !== ordered) break;
        items.push(next[3]);
        index += 1;
        // A line under an item, not a new item, carries on its text.
        while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index]) && /^\s{2,}/.test(lines[index])) items[items.length - 1] += `\n${lines[index++].trim()}`;
      }
      const start = ordered && Number.parseInt(item[2], 10) !== 1 ? ` start="${Number.parseInt(item[2], 10)}"` : '';
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}${start}>${items.map((text) => {
        const task = !ordered && text.match(/^\[([ xX])\]\s+(.*)$/s);
        const body = renderInline(task ? task[2] : text, options).replace(/\n/g, '<br>');
        return task ? `<li class="task"><input type="checkbox" disabled${task[1] === ' ' ? '' : ' checked'} aria-label="${task[1] === ' ' ? 'To do' : 'Done'}">${body}</li>` : `<li>${body}</li>`;
      }).join('')}</${tag}>`);
      continue;
    }

    const paragraph = [];
    while (index < lines.length && lines[index].trim() && (paragraph.length === 0 || !isBlockStart(lines[index]))) paragraph.push(lines[index++]);
    out.push(`<p>${paragraph.map((text) => renderInline(text, options)).join('<br>')}</p>`);
  }

  return out.join('');
};
