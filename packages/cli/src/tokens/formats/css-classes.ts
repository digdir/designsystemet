import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';
import { fileHeader, createPropertyFormatter, getReferences } from 'style-dictionary/utils';

import { getValue, getType } from '../utils';

type Typgraphy = {
  fontWeight: string;
  fontSize: string;
  lineHeight: number;
  fontFamily: string;
};

type ProcessedTokens = { variables: string[]; classes: string[] };

const sortByType = R.sortBy<TransformedToken>((token) => token?.type === 'typography');
const getVariableName = R.pipe<string[], string[], string, string, string>(
  R.split(':'),
  R.head,
  R.defaultTo(''),
  R.trim,
);

/**
 * Creates CSS classes from typography tokens
 */
export const cssClassesTypography: Format = {
  name: 'ds/css-classes-typography',
  format: async function ({ dictionary, file, options, platform }) {
    const { outputReferences } = options;
    const { basePxFontSize, selector } = platform;

    const header = await fileHeader({ file });

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
    });

    const formattedTokens = R.pipe(
      sortByType,
      R.reduce<TransformedToken, ProcessedTokens>(
        (acc, token) => {
          const type = getType(token);

          if (type === 'typography') {
            const typography = getValue<Typgraphy>(token);

            const baseFontPx = (basePxFontSize as unknown as number) || 16;
            const fontSize = `${parseInt(typography.fontSize) / baseFontPx}rem`;
            const classSelector = R.replace('-typography', '', token.name);

            // const formattedTypography = format(token);
            const references = getReferences(getValue<Typgraphy>(token.original).fontWeight, dictionary.tokens);
            const fontWeight = R.last(references);

            let fontWeightName: string = '';
            if (fontWeight) {
              fontWeightName = getVariableName(format(fontWeight));
            }

            const className = `
  .${classSelector} {
    font-size: ${fontSize};
    line-height: ${typography?.lineHeight};
    ${fontWeightName && `font-weight: var(${fontWeightName});`}
  }`;

            return { ...acc, classes: [...acc.classes, className] };
          }

          return { ...acc, variables: [...acc.variables, format(token)] };
        },
        { variables: [], classes: [] },
      ),
    )(dictionary.allTokens);

    const classes = formattedTokens.classes.join('\n');
    const variables = formattedTokens.variables.join('\n');
    const variables_ = `:root {\n${variables}\n}\n`;
    const content = selector ? `${selector} {\n${classes}\n}` : classes;

    return header + `@layer ds.typography {\n${variables_}\n${content}\n}\n`;
  },
};
