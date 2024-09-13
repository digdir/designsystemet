const postcss = require('postcss');
const fs = require('node:fs');

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
      composes: async (rule) => {
        const cache = {};
        const sanitizedParams = rule.params.replace(/["']/g, '').trim();
        const [selector, from] = sanitizedParams.split(/\s+from\s+/);

        if (!cache[from])
          cache[from] = await postcss([]).process(fs.readFileSync(from), {
            from,
          });

        cache[from].root.walkRules((from) => {
          if (from.selector.startsWith(`.${selector}`))
            rule.replaceWith(
              from.clone({
                selector: from.selector.replace(`.${selector}`, '&'),
              }),
            );
        });
      },
    },
  };
}
