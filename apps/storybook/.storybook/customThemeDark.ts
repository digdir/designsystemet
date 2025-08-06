import { create } from 'storybook/theming';

/* Styling will become significantly easier if this ever gets done:
 * https://github.com/storybookjs/storybook/discussions/24344
 * Currently most of these properties only support hex/rgba and not var() or light-dark()
 * */
export default create({
  brandTitle: 'Komponenter',
  // brandImage: 'logo_digdir.svg',
  fontBase: '"Inter", sans-serif',
  // Colors
  base: 'dark',
  colorSecondary: '#0062BA',

  textColor: '#ebeced', // TODO does not work with css vars atm. bug? (propstable, <Markdown />, show code btn)
  inputTextColor: 'var(--ds-color-neutral-text-default)',
  appBg: 'var(--ds-color-neutral-background-default)',
  appPreviewBg: 'var(--ds-color-neutral-background-default)',
  appContentBg: 'transparent',
  barBg: 'var(--ds-color-neutral-background-default)',
});
