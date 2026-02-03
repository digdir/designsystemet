import * as R from 'ramda';
import { baseColorNames } from '../../../../colors/colorMetadata.js';
import type { ColorMetadataByName } from '../../../../colors/types.js';
import type { Colors, Token, TokenSet } from '../../../types.js';

export const generateSemanticColors = (colors: Colors, _themeName: string) => {
  const mainColorNames = Object.keys(colors.main);
  const supportColorNames = Object.keys(colors.support);

  const customColors = [...mainColorNames, 'neutral', ...supportColorNames];

  const allColors = [...customColors, ...baseColorNames];

  const semanticColorTokens = allColors.map((colorName) => [
    colorName,
    R.map(
      (x) => ({
        $type: x.$type,
        $value: typeof x.$value === 'string' ? x.$value.replace('<color>', colorName) : x.$value,
      }),
      colorTemplate,
    ),
  ]);

  return {
    ...baseColorTemplate,
    color: {
      ...Object.fromEntries(semanticColorTokens),
      ...baseColorTemplate.color,
    },
  };
};

const baseColorTemplate: TokenSet = {
  color: {
    focus: {
      inner: {
        $type: 'color',
        $value: '{color.focus.inner-color}',
      },
      outer: {
        $type: 'color',
        $value: '{color.focus.outer-color}',
      },
    },
  },
  link: {
    color: {
      visited: {
        $type: 'color',
        $value: '{color.link.visited}',
      },
    },
  },
};

const colorTemplate: Record<keyof ColorMetadataByName, Token> = {
  'background-default': {
    $type: 'color',
    $value: '{color.<color>.1}',
  },
  'background-tinted': {
    $type: 'color',
    $value: '{color.<color>.2}',
  },
  'surface-default': {
    $type: 'color',
    $value: '{color.<color>.3}',
  },
  'surface-tinted': {
    $type: 'color',
    $value: '{color.<color>.4}',
  },
  'surface-hover': {
    $type: 'color',
    $value: '{color.<color>.5}',
  },
  'surface-active': {
    $type: 'color',
    $value: '{color.<color>.6}',
  },
  'border-subtle': {
    $type: 'color',
    $value: '{color.<color>.7}',
  },
  'border-default': {
    $type: 'color',
    $value: '{color.<color>.8}',
  },
  'border-strong': {
    $type: 'color',
    $value: '{color.<color>.9}',
  },
  'text-subtle': {
    $type: 'color',
    $value: '{color.<color>.10}',
  },
  'text-default': {
    $type: 'color',
    $value: '{color.<color>.11}',
  },
  'base-default': {
    $type: 'color',
    $value: '{color.<color>.12}',
  },
  'base-hover': {
    $type: 'color',
    $value: '{color.<color>.13}',
  },
  'base-active': {
    $type: 'color',
    $value: '{color.<color>.14}',
  },
  'base-contrast-subtle': {
    $type: 'color',
    $value: '{color.<color>.15}',
  },
  'base-contrast-default': {
    $type: 'color',
    $value: '{color.<color>.16}',
  },
};
