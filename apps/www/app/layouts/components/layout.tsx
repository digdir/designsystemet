import { join } from 'node:path';
import { ContentContainer } from '@internal/components';
import { Outlet } from 'react-router';
import { Sidebar } from '~/_components/sidebar/sidebar';
import {
  getFileFromContentDir,
  getFilesFromContentDir,
  getFoldersInContentDir,
} from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import i18n from '~/i18next.server';
import type { Route } from './+types/layout';
import classes from './layout.module.css';

export { ErrorBoundary } from '~/root';

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

  const cats: {
    [key: string]: {
      title: string;
      url: string;
    }[];
  } = {};

  // Get started items (added first)
  const getStartedItems = [
    {
      title: t('components.changelog.title'),
      url: `/${lang}/components/changelog`,
    },
  ];

  const getStartedFolders = getFilesFromContentDir(
    join('components-docs', lang),
  );

  for (const file of getStartedFolders) {
    /* parse mdx */
    const fileContent = await generateFromMdx(file.path);

    getStartedItems.push({
      title:
        fileContent.frontmatter.sidebar_title ||
        file.relativePath.replace('.mdx', ''),
      url: `/${lang}/components/${file.relativePath.replace('.mdx', '')}`,
    });
  }

  cats.getStarted = getStartedItems;

  /* read all folders in content/components */
  const folders = getFoldersInContentDir('/components');

  const components = await Promise.all(
    folders.map(async (folder) => {
      const metadataJson = getFileFromContentDir(
        join('components', folder, 'metadata.json'),
      );

      if (!metadataJson) {
        return {
          category: 'components',
          title: folder,
          url: `/${lang}/components/docs/${folder}`,
        };
      }

      const parsedMetadata = JSON.parse(metadataJson);
      const category = parsedMetadata.category || 'components';

      return {
        category,
        title: parsedMetadata[lang].title || folder,
        url: `/${lang}/components/docs/${folder}`,
      };
    }),
  );

  // Group components by category
  const componentCategories = new Set<string>();
  for (const component of components) {
    const { category, ...item } = component;
    componentCategories.add(category);
    if (!cats[category]) {
      cats[category] = [];
    }
    cats[category].push(item);
  }

  // Sort each category
  for (const category in cats) {
    cats[category].sort((a, b) => a.title.localeCompare(b.title));
  }

  const trimmedUrl = request.url.endsWith('/')
    ? request.url.slice(0, -1).split('/')
    : request.url.split('/');
  const compPage = trimmedUrl[trimmedUrl.length - 1];

  const isComponentPage = request.url.includes('/components/docs/');

  const sidebarSuffix: { [key: string]: string } = {};
  for (const category of componentCategories) {
    sidebarSuffix[category] = isComponentPage ? `/${compPage}` : '/overview';
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
  console.log(sidebarSuffix);
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
