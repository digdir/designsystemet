import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';
import { fileHeader, createPropertyFormatter, getReferences } from 'style-dictionary/utils';

import { getValue, typeEquals } from '../utils/utils.js';
import { prefix } from '../configs.js';

type Typgraphy = {
  fontWeight: string;
  fontSize: string;
  lineHeight: number;
  fontFamily: string;
};

type ProcessedTokens = { variables: string[]; classes: string[] };

const sortByType = R.sortBy<TransformedToken>((token) => token?.type === 'typography');
const getVariableName = R.pipe<string[], string[], string, string, string, string>(
  R.split(':'),
  R.head,
  R.defaultTo(''),
  R.trim,
  (name) => `var(${name})`,
);

const bemify = R.pipe(
  (path: string[]) => {
    const filteredPath = path.filter((p) => p !== 'typography');
    const withPrefix = R.concat([prefix], R.remove(0, 0, filteredPath));
    const [rest, last] = R.splitAt(-1, withPrefix);

    return `${rest.join('-')}--${R.head(last)}`;
  },
  R.trim,
  R.toLower,
);

const classSelector = R.pipe(R.prop('path'), bemify);
const sortTypographyLast = R.sortWith<TransformedToken>([
  R.ascend((token) => (typeEquals('typography')(token) ? 1 : 0)),
]);

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

    const sortedTokens = sortTypographyLast(dictionary.allTokens);

    const formattedTokens = R.pipe(
      sortByType,
      R.reduce<TransformedToken, ProcessedTokens>(
        (acc, token) => {
          if (typeEquals('fontweights', token)) {
            const className = `
  .${classSelector(token)} {
    font-weight: ${getValue<string>(token)};
  }`;

            return {
              ...acc,
              variables: [...acc.variables, format(token)],
              classes: [...acc.classes, className],
            };
          }

          if (typeEquals('lineheights', token)) {
            const className = `
  .${classSelector(token)} {
    line-height: ${getValue<string>(token)};
  }`;

            return {
              ...acc,
              variables: [...acc.variables, format(token)],
              classes: [...acc.classes, className],
            };
          }

          if (typeEquals('typography', token)) {
            const references = getReferences(getValue<Typgraphy>(token.original), dictionary.tokens);
            const fontweight = R.find<TransformedToken>(typeEquals(['fontweights']))(references);
            const lineheight = R.find<TransformedToken>(typeEquals(['lineheights']))(references);
            const fontsize = R.find<TransformedToken>(typeEquals(['fontsizes']))(references);
            const letterSpacing = R.find<TransformedToken>(typeEquals(['letterSpacing']))(references);

            const fontSizeVar = fontsize ? getVariableName(format(fontsize)) : null;
            const fontWeightVar = fontweight ? getVariableName(format(fontweight)) : null;
            const lineheightVar = lineheight ? getVariableName(format(lineheight)) : null;
            const letterSpacingVar = letterSpacing ? getVariableName(format(letterSpacing)) : null;

            const className = `
  .${classSelector(token)} {
    ${fontSizeVar && `font-size: ${fontSizeVar};`}
    ${lineheightVar && `line-height: ${lineheightVar};`}
    ${fontWeightVar && `font-weight: ${fontWeightVar};`}
    ${letterSpacingVar && `letter-spacing: ${letterSpacingVar};`}
  }`;

            return { ...acc, classes: [className, ...acc.classes] };
          }

          return { ...acc, variables: [...acc.variables, format(token)] };
        },
        { variables: [], classes: [] },
      ),
    )(sortedTokens);

    const classes = formattedTokens.classes.join('\n');
    const variables = formattedTokens.variables.join('\n');
    const variables_ = `:root {\n${variables}\n}\n`;
    const content = selector ? `${selector} {\n${classes}\n}` : classes;

    return header + `@layer ds.typography {\n${variables_}\n${content}\n}\n`;
  },
};
