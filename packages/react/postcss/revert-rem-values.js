/* eslint-disable no-undef */
/**
 * A PostCSS plugin to recalculate all `rem` values to work with a different
 * ratio than the default `1rem` = `16px`.
 */

const REM_RATIO = 1.6;

const figmaTokensRegEx = /@altinn[/\\]figma-design-tokens/;
const remRegEx = /(\d*\.?\d+)rem(?=\W|$)/gim;
const processed = Symbol('processed');

const decimalRound = (input, decimals = 2) => {
  const factor = 10 ** decimals;
  return Math.round((input + Number.EPSILON) * factor) / factor;
};

module.exports = () => {
  return {
    postcssPlugin: 'revert-rem-values',
    Declaration(decl) {
      if (decl[processed]) {
        return;
      }

      if (!figmaTokensRegEx.test(decl.source.input.file)) {
        decl[processed] = true;
        return;
      }

      decl.value = decl.value.replace(remRegEx, (_match, numericValue) => {
        const patchedValue = decimalRound(numericValue * REM_RATIO);
        return `${patchedValue}rem`;
      });

      decl[processed] = true;
    },
  };
};

module.exports.postcss = true;
