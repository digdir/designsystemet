import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import _import from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import jsxA11Y from 'eslint-plugin-jsx-a11y';
import reactCompiler from 'eslint-plugin-react-compiler';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:import/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:react/jsx-runtime',
      'plugin:storybook/recommended',
      'prettier',
    ),
  ),
  {
    plugins: {
      import: fixupPluginRules(_import),
      react: fixupPluginRules(react),
      'jsx-a11y': fixupPluginRules(jsxA11Y),
      'react-compiler': reactCompiler,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },

    settings: {
      react: {
        version: '18',
      },

      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },

      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['tsconfig.json', './**/tsconfig.json'],
        },
      },
    },

    rules: {
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
      'react/prop-types': ['off'],
      'react/jsx-no-bind': 'off',
      'react/display-name': 'off',
      'import/no-unresolved': 'error',
      'import/namespace': [
        'error',
        {
          allowComputed: true,
        },
      ],

      'import/no-named-as-default': 'off',
      'jsx-a11y/no-autofocus': 'off',

      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
        },
      ],
    },
  },
  ...fixupConfigRules(
    compat.extends(
      'plugin:import/typescript',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ),
  ).map((config) => ({
    ...config,
    files: ['**/*.ts?(x)'],
  })),
  {
    files: ['**/*.ts?(x)'],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        tsconfigRootDir: 'C:\\kode\\designsystemet',

        ecmaFeatures: {
          jsx: true,
        },

        project: [
          './tsconfig.json',
          './packages/*/tsconfig.json',
          './tsconfig.node.json',
        ],
      },
    },

    rules: {
      '@typescript-eslint/consistent-type-exports': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      'prefer-const': 'warn',
      'react-compiler/react-compiler': 'warn',
    },
  },

  {
    ignores: [
      '**/node_modules/**',
      '**/*.d.ts*',
      '**/dist/',
      'packages/theme/brand/**/*',
      'packages/react-old/**/*',
      '**/tsc-build/**',
      '.storybook',
    ],
  },
];
