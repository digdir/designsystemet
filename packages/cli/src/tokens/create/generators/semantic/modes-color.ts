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
          [category]: JSON.parse(
            JSON.stringify(
              colorModesTemplate,
              (key, value) => {
                if (key === '$value') {
                  return (value as string).replace('<color>', colorName);
                }
                return value;
              },
              2,
            ),
          ) as TokenSet,
        },
      };
      modes[colorCategory][colorName] = customColorTokens;
    }
  }

  return modes;
};

const colorModesTemplate: Record<keyof ColorMetadataByName, Token> = {
  'background-default': {
    $type: 'color',
    $value: '{color.<color>.background-default}',
  },
  'background-tinted': {
    $type: 'color',
    $value: '{color.<color>.background-tinted}',
  },
  'surface-default': {
    $type: 'color',
    $value: '{color.<color>.surface-default}',
  },
  'surface-tinted': {
    $type: 'color',
    $value: '{color.<color>.surface-tinted}',
  },
  'surface-hover': {
    $type: 'color',
    $value: '{color.<color>.surface-hover}',
  },
  'surface-active': {
    $type: 'color',
    $value: '{color.<color>.surface-active}',
  },
  'border-subtle': {
    $type: 'color',
    $value: '{color.<color>.border-subtle}',
  },
  'border-default': {
    $type: 'color',
    $value: '{color.<color>.border-default}',
  },
  'border-strong': {
    $type: 'color',
    $value: '{color.<color>.border-strong}',
  },
  'text-subtle': {
    $type: 'color',
    $value: '{color.<color>.text-subtle}',
  },
  'text-default': {
    $type: 'color',
    $value: '{color.<color>.text-default}',
  },
  'base-default': {
    $type: 'color',
    $value: '{color.<color>.base-default}',
  },
  'base-hover': {
    $type: 'color',
    $value: '{color.<color>.base-hover}',
  },
  'base-active': {
    $type: 'color',
    $value: '{color.<color>.base-active}',
  },
  'base-contrast-subtle': {
    $type: 'color',
    $value: '{color.<color>.base-contrast-subtle}',
  },
  'base-contrast-default': {
    $type: 'color',
    $value: '{color.<color>.base-contrast-default}',
  },
};
