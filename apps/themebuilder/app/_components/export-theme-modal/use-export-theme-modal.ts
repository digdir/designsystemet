import pkg from '@digdir/designsystemet/package.json';
import { useLoaderData } from 'react-router';
import { useThemeStore } from '~/model/theme-store';

export const useExportThemeModal = () => {
  const { isProduction } = useLoaderData();
  const { workspace } = useThemeStore();

  const packageWithTag = `@digdir/designsystemet${isProduction ? '@latest' : '@next'}`;

  /* The config file is the theme store's config as it is. A config made here gets the schema of this version. */
  const config = {
    $schema: `https://designsystemet.no/schemas/config/${pkg.version}.json`,
    ...workspace.config,
  };

  return {
    themeName: workspace.activeTheme,
    themes: workspace.config.themes,
    buildSnippet: {
      config: `npx ${packageWithTag}`,
    },
    configSnippet: JSON.stringify(config, null, 2),
  };
};
