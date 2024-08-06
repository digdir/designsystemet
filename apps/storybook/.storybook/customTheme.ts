import { create } from '@storybook/theming';

export default create({
  brandTitle: 'Komponenter',
  // brandImage: 'logo_digdir.svg',
  fontBase: '"Inter", sans-serif',
  // Colors
  base: 'light',
  colorSecondary: '#0062BA',
  barTextColor: '#243142',
  textColor: '#1e2b3c', // TODO does not work with css vars atm. bug?
  inputTextColor: '#243142',
  appBg: '#fefefe',
  appPreviewBg: 'var(--ds-color-neutral-background-default)',
  appContentBg: '#fefefe',
});
