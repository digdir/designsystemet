import * as R from 'ramda';
import globals from '../template/design-tokens/primitives/globals.json' with { type: 'json' };
import sizeGlobal from '../template/design-tokens/primitives/modes/size/global.json' with { type: 'json' };
import sizeLarge from '../template/design-tokens/primitives/modes/size/large.json' with { type: 'json' };
import sizeMedium from '../template/design-tokens/primitives/modes/size/medium.json' with { type: 'json' };
import sizeSmall from '../template/design-tokens/primitives/modes/size/small.json' with { type: 'json' };
import typgraphyLarge from '../template/design-tokens/primitives/modes/typography/size/large.json' with {
  type: 'json',
};
import typgraphyMedium from '../template/design-tokens/primitives/modes/typography/size/medium.json' with {
  type: 'json',
};
import typgraphySmall from '../template/design-tokens/primitives/modes/typography/size/small.json' with {
  type: 'json',
};
import semanticStyle from '../template/design-tokens/semantic/style.json' with { type: 'json' };
import type { TokensSet } from '../types.js';

const defaultTokens: Record<string, TokensSet> = {
  'primitives/globals': globals,
  'primitives/modes/size/small': sizeSmall,
  'primitives/modes/size/medium': sizeMedium,
  'primitives/modes/size/large': sizeLarge,
  'primitives/modes/size/global': sizeGlobal,
  'primitives/modes/typography/size/small': typgraphySmall,
  'primitives/modes/typography/size/medium': typgraphyMedium,
  'primitives/modes/typography/size/large': typgraphyLarge,
  'semantic/style': semanticStyle as unknown as TokensSet,
};

type DefaultToken = keyof typeof defaultTokens;

export const getTokens = (tokenSets: readonly DefaultToken[]): [string, TokensSet][] =>
  Object.entries(R.pick(tokenSets, defaultTokens));

export const getToken = (tokenPath: DefaultToken): [string, TokensSet] => {
  return [tokenPath, defaultTokens[tokenPath]];
};
