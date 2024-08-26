import fs, { glob } from 'node:fs';
import { resolve } from 'node:path';
import type { CssColor } from '@adobe/leonardo-contrast-colors';
import * as R from 'ramda';
import { baseColors, generateScaleForColor } from '../../colors';
import type { ColorInfo, ColorMode, ThemeColors } from '../../colors';

type Colors = Record<ThemeColors, CssColor>;
type Typography = Record<string, string>;
type TypographyModes = 'primary' | 'secondary';

type CreateTokens = {
  colors: Colors;
  typography: Typography;
  outPath: string;
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

const createColorTokens = (colorArray: ColorInfo[]): DesignTokens => {
  const obj: DesignTokens = {};
  const $type = 'color';
  for (let i = 0; i < colorArray.length; i++) {
    if (i === 13 && colorArray.length >= 14) {
      obj['contrast-1'] = {
        $value: colorArray[i].hex,
        $type,
      };
    } else if (i === 14 && colorArray.length >= 15) {
      obj['contrast-2'] = {
        $value: colorArray[i].hex,
        $type,
      };
    } else {
      obj[i + 1] = { $value: colorArray[i].hex, $type };
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
    data: JSON.stringify(tokens, null, '\t'),
    path,
    filePath: `${path}/${name}.json`,
  };
};

const generateTypographyFile = (folder: TypographyModes, name: Collection, tokens: Tokens, outPath: string): File => {
  const path = `${outPath}/primitives/modes/typography/${folder}`;
  return {
    data: JSON.stringify(tokens, null, '\t'),
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
  const { colors, outPath, typography } = opts;

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

  const write = R.isNotNil(outPath);

  if (write) {
    const files: File[] = [
      generateColorModeFile('light', 'theme', tokens.colors.light.theme, outPath),
      generateColorModeFile('light', 'global', tokens.colors.light.global, outPath),
      generateColorModeFile('dark', 'theme', tokens.colors.dark.theme, outPath),
      generateColorModeFile('dark', 'global', tokens.colors.dark.global, outPath),
      generateColorModeFile('contrast', 'theme', tokens.colors.contrast.theme, outPath),
      generateColorModeFile('contrast', 'global', tokens.colors.contrast.global, outPath),
      generateTypographyFile('primary', 'theme', tokens.typography.primary, outPath),
    ];

    for (const file of files) {
      console.log(`Writing file ${resolve(file.filePath)}`);
      fs.mkdirSync(file.path, { recursive: true });
      fs.writeFileSync(file.filePath, file.data, { encoding: 'utf-8' });
    }
  }

  return tokens;
};
