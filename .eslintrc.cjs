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
    'plugin:react/jsx-runtime',
    'plugin:storybook/recommended',
    'prettier',
  ],
  plugins: ['import', 'react', 'jsx-a11y'],
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
        ecmaVersion: 'latest',
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
        project: [
          './tsconfig.json',
          './packages/*/tsconfig.json',
          './tsconfig.node.json',
          './apps/*/tsconfig.json'
        ],
      },
      rules: {
        '@typescript-eslint/consistent-type-exports': 'warn',
        '@typescript-eslint/consistent-type-imports': 'warn',
        'prefer-const': 'warn',
      },
    },
    {
      files: ['apps/storefront/**/*', 'apps/dev/**/*', 'apps/theme/**/*'],
      extends: ['plugin:@next/next/recommended'],
    },
  ],
  rules: {
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    // Disabled because we use Typescript types for props
    'react/prop-types': ['off'],
    'react/jsx-no-bind': 'off',
    'react/display-name': 'off',
    'import/no-unresolved': 'error',
    'import/namespace': ['error', { allowComputed: true }],
    'import/no-named-as-default': 'off',
    '@next/next/no-html-link-for-pages': ['error', 'apps/storefront/pages/'],
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
        project: [
          /* all tsconfig files */
          'tsconfig.json',
          './**/tsconfig.json',
        ],
      },
    },
  },
};
