import { join } from 'node:path';
import cl from 'clsx';
import { Outlet, useMatches } from 'react-router';
import { Sidebar } from '~/_components/sidebar/sidebar';
import {
  getFileFromContentDir,
  getFoldersInContentDir,
} from '~/_utils/files.server';
import i18n from '~/i18next.server';
import type { Route } from './+types/layout';
import classes from './layout.module.css';

export { ErrorBoundary } from '~/root';

// Language-specific cache
const langCache = new Map<
  string,
  {
    [key: string]: {
      title: string;
      url: string;
    }[];
  }
>();

export const loader = async ({
  params: { lang },
  request,
}: Route.LoaderArgs) => {
  if (process.env.APP_ENV === 'production') {
    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }

  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const t = await i18n.getFixedT(lang);

  let cats = langCache.get(lang);

  if (!cats) {
    const categoryMaps = new Map<
      string,
      Map<string, { title: string; url: string }>
    >();
    const getStartedMap = new Map<string, { title: string; url: string }>();

    /* read all folders in content/components */
    const folders = getFoldersInContentDir('/components');

    await Promise.all(
      folders.map(async (folder) => {
        const metadataJson = getFileFromContentDir(
          join('components', folder, 'metadata.json'),
        );

        if (!metadataJson) {
          const category = 'components';
          if (!categoryMaps.has(category)) {
            categoryMaps.set(category, new Map());
          }
          const categoryMap = categoryMaps.get(category);
          if (categoryMap) {
            categoryMap.set(`/${lang}/components/${folder}`, {
              title: folder,
              url: `/${lang}/components/${folder}`,
            });
          }
          return;
        }

        const parsedMetadata = JSON.parse(metadataJson);
        const category = parsedMetadata.category || 'components';

        const component = {
          title: parsedMetadata[lang].title || folder,
          url: `/${lang}/components/${folder}`,
        };

        if (!categoryMaps.has(category)) {
          categoryMaps.set(category, new Map());
        }
        const categoryMap = categoryMaps.get(category);
        if (categoryMap) {
          categoryMap.set(component.url, component);
        }
      }),
    );

    getStartedMap.set(`/${lang}/changelog`, {
      title: t('components.changelog.title'),
      url: `/${lang}/changelog`,
    });

    cats = { getStarted: [] };
    for (const [category, map] of categoryMaps.entries()) {
      cats[category] = Array.from(map.values()).sort((a, b) =>
        a.title.localeCompare(b.title),
      );
    }
    cats.getStarted = Array.from(getStartedMap.values());

    langCache.set(lang, cats);
  }

  const trimmedUrl = request.url.endsWith('/')
    ? request.url.slice(0, -1)
    : request.url;
  const compPage = trimmedUrl.split('/').pop();

  const isComponentPage = request.url.includes('/components/');

  const sidebarSuffix: { [key: string]: string } = {};
  for (const category of Object.keys(cats)) {
    if (category !== 'getStarted') {
      sidebarSuffix[category] = isComponentPage ? '/' + compPage : '/overview';
    }
  }

  return {
    lang,
    cats,
    sidebarSuffix,
  };
};

export default function Layout({
  loaderData: { cats, sidebarSuffix },
}: Route.ComponentProps) {
  const matches = useMatches();
  const isComponentPage = matches.some(
    (match) => match.id === 'components-page',
  );
  return (
    <div
      className={cl(classes['components-container'], 'l-content-container')}
      data-color='neutral'
      data-is-component={isComponentPage}
    >
      <Sidebar
        cats={cats}
        title={'Components'}
        suffix={sidebarSuffix}
        hideCatTitle
      />
      <div className={classes.content}>
        <Outlet />
      </div>
    </div>
  );
}
