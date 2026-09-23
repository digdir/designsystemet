#!/usr/bin/env node
import path from 'node:path';
import { Argument, program } from '@commander-js/extra-typings';
import pc from 'picocolors';
import * as R from 'ramda';
import pkg from '../package.json' with { type: 'json' };
import { formatThemeCSS } from '../src/index.ts';
import migrations from '../src/migrations/index.ts';
import { parseConfig, validateConfig } from '../src/schemas/helpers.ts';
import {
  type ConfigSchema,
  configSchema,
  type ExternalConfigSchemaInput,
  externalConfigSchema,
} from '../src/schemas/schema.ts';
import { warnDeprecatedFields } from '../src/schemas/schema-output.ts';
import { buildTokens } from '../src/tokens/build.ts';
import { createTokens, getTokenSetDimensions, systemTokenToFiles, tokenSetsToFiles } from '../src/tokens/create.ts';
import { generateConfigFromTokens } from '../src/tokens/generate-config.ts';
import type { OutputFile, Theme } from '../src/tokens/types.ts';
import { toColorNames } from '../src/tokens/utils.ts';
import { dsfs } from '../src/utils/filesystem.ts';
import { DEFAULT_CONFIG_FILEPATH, getConfigFile } from './config.ts';
import { DEFAULT_TOKENS_CREATE_DIR, makeTokenCommands } from './deprecated.ts';
import { configOption, dryOption, verboseOption } from './options.ts';

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
program.version(pkg.version, '-v, --version', 'Display version number').helpOption('-h, --help', 'Display help');

program
  .description('Run Designsystemet')
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

    const parsedConfig = parseConfig<ExternalConfigSchemaInput>(configFile);
    warnDeprecatedFields(parsedConfig);
    // Validate against the public schema first for a user-facing error on unsupported theme fields.
    validateConfig(externalConfigSchema, parsedConfig);
    const config = validateConfig(configSchema, parsedConfig);

    // Sort outputs so that design-tokens are generated before CSS, since CSS may depend on the design tokens being present.
    const sortedOutput = R.sortBy((o) => (o.type === 'design-tokens' ? 0 : 1), config.output);

    for (const output of sortedOutput) {
      const outDir = path.join(dsfs.outDir, output.dir);

      if (output.type === 'design-tokens') {
        console.log(`\n🍱 Creating design tokens in ${pc.green(output.dir)}...`);

        await createDesignTokens({
          themes: config.themes,
          outDir: outDir,
          clean: output.cleanDir,
        });
      }

      if (output.type === 'css') {
        console.log(`\n🍱 Creating CSS in ${pc.green(output.dir)}...`);

        // Only generate create CSS if no `design-tokens` output is present and no `tokenDir` is explicitly set in the config file. Otherwise, build CSS from existing design tokens.
        if (isOnlyCssOutput(config)) {
          await createCss({
            themes: config.themes,
            outDir: outDir,
            clean: output.cleanDir,
            verbose,
            tailwind: output.experimental_tailwind,
          });
        } else {
          await buildCss({
            // Resolve the token directory relative to the config file, like output.dir,
            // so it matches where a preceding design-tokens output wrote its files.
            tokensDir: path.join(dsfs.outDir, output.tokenDir),
            outDir,
            clean: output.cleanDir,
            verbose,
            tailwind: output.experimental_tailwind,
          });
        }
      }
    }
  });

program.addCommand(makeTokenCommands({ createDesignTokens, buildCss }));

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

await program.parseAsync(process.argv);

/**
 * Creates design token files for the given themes and writes them to `outDir`.
 * Shared by `tokens create` and the `config` command's `design-tokens` output.
 */
async function createDesignTokens({
  themes,
  outDir,
  clean,
}: {
  themes: ConfigSchema['themes'];
  outDir: string;
  clean?: boolean;
}) {
  const themeNames = Object.keys(themes);
  if (themeNames.length > 0) {
    console.log(`Using themes from config file: ${pc.blue(themeNames.join(', '))}`);
  }

  const files: OutputFile[] = [];

  // Pick colors and size from first theme since we have a constraint they should be the same across themes.
  const colorNames = toColorNames(themes[themeNames[0]]?.colors);
  const tokenSetDimensions = getTokenSetDimensions(themes[themeNames[0]]);

  for (const [name, themeConfig] of Object.entries(themes)) {
    const { tokenSets } = await createTokens({ name, ...themeConfig } as Theme, tokenSetDimensions);
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

  console.log(`\n💾 Writing design tokens to ${pc.green(outDir)}`);

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

  const files = await buildTokens({
    tokensDir,
    verbose: verbose ?? false,
    tailwind: tailwind ?? false,
  });

  console.log(`\n💾 Writing CSS to ${pc.green(outDir)}`);

  await dsfs.mkdir(outDir);
  await dsfs.writeFiles(files, outDir, true);

  console.log(`\n✅ Finished building tokens`);
}

async function createCss({
  themes,
  outDir,
  clean,
  verbose,
  tailwind,
}: {
  themes: ConfigSchema['themes'];
  outDir: string;
  clean?: boolean;
  verbose: boolean;
  tailwind: boolean;
}) {
  if (clean) {
    await dsfs.cleanDir(outDir);
  }

  const themeNames = Object.keys(themes);
  if (themeNames.length > 0) {
    console.log(`Using themes from config file: ${pc.blue(themeNames.join(', '))}`);
  }

  const files: OutputFile[] = [];

  for (const [name, themeConfig] of Object.entries(themes)) {
    const themeCSSFiles = await formatThemeCSS({ name, ...themeConfig } as Theme, { verbose, tailwind });
    files.push(...themeCSSFiles);
  }

  if (clean) {
    await dsfs.cleanDir(outDir);
  }

  console.log(`\n💾 Writing CSS to ${pc.green(outDir)}`);

  await dsfs.mkdir(outDir);
  await dsfs.writeFiles(files, outDir, true);

  console.log(`\n✅ Finished creating CSS`);
}

function isOnlyCssOutput(config: ConfigSchema): boolean {
  // Can be defined using either the shorthand or object syntax, so check for both.
  const hasDesignTokensOutput =
    config.output.find((o) => o.type === 'design-tokens') ||
    config.output.find((o) => o === ('design-tokens' as unknown as ConfigSchema['output'][number]));
  const hasCSSTokensDir = config.output.find((o) => o.type === 'css')?.tokenDir;

  return !hasDesignTokensOutput && !hasCSSTokensDir;
}
