module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-prettier/recommended',
    'stylelint-config-prettier',
  ],
  rules: {
    'prettier/prettier': true,
    'custom-property-pattern': null,
    // 'custom-property-pattern': 'fds-.+', // this rule needs to be activated once we do new tokens
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]+$',
      {
        message: 'Expected class name to be camelCase',
      },
    ],
    'alpha-value-notation': 'number',
  },
};
