import { addons } from 'storybook/manager-api';
import customTheme from './customThemeLight';
import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';

addons.setConfig({
  theme: customTheme,
});
