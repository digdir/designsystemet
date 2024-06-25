import { Argument, program } from '@commander-js/extra-typings';

import { createTokensPackage } from '../createTokensPackage';

program
  .name('npm create @digdir/tokens')
  .description(
    'CLI tool to create an initial token structure for Designsystemet',
  );

program
  .addArgument(
    new Argument('<targetDir>', 'Target directory for the generated code'),
  )
  .action(async (targetDir) => {
    await createTokensPackage(targetDir);
  });

program.showHelpAfterError();

void program.parseAsync(process.argv);
