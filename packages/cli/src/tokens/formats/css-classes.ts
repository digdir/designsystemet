import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';
import { fileHeader, createPropertyFormatter, getReferences } from 'style-dictionary/utils';

import { getValue, getType, typeEquals } from '../utils/utils';

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
    const { selector } = platform;

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
            const classSelector = R.replace('-typography', '', token.name);

            const references = getReferences(getValue<Typgraphy>(token.original), dictionary.tokens);
            const fontweight = R.find<TransformedToken>(R.curry(typeEquals)(['fontweights']))(references);
            const lineheight = R.find<TransformedToken>(R.curry(typeEquals)(['lineheights']))(references);
            const lineheightValue = R.isNotNil(lineheight) ? getValue<string>(lineheight) : '';
            const fontsize = R.find<TransformedToken>(R.curry(typeEquals)(['fontsizes']))(references);
            const fontSizeValue = R.isNotNil(fontsize) ? getValue<string>(fontsize) : '';

            let fontWeightName: string = '';
            if (fontweight) {
              fontWeightName = getVariableName(format(fontweight));
            }

            const className = `
  .${classSelector} {
    font-size: ${fontSizeValue};
    line-height: ${lineheightValue};
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
