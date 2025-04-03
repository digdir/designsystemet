import typographyTemplate from '../../template/design-tokens/primitives/modes/typography/typography.template.json' with {
  type: 'json',
};

import type { TokenSet, Typography } from '../../types.js';

export const generateTypography = (themeName: string, { fontFamily }: Typography): TokenSet => {
  return JSON.parse(
    JSON.stringify(typographyTemplate)
      .replaceAll(/<font-family>/g, fontFamily)
      .replaceAll(/<theme>/g, themeName),
  ) as TokenSet;
};
