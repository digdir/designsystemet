import * as R from 'ramda';
import type { TypographySizeSchema } from '../../../config.js';
import type { Token } from '../../types.js';

const defaults = {
  small: {
    base: 16,
    ratio: 1.131,
  },
  medium: {
    base: 18,
    ratio: 1.143,
  },
  large: {
    base: 21,
    ratio: 1.146,
  },
};

export function generateTypographySizeMode(size: 'small' | 'medium' | 'large', config?: TypographySizeSchema) {
  const modeConfig = config?.modes?.[size];
  return {
    'font-scale': {
      _base: {
        $type: 'number',
        $value: `${modeConfig?.base ?? defaults[size].base}`,
      } satisfies Token,
      _ratio: {
        $type: 'number',
        $value: `${modeConfig?.ratio ?? defaults[size].ratio}`,
      } satisfies Token,
    },
    ...(modeConfig?.overrides && {
      'font-size': R.map(
        (fontSizeInPx) =>
          ({
            $type: 'fontSizes',
            $value: `${fontSizeInPx}px`,
          }) satisfies Token,
        modeConfig.overrides,
      ),
    }),
  };
}
