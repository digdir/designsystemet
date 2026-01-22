import type { ColorScheme } from '../colors/types.js';
import { getDefaultTokens } from './create/defaults.js';
import { generateColorScheme } from './create/generators/color.js';
import { generateFont } from './create/generators/font.js';
import { generateFontSizeGlobal, generateFontSizeMode } from './create/generators/fontSize.js';
import { generateSemantic } from './create/generators/semantic.js';
import { generateSemanticStyle } from './create/generators/semanticStyle.js';
import { generateTheme } from './create/generators/theme.js';

import type { Theme, TokenSet, TokenSets } from './types.js';

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
  const sizeModes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];

  // TODO handle default font definition somewhere else
  const fontDefinitions = typography.fonts ?? {
    primary: {
      // Use deprecated typography.fontFamily as fallback if no typography.fonts is defined
      fontFamily: typography.fontFamily ?? 'Inter',
      fontWeight: {
        regular: 'Regular',
        medium: 'Medium',
        semibold: 'Semi bold',
      },
    },
  };

  const fontNames = Object.keys(fontDefinitions);

  const semantic = generateSemantic(colors, name);

  const tokenSets: TokenSets = new Map([
    ...getDefaultTokens([
      'primitives/globals',
      'primitives/modes/size/global',
      ...sizeModes.map((size) => `primitives/modes/size/${size}`),
    ]),
    ...fontNames.map((font): [string, TokenSet] => [
      `primitives/modes/fonts/${font}/size/global/${name}`,
      generateFontSizeGlobal(name, font),
    ]),
    ...fontNames.flatMap((font): [string, TokenSet][] =>
      sizeModes.map((size) => [
        `primitives/modes/fonts/${font}/size/${size}/${name}`,
        generateFontSizeMode(size, name, font, typography.fonts?.[font]?.size),
      ]),
    ),
    ...colorSchemes.map((scheme): [string, TokenSet] => [
      `primitives/modes/color-scheme/${scheme}/${name}`,
      generateColorScheme(name, scheme, colors, overrides),
    ]),
    ...fontNames.map((font): [string, TokenSet] => [
      `primitives/fonts/${font}/${name}`,
      generateFont(name, font, fontDefinitions[font]),
    ]),
    // TODO: Take font-mapping config (heading -> typography.secondary) etc
    [`themes/${name}`, generateTheme(colors, name, fontNames, borderRadius, typography)],
    ['semantic/color', semantic.color],
    // maps out semantic modes, ieg 'semantic/modes/main-color/accent', and 'semantic/modes/support-color/brand1'
    ...Object.entries(semantic.modes).flatMap(([mode, colors]): [string, TokenSet][] =>
      Object.entries(colors).map(([key, colorSet]): [string, TokenSet] => [`semantic/modes/${mode}/${key}`, colorSet]),
    ),
    [`semantic/style`, generateSemanticStyle()],
  ]);

  return { tokenSets, themeDimensions: { colorSchemes, fontNames, sizeModes } };
};
