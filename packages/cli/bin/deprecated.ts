import { createCommand } from '@commander-js/extra-typings';
import pc from 'picocolors';
import { checkAutomigrate } from '../src/automigrate.ts';
import { convertToHex } from '../src/colors/index.ts';
import type { CssColor } from '../src/colors/types.ts';
import type { ConfigSchema } from '../src/schemas/schema.ts';
import { dsfs } from '../src/utils/filesystem.ts';
import { deprecatedCLIOptions as cliOptions, getConfigFile, parseValidateAndOptsConfig } from './config.ts';
import { configOption, dryOption, parseBoolean, verboseOption } from './options.ts';

export const DEFAULT_TOKENS_CREATE_DIR = './design-tokens';
const DEFAULT_TOKENS_BUILD_DIR = './design-tokens-build';
const DEFAULT_FONT = 'Inter';
const DEFAULT_THEME_NAME = 'theme';

type TokenCommandDeps = {
  createDesignTokens: (options: { themes: ConfigSchema['themes']; outDir: string; clean?: boolean }) => Promise<void>;
  buildCss: (options: {
    tokensDir: string;
    outDir: string;
    clean?: boolean;
    verbose?: boolean;
    tailwind?: boolean;
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
    .description('[deprecated] Create Designsystemet tokens')
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

      const config = await parseValidateAndOptsConfig(updatedConfigFile || configFile, {
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

function parseColorValues(value: string, previous: Record<string, CssColor> = {}): Record<string, CssColor> {
  const [name, hex] = value.split(':');
  previous[name] = convertToHex(hex);
  return previous;
}
