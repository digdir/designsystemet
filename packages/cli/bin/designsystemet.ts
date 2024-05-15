#!/usr/bin/env node
import { Argument, program } from '@commander-js/extra-typings';

import migrations from './../src/codemods/migrations.js';
import { run } from './../src/tokens/build.js';

program
  .name('Designsystemet')
  .description('CLI for working with Designsystemet');

program
  .command('tokens')
  .description('run Designsystemet token builder')
  .option(
    '-t, --tokens <string>',
    'Path to "design-tokens"',
    '../../design-tokens',
  )

  .option('-p, --preview')
  .action((opts) => {
    const tokens = typeof opts.tokens === 'string' ? opts.tokens : '';
    return run({ tokens });
  });

program
  .command('migrate')
  .description('run a Designsystemet migration')
  .addArgument(
    new Argument('<migration>', 'Migration to run').choices(
      Object.keys(migrations),
    ),
  )
  .action((migrationKey) => {
    const migration = migrations[migrationKey as keyof typeof migrations];
    if (!migration) {
      console.error('Migration not found!');
      throw 'Aborting';
    }
    migration?.();
  });

await program.parseAsync(process.argv);
