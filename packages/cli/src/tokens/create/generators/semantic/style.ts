import * as R from 'ramda';
import { type SemanticColorNames, semanticColorMap } from '../../../../colors/types.ts';
import type { BorderRadiusConfig, BorderWidthConfig, ShadowConfig, Token, TokenSet, Typography } from '../../../types.ts';
import { borderWidthKey } from '../../../utils.ts';

// Wraps each typography value from the config in a design token, recursing into nested groups like body.short
const generateTypographyTokens = (group: Record<string, unknown>): TokenSet =>
  Object.fromEntries(
    Object.entries(group).map(([name, value]) => [
      name,
      value !== null && typeof value === 'object' && 'fontFamily' in value
        ? ({ $type: 'typography', $value: value } as Token)
        : generateTypographyTokens(value as Record<string, unknown>),
    ]),
  );

export function generateSemanticStyle(
  colorNames: string[],
  borderWidth: BorderWidthConfig,
  borderRadius: BorderRadiusConfig,
  typography: Typography,
  shadow: ShadowConfig,
): TokenSet {
  return {
    ...generateColors(colorNames),
    // Each border-width from the config references the primitive keyed by its width, e.g. focus '3px' -> {border-width.3}
    'border-width': Object.fromEntries(
      Object.entries(borderWidth).map(([name, value]) => [
        name,
        {
          $type: 'borderWidth',
          $value: `{border-width.${borderWidthKey(value)}}`,
        },
      ]),
    ),
    // Each border-radius step from the config references the primitive numbered scale by position,
    // e.g. the first step 'sm' -> {border-radius.1}
    'border-radius': Object.fromEntries(
      Object.keys(borderRadius.steps).map((name, index) => [
        name,
        {
          $type: 'dimension',
          $value: `{border-radius.${index + 1}}`,
        },
      ]),
    ),
    opacity: {
      disabled: {
        $type: 'opacity',
        $value: '{opacity.30}',
      },
    },
    typography: generateTypographyTokens(typography.components),
    // Each shadow from the config references the primitive numbered scale by position,
    // e.g. the first shadow 'xs' -> {shadow.100}
    shadow: Object.fromEntries(
      Object.keys(shadow).map((name, index) => [
        name,
        {
          $type: 'boxShadow',
          $value: `{shadow.${(index + 1) * 100}}`,
        },
      ]),
    ),
    size: {
      '0': {
        $type: 'dimension',
        $value: '{_size.0}',
      },
      '1': {
        $type: 'dimension',
        $value: '{_size.1}',
      },
      '2': {
        $type: 'dimension',
        $value: '{_size.2}',
      },
      '3': {
        $type: 'dimension',
        $value: '{_size.3}',
      },
      '4': {
        $type: 'dimension',
        $value: '{_size.4}',
      },
      '5': {
        $type: 'dimension',
        $value: '{_size.5}',
      },
      '6': {
        $type: 'dimension',
        $value: '{_size.6}',
      },
      '7': {
        $type: 'dimension',
        $value: '{_size.7}',
      },
      '8': {
        $type: 'dimension',
        $value: '{_size.8}',
      },
      '9': {
        $type: 'dimension',
        $value: '{_size.9}',
      },
      '10': {
        $type: 'dimension',
        $value: '{_size.10}',
      },
      '11': {
        $type: 'dimension',
        $value: '{_size.11}',
      },
      '12': {
        $type: 'dimension',
        $value: '{_size.12}',
      },
      '13': {
        $type: 'dimension',
        $value: '{_size.13}',
      },
      '14': {
        $type: 'dimension',
        $value: '{_size.14}',
      },
      '15': {
        $type: 'dimension',
        $value: '{_size.15}',
      },
      '18': {
        $type: 'dimension',
        $value: '{_size.18}',
      },
      '22': {
        $type: 'dimension',
        $value: '{_size.22}',
      },
      '26': {
        $type: 'dimension',
        $value: '{_size.26}',
      },
      '30': {
        $type: 'dimension',
        $value: '{_size.30}',
      },
    },
  } satisfies TokenSet;
}

const generateColors = (colorNames: string[]) => {
  const semanticColorTokens = colorNames.map((colorName) => [colorName, generateColorScaleTokens(colorName)]);

  return {
    ...baseColorTemplate,
    color: {
      ...Object.fromEntries(semanticColorTokens),
      ...baseColorTemplate.color,
    },
  };
};

const baseColorTemplate: TokenSet = {
  color: {
    focus: {
      inner: {
        $type: 'color',
        $value: '{color.focus.inner-color}',
      },
      outer: {
        $type: 'color',
        $value: '{color.focus.outer-color}',
      },
    },
  },
  link: {
    color: {
      visited: {
        $type: 'color',
        $value: '{color.link.visited}',
      },
    },
  },
};

const generateColorScaleTokens = (colorName: string): Record<SemanticColorNames, Token> => {
  const colorScale = {} as Record<SemanticColorNames, Token>;

  for (const [colorSemantic, colorNumber] of R.toPairs(semanticColorMap)) {
    colorScale[colorSemantic] = {
      $type: 'color',
      $value: `{color.${colorName}.${colorNumber}}`,
    };
  }

  return colorScale;
};
