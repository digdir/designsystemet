import { cssVarCodemod } from '../codemods/css-var-rename.js';

export default (glob?: string) =>
  cssVarCodemod({
    globPath: glob,
    dictionary: {
      '--fds': '--ds',
    },
  });
