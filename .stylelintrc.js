module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-prettier',
  ],
  plugins: ['stylelint-prettier'],
  ignoreFiles: ['**/dist/**/**.css'],
  rules: {
    'prettier/prettier': true,
    'declaration-block-no-redundant-longhand-properties': null,
    'custom-property-pattern': null,
    // 'custom-property-pattern': 'fds-.+', // this rule needs to replaced the one above once we have new tokens
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]+$',
      {
        severity: 'warning',
        message:
          'Its recommened to use camelCase for local class names when using CSS modules',
      },
    ],
    'alpha-value-notation': 'number',
  },
};
