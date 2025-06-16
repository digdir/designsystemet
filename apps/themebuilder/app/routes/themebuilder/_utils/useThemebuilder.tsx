import { type CssColor, generateColorSchemes } from '@digdir/designsystemet';
import { useLoaderData } from 'react-router';
import { generateColorVars } from '~/_utils/generate-color-vars';
import type { Route } from '../+types/themebuilder';

export const useThemebuilder = () => {
  const { colors, colorScheme, baseBorderRadius } =
    useLoaderData<Route.ComponentProps['loaderData']>();

  return {
    colors,
    colorScheme,
    baseBorderRadius,
  };
};

export function createColorsFromQuery(colors: string) {
  return colors.split(' ').map((color) => {
    const [name, hex] = color.split(':');
    return {
      name,
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
