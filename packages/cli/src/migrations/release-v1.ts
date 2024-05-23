import tokensv2 from './tokens-v2.js';

export default (glob?: string) => {
  return Promise.all([tokensv2(glob)]);
};
