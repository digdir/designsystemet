import defineTest from 'jscodeshift/dist/testUtils';

import replaceClassNamePrefix from '../classname-prefix.js';

describe('classname-prefix', () => {
  defineTest(__dirname, replaceClassNamePrefix);
});
