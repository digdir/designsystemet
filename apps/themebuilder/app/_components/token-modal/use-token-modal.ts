import pkg from '@digdir/designsystemet/package.json';
import { useLoaderData } from 'react-router';
import { useThemeStore } from '~/_utils/theme-store';
import {
  isValidThemeName,
  renameWorkspaceThemes,
} from '~/_utils/theme-workspace';

export const useTokenModal = () => {
  const { isProduction } = useLoaderData();
  const { workspace, setWorkspace } = useThemeStore();

  const packageWithTag = `@digdir/designsystemet${isProduction ? '@latest' : '@next'}`;

  /* The config file is the theme store's config as it is. A config made here gets the schema of this version. */
  const config = {
    $schema: `https://designsystemet.no/schemas/config/${pkg.version}.json`,
    ...workspace.config,
  };

  return {
    themeName: workspace.activeTheme,
    themes: workspace.config.themes,
    /** Renames the active theme. Names that are not valid theme names are ignored. */
    setThemeName: (name: string) => {
      if (!isValidThemeName(name)) return;
      setWorkspace((previous) =>
        Object.hasOwn(previous.config.themes, name)
          ? previous
          : renameWorkspaceThemes(
              previous,
              Object.keys(previous.config.themes).map((from) => ({
                from,
                name: from === previous.activeTheme ? name : from,
              })),
            ),
      );
    },
    buildSnippet: {
      config: `npx ${packageWithTag}`,
    },
    configSnippet: JSON.stringify(config, null, 2),
  };
};
