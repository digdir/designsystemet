#!/usr/bin/env node
import path from 'node:path';
import { Argument, createCommand, Option, program } from '@commander-js/extra-typings';
import pc from 'picocolors';
import * as R from 'ramda';
import pkg from '../package.json' with { type: 'json' };
import { checkAutomigrate } from '../src/automigrate.ts';
import { convertToHex } from '../src/colors/index.ts';
import type { CssColor } from '../src/colors/types.ts';
import migrations from '../src/migrations/index.ts';
import { parseConfig, validateConfig } from '../src/schemas/helpers.ts';
import type { NextConfigSchema } from '../src/schemas/next/schema.ts';
import { nextConfigSchema } from '../src/schemas/next/schema.ts';
import type { CreateConfigSchema } from '../src/schemas/v1.1/schema.ts';
import { buildTokens } from '../src/tokens/build.ts';
import { createTokens, systemTokenToFiles, tokenSetDimensions, tokenSetsToFiles } from '../src/tokens/create.ts';
import { generateConfigFromTokens } from '../src/tokens/generate-config.ts';
import type { OutputFile, Theme } from '../src/tokens/types.ts';
import { toColorNames } from '../src/tokens/utils.ts';
import { dsfs } from '../src/utils/filesystem.ts';
import { deprecatedCLIOptions as cliOptions, parseCreateConfig, readConfigFile } from './config.ts';

const figletAscii = `
 _____            _                           _                      _
|  __ \\          (_)                         | |                    | |
| |  | | ___  ___ _  __ _ _ __  ___ _   _ ___| |_ ___ _ __ ___   ___| |_
| |  | |/ _ \\/ __| |/ _\` | '_ \\/ __| | | / __| __/ _ \\ '_ \` _ \\ / _ \\ __|
| |__| |  __/\\__ \\ | (_| | | | \\__ \\ |_| \\__ \\ ||  __/ | | | | |  __/ |_
|_____/ \\___||___/_|\\__, |_| |_|___/\\__, |___/\\__\\___|_| |_| |_|\\___|\\__|
                     __/ |           __/ |
                    |___/           |___/
`;

program.name('designsystemet').description('CLI for working with Designsystemet').showHelpAfterError();
program.hook('preAction', () => console.log(figletAscii));

const DEFAULT_TOKENS_CREATE_DIR = './design-tokens';
const DEFAULT_TOKENS_BUILD_DIR = './design-tokens-build';
const DEFAULT_FONT = 'Inter';
const DEFAULT_THEME_NAME = 'theme';
const DEFAULT_CONFIG_FILEPATH = 'designsystemet.config.json';
// Default config files to auto-detect when no --config is supplied, in order of precedence.
const DEFAULT_CONFIG_FILEPATHS = ['designsystemet.config.json', 'designsystemet.config.jsonc'];

// Options shared by multiple commands. Factories because commander mutates Option instances,
// so each command needs its own.
const configOption = () =>
  new Option(
    '-c, --config <filename>',
    `Path to config file (auto-detects ${DEFAULT_CONFIG_FILEPATHS.map((p) => `"${p}"`).join(' or ')})`,
  );
const dryOption = (description = 'Dry run - no files will be written') =>
  new Option('--dry [boolean]', description).argParser(parseBoolean).default(false);
const verboseOption = () => new Option('--verbose', 'Enable verbose output').default(false);

