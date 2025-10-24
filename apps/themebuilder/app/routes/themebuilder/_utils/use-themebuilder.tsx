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
  overrides?: Record<string, { light?: CssColor; dark?: CssColor }>;
  variables?: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
};

export type SeverityColorTheme = {
  name: GlobalColors;
  colors: ThemeInfo;
  hex: CssColor;
  isDefault: boolean;
  overrides?: Record<string, { light?: CssColor; dark?: CssColor }>;
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
      overrides: {},
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

export function parseColorOverrides(
  overridesParam: string | null,
): Record<string, Record<string, { light?: CssColor; dark?: CssColor }>> {
  if (!overridesParam) return {};

  const result: Record<
    string,
    Record<string, { light?: CssColor; dark?: CssColor }>
  > = {};

  try {
    // TODO: validate this using cli
    const entries = overridesParam.split(QUERY_SEPARATOR);

    for (const entry of entries) {
      const parts = entry.split('|');
      if (parts.length < 2) continue;

      const [colorName, tokenName, ...modeParts] = parts;

      if (!result[colorName]) {
        result[colorName] = {};
      }

      if (!result[colorName][tokenName]) {
        result[colorName][tokenName] = {};
      }

      for (const modePart of modeParts) {
        const [mode, hex] = modePart.split(':');
        if (mode === 'light' || mode === 'dark') {
          result[colorName][tokenName][mode] = hex as CssColor;
        }
      }
    }
  } catch (error) {
    console.error('Error parsing color overrides:', error);
  }

  return result;
}

export function applyOverridesToColors(
  colors: ColorTheme[],
  overrides: Record<
    string,
    Record<string, { light?: CssColor; dark?: CssColor }>
  >
): ColorTheme[] {
  return colors.map((color) => {
    const colorOverrides = overrides[color.name];
    if (colorOverrides && Object.keys(colorOverrides).length > 0) {
      // Apply overrides to variables
      const updatedVariables = {
        light: { ...(color.variables?.light || {}) },
        dark: { ...(color.variables?.dark || {}) },
      };

      // Update variables with overrides
      for (const [tokenName, override] of Object.entries(colorOverrides)) {
        // CSS variables are created without the color name
        const varName = `--ds-color-${tokenName}`;
        if (override.light) {
          updatedVariables.light[varName] = override.light;
        }
        if (override.dark) {
          updatedVariables.dark[varName] = override.dark;
        }
      }

      for (const [tokenName, override] of Object.entries(colorOverrides)) {
        if (override.light) {
          const lightColor = color.colors.light.find(
            (c) => c.name === tokenName,
          );
          if (lightColor) {
            lightColor.hex = override.light;
          }
        }
        if (override.dark) {
          const darkColor = color.colors.dark.find((c) => c.name === tokenName);
          if (darkColor) {
            darkColor.hex = override.dark;
          }
        }
      }

      return {
        ...color,
        overrides: colorOverrides,
        variables: updatedVariables,
      };
    }
    return color;
  });
}
