import { create } from '@storybook/theming';

export default create({
  brandTitle: 'Komponenter',
  // brandImage: 'logo_digdir.svg',
  fontBase: '"Inter", sans-serif',
  // Colors
  base: 'light',
  colorSecondary: '#0062BA',
  barTextColor: 'var(--ds-color-neutral-text-default)',
  textColor: '#1e2b3c', // TODO does not work with css vars atm. bug?
  inputTextColor: 'var(--ds-color-neutral-text-default)',
  appBg: 'var(--ds-color-neutral-background-default)',
  appPreviewBg: 'var(--ds-color-neutral-background-default)',
  appContentBg: 'var(--ds-color-neutral-background-default)',
});
