import { expandTypesMap } from '@tokens-studio/sd-transforms';
import { pathStartsWithOneOf, typeEquals } from '../../utils.ts';
import { formats } from '../formats/css.ts';
import { buildOptions } from '../platform.ts';
import { dsName, sizeRem } from '../transformers.ts';

import { basePxFontSize, type GetStyleDictionaryConfig, isTypographySetPrimitive, prefix } from './shared.ts';

export const typographyVariables: GetStyleDictionaryConfig = ({ theme, typography }) => {
  // The default typography set (the first one in $themes.json) also applies to :root
  const isDefault = typography === buildOptions?.defaultTypography;
  const selector = `${isDefault ? ':root, ' : ''}[data-typography="${typography}"]`;
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
          dsName.name,
          'ts/size/px',
          sizeRem.name,
          'ts/size/lineheight',
          'ts/typography/fontWeight',
          'ts/size/css/letterspacing',
        ],
        files: [
          {
            destination: `typography/${typography}.css`,
            format: formats.typography.name,
            filter: (token) => {
              const included = typeEquals(['fontweight', 'fontFamily', 'lineHeight', 'dimension'], token);

              // Remove the typography set primitives, whatever the set is named
              if (isTypographySetPrimitive(token)) return false;

              return (
                included &&
                !pathStartsWithOneOf(['spacing', 'sizing', 'size', '_size', 'border-width', 'border-radius'], token) &&
                !(pathStartsWithOneOf(['typography'], token) && token.path.includes('fontSize'))
              );
            },
          },
        ],
      },
    },
  };
};
