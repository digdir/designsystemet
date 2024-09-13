/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'declaration-block-no-redundant-longhand-properties': null,
    'media-feature-range-notation': 'prefix',
    'custom-property-pattern': null,
    'selector-class-pattern': [
      '(^[a-z][a-zA-Z0-9]+)|([a-z]+)$',
      {
        severity: 'warning',
        message: 'Its recommened to use camelCase or kebab-case',
      },
    ],
    'alpha-value-notation': 'number',
    'font-family-name-quotes': 'always-unless-keyword',
    'at-rule-no-unknown': [true, { ignoreAtRules: ['apply'] }], // Allow @apply directive to inline existing utility classes into a class name
  },
};
