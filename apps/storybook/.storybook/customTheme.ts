import { create } from 'storybook/theming';

export default create({
  brandTitle: 'Komponenter',
  // brandImage: 'logo_digdir.svg',
  fontBase: '"Inter", sans-serif',
  // Colors
  base: 'light',
  colorSecondary: '#0062BA',

  textColor: '#1e2b3c', // TODO does not work with css vars atm. bug? (propstable, <Markdown />, show code btn)
  inputTextColor: 'var(--ds-color-neutral-text-default)',
  appBg: 'var(--ds-color-neutral-background-default)',
  appPreviewBg: 'var(--ds-color-neutral-background-default)',
  appContentBg: 'transparent',
  barBg: 'var(--ds-color-neutral-background-default)',
});
