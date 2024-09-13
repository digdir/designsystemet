import fs from 'node:fs/promises';
import path from 'node:path';
// import type { ThemeObject } from '@tokens-studio/types';
// import * as R from 'ramda';
// import { stringify } from './write';

const DIRNAME: string = import.meta.dirname || __dirname;

const SOURCE_FILES_PATH = path.join(DIRNAME, '../../../../design-tokens');
const DEFAULT_FILES_PATH = path.join(DIRNAME, './design-tokens/default');
const TEMPLATE_FILES_PATH = path.join(DIRNAME, './design-tokens/template');

const argsFromToPaths = (path_: string): [string, string] => [
  path.join(SOURCE_FILES_PATH, path_),
  path.join(DEFAULT_FILES_PATH, path_),
];

// const endsWithOneOf = (suffixes: string[], str: string): boolean =>
//   R.any((suffix: string) => R.endsWith(suffix, str), suffixes);

export const updateTemplates = async () => {
  // Copy default files
  await fs.cp(...argsFromToPaths('Figma'), {
    recursive: true,
  });
  await fs.cp(...argsFromToPaths('primitives/globals.json'), {
    recursive: true,
  });
  await fs.cp(...argsFromToPaths('primitives/size/default.json'), {
    recursive: true,
  });
  await fs.cp(...argsFromToPaths('semantic'), {
    recursive: true,
  });

  // TODO save for later use
  // Copy template files
  // const themeFile = await fs.readFile(path.join(SOURCE_FILES_PATH, 'themes/theme.json'), 'utf-8');
  // const themeTemplate = themeFile.replaceAll('theme', '<theme>');
  // await fs.mkdir(path.join(TEMPLATE_FILES_PATH, 'themes'), { recursive: true });
  // await fs.writeFile(path.join(TEMPLATE_FILES_PATH, `themes/theme.json`), themeTemplate);

  // const themesFile = await fs.readFile(path.join(SOURCE_FILES_PATH, '$themes.json'), 'utf-8');
  // const themesTemplate = (JSON.parse(themesFile) as ThemeObject[])
  //   .filter((themeobj) => {
  //     // Remove compact size
  //     if (R.toLower(themeobj.name) === 'compact' && R.toLower(themeobj.group || '') === 'size') {
  //       return false;
  //     }

  //     // Pick theme to use as template
  //     if (R.toLower(themeobj.name) !== 'digdir' && R.toLower(themeobj.group || '') === 'theme') {
  //       return false;
  //     }

  //     return true;
  //   })
  //   .map((themeobj) => {
  //     if (R.toLower(themeobj.name) === 'digdir') {
  //       return {
  //         ...themeobj,
  //         name: '<theme>',
  //         selectedTokenSets: {
  //           'themes/<theme>': 'enabled',
  //         },
  //       };
  //     }
  //     return themeobj;
  //   });

  // await fs.writeFile(path.join(TEMPLATE_FILES_PATH, `$themes.json`), stringify(themesTemplate));

  // const metadataFile = await fs.readFile(path.join(SOURCE_FILES_PATH, '$metadata.json'), 'utf-8');
  // const tokenSetOrderTemplate = (JSON.parse(metadataFile) as { tokenSetOrder: string[] }).tokenSetOrder
  //   .filter((tokenSet) => {
  //     if (endsWithOneOf(['theme2', 'theme3', 'theme4'], tokenSet)) {
  //       return false;
  //     }
  //     return true;
  //   })
  //   .map((tokenSet) => {
  //     if (endsWithOneOf(['theme'], tokenSet)) {
  //       return tokenSet.replace('/theme', '/<theme>');
  //     }
  //     return tokenSet;
  //   });

  // await fs.writeFile(
  //   path.join(TEMPLATE_FILES_PATH, `$metadata.json`),
  //   stringify({ tokenSetOrder: tokenSetOrderTemplate }),
  // );
};

updateTemplates();
