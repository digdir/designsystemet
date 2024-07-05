import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';
import { fileHeader, createPropertyFormatter, usesReferences, getReferences } from 'style-dictionary/utils';

import type { IsCalculatedToken } from '../configs.js';
import { prefix } from '../configs.js';
import { getValue, typeEquals } from '../utils/utils.js';

const prefersColorScheme = (mode: string, content: string) => `
@media (prefers-color-scheme: ${mode}) {
  [data-ds-color-mode="auto"] ${content}
}
`;

export const colormode: Format = {
  name: 'ds/css-colormode',
  format: async function ({ dictionary, file, options, platform }) {
    const { allTokens } = dictionary;
    const { outputReferences } = options;
    const { selector, mode, layer } = platform;

    const mode_ = mode as string;

    const header = await fileHeader({ file });

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
    });

    const colorSchemeProperty = mode_ === 'dark' || mode_ === 'light' ? `color-scheme: ${mode_};\n` : '';

    const content = `{\n${allTokens.map(format).join('\n')}\n${colorSchemeProperty}}\n`;
    const autoSelectorContent = ['light', 'dark'].includes(mode_) ? prefersColorScheme(mode_, content) : '';

    return header + `@layer ${layer} {\n${selector} ${content} ${autoSelectorContent}\n}\n`;
  },
};

const calculatedVariable = R.pipe(R.split(/:(.*?);/g), (split) => `${split[0]}: calc(${R.trim(split[1])});`);

export const semantic: Format = {
  name: 'ds/css-semantic',
  format: async function ({ dictionary, file, options, platform }) {
    const { allTokens } = dictionary;
    const { outputReferences } = options;
    const { selector, isCalculatedToken, layer } = platform;

    const header = await fileHeader({ file });

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
    });

    const formatTokens = R.map((token: TransformedToken) => {
      const originalValue = getValue<string>(token.original);

      if (
        usesReferences(originalValue) &&
        typeof outputReferences === 'function' &&
        outputReferences?.(token, { dictionary })
      ) {
        if ((isCalculatedToken as IsCalculatedToken)?.(token, options)) {
          return calculatedVariable(format(token));
        }
      }

      return format(token);
    });

    const formattedVariables = formatTokens(allTokens);
    const content = `{\n${formattedVariables.join('\n')}\n}\n`;

    return header + `@layer ${layer} {\n${selector} ${content}\n}\n`;
  },
};

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

    const className = `${rest.join('-')}--${R.head(last)}`;
    return className;
  },
  R.trim,
  R.toLower,
);

const classSelector = R.pipe(R.prop('path'), bemify);
const sortTypographyLast = R.sortWith<TransformedToken>([
  R.ascend((token) => (typeEquals('typography')(token) ? 1 : 0)),
]);

export const typography: Format = {
  name: 'ds/css-typography',
  format: async function ({ dictionary, file, options, platform }) {
    const { outputReferences } = options;
    const { selector, layer } = platform;

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
    const content = selector ? `${selector} {\n${variables}\n${classes}\n}` : classes;

    return header + `@layer ${layer} {\n${content}\n}\n`;
  },
};
