import type { CssColor, SeverityColorNames } from '../index.ts';

// Separate const defaults to avoid circular dependency issues with the Theme type
export const defaultFontFamily = 'Inter';
export const defaultBorderRadius = 4;
export const visitedLinkColor = '#663299';

export const severityColors: Record<SeverityColorNames, CssColor> = {
  info: '#0A71C0',
  success: '#068718',
  warning: '#EA9B1B',
  danger: '#C01B1B',
};

export const severityColorNames = Object.keys(severityColors) as Array<keyof typeof severityColors>;
