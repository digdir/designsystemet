import * as R from 'ramda';
import { formats } from '../formats/css.js';

import { type GetStyleDictionaryConfig, basePxFontSize, dsTransformers, prefix } from './shared.js';

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
