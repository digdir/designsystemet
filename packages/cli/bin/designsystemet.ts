#!/usr/bin/env node
import path from 'node:path';
import { Argument, program } from '@commander-js/extra-typings';
import pc from 'picocolors';
import * as R from 'ramda';
import pkg from '../package.json' with { type: 'json' };
import { checkAutomigrate } from '../src/automigrate.ts';
import migrations from '../src/migrations/index.ts';
import { parseConfig, validateConfig } from '../src/schemas/helpers.ts';
import {
  type ConfigSchemaThemes,
  configSchema,
  type ExternalConfigSchemaInput,
  externalConfigSchema,
} from '../src/schemas/schema.ts';
import { buildTokens } from '../src/tokens/build.ts';
import { createTokens, getTokenSetDimensions, systemTokenToFiles, tokenSetsToFiles } from '../src/tokens/create.ts';
import { formatThemeCSS } from '../src/tokens/format.ts';
import { generateConfigFromTokens } from '../src/tokens/generate-config.ts';
import type { TailwindVersion } from '../src/tokens/process/output/tailwind.ts';
import type { OutputFile, Theme } from '../src/tokens/types.ts';
import { toColorNames } from '../src/tokens/utils.ts';
import { dsfs } from '../src/utils/filesystem.ts';
import { isSameOrInside } from '../src/utils/paths.ts';
import { DEFAULT_CONFIG_FILEPATH, getConfigFile, requireThemes } from './config.ts';
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

program
  .name('designsystemet')
  .description('CLI for working with Designsystemet')
  .showHelpAfterError()
  // The root command and its subcommands share option names (e.g. --config, --skip-check),
  // so only parse root options before the subcommand, leaving the rest to the subcommand.
  .enablePositionalOptions();
program.hook('preAction', () => console.log(figletAscii));
program.version(pkg.version, '-v, --version', 'Display version number').helpOption('-h, --help', 'Display help');

