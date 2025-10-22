import {
  type CssColor,
  generateColorSchemes,
  type ThemeInfo,
} from '@digdir/designsystemet';
import { baseColors, type GlobalColors } from '@digdir/designsystemet/color';
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

export type SeverityColorTheme = {
  name: GlobalColors;
  colors: ThemeInfo;
  hex: CssColor;
  isDefault: boolean;
  variables: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
};

export const QUERY_SEPARATOR = ' ';

export const useThemebuilder = () => {
  const {
    colors,
    severityColors,
    severityEnabled,
    colorScheme,
    baseBorderRadius,
    tab,
  } = useLoaderData<Route.ComponentProps['loaderData']>();

  return {
    colors,
    severityColors,
    severityEnabled,
    colorScheme,
    baseBorderRadius,
    tab,
  };
};

export function createColorsFromQuery(colors: string | null) {
  if (!colors) return [];
  return colors.split(QUERY_SEPARATOR).map((color) => {
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

export function createSeverityColorsFromQuery(
  severityParam: string | null,
): SeverityColorTheme[] {
  const severityColors: SeverityColorTheme[] = [];
  const severityKeys: GlobalColors[] = ['info', 'success', 'warning', 'danger'];

  for (const key of severityKeys) {
    let hex = baseColors[key];
    let isDefault = true;

    // Check if this severity color is overridden in the query params
    if (severityParam) {
      const params = severityParam.split(QUERY_SEPARATOR);
      const override = params.find((p) => p.startsWith(`${key}:`));
      if (override) {
        const [, value] = override.split(':');
        hex = value as CssColor;
        isDefault = false;
      }
    }

    const colors = generateColorSchemes(hex);
    severityColors.push({
      name: key,
      hex,
      colors,
      isDefault,
      variables: {
        light: generateColorVars(colors, 'light'),
        dark: generateColorVars(colors, 'dark'),
      },
    });
  }

  return severityColors;
}
