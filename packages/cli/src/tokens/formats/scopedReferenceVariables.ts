import type { TransformedToken, Format } from 'style-dictionary/types';
import { fileHeader, createPropertyFormatter, usesReferences, getReferences } from 'style-dictionary/utils';

type IncludeReferences = (token: TransformedToken) => boolean;

/**
 *  CSS variables format with option to include source references for matched token through `options.referencesFilter`
 */
export const scopedReferenceVariables: Format = {
  name: 'css/variables-scoped-references',
  format: async function ({ dictionary, file, options }) {
    const { allTokens, unfilteredTokens } = dictionary;
    const { usesDtcg, outputReferences } = options;
    const mode = file.destination.endsWith('dark.css') ? 'dark' : 'light';

    const selector = mode === 'dark' ? '[data-ds-color-mode="dark"]' : ':root, [data-ds-color-mode="light"]';
    const includeReferences = options.includeReferences as IncludeReferences;
    let referencedTokens: TransformedToken[] = [];

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
    });

    const formatWithReference = createPropertyFormatter({
      outputReferences: true,
      dictionary,
      format: 'css',
    });

    const parseToken = (token: TransformedToken, ignoreSource?: boolean) => {
      const originalValue = (usesDtcg ? token.original.$value : token.original.value) as string;

      if (usesReferences(originalValue) && includeReferences(token)) {
        const refs = getReferences(originalValue, unfilteredTokens ? unfilteredTokens : {});

        referencedTokens = [...referencedTokens, ...refs.filter((x) => x.isSource)];

        return formatWithReference(token);
      }

      if (ignoreSource && !token.isSource) {
        return format(token);
      }
    };

    const tokens = allTokens.map((t) => parseToken(t, true)).filter((x) => x);

    const referenceTokens = referencedTokens
      .reduce<TransformedToken[]>((acc, token) => {
        if (acc.find((x) => x.name === token.name)) {
          return acc;
        }

        return [...acc, token];
      }, [])
      .map((token) => format(token))
      .filter((formattedValue) => formattedValue);

    return fileHeader({ file }).then(
      (fileHeaderText) => `
${fileHeaderText}
${selector} {${referenceTokens.length > 0 ? referenceTokens.join('\n') : ''}
${tokens.join('\n')}
}
      `,
    );
  },
};
