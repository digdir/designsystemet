#!/usr/bin/env node
import { Argument, program } from '@commander-js/extra-typings';

import migrations from './../src/migrations/index.js';
import { run } from './../src/tokens/build.js';

program.name('Designsystemet').description('CLI for working with Designsystemet');

program
  .command('tokens')
  .description('run Designsystemet token builder')
  .option('-t, --tokens <string>', 'Path to "design-tokens"', '../../design-tokens')
  .option('-p, --preview')
  .action((opts) => {
    const tokens = typeof opts.tokens === 'string' ? opts.tokens : '';
    return run({ tokens });
  });

program
  .command('migrate')
  .description('run a Designsystemet migration')
  .addArgument(new Argument('<migration>', 'Migration to run').choices(Object.keys(migrations)))
  .option('-g, --glob <string>', 'Glob for where migration should run', './**/*.css')
  .action((migrationKey, opts) => {
    const { glob } = opts;
    const migration = migrations[migrationKey as keyof typeof migrations];
    if (!migration) {
      console.error('Migration not found!');
      throw 'Aborting';
    }
    migration?.(glob);
  });

await program.parseAsync(process.argv);
