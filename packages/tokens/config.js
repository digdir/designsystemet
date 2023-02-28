// eslint-disable-next-line @typescript-eslint/no-var-requires
const noCase = require('change-case').noCase;

module.exports = {
  source: ['dist/tokens.json'],
  transform: {
    /**
     * Transforms `level1.level2.another_level` to `level1-level2-another_level`
     * This maintains hierarchy distinction (i.e. underscore is not a hierarchy level separator)
     */
    'name/cti/hierarchical-kebab': {
      type: 'name',
      transformer: (token, options) => {
        return noCase([options.prefix].concat(token.path).join('-'), {
          delimiter: '-',
          stripRegexp: /[^A-Z0-9_]+/gi,
        });
      },
    },
  },
  platforms: {
    js: {
      transformGroup: 'js',
      files: [
        {
          destination: 'dist/tokens.cjs.js',
          format: 'javascript/module-flat',
        },
        {
          destination: 'dist/tokens.esm.js',
          format: 'javascript/es6',
        },
        {
          destination: 'dist/tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },
    css: {
      // `transformGroup: "css"` includes the transforms below, except for `name/cti/hierarchical-kebab`
      transforms: [
        'attribute/cti',
        'name/cti/hierarchical-kebab',
        'time/seconds',
        'content/icon',
        'size/rem',
        'color/css',
      ],
      files: [
        {
          destination: 'dist/tokens.css',
          format: 'css/variables',
        },
      ],
    },
  },
};
