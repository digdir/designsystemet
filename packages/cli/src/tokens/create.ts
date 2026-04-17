import type { ColorScheme } from '../colors/types.js';
import { generateColorScheme } from './create/generators/primitives/color-scheme.js';
import { generateGlobals } from './create/generators/primitives/globals.js';
import { generateSize, generateSizeGlobal } from './create/generators/primitives/size.js';
import {
  generateFont,
  generateFontSizeGlobal,
  generateFontSizeMode,
} from './create/generators/primitives/typography.js';
import { generateSemanticColors } from './create/generators/semantic/color.js';
import { generateColorModes } from './create/generators/semantic/color-modes.js';
import { generateSemanticStyle } from './create/generators/semantic/style.js';
import { generateTheme } from './create/generators/themes/theme.js';
import type { SizeModes, ThemeConfig, TokenSet, TokenSetDimensions, TokenSets } from './types.js';

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

export const createTokens = (
  themeConfig: ThemeConfig,
): { tokenSets: TokenSets; themeDimensions: TokenSetDimensions } => {
  const { colors, typography, name, borderRadius, overrides } = themeConfig;
  const colorSchemes: ColorScheme[] = ['light', 'dark'];
  const sizeModes: SizeModes[] = ['small', 'medium', 'large'];

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

  const tokenSets: TokenSets = new Map([
    ['primitives/globals', generateGlobals()],
    ['primitives/modes/size/global', generateSizeGlobal()],
    ...sizeModes.map((size): [string, TokenSet] => [`primitives/modes/size/${size}`, generateSize(size)]),
    ...fontNames.map((font): [string, TokenSet] => [
      `primitives/modes/size/global/${name}/font-${font}`,
      generateFontSizeGlobal(name, font),
    ]),
    ...fontNames.flatMap((font): [string, TokenSet][] =>
      sizeModes.map((size) => [
        `primitives/modes/size/${size}/${name}/font-${font}`,
        generateFontSizeMode(size, name, font, typography.fonts?.[font]?.size),
      ]),
    ),
    ...fontNames.map((font): [string, TokenSet] => [
      `primitives/fonts/${name}/${font}`,
      generateFont(name, font, fontDefinitions[font]),
    ]),
    // [`primitives/modes/typography/primary/${name}`, generateTypography(name, typography)],
    // [`primitives/modes/typography/secondary/${name}`, generateTypography(name, typography)],
    ...colorSchemes.flatMap((scheme): [string, TokenSet][] => [
      [`primitives/modes/color-scheme/${scheme}/${name}`, generateColorScheme(name, scheme, colors, overrides)],
    ]),
    [`themes/${name}`, generateTheme(colors, name, borderRadius, typography)],
    ['semantic/color', generateSemanticColors(colors, name)],
    // maps out semantic modes, ieg 'semantic/modes/main-color/accent', and 'semantic/modes/support-color/brand1'
    ...Object.entries(generateColorModes(colors, name)).flatMap(([mode, colors]): [string, TokenSet][] =>
      Object.entries(colors).map(([key, colorSet]): [string, TokenSet] => [`semantic/modes/${mode}/${key}`, colorSet]),
    ),
    [`semantic/style`, generateSemanticStyle()],
  ]);

  return { tokenSets, themeDimensions: { colorSchemes, fontNames, sizeModes } };
};
