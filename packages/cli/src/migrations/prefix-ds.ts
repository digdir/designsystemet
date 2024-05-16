import { cssVarCodemod } from '../codemods/css-var-codemod.js';

export default (path?: string) =>
  cssVarCodemod({
    globPath: path,
    dictionary: {
      '--fds': '--ds',
    },
  });
