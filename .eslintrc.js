module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
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
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
      },
      rules: {
        '@typescript-eslint/consistent-type-exports': 'warn',
        '@typescript-eslint/consistent-type-imports': 'warn',
        '@typescript-eslint/no-unsafe-enum-comparison': 'off',
        '@typescript-eslint/no-redundant-type-constituents': 'off',
      },
    },
    {
      files: ['storefront/**/*'],
      extends: ['plugin:@next/next/recommended'],
    },
  ],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    // Disabled because we use Typescript types for props
    'react/prop-types': ['off'],
    'react/jsx-no-bind': 'off',
    'react/display-name': 'off',
    'import/no-unresolved': 'error',
    'import/namespace': ['error', { allowComputed: true }],
    'import/no-named-as-default': 'off',
    '@next/next/no-html-link-for-pages': ['error', '/storefront/pages/'],
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
