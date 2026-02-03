import type { ColorScheme } from '../colors/types.js';
import { getDefaultTokens } from './create/defaults.js';
import { generateColorScheme } from './create/generators/color.js';
import { generateTypography } from './create/generators/primitives/typography.js';
import { generateSemanticColors } from './create/generators/semantic/color.js';
import { generateColorModes } from './create/generators/semantic/color-modes.js';
import { generateSemanticStyle } from './create/generators/semantic/style.js';
import { generateTheme } from './create/generators/theme.js';
import type { SizeModes, Theme, TokenSet, TokenSets } from './types.js';

export const cliOptions = {
  outDir: 'out-dir',
  clean: 'clean',
  tailwind: 'tailwind',
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

export const createTokens = async (theme: Theme) => {
  const { colors, typography, name, borderRadius, overrides } = theme;
  const colorSchemes: ColorScheme[] = ['light', 'dark'];
  const sizeModes: SizeModes[] = ['small', 'medium', 'large'];

  const tokenSets: TokenSets = new Map([
    ...getDefaultTokens([
      'primitives/globals',
      ...sizeModes.map((size) => `primitives/modes/size/${size}`),
      'primitives/modes/size/global',
      ...sizeModes.map((size) => `primitives/modes/typography/size/${size}`),
    ]),
    [`primitives/modes/typography/primary/${name}`, generateTypography(name, typography)],
    [`primitives/modes/typography/secondary/${name}`, generateTypography(name, typography)],
    ...colorSchemes.flatMap((scheme): [string, TokenSet][] => [
      [`primitives/modes/color-scheme/${scheme}/${name}`, generateColorScheme(name, scheme, colors, overrides)],
    ]),
    [`themes/${name}`, generateTheme(colors, name, borderRadius)],
    ['semantic/color', generateSemanticColors(colors, name)],
    // maps out semantic modes, ieg 'semantic/modes/main-color/accent', and 'semantic/modes/support-color/brand1'
    ...Object.entries(generateColorModes(colors, name)).flatMap(([mode, colors]): [string, TokenSet][] =>
      Object.entries(colors).map(([key, colorSet]): [string, TokenSet] => [`semantic/modes/${mode}/${key}`, colorSet]),
    ),
    [`semantic/style`, generateSemanticStyle()],
  ]);

  return { tokenSets };
};
