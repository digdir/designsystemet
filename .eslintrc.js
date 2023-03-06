module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: ['eslint:recommended', 'plugin:import/recommended', 'prettier'],
  overrides: [
    {
      // Typescript
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
      rules: {
        // Disabled because we use Typescript types for props
        'react/prop-types': ['off'],
        'react/jsx-no-bind': 'off',
        '@typescript-eslint/consistent-type-exports': 'warn',
        '@typescript-eslint/consistent-type-imports': 'warn',
      },
    },
  ],
  rules: {
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
