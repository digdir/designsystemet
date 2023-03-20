module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-prettier/recommended',
    'stylelint-config-prettier',
  ],
  plugins: ['stylelint-prettier', 'stylelint-order'],
  ignoreFiles: ['dist/**.css'],
  rules: {
    'prettier/prettier': true,
    'order/properties-alphabetical-order': true,
    'custom-property-pattern': null,
    // 'custom-property-pattern': 'fds-.+', // this rule needs to replaced the one above once we have new tokens
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]+$',
      {
        message: 'Expected class name to be camelCase',
      },
    ],
    'alpha-value-notation': 'number',
  },
};
