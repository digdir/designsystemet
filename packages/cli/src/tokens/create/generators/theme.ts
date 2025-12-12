import * as R from 'ramda';
import { baseColorNames } from '../../../colors/colorMetadata.js';
import themeBase from '../../template/design-tokens/themes/theme.base.template.json' with { type: 'json' };
import themeColorTemplate from '../../template/design-tokens/themes/theme.template.json' with { type: 'json' };

import type { Colors, TokenSet } from '../../types.js';

export const generateTheme = (colors: Colors, themeName: string, borderRadius: number) => {
  const mainColorNames = Object.keys(colors.main);
  const supportColorNames = Object.keys(colors.support);
  const customColors = [...mainColorNames, 'neutral', ...supportColorNames, ...baseColorNames];

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
      link: {
        visited: {
          $type: 'color',
          $value: `{${themeName}.link.visited}`,
        },
      },
    },
    focus: {
      inner: {
        $type: 'color',
        $value: `{${themeName}.focus.inner}`,
      },
      outer: {
        $type: 'color',
        $value: `{${themeName}.focus.outer}`,
      },
    },
    ...remainingThemeFile,
  };

  const baseBorderRadius = R.lensPath(['border-radius', 'base', '$value']);
  const updatedThemeFile = R.set(baseBorderRadius, String(borderRadius), themeFile);
  const token = JSON.parse(
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
  ) as TokenSet;

  return token;
};
