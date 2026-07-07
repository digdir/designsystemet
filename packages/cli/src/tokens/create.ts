import { generateColorScheme } from './create/generators/primitives/color-scheme.ts';
import { generateGlobals } from './create/generators/primitives/globals.ts';
import { generateSize, generateSizeGlobal } from './create/generators/primitives/size.ts';
import { generateFontSizes, generateTypography } from './create/generators/primitives/typography.ts';
import { generateColorTokens } from './create/generators/semantic/color.ts';
import { generateSemanticStyle } from './create/generators/semantic/style.ts';
import { generateTheme } from './create/generators/themes/theme.ts';
import type { Theme, TokenSet, TokenSetDimensions, TokenSets } from './types.ts';
import { addSeverityColors, toColorNames } from './utils.ts';

export const tokenSetDimensions: TokenSetDimensions = {
  colorSchemes: ['dark', 'light'],
  sizeModes: ['small', 'medium', 'large'],
};

export const createTokens = async (theme: Theme) => {
  const { typography, name, borderRadius, overrides } = theme;
  const { colorSchemes, sizeModes } = tokenSetDimensions;

  const colors = addSeverityColors(theme.colors);
  const colorNames = toColorNames(colors);
  const colorTokens = Object.entries(generateColorTokens(colorNames, name));

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
    [`themes/${name}`, generateTheme(colorNames, name, borderRadius)],
    ...colorTokens.map(([colorName, colorSetTokens]): [string, TokenSet] => [
      `semantic/color/${colorName}`,
      colorSetTokens,
    ]),
    [`semantic/style`, generateSemanticStyle(colorNames)],
  ]);

  return { tokenSets };
};
