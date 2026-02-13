const postcssConfig = (await import('../css/postcss.config.js')).default;

export default {
  root: __dirname,
  plugins: [],
  css: {
    postcss: postcssConfig,
  },
};
