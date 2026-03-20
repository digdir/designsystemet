import * as R from 'ramda';
import { pathStartsWithOneOf } from '../../utils.js';
import { formats } from '../formats/css.js';
import { basePxFontSize, dsTransformers, type GetStyleDictionaryConfig, prefix } from './shared.js';

export const sizeModeVariables =
  (typeScaleValues: 'modular' | 'static'): GetStyleDictionaryConfig =>
  ({ theme, size }) => {
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
          typeScaleValues,
          //
          prefix,
          buildPath: `${theme}/`,
          transforms: dsTransformers,
          files: [
            {
              destination: `size-mode/${size}.css`,
              format: formats.sizeMode.name,
              filter: (token) => {
                return R.equals(['_size', 'mode-font-size'], token.path) || pathStartsWithOneOf(['font-scale'], token);
              },
            },
          ],
        },
      },
    };
  };
