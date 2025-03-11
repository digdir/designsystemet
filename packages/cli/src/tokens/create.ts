import * as R from 'ramda';
import { baseColors, generateColorScale } from '../colors/index.js';
import type { Color, ColorScheme } from '../colors/types.js';
import typographyTemplate from './template/design-tokens/primitives/modes/typography/typography-template.json' with {
  type: 'json',
};
import semanticColorBase from './template/design-tokens/semantic/color-base-template.json' with { type: 'json' };
import semanticColorTemplate from './template/design-tokens/semantic/color-template.json' with { type: 'json' };
import categoryColorTemplate from './template/design-tokens/semantic/modes/color-template.json' with { type: 'json' };
import themeBase from './template/design-tokens/themes/theme-base-template.json' with { type: 'json' };
import themeColorTemplate from './template/design-tokens/themes/theme-template.json' with { type: 'json' };

import type { Colors, SemanticModes, Theme, Tokens, TokensSet, Typography } from './types.js';

export const cliOptions = {
  outDir: 'out-dir',
  clean: 'clean',
  theme: {
    colors: {
      main: 'main-colors',
      support: 'support-colors',
      neutral: 'neutral-color',
    },
    typography: {
      fontFamily: 'font-family',
    },
    borderRadius: 'border-radius',
  },
} as const;

const generateColor = (colorArray: Color[]): TokensSet => {
  const obj: TokensSet = {};
  const $type = 'color';
  for (const index in colorArray) {
    obj[Number(index) + 1] = { $type, $value: colorArray[index].hex };
  }
  return obj;
};

const generateTypography = (themeName: string, { fontFamily }: Typography): TokensSet => {
  return JSON.parse(
    JSON.stringify(typographyTemplate)
      .replaceAll(/<font-family>/g, fontFamily)
      .replaceAll(/<theme>/g, themeName),
  ) as TokensSet;
};

const generateColorScheme = (themeName: string, colorScheme: ColorScheme, colors: Colors): TokensSet => {
  const main = R.map((color) => generateColor(generateColorScale(color, colorScheme)), colors.main);
  const support = R.map((color) => generateColor(generateColorScale(color, colorScheme)), colors.support);
  const neutral = generateColor(generateColorScale(colors.neutral, colorScheme));

  return {
    [themeName]: {
      ...main,
      ...support,
      neutral,
    },
  };
};

const generateGlobal = (colorScheme: ColorScheme) => {
  const blueScale = generateColorScale(baseColors.blue, colorScheme);
  const greenScale = generateColorScale(baseColors.green, colorScheme);
  const orangeScale = generateColorScale(baseColors.orange, colorScheme);
  const purpleScale = generateColorScale(baseColors.purple, colorScheme);
  const redScale = generateColorScale(baseColors.red, colorScheme);

  return {
    global: {
      blue: generateColor(blueScale),
      green: generateColor(greenScale),
      orange: generateColor(orangeScale),
      purple: generateColor(purpleScale),
      red: generateColor(redScale),
    },
  };
};

const generateSemantic = (colors: Colors): Tokens['semantic'] => {
  const mainColorNames = Object.keys(colors.main);
  const supportColorNames = Object.keys(colors.support);

  const modes: SemanticModes = {
    'main-color': {},
    'support-color': {},
  };

  const categories = [
    ['main-color', mainColorNames],
    ['support-color', supportColorNames],
  ] as const;

  // Create main-color and support-color modes for the custom colors
  for (const [colorCategory, colorNames] of categories) {
    for (const colorName of colorNames) {
      const category = colorCategory.replace('-color', '');
      const customColorTokens = {
        color: {
          [category]: JSON.parse(
            JSON.stringify(
              categoryColorTemplate,
              (key, value) => {
                if (key === '$value') {
                  return (value as string).replace('<color>', colorName);
                }
                return value;
              },
              2,
            ),
          ) as TokensSet,
        },
      };
      modes[colorCategory][colorName] = customColorTokens;
    }
  }

  const customColors = [...mainColorNames, 'neutral', ...supportColorNames];
  const defaultColor = mainColorNames[0];

  const semanticColorTokens = customColors.map(
    (colorName) =>
      [
        colorName,
        R.map((x) => ({ ...x, $value: x.$value.replace('<color>', colorName) }), semanticColorTemplate),
      ] as const,
  );

  const semanticColors = {
    ...semanticColorBase,
    color: {
      ...Object.fromEntries(semanticColorTokens),
      ...semanticColorBase.color,
    },
  };
  const color = JSON.parse(
    JSON.stringify(
      semanticColors,
      (key, value) => {
        if (key === '$value') {
          return (value as string).replace('<accent-color>', defaultColor);
        }
        return value;
      },
      2,
    ),
  ) as TokensSet;

  return {
    modes,
    color,
  };
};

const generateThemes = (colors: Colors, themeName: string, borderRadius: number): Tokens['themes'] => {
  const mainColorNames = Object.keys(colors.main);
  const supportColorNames = Object.keys(colors.support);
  const customColors = [...mainColorNames, 'neutral', ...supportColorNames];

  const themeColorTokens = Object.fromEntries(
    customColors.map(
      (colorName) =>
        [
          colorName,
          R.map((x) => ({ ...x, $value: x.$value.replace('<color>', colorName) }), themeColorTemplate),
        ] as const,
    ),
  );

  const { color: themeBaseFileColor, ...remainingThemeFile } = themeBase;
  const themeFile = {
    color: {
      ...themeColorTokens,
      ...themeBaseFileColor,
    },
    ...remainingThemeFile,
  };

  const baseBorderRadius = R.lensPath(['border-radius', 'base', '$value']);
  const updatedThemeFile = R.set(baseBorderRadius, String(borderRadius), themeFile);

  return {
    [themeName]: JSON.parse(
      JSON.stringify(
        updatedThemeFile,
        (key, value) => {
          if (key === '$value') {
            return (value as string).replace('<theme>', themeName);
          }

          return value;
        },
        2,
      ),
    ) as TokensSet,
  };
};

export const createTokens = (opts: Theme) => {
  const { colors, typography, name, borderRadius } = opts;

  const tokens: Tokens = {
    primitives: {
      'colors-scheme': {
        light: {
          [name]: generateColorScheme(name, 'light', colors),
          global: generateGlobal('light'),
        },
        dark: { [name]: generateColorScheme(name, 'dark', colors), global: generateGlobal('dark') },
        // contrast: {
        //   [name]: generateThemeTokens(name, 'contrast', colors),
        //   global: generateGlobalTokens('contrast'),
        // },
      },
      typography: {
        primary: generateTypography(name, typography),
        secondary: generateTypography(name, typography),
      },
    },
    semantic: generateSemantic(colors),
    themes: generateThemes(colors, name, borderRadius),
  };

  return tokens;
};
