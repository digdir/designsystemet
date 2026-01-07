import themeConfig from '../../../designsystemet.config.json';

export const themeColors = [
  ...Object.keys(themeConfig.themes.designsystemet.colors.main),
  ...Object.keys(themeConfig.themes.designsystemet.colors.support),
  'neutral',
];

export const severityColors = ['success', 'warning', 'danger', 'info'];
