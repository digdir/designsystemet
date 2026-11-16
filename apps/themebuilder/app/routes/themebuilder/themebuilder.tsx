import { AppearanceToggle } from '~/_components/appearance-toggle/appearance-toggle';
import { ColorModalProvider } from '~/_components/color-modal/color-modal-context';
import { EditThemesDialog } from '~/_components/edit-themes-dialog/edit-themes-dialog';
import { Sidebar } from '~/_components/sidebar/sidebar';
import { ThemeHeader } from '~/_components/theme-header/theme-header';
import { ThemePages } from '../../layouts/themebuilder/layout';
import classes from './page.module.css';
import 'react-color-palette/css';
import { Field, Label, Select } from '@digdir/designsystemet-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  parsePath,
  type ShouldRevalidateFunctionArgs,
  useLoaderData,
  useSearchParams,
} from 'react-router';
import { isProduction } from '~/_utils/is-production.server';
import { generateMetadata } from '~/_utils/metadata';
import i18n from '~/i18next.server';
import { legacyThemeKeys } from '~/model/legacy-url';
import { readLegacyUrl } from '~/model/legacy-url.server';
import { ThemeStoreProvider, useThemeStore } from '~/model/theme-store';
import { defaultWorkspace } from '~/model/theme-workspace';
import type { Route } from './+types/themebuilder';

export const loader = async ({
  params: { lang },
  request,
}: Route.LoaderArgs) => {
  const t = await i18n.getFixedT(lang);

  const { search } = parsePath(request.url);
  let workspace = defaultWorkspace();
  try {
    /* Links shared before the theme moved out of the URL still open their theme */
    workspace = readLegacyUrl(new URLSearchParams(search)) || workspace;
  } catch {
    throw new Response('Invalid theme builder URL', { status: 400 });
  }

  return {
    workspace,
    lang,
    metadata: generateMetadata({
      title: t('meta.title'),
      description: t('meta.description'),
    }),
    isProduction: isProduction(),
  };
};

/* The loader only depends on the language. The tab and appearance are read from the URL in the browser. */
export const shouldRevalidate = ({
  currentParams,
  nextParams,
}: ShouldRevalidateFunctionArgs) => currentParams.lang !== nextParams.lang;

export const meta: Route.MetaFunction = ({ loaderData }: Route.MetaArgs) => {
  if (!loaderData?.metadata)
    return [
      {
        title: 'Theme Builder - Designsystemet',
        description: 'Build your own theme for Designsystemet',
      },
    ];
  return loaderData.metadata;
};

export default function Page() {
  const { workspace } = useLoaderData<typeof loader>();

  return (
    <ThemeStoreProvider initial={workspace}>
      <Themebuilder />
    </ThemeStoreProvider>
  );
}

function Themebuilder() {
  const { workspace, setWorkspace } = useThemeStore();
  const [params, setParams] = useSearchParams();
  const { t } = useTranslation();

  /* A shared link's theme is now in the theme store, so the theme is removed from the URL.
   * Left there, it would look like the URL follows the edits, which it no longer does. */
  const hasLegacyTheme = legacyThemeKeys.some((key) => params.has(key));
  useEffect(() => {
    if (!hasLegacyTheme) return;
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        for (const key of legacyThemeKeys) next.delete(key);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  }, [hasLegacyTheme, setParams]);

  return (
    <ColorModalProvider>
      <ThemeHeader />
      <main className={classes.page} id='main'>
        <div className={classes.container}>
          <div className={classes.sideBarContainer}>
            <Sidebar />
          </div>
          <div className={classes.content}>
            <div className={classes.toolbar}>
              <div className={classes.themeGroup}>
                <Field className={classes.themeSelector} data-size='sm'>
                  <Label>{t('themeBuilder.active-theme')}</Label>
                  <div className={classes.themeControls}>
                    <Select
                      value={workspace.activeTheme}
                      onChange={(event) => {
                        const activeTheme = event.currentTarget.value;
                        setWorkspace((previous) => ({
                          ...previous,
                          activeTheme,
                        }));
                      }}
                    >
                      {Object.keys(workspace.config.themes).map((name) => (
                        <Select.Option key={name} value={name}>
                          {name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Field>
                <EditThemesDialog workspace={workspace} onSave={setWorkspace} />
              </div>
              <AppearanceToggle />
            </div>
            <ThemePages />
          </div>
        </div>
      </main>
    </ColorModalProvider>
  );
}
