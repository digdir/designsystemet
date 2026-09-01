import * as R from 'ramda';
import { type ColorNumber, semanticColorMap } from '../../../../colors/types.ts';
import type { BorderRadiusConfig, Token, TokenSet } from '../../../types.ts';

export const generateTheme = (colorNames: string[], themeName: string, borderRadius: BorderRadiusConfig) => {
  const themeColorTokens = Object.fromEntries(
    colorNames.map((colorName) => [colorName, generateColorScaleTokens(colorName, themeName)]),
  );

  const { color: themeBaseFileColor, ...remainingThemeFile } = generateBase(themeName, borderRadius);
  const themeFile = {
    color: {
      ...themeColorTokens,
      ...themeBaseFileColor,
      link: {
        visited: {
          $type: 'color',
          $value: `{${themeName}.link.visited}`,
        },
      },
      focus: {
        'inner-color': {
          $type: 'color',
          $value: `{${themeName}.focus.inner}`,
        },
        'outer-color': {
          $type: 'color',
          $value: `{${themeName}.focus.outer}`,
        },
      },
    },
    ...remainingThemeFile,
  };

  const token = JSON.parse(
    JSON.stringify(
      themeFile,
      (key, value) => {
        if (key === '$value') {
          return (value as string).replace('<theme>', themeName);
        }

        return value;
      },
      2,
    ),
  ) as TokenSet;

  return token;
};

/**
 * Maps the placeholders used in the border-radius step formulas from the config
 * to the token references used in the generated token sets.
 */
const placeholderReplacements: [placeholder: string, tokenReference: string][] = [
  ['{base}', '{border-radius.base}'],
  ['{scale}', '{border-radius.scale}'],
];

const toTokenFormula = (formula: string): string =>
  placeholderReplacements.reduce((value, [placeholder, tokenReference]) => {
    return value.replaceAll(placeholder, tokenReference);
  }, formula);

const generateBorderRadius = (borderRadius: BorderRadiusConfig): TokenSet => ({
  // The steps are output as a numbered scale, in the order they are defined in the config.
  ...Object.fromEntries(
    Object.values(borderRadius.steps).map((formula, index) => [
      String(index + 1),
      {
        $type: 'dimension',
        $value: toTokenFormula(formula),
      },
    ]),
  ),
  base: {
    $type: 'dimension',
    $value: String(borderRadius.base),
  },
  scale: {
    $type: 'dimension',
    $value: String(borderRadius.scale),
  },
});

const generateBase = (themeName: string, borderRadius: BorderRadiusConfig): TokenSet => ({
  color: {},
  'font-family': {
    $type: 'fontFamilies',
    $value: `{${themeName}.font-family}`,
  },
  'font-weight': {
    medium: {
      $type: 'fontWeights',
      $value: `{${themeName}.font-weight.medium}`,
    },
    semibold: {
      $type: 'fontWeights',
      $value: `{${themeName}.font-weight.semibold}`,
    },
    regular: {
      $type: 'fontWeights',
      $value: `{${themeName}.font-weight.regular}`,
    },
  },
  'border-radius': generateBorderRadius(borderRadius),
});

const generateColorScaleTokens = (colorName: string, themeName: string): Record<ColorNumber, Token> => {
  const colorScale = {} as Record<ColorNumber, Token>;

  for (const [_, colorNumber] of R.toPairs(semanticColorMap)) {
    colorScale[colorNumber] = {
      $type: 'color',
      $value: `{${themeName}.${colorName}.${colorNumber}}`,
    };
  }

  return colorScale;
};
