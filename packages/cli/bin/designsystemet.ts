#!/usr/bin/env node
import { Argument, Command, program } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { makeInitCommand } from '../src/init/index.js';
import migrations from '../src/migrations/index.js';
import { run } from '../src/tokens/build.js';

program.name('Designsystemet').description('CLI for working with Designsystemet');

program
  .command('tokens')
  .showHelpAfterError()
  .description('run Designsystemet token builder')
  .option('-t, --tokens [string]', `Path to ${chalk.blue('design-tokens')}`, './design-tokens')
  .option('-o, --out [string]', `Output directory for built ${chalk.blue('design-tokens')}`, './dist/tokens')
  .option('-p, --preview', 'Generate preview token.ts files', false)
  .action((opts) => {
    const tokens = typeof opts.tokens === 'string' ? opts.tokens : './design-tokens';
    const out = typeof opts.out === 'string' ? opts.out : './dist/tokens';
    const preview = opts.preview;
    console.log(`Bulding tokens in ${chalk.green(tokens)}`);
    return run({ tokens, out, preview });
  });

program
  .command('migrate')
  .showHelpAfterError()
  .description('run a Designsystemet migration')
  .addArgument(new Argument('[migration]', 'Available migrations').choices(Object.keys(migrations)))
  .option('-l --list', 'List available migrations')
  .option('-g --glob <glob>', 'Glob for files upon which to apply the migration', './**/*.(tsx|css)')
  .action((migrationKey, opts) => {
    const { glob, list } = opts;

    if (list) {
      for (const key of Object.keys(migrations)) {
        console.log(key);
      }
    } else if (migrationKey) {
      const migration = migrations[migrationKey as keyof typeof migrations];
      if (!migration) {
        console.error('Migration not found!');
        throw 'Aborting';
      }

      console.log(`Applying migration ${chalk.blue(migrationKey)} with glob: ${chalk.green(glob)}`);
      migration?.(glob)
        .then(() => console.log(`Migration ${chalk.blue(migrationKey)} finished`))
        .catch((error) => console.log(error));
    } else {
      console.log('Migrate: please specify a migration name or --list');
    }
  });

program.addCommand(makeInitCommand(new Command('init')));

await program.parseAsync(process.argv);
