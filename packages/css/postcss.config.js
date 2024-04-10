module.exports = {
  plugins: [
    require('postcss-import'),
    require('cssnano')({
      preset: 'default',
    }),
    require('./postcss-layers'),
    require('autoprefixer'),
  ],
};
