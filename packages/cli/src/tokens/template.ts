import fs from 'node:fs/promises';
import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import * as R from 'ramda';
import originalColorJson from '../../../../design-tokens/semantic/color.json' with { type: 'json' };
import originalColorCategoryJson from '../../../../design-tokens/semantic/modes/main-color/accent.json' with {
  type: 'json',
};
import originalThemeJson from '../../../../design-tokens/themes/digdir.json' with { type: 'json' };
import { stringify } from './write.js';

const DIRNAME: string = import.meta.dirname || __dirname;

const SOURCE_FILES_PATH = path.join(DIRNAME, '../../../../design-tokens');
const DEFAULT_FILES_PATH = path.join(DIRNAME, './design-tokens/default');
const TEMPLATE_FILES_PATH = path.join(DIRNAME, './design-tokens/template');

const argsFromToPaths = (path_: string): [string, string] => [
  path.join(SOURCE_FILES_PATH, path_),
  path.join(DEFAULT_FILES_PATH, path_),
];

const options = { recursive: true };

const endsWithOneOf = (suffixes: string[], str: string): boolean =>
  R.any((suffix: string) => R.endsWith(suffix, str), suffixes);

export const updateTemplates = async () => {
  // Copy default files
  await fs.cp(...argsFromToPaths('primitives/globals.json'), options);
  await fs.cp(...argsFromToPaths('primitives/modes/size'), options);
  await fs.cp(...argsFromToPaths('primitives/modes/typography/size'), options);
  await fs.cp(...argsFromToPaths('semantic/style.json'), options);

  /*
   * Create template files
   */

  // semantic/modes/<category>-color/<color>.json
  const categoryColorTemplate = originalColorCategoryJson.color.main;
  const categoryDir = path.join(TEMPLATE_FILES_PATH, 'semantic/modes/category-color');
  await fs.mkdir(categoryDir, options);
  await fs.writeFile(
    path.join(categoryDir, 'color-template.json'),
    JSON.stringify(categoryColorTemplate, null, 2).replaceAll('color.accent', 'color.<color>'),
  );

  // semantic/color.json
  const colorBaseFile = {
    ...originalColorJson,
    // Remove custom colors as they are defined from by theme
    color: R.omit(['accent', 'neutral', 'brand1', 'brand2', 'brand3'], originalColorJson.color),
  };
  await fs.writeFile(
    path.join(TEMPLATE_FILES_PATH, `semantic/color-base.json`),
    JSON.stringify(colorBaseFile, null, 2).replaceAll('color.accent', 'color.<accent-color>'),
  );

  const semanticColorTemplate = originalColorJson.color.accent;
  await fs.writeFile(
    path.join(TEMPLATE_FILES_PATH, `semantic/color-template.json`),
    JSON.stringify(semanticColorTemplate, null, 2).replaceAll('color.accent', 'color.<color>'),
  );

  // themes/<theme>.json
  const themeBaseFile = {
    color: {},
    ...R.omit(['color'], originalThemeJson),
  };

  await fs.mkdir(path.join(TEMPLATE_FILES_PATH, 'themes'), options);
  await fs.writeFile(
    path.join(TEMPLATE_FILES_PATH, `themes/theme-base.json`),
    JSON.stringify(themeBaseFile, null, 2).replaceAll('digdir', '<theme>'),
  );

  const themeColorTemplate = originalThemeJson.color.accent;
  await fs.writeFile(
    path.join(TEMPLATE_FILES_PATH, `themes/theme-template.json`),
    JSON.stringify(themeColorTemplate, null, 2).replaceAll('digdir.accent', '<theme>.<color>'),
  );

  // $themes.json
  const themesFile = await fs.readFile(path.join(SOURCE_FILES_PATH, '$themes.json'), 'utf-8');
  const themesTemplate = (JSON.parse(themesFile) as ThemeObject[])
    .filter((themeobj) => {
      // Remove compact size
      if (R.toLower(themeobj.name) === 'compact' && R.toLower(themeobj.group || '') === 'size') {
        return false;
      }

      // Pick theme to use as template
      if (R.toLower(themeobj.name) !== 'digdir' && R.toLower(themeobj.group || '') === 'theme') {
        return false;
      }

      return true;
    })
    .map((themeobj) => {
      if (R.toLower(themeobj.name) === 'digdir') {
        return {
          ...themeobj,
          name: '<theme>',
          selectedTokenSets: {
            'themes/<theme>': 'enabled',
          },
        };
      }
      return themeobj;
    });

  await fs.writeFile(path.join(TEMPLATE_FILES_PATH, `$themes.json`), stringify(themesTemplate));

  // $metadata.json
  const metadataFile = await fs.readFile(path.join(SOURCE_FILES_PATH, '$metadata.json'), 'utf-8');
  const tokenSetOrderTemplate = (JSON.parse(metadataFile) as { tokenSetOrder: string[] }).tokenSetOrder
    .filter((tokenSet) => {
      if (endsWithOneOf(['altinn', 'portal', 'uutilsynet'], tokenSet)) {
        return false;
      }
      return true;
    })
    .map((tokenSet) => {
      if (endsWithOneOf(['digdir'], tokenSet)) {
        return tokenSet.replace('/digdir', '/<theme>');
      }
      return tokenSet;
    });

  await fs.writeFile(
    path.join(TEMPLATE_FILES_PATH, `$metadata.json`),
    stringify({ tokenSetOrder: tokenSetOrderTemplate }),
  );
};

updateTemplates();
