import { pathStartsWithOneOf, typeEquals } from '../../utils.js';
import { formats } from '../formats/css.js';
import { sizeRem, typographyName } from '../transformers.js';

import { type GetStyleDictionaryConfig, basePxFontSize, prefix } from './shared.js';

export const sizeVariables: GetStyleDictionaryConfig = ({ theme, size }) => {
  const shortNames: Record<string, string | undefined> = {
    small: 'sm',
    medium: 'md',
    large: 'lg',
  };
  const selector = `${size === 'medium' ? ':root, ' : ''}[data-size="${shortNames[size] ?? size}"]`;
  const layer = `ds.theme.size`;

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
            destination: `size/${size}.css`,
            format: formats.typography.name,
            filter: (token) => {
              const included = typeEquals(['typography', 'dimension', 'fontsize'], token);

              // Remove primitive typgography tokens
              if (/primitives\/modes\/typography\/(primary|secondary)/.test(token.filePath)) return false;

              return (
                included &&
                !pathStartsWithOneOf(['spacing', 'sizing', 'size', '_size', 'border-width', 'border-radius'], token) &&
                (pathStartsWithOneOf(['font-size'], token) || token.path.includes('fontSize'))
              );
            },
          },
        ],
      },
    },
  };
};
