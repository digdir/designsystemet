import { customElementVsCodePlugin } from 'custom-element-vs-code-integration';

export default {
  globs: ['src/**/*.ts'],
  exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'src/**/utils/**'],
  outdir: 'dist',
  litelement: false,
  plugins: [
    customElementVsCodePlugin({
      cssFileName: null,
      htmlFileName: 'vscode.html-custom-data.json',
      outdir: 'dist',
    }),
  ],
};
