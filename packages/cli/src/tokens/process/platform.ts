import chalk from 'chalk';
import * as R from 'ramda';
import StyleDictionary from 'style-dictionary';
import type { OutputFile, TokenSet } from '../types.js';
import { type BuildConfig, colorCategories, type ThemePermutation } from '../types.js';
import { configs, getConfigsForThemeDimensions } from './configs.js';
import { getCustomColors, type ProcessedThemeObject } from './utils/getMultidimensionalThemes.js';

type SharedOptions = {
  /** Enable verbose output */
  verbose: boolean;
  /** Set the default color for ":root" */
  defaultColor?: string;
  /** Dry run, no files will be written */
  dry?: boolean;
  /** Generate preview tokens */
  preview: boolean;
  /** Token Studio `$themes.json` content */
  processed$themes: ProcessedThemeObject[];
  /** Color groups */
  colorGroups?: string[];
};

export type BuildOptions = {
  type: 'build';
  /** Design tokens path */
  tokensDir: string;
  /** Output directory for built tokens */
  outDir: string;
  /** Tailwind CSS configuration */
  tailwind?: boolean;
} & SharedOptions;

export type FormatOptions = {
  type: 'format';
  /** Tokensets */
  tokenSets: Map<string, TokenSet>;
} & SharedOptions;

type ProcessOptions = BuildOptions | FormatOptions;

type ProcessedBuildConfigs<T> = Record<keyof typeof buildConfigs, T>;

export type ProcessReturn = ProcessedBuildConfigs<BuildResult[]>;

type BuildResult = {
  permutation: ThemePermutation;
  formatted: OutputFile[];
};

const initResult: BuildResult = {
  formatted: [],
  permutation: {
    'color-scheme': '',
    'main-color': '',
    'support-color': '',
    semantic: '',
    size: '',
    theme: '',
    typography: '',
  },
};

export let buildOptions: ProcessOptions | undefined;

const sd = new StyleDictionary();

/*
 * Declarative configuration of the build output
 */
const buildConfigs = {
  typography: { getConfig: configs.typographyVariables, dimensions: ['typography'] },
  'color-scheme': { getConfig: configs.colorSchemeVariables, dimensions: ['color-scheme'] },
  'main-color': { getConfig: configs.mainColorVariables, dimensions: ['main-color'] },
  'support-color': { getConfig: configs.supportColorVariables, dimensions: ['support-color'] },
  'neutral-color': {
    getConfig: configs.neutralColorVariables,
    dimensions: ['semantic'],
    log: ({ permutation: { theme } }) => `${theme} - neutral`,
  },
  'success-color': {
    getConfig: configs.successColorVariables,
    dimensions: ['semantic'],
    log: ({ permutation: { theme } }) => `${theme} - success`,
  },
  'danger-color': {
    getConfig: configs.dangerColorVariables,
    dimensions: ['semantic'],
    log: ({ permutation: { theme } }) => `${theme} - danger`,
  },
  'warning-color': {
    getConfig: configs.warningColorVariables,
    dimensions: ['semantic'],
    log: ({ permutation: { theme } }) => `${theme} - warning`,
  },
  'info-color': {
    getConfig: configs.infoColorVariables,
    dimensions: ['semantic'],
    log: ({ permutation: { theme } }) => `${theme} - info`,
  },
  semantic: { getConfig: configs.semanticVariables, dimensions: ['semantic'] },
  // storefront: {
  //   name: 'Storefront preview tokens',
  //   getConfig: configs.typescriptTokens,
  //   dimensions: ['color-scheme'],
  //   options: { outPath: path.resolve('../../apps/storefront/tokens') },
  //   enabled: () => buildOptions?.preview ?? false,
  // },
} satisfies Record<string, BuildConfig>;

