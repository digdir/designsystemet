import fs, { glob } from 'node:fs';
import { resolve } from 'node:path';
import type { CssColor } from '@adobe/leonardo-contrast-colors';
import * as R from 'ramda';
import { baseColors, generateScaleForColor } from '../../colors';
import type { ColorInfo, ColorMode, ThemeColors } from '../../colors';

type Colors = Record<ThemeColors, CssColor>;

type CreateTokens = {
  colors: Colors;
  outPath: string;
};

type File = {
  name: string;
  data: string;
  path: string;
  filePath: string;
};

type DesignTokens = { [key: string]: { $value: string; $type: string } };

type TokenSet = Record<string, Record<string, DesignTokens>>;

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

const generateThemeTokens = (theme: ColorMode, colors: Colors): TokenSet => {
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

const generateModeFile = (folder: ColorMode, name: Collection, tokens: TokenSet, outPath: string): File => ({
  name: 'light',
  data: JSON.stringify(tokens, null, '\t'),
  path: `${outPath}/primitives/modes/colors/${folder}`,
  filePath: `${outPath}/primitives/modes/colors/${folder}/${name}.json`,
});

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
  const { colors, outPath } = opts;

  const tokens = {
    light: {
      theme: generateThemeTokens('light', colors),
      global: generateGlobalTokens('light'),
    },
    dark: { theme: generateThemeTokens('dark', colors), global: generateGlobalTokens('dark') },
    contrast: { theme: generateThemeTokens('contrast', colors), global: generateGlobalTokens('contrast') },
  };

  const write = R.isNotNil(outPath);

  if (write) {
    const files: File[] = [
      generateModeFile('light', 'theme', tokens.light.theme, outPath),
      generateModeFile('light', 'global', tokens.light.global, outPath),
      generateModeFile('dark', 'theme', tokens.dark.theme, outPath),
      generateModeFile('dark', 'global', tokens.dark.global, outPath),
      generateModeFile('contrast', 'theme', tokens.contrast.theme, outPath),
      generateModeFile('contrast', 'global', tokens.contrast.global, outPath),
    ];

    for (const file of files) {
      console.log(`Writing file ${resolve(file.filePath)}`);
      fs.mkdirSync(file.path, { recursive: true });
      fs.writeFileSync(file.filePath, file.data, { encoding: 'utf-8' });
    }
  }

  return tokens;
};
