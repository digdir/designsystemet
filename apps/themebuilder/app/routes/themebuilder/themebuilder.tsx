import 'react-color-palette/css';
import { useEffect } from 'react';
import {
  parsePath,
  type ShouldRevalidateFunctionArgs,
  useLoaderData,
  useSearchParams,
} from 'react-router';
import { isProduction } from '~/_utils/is-production.server';
import { generateMetadata } from '~/_utils/metadata';
import i18n from '~/i18next.server';
import { ThemebuilderLayout } from '~/layouts/themebuilder/layout';
import { legacyThemeKeys } from '~/model/legacy-url';
import { readLegacyUrl } from '~/model/legacy-url.server';
import { ThemeStoreProvider } from '~/model/theme-store';
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
  return (
    loaderData?.metadata ??
    generateMetadata({
      title: 'Theme Builder',
      description: 'Build your own theme for Designsystemet',
    })
  );
};

export default function Page() {
  const { workspace } = useLoaderData<typeof loader>();
  const [params, setParams] = useSearchParams();

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
    <ThemeStoreProvider initial={workspace}>
      <ThemebuilderLayout />
    </ThemeStoreProvider>
  );
}
