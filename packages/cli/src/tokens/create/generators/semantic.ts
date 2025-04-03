import * as R from 'ramda';
import semanticColorBase from '../../template/design-tokens/semantic/color.base.template.json' with { type: 'json' };
import semanticColorTemplate from '../../template/design-tokens/semantic/color.template.json' with { type: 'json' };
import categoryColorTemplate from '../../template/design-tokens/semantic/modes/color.template.json' with {
  type: 'json',
};

import type { Colors, TokenSet } from '../../types.js';

type SemanticModes = {
  'main-color': Record<string, TokenSet>;
  'support-color': Record<string, TokenSet>;
};

export const generateSemantic = (colors: Colors) => {
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
          ) as TokenSet,
        },
      };
      modes[colorCategory][colorName] = customColorTokens;
    }
  }

  const customColors = [...mainColorNames, 'neutral', ...supportColorNames];

  const semanticColorTokens = customColors.map(
    (colorName) =>
      [
        colorName,
        R.map((x) => ({ ...x, $value: x.$value.replace('<color>', colorName) }), semanticColorTemplate),
      ] as const,
  );

  const color = {
    ...semanticColorBase,
    color: {
      ...Object.fromEntries(semanticColorTokens),
      ...semanticColorBase.color,
    },
  };

  return {
    modes,
    color,
  };
};
