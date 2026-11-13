import { createElement as h, Fragment, useEffect, useState } from 'react';
import { AddonPanel, SyntaxHighlighter } from 'storybook/internal/components';
import { useChannel, useStorybookState } from 'storybook/manager-api';
import { styled } from 'storybook/theming';
import { USAGE_REQUEST, USAGE_RESULT } from './events.js';

const PACKAGE = '@lowersoft/lw';
const CDN = `https://cdn.jsdelivr.net/npm/${PACKAGE}/dist`;

const Page = styled.div(({ theme }) => ({
  display: 'grid',
  gap: 24,
  maxWidth: 960,
  padding: '20px 20px 32px',
  fontSize: theme.typography.size.s2,
  lineHeight: 1.5,
  color: theme.color.defaultText,
}));

const Section = styled.section({ display: 'grid', gap: 8, minWidth: 0 });

const Heading = styled.h3(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.size.s1,
  fontWeight: theme.typography.weight.bold,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: theme.textMutedColor,
}));

const Lead = styled.div({
  display: 'grid',
  gap: 8,
  maxWidth: 720,
  'p, ul': { margin: 0 },
  ul: { display: 'grid', gap: 4, paddingLeft: 20 },
});

const Title = styled.h2(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fonts.mono,
  fontSize: theme.typography.size.m1,
  fontWeight: theme.typography.weight.bold,
}));

const Note = styled.p(({ theme }) => ({ margin: 0, color: theme.textMutedColor }));

const Code = styled.code(({ theme }) => ({
  padding: '1px 5px',
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: 4,
  background: theme.background.app,
  fontFamily: theme.typography.fonts.mono,
  fontSize: '0.92em',
  whiteSpace: 'nowrap',
}));

const Table = styled.table(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: theme.appBorderRadius,
  'th, td': {
    padding: '8px 12px',
    borderBottom: `1px solid ${theme.appBorderColor}`,
    textAlign: 'left',
    verticalAlign: 'top',
  },
  th: {
    background: theme.background.app,
    fontWeight: theme.typography.weight.bold,
    color: theme.textMutedColor,
  },
  'td:first-of-type': { whiteSpace: 'nowrap' },
  'tr:last-of-type td': { borderBottom: 0 },
}));

const Type = styled.span(({ theme }) => ({ fontFamily: theme.typography.fonts.mono, fontSize: '0.92em', color: theme.textMutedColor }));

// Doc comments mark code with backticks.
const text = (value) => value.split(/`([^`]+)`/).map((part, i) => (i % 2 ? h(Code, { key: i }, part) : part));

const block = (language, code) => h(SyntaxHighlighter, { language, copyable: true, bordered: true, padded: true }, code);

const table = (title, columns, rows) =>
  rows.length > 0 &&
  h(
    Section,
    null,
    h(Heading, null, title),
    h(
      Table,
      null,
      h('thead', null, h('tr', null, columns.map(([label]) => h('th', { key: label }, label)))),
      h('tbody', null, rows.map((row, i) => h('tr', { key: i }, columns.map(([label, cell]) => h('td', { key: label }, cell(row)))))),
    ),
  );

const From = styled.span(({ theme }) => ({ display: 'block', marginTop: 4, fontSize: theme.typography.size.s1, color: theme.textMutedColor }));

// Rows a base class documents say which one.
const name = ({ name, from }) => h(Fragment, null, h(Code, null, name || '(default)'), from && h(From, null, `from ${from}`));
const description = ({ description }) => text(description);
// Unions break after each bar instead of widening the table.
const type = ({ type }) => type && h(Type, null, type.replaceAll('|', '|\u200b'));

const Usage = ({ data }) => {
  const { markup, entries, reference } = data;
  const scripts = entries.map((entry) => `<script type="module" src="${CDN}/components/${entry}.js"></script>`);
  const imports = entries.map((entry) => `import '${PACKAGE}/components/${entry}';`);

  return h(
    Page,
    null,
    reference &&
      h(
        Lead,
        null,
        h(Title, null, `<${reference.tag}>`),
        reference.description.map((part, i) => {
          if (part.code) return h('div', { key: i }, block(part.language, part.code));
          if (part.items) return h('ul', { key: i }, part.items.map((item, j) => h('li', { key: j }, text(item))));
          return h('p', { key: i }, text(part.text));
        }),
      ),
    h(
      Section,
      null,
      h(Heading, null, 'HTML'),
      h(Note, null, 'Load the component as a module, then use it like any other element.'),
      block('html', [...scripts, '', markup].join('\n')),
    ),
    h(Section, null, h(Heading, null, 'With a bundler'), block('bash', `npm install ${PACKAGE}`), block('js', imports.join('\n'))),
    reference &&
      h(
        Fragment,
        null,
        table('Attributes', [['Name', name], ['Type', type], ['Description', description]], reference.attributes),
        table('Events', [['Name', name], ['Description', description]], reference.events),
        table('Slots', [['Name', name], ['Description', description]], reference.slots),
        table('CSS parts', [['Name', name], ['Description', description]], reference.parts),
        table('CSS custom properties', [['Name', name], ['Description', description]], reference.properties),
        reference.see.length > 0 &&
          h(
            Section,
            null,
            h(Heading, null, 'See also'),
            reference.see.map((line, i) => h(Note, { key: i }, text(line.replace(/^\S+/, '`$&`')))),
          ),
      ),
  );
};

const Waiting = styled.p(({ theme }) => ({ margin: 0, padding: 20, color: theme.textMutedColor }));

/** The Usage tab: how to load the story's component and write it in HTML. */
export const UsagePanel = ({ active }) => {
  const [data, setData] = useState(null);
  const { storyId } = useStorybookState();
  const emit = useChannel({ [USAGE_RESULT]: setData });

  useEffect(() => emit(USAGE_REQUEST), []);

  return h(AddonPanel, { active }, data?.storyId === storyId ? h(Usage, { data }) : h(Waiting, null, 'Rendering the story…'));
};
