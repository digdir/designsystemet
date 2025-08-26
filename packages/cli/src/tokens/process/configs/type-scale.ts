import { pathStartsWithOneOf, typeEquals } from '../../utils.js';
import { formats } from '../formats/css.js';
import { sizeRem, typographyName } from '../transformers.js';
import { basePxFontSize, type GetStyleDictionaryConfig, prefix } from './shared.js';

export const typeScaleVariables: GetStyleDictionaryConfig = ({ theme, size }) => {
  const selector = ':root, [data-size]';
  const layer = `ds.theme.type-scale`;

  return {
    usesDtcg: true,
    preprocessors: ['tokens-studio'],
    expand: {
      include: ['typography'],
    },
    platforms: {
      css: {
        prefix,
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
            destination: `type-scale.css`,
            format: formats.typeScale.name,
            filter: (token) => {
              const included = typeEquals(['typography', 'dimension', 'fontsize'], token);

              // Remove primitive typgography tokens
              if (/primitives\/modes\/typography\/(primary|secondary)/.test(token.filePath)) return false;

              return (
                included &&
                !pathStartsWithOneOf(['spacing', 'sizing', 'size', 'border-width', 'border-radius'], token) &&
                (pathStartsWithOneOf(['font-size'], token) || token.path.includes('fontSize'))
              );
            },
          },
        ],
        options: {
          outputReferences: (token) => pathStartsWithOneOf(['typography'], token) && token.path.includes('fontSize'),
        },
      },
    },
  };
};
