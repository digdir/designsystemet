import fs from 'node:fs/promises';
import path from 'node:path';

const DIRNAME: string = import.meta.dirname || __dirname;

const SOURCE_FILES_PATH = path.join(DIRNAME, '../../../../design-tokens');
const DEFAULT_FILES_PATH = path.join(DIRNAME, './design-tokens/default');
const TEMPLATE_FILES_PATH = path.join(DIRNAME, './design-tokens/template');

const argsFromToPaths = (path_: string): [string, string] => [
  path.join(SOURCE_FILES_PATH, path_),
  path.join(DEFAULT_FILES_PATH, path_),
];

export const updateTemplates = async () => {
  // Copy default files
  await fs.cp(path.join(SOURCE_FILES_PATH, 'Figma'), path.join(DEFAULT_FILES_PATH, 'Figma'), {
    recursive: true,
  });
  await fs.cp(...argsFromToPaths('primitives/globals.json'), {
    recursive: true,
  });
  await fs.cp(...argsFromToPaths('primitives/size/default.json'), {
    recursive: true,
  });
  await fs.cp(path.join(SOURCE_FILES_PATH, 'semantic'), path.join(DEFAULT_FILES_PATH, 'semantic'), {
    recursive: true,
  });

  // Copy template files
  const themeTemplate = await fs.readFile(path.join(SOURCE_FILES_PATH, 'themes/theme.json'), 'utf-8');
  await fs.mkdir(path.join(TEMPLATE_FILES_PATH, 'themes'), { recursive: true });
  await fs.writeFile(path.join(TEMPLATE_FILES_PATH, `themes/theme.json`), themeTemplate.replaceAll('theme', '<theme>'));
};

updateTemplates();
