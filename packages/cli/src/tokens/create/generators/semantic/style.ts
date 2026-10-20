import type {
  BorderRadiusConfig,
  BorderWidthConfig,
  OpacityConfig,
  ShadowConfig,
  SizeConfig,
  Token,
  TokenSet,
  TypographyComponents,
} from '../../../types.ts';
import { numericKey, tokensFromRecord } from '../../../utils.ts';

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
  borderWidth: BorderWidthConfig,
  borderRadius: BorderRadiusConfig,
  typographyComponents: TypographyComponents,
  shadow: ShadowConfig,
  size: SizeConfig,
  opacity: OpacityConfig,
): TokenSet {
  return {
    ...baseColorTemplate,
    // Each border-width from the config references the primitive keyed by its width, e.g. focus '3px' -> {border-width.3}
    'border-width': tokensFromRecord(borderWidth, 'borderWidth', (value) => `{border-width.${numericKey(value)}}`),
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
    // Each opacity from the config references the primitive keyed by its value, e.g. disabled '30%' -> {opacity.30}
    opacity: tokensFromRecord(opacity, 'opacity', (value) => `{opacity.${numericKey(value)}}`),
    typography: generateTypographyTokens(typographyComponents),
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
    size: tokensFromRecord(size.scale, 'dimension', (_, step) => `{_size.${step}}`),
  } satisfies TokenSet;
}

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
