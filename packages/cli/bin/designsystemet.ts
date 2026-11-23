#!/usr/bin/env node
import fs from 'node:fs/promises';
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
import { buildTokens, createTypesFromTokens } from '../src/tokens/build.ts';
import { createTokens, getTokenSetDimensions, systemTokenToFiles, tokenSetsToFiles } from '../src/tokens/create.ts';
import { formatThemeCSS } from '../src/tokens/format.ts';
import { generateConfigFromTokens } from '../src/tokens/generate-config.ts';
import { createTypes } from '../src/tokens/process/output/declarations.ts';
import type { TailwindVersion } from '../src/tokens/process/output/tailwind.ts';
import type { OutputFile, Theme } from '../src/tokens/types.ts';
import { type CleanDir, dsfs } from '../src/utils/filesystem.ts';
import {
  entriesIn,
  isReachedThrough,
  isSameLocation,
  isSymlink,
  type LocateCache,
  type Location,
  locate,
} from '../src/utils/paths.ts';
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

    // Sort outputs so that design-tokens are generated first, since CSS and types may be built from the design tokens.
    const outputOrder = { 'design-tokens': 0, css: 1, types: 2 } as const;
    const sortedOutput = R.sortBy((o) => outputOrder[o.type], config.output);
    const designTokensOutput = config.output.find((o) => o.type === 'design-tokens');

    // Outputs created from themes can't run without them. Check this before cleaning, so nothing is deleted when
    // themes are missing. Same rule as below: design tokens, and CSS or types with no design tokens to build from.
    const needsThemes = config.output.some(
      (o) =>
        o.type === 'design-tokens' ||
        ((o.type === 'css' || o.type === 'types') && (o.tokensDir ?? designTokensOutput?.dir) === undefined),
    );
    if (needsThemes) {
      requireThemes(config);
    }

    // Directories are compared by what they are on disk, not by how their paths are written (see `locate`). So
    // `tokens`, `./tokens/`, `Tokens` on a case-insensitive file system, and a path through a symlink all match.
    // Every path in the config is resolved the same way, for checking, cleaning, reading and writing.
    const resolveDir = (dir: string) => path.resolve(dsfs.outDir, dir);
    // Nothing on disk changes until cleaning starts, so each directory is only looked up once until then.
    const lookups: LocateCache = new Map();
    const locateDir = async (dir: string): Promise<LocatedDir> => {
      const resolved = resolveDir(dir);
      return { dir: resolved, location: await locate(resolved, lookups) };
    };
    const regeneratedDirs = await Promise.all(
      config.output.flatMap((o) => (o.type === 'design-tokens' ? [locate(resolveDir(o.dir), lookups)] : [])),
    );
    const isRegenerated = (location: Location) => regeneratedDirs.some((dir) => isSameLocation(dir, location));

    // Clean every output directory once, before any output is created. Cleaning as part of each output would
    // delete what earlier outputs wrote when they share a directory, which makes the outputs depend on their order.
    const cleanedDirs = await Promise.all(config.output.flatMap((o) => (o.cleanDir ? [locateDir(o.dir)] : [])));
    // Existing design tokens that `css` and `types` outputs build from. Tokens in a `design-tokens` output's
    // directory are created again in this run, so cleaning them is safe.
    const inputDirs = (
      await Promise.all(
        config.output.flatMap((o) =>
          (o.type === 'css' || o.type === 'types') && o.tokensDir !== undefined ? [locateDir(o.tokensDir)] : [],
        ),
      )
    ).filter((dir) => !isRegenerated(dir.location));
    // Directories of outputs that keep their existing files, which another output's cleaning must not delete.
    const keptDirs = await Promise.all(config.output.flatMap((o) => (o.cleanDir === false ? [locateDir(o.dir)] : [])));

    // Check every directory before cleaning any, so nothing is deleted when one of them is unsafe.
    const outputDirs = await Promise.all(config.output.map((o) => locateDir(o.dir)));
    const unsafeCleanError = await findUnsafeClean({
      cleanedDirs,
      // As written, since the config file may be reached through symlinks that `path.resolve` would skip.
      configFile: configFilePath,
      inputDirs,
      keptDirs,
      outputDirs,
      lookups,
    });
    if (unsafeCleanError) {
      console.error(pc.redBright(unsafeCleanError));
      process.exit(1);
    }

    // Design tokens and kept outputs inside a cleaned directory, e.g. `designsystemet/design-tokens` inside the
    // `css` output's `designsystemet`, are left alone, and everything else in the directory is deleted. Everything
    // is looked up before anything is deleted, so nothing is deleted when a path can't be looked up.
    const dirsToClean = cleanedDirs.filter(
      (dir, i, dirs) => dirs.findIndex((other) => isSameLocation(other.location, dir.location)) === i,
    );
    const cleaning: CleanDir[] = [];
    for (const { dir, location } of dirsToClean) {
      const keep: string[] = [];
      for (const other of [...inputDirs, ...keptDirs]) {
        if (await isReachedThrough(other.dir, location, lookups)) keep.push(other.dir);
      }
      cleaning.push({ dir, keep });
    }
    await dsfs.cleanDirs(cleaning);

    for (const output of sortedOutput) {
      const outDir = resolveDir(output.dir);

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
        const tokensNotWritten = dry && tokensDir !== undefined && isRegenerated(await locate(resolveDir(tokensDir)));

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
            tokensDir: resolveDir(tokensDir),
            outDir,
            verbose,
            tailwind: output.tailwind,
            types: false,
          });
        }
      }

      if (output.type === 'types') {
        console.log(`\n🍱 Creating type declarations in ${pc.green(output.dir)}...`);

        // Like CSS: build from `tokensDir`, or else from the `design-tokens` output, or else from the themes.
        const tokensDir = output.tokensDir ?? designTokensOutput?.dir;
        // Like CSS: a dry run doesn't write the design tokens this run creates, so create the types from the themes.
        const tokensNotWritten = dry && tokensDir !== undefined && isRegenerated(await locate(resolveDir(tokensDir)));

        // All themes have the same color names (checked during validation), so the first theme is enough.
        const files =
          tokensDir === undefined || tokensNotWritten
            ? createTypes(Object.keys(Object.values(requireThemes(config))[0].colors))
            : await createTypesFromTokens(resolveDir(tokensDir));

        await dsfs.mkdir(outDir);
        await dsfs.writeFiles(files, outDir, true);
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
  const colorNames = Object.keys(themes[themeNames[0]].colors);
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
  types,
}: {
  tokensDir: string;
  outDir: string;
  clean?: boolean;
  verbose?: boolean;
  tailwind?: TailwindVersion | false;
  types?: boolean;
}) {
  if (clean) {
    await dsfs.cleanDir(outDir);
  }

  const files = await buildTokens({
    tokensDir,
    verbose: verbose ?? false,
    tailwind: tailwind ?? false,
    types,
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

/** A directory as an absolute path, and where it is on disk. */
type LocatedDir = { dir: string; location: Location };

/**
 * Returns an error message when cleaning `cleanedDirs` would delete something it shouldn't, before anything is
 * deleted. Design tokens in `inputDirs` that an output builds from, and directories in `keptDirs` that an output
 * keeps, are skipped when a directory they are in is cleaned. So cleaning is unsafe when:
 *
 * - The cleaned directory is a symlink, which would delete files where it points, or a file.
 * - It has the config file, or a symlink on the way to it.
 * - It is one of `inputDirs` or `keptDirs`.
 * - It has a symlink on the way to one of `inputDirs`, `keptDirs` or `outputDirs`. Cleaning deletes symlinks, so the
 *   design tokens would be gone, or the output would be created in another place than where the symlink points.
 *
 * Symlinks are refused rather than handled, so that what cleaning deletes is easy to tell: everything in the
 * directory, except design tokens and kept outputs in it.
 */
async function findUnsafeClean({
  cleanedDirs,
  configFile,
  inputDirs,
  keptDirs,
  outputDirs,
  lookups,
}: {
  cleanedDirs: LocatedDir[];
  configFile: string;
  inputDirs: LocatedDir[];
  keptDirs: LocatedDir[];
  outputDirs: LocatedDir[];
  lookups: LocateCache;
}): Promise<string | undefined> {
  const configDir = path.dirname(path.resolve(configFile));
  const show = (dir: string) => pc.blue(path.relative(configDir, dir) || '.');
  const fix = `Use another ${pc.blue('dir')}, or set ${pc.blue('cleanDir')} to ${pc.blue('false')} for that output.`;
  // A directory that doesn't exist yet has no files to delete.
  const isSameExistingDir = (dir: LocatedDir, location: Location) =>
    dir.location.missing.length === 0 && isSameLocation(dir.location, location);

  for (const { dir, location } of cleanedDirs) {
    if (await isSymlink(dir)) {
      return `Output directory ${show(dir)} is a symlink, so cleaning it would delete the files where it points. Set ${pc.blue('dir')} to the directory it points to, or set ${pc.blue('cleanDir')} to ${pc.blue('false')} for that output.`;
    }
    if (location.missing.length === 0 && !(await fs.stat(dir)).isDirectory()) {
      return `Output directory ${show(dir)} is a file, not a directory. Move or delete the file, or use another ${pc.blue('dir')}.`;
    }

    if (await isReachedThrough(configFile, location, lookups)) {
      return `Output directory ${show(dir)} contains the config file, or a symlink to it, so cleaning it would delete the config file. ${fix}`;
    }

    const inputDir = inputDirs.find((input) => isSameExistingDir(input, location));
    if (inputDir) {
      return `Output directory ${show(dir)} is the ${pc.blue('tokensDir')} ${show(inputDir.dir)} that design tokens are read from, so cleaning it would delete them before they are used. ${fix}`;
    }

    // Checked also before the directory exists, since the config itself is contradictory, not just this run.
    const keptDir = keptDirs.find((kept) => isSameLocation(kept.location, location));
    if (keptDir) {
      const also = keptDir.dir === dir ? '' : ` (${show(keptDir.dir)})`;
      return `Output directory ${show(dir)} is also used${also} by an output with ${pc.blue('cleanDir')} set to ${pc.blue('false')}, so cleaning it would delete files that should be kept. Use separate directories, or the same ${pc.blue('cleanDir')} for both outputs.`;
    }

    // `keptDirs` are output directories too, so they are checked with `outputDirs`.
    for (const other of [...inputDirs, ...outputDirs]) {
      for (const entry of await entriesIn(other.dir, location, lookups)) {
        if (await isSymlink(entry)) {
          const onTheWay = entry === other.dir ? '' : ` on the way to ${show(other.dir)}`;
          return `Output directory ${show(dir)} has the symlink ${show(entry)}${onTheWay}, so cleaning it would delete the symlink. Write the path to where the symlink points, or set ${pc.blue('cleanDir')} to ${pc.blue('false')} for that output.`;
        }
      }
    }
  }

  return undefined;
}
