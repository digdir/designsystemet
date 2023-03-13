module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['import', 'react', 'jsx-a11y', 'prettier'],
  overrides: [
    {
      // Typescript
      files: ['**/*.ts?(x)'],
      extends: [
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/consistent-type-exports': 'warn',
        '@typescript-eslint/consistent-type-imports': 'warn',
      },
    },
    {
      files: ['storefront/**/*'],
      extends: ['plugin:@next/next/recommended'],
    },
  ],
  rules: {
    // Disabled because we use Typescript types for props
    'react/prop-types': ['off'],
    'react/jsx-no-bind': 'off',
    'import/no-unresolved': 'error',
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
      },
    },
  },
};
