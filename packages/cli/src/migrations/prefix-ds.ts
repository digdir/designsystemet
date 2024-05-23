import { cssVarCodemod } from '../codemods/css-var-rename.js';

export default (glob?: string) =>
  cssVarCodemod({
    globPattern: glob,
    dictionary: {
      '--fds': '--ds',
    },
  });
