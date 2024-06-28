import { Argument, type Command } from '@commander-js/extra-typings';

import { createTokensPackage } from './createTokensPackage.js';

export function makeInitCommand(command: Command) {
  return command
    .showHelpAfterError()
    .description('create an initial token structure for Designsystemet')
    .addArgument(new Argument('<targetDir>', 'Target directory for the generated code'))
    .action(async (targetDir) => {
      await createTokensPackage(targetDir);
    });
}
