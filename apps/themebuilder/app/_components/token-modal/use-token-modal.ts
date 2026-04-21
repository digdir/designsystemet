import type { Color, CssColor } from '@digdir/designsystemet/color';
import type { CreateTokensOptions } from '@digdir/designsystemet/tokens';
import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';

const getBaseDefault = (colorTheme: Color[]) =>
  colorTheme.find((color) => color.name === 'base-default');

export const useTokenModal = () => {
  const { isProduction } = useLoaderData();
  const { colors, severityColors, baseBorderRadius } = useThemebuilder();

  const [name, setName] = useState('theme');

  // Get non-default severity colors
  const severityOverrides = severityColors
    .filter((sc) => !sc.isDefault)
    .reduce(
      (acc, sc) => {
        acc[sc.name] = sc.hex;
        return acc;
      },
      {} as Record<string, CssColor>,
    );

  const colorOverrides: Record<
    string,
    Record<string, { light?: CssColor; dark?: CssColor }>
  > = {};

  [
    ...colors.main,
    ...colors.support,
    ...colors.neutral,
    ...severityColors,
  ].forEach((color) => {
    if (color.overrides && Object.keys(color.overrides).length > 0) {
      colorOverrides[color.name] = color.overrides;
    }
  });

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

  const packageWithTag = `@digdir/designsystemet${isProduction ? '@latest' : '@next'}`;

  const configBuildSnippet = `npx ${packageWithTag} tokens create --config designsystemet.config.json\nnpx ${packageWithTag} tokens build --config designsystemet.config.json`;

  const configSnippet = {
    $schema: 'node_modules/@digdir/designsystemet/dist/config.schema.json',
    outDir: './design-tokens',
    themes: {
      [theme.name]: {
        colors: {
          main: theme.colors.main,
          support: theme.colors.support,
          neutral: theme.colors.neutral,
        },
        ...(Object.keys(severityOverrides).length > 0 ||
        Object.keys(colorOverrides).length > 0
          ? {
              overrides: {
                ...(Object.keys(severityOverrides).length > 0 && {
                  severity: severityOverrides,
                }),
                ...(Object.keys(colorOverrides).length > 0 && {
                  colors: colorOverrides,
                }),
              },
            }
          : {}),
        borderRadius: theme.borderRadius,
      },
    },
  };

  return {
    themeName: name,
    setThemeName: setName,
    theme,
    buildSnippet: {
      config: configBuildSnippet,
    },
    configSnippet: JSON.stringify(configSnippet, null, 2),
  };
};
