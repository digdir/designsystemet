#!/usr/bin/env node
import path from 'node:path';
import { Argument, createCommand, program } from '@commander-js/extra-typings';
import chalk from 'chalk';
import * as R from 'ramda';
import { fromError } from 'zod-validation-error';

import { convertToHex } from '../src/colors/index.js';
import type { CssColor } from '../src/colors/types.js';
import { type Config, combinedConfigSchema, configFileSchema, mapPathToOptionName } from '../src/config.js';
import migrations from '../src/migrations/index.js';
import { buildTokens } from '../src/tokens/build.js';
import { cliOptions, createTokens } from '../src/tokens/create.js';
import { writeTokens } from '../src/tokens/create/write.js';
import type { Theme } from '../src/tokens/types.js';
import { cleanDir, readFile } from '../src/utils.js';
import { type OptionGetter, getCliOption, getDefaultCliOption, getSuppliedCliOption } from './options.js';

program.name('designsystemet').description('CLI for working with Designsystemet').showHelpAfterError();

function makeTokenCommands() {
  const tokenCmd = createCommand('tokens');
  const DEFAULT_TOKENS_CREATE_DIR = './design-tokens';
  const DEFAULT_TOKENS_BUILD_DIR = './design-tokens-build';
  const DEFAULT_FONT = 'Inter';
  const DEFAULT_THEME_NAME = 'theme';
  const DEFAULT_CONFIG_FILE = 'designsystemet.config.json';

  tokenCmd
    .command('build')
    .description('Build Designsystemet tokens')
    .option('-t, --tokens <string>', `Path to ${chalk.blue('design-tokens')}`, DEFAULT_TOKENS_CREATE_DIR)
    .option(
      '-o, --out-dir <string>',
      `Output directory for built ${chalk.blue('design-tokens')}`,
      DEFAULT_TOKENS_BUILD_DIR,
    )
    .option(`--${cliOptions.clean} [boolean]`, 'Clean output directory before building tokens', parseBoolean, false)
    .option('--dry [boolean]', `Dry run for built ${chalk.blue('design-tokens')}`, parseBoolean, false)
    .option('-p, --preview', 'Generate preview token.ts files', false)
    .option('--verbose', 'Enable verbose output', false)
    .action(async (opts) => {
      const { preview, verbose, clean, dry } = opts;
      const tokensDir = typeof opts.tokens === 'string' ? opts.tokens : DEFAULT_TOKENS_CREATE_DIR;
      const outDir = typeof opts.outDir === 'string' ? opts.outDir : './dist/tokens';

      if (dry) {
        console.log(`Performing dry run, no files will be written`);
      }
      await buildTokens({ tokensDir, outDir, preview, verbose, dry, clean });

      return Promise.resolve();
    });

  tokenCmd
    .command('create')
    .description('Create Designsystemet tokens')
    .option(`-m, --${cliOptions.theme.colors.main} <name:hex...>`, `Main colors`, parseColorValues)
    .option(`-s, --${cliOptions.theme.colors.support} <name:hex...>`, `Support colors`, parseColorValues)
    .option(`-n, --${cliOptions.theme.colors.neutral} <hex>`, `Neutral hex color`, convertToHex)
    .option(
      `-o, --${cliOptions.outDir} <string>`,
      `Output directory for created ${chalk.blue('design-tokens')}`,
      DEFAULT_TOKENS_CREATE_DIR,
    )
    .option(`--${cliOptions.clean} [boolean]`, 'Clean output directory before creating tokens', parseBoolean, false)
    .option('--dry [boolean]', `Dry run for created ${chalk.blue('design-tokens')}`, parseBoolean, false)
    .option(`-f, --${cliOptions.theme.typography.fontFamily} <string>`, `Font family (experimental)`, DEFAULT_FONT)
    .option(
      `-b, --${cliOptions.theme.borderRadius} <number>`,
      `Unitless base border-radius in px`,
      (radiusAsString) => Number(radiusAsString),
      4,
    )
    .option('--theme <string>', 'Theme name (ignored when using JSON config file)', DEFAULT_THEME_NAME)
    .option('--config <string>', `Path to config file (default: "${DEFAULT_CONFIG_FILE}")`, (value) =>
      parseConfig(value, { allowFileNotFound: false }),
    )
    .action(async (opts, cmd) => {
      if (opts.dry) {
        console.log(`Performing dry run, no files will be written`);
      }

      /*
       * Get config file by looking for the optional default file, or using --config option if supplied.
       * The file must exist if specified through --config, but is not required otherwise.
       */
      const configFile = await (opts.config
        ? opts.config
        : parseConfig(DEFAULT_CONFIG_FILE, { allowFileNotFound: true }));
      const propsFromJson = configFile?.config;

      if (propsFromJson) {
        /*
         * Check that we're not creating multiple themes with different color names.
         * For the themes' modes to work in Figma and when building css, the color names must be consistent
         */
        const themeColors = Object.values(propsFromJson?.themes ?? {}).map(
          (x) => new Set([...R.keys(x.colors.main), ...R.keys(x.colors.support)]),
        );
        if (!R.all(R.equals(R.__, themeColors[0]), themeColors)) {
          console.error(
            chalk.redBright(
              `In config ${configFile.path}, all themes must have the same custom color names, but we found:`,
            ),
          );
          const themeNames = R.keys(propsFromJson.themes ?? {});
          themeColors.forEach((colors, index) => {
            const colorNames = Array.from(colors);
            console.log(`  - ${themeNames[index]}: ${colorNames.join(', ')}`);
          });
          console.log();
          process.exit(1);
        }
      }

      /*
       * Create final config from JSON config file and command-line options
       */
      const noUndefined = R.reject(R.isNil);

      const getThemeOptions = (optionGetter: OptionGetter) =>
        noUndefined({
          colors: noUndefined({
            main: optionGetter(cmd, 'mainColors'),
            support: optionGetter(cmd, 'supportColors'),
            neutral: optionGetter(cmd, 'neutralColor'),
          }),
          typography: noUndefined({
            fontFamily: optionGetter(cmd, 'fontFamily'),
          }),
          borderRadius: optionGetter(cmd, 'borderRadius'),
        });

      const unvalidatedConfig = noUndefined({
        outDir: propsFromJson?.outDir ?? getCliOption(cmd, 'outDir'),
        clean: propsFromJson?.clean ?? getCliOption(cmd, 'clean'),
        themes: propsFromJson?.themes
          ? R.map((jsonThemeValues) => {
              // For each theme specified in the JSON config, we resolve the option values in the following order:
              // - default value
              // - config value
              // - CLI value
              // With later values overriding earlier values
              const defaultThemeValues = getThemeOptions(getDefaultCliOption);
              const cliThemeValues = getThemeOptions(getSuppliedCliOption);
              return R.mergeDeepRight(defaultThemeValues, R.mergeDeepRight(jsonThemeValues, cliThemeValues));
            }, propsFromJson.themes)
          : // If there are no themes specified in the JSON config, we use both explicit
            // and default theme options from the CLI.
            {
              [opts.theme]: getThemeOptions(getCliOption),
            },
      });

      /*
       * Check that the config is valid
       */
      let config: Config;
      try {
        config = combinedConfigSchema.parse(unvalidatedConfig);
      } catch (err) {
        console.error(chalk.redBright('Invalid config after combining config file and CLI options'));
        const validationError = makeFriendlyError(err);
        console.error(validationError.toString());
        process.exit(1);
      }

      console.log(`Creating tokens with configuration ${chalk.green(JSON.stringify(config, null, 2))}`);

      /*
       * Clean the output directory if requested. Only clean once for multiple themes
       */
      if (config.clean) {
        await cleanDir(config.outDir, opts.dry);
      }
      /*
       * Create and write tokens for each theme
       */
      for (const [name, themeWithoutName] of Object.entries(config.themes)) {
        // Casting as missing properties should be validated by `getDefaultOrExplicitOption` to default values
        const theme = { name, ...themeWithoutName } as Theme;

        const { tokenSets } = await createTokens(theme);
        await writeTokens({ outDir: config.outDir, theme, dry: opts.dry, tokenSets });
      }
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

async function parseConfig(
  configPath: string,
  options: {
    allowFileNotFound: boolean;
  },
) {
  const resolvedPath = path.resolve(process.cwd(), configPath);

  let configFile: string;
  try {
    configFile = await readFile(resolvedPath);
    console.log(`Found config file: ${chalk.green(resolvedPath)}`);
  } catch (err) {
    if (err instanceof Error) {
      const nodeErr = err as NodeJS.ErrnoException;
      if (nodeErr.code === 'ENOENT' && options.allowFileNotFound) {
        // Suppress error when the file isn't found, instead the promise returns undefined.
        return;
      }
    }
    throw err;
  }
  try {
    return {
      path: configPath,
      config: await configFileSchema.parseAsync(JSON.parse(configFile)),
    };
  } catch (err) {
    console.error(chalk.redBright(`Invalid config in ${configPath}`));
    const validationError = makeFriendlyError(err);
    console.error(validationError.toString());
    process.exit(1);
  }
}

function makeFriendlyError(err: unknown) {
  return fromError(err, {
    messageBuilder: (issues) =>
      issues
        .map((issue) => {
          const issuePath = issue.path.join('.');
          const optionName = mapPathToOptionName(issue.path);

          const errorCode = `(error code: ${issue.code})`;
          const optionMessage = optionName ? ` or CLI option --${optionName}` : '';
          return `  - Error in JSON value ${chalk.red(issuePath)}${optionMessage}:
    ${issue.message} ${chalk.dim(errorCode)}`;
        })
        .join('\n'),
  });
}

function parseColorValues(value: string, previous: Record<string, CssColor> = {}): Record<string, CssColor> {
  const [name, hex] = value.split(':');
  previous[name] = convertToHex(hex);
  return previous;
}

function parseBoolean(value: string | boolean, previous: boolean): boolean {
  return value === 'true' || value === true;
}
