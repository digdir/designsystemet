import fs from 'node:fs/promises';
import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import chalk from 'chalk';
import * as R from 'ramda';
import type { ColorScheme } from '../colors/types.js';
import semanticColorBaseFile from './design-tokens/template/semantic/color-base-file.json' with { type: 'json' };
import customColorTemplate from './design-tokens/template/semantic/modes/category-color/category-color-template.json' with {
  type: 'json',
};
import semanticColorTemplate from './design-tokens/template/semantic/semantic-color-template.json' with {
  type: 'json',
};
import themeBaseFile from './design-tokens/template/themes/theme-base-file.json' with { type: 'json' };
import themeColorTemplate from './design-tokens/template/themes/theme-color-template.json' with { type: 'json' };
import type { Collection, File, Theme, Tokens, TokensSet, TypographyModes } from './types.js';
import { cp, mkdir, writeFile } from './utils.js';
import { generateMetadataJson } from './write/generate$metadata.js';
import { generateThemesJson } from './write/generate$themes.js';

const DIRNAME: string = import.meta.dirname || __dirname;
const DEFAULT_FILES_PATH = path.join(DIRNAME, './design-tokens/default');
const TEMPLATE_FILES_PATH = path.join(DIRNAME, './design-tokens/template/');

export const stringify = (data: unknown) => JSON.stringify(data, null, 2);

const generateColorSchemeFile = (scheme: ColorScheme, name: Collection, tokens: TokensSet, outPath: string): File => {
  const path = `${outPath}/primitives/modes/color-scheme/${scheme}`;
  return {
    data: stringify(tokens),
    path,
    filePath: `${path}/${name}.json`,
  };
};

const generateTypographyFile = (
  folder: TypographyModes,
  name: Collection,
  tokens: TokensSet,
  outPath: string,
): File => {
  const path = `${outPath}/primitives/modes/typography/${folder}`;
  return {
    data: stringify(tokens),
    path,
    filePath: `${path}/${name}.json`,
  };
};

type WriteTokensOptions = {
  outDir: string;
  tokens: Tokens;
  theme: Theme;
  /** Dry run, no files will be written */
  dry?: boolean;
};

export const writeTokens = async (options: WriteTokensOptions) => {
  const {
    outDir,
    tokens,
    theme: { name: themeName, colors, borderRadius },
    dry,
  } = options;
  const targetDir = path.resolve(process.cwd(), String(outDir));
  const $themesPath = path.join(targetDir, '$themes.json');
  const $metadataPath = path.join(targetDir, '$metadata.json');
  let themes = [themeName];

  await mkdir(targetDir, dry);

  try {
    // Update with existing themes
    const $themes = await fs.readFile($themesPath, 'utf-8');
    const themeObjects = (JSON.parse($themes) as ThemeObject[]) || [];
    themes = R.pipe(
      R.filter((obj: ThemeObject) => R.toLower(obj.group || '') === 'theme'),
      R.map(R.prop('name')),
      R.append(themeName),
      R.uniq,
    )(themeObjects) as string[];
  } catch (error) {}

  console.log(`Themes: ${chalk.blue(themes.join(', '))}`);

  // Create metadata and themes json for Token Studio and build script
  const $theme = generateThemesJson(['dark', 'light'], themes, colors);
  const $metadata = generateMetadataJson(['dark', 'light'], themes, colors);

  await writeFile($themesPath, stringify($theme), dry);
  await writeFile($metadataPath, stringify($metadata), dry);

  // Copy default files
  await cp(DEFAULT_FILES_PATH, targetDir, dry);

  /*
   * Colors
   */

  const mainColorNames = Object.keys(colors.main);
  const supportColorNames = Object.keys(colors.support);
  const customColors = [...mainColorNames, 'neutral', ...supportColorNames];
  const defaultAccentColor = mainColorNames[0];

  // Create main-color and support-color modes for the custom colors
  for (const [colorCategory, colorNames] of [
    ['main', mainColorNames],
    ['support', supportColorNames],
  ] as const) {
    const colorCategoryPath = path.join(targetDir, 'semantic', 'modes', `${colorCategory}-color`);
    await mkdir(colorCategoryPath, dry);

    for (const colorName of colorNames) {
      const customColorFile = {
        color: {
          [colorCategory]: customColorTemplate,
        },
      };

      await writeFile(
        path.join(colorCategoryPath, `${colorName}.json`),
        JSON.stringify(
          customColorFile,
          (key, value) => {
            if (key === '$value') {
              return (value as string).replace('<color>', colorName);
            }
            return value;
          },
          2,
        ),
        dry,
      );
    }
  }

  // Create semantic colors file
  const semanticColorTokens = customColors.map(
    (colorName) =>
      [
        colorName,
        R.map((x) => ({ ...x, $value: x.$value.replace('<color>', colorName) }), semanticColorTemplate),
      ] as const,
  );

  const semanticColors = {
    ...semanticColorBaseFile,
    color: {
      ...Object.fromEntries(semanticColorTokens),
      ...semanticColorBaseFile.color,
    },
  };
  await writeFile(
    path.join(targetDir, `semantic/color.json`),
    JSON.stringify(
      semanticColors,
      (key, value) => {
        if (key === '$value') {
          return (value as string).replace('<accent-color>', defaultAccentColor);
        }
        return value;
      },
      2,
    ),
    dry,
  );

  // Create themes file
  await mkdir(path.join(targetDir, 'themes'), dry);

  const themeColorTokens = Object.fromEntries(
    customColors.map(
      (colorName) =>
        [
          colorName,
          R.map((x) => ({ ...x, $value: x.$value.replace('<color>', colorName) }), themeColorTemplate),
        ] as const,
    ),
  );

  const { color: themeBaseFileColor, ...remainingThemeFile } = themeBaseFile;
  const themeFile = {
    color: {
      ...themeColorTokens,
      ...themeBaseFileColor,
    },
    ...remainingThemeFile,
  };

  const baseBorderRadius = R.lensPath(['border-radius', 'base', '$value']);
  const updatedThemeFile = R.set(baseBorderRadius, String(borderRadius), themeFile);

  await writeFile(
    path.join(targetDir, `themes/${themeName}.json`),
    JSON.stringify(
      updatedThemeFile,
      (key, value) => {
        if (key === '$value') {
          return (value as string).replace('<theme>', themeName);
        }

        return value;
      },
      2,
    ),
    dry,
  );

  // Create color scheme and typography modes
  const files: File[] = [
    generateColorSchemeFile('light', themeName, tokens.colors.light[themeName], targetDir),
    generateColorSchemeFile('light', 'global', tokens.colors.light.global, targetDir),
    generateColorSchemeFile('dark', themeName, tokens.colors.dark[themeName], targetDir),
    generateColorSchemeFile('dark', 'global', tokens.colors.dark.global, targetDir),
    // generateColorSchemeFile('contrast', themeName, tokens.colors.contrast[themeName], targetDir),
    // generateColorSchemeFile('contrast', 'global', tokens.colors.contrast.global, targetDir),
    generateTypographyFile('primary', themeName, tokens.typography.primary, targetDir),
    generateTypographyFile('secondary', themeName, tokens.typography.primary, targetDir),
  ];

  for (const file of files) {
    const dirPath = path.resolve(file.path);
    const filePath = path.resolve(file.filePath);
    await mkdir(dirPath, dry);
    await writeFile(filePath, file.data, dry);
  }

  console.log(
    `Finished creating Designsystem design tokens in ${chalk.green(outDir)} for theme ${chalk.blue(themeName)}`,
  );
};
