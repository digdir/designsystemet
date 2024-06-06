import * as R from 'ramda';
import type { Format } from 'style-dictionary/types';
import { fileHeader } from 'style-dictionary/utils';

type Typgraphy = {
  fontWeight: string;
  fontSize: string;
  lineHeight: number;
  fontFamily: string;
};

// const isTransformedToken = (token: TransformedTokens): token is TransformedToken => token;

/**
 * Creates CSS classes from typography tokens
 */
export const typographyFormat: Format = {
  name: 'ds/typography',
  format: async function ({ dictionary, file, options, platform }) {
    const { usesDtcg } = options;
    const { basePxFontSize } = platform;

    const classNames = R.map((token) => {
      if (!Array.isArray(token)) {
        const typography = (usesDtcg ? token.$value : token.value) as Typgraphy;

        const baseFontPx = (basePxFontSize as unknown as number) || 16;
        const fontSize = `${parseInt(typography.fontSize) / baseFontPx}rem`;
        const selector = R.replace('-typography', '', token.name);

        const className = `
  .${selector} {
    font-size: ${fontSize};
    line-height: ${typography?.lineHeight};
    font-weight: ${typography?.fontWeight};
  }`;

        return className;
      }
    }, dictionary.allTokens);

    return fileHeader({ file }).then(
      (fileHeaderText) => `${fileHeaderText}@layer ds.typography {
${classNames.join('\n')}
}\n`,
    );
  },
};
