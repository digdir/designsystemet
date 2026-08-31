import type { SizeConfig, SizeModes, TokenSet } from '../../../types.ts';

/**
 * Maps the placeholders used in the size scale formulas from the config
 * to the token references used in the generated token sets.
 * The full unit expression is replaced first so it resolves to `{_size.unit}`.
 */
const placeholderReplacements: [placeholder: string, tokenReference: string][] = [
  ['{step} / {base} * {fontSize}', '{_size.unit}'],
  ['{step}', '{_size.step}'],
  ['{base}', '{_size.base}'],
  ['{fontSize}', '{_size.mode-font-size}'],
];

const toTokenFormula = (formula: string): string =>
  placeholderReplacements.reduce((value, [placeholder, tokenReference]) => {
    return value.replaceAll(placeholder, tokenReference);
  }, formula);

export const generateSize = (mode: SizeModes, size: SizeConfig): TokenSet => {
  const step = size.steps[mode];
  if (!step) {
    throw new Error(`Missing size step "${mode}" in theme size configuration`);
  }

  return {
    size: {
      '_mode-font-size': {
        $type: 'dimension',
        $value: String(step.fontSize),
      },
      _base: {
        $type: 'dimension',
        $value: String(step.base),
      },
      _step: {
        $type: 'dimension',
        $value: String(step.step),
      },
    },
  };
};

export const generateSizeGlobal = (size: SizeConfig): TokenSet => ({
  _size: {
    ...Object.fromEntries(
      Object.entries(size.scale).map(([step, formula]) => [
        step,
        {
          $type: 'dimension',
          $value: toTokenFormula(formula),
        },
      ]),
    ),
    'mode-font-size': {
      $type: 'number',
      $value: '{size._mode-font-size}',
    },
    base: {
      $type: 'number',
      $value: '{size._base}',
    },
    step: {
      $type: 'number',
      $value: '{size._step}',
    },
    unit: {
      $type: 'number',
      $value: '{_size.step} / {_size.base} * {_size.mode-font-size}',
    },
  },
});
