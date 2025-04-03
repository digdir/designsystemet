import type { TokenSet } from '../../types.js';

type Metadata = {
  tokenSetOrder: string[];
};

export function generate$Metadata(tokenSets: Map<string, TokenSet>): Metadata {
  return {
    tokenSetOrder: Array.from(tokenSets.keys()),
  };
}
