import {
  type ColorScheme,
  defaultBorderRadius,
} from '@digdir/designsystemet/internal';
import { useSearchParams } from 'react-router';
import { useThemeStore } from '~/model/theme-store';

export type { ColorTheme } from '~/model/theme-colors';

export type ThemebuilderTabs = 'examples' | 'colorsystem' | 'variables';

const tabs: ThemebuilderTabs[] = ['colorsystem', 'examples', 'variables'];

/** The theme that is shown, from the theme store, and how it is viewed, from the URL. */
export const useThemebuilder = () => {
  const { colors, theme, workspace } = useThemeStore();
  const [params] = useSearchParams();
  // `overview` is the old name of the examples tab
  const tab = (params.get('tab') || '').replace('overview', 'examples');

  return {
    colors,
    colorScheme: (params.get('appearance') === 'dark'
      ? 'dark'
      : 'light') as ColorScheme,
    baseBorderRadius: theme.borderRadius ?? defaultBorderRadius,
    tab: tabs.find((name) => name === tab) || tabs[0],
    workspace,
  };
};
