import {
  type CssColor,
  defaultBorderRadius,
  type ExternalConfigSchemaInput,
} from '@digdir/designsystemet/internal';
import pkg from '@digdir/designsystemet/package.json';
import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';

type ThemeConfig = NonNullable<ExternalConfigSchemaInput['themes']>[string];

export const useTokenModal = () => {
  const { isProduction } = useLoaderData();
  const { colors, severityColors, baseBorderRadius, workspace } =
    useThemebuilder();

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

  [...colors, ...severityColors].forEach((color) => {
    if (color.overrides && Object.keys(color.overrides).length > 0) {
      colorOverrides[color.name] = color.overrides;
    }
  });

  const theme: ThemeConfig = {
    colors: colors.reduce(
      (acc, color) => {
        acc[color.name] = color.colors.light['base-default']?.hex || '#';
        return acc;
      },
      {} as Record<string, CssColor>,
    ),
    ...(baseBorderRadius !== defaultBorderRadius && {
      borderRadius: baseBorderRadius,
    }),
  };

  const packageWithTag = `@digdir/designsystemet${isProduction ? '@latest' : '@next'}`;

  const configBuildSnippet = `npx ${packageWithTag}`;

  const themeConfig: ThemeConfig = {
    colors: theme.colors,
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
    ...(theme.borderRadius !== undefined && {
      borderRadius: theme.borderRadius,
    }),
  };

  const configSnippet = {
    $schema: `https://designsystemet.no/schemas/config/${pkg.version}.json`,
    themes: {
      [name]: themeConfig,
    },
  };

  return {
    themeName: workspace?.activeTheme || name,
    isWorkspace: Boolean(workspace),
    workspaceThemes: workspace?.config.themes,
    setThemeName: setName,
    theme,
    themeConfig,
    buildSnippet: {
      config: configBuildSnippet,
    },
    configSnippet: JSON.stringify(workspace?.config || configSnippet, null, 2),
  };
};
