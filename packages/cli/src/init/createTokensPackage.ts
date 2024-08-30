import fs from 'node:fs/promises';
import path from 'node:path';

import chalk from 'chalk';
import type { Choice, Options } from 'prompts';
import prompts from 'prompts';

import generateMetadata from './generateMetadataJson.js';
import generateThemes from './generateThemesJson.js';
import { nextStepsMarkdown } from './nextStepsMarkdown.js';
import packageJsonTemplate from './template/template-files/package.json' with { type: 'json' };
import { normalizeTokenSetName, toGeneratedCssFileName, toValidPackageName } from './utils.js';

const MODES = ['Light', 'Dark', 'Contrast'] as const;
export type Mode = (typeof MODES)[number];

interface DirectoryAnswers {
  directoryAction?: 'clean' | 'ignore' | 'exit';
}
interface PackageAnswers {
  packageName: string;
}

interface TokensAnswers {
  tokensDir: string;
  themeCount: number;
  modes: Mode[];
}

interface ThemeAnswers {
  name: string;
}

const promptOptions: Options = {
  onCancel: () => {
    console.log(`${chalk.red('✖')} Operation cancelled`);
    process.exit();
  },
};

export async function createTokensPackage(targetDir: string) {
  const DIRNAME: string = import.meta.dirname || __dirname;
  const DEFAULT_FILES_PATH = path.join(DIRNAME, './template/default-files');
  const TOKEN_TEMPLATE_FILES_PATH = path.join(DIRNAME, './template/template-files/design-tokens');

  const TARGET_DIR = path.resolve(process.cwd(), targetDir);
  const initialPackageName = toValidPackageName(path.basename(TARGET_DIR));

  // Check target directory contents
  let isTargetDirEmpty = true;
  try {
    const files = await fs.readdir(TARGET_DIR);
    isTargetDirEmpty = files.length === 0;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      // Directory doesn't exist, so we're good
    } else {
      console.error(err);
      console.log('Continuing...');
    }
  }

  const { directoryAction } = (await prompts(
    {
      name: 'directoryAction',
      type: isTargetDirEmpty ? null : 'select',
      message: 'Target directory is not empty. How should we proceed?',
      choices: [
        {
          title: 'Clean',
          value: 'clean',
          description: 'Empty the directory and continue',
        },
        {
          title: 'Ignore',
          value: 'ignore',
          description: 'Keep directory as is. Files may be overwritten with new output.',
        },
        {
          title: 'Exit',
          value: 'exit',
          description: 'Exit without doing anything.',
        },
      ],
    },
    promptOptions,
  )) as DirectoryAnswers;

  if (directoryAction === 'exit') {
    process.exit();
  }

  const { packageName } = (await prompts(
    [
      {
        name: 'packageName',
        type: 'text',
        message: 'Enter a package name (for package.json)',
        initial: initialPackageName,
      },
    ],
    promptOptions,
  )) as PackageAnswers;

  const { modes, themeCount, tokensDir } = (await prompts(
    [
      {
        name: 'themeCount',
        type: 'number',
        message: 'How many themes do you want?',
        initial: 1,
        min: 1,
      },
      {
        name: 'modes',
        type: 'multiselect',
        choices: MODES.filter((x) => x !== 'Light').map((mode) => ({
          title: mode,
          value: mode,
        })),
        message: 'Which color modes do you want?',
        instructions: `
  Instructions:
    ↑/↓: Highlight option
    ←/→/[space]: Toggle selection
    a: Toggle all
    enter/return: Complete answer
${chalk.green('◉')}   Light ${chalk.dim('- This is the default mode, and cannot be disabled')}`,
        onState: (obj: { value: Choice[] }) => {
          obj.value.unshift({ title: 'Light', value: 'Light', selected: true });
        },
      },
      {
        name: 'tokensDir',
        type: 'text',
        initial: 'design-tokens',
        message: `Enter the desired path for the design tokens`,
      },
    ],
    promptOptions,
  )) as TokensAnswers;

  const themes: string[] = [];
  const TOKENS_TARGET_DIR = path.join(TARGET_DIR, tokensDir);

  for (let n = 1; n <= themeCount; n++) {
    const theme: ThemeAnswers = await prompts(
      [
        {
          name: 'name',
          type: 'text',
          message: `Enter the name of the ${ordinal(n)} theme`,
          validate: (value: string) => isValidThemeName(themes, value),
        },
      ],
      promptOptions,
    );
    themes.push(theme.name);
  }

  const { defaultTheme = themes[0] } = (await prompts(
    {
      name: 'defaultTheme',
      type: themeCount === 1 ? null : 'select',
      message: 'Select the default theme to export in package.json',
      choices: themes.map((theme) => ({ title: theme, value: theme })),
      initial: 0,
    },
    promptOptions,
  )) as { defaultTheme?: string };
  console.log(
    `
Will now create the following:
  ${chalk.bold('Package name')}: ${packageName}
  ${chalk.bold('Directory')}: ${TARGET_DIR}
  ${chalk.bold('Tokens directory')}: ${TOKENS_TARGET_DIR}
  ${chalk.bold('Themes')}: ${themes.join(', ')}
  ${chalk.bold('Default theme')}: ${defaultTheme}
  ${chalk.bold('Color modes')}: ${modes.join(', ')}
`,
  );
  if (directoryAction === 'clean') {
    console.log(chalk.bold.red(`Warning: Contents of ${TARGET_DIR} will be deleted`));
  }
  if (directoryAction === 'ignore') {
    console.log(chalk.bold.yellow(`Warning: Existing files in ${TARGET_DIR} may be overwritten`));
  }

  const res = await prompts(
    {
      name: 'proceed',
      type: 'confirm',
      message: 'Proceed?',
      initial: directoryAction === undefined, // default to proceeding if the output directory is empty
    },
    promptOptions,
  );

  if (!res.proceed) {
    process.exit();
  }

  if (directoryAction === 'clean') {
    await fs.rm(TARGET_DIR, { recursive: true });
  }

  await fs.cp(DEFAULT_FILES_PATH, path.join(TARGET_DIR), {
    recursive: true,
  });
  if (tokensDir !== 'design-tokens') {
    await fs.rename(path.join(TARGET_DIR, 'design-tokens'), path.join(TOKENS_TARGET_DIR));
  }

  try {
    await fs.mkdir(path.join(TOKENS_TARGET_DIR, 'themes'));
  } catch {
    // Directory creation failed, probably because the directory already exists
  }

  try {
    await fs.mkdir(path.join(TOKENS_TARGET_DIR, 'themes'));
  } catch {
    // Directory creation failed, probably because the directory already exists
  }

  try {
    await fs.mkdir(path.join(TOKENS_TARGET_DIR, 'primitives/modes/typography/primary'), { recursive: true });
    await fs.mkdir(path.join(TOKENS_TARGET_DIR, 'primitives/modes/typography/secondary'), { recursive: true });
  } catch {
    // Directory creation failed, probably because the directory already exists
  }

  for (const theme of themes.map(normalizeTokenSetName)) {
    for (const mode of modes.map(normalizeTokenSetName)) {
      // Copy the global file for the color mode
      await fs.cp(
        path.join(TOKEN_TEMPLATE_FILES_PATH, `primitives/modes/colors/${mode}/global.json`),
        path.join(TOKENS_TARGET_DIR, `primitives/modes/colors/${mode}/global.json`),
        { recursive: true },
      );

      // Create theme primitives for the color mode
      const template = await fs.readFile(
        path.join(TOKEN_TEMPLATE_FILES_PATH, `primitives/modes/colors/${mode}/theme-template.json`),
      );
      await fs.writeFile(
        path.join(TOKENS_TARGET_DIR, `primitives/modes/colors/${mode}/${theme}.json`),
        template.toString('utf-8').replaceAll('<theme>', theme),
      );

      // Create theme primitives for primary typography
      const templatePrimaryTypo = await fs.readFile(
        path.join(TOKEN_TEMPLATE_FILES_PATH, `primitives/modes/typography/primary/theme-template.json`),
      );
      await fs.writeFile(
        path.join(TOKENS_TARGET_DIR, `primitives/modes/typography/primary/${theme}.json`),
        templatePrimaryTypo.toString('utf-8').replaceAll('<theme>', theme),
      );

      // Create theme primitives for secondary typography
      const templateSecondaryTypo = await fs.readFile(
        path.join(TOKEN_TEMPLATE_FILES_PATH, `primitives/modes/typography/secondary/theme-template.json`),
      );

      await fs.writeFile(
        path.join(TOKENS_TARGET_DIR, `primitives/modes/typography/secondary/${theme}.json`),
        templateSecondaryTypo.toString('utf-8').replaceAll('<theme>', theme),
      );
    }

    // Create main theme token set
    const template = await fs.readFile(path.join(TOKEN_TEMPLATE_FILES_PATH, `themes/theme-template.json`));
    await fs.writeFile(
      path.join(TOKENS_TARGET_DIR, `themes/${theme}.json`),
      template.toString('utf-8').replaceAll('<theme>', theme),
    );

    await fs.writeFile(
      path.join(TOKENS_TARGET_DIR, '$metadata.json'),
      JSON.stringify(generateMetadata(modes, themes), undefined, 2),
    );

    await fs.writeFile(
      path.join(TOKENS_TARGET_DIR, '$themes.json'),
      JSON.stringify(generateThemes(modes, themes), undefined, 2),
    );
  }

  // Configure package.json file
  packageJsonTemplate.name = packageName;
  packageJsonTemplate.main = packageJsonTemplate.main.replaceAll(
    '<default-theme>',
    toGeneratedCssFileName(defaultTheme),
  );
  await fs.writeFile(path.join(TARGET_DIR, 'package.json'), JSON.stringify(packageJsonTemplate, undefined, 2));

  const readmePath = path.join(TARGET_DIR, 'README.md');
  const currentReadme = await fs.readFile(readmePath);
  await fs.writeFile(
    readmePath,
    [currentReadme.toString('utf-8'), nextStepsMarkdown(themes, modes, tokensDir, packageName)].join('\n'),
  );

  console.log('🎉 Files successfully generated!');
  console.log(`Read about the next steps in the generated README at ${readmePath}`);
}

function isValidThemeName(themes: string[], value: string): true | string {
  const s = value.trim();
  if (s.length === 0) {
    return 'Theme name cannot be empty.';
  }
  if (themes.includes(s)) {
    return 'Theme names must be unique.';
  }
  if (/[^a-zæøå0-9 _-]/i.test(s)) {
    return 'Theme name can only contain letters, numbers, dashes and underscores.';
  }
  return true;
}

function ordinal(n: number): string {
  switch (n) {
    case 1:
      return '1st';
    case 2:
      return '2nd';
    case 3:
      return '3rd';
    default:
      return `${n}th`;
  }
}
