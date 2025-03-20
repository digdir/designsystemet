import path from 'node:path';

import type { ThemeObject } from '@tokens-studio/types';
import chalk from 'chalk';
import * as R from 'ramda';
import StyleDictionary from 'style-dictionary';

import { cleanDir, readFile, writeFile } from '../utils.js';
import { configs, getConfigsForThemeDimensions } from './build/configs.js';
import {
  type BuildConfig,
  type SDConfigForThemePermutation,
  type ThemePermutation,
  colorCategories,
} from './build/types.js';
import { concatFiles } from './build/utils/entryfile.js';
import { type ProcessedThemeObject, processThemeObject } from './build/utils/getMultidimensionalThemes.js';
import type { TokensSet } from './types.js';

type BuildOptions = {
  /** Design tokens path */
  tokensDir: string;
  /** Output directory for built tokens */
  outDir: string;
  /** Generate preview tokens */
  preview: boolean;
  /** Enable verbose output */
  verbose: boolean;
  /** Set the default color for ":root" */
  rootColor?: string;
  /** Dry run, no files will be written */
  dry?: boolean;
  /** Clean the output path before building tokens */
  clean?: boolean;
  /** Tokensets */
  tokenSets?: Map<string, TokensSet>;
};

export let buildOptions: BuildOptions | undefined;

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
  storefront: {
    name: 'Storefront preview tokens',
    getConfig: configs.typescriptTokens,
    dimensions: ['color-scheme'],
    options: { outPath: path.resolve('../../apps/storefront/tokens') },
    enabled: () => buildOptions?.preview ?? false,
  },
  entryFiles: {
    name: 'Concatenated CSS file',
    getConfig: configs.semanticVariables,
    dimensions: ['semantic'],
    log: ({ permutation: { theme } }: SDConfigForThemePermutation) => `${theme}.css`,
    build: async (sdConfigs, { outPath, dry }) => {
      await Promise.all(
        sdConfigs.map(async ({ permutation: { theme } }) => {
          return concatFiles({ theme, outPath, buildPath: path.resolve(outPath, theme), dry });
        }),
      );
    },
  },
} satisfies Record<string, BuildConfig>;

export async function buildTokens(options: BuildOptions): Promise<void> {
  const { dry, clean } = options;
  const tokensDir = options.tokensDir;
  const targetDir = path.resolve(options.outDir);

  /** For sharing build options in other files */
  buildOptions = options;

  /*
   * Build the themes
   */
  const $themes = (JSON.parse(await readFile(path.resolve(`${tokensDir}/$themes.json`))) as ThemeObject[]).map(
    processThemeObject,
  );

  const relevant$themes = $themes
    // We only use the 'medium' theme for the 'size' group
    .filter((theme) => R.not(theme.group === 'size' && theme.name !== 'medium'));

  if (!buildOptions.rootColor) {
    const firstMainColor = relevant$themes.find((theme) => theme.group === 'main-color');
    buildOptions.rootColor = firstMainColor?.name;
    console.log(`Using first main color; ${chalk.blue(firstMainColor?.name)}, as ${chalk.green(`":root"`)} color`);
  }

  const buildAndSdConfigs = R.map((buildConfig: BuildConfig) => {
    const sdConfigs = getConfigsForThemeDimensions(buildConfig.getConfig, relevant$themes, buildConfig.dimensions, {
      outPath: targetDir,
      tokensDir,
      tokenSets: options.tokenSets,
      ...buildConfig.options,
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

  if (clean) {
    await cleanDir(targetDir, dry);
  }

  try {
    for (const [key, { buildConfig, sdConfigs }] of R.toPairs(buildAndSdConfigs)) {
      if (!(buildConfig.enabled?.() ?? true)) {
        continue;
      }
      if (sdConfigs.length > 0) {
        console.log(`\n🍱 Building ${chalk.green(buildConfig.name ?? key)}`);

        if (buildConfig.build) {
          await buildConfig.build(sdConfigs, { outPath: targetDir, tokensDir, ...buildConfig.options, dry });
        }

        await Promise.all(
          sdConfigs.map(async (sdConfig) => {
            const { config, permutation } = sdConfig;
            const modes: Array<keyof ThemePermutation> = ['theme', ...buildConfig.dimensions];
            const modeMessage = modes.map((x) => permutation[x]).join(' - ');
            const logMessage = R.isNil(buildConfig.log) ? modeMessage : buildConfig?.log(sdConfig);
            console.log(logMessage);

            if (!dry) {
              return (await sd.extend(config)).buildAllPlatforms();
            }

            return Promise.resolve();
          }),
        );
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

  await writeColorTypeDeclaration($themes, targetDir, dry);
}

async function writeColorTypeDeclaration($themes: ProcessedThemeObject[], outPath: string, dry?: boolean) {
  const colorsFileName = 'colors.d.ts';
  console.log(`\n🍱 Building ${chalk.green('type declarations')}`);
  console.log(colorsFileName);
  const mainAndSupportColors = $themes
    .filter(
      (x) => x.group && [colorCategories.main, colorCategories.support].map((c) => `${c}-color`).includes(x.group),
    )
    .map((x) => x.name);
  const typeDeclaration = `
import type {} from '@digdir/designsystemet-react/colors';

declare module '@digdir/designsystemet-react/colors' {
  export interface MainAndSupportColors {
${mainAndSupportColors.map((color) => `    ${color}: never;`).join('\n')}
  }
}
`.trimStart();

  await writeFile(path.resolve(outPath, colorsFileName), typeDeclaration, dry);
}
