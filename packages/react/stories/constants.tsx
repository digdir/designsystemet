import themeConfig from '../../../designsystemet.config.json';

export const themeColors = [
  ...Object.keys(themeConfig.themes.designsystemet.colors.main),
  ...Object.keys(themeConfig.themes.designsystemet.colors.support),
  'neutral',
];

export const severityColors = ['success', 'warning', 'danger', 'info'];

export const placeholderImg = (
  <img
    src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    alt='1x1 transparent pixel'
  />
);
