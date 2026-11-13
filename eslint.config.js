import js from '@eslint/js';
import globals from 'globals';

// Correctness checks only: the recommended rules plus a few that catch real
// bugs. Formatting is left to .editorconfig and review.
export default [
  { ignores: ['dist/', 'storybook-static/'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    rules: {
      // Hooks such as `updated(changed)` name their arguments for the reader.
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
      'array-callback-return': 'error',
      'no-duplicate-imports': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unreachable-loop': 'error',
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      eqeqeq: ['error', 'smart'],
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    files: ['scripts/**', 'vite.config.js', 'eslint.config.js', '.storybook/main.js'],
    languageOptions: { globals: globals.node },
  },
];
