import lightDark from './light-dark.js';
import tokensv2 from './tokens-v2.js';
import prefixDs from './prefix-ds.js';

export default (glob?: string) => {
  return Promise.all([lightDark(glob), tokensv2(glob), prefixDs(glob)]);
};
