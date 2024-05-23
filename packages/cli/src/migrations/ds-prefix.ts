import { cssClassRename } from '../codemods/css/plugins.js';
import { runCssCodemod } from '../codemods/css/run.js';

export default (glob?: string) => {
  return runCssCodemod({
    plugins: [
      cssClassRename({
        '.fds-': '.ds-',
      }),
    ],
    globPattern: glob,
  });
};
