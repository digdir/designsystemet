import tokensv2 from './tokens-v2.js';
import prefixDs from './prefix-ds.js';

export default (glob?: string) => {
  return Promise.all([tokensv2(glob), prefixDs(glob)]);
};
