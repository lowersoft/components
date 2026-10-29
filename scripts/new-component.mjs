// Scaffold a component: `npm run new <kebab-name> [Category]`, e.g. `npm run new card-flip Cards`.
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [name, category = 'Components'] = process.argv.slice(2);

if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name ?? '')) {
  console.error('Usage: npm run new <kebab-case-name> [Category]   e.g. npm run new card-flip Cards');
  process.exit(1);
}

const root = resolve(import.meta.dirname, '..');
const dir = resolve(root, 'src/components', name);

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
