import type { Theme } from '../../tokens/types.ts';

// Separate const defaults to avoid circular dependency issues with the Theme type
export const defaultFontFamily = 'Inter';
export const defaultBorderRadius = 4;

export const defaultTheme: Theme = {
  name: 'default',
  colors: { neutral: '#24272B' },
  borderRadius: defaultBorderRadius,
  typography: { fontFamily: defaultFontFamily },
};
