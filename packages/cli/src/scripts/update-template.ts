import path from 'node:path';
import chalk from 'chalk';
import * as R from 'ramda';
import semanticColorJson from '../../../../design-tokens/semantic/color.json' with { type: 'json' };
import accentColorCategoryJson from '../../../../design-tokens/semantic/modes/main-color/accent.json' with {
  type: 'json',
};
import digdirThemeJson from '../../../../design-tokens/themes/digdir.json' with { type: 'json' };
import { FileSystem } from '../utils.js';
const DIRNAME: string = import.meta.dirname || __dirname;

const SOURCE_FILES_PATH = path.join(DIRNAME, '../../../../design-tokens');
const TEMPLATE_FILES_PATH = path.join(DIRNAME, '../tokens/template/design-tokens');

const designTokensPath = (_path: string) => path.join(DIRNAME, '../../../../design-tokens', _path);

const argsFromToPaths = (path_: string): [string, string] => [
  path.join(SOURCE_FILES_PATH, path_),
  path.join(TEMPLATE_FILES_PATH, path_),
];

export const updateTemplates = async () => {
  const fs = new FileSystem();
  // Clean template files
  await fs.cleanDir(TEMPLATE_FILES_PATH);

  // Copy default files
  await fs.cp(...argsFromToPaths('primitives/globals.json'));
  await fs.cp(...argsFromToPaths('primitives/modes/size'));
  await fs.cp(...argsFromToPaths('primitives/modes/typography/size'));
  await fs.cp(...argsFromToPaths('semantic/style.json'));

  // await convertJsonToEsm(
  //   designTokensPath('primitives/globals.json'),
  //   path.join(TEMPLATE_FILES_PATH, 'primitives/globals.ts'),
  // );

  /*
   * Create template files
   */

  // primitives/modes/typography/<theme>.json
  const digdirTypographyJson = await fs.readFile(designTokensPath('primitives/modes/typography/primary/digdir.json'));

  const typographyTemplate = R.set(
    R.lensPath(['digdir', 'font-family', '$value']),
    '<font-family>',
    JSON.parse(digdirTypographyJson),
  );
  const typographyDir = path.join(TEMPLATE_FILES_PATH, 'primitives/modes/typography/');
  await fs.mkdir(typographyDir);
  await fs.writeFile(
    path.join(typographyDir, 'typography.template.json'),
    JSON.stringify(typographyTemplate, null, 2).replaceAll('digdir', '<theme>'),
  );

  // semantic/modes/<category>-color/<color>.json
  const categoryColorTemplate = accentColorCategoryJson.color.main;
  const categoryDir = path.join(TEMPLATE_FILES_PATH, 'semantic/modes');
  await fs.mkdir(categoryDir);
  await fs.writeFile(
    path.join(categoryDir, 'color.template.json'),
    JSON.stringify(categoryColorTemplate, null, 2).replaceAll('color.accent', 'color.<color>'),
  );

  // semantic/color.json
  const colorBaseFile = {
    ...semanticColorJson,
    // Remove custom colors as they are defined from by theme
    color: R.omit(['accent', 'neutral', 'brand1', 'brand2', 'brand3'], semanticColorJson.color),
  };
  await fs.writeFile(
    path.join(TEMPLATE_FILES_PATH, `semantic/color.base.template.json`),
    JSON.stringify(colorBaseFile, null, 2),
  );

  const semanticColorTemplate = semanticColorJson.color.accent;
  await fs.writeFile(
    path.join(TEMPLATE_FILES_PATH, `semantic/color.template.json`),
    JSON.stringify(semanticColorTemplate, null, 2).replaceAll('color.accent', 'color.<color>'),
  );

  // themes/<theme>.json
  const themeBaseFile = {
    color: {},
    ...R.omit(['color'], digdirThemeJson),
  };

  await fs.mkdir(path.join(TEMPLATE_FILES_PATH, 'themes'));
  await fs.writeFile(
    path.join(TEMPLATE_FILES_PATH, `themes/theme.base.template.json`),
    JSON.stringify(themeBaseFile, null, 2).replaceAll('digdir', '<theme>'),
  );

  const themeColorTemplate = digdirThemeJson.color.accent;
  await fs.writeFile(
    path.join(TEMPLATE_FILES_PATH, `themes/theme.template.json`),
    JSON.stringify(themeColorTemplate, null, 2).replaceAll('digdir.accent', '<theme>.<color>'),
  );

  console.log(chalk.green('Templates updated'));
};

await updateTemplates();
