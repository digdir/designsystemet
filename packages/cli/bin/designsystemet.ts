#!/usr/bin/env node
import { Argument, createCommand, program } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { convertToHex } from '../src/colors/index.js';
import { createTokensPackage } from '../src/init/createTokensPackage.js';
import migrations from '../src/migrations/index.js';
import { typography } from '../src/tokens/build/formats/css';
import { buildTokens } from '../src/tokens/build/index.js';
import { createTokens } from '../src/tokens/create//index.js';

program.name('Designsystemet').description('CLI for working with Designsystemet').showHelpAfterError();

function makeTokenCommands() {
  const tokenCmd = createCommand('tokens');

  tokenCmd
    .command('build')
    .description('Build Designsystemet tokens')
    .option('-t, --tokens <string>', `Path to ${chalk.blue('design-tokens')}`, './design-tokens')
    .option('-o, --out <string>', `Output directory for built ${chalk.blue('design-tokens')}`, './dist/tokens')
    .option('-p, --preview', 'Generate preview token.ts files', false)
    .action((opts) => {
      const tokens = typeof opts.tokens === 'string' ? opts.tokens : './design-tokens';
      const out = typeof opts.out === 'string' ? opts.out : './dist/tokens';
      const preview = opts.preview;
      console.log(`Bulding tokens in ${chalk.green(tokens)}`);
      return buildTokens({ tokens, out, preview });
    });

  tokenCmd
    .command('create')
    .description('Create Designsystemet tokens')
    .option('-w, --write [string]', `Output directory for created ${chalk.blue('design-tokens')}`)
    .option('-a, --accent <number>', `Accent hex color`)
    .option('-n, --neutral <number>', `Neutral hex color`)
    .option('-b1, --brand1 <number>', `Brand1 hex color`)
    .option('-b2, --brand2 <number>', `Brand2 hex color`)
    .option('-b3, --brand3 <number>', `Brand3 hex color`)
    .option('-f, --font-family <string>', `Font family`)
    .action(async (opts) => {
      // const out = typeof opts.out === 'string' ? opts.out : './dist/tokens';
      console.log(`Creating tokens with options ${chalk.green(JSON.stringify(opts))}`);
      const family = typeof opts.fontFamily === 'string' ? opts.fontFamily : 'Inter';
      const write = typeof opts.write === 'boolean' ? './design-tokens' : opts.write;

      const props = {
        colors: {
          accent: convertToHex(opts.accent),
          neutral: convertToHex(opts.neutral),
          brand1: convertToHex(opts.brand1),
          brand2: convertToHex(opts.brand2),
          brand3: convertToHex(opts.brand3),
        },
        typography: {
          fontFamily: family,
        },
        write,
      };

      await createTokens(props);
    });

  return tokenCmd;
}

program.addCommand(makeTokenCommands());

program
  .command('migrate')
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

program
  .command('init')
  .description('create an initial token structure for Designsystemet')
  .addArgument(new Argument('<targetDir>', 'Target directory for the generated code'))
  .action(async (targetDir) => {
    await createTokensPackage(targetDir);
  });

await program.parseAsync(process.argv);