program
  .description('Run Designsystemet')
  .addOption(configOption())
  .addOption(dryOption())
  .addOption(verboseOption())
  .option('--skip-check', 'Skip migration check', false)
  .option('-y, --yes', 'Skip migration prompts and auto accept', false)
  .action(async (opts) => {
    const { verbose, dry } = opts;

    const { configFile, configFilePath } = await getConfigFile(opts.config);

    dsfs.init({ dry, verbose, outdir: path.dirname(configFilePath) });

    if (!configFile) {
      console.error(pc.redBright(`No config file found. Please create one at ${pc.blue(DEFAULT_CONFIG_FILEPATH)}.`));
      process.exit(1);
    }

    const updatedConfigFile = opts.skipCheck
      ? configFile
      : await checkAutomigrate(configFile, configFilePath, opts.yes);

    const parsedConfig = parseConfig<ExternalConfigSchemaInput>(updatedConfigFile);

    // This command only reads `output`. If `outDir` or `clean` are still in the config, because the migration was
    // declined or skipped, stop before anything is cleaned or written instead of silently ignoring them.
    if (parsedConfig.outDir !== undefined || parsedConfig.clean !== undefined) {
      console.error(
        pc.redBright(
          `${pc.blue('outDir')} and ${pc.blue('clean')} are not supported by ${pc.blue('designsystemet')}. Run it again and accept the migration, or replace them with ${pc.blue('output')}. To keep using them, run ${pc.blue('designsystemet tokens create')} instead.`,
        ),
      );
      process.exit(1);
    }
    // Validate against the public schema first for a user-facing error on unsupported theme fields.
    validateConfig(externalConfigSchema, parsedConfig);
    const config = validateConfig(configSchema, parsedConfig);

    // Sort outputs so that design-tokens are generated before CSS, since CSS may depend on the design tokens being present.
    const sortedOutput = R.sortBy((o) => (o.type === 'design-tokens' ? 0 : 1), config.output);
    const designTokensOutput = config.output.find((o) => o.type === 'design-tokens');

    // Outputs created from themes can't run without them. Check this before cleaning, so nothing is deleted when
    // themes are missing. Same rule as below: design tokens, and CSS with no design tokens to build from.
    const needsThemes = config.output.some(
      (o) => o.type === 'design-tokens' || (o.type === 'css' && (o.tokensDir ?? designTokensOutput?.dir) === undefined),
    );
    if (needsThemes) {
      requireThemes(config);
    }

    // Clean every output directory once, before any output is created. Cleaning as part of each output would
    // delete what earlier outputs wrote when they share a directory, which makes the outputs depend on their order.
    const dirsToClean = R.uniq(
      config.output.filter((o) => 'cleanDir' in o && o.cleanDir).map((o) => path.join(dsfs.outDir, o.dir)),
    );

    // Check every directory before cleaning any, so nothing is deleted when one of them is unsafe.
    // Paths are resolved, so differently written paths to the same directory (`tokens`, `./tokens/`) match.
    const resolveDir = (dir: string) => path.resolve(dsfs.outDir, dir);
    const regeneratedDirs = config.output.flatMap((o) => (o.type === 'design-tokens' ? [resolveDir(o.dir)] : []));
    const unsafeCleanError = findUnsafeClean({
      dirsToClean,
      configDir: path.dirname(path.resolve(configFilePath)),
      // Existing design tokens that `css` outputs build from. Tokens in a `design-tokens` output's directory
      // are created again in this run, so cleaning them is safe.
      inputDirs: config.output
        .flatMap((o) => (o.type === 'css' && o.tokensDir !== undefined ? [resolveDir(o.tokensDir)] : []))
        .filter((dir) => !regeneratedDirs.includes(dir)),
      // Directories of outputs that keep their existing files, which another output's cleaning must not delete.
      keptDirs: config.output.flatMap((o) => ('cleanDir' in o && o.cleanDir === false ? [resolveDir(o.dir)] : [])),
    });
    if (unsafeCleanError) {
      console.error(pc.redBright(unsafeCleanError));
      process.exit(1);
    }

    for (const dir of dirsToClean) {
      await dsfs.cleanDir(dir);
    }

    for (const output of sortedOutput) {
      const outDir = path.join(dsfs.outDir, output.dir);

      if (output.type === 'design-tokens') {
        console.log(`\n🍱 Creating design tokens in ${pc.green(output.dir)}...`);

        await createDesignTokens({
          themes: requireThemes(config),
          outDir: outDir,
        });
      }

      if (output.type === 'css') {
        console.log(`\n🍱 Creating CSS in ${pc.green(output.dir)}...`);

        // Build CSS from `tokensDir`, or else from the design tokens created by the `design-tokens` output.
        // With neither, there are no design tokens to build from, so CSS is created directly from the themes.
        const tokensDir = output.tokensDir ?? designTokensOutput?.dir;
        // A dry run doesn't write the design tokens this run creates, so they can't be read back from disk.
        // Create the CSS from the themes instead, which gives the same result.
        const tokensNotWritten = dry && tokensDir !== undefined && regeneratedDirs.includes(resolveDir(tokensDir));

        if (tokensDir === undefined || tokensNotWritten) {
          await createCss({
            themes: requireThemes(config),
            outDir: outDir,
            verbose,
            tailwind: output.tailwind,
          });
        } else {
          await buildCss({
            // Resolve the token directory relative to the config file, like output.dir,
            // so it matches where a preceding design-tokens output wrote its files.
            tokensDir: path.join(dsfs.outDir, tokensDir),
            outDir,
            verbose,
            tailwind: output.tailwind,
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
  themes: ConfigSchemaThemes;
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
  tailwind?: TailwindVersion | false;
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
  verbose,
  tailwind,
}: {
  themes: ConfigSchemaThemes;
  outDir: string;
  verbose: boolean;
  tailwind: TailwindVersion | false;
}) {
  const themeNames = Object.keys(themes);
  if (themeNames.length > 0) {
    console.log(`Using themes from config file: ${pc.blue(themeNames.join(', '))}`);
  }

  const files: OutputFile[] = [];

  for (const [name, themeConfig] of Object.entries(themes)) {
    const themeCSSFiles = await formatThemeCSS({ name, ...themeConfig } as Theme, { verbose, tailwind });
    files.push(...themeCSSFiles);
  }

  console.log(`\n💾 Writing CSS to ${pc.green(outDir)}`);

  await dsfs.mkdir(outDir);
  await dsfs.writeFiles(files, outDir, true);

  console.log(`\n✅ Finished creating CSS`);
}

/**
 * Returns an error message when cleaning `dirsToClean` would delete something it shouldn't: the config file,
 * existing design tokens in `inputDirs` that an output builds from, or files in `keptDirs` that an output keeps.
 */
function findUnsafeClean({
  dirsToClean,
  configDir,
  inputDirs,
  keptDirs,
}: {
  dirsToClean: string[];
  configDir: string;
  inputDirs: string[];
  keptDirs: string[];
}): string | undefined {
  const toConfigRelative = (dir: string) => pc.blue(path.relative(configDir, dir) || '.');
  const fix = `Use another ${pc.blue('dir')}, or set ${pc.blue('cleanDir')} to ${pc.blue('false')} for that output.`;

  for (const dir of dirsToClean) {
    if (isSameOrInside(configDir, dir)) {
      return `Output directory ${toConfigRelative(dir)} contains the config file, so cleaning it would delete the config file. ${fix}`;
    }

    const inputDir = inputDirs.find((input) => isSameOrInside(input, dir));
    if (inputDir) {
      return `Output directory ${toConfigRelative(dir)} contains the design tokens in ${toConfigRelative(inputDir)}, so cleaning it would delete them before they are used. ${fix}`;
    }

    const keptDir = keptDirs.find((kept) => isSameOrInside(kept, dir));
    if (keptDir) {
      return `Output directory ${toConfigRelative(dir)} contains ${toConfigRelative(keptDir)}, which has ${pc.blue('cleanDir')} set to ${pc.blue('false')}, so cleaning it would delete files that should be kept. Use separate directories, or the same ${pc.blue('cleanDir')} for both outputs.`;
    }
  }

  return undefined;
}
