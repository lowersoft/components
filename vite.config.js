import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { compileAsync } from 'sass-embedded';
import { defineConfig } from 'vite';

const root = import.meta.dirname;
const componentsDir = resolve(root, 'src/components');

// One entry per component so consumers can import only what they use.
const componentEntries = Object.fromEntries(
  readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map(({ name }) => [`components/${name}`, resolve(componentsDir, name, 'index.js')]),
);

// Ship the default theme as a static stylesheet for use before JavaScript loads.
const themeStylesheet = () => ({
  name: 'lw-theme-stylesheet',
  apply: 'build',
  async generateBundle() {
    const { css } = await compileAsync(resolve(root, 'src/styles/themes.scss'), { style: 'compressed' });
    this.emitFile({ type: 'asset', fileName: 'themes.css', source: css });
  },
});

export default defineConfig({
  plugins: [themeStylesheet()],
  build: {
    target: 'es2022',
    lib: {
      entry: { index: resolve(root, 'src/index.js'), ...componentEntries },
      formats: ['es'],
    },
    rolldownOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'shared/[name]-[hash].js',
        // Keep the runtime every component needs in one stable chunk. Helpers
        // used by only some components are split by usage, so a page loads
        // just what its components use.
        codeSplitting: {
          groups: [
            { name: 'core', test: /\/src\/(core\/(config|define|lw-element|styles)\.js|styles\/(host|themes)\.scss)/ },
          ],
        },
      },
    },
  },
});
