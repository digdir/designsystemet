import * as R from 'ramda';
import { formats } from '../formats/css.ts';

import { basePxFontSize, dsTransformers, type GetStyleDictionaryConfig, prefix } from './shared.ts';

export const sizeModeVariables: GetStyleDictionaryConfig = ({ theme, size }) => {
  const selector = `:root`;
  const layer = `ds.theme.size-mode`;

  return {
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        // custom
        size,
        theme,
        basePxFontSize,
        selector,
        layer,
        //
        prefix,
        buildPath: `${theme}/`,
        transforms: dsTransformers,
        files: [
          {
            destination: `size-mode/${size}.css`,
            format: formats.sizeMode.name,
            filter: (token) => {
              return R.equals(['_size', 'mode-font-size'], token.path);
            },
          },
        ],
      },
    },
  };
};
