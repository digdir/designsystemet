import { createCommand } from '@commander-js/extra-typings';
import pc from 'picocolors';
import { checkAutomigrate } from '../src/automigrate.ts';
import { automigrations } from '../src/migrations/index.ts';
import { legacyBuildDir } from '../src/migrations/new-output-field.ts';
import type { ConfigSchemaThemes } from '../src/schemas/schema.ts';
import type { TailwindVersion } from '../src/tokens/process/output/tailwind.ts';
import { dsfs } from '../src/utils/filesystem.ts';
import { getConfigFile, parseValidateAndOptsConfig, requireThemes } from './config.ts';
import { configOption, dryOption, parseBoolean, verboseOption } from './options.ts';

export const DEFAULT_TOKENS_CREATE_DIR = './design-tokens';
const DEFAULT_TOKENS_BUILD_DIR = legacyBuildDir;

type TokenCommandDeps = {
  createDesignTokens: (options: { themes: ConfigSchemaThemes; outDir: string; clean?: boolean }) => Promise<void>;
  buildCss: (options: {
    tokensDir: string;
    outDir: string;
    clean?: boolean;
    verbose?: boolean;
    tailwind?: TailwindVersion | false;
  }) => Promise<void>;
};

/**
 * @deprecated Use `designsystemet` with a config file instead.
 */
export function makeTokenCommands({ createDesignTokens, buildCss }: TokenCommandDeps) {
  const tokenCmd = createCommand('tokens');

  tokenCmd
    .description(`[deprecated] use ${pc.blue('designsystemet')} with a config file instead`)
    .hook('preAction', () => {
      console.warn(
        pc.yellow(`\n ⚠️  The ${pc.bold('tokens')} commands are deprecated and will be removed in a future release.
           \n ⚠️  Please run ${pc.bold('designsystemet')} with a config file instead.`),
      );
    });

  tokenCmd
    .command('build')
    .description('[deprecated] Build Designsystemet tokens')
    .option('-t, --tokens <string>', `Path to ${pc.blue('design-tokens')}`, DEFAULT_TOKENS_CREATE_DIR)
    .option(
      '-o, --out-dir <string>',
      `Output directory for built ${pc.blue('design-tokens')}`,
      DEFAULT_TOKENS_BUILD_DIR,
    )
    .option('--clean [boolean]', 'Clean output directory before building tokens', parseBoolean, false)
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
        // Tailwind v3 is the only version the deprecated flag has ever generated
        tailwind: experimentalTailwind && 'v3',
      });
    });

  tokenCmd
    .command('create')
    .description('[deprecated] Create Designsystemet tokens')
    .addOption(configOption())
    .option('--clean [boolean]', 'Clean output directory before creating tokens', parseBoolean, false)
    .addOption(dryOption(`Dry run for created ${pc.blue('design-tokens')}`))
    .option('--skip-check', 'Skip migration check', false) // TODO -- will be moved to global option in the future, since it applies to all commands, not just create
    .option('-y, --yes', 'Skip user prompts', false) // TODO -- will be moved to global option in the future, since it applies to all commands, not just create
    .option(
      '-o, --out-dir <string>',
      `Output directory for created ${pc.blue('design-tokens')}`,
      DEFAULT_TOKENS_CREATE_DIR,
    )
    .action(async (opts, cmd) => {
      if (opts.dry) {
        console.log(`Performing dry run, no files will be written`);
      }

      const { configFile, configFilePath } = await getConfigFile(opts.config);

      if (!opts.skipCheck && usesDeprecatedOutputFields(configFile)) {
        console.warn(
          pc.yellow(
            `\n${pc.bold('outDir')} and ${pc.bold('clean')} are deprecated. Run ${pc.blue('designsystemet')} to migrate your config file to ${pc.bold('output')}.\n`,
          ),
        );
      }

      const updatedConfigFile = opts.skipCheck
        ? configFile
        : await checkAutomigrate(configFile, configFilePath, opts.yes, {
            // `tokens create` only reads `outDir` and `clean`, so migrating them to `output` would make it ignore them.
            exclude: ['newOutputField'],
          });

      const config = await parseValidateAndOptsConfig(updatedConfigFile || configFile, {
        cmd,
        configFilePath,
      });

      dsfs.init({ dry: opts.dry, outdir: config.outDir });

      await createDesignTokens({
        themes: requireThemes(config),
        outDir: dsfs.outDir,
        clean: config.clean,
      });
    });

  return tokenCmd;
}

/**
 * Whether the config file uses the deprecated `outDir` or `clean` fields. False without a config file, and for a
 * config file that can't be parsed, which is reported when the config is validated.
 */
function usesDeprecatedOutputFields(configFile: string): boolean {
  if (!configFile) {
    return false;
  }

  try {
    return automigrations.newOutputField.check(configFile);
  } catch {
    return false;
  }
}
