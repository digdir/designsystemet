import type { TokensSet } from '../types.js';

type Metadata = {
  tokenSetOrder: string[];
};

export function generateMetadataJson(tokenSets: Map<string, TokensSet>): Metadata {
  return {
    tokenSetOrder: Array.from(tokenSets.keys()),
  };
}
