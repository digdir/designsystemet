import type { ThemeObject } from '@tokens-studio/types';
import chalk from 'chalk';
import * as R from 'ramda';
import StyleDictionary from 'style-dictionary';
import type { OutputFile, TokenSet } from '../types.js';
import { type BuildConfig, type ThemePermutation, colorCategories } from '../types.js';
import { configs, getConfigsForThemeDimensions } from './configs.js';
import { type ProcessedThemeObject, processThemeObject } from './utils/getMultidimensionalThemes.js';

type SharedOptions = {
  /** Enable verbose output */
  verbose: boolean;
  /** Set the default color for ":root" */
  rootColor?: string;
  /** Dry run, no files will be written */
  dry?: boolean;
  /** Clean the output path before building tokens */
  clean?: boolean;
  /** Generate preview tokens */
  preview: boolean;
  /** Token Studio `$themes.json` content */
  $themes: ThemeObject[];
};

export type BuildOptions = {
  process: 'build';
  /** Design tokens path */
  tokensDir: string;
  /** Output directory for built tokens */
  outDir: string;
} & SharedOptions;

export type FormatOptions = {
  process: 'format';
  /** Tokensets */
  tokenSets: Map<string, TokenSet>;
} & SharedOptions;

type ProcessOptions = BuildOptions | FormatOptions;

type ProcessedBuildConfigs<T> = Record<keyof typeof buildConfigs | 'types', T>;

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

const getCustomColors = (processed$themes: ProcessedThemeObject[]) =>
  processed$themes
    .filter(
      (x) => x.group && [colorCategories.main, colorCategories.support].map((c) => `${c}-color`).includes(x.group),
    )
    .map((x) => x.name);

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

export async function processPlatform<T>(options: ProcessOptions): Promise<ProcessReturn> {
  const { process, $themes } = options;
  const platform = 'css';
  const tokenSets = process === 'format' ? options.tokenSets : undefined;
  const tokensDir = process === 'build' ? options.tokensDir : undefined;

  /** For sharing build options in other files */
  buildOptions = options;

  const processed$themes = $themes
    .map(processThemeObject)
    .filter((theme) => R.not(theme.group === 'size' && theme.name !== 'medium'));

  const customColors = getCustomColors(processed$themes);

  if (!buildOptions.rootColor) {
    const firstMainColor = R.head(customColors);
    buildOptions.rootColor = firstMainColor;
    console.log(`Using first main color; ${chalk.blue(firstMainColor)}, as ${chalk.green(`":root"`)} color`);
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
    types: [initResult],
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

  const colorsFileName = 'colors.d.ts';
  const reactColorTypes = await createColorTypeDeclaration(customColors);

  processedBuilds.types = [
    {
      ...initResult,
      formatted: [{ output: reactColorTypes, destination: colorsFileName }] as unknown as OutputFile[],
    },
  ];

  return processedBuilds;
}

async function createColorTypeDeclaration(colors: string[]) {
  console.log(`\n🍱 Building ${chalk.green('type declarations')}`);

  const typeDeclaration = `
import type {} from '@digdir/designsystemet-react/colors';

declare module '@digdir/designsystemet-react/colors' {
  export interface MainAndSupportColors {
${colors.map((color) => `    ${color}: never;`).join('\n')}
  }
}
`.trimStart();

  return typeDeclaration;
}
