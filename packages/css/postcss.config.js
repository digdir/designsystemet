import fs from 'node:fs';
import path from 'node:path';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssNesting from 'postcss-nesting';

export default {
  plugins: [
    postcssImport,
    postcssComposes(),
    postcssNesting,
    cssnano({
      preset: 'default',
    }),
    autoprefixer,
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
          if (fromRule.selector.split(/:|\s/)[0] === `.${selector}`) {
            const newSelector = fromRule.selector.replace(`.${selector}`, '&');

            // When the source rule's selector is exactly `.${selector}` (no
            // trailing pseudo-classes/elements), inline its children directly
            // into the parent of `@composes` instead of wrapping them in a
            // `& { ... }` rule. This makes `@composes` work inside
            // pseudo-elements (e.g. `::before`), where postcss-nesting would
            // otherwise produce an invalid `:is(...::before)` selector.
            if (newSelector === '&') {
              rule.replaceWith(fromRule.nodes.map((node) => node.clone()));
            } else {
              rule.replaceWith(fromRule.clone({ selector: newSelector }));
            }
          }
        });
      },
    },
  };
}
