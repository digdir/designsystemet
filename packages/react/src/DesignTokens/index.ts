import * as unpatchedTokens from '@altinn/figma-design-tokens';
import unpatchedJsonTokens from '@altinn/figma-design-tokens/dist/tokens.json';

// We should be able to remove this patching and simply reexport tokens and
// JSON tokens once we don't need to adapt design token `rem` values to the
// `1rem`=`10px` ratio that is imposed by the dependency in the old design
// system.
//
// This file should then become just this:
//
// import * as tokens from '@altinn/figma-design-tokens';
// import jsonTokens from '@altinn/figma-design-tokens/dist/tokens.json';
// export { tokens, jsonTokens };

const REM_RATIO = 1.6;
const remRegEx = /(\d*\.?\d+)rem(?=\W|$)/gim;

const decimalRound = (input: number, decimals = 2) => {
  const factor = 10 ** decimals;
  return Math.round((input + Number.EPSILON) * factor) / factor;
};

const patchRemValues = (input: string | number) => {
  if (typeof input === 'string') {
    return input.replace(remRegEx, (_match, numericValue) => {
      const patchedValue = decimalRound(numericValue * REM_RATIO);
      return `${patchedValue}rem`;
    });
  }
  return input;
};

type Token = string | number | object;

const patcher = {
  get: (obj: Record<string, Token>, prop: string): Token | undefined => {
    if (!(prop in obj)) {
      return undefined;
    }

    const objProp = obj[prop];

    if (typeof objProp === 'object') {
      return new Proxy(objProp, patcher);
    }

    return patchRemValues(objProp);
  },
};

// We use Proxies to transparently modify the values

const tokens = new Proxy<typeof unpatchedTokens>(unpatchedTokens, patcher);

const jsonTokens = new Proxy<typeof unpatchedJsonTokens>(
  unpatchedJsonTokens,
  patcher,
);

export { tokens, jsonTokens };
