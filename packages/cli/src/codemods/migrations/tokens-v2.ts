import { cssVarCodemod } from '../css-var-codemod.js';

export default () =>
  cssVarCodemod({
    '--fds': '--ds',
    '.fds': '.ds',
  });
