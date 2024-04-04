const postcssLayers = require('./postcss-layers');

module.exports = {
  plugins: [
    require('postcss-import'),
    require('cssnano')({
      preset: 'default',
    }),
    postcssLayers,
  ],
};
