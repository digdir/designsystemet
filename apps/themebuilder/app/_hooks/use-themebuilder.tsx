import {
  type ColorScheme,
  defaultBorderRadius,
} from '@digdir/designsystemet/internal';
import { useSearchParams } from 'react-router';
import { useThemeStore } from '~/model/theme-store';

export type { ColorTheme } from '~/model/theme-colors';

/** The theme that is shown, from the theme store, and its colour scheme, from the URL. */
export const useThemebuilder = () => {
  const { colors, theme, workspace } = useThemeStore();
  const [params] = useSearchParams();

  return {
    colors,
    colorScheme: (params.get('appearance') === 'dark'
      ? 'dark'
      : 'light') as ColorScheme,
    baseBorderRadius: theme.borderRadius ?? defaultBorderRadius,
    workspace,
  };
};
