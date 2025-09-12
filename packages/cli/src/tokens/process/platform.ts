import pc from 'picocolors';
import * as R from 'ramda';
import StyleDictionary from 'style-dictionary';
import type { TransformedToken } from 'style-dictionary/types';
import type { OutputFile, TokenSet } from '../types.js';
import { type BuildConfig, colorCategories, type ThemePermutation } from '../types.js';
import { configs, getConfigsForThemeDimensions } from './configs.js';
import { getCustomColors, type ProcessedThemeObject } from './utils/getMultidimensionalThemes.js';

type SharedOptions = {
  /** Enable verbose output */
  verbose: boolean;
  /** Set the default color for ":root" */
  defaultColor?: string;
  /** Set the default size mode */
  defaultSize?: string;
  /** Set the available size modes */
  sizeModes?: string[];
  /** Dry run, no files will be written */
  dry?: boolean;
  /** Token Studio `$themes.json` content */
  processed$themes: ProcessedThemeObject[];
  /** Color groups */
  colorGroups?: string[];
  /** Build token format map */
  buildTokenFormats: Record<string, { token: TransformedToken; formatted: string }[]>;
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

export type ProcessOptions = BuildOptions | FormatOptions;

type ProcessedBuildConfigs<T> = Record<keyof typeof buildConfigs, T>;

export type ProcessReturn = ProcessedBuildConfigs<BuildResult[]>;

type BuildResult = {
  permutation: ThemePermutation;
  formatted: OutputFile[];
  tokens: TransformedToken[];
};

const initResult: BuildResult = {
  formatted: [],
  tokens: [],
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

export let buildOptions: SharedOptions = {
  verbose: false,
  processed$themes: [],
  buildTokenFormats: {},
};

const sd = new StyleDictionary();

/*
 * Declarative configuration of the build output
 */
const buildConfigs = {
  typography: { getConfig: configs.typographyVariables, dimensions: ['typography'] },
  sizeMode: { getConfig: configs.sizeModeVariables, dimensions: ['size'] },
  size: { getConfig: configs.sizeVariables, dimensions: ['semantic'] },
  typeScale: { getConfig: configs.typeScaleVariables, dimensions: ['semantic'] },
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
} satisfies Record<string, BuildConfig>;

export async function processPlatform(options: ProcessOptions): Promise<ProcessReturn> {
  const { type, processed$themes } = options;
  const platform = 'css';
  const tokenSets = type === 'format' ? options.tokenSets : undefined;
  const tokensDir = type === 'build' ? options.tokensDir : undefined;

  const UNSAFE_DEFAULT_COLOR = process.env.UNSAFE_DEFAULT_COLOR ?? '';
  if (UNSAFE_DEFAULT_COLOR) {
    console.warn(
      pc.yellow(
        `\n⚠️ UNSAFE_DEFAULT_COLOR is set to ${pc.blue(UNSAFE_DEFAULT_COLOR)}. This will override the default color.`,
      ),
    );
  }

  const UNSAFE_COLOR_GROUPS = Array.from(process.env.UNSAFE_COLOR_GROUPS?.split(',') ?? []);
  if (UNSAFE_COLOR_GROUPS.length > 0) {
    console.warn(
      pc.yellow(
        `\n⚠️ UNSAFE_COLOR_GROUPS is set to ${pc.blue(`[${UNSAFE_COLOR_GROUPS.join(', ')}]`)}. This will override the default color groups.`,
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

  if (!buildOptions.defaultColor) {
    const customColors = getCustomColors(processed$themes, colorGroups);
    const firstMainColor = R.head(customColors);
    buildOptions.defaultColor = firstMainColor;
  }

  if (buildOptions.defaultColor) {
    console.log(`\n🎨 Using ${pc.blue(buildOptions.defaultColor)} as default color`);
  }

  const sizeModes = processed$themes.filter((x) => x.group === 'size').map((x) => x.name);
  buildOptions.sizeModes = sizeModes;
  if (!buildOptions.defaultSize) {
    const defaultSize = R.head(sizeModes);
    buildOptions.defaultSize = defaultSize;
  }
  if (buildOptions.defaultSize) {
    console.log(`\n📏 Using ${pc.blue(buildOptions.defaultSize)} as default size`);
  }

  const buildAndSdConfigs = R.map((buildConfig: BuildConfig) => {
    const sdConfigs = getConfigsForThemeDimensions(buildConfig.getConfig, processed$themes, buildConfig.dimensions, {
      tokensDir,
      tokenSets,
    });

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
    sizeMode: [initResult],
    size: [initResult],
    typeScale: [initResult],
  };

  try {
    for (const [buildName, { buildConfig, sdConfigs }] of R.toPairs(buildAndSdConfigs)) {
      if (!(buildConfig.enabled?.() ?? true)) {
        continue;
      }

      if (sdConfigs.length > 0) {
        console.log(`\n🍱 Building ${pc.green(buildConfig.name ?? buildName)}`);

        const results = await Promise.all(
          sdConfigs.map(async (sdConfig) => {
            const { config, permutation } = sdConfig;

            const modes: Array<keyof ThemePermutation> = ['theme', ...buildConfig.dimensions];
            const modeMessage = modes.map((x) => permutation[x]).join(' - ');
            const logMessage = R.isNil(buildConfig.log) ? modeMessage : buildConfig?.log(sdConfig);
            console.log(logMessage);

            const sdOptions = { cache: true };
            const sdExtended = await sd.extend(config);
            const formatted = await sdExtended.formatPlatform(platform, sdOptions);
            const tokens = (await sdExtended.getPlatformTokens(platform, sdOptions)).allTokens;

            const result: BuildResult = {
              permutation,
              formatted: formatted as OutputFile[],
              tokens,
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
