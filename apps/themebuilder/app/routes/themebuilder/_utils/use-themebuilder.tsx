import {
  type CssColor,
  type ThemeInfo,
  generateColorSchemes,
} from '@digdir/designsystemet';
import { useLoaderData } from 'react-router';
import {
  generateColorVars,
  generateNeutralColorVars,
} from '~/_utils/generate-color-vars';
import type { Route } from '../+types/themebuilder';

export type ColorTheme = {
  name: string;
  colors: ThemeInfo;
  hex?: string;
};

export const useThemebuilder = () => {
  const { colors, colorScheme, baseBorderRadius, tab } =
    useLoaderData<Route.ComponentProps['loaderData']>();

  return {
    colors,
    colorScheme,
    baseBorderRadius,
    tab,
  };
};

export function createColorsFromQuery(colors: string) {
  return colors.split(' ').map((color) => {
    const [name, hex] = color.split(':');
    return {
      name,
      hex,
      ...createColorsAndVariables(hex as CssColor),
    };
  });
}

export function createColorsAndVariables(color: CssColor) {
  const colors = generateColorSchemes(color);
  return {
    colors,
    variables: {
      light: generateColorVars(colors, 'light'),
      dark: generateColorVars(colors, 'dark'),
    },
  };
}

export function createColorsAndNeutralVariables(color: CssColor) {
  const colors = generateColorSchemes(color);
  return {
    colors,
    variables: {
      light: generateNeutralColorVars(colors, 'light'),
      dark: generateNeutralColorVars(colors, 'dark'),
    },
  };
}
