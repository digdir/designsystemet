import { addons } from 'storybook/manager-api';
import customTheme from './customThemeLight';
/* We use relative imports to get HMR updates when developing */
import '../../../packages/css/src/index.css';
import '../../../packages/css/theme/designsystemet.css';

addons.setConfig({
  theme: customTheme,
});
