import fs from 'node:fs/promises';
import path from 'node:path';

import type { ThemeObject } from '@tokens-studio/types';
import chalk from 'chalk';
import * as R from 'ramda';
import StyleDictionary from 'style-dictionary';

import { configs, getConfigsForThemeDimensions } from './build/configs.js';
import { type BuildConfig, type ThemePermutation, colorCategories } from './build/types.js';
import { makeEntryFile } from './build/utils/entryfile.js';
import { type ProcessedThemeObject, processThemeObject } from './build/utils/getMultidimensionalThemes.js';
import { cleanDir, copyFile, writeFile } from './utils.js';

type Options = {
  /** Design tokens path */
  tokens: string;
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
};

export let buildOptions: Options | undefined;

const sd = new StyleDictionary();

/*
 * Declarative configuration of the build output
 */
const buildConfigs = {
  typography: { getConfig: configs.typographyVariables, dimensions: ['typography'] },
  'color-scheme': { getConfig: configs.colorSchemeVariables, dimensions: ['color-scheme'] },
  'main-color': { getConfig: configs.mainColorVariables, dimensions: ['main-color'] },
  'support-color': { getConfig: configs.supportColorVariables, dimensions: ['support-color'] },
  semantic: { getConfig: configs.semanticVariables, dimensions: ['semantic'] },
  storefront: {
    name: 'Storefront preview tokens',
    getConfig: configs.typescriptTokens,
    dimensions: ['color-scheme'],
    options: { outPath: path.resolve('../../apps/storefront/tokens') },
    enabled: () => buildOptions?.preview ?? false,
  },
  entryFiles: {
    name: 'CSS entry files',
    getConfig: configs.semanticVariables,
    dimensions: ['semantic'],
    build: async (sdConfigs, { outPath, dry }) => {
      await Promise.all(
        sdConfigs.map(async ({ permutation: { theme } }) => {
          console.log(`👷 ${theme}.css`);

          const builtinColorsFilename = 'builtin-colors.css';
          const builtinColors = path.resolve(import.meta.dirname, 'build', builtinColorsFilename);
          await copyFile(builtinColors, path.resolve(outPath, theme, builtinColorsFilename), dry);

          return makeEntryFile({ theme, outPath, buildPath: path.resolve(outPath, theme), dry });
        }),
      );
    },
  },
} satisfies Record<string, BuildConfig>;

export async function buildTokens(options: Options): Promise<void> {
  const { dry, clean } = options;
  const tokensDir = options.tokens;
  const targetDir = path.resolve(options.outDir);

  /** For sharing build options in other files */
  buildOptions = options;

  /*
   * Build the themes
   */
  const $themes = (
    JSON.parse(await fs.readFile(path.resolve(`${tokensDir}/$themes.json`), 'utf-8')) as ThemeObject[]
  ).map(processThemeObject);

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
          sdConfigs.map(async ({ config, permutation }) => {
            const modes: Array<keyof ThemePermutation> = ['theme', ...buildConfig.dimensions];
            const modeMessage = modes.map((x) => permutation[x]).join(' - ');
            console.log(modeMessage);

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

declare module '@digdir/designsystemet-react/types/colors' {
  export interface MainAndSupportColors {
${mainAndSupportColors.map((color) => `    ${color}: never;`).join('\n')}
  }
}
`.trimStart();

  await writeFile(path.resolve(outPath, colorsFileName), typeDeclaration, dry);
}
