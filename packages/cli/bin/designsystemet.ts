#!/usr/bin/env node
import path from 'node:path';
import { Argument, createCommand, program } from '@commander-js/extra-typings';
import pc from 'picocolors';
import * as R from 'ramda';
import pkg from '../package.json' with { type: 'json' };
import { checkAutomigrate } from '../src/automigrate.ts';
import { convertToHex } from '../src/colors/index.ts';
import type { CssColor } from '../src/colors/types.ts';
import migrations from '../src/migrations/index.ts';
import { getSchemaDefaults, parseConfig } from '../src/schemas/helpers.ts';
import type { RootConfigSchema } from '../src/schemas/next/schema.ts';
import { rootConfig } from '../src/schemas/next/schema.ts';
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

const DEFAULT_TOKENS_CREATE_DIR = './design-tokens';
const DEFAULT_TOKENS_BUILD_DIR = './design-tokens-build';
const DEFAULT_FONT = 'Inter';
const DEFAULT_THEME_NAME = 'theme';
const DEFAULT_CONFIG_FILEPATH = 'designsystemet.config.json';
// Default config files to auto-detect when no --config is supplied, in order of precedence.
const DEFAULT_CONFIG_FILEPATHS = ['designsystemet.config.json', 'designsystemet.config.jsonc'];

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
    .option('--dry [boolean]', `Dry run for built ${pc.blue('design-tokens')}`, parseBoolean, false)
    .option('--verbose', 'Enable verbose output', false)
    .option(
      '--config <string>',
      `Path to config file (auto-detects ${DEFAULT_CONFIG_FILEPATHS.map((p) => `"${p}"`).join(' or ')})`,
    )
    .option('--experimental-tailwind', 'Generate Tailwind CSS classes for tokens', false)
    .action(async (opts) => {
      console.log(figletAscii);
      const { verbose, clean, dry, experimentalTailwind, tokens } = opts;

      // TODO - add outdir eqivalent to config option when parsing config, so that it can be set in the config file as well. buildDir?

      dsfs.init({ dry, outdir: opts.outDir, verbose });

      const outDir = dsfs.outDir;

      if (clean) {
        await dsfs.cleanDir(outDir);
      }

      const files = await buildTokens({
        tokensDir: tokens,
        verbose,
        tailwind: experimentalTailwind,
      });

      console.log(`\n💾 Writing build to ${pc.green(outDir)}`);

      await dsfs.writeFiles(files, outDir, true);

      console.log(`\n✅ Finished building tokens in ${pc.green(outDir)}`);

      return Promise.resolve();
    });

  tokenCmd
    .command('create')
    .description('Create Designsystemet tokens')
    .option(
      '--config <string>',
      `Path to config file (auto-detects ${DEFAULT_CONFIG_FILEPATHS.map((p) => `"${p}"`).join(' or ')})`,
    )
    .option(`--${cliOptions.clean} [boolean]`, 'Clean output directory before creating tokens', parseBoolean, false)
    .option('--dry [boolean]', `Dry run for created ${pc.blue('design-tokens')}`, parseBoolean, false)
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

      console.log(figletAscii);
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

      const themeNames = Object.keys(config.themes);
      if (themeNames.length > 0) {
        console.log(`Using themes from config file: ${pc.blue(themeNames.join(', '))}`);
      }

      dsfs.init({ dry: opts.dry, outdir: config.outDir });

      const outDir = dsfs.outDir;

      const files: OutputFile[] = [];

      // Pick colors from first theme since we have a constraint they should be the same across themes.
      const colorNames = toColorNames(config.themes?.[themeNames[0]]?.colors);

      for (const [name, themeConfig] of Object.entries(config.themes)) {
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

      if (config.clean) {
        await dsfs.cleanDir(outDir);
      }

      await dsfs.mkdir(outDir);
      await dsfs.writeFiles(files, outDir);

      console.log(`\n✅ Finished creating tokens in ${pc.green(outDir)} for themes: ${pc.blue(themeNames.join(', '))}`);

      return Promise.resolve();
    });

  return tokenCmd;
}

program.addCommand(_makeTokenCommands());

program
  .command('generate-config-from-tokens')
  .description('Generate a config file from existing design tokens. Will not include overrides.')
  .option('-d, --dir <string>', 'Path to design tokens directory', DEFAULT_TOKENS_CREATE_DIR)
  .option('-o, --out <string>', 'Output path for config file', DEFAULT_CONFIG_FILEPATH)
  .option('--dry [boolean]', 'Dry run - show config without writing file', parseBoolean, false)
  .action(async (opts) => {
    console.log(figletAscii);
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
    console.log(figletAscii);
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
  .option(
    '-c, --config <filename>',
    `Use a custom config file (auto-detects ${DEFAULT_CONFIG_FILEPATHS.map((p) => `"${p}"`).join(' or ')})`,
  )
  .option('--dry [boolean]', 'Dry run - show config without writing files', parseBoolean, false)
  .action(async (opts) => {
    console.log(figletAscii);
    const { configFile, configFilePath } = await getConfigFile(opts.config);

    dsfs.init({ dry: opts.dry, outdir: path.dirname(configFilePath) });

    if (!configFile) {
      console.error(pc.redBright(`No config file found. Please create one at ${pc.blue(DEFAULT_CONFIG_FILEPATH)}.`));
      process.exit(1);
    }

    const parsedConfig = parseConfig<RootConfigSchema>(configFile, configFilePath);
    const defaultConfig = getSchemaDefaults(rootConfig);
    const config = { ...defaultConfig, ...parsedConfig };

    console.log('Default config:', defaultConfig);
    console.log('Merged config:', config);

    const themeNames = Object.keys(config.themes);
    if (themeNames.length > 0) {
      console.log(`Using themes from config file: ${pc.blue(themeNames.join(', '))}`);
    }

    for (const output of config.output) {
      if (output.type === 'design-tokens') {
        console.log(`\nGenerating design tokens in ${pc.green(output.dir)}...`);

        const files: OutputFile[] = [];

        const outDir = path.join(dsfs.outDir, output.dir);

        // Pick colors from first theme since we have a constraint they should be the same across themes.
        const colorNames = toColorNames(config.themes?.[themeNames[0]]?.colors);

        for (const [name, themeConfig] of Object.entries(config.themes)) {
          const { tokenSets } = await createTokens({ name, ...themeConfig } as Theme);
          files.push(...tokenSetsToFiles(tokenSets));
        }

        files.push(
          ...(await createSystemTokenFiles({
            tokenSetDimensions,
            themeNames,
            colorNames,
          })),
        );

        if (config.clean) {
          await dsfs.cleanDir(outDir);
        }

        await dsfs.mkdir(outDir);
        await dsfs.writeFiles(files, outDir);

        console.log(
          `\n✅ Finished creating tokens in ${pc.green(output.dir)} for themes: ${pc.blue(themeNames.join(', '))}`,
        );
      }

      if (output.type === 'css') {
        console.log(`\nGenerating CSS in ${pc.green(output.dir)}...`);

        const outDir = path.join(dsfs.outDir, output.dir);

        if (output.cleanDir) {
          await dsfs.cleanDir(outDir);
        }

        const files = await buildTokens({
          tokensDir: output.tokenDir,
          verbose: false,
          tailwind: output.experimental_tailwind || false,
        });

        console.log(`\n💾 Writing build to ${pc.green(outDir)}`);

        await dsfs.writeFiles(files, outDir, true);

        console.log(`\n✅ Finished building tokens in ${pc.green(outDir)}`);
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
