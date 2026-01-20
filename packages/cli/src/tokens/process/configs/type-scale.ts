import { pathStartsWithOneOf, typeEquals } from '../../utils.js';
import { formats } from '../formats/css.js';
import { sizeRem, typographyName } from '../transformers.js';
import { basePxFontSize, type GetStyleDictionaryConfig, prefix } from './shared.js';

export const typeScaleVariables =
  (scaleValues: 'static' | 'modular'): GetStyleDictionaryConfig =>
  ({ theme, size }) => {
    const selector = ':root';
    const layer = `ds.theme.type-scale`;

    return {
      usesDtcg: true,
      preprocessors: ['tokens-studio'],
      expand: {
        include: ['typography'],
      },
      platforms: {
        css: {
          size: scaleValues === 'static' ? size : undefined,
          prefix,
          selector,
          layer,
          buildPath: `${theme}/`,
          basePxFontSize,
          transforms: [
            'name/kebab',
            ...(scaleValues === 'static' ? ['ts/resolveMath'] : []),
            'ts/size/px',
            sizeRem.name,
            'ts/size/lineheight',
            'ts/typography/fontWeight',
            typographyName.name,
          ],
          files: [
            {
              destination: scaleValues === 'static' ? `type-scale/${size}.css` : `type-scale.css`,
              format: formats.typeScale.name,
              filter: (token) => {
                const included = typeEquals(['typography', 'dimension', 'fontsize', 'number'], token);

                // Remove primitive typgography tokens
                if (/primitives\/modes\/typography\/(primary|secondary)/.test(token.filePath)) return false;

                return (
                  included &&
                  !pathStartsWithOneOf(['spacing', 'sizing', 'size', 'border-width', 'border-radius'], token) &&
                  (pathStartsWithOneOf(['font-size', 'font-scale'], token) || token.path.includes('fontSize'))
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