function _makeTokenCommands() {
  const tokenCmd = createCommand('tokens');

  tokenCmd
    .command('build')
    .description('Build Designsystemet tokens')
    .option('-t, --tokens <string>', `Path to ${pc.blue('design-tokens')}`, DEFAULT_TOKENS_CREATE_DIR)
    .option(
      '-o, --out-dir <string>',
      `Output directory for built ${pc.blue('design-tokens')}`,
      DEFAULT_TOKENS_BUILD_DIR,
    )
    .option(`--${cliOptions.clean} [boolean]`, 'Clean output directory before building tokens', parseBoolean, false)
    .addOption(dryOption(`Dry run for built ${pc.blue('design-tokens')}`))
    .addOption(verboseOption())
    .addOption(configOption())
    .option('--experimental-tailwind', 'Generate Tailwind CSS classes for tokens', false)
    .action(async (opts) => {
      const { verbose, clean, dry, experimentalTailwind, tokens } = opts;

      // TODO - add outdir eqivalent to config option when parsing config, so that it can be set in the config file as well. buildDir?

      dsfs.init({ dry, outdir: opts.outDir, verbose });

      await buildCss({
        tokensDir: tokens,
        outDir: dsfs.outDir,
        clean,
        verbose,
        tailwind: experimentalTailwind,
      });
    });

  tokenCmd
    .command('create')
    .description('Create Designsystemet tokens')
    .addOption(configOption())
    .option(`--${cliOptions.clean} [boolean]`, 'Clean output directory before creating tokens', parseBoolean, false)
    .addOption(dryOption(`Dry run for created ${pc.blue('design-tokens')}`))
    .option('--skip-check', 'Skip migration check', false) // TODO -- will be moved to global option in the future, since it applies to all commands, not just create
    .option('-y, --yes', 'Skip user prompts', false) // TODO -- will be moved to global option in the future, since it applies to all commands, not just create
    /** Deprecated options */
    .option(
      `-m, --${cliOptions.theme.colors.main} <name:hex...>`,
      `Main colors (deprecated, use JSON config file instead)`,
      parseColorValues,
    )
    .option(
      `-s, --${cliOptions.theme.colors.support} <name:hex...>`,
      `Support colors (deprecated, use JSON config file instead)`,
      parseColorValues,
    )
    .option(
      `-n, --${cliOptions.theme.colors.neutral} <hex>`,
      `Neutral hex color (deprecated, use JSON config file instead)`,
      convertToHex,
    )
    .option(
      `-o, --${cliOptions.outDir} <string>`,
      `Output directory for created ${pc.blue('design-tokens')}`,
      DEFAULT_TOKENS_CREATE_DIR,
    )
    .option(
      `-f, --${cliOptions.theme.typography.fontFamily} <string>`,
      `Font family (experimental, deprecated, use JSON config file instead)`,
      DEFAULT_FONT,
    )
    .option(
      `-b, --${cliOptions.theme.borderRadius} <number>`,
      `Unitless base border-radius in px (deprecated, use JSON config file instead)`,
      (radiusAsString) => Number(radiusAsString),
      4,
    )
    .option('--theme <string>', 'Theme name (deprecated, use JSON config file instead)', DEFAULT_THEME_NAME)
    .action(async (opts, cmd) => {
      if (
        opts.mainColors ||
        opts.supportColors ||
        opts.neutralColor ||
        (opts.borderRadius && opts.borderRadius !== 4) ||
        (opts.theme && opts.theme !== DEFAULT_THEME_NAME) ||
        (opts.fontFamily && opts.fontFamily !== DEFAULT_FONT)
      ) {
        console.warn(
          pc.yellow(`\n ⚠️  Using CLI options for ${pc.bold(`colors, border radius, theme, or font family is deprecated`)} and will be removed in a future release.
           \n ⚠️  Please use a JSON config file instead.`),
        );
      }

      if (opts.dry) {
        console.log(`Performing dry run, no files will be written`);
      }
      const themeName = opts.theme;

      const { configFile, configFilePath } = await getConfigFile(opts.config);

      const updatedConfigFile = opts.skipCheck
        ? configFile
        : await checkAutomigrate(configFile, configFilePath, opts.yes);

      const config = await parseCreateConfig(updatedConfigFile || configFile, {
        theme: themeName,
        cmd,
        configFilePath,
      });

      dsfs.init({ dry: opts.dry, outdir: config.outDir });

      await createDesignTokens({
        themes: config.themes,
        outDir: dsfs.outDir,
        clean: config.clean,
      });
    });

  return tokenCmd;
}

program.addCommand(_makeTokenCommands());

program
  .command('generate-config-from-tokens')
  .description('Generate a config file from existing design tokens. Will not include overrides.')
  .option('-d, --dir <string>', 'Path to design tokens directory', DEFAULT_TOKENS_CREATE_DIR)
  .option('-o, --out <string>', 'Output path for config file', DEFAULT_CONFIG_FILEPATH)
  .addOption(dryOption('Dry run - show config without writing file'))
  .action(async (opts) => {
    const { dry } = opts;
    const tokensDir = path.resolve(opts.dir);
    const configFilePath = path.resolve(opts.out);

    dsfs.init({ dry, outdir: path.dirname(configFilePath) });

    try {
      const config = await generateConfigFromTokens({
        tokensDir,
        outFile: configFilePath,
      });

      if (dry) {
        console.log();
        console.log('Generated config (dry run):');
        console.log(JSON.stringify(config, null, 2));
      }

      if (configFilePath) {
        const configJson = JSON.stringify(config, null, 2);
        await dsfs.writeFile(configFilePath, configJson);
        console.log();
        console.log(`\n✅ Config file written to ${pc.blue(configFilePath)}`);
      }
    } catch (error) {
      console.error(pc.redBright('Error generating config:'));
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

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

      console.log(`Applying migration ${pc.blue(migrationKey)} with glob: ${pc.green(glob)}`);
      migration?.(glob)
        .then(() => console.log(`Migration ${pc.blue(migrationKey)} finished`))
        .catch((error) => console.log(error));
    } else {
      console.log('Migrate: please specify a migration name or --list');
    }
  });

program.version(pkg.version, '-v, --version', 'Display version number').helpOption('-h, --help', 'Display help');

