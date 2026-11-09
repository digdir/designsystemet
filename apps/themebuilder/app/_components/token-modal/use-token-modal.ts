import {
  type CssColor,
  defaultBorderRadius,
  type ExternalConfigSchemaInput,
  stringifyConfig,
} from '@digdir/designsystemet/internal';
import pkg from '@digdir/designsystemet/package.json';
import { useMemo, useState } from 'react';
import { useLoaderData } from 'react-router';
import { exportConfigColors, exportThemeColors } from '~/_utils/theme-colors';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';

type ThemeConfig = NonNullable<ExternalConfigSchemaInput['themes']>[string];

export const useTokenModal = () => {
  const { isProduction } = useLoaderData();
  const { colors, severityColors, baseBorderRadius, overrides, workspace } =
    useThemebuilder();

  const [name, setName] = useState('theme');

  /* Without a config in the URL, the theme is the one in the editor, with the color overrides
   * and severity colors that aren't the default. */
  const editorTheme: ThemeConfig = {
    colors: Object.fromEntries(
      colors.map((color) => [
        color.name,
        (color.hex || color.colors.light['base-default'].hex) as CssColor,
      ]),
    ),
    ...(baseBorderRadius !== defaultBorderRadius && {
      borderRadius: baseBorderRadius,
    }),
    overrides: {
      colors: overrides,
      severity: Object.fromEntries(
        severityColors
          .filter((color) => !color.isDefault)
          .map((color) => [color.name, color.hex]),
      ),
    },
  };
  const editorThemeKey = JSON.stringify(editorTheme);

  // Colors are exported as base colors, with only the steps edited in the builder.
  // The theme is recreated on every render, so it is compared by value.
  const themeConfig = useMemo(
    () => exportThemeColors(editorTheme),
    [editorThemeKey],
  );
  const workspaceConfig = useMemo(
    () => workspace && exportConfigColors(workspace.config),
    [workspace],
  );

  const packageWithTag = `@digdir/designsystemet${isProduction ? '@latest' : '@next'}`;

  const configBuildSnippet = `npx ${packageWithTag}`;

  const configSnippet = {
    $schema: `https://designsystemet.no/schemas/config/${pkg.version}.json`,
    themes: {
      [name]: themeConfig,
    },
  };

  return {
    themeName: workspace?.activeTheme || name,
    isWorkspace: Boolean(workspace),
    workspaceThemes: workspaceConfig?.themes,
    setThemeName: setName,
    themeConfig,
    buildSnippet: {
      config: configBuildSnippet,
    },
    configSnippet: stringifyConfig(workspaceConfig || configSnippet),
  };
};
