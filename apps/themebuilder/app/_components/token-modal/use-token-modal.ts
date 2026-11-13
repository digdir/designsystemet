import {
  type CssColor,
  configSchemaUrl,
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

  const colorOverrides: Record<
    string,
    Record<string, { light?: CssColor; dark?: CssColor }>
  > = {};

  [...colors, ...severityColors].forEach((color) => {
    if (color.overrides && Object.keys(color.overrides).length > 0) {
      colorOverrides[color.name] = color.overrides;
    }
  });

  // Severity colors are optional, so the ones the theme has are in `colors` like any other color
  const theme: ThemeConfig = {
    colors: [...colors, ...severityColors].reduce(
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
    ...(Object.keys(colorOverrides).length > 0 && {
      overrides: { colors: colorOverrides },
    }),
    ...(theme.borderRadius !== undefined && {
      borderRadius: theme.borderRadius,
    }),
  };

  const configSnippet = {
    // The versioned schema marks the config as one where a theme only has the severity colors in its `colors`
    $schema: configSchemaUrl(pkg.version),
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
