import path from 'node:path';
import pc from 'picocolors';
import * as R from 'ramda';
import semanticColorJson from '../../../../design-tokens/semantic/color.json' with { type: 'json' };
import accentColorCategoryJson from '../../../../design-tokens/semantic/modes/main-color/accent.json' with {
  type: 'json',
};
import designsystemetThemeJson from '../../../../design-tokens/themes/designsystemet.json' with { type: 'json' };
import { cleanDir, cp, mkdir, readFile, writeFile } from '../utils.js';

const DIRNAME: string = import.meta.dirname || __dirname;

const themeName = 'designsystemet';
const SOURCE_FILES_PATH = path.join(DIRNAME, '../../../../design-tokens');
const TEMPLATE_FILES_PATH = path.join(DIRNAME, '../tokens/template/design-tokens');

const designTokensPath = (_path: string) => path.join(SOURCE_FILES_PATH, _path);

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
  // await cp(...argsFromToPaths('semantic/style.json'));

  // await convertJsonToEsm(
  //   designTokensPath('primitives/globals.json'),
  //   path.join(TEMPLATE_FILES_PATH, 'primitives/globals.ts'),
  // );

  /*
   * Create template files
   */

  // primitives/modes/typography/<theme>.json
  const designsystemetTypographyJson = await readFile(
    designTokensPath(`primitives/modes/typography/primary/${themeName}.json`),
  );

  const typographyTemplate = R.set(
    R.lensPath([themeName, 'font-family', '$value']),
    '<font-family>',
    JSON.parse(designsystemetTypographyJson),
  );
  const typographyDir = path.join(TEMPLATE_FILES_PATH, 'primitives/modes/typography/');
  await mkdir(typographyDir);
  await writeFile(
    path.join(typographyDir, 'typography.template.json'),
    JSON.stringify(typographyTemplate, null, 2).replaceAll(themeName, '<theme>'),
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
    // Remove custom colors and severity colors as they are defined by theme
    color: R.pick(['focus'], semanticColorJson.color),
    link: {
      color: {
        visited: {
          $type: 'color',
          $value: '{color.link.visited}',
        },
      },
    },
  };

  await writeFile(
    path.join(TEMPLATE_FILES_PATH, `semantic/color.base.template.json`),
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
    ...R.omit(['color'], designsystemetThemeJson),
  };

  await mkdir(path.join(TEMPLATE_FILES_PATH, 'themes'));
  await writeFile(
    path.join(TEMPLATE_FILES_PATH, `themes/theme.base.template.json`),
    JSON.stringify(themeBaseFile, null, 2).replaceAll(themeName, '<theme>'),
  );

  const themeColorTemplate = designsystemetThemeJson.color.accent;
  await writeFile(
    path.join(TEMPLATE_FILES_PATH, `themes/theme.template.json`),
    JSON.stringify(themeColorTemplate, null, 2).replaceAll(`${themeName}.accent`, '<theme>.<color>'),
  );

  console.log(pc.green('Templates updated'));
};

await updateTemplates();
