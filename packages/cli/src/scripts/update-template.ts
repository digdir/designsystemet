import path from 'node:path';
import chalk from 'chalk';
import * as R from 'ramda';
import digdirTypographyJson from '../../../../design-tokens/primitives/modes/typography/primary/digdir.json' with {
  type: 'json',
};
import semanticColorJson from '../../../../design-tokens/semantic/color.json' with { type: 'json' };
import accentColorCategoryJson from '../../../../design-tokens/semantic/modes/main-color/accent.json' with {
  type: 'json',
};
import digdirThemeJson from '../../../../design-tokens/themes/digdir.json' with { type: 'json' };
import { cleanDir, cp, mkdir, writeFile } from '../utils.js';

const DIRNAME: string = import.meta.dirname || __dirname;

const SOURCE_FILES_PATH = path.join(DIRNAME, '../../../../design-tokens');
const TEMPLATE_FILES_PATH = path.join(DIRNAME, '../tokens/template/design-tokens');

const argsFromToPaths = (path_: string): [string, string] => [
  path.join(SOURCE_FILES_PATH, path_),
  path.join(TEMPLATE_FILES_PATH, path_),
];

export const updateTemplates = async () => {
  // Clean template files
  await cleanDir(TEMPLATE_FILES_PATH);

  // Copy default files
  await cp(...argsFromToPaths('primitives/globals.json'));
  await cp(...argsFromToPaths('primitives/modes/size'));
  await cp(...argsFromToPaths('primitives/modes/typography/size'));
  await cp(...argsFromToPaths('semantic/style.json'));

  /*
   * Create template files
   */

  // primitives/modes/typeography/<theme>.json
  const typographyTemplate = R.set(
    R.lensPath(['digdir', 'font-family', '$value']),
    '<font-family>',
    digdirTypographyJson,
  );
  const typographyDir = path.join(TEMPLATE_FILES_PATH, 'primitives/modes/typography/');
  await mkdir(typographyDir);
  await writeFile(
    path.join(typographyDir, 'typography.template.json'),
    JSON.stringify(typographyTemplate, null, 2).replaceAll('digdir', '<theme>'),
  );

  // semantic/modes/<category>-color/<color>.json
  const categoryColorTemplate = accentColorCategoryJson.color.main;
  const categoryDir = path.join(TEMPLATE_FILES_PATH, 'semantic/modes');
  await mkdir(categoryDir);
  await writeFile(
    path.join(categoryDir, 'color.template.json'),
    JSON.stringify(categoryColorTemplate, null, 2).replaceAll('color.accent', 'color.<color>'),
  );

  // semantic/color.json
  const colorBaseFile = {
    ...semanticColorJson,
    // Remove custom colors as they are defined from by theme
    color: R.omit(['accent', 'neutral', 'brand1', 'brand2', 'brand3'], semanticColorJson.color),
  };
  await writeFile(
    path.join(TEMPLATE_FILES_PATH, `semantic/color.base-template.json`),
    JSON.stringify(colorBaseFile, null, 2),
  );

  const semanticColorTemplate = semanticColorJson.color.accent;
  await writeFile(
    path.join(TEMPLATE_FILES_PATH, `semantic/color.template.json`),
    JSON.stringify(semanticColorTemplate, null, 2).replaceAll('color.accent', 'color.<color>'),
  );

  // themes/<theme>.json
  const themeBaseFile = {
    color: {},
    ...R.omit(['color'], digdirThemeJson),
  };

  await mkdir(path.join(TEMPLATE_FILES_PATH, 'themes'));
  await writeFile(
    path.join(TEMPLATE_FILES_PATH, `themes/theme.base-template.json`),
    JSON.stringify(themeBaseFile, null, 2).replaceAll('digdir', '<theme>'),
  );

  const themeColorTemplate = digdirThemeJson.color.accent;
  await writeFile(
    path.join(TEMPLATE_FILES_PATH, `themes/theme.template.json`),
    JSON.stringify(themeColorTemplate, null, 2).replaceAll('digdir.accent', '<theme>.<color>'),
  );

  // WIP
  // // $themes.json
  // const themesFile = await readFile(path.join(SOURCE_FILES_PATH, '$themes.json'), 'utf-8');
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

  // await writeFile(path.join(TEMPLATE_FILES_PATH, `$themes.json`), stringify(themesTemplate));

  // // $metadata.json
  // const metadataFile = await readFile(path.join(SOURCE_FILES_PATH, '$metadata.json'), 'utf-8');
  // const tokenSetOrderTemplate = (JSON.parse(metadataFile) as { tokenSetOrder: string[] }).tokenSetOrder
  //   .filter((tokenSet) => {
  //     if (endsWithOneOf(['altinn', 'portal', 'uutilsynet'], tokenSet)) {
  //       return false;
  //     }
  //     return true;
  //   })
  //   .map((tokenSet) => {
  //     if (endsWithOneOf(['digdir'], tokenSet)) {
  //       return tokenSet.replace('/digdir', '/<theme>');
  //     }
  //     return tokenSet;
  //   });

  // await writeFile(
  //   path.join(TEMPLATE_FILES_PATH, `$metadata.json`),
  //   stringify({ tokenSetOrder: tokenSetOrderTemplate }),
  // );

  console.log(chalk.green('Templates updated'));
};

await updateTemplates();
