import { generateColorScheme } from './create/generators/primitives/color-scheme.js';
import { generateGlobals } from './create/generators/primitives/globals.js';
import { generateSize, generateSizeGlobal } from './create/generators/primitives/size.js';
import { generateFontSizes, generateTypography } from './create/generators/primitives/typography.js';
import { generateSemanticColors } from './create/generators/semantic/color.js';
import { generateColorModes } from './create/generators/semantic/color-modes.js';
import { generateSemanticStyle } from './create/generators/semantic/style.js';
import { generateTheme } from './create/generators/themes/theme.js';
import type { Theme, TokenSet, TokenSetDimensions, TokenSets } from './types.js';

export const tokenSetDimensions: TokenSetDimensions = {
  colorSchemes: ['dark', 'light'],
  sizeModes: ['small', 'medium', 'large'],
};

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
  const { colorSchemes, sizeModes } = tokenSetDimensions;

  const colorTokens = Object.entries(generateColorModes(colors, name));

  const tokenSets: TokenSets = new Map([
    ['primitives/globals', generateGlobals()],
    ...sizeModes.map((size): [string, TokenSet] => [`primitives/modes/size/${size}`, generateSize(size)]),
    ['primitives/modes/size/global', generateSizeGlobal()],
    ...sizeModes.map((size): [string, TokenSet] => [
      `primitives/modes/typography/size/${size}`,
      generateFontSizes(size),
    ]),
    [`primitives/modes/typography/primary/${name}`, generateTypography(name, typography)],
    [`primitives/modes/typography/secondary/${name}`, generateTypography(name, typography)],
    ...colorSchemes.flatMap((scheme): [string, TokenSet][] => [
      [`primitives/modes/color-scheme/${scheme}/${name}`, generateColorScheme(name, scheme, colors, overrides)],
    ]),
    [`themes/${name}`, generateTheme(colors, name, borderRadius)],
    ['semantic/color', generateSemanticColors(colors, name)],
    ...colorTokens.map(([colorName, colorSetTokens]): [string, TokenSet] => [
      `semantic/color/${colorName}`,
      colorSetTokens,
    ]),
    [`semantic/style`, generateSemanticStyle()],
  ]);

  return { tokenSets };
};
