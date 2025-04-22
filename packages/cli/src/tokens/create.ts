import type { ColorScheme } from '../colors/types.js';
import { getDefaultToken, getDefaultTokens } from './create/defaults.js';
import { generateColorGlobal, generateColorScheme } from './create/generators/color.js';
import { generateSemantic } from './create/generators/semantic.js';
import { generateTheme } from './create/generators/theme.js';
import { generateTypography } from './create/generators/typography.js';

import type { Theme, TokenSet, TokenSets } from './types.js';

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

export const createTokens = async (opts: Theme) => {
  const { colors, typography, name, borderRadius } = opts;
  const colorSchemes: ColorScheme[] = ['light', 'dark'];

  const semantic = generateSemantic(colors);

  const tokenSets: TokenSets = new Map([
    ...getDefaultTokens([
      'primitives/globals',
      'primitives/modes/size/small',
      'primitives/modes/size/medium',
      'primitives/modes/size/large',
      'primitives/modes/size/global',
      'primitives/modes/typography/size/small',
      'primitives/modes/typography/size/medium',
      'primitives/modes/typography/size/large',
    ]),
    [`primitives/modes/typography/primary/${name}`, generateTypography(name, typography)],
    [`primitives/modes/typography/secondary/${name}`, generateTypography(name, typography)],
    ...colorSchemes.flatMap((scheme): [string, TokenSet][] => [
      [`primitives/modes/color-scheme/${scheme}/global`, generateColorGlobal(scheme)],
      [`primitives/modes/color-scheme/${scheme}/${name}`, generateColorScheme(name, scheme, colors)],
    ]),
    [`themes/${name}`, generateTheme(colors, name, borderRadius)],
    ['semantic/color', semantic.color],
    // maps out semantic modes, ieg 'semantic/modes/main-color/accent', and 'semantic/modes/support-color/brand1'
    ...Object.entries(semantic.modes).flatMap(([mode, colors]): [string, TokenSet][] =>
      Object.entries(colors).map(([key, colorSet]): [string, TokenSet] => [`semantic/modes/${mode}/${key}`, colorSet]),
    ),
    getDefaultToken('semantic/style'),
  ]);

  return { tokenSets };
};
