import type { ColorMetadataByName } from '../../../../colors/types.js';
import type { Colors, Token, TokenSet } from '../../../types.js';

type SemanticModes = {
  'main-color': Record<string, TokenSet>;
  'support-color': Record<string, TokenSet>;
};

export const generateColorModes = (colors: Colors, _themeName: string) => {
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
          [category]: generateNamedColorScale(colorName),
        },
      };
      modes[colorCategory][colorName] = customColorTokens;
    }
  }

  return modes;
};

const generateNamedColorScale = (colorName: string): Record<keyof ColorMetadataByName, Token> => {
  const steps: Array<keyof ColorMetadataByName> = [
    'background-default',
    'background-tinted',
    'surface-default',
    'surface-tinted',
    'surface-hover',
    'surface-active',
    'border-subtle',
    'border-default',
    'border-strong',
    'text-subtle',
    'text-default',
    'base-default',
    'base-hover',
    'base-active',
    'base-contrast-subtle',
    'base-contrast-default',
  ];

  const colorScale: Record<keyof ColorMetadataByName, Token> = {} as Record<keyof ColorMetadataByName, Token>;

  for (const step of steps) {
    colorScale[step] = {
      $type: 'color',
      $value: `{color.${colorName}.${step}}`,
    };
  }

  return colorScale;
};
