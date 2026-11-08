// Scaffold a component: `npm run new <kebab-name> <Category>`, e.g.
// `npm run new card-flip "Data Display/Cards"`. The category is the story's
// place in the Storybook sidebar; see "Where a component goes" in CONTRIBUTING.md.
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const allowNewCategory = args.includes('--new-category');
const [name, category] = args.filter((arg) => arg !== '--new-category');

if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name ?? '') || !category) {
  console.error('Usage: npm run new <kebab-case-name> <Category>   e.g. npm run new card-flip "Data Display/Cards"');
  process.exit(1);
}

const root = resolve(import.meta.dirname, '..');
const components = resolve(root, 'src/components');
const dir = resolve(components, name);

// The categories the stories use now. Opening another is a deliberate step:
// it takes --new-category, and a place in storySort in .storybook/preview.js.
const categories = new Set();
for (const entry of readdirSync(components)) {
  for (const file of readdirSync(resolve(components, entry)).filter((f) => f.endsWith('.stories.js'))) {
    const title = readFileSync(resolve(components, entry, file), 'utf8').match(/^ {2}title: ['"]([^'"]+)['"]/m)?.[1];
    if (title) categories.add(title.slice(0, title.lastIndexOf('/')));
  }
}

if (!categories.has(category) && !allowNewCategory) {
  console.error(`"${category}" is not a category yet. Pick one of:\n  ${[...categories].sort().join('\n  ')}`);
  console.error('To open a new one, run npm run new -- <name> "<Category>" --new-category and place it in storySort in .storybook/preview.js.');
  process.exit(1);
}

if (existsSync(dir)) {
  console.error(`Component "${name}" already exists.`);
  process.exit(1);
}

const pascal = name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const className = `Lw${pascal}`;
const tag = `lw-${name}`;
const title = pascal.replace(/(?<=.)([A-Z])/g, ' $1');

const files = {
  [`${name}.js`]: `import { LwElement } from '../../core/lw-element.js';
import styles from './${name}.scss?inline';

/**
 * ${title}.
 *
 * @slot - Content
 * @csspart base
 */
export class ${className} extends LwElement {
  static styles = styles;
  static props = {};

  render() {
    return '<div class="${name}" part="base"><slot></slot></div>';
  }
}
`,
  [`${name}.scss`]: `@use '../../styles' as lw;

:host {
  display: block;
}

.${name} {
  color: lw.v(color-foreground);
}
`,
  'index.js': `import { define } from '../../core/define.js';
import { ${className} } from './${name}.js';

define('${name}', ${className});

export { ${className} };
`,
  [`${name}.stories.js`]: `import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: '${category}/${title}',
  component: '${tag}',
  render: (args) => \`<${tag} \${attributes(args)}>${title}</${tag}>\`,
  args: {},
};

export const Default = {};
`,
};

mkdirSync(dir);
for (const [file, content] of Object.entries(files)) writeFileSync(resolve(dir, file), content);
appendFileSync(resolve(root, 'src/index.js'), `export * from './components/${name}/index.js';\n`);

console.log(`Created <${tag}> in src/components/${name}/`);
