import { cssNameCodemod } from '../codemods/css-class-rename.js';

export default (glob?: string) =>
  cssNameCodemod({
    dictionary: {
      '.fds-': '.ds-',
    },
    globPattern: glob,
  });
