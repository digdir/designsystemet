import 'react-color-palette/css';
import { useEffect } from 'react';
import {
  data,
  parsePath,
  type ShouldRevalidateFunctionArgs,
  useLoaderData,
  useSearchParams,
} from 'react-router';
import { Themebuilder } from '~/_components/themebuilder/themebuilder';
import { isProduction } from '~/_utils/is-production.server';
import { generateMetadata } from '~/_utils/metadata';
import i18n from '~/i18next.server';
import { legacyThemeKeys } from '~/model/legacy-url';
import { readLegacyUrl } from '~/model/legacy-url.server';
import { clientKey, createRateLimiter } from '~/model/rate-limit.server';
import {
  countMissedTheme,
  hasGuessedTooOften,
} from '~/model/share-request.server';
import { SHARED_THEME_PARAM, SHARED_VIEW_PARAM } from '~/model/shared-themes';
import {
  canShareThemes,
  readSharedTheme,
  readSharedThemeView,
} from '~/model/shared-themes.server';
import { ThemeStoreProvider, useThemeStore } from '~/model/theme-store';
import { defaultWorkspace } from '~/model/theme-workspace';
import type { Route } from './+types/themebuilder';

/* 60 shared links per minute from one client */
const withinLimit = createRateLimiter(60, 60_000);

export const loader = async ({
  params: { lang },
  request,
}: Route.LoaderArgs) => {
  const t = await i18n.getFixedT(lang);

  const { search } = parsePath(request.url);
  const params = new URLSearchParams(search);
  let workspace = defaultWorkspace();
  const sharedId = params.get(SHARED_THEME_PARAM);
  const viewId = params.get(SHARED_VIEW_PARAM);
  /* The links of the shared theme that is opened. Without `id` it is opened for viewing, and cannot be changed from here. */
  let shared: { id: string | null; viewId: string } | null = null;
  if (sharedId !== null || viewId !== null) {
    if (!canShareThemes()) throw new Response('Not found', { status: 404 });
    if (!withinLimit(clientKey(request)) || hasGuessedTooOften(request))
      throw new Response('Too many requests', { status: 429 });
    const theme =
      sharedId !== null
        ? await readSharedTheme(sharedId)
        : { config: await readSharedThemeView(viewId || ''), viewId };
    if (!theme?.config || !theme.viewId) {
      countMissedTheme(request);
      throw new Response('Not found', { status: 404 });
    }
    const { config } = theme;
    shared = { id: sharedId, viewId: theme.viewId };
    workspace = { config, activeTheme: Object.keys(config.themes)[0] };
  } else {
    try {
      /* Links shared before the theme moved out of the URL still open their theme */
      workspace = readLegacyUrl(params) || workspace;
    } catch {
      throw new Response('Invalid theme builder URL', { status: 400 });
    }
  }

  return data(
    {
      workspace,
      shared,
      canShare: canShareThemes(),
      metadata: generateMetadata({
        title: t('meta.title'),
        description: t('meta.description'),
      }),
      isProduction: isProduction(),
    },
    /* A shared theme changes as it is edited, so a page with one is not kept by browsers or proxies */
    shared ? { headers: { 'Cache-Control': 'no-store' } } : undefined,
  );
};

export const headers: Route.HeadersFunction = ({ loaderHeaders }) =>
  loaderHeaders;

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
  const { workspace, shared, canShare } = useLoaderData<typeof loader>();

  return (
    <ThemeStoreProvider initial={workspace} initialShared={shared}>
      <ThemeUrl />
      <Themebuilder canShare={canShare} />
    </ThemeStoreProvider>
  );
}

/**
 * Keeps the URL true to the theme in the theme store. The URL has the id of the shared link the config
 * is saved to, or the view id of the link it was opened for viewing from, so the page can be reloaded and
 * the address copied. The theme of an old link is removed: left there, it would look like the URL follows
 * the edits, which it does not.
 */
function ThemeUrl() {
  const { sharedId, viewOnlyId } = useThemeStore();
  const [params, setParams] = useSearchParams();

  const isStale =
    params.get(SHARED_THEME_PARAM) !== sharedId ||
    params.get(SHARED_VIEW_PARAM) !== viewOnlyId ||
    legacyThemeKeys.some((key) => params.has(key));
  useEffect(() => {
    if (!isStale) return;
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        for (const key of legacyThemeKeys) next.delete(key);
        for (const [key, id] of [
          [SHARED_THEME_PARAM, sharedId],
          [SHARED_VIEW_PARAM, viewOnlyId],
        ] as const) {
          if (id) next.set(key, id);
          else next.delete(key);
        }
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  }, [isStale, sharedId, viewOnlyId, setParams]);

  return null;
}
