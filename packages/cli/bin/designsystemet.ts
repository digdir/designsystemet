#!/usr/bin/env node
import { Argument, createCommand, program } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { convertToHex } from '../src/colors/index.js';
import type { CssColor } from '../src/colors/types.js';
import migrations from '../src/migrations/index.js';
import { buildTokens } from '../src/tokens/build.js';
import { colorCliOptions, createTokens } from '../src/tokens/create.js';
import { writeTokens } from '../src/tokens/write.js';

program.name('designsystemet').description('CLI for working with Designsystemet').showHelpAfterError();

function makeTokenCommands() {
  const tokenCmd = createCommand('tokens');
  const DEFAULT_TOKENS_DIR = './design-tokens';
  const DEFAULT_BUILD_DIR = './design-tokens-build';

  tokenCmd
    .command('build')
    .description('Build Designsystemet tokens')
    .option('-t, --tokens <string>', `Path to ${chalk.blue('design-tokens')}`, DEFAULT_TOKENS_DIR)
    .option('-o, --out-dir <string>', `Output directory for built ${chalk.blue('design-tokens')}`, DEFAULT_BUILD_DIR)
    .option('--dry <boolean>', `Dry run for built ${chalk.blue('design-tokens')}`, false)
    .option('-p, --preview', 'Generate preview token.ts files', false)
    .option('--verbose', 'Enable verbose output', false)
    .action((opts) => {
      const { preview, verbose } = opts;
      const tokens = typeof opts.tokens === 'string' ? opts.tokens : DEFAULT_TOKENS_DIR;
      const outDir = typeof opts.outDir === 'string' ? opts.outDir : './dist/tokens';
      const dry = Boolean(opts.dry);

      console.log(`Building tokens in ${chalk.green(tokens)}`);
      return buildTokens({ tokens, outDir, preview, verbose, dry });
    });
  tokenCmd
    .command('create')
    .description('Create Designsystemet tokens')
    .requiredOption(`-m, --${colorCliOptions.main} <name:hex...>`, `Main colors`, parseColorValues)
    .requiredOption(`-s, --${colorCliOptions.support} <name:hex...>`, `Support colors`, parseColorValues)
    .requiredOption(`-n, --${colorCliOptions.neutral} <hex>`, `Neutral hex color`, convertToHex)
    .option('-o, --out-dir <string>', `Output directory for created ${chalk.blue('design-tokens')}`, DEFAULT_TOKENS_DIR)
    .option('--dry <boolean>', `Dry run for created ${chalk.blue('design-tokens')}`)
    .option('-f, --font-family <string>', `Font family`, 'Inter')
    .option('--theme <string>', `Theme name`, 'theme')
    .action(async (opts) => {
      const { theme, fontFamily, dry, outDir } = opts;
      console.log(`Creating tokens with options ${chalk.green(JSON.stringify(opts, null, 2))}`);

      const props = {
        themeName: theme,
        colors: {
          main: opts.mainColors,
          support: opts.supportColors,
          neutral: opts.neutralColor,
        },
        typography: {
          fontFamily: fontFamily,
        },
      };

      const tokens = createTokens(props);

      if (!dry) {
        await writeTokens({ outDir, tokens, themeName: theme, colors: props.colors });
      }

      return Promise.resolve();
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

await program.parseAsync(process.argv);

function parseColorValues(value: string, previous: Record<string, CssColor> = {}): Record<string, CssColor> {
  const [name, hex] = value.split(':');
  previous[name] = convertToHex(hex);
  return previous;
}
