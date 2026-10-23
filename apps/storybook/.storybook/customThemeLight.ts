import { create } from 'storybook/theming';

/* Styling will become significantly easier if this ever gets done:
 * https://github.com/storybookjs/storybook/discussions/24344
 * Currently most of these properties only support hex/rgba and not var() or light-dark()
 * */
export default create({
  brandTitle: 'Designsystemet',
  brandImage: 'logo_designsystemet.svg',
  fontBase: '"Inter", sans-serif',
  base: 'light',
});
