import defineTest from 'jscodeshift/dist/testUtils.js';

import replaceClassNamePrefix from '../classname-prefix.js';

describe('classname-prefix', () => {
  defineTest(__dirname, replaceClassNamePrefix, null);
});
