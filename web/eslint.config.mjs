/* Pyxis pyxis-ignite configuration */
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import perfectionistNatural from 'eslint-plugin-perfectionist';
import a11y from 'eslint-plugin-jsx-a11y';

const config = defineConfig([
  {
    ...js.configs.recommended,
    ignores: ['**/dist/**', '**/node_modules/**', '**/.storybook/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': ts,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      perfectionist: perfectionistNatural,
      'jsx-a11y': a11y,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...ts.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'perfectionist/sort-named-types': 'off',
      'perfectionist/sort-intersection-types': 'off',
    },
  },
  {
    files: ['*.config.*', '**/.storybook/**'],
    rules: { '@typescript-eslint/no-unused-vars': 'off' },
  },
]);

export default config;
