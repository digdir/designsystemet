module.exports = {
  plugins: [
    require('postcss-import'),
    postcssApply(),
    require('postcss-nesting'),
    require('cssnano')({
      preset: 'default',
    }),
    require('autoprefixer'),
  ],
};

function postcssApply() {
  return {
    postcssPlugin: '@apply', // Add support for @apply directive to enable inlining utility classes
    AtRule: {
      apply: (rule) => {
        rule.root().walkRules((from) => {
          if (from.selector.startsWith(`.${rule.params}`))
            rule.replaceWith(
              from.clone({
                selector: from.selector.replace(`.${rule.params}`, '&'),
              }),
            );
        });
      },
    },
  };
}
