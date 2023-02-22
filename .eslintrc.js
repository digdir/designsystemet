module.exports = {
  parserOptions: {
    ecmaFeatures: { jsx: true },
    project: './tsconfig.json',
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  rules: {
    // Disabled because of Typescript
    'react/prop-types': ['off'],
    'react/jsx-no-bind': 'off',
    '@typescript-eslint/consistent-type-exports': 'warn',
    '@typescript-eslint/consistent-type-imports': 'warn',
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
        project: '.',
      },
    },
  },
};
