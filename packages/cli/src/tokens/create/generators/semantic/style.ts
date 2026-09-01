import * as R from 'ramda';
import { type SemanticColorNames, semanticColorMap } from '../../../../colors/types.ts';
import type {
  BorderRadiusConfig,
  BorderWidthConfig,
  ShadowConfig,
  SizeConfig,
  Token,
  TokenSet,
  Typography,
} from '../../../types.ts';
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
  size: SizeConfig,
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
    // Each size step from the config references the primitive scale by its key, e.g. '4' -> {_size.4}
    size: Object.fromEntries(
      Object.keys(size.scale).map((step) => [
        step,
        {
          $type: 'dimension',
          $value: `{_size.${step}}`,
        },
      ]),
    ),
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
