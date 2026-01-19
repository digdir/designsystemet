#!/usr/bin/env node
import { Argument, createCommand, program } from '@commander-js/extra-typings';
import pc from 'picocolors';
import * as R from 'ramda';
import { convertToHex } from '../src/colors/index.js';
import type { CssColor } from '../src/colors/types.js';
import { type CreateConfigSchema, parseConfig } from '../src/config.js';
import migrations from '../src/migrations/index.js';
import { buildTokens } from '../src/tokens/build.js';
import { writeTokens } from '../src/tokens/create/write.js';
import { cliOptions, createTokens } from '../src/tokens/create.js';
import { generateConfigFromTokens } from '../src/tokens/generate-config.js';
import type { Theme } from '../src/tokens/types.js';
import { cleanDir } from '../src/utils.js';
import { parseBuildConfig, parseCreateConfig, readConfigFile } from './config.js';

export const figletAscii = `
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
const DEFAULT_CONFIG_FILE = 'designsystemet.config.json';

function makeTokenCommands() {
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
    .option('--config <string>', `Path to config file (default: "${DEFAULT_CONFIG_FILE}")`)
    .option('--experimental-tailwind', 'Generate Tailwind CSS classes for tokens', false)
    .action(async (opts) => {
      console.log(figletAscii);
      const { verbose, clean, dry, experimentalTailwind } = opts;
      const tokensDir = typeof opts.tokens === 'string' ? opts.tokens : DEFAULT_TOKENS_CREATE_DIR;
      const outDir = typeof opts.outDir === 'string' ? opts.outDir : './dist/tokens';

      const { configFile, configPath } = await getConfigFile(opts.config);

      // Hacky: get the globalTypography from the create config.
      // This only works because these settings can't be passed as CLI options
      const globalTypographyConfig = parseConfig<CreateConfigSchema>(configFile, configPath).globalTypography;

      const config = await parseBuildConfig(configFile, { configPath });

      if (dry) {
        console.log(`Performing dry run, no files will be written`);
      }

      if (clean) {
        await cleanDir(outDir, dry);
      }

      if (
        Object.values(globalTypographyConfig?.size?.modes ?? []).some(
          (x) => Object.values(x.overrides ?? {}).length > 0,
        )
      ) {
        // If typography sizes have been overridden with explicit values, we can't use modular formulae
        config.build = config.build ?? {};
        config.build.typographySizeValues = 'static';
      }

      await buildTokens({ tokensDir, outDir, verbose, dry, tailwind: experimentalTailwind, ...config.build });

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
      `Output directory for created ${pc.blue('design-tokens')}`,
      DEFAULT_TOKENS_CREATE_DIR,
    )
    .option(`--${cliOptions.clean} [boolean]`, 'Clean output directory before creating tokens', parseBoolean, false)
    .option('--dry [boolean]', `Dry run for created ${pc.blue('design-tokens')}`, parseBoolean, false)
    .option(`-f, --${cliOptions.theme.typography.fontFamily} <string>`, `Font family (experimental)`, DEFAULT_FONT)
    .option(
      `-b, --${cliOptions.theme.borderRadius} <number>`,
      `Unitless base border-radius in px`,
      (radiusAsString) => Number(radiusAsString),
      4,
    )
    .option('--theme <string>', 'Theme name (ignored when using JSON config file)', DEFAULT_THEME_NAME)
    .option('--config <string>', `Path to config file (default: "${DEFAULT_CONFIG_FILE}")`)
    .action(async (opts, cmd) => {
      console.log(figletAscii);
      if (opts.dry) {
        console.log(`Performing dry run, no files will be written`);
      }

      const { configFile, configPath } = await getConfigFile(opts.config);
      const config = await parseCreateConfig(configFile, {
        theme: opts.theme,
        cmd,
        configPath,
      });

      if (config.clean) {
        await cleanDir(config.outDir, opts.dry);
      }
      /*
       * Create and write tokens for each theme
       */
      if (config.themes) {
        for (const [name, themeWithoutName] of Object.entries(config.themes)) {
          // Casting as missing properties should be validated by `getDefaultOrExplicitOption` to default values
          const theme = { name, ...themeWithoutName } as Theme;

          const { tokenSets } = await createTokens(theme, config.globalTypography?.size);
          await writeTokens({ outDir: config.outDir, theme, dry: opts.dry, tokenSets });
        }
      }
    });

  return tokenCmd;
}

program.addCommand(makeTokenCommands());

program
  .command('generate-config-from-tokens')
  .description('Generate a config file from existing design tokens. Will not include overrides.')
  .option('-d, --dir <string>', 'Path to design tokens directory', DEFAULT_TOKENS_CREATE_DIR)
  .option('-o, --out <string>', 'Output path for config file', DEFAULT_CONFIG_FILE)
  .option('--dry [boolean]', 'Dry run - show config without writing file', parseBoolean, false)
  .action(async (opts) => {
    console.log(figletAscii);
    const { dry } = opts;
    const tokensDir = typeof opts.dir === 'string' ? opts.dir : DEFAULT_TOKENS_CREATE_DIR;
    const outFile = typeof opts.out === 'string' ? opts.out : DEFAULT_CONFIG_FILE;

    try {
      const config = await generateConfigFromTokens({
        tokensDir,
        outFile: dry ? undefined : outFile,
        dry,
      });

      if (dry) {
        console.log();
        console.log('Generated config (dry run):');
        console.log(JSON.stringify(config, null, 2));
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

await program.parseAsync(process.argv);

function parseColorValues(value: string, previous: Record<string, CssColor> = {}): Record<string, CssColor> {
  const [name, hex] = value.split(':');
  previous[name] = convertToHex(hex);
  return previous;
}

function parseBoolean(value: string | boolean): boolean {
  return value === 'true' || value === true;
}

async function getConfigFile(config: string | undefined) {
  const allowFileNotFound = R.isNil(config) || config === DEFAULT_CONFIG_FILE;
  const configPath = config ?? DEFAULT_CONFIG_FILE;
  const configFile = await readConfigFile(configPath, allowFileNotFound);
  return { configFile, configPath };
}