export async function processPlatform(options: ProcessOptions): Promise<ProcessReturn> {
  const { type, processed$themes } = options;
  const platform = 'css';
  const tokenSets = type === 'format' ? options.tokenSets : undefined;
  const tokensDir = type === 'build' ? options.tokensDir : undefined;

  const UNSAFE_DEFAULT_COLOR = process.env.UNSAFE_DEFAULT_COLOR ?? '';
  if (UNSAFE_DEFAULT_COLOR) {
    console.warn(
      chalk.yellow(
        `\n⚠️ UNSAFE_DEFAULT_COLOR is set to ${chalk.blue(UNSAFE_DEFAULT_COLOR)}. This will override the default color.`,
      ),
    );
  }

  const UNSAFE_COLOR_GROUPS = Array.from(process.env.UNSAFE_COLOR_GROUPS?.split(',') ?? []);
  if (UNSAFE_COLOR_GROUPS.length > 0) {
    console.warn(
      chalk.yellow(
        `\n⚠️ UNSAFE_COLOR_GROUPS is set to ${chalk.blue(`[${UNSAFE_COLOR_GROUPS.join(', ')}]`)}. This will override the default color groups.`,
      ),
    );
  }
  const colorGroups =
    UNSAFE_COLOR_GROUPS.length > 0
      ? UNSAFE_COLOR_GROUPS
      : [colorCategories.main, colorCategories.support].map((c) => `${c}-color`);

  /** For sharing build options in other files */
  buildOptions = options;
  buildOptions.defaultColor = UNSAFE_DEFAULT_COLOR;
  buildOptions.colorGroups = colorGroups;

  const filteredProcessed$themes = processed$themes.filter((theme) =>
    R.not(theme.group === 'size' && theme.name !== 'medium'),
  );

  const customColors = getCustomColors(filteredProcessed$themes, colorGroups);

  if (!buildOptions.defaultColor) {
    const firstMainColor = R.head(customColors);
    buildOptions.defaultColor = firstMainColor;
  }

  if (buildOptions.defaultColor) {
    console.log(`\n🎨 Using ${chalk.blue(buildOptions.defaultColor)} as default color`);
  }

  const buildAndSdConfigs = R.map((buildConfig: BuildConfig) => {
    const sdConfigs = getConfigsForThemeDimensions(
      buildConfig.getConfig,
      filteredProcessed$themes,
      buildConfig.dimensions,
      {
        tokensDir,
        tokenSets,
      },
    );

    // Disable build if all sdConfigs dimensions permutation are unknown
    const unknownConfigs = buildConfig.dimensions.map((dimension) =>
      sdConfigs.filter((x) => x.permutation[dimension] === 'unknown'),
    );
    for (const unknowns of unknownConfigs) {
      if (unknowns.length === sdConfigs.length) {
        buildConfig.enabled = () => false;
      }
    }

    return {
      buildConfig,
      sdConfigs,
    };
  }, buildConfigs);

  const processedBuilds: ProcessedBuildConfigs<Array<BuildResult>> = {
    'color-scheme': [initResult],
    'main-color': [initResult],
    'support-color': [initResult],
    'neutral-color': [initResult],
    'success-color': [initResult],
    'danger-color': [initResult],
    'warning-color': [initResult],
    'info-color': [initResult],
    semantic: [initResult],
    typography: [initResult],
  };

  try {
    for (const [buildName, { buildConfig, sdConfigs }] of R.toPairs(buildAndSdConfigs)) {
      if (!(buildConfig.enabled?.() ?? true)) {
        continue;
      }

      if (sdConfigs.length > 0) {
        console.log(`\n🍱 Building ${chalk.green(buildConfig.name ?? buildName)}`);

        const results = await Promise.all(
          sdConfigs.map(async (sdConfig) => {
            const { config, permutation } = sdConfig;

            const modes: Array<keyof ThemePermutation> = ['theme', ...buildConfig.dimensions];
            const modeMessage = modes.map((x) => permutation[x]).join(' - ');
            const logMessage = R.isNil(buildConfig.log) ? modeMessage : buildConfig?.log(sdConfig);
            console.log(logMessage);

            const sdOptions = { cache: true };
            const sdExtended = await sd.extend(config);

            const result: BuildResult = {
              permutation,
              formatted: (await sdExtended.formatPlatform(platform, sdOptions)) as OutputFile[],
            };

            return Promise.resolve(result);
          }),
        );

        processedBuilds[buildName] = results;
      }
    }
  } catch (err) {
    // Fix crash error message from StyleDictionary from
    //   > Use log.verbosity "verbose" or use CLI option --verbose for more details.
    // to
    //   > Use CLI option --verbose for more details.
    if (err instanceof Error) {
      err.message = err.message.replace('log.verbosity "verbose" or use ', '');
    }
    throw err;
  }

  return processedBuilds;
}
