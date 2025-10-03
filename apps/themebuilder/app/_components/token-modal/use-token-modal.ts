import type { Color, CssColor, ThemeInfo } from '@digdir/designsystemet/color';
import {
  type CreateTokensOptions,
  cliOptions,
} from '@digdir/designsystemet/tokens';
import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';

type ColorTheme = {
  name: string;
  colors: ThemeInfo;
};

const colorCliOptions = cliOptions.theme.colors;

const getBaseDefault = (colorTheme: Color[]) =>
  colorTheme.find((color) => color.name === 'base-default');

export const useTokenModal = () => {
  const { isProduction } = useLoaderData();
  const { colors, baseBorderRadius } = useThemebuilder();

  const [name, setName] = useState('theme');
  const [formatWin, setFormatWin] = useState(
    navigator.userAgent.includes('Windows'),
  );

  const seperator = formatWin ? ' ^\n' : ' \\\n';

  const theme: CreateTokensOptions = {
    name,
    colors: {
      main: colors.main.reduce(
        (acc, color) => {
          acc[color.name] = getBaseDefault(color.colors.light)?.hex || '#';
          return acc;
        },
        {} as Record<string, CssColor>,
      ),
      support: colors.support.reduce(
        (acc, color) => {
          acc[color.name] = getBaseDefault(color.colors.light)?.hex || '#';
          return acc;
        },
        {} as Record<string, CssColor>,
      ),
      neutral: getBaseDefault(colors.neutral[0]?.colors.light)?.hex || '#',
    },
    borderRadius: baseBorderRadius,
    typography: {
      fontFamily: 'Inter',
    },
  };

  const setCliColors = (colorTheme: ColorTheme[]) => {
    if (!colorTheme.length) return '';

    return (
      colorTheme
        .map((theme) => {
          const baseColor = getBaseDefault(theme.colors.light);
          return `"${theme.name}:${baseColor?.hex}"`;
        })
        .join(' ') + ' '
    );
  };

  const packageWithTag = `@digdir/designsystemet${isProduction ? '@latest' : '@next'}`;
  const buildSnippet = `npx ${packageWithTag} tokens build`;

  const cliSnippet = [
    `npx ${packageWithTag} tokens create`,
    `--${colorCliOptions.main} ${setCliColors(colors.main).trimEnd()}`,
    `--${colorCliOptions.neutral} "${getBaseDefault(colors.neutral[0]?.colors.light)?.hex}"`,
    `${colors.support.length > 0 ? `--${colorCliOptions.support} ${setCliColors(colors.support).trimEnd()}` : ''}`,
    `--border-radius ${baseBorderRadius}`,
    `--theme "${name}"`,
  ]
    .filter(Boolean)
    .join(seperator);

  const configSnippet = `
{"name": "${theme.name}",
  "colors": {
    "main": ${JSON.stringify(theme.colors.main, null, 2)},
    "support": ${JSON.stringify(theme.colors.support, null, 2)},
    "neutral": "${theme.colors.neutral}"
  },
  "borderRadius": "${theme.borderRadius}",
  "typography": {
    "fontFamily": "Inter"
  }
}`;

  return {
    themeName: name,
    setThemeName: setName,
    theme,
    cliSnippet,
    buildSnippet,
    formatWin,
    setFormatWin,
    configSnippet,
  };
};
