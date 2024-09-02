import fs from 'node:fs/promises';
import path from 'node:path';
import type { CssColor } from '@adobe/leonardo-contrast-colors';
import * as R from 'ramda';
import { baseColors, generateScaleForColor } from '../../colors/index.js';
import type { ColorInfo, ColorMode, ThemeColors } from '../../colors/index.js';
import generateMetadataJson from '../../init/generateMetadataJson.js';
import generateThemesJson from '../../init/generateThemesJson.js';

type Colors = Record<ThemeColors, CssColor>;
type Typography = Record<string, string>;
type TypographyModes = 'primary' | 'secondary';

type CreateTokens = {
  colors: Colors;
  typography: Typography;
  write?: string;
};

type File = {
  data: string;
  path: string;
  filePath: string;
};

type DesignTokens = Record<string, { $value: string; $type: string }>;
type Tokens2ary = Record<string, Record<string, DesignTokens>>;
type Tokens1ary = Record<string, DesignTokens>;
type Tokens = Tokens1ary | Tokens2ary;

type Collection = 'theme' | 'global';

const DIRNAME: string = import.meta.dirname || __dirname;
const DEFAULT_FILES_PATH = path.join(DIRNAME, '../../init/template/default-files/design-tokens/');

const createColorTokens = (colorArray: ColorInfo[]): DesignTokens => {
  const obj: DesignTokens = {};
  const $type = 'color';
  for (let i = 0; i < colorArray.length; i++) {
    if (i === 13 && colorArray.length >= 14) {
      obj['contrast-1'] = {
        $type,
        $value: colorArray[i].hex,
      };
    } else if (i === 14 && colorArray.length >= 15) {
      obj['contrast-2'] = {
        $type,
        $value: colorArray[i].hex,
      };
    } else {
      obj[i + 1] = { $type, $value: colorArray[i].hex };
    }
  }
  return obj;
};

const generateTypographyTokens = ({ family }: Typography): Tokens => {
  return {
    theme: {
      main: {
        $type: 'fontFamilies',
        $value: family,
      },
      bold: {
        $type: 'fontWeights',
        $value: 'Medium',
      },
      'extra-bold': {
        $type: 'fontWeights',
        $value: 'Semi bold',
      },
      regular: {
        $type: 'fontWeights',
        $value: 'Regular',
      },
    },
  };
};

const generateThemeTokens = (theme: ColorMode, colors: Colors): Tokens => {
  const accentColors = generateScaleForColor(colors.accent, theme);
  const neutralColors = generateScaleForColor(colors.neutral, theme);
  const brand1Colors = generateScaleForColor(colors.brand1, theme);
  const brand2Colors = generateScaleForColor(colors.brand2, theme);
  const brand3Colors = generateScaleForColor(colors.brand3, theme);

  return {
    theme: {
      accent: createColorTokens(accentColors),
      neutral: createColorTokens(neutralColors),
      brand1: createColorTokens(brand1Colors),
      brand2: createColorTokens(brand2Colors),
      brand3: createColorTokens(brand3Colors),
    },
  };
};

const generateColorModeFile = (folder: ColorMode, name: Collection, tokens: Tokens, outPath: string): File => {
  const path = `${outPath}/primitives/modes/colors/${folder}`;
  return {
    data: JSON.stringify(tokens, null, 2),
    path,
    filePath: `${path}/${name}.json`,
  };
};

const generateTypographyFile = (folder: TypographyModes, name: Collection, tokens: Tokens, outPath: string): File => {
  const path = `${outPath}/primitives/modes/typography/${folder}`;
  return {
    data: JSON.stringify(tokens, null, 2),
    path,
    filePath: `${path}/${name}.json`,
  };
};

const generateGlobalTokens = (theme: ColorMode) => {
  const blueScale = generateScaleForColor(baseColors.blue, theme);
  const greenScale = generateScaleForColor(baseColors.green, theme);
  const orangeScale = generateScaleForColor(baseColors.orange, theme);
  const purpleScale = generateScaleForColor(baseColors.purple, theme);
  const redScale = generateScaleForColor(baseColors.red, theme);
  const yellowScale = generateScaleForColor(baseColors.yellow, theme);

  return {
    global: {
      blue: createColorTokens(blueScale),
      green: createColorTokens(greenScale),
      orange: createColorTokens(orangeScale),
      purple: createColorTokens(purpleScale),
      red: createColorTokens(redScale),
      yellow: createColorTokens(yellowScale),
    },
  };
};

export const createTokens = async (opts: CreateTokens) => {
  const { colors, write, typography } = opts;

  const tokens = {
    colors: {
      light: {
        theme: generateThemeTokens('light', colors),
        global: generateGlobalTokens('light'),
      },
      dark: { theme: generateThemeTokens('dark', colors), global: generateGlobalTokens('dark') },
      contrast: { theme: generateThemeTokens('contrast', colors), global: generateGlobalTokens('contrast') },
    },
    typography: {
      primary: generateTypographyTokens(typography),
    },
  };

  if (R.isNotNil(write)) {
    const targetDir = path.resolve(process.cwd(), String(write));
    await fs.mkdir(targetDir, { recursive: true });

    // Generate metadata and themes json for Token Studio and build script
    console.log('Generating metadata and themes files');
    const $theme = generateThemesJson(['Light', 'Dark', 'Contrast'], ['theme']);
    const $metadata = generateMetadataJson(['Light', 'Dark', 'Contrast'], ['theme']);

    await fs.writeFile(path.join(targetDir, '$themes.json'), JSON.stringify($theme, null, 2));
    await fs.writeFile(path.join(targetDir, '$metadata.json'), JSON.stringify($metadata, null, 2));

    console.log(`Copying default files to ${targetDir}`);
    await fs.cp(DEFAULT_FILES_PATH, targetDir, {
      recursive: true,
    });

    const files: File[] = [
      generateColorModeFile('light', 'theme', tokens.colors.light.theme, targetDir),
      generateColorModeFile('light', 'global', tokens.colors.light.global, targetDir),
      generateColorModeFile('dark', 'theme', tokens.colors.dark.theme, targetDir),
      generateColorModeFile('dark', 'global', tokens.colors.dark.global, targetDir),
      generateColorModeFile('contrast', 'theme', tokens.colors.contrast.theme, targetDir),
      generateColorModeFile('contrast', 'global', tokens.colors.contrast.global, targetDir),
      generateTypographyFile('primary', 'theme', tokens.typography.primary, targetDir),
      generateTypographyFile('secondary', 'theme', tokens.typography.primary, targetDir),
    ];

    for (const file of files) {
      const dirPath = path.resolve(file.path);
      const filePath = path.resolve(file.filePath);
      console.log(`Writing file ${filePath}`);
      await fs.mkdir(dirPath, { recursive: true });
      await fs.writeFile(filePath, file.data, { encoding: 'utf-8' });
    }
  }

  return tokens;
};
