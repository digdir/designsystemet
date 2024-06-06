import * as R from 'ramda';
import type { Format } from 'style-dictionary/types';
import { fileHeader } from 'style-dictionary/utils';

type Typgraphy = {
  fontWeight: string;
  fontSize: string;
  lineHeight: number;
  fontFamily: string;
};

/**
 * Creates CSS classes from typography tokens
 */
export const cssClassesTypography: Format = {
  name: 'ds/css-classes-typography',
  format: async function ({ dictionary, file, options, platform }) {
    const { usesDtcg } = options;
    const { basePxFontSize, selector } = platform;

    const header = await fileHeader({ file });

    const classNames = R.map((token) => {
      if (!Array.isArray(token)) {
        const typography = (usesDtcg ? token.$value : token.value) as Typgraphy;

        const baseFontPx = (basePxFontSize as unknown as number) || 16;
        const fontSize = `${parseInt(typography.fontSize) / baseFontPx}rem`;
        const classSelector = R.replace('-typography', '', token.name);

        const className = `
  .${classSelector} {
    font-size: ${fontSize};
    line-height: ${typography?.lineHeight};
    font-weight: ${typography?.fontWeight};
  }`;

        return className;
      }
    }, dictionary.allTokens);

    const classes = classNames.join('\n');
    const content = selector ? `${selector} {\n${classes}\n}` : classes;

    return header + `@layer ds.typography {\n${content}\n}\n`;
  },
};
