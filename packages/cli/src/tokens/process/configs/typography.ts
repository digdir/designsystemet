import { expandTypesMap } from '@tokens-studio/sd-transforms';
import { pathStartsWithOneOf, typeEquals } from '../../utils.js';
import { formats } from '../formats/css.js';
import { sizeRem, typographyName } from '../transformers.js';

import { type GetStyleDictionaryConfig, basePxFontSize, prefix } from './shared.js';

export const typographyVariables: GetStyleDictionaryConfig = ({ theme, typography }) => {
  const selector = `${typography === 'primary' ? ':root, ' : ''}[data-typography="${typography}"]`;
  const layer = `ds.theme.typography.${typography}`;

  return {
    usesDtcg: true,
    preprocessors: ['tokens-studio'],
    expand: {
      include: ['typography'],
      typesMap: { ...expandTypesMap, typography: { ...expandTypesMap.typography, letterSpacing: 'dimension' } },
    },
    platforms: {
      css: {
        prefix,
        typography,
        selector,
        layer,
        buildPath: `${theme}/`,
        basePxFontSize,
        transforms: [
          'name/kebab',
          'ts/size/px',
          sizeRem.name,
          'ts/size/lineheight',
          'ts/typography/fontWeight',
          typographyName.name,
        ],
        files: [
          {
            destination: `typography/${typography}.css`,
            format: formats.typography.name,
            filter: (token) => {
              const included = typeEquals(
                ['typography', 'fontweight', 'fontFamily', 'lineHeight', 'dimension', 'font', 'fontsize'],
                token,
              );

              // Remove primitive typgography tokens
              if (/primitives\/modes\/typography\/(primary|secondary)/.test(token.filePath)) return false;

              return (
                included &&
                !pathStartsWithOneOf(['spacing', 'sizing', 'size', '_size', 'border-width', 'border-radius'], token)
              );
            },
          },
        ],
      },
    },
  };
};
