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

export const DEFAULT_COLOR = 'accent';

type Options = {
  /** Design tokens path */
  tokens: string;
  /** Output directory for built tokens */
  out: string;
  /** Generate preview tokens */
  preview: boolean;
  /** Enable verbose output */
  verbose: boolean;
  /** Set the default "accent" color, if not overridden with data-color */
  accentColor?: string;
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
    build: async (sdConfigs, { outPath }) => {
      await Promise.all(
        sdConfigs.map(async ({ permutation: { theme } }) => {
          console.log(`👷 ${theme}.css`);

          const builtinColorsFilename = 'builtin-colors.css';
          const builtinColors = path.resolve(import.meta.dirname, 'build', builtinColorsFilename);
          await fs.copyFile(builtinColors, path.resolve(outPath, theme, builtinColorsFilename));

          return makeEntryFile({ theme, outPath, buildPath: path.resolve(outPath, theme) });
        }),
      );
    },
  },
} satisfies Record<string, BuildConfig>;

export async function buildTokens(options: Options): Promise<void> {
  buildOptions = options;
  const tokensDir = options.tokens;
  const outPath = path.resolve(options.out);

  /*
   * Build the themes
   */
  const $themes = (
    JSON.parse(await fs.readFile(path.resolve(`${tokensDir}/$themes.json`), 'utf-8')) as ThemeObject[]
  ).map(processThemeObject);

  const relevant$themes = $themes
    // We only use the 'default' theme for the 'size' group
    .filter((theme) => R.not(theme.group === 'size' && theme.name !== 'default'));

  if (!buildOptions.accentColor) {
    const accentOrFirstMainColor =
      relevant$themes.find((theme) => theme.name === DEFAULT_COLOR) ||
      relevant$themes.find((theme) => theme.group === 'main-color');
    buildOptions.accentColor = accentOrFirstMainColor?.name;
  }

  if (buildOptions.accentColor !== DEFAULT_COLOR) {
    console.log('accent color:', buildOptions.accentColor);
  }

  const buildAndSdConfigs = R.map(
    (val: BuildConfig) => ({
      buildConfig: val,
      sdConfigs: getConfigsForThemeDimensions(val.getConfig, relevant$themes, val.dimensions, {
        outPath,
        tokensDir,
        ...val.options,
      }),
    }),
    buildConfigs,
  );

  try {
    for (const [key, { buildConfig, sdConfigs }] of R.toPairs(buildAndSdConfigs)) {
      if (!(buildConfig.enabled?.() ?? true)) {
        continue;
      }
      if (sdConfigs.length > 0) {
        console.log(`\n🍱 Building ${chalk.green(buildConfig.name ?? key)}`);

        if (buildConfig.build) {
          await buildConfig.build(sdConfigs, { outPath, tokensDir, ...buildConfig.options });
        }
        await Promise.all(
          sdConfigs.map(async ({ config, permutation }) => {
            const modes: Array<keyof ThemePermutation> = ['theme', ...buildConfig.dimensions];
            const modeMessage = modes.map((x) => permutation[x]).join(' - ');
            console.log(modeMessage);

            return (await sd.extend(config)).buildAllPlatforms();
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

  await writeColorTypeDeclaration($themes, outPath);
}

async function writeColorTypeDeclaration($themes: ProcessedThemeObject[], outPath: string) {
  const colorsFileName = 'colors.d.ts';
  console.log(`\n🍱 Building ${chalk.green('type declarations')}`);
  console.log(colorsFileName);
  const mainAndSupportColors = $themes
    .filter(
      (x) => x.group && [colorCategories.main, colorCategories.support].map((c) => `${c}-color`).includes(x.group),
    )
    .map((x) => x.name);
  const typeDeclaration = `
import type { MainAndSupportColors as BaseCustomColors } from '@digdir/designsystemet-react/colors';

declare module '@digdir/designsystemet-react/colors' {
  export interface MainAndSupportColors extends BaseCustomColors {
${mainAndSupportColors.map((color) => `    ${color}: never;`).join('\n')}
  }
}
`.trimStart();
  await fs.writeFile(path.resolve(outPath, colorsFileName), typeDeclaration, 'utf-8');
}