program
  .usage('designsystemet')
  .command('config', { isDefault: true })
  .description('Parses config file and run Designsystemet commands')
  .addOption(configOption())
  .addOption(dryOption())
  .addOption(verboseOption())
  .action(async (opts) => {
    const { verbose, dry } = opts;

    const { configFile, configFilePath } = await getConfigFile(opts.config);

    dsfs.init({ dry, verbose, outdir: path.dirname(configFilePath) });

    if (!configFile) {
      console.error(pc.redBright(`No config file found. Please create one at ${pc.blue(DEFAULT_CONFIG_FILEPATH)}.`));
      process.exit(1);
    }

    const parsedConfig = parseConfig<NextConfigSchema>(configFile);
    const config = validateConfig<NextConfigSchema>(nextConfigSchema, parsedConfig);

    for (const output of config.output) {
      if (output.type === 'design-tokens') {
        console.log(`\n🍱 Generating design tokens in ${pc.green(output.dir)}...`);

        await createDesignTokens({
          themes: config.themes,
          outDir: path.join(dsfs.outDir, output.dir),
          clean: config.clean,
        });
      }

      if (output.type === 'css') {
        console.log(`\n🍱 Generating CSS in ${pc.green(output.dir)}...`);

        await buildCss({
          // Resolve the token directory relative to the config file, like output.dir,
          // so it matches where a preceding design-tokens output wrote its files.
          tokensDir: path.join(dsfs.outDir, output.tokenDir),
          outDir: path.join(dsfs.outDir, output.dir),
          clean: output.cleanDir,
          verbose,
          tailwind: output.experimental_tailwind,
        });
      }
    }
  });

await program.parseAsync(process.argv);

function parseColorValues(value: string, previous: Record<string, CssColor> = {}): Record<string, CssColor> {
  const [name, hex] = value.split(':');
  previous[name] = convertToHex(hex);
  return previous;
}

function parseBoolean(value: string | boolean): boolean {
  return value === 'true' || value === true;
}

async function getConfigFile(userConfigFilePath: string | undefined) {
  if (!R.isNil(userConfigFilePath)) {
    // A config path was supplied explicitly. It's allowed to not exist only if it's one of the defaults.
    const allowFileNotFound = DEFAULT_CONFIG_FILEPATHS.includes(userConfigFilePath);
    const configFile = await readConfigFile(userConfigFilePath, allowFileNotFound);

    return { configFile, configFilePath: userConfigFilePath };
  }

  // No config path supplied: auto-detect the default config files (.json, then .jsonc).
  for (const configFilePath of DEFAULT_CONFIG_FILEPATHS) {
    const configFile = await readConfigFile(configFilePath, true);
    if (configFile) {
      return { configFile, configFilePath };
    }
  }

  // None found - return empty config using the canonical default path for messaging.
  return { configFile: '', configFilePath: DEFAULT_CONFIG_FILEPATH };
}

/**
 * Creates design token files for the given themes and writes them to `outDir`.
 * Shared by `tokens create` and the `config` command's `design-tokens` output.
 */
async function createDesignTokens({
  themes,
  outDir,
  clean,
}: {
  themes: CreateConfigSchema['themes'];
  outDir: string;
  clean?: boolean;
}) {
  const themeNames = Object.keys(themes);
  if (themeNames.length > 0) {
    console.log(`Using themes from config file: ${pc.blue(themeNames.join(', '))}`);
  }

  const files: OutputFile[] = [];

  // Pick colors from first theme since we have a constraint they should be the same across themes.
  const colorNames = toColorNames(themes[themeNames[0]]?.colors);

  for (const [name, themeConfig] of Object.entries(themes)) {
    const { tokenSets } = await createTokens({ name, ...themeConfig } as Theme);
    files.push(...tokenSetsToFiles(tokenSets));
  }

  files.push(
    ...(await systemTokenToFiles({
      tokenSetDimensions,
      themeNames,
      colorNames,
    })),
  );

  if (clean) {
    await dsfs.cleanDir(outDir);
  }

  await dsfs.mkdir(outDir);
  await dsfs.writeFiles(files, outDir);

  console.log(`\n✅ Finished creating tokens in ${pc.green(outDir)} for themes: ${pc.blue(themeNames.join(', '))}`);
}

/**
 * Builds CSS (and optionally Tailwind) files from the design tokens in `tokensDir` and writes them to `outDir`.
 * Shared by `tokens build` and the `config` command's `css` output.
 */
async function buildCss({
  tokensDir,
  outDir,
  clean,
  verbose,
  tailwind,
}: {
  tokensDir: string;
  outDir: string;
  clean?: boolean;
  verbose?: boolean;
  tailwind?: boolean;
}) {
  if (clean) {
    await dsfs.cleanDir(outDir);
  }

  await dsfs.mkdir(outDir);

  const files = await buildTokens({
    tokensDir,
    verbose: verbose ?? false,
    tailwind: tailwind ?? false,
  });

  console.log(`\n💾 Writing build to ${pc.green(outDir)}`);

  await dsfs.writeFiles(files, outDir, true);

  console.log(`\n✅ Finished building tokens in ${pc.green(outDir)}`);
}
