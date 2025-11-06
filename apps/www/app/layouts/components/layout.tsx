import { join } from 'node:path';
import { ContentContainer } from '@internal/components';
import { Outlet } from 'react-router';
import { Sidebar } from '~/_components/sidebar/sidebar';
import {
  getFileFromContentDir,
  getFoldersInContentDir,
} from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import i18n from '~/i18next.server';
import type { Route } from './+types/layout';
import classes from './layout.module.css';

export { ErrorBoundary } from '~/root';

// Maps to store unique entries
const componentsMap = new Map<string, { title: string; url: string }>();
const getStartedMap = new Map<string, { title: string; url: string }>();

const cats: {
  [key: string]: {
    title: string;
    url: string;
  }[];
} = {
  getStarted: [],
  components: [],
};

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

  if (!cats.components.length) {
    componentsMap.clear();
    getStartedMap.clear();

    /* read all folders in content/components */
    const folders = getFoldersInContentDir('/components');

    await Promise.all(
      folders.map(async (folder) => {
        /* read overview.mdx file in lang folder */
        const mdxSource = getFileFromContentDir(
          join('components', folder, lang, 'overview.mdx'),
        );

        const result = await generateFromMdx(mdxSource);

        const component = {
          title: result.frontmatter.title || folder,
          url: `/${lang}/components/${folder}`,
        };
        componentsMap.set(component.url, component);
      }),
    );

    getStartedMap.set(`/${lang}/changelog`, {
      title: t('components.changelog.title'),
      url: `/${lang}/changelog`,
    });

    cats.components = Array.from(componentsMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title),
    );
    cats.getStarted = Array.from(getStartedMap.values());
  }

  const trimmedUrl = request.url.endsWith('/')
    ? request.url.slice(0, -1)
    : request.url;
  const compPage = trimmedUrl.split('/').pop();

  const isComponentPage = request.url.includes('/components/');

  return {
    lang,
    cats,
    sidebarSuffix: {
      components: isComponentPage ? '/' + compPage : '/overview',
    },
  };
};

export default function Layout({
  loaderData: { cats, sidebarSuffix },
}: Route.ComponentProps) {
  return (
    <ContentContainer
      className={classes['sidebar-container']}
      data-color='neutral'
    >
      <Sidebar
        cats={cats}
        title={'Components'}
        className={classes.sidebar}
        suffix={sidebarSuffix}
        hideCatTitle
      />
      <div className={classes.content}>
        <Outlet />
      </div>
    </ContentContainer>
  );
}
