import type { TokenSet, Typography } from '../../../types.js';

export const generateTypography = (themeName: string, { fontFamily }: Typography): TokenSet => {
  return JSON.parse(
    JSON.stringify(typographyTemplate)
      .replaceAll(/<font-family>/g, fontFamily)
      .replaceAll(/<theme>/g, themeName),
  ) as TokenSet;
};

const typographyTemplate: TokenSet = {
  '<theme>': {
    'font-family': {
      $type: 'fontFamilies',
      $value: '<font-family>',
    },
    'font-weight': {
      medium: {
        $type: 'fontWeights',
        $value: 'Medium',
      },
      semibold: {
        $type: 'fontWeights',
        $value: 'Semi bold',
      },
      regular: {
        $type: 'fontWeights',
        $value: 'Regular',
      },
    },
  },
};
