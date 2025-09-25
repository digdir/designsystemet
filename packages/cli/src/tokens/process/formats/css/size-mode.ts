import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';
import { createPropertyFormatter } from 'style-dictionary/utils';
import { orderBySize, shortSizeName } from '../../../utils.js';
import { basePxFontSize } from '../../configs/shared.js';
import { buildOptions } from '../../platform.js';

const formatBaseSizeToken =
  (size: string) =>
  (token: TransformedToken): TransformedToken & { originalName: string } => ({
    ...token,
    originalName: token.name,
    name: `${token.name}--${shortSizeName(size)}`,
    $value: token.path.includes('_ratio') ? token.$value : token.$value / basePxFontSize,
    $description: undefined, // removes comment from output
  });

export const sizeMode: Format = {
  name: 'ds/css-size-mode',
  format: async ({ dictionary, file, options, platform }) => {
    const { outputReferences, usesDtcg } = options;
    const { selector, layer, size } = platform as {
      selector: string;
      layer?: string;
      size: string;
    };
    const destination = file.destination as string;

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
      usesDtcg,
    });

    const sizeSpecificTokens = dictionary.allTokens.map(formatBaseSizeToken(size));
    const sizeSpecificVariables = sizeSpecificTokens.map(format).join('\n');

    const formattedMap = sizeSpecificTokens.map((token) => ({
      token,
      formatted: format({
        ...token,
        // Remove the `--<size>` suffix for the token listing, since that is the only token we actually use
        name: token.originalName,
      }),
    }));

    buildOptions.buildTokenFormats[destination] = formattedMap;

    const content = `${selector} /* ${size} */ {\n${sizeSpecificVariables}\n}`;
    const body = wrapInLayer(content, layer);

    /*
     * The following CSS is only generated once, not per mode
     */
    const sizes = orderBySize(buildOptions?.sizeModes ?? []).map(shortSizeName);
    const defaultSize = shortSizeName(buildOptions?.defaultSize ?? '');

    const sizingToggles = `:root, [data-size] {
  --ds-size: var(--ds-size--${defaultSize});
${sizes.map((size) => `  --ds-size--${size}: var(--ds-size,);`).join('\n')}
  --ds-size-mode-font-size:
${sizes.map((size) => `    var(--ds-size--${size}, var(--ds-size-mode-font-size--${size}))`).join('\n')};
}`;
    const sizingHelpers = sizes
      .map((size) => `[data-size='${size}'] { --ds-size: var(--ds-size--${size}); }`)
      .join('\n');
    const sharedContent = `${sizingToggles}\n\n${sizingHelpers}`;
    const sharedBody = shortSizeName(size) === R.last(sizes) ? `\n${wrapInLayer(sharedContent, layer)}` : '';
    /*
     * End of generated-once CSS
     */

    return body + sharedBody;
  },
};

export function wrapInLayer(content: string, layer?: string) {
  return R.isNotNil(layer) ? `@layer ${layer} {\n${content}\n}\n` : `${content}\n`;
}
