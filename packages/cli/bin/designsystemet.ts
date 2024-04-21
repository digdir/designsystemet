#!/usr/bin/env node
import { Argument, program } from '@commander-js/extra-typings';

import pkg from '../package.json' with { type: 'json' };

import migrations from './../src/codemods/migrations.js';
import { run } from './../src/tokens/build.js';

program
  .name('Designsystemet')
  .description('CLI for working with Designsystemet')
  .version(pkg.version);

program
  .command('tokens')
  .description('run Designsystemet token builder')
  .option('-t, --tokens', 'Location for design-tokens', '../../design-tokens')
  .option('-b, --brands [brands...]', 'Brand files to include')
  .option('-p, --preview')
  .action((opts) => {
    const brands = Array.isArray(opts.brands) ? opts.brands : [];
    const tokens = opts.tokens as string;
    return run({ brands, tokens });
  });

program
  .command('migrate')
  .addArgument(
    new Argument('<migraton>', 'migration to run').choices(
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

program.parse();
