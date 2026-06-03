import { addons } from 'storybook/manager-api';
import customTheme from './customThemeLight';
import '@digdir/designsystemet-css';
import '@digdir/designsystemet-css/theme.css';

addons.setConfig({
  theme: customTheme,
});
