const postcss = require('postcss');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
  plugins: [
    require('postcss-import'),
    postcssComposes(),
    require('postcss-nesting'),
    require('cssnano')({
      preset: 'default',
    }),
    require('autoprefixer'),
  ],
};

function postcssComposes() {
  return {
    postcssPlugin: '@composes', // Allows `@composes classname from './file.css'` directive
    AtRule: {
      composes: async (rule, { AtRule }) => {
        const cache = {};
        const sanitizedParams = rule.params.replace(/["']/g, '').trim();
        const [selector, from] = sanitizedParams.split(/\s+from\s+/);

        const resolvedFrom = path.resolve(
          path.dirname(rule.source.input.file),
          from,
        );

        if (!cache[resolvedFrom])
          cache[resolvedFrom] = await postcss([]).process(
            fs.readFileSync(resolvedFrom),
            {
              from: resolvedFrom,
            },
          );

        cache[resolvedFrom].root.walkRules((fromRule) => {
          if (fromRule.selector.startsWith(`.${selector}`))
            rule.replaceWith(
              fromRule.clone({
                selector: fromRule.selector.replace(`.${selector}`, '&'),
              }),
            );
        });
      },
    },
  };
}
