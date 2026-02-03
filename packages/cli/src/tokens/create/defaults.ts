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
import type { TokenSet } from '../types.js';

const defaultTokens: Record<string, TokenSet> = {
  'primitives/globals': globals,
  'primitives/modes/size/small': sizeSmall,
  'primitives/modes/size/medium': sizeMedium,
  'primitives/modes/size/large': sizeLarge,
  'primitives/modes/size/global': sizeGlobal,
  'primitives/modes/typography/size/small': typgraphySmall,
  'primitives/modes/typography/size/medium': typgraphyMedium,
  'primitives/modes/typography/size/large': typgraphyLarge,
};

type DefaultToken = keyof typeof defaultTokens;

export const getDefaultTokens = (tokenSets: readonly DefaultToken[]): [DefaultToken, TokenSet][] =>
  Object.entries(R.pick(tokenSets, defaultTokens));
