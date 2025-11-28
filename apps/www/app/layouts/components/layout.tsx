import { join } from 'node:path';
import { Outlet, useMatches } from 'react-router';
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
      order?: number;
    }[];
  } = {};

  // Add changelog as first item in get-started
  const changelogItem = {
    title: t('components.changelog.title'),
    url: `/${lang}/components/changelog`,
    order: 1,
  };

  // Get all folders in components-docs/{lang}
  const docsFolders = getFoldersInContentDir(join('components-docs', lang));

  // Process each folder as a category
  for (const folder of docsFolders) {
    const categoryKey = folder === 'get-started' ? 'getStarted' : folder;
    cats[categoryKey] = [];

    // Get all files in this folder
    const filesInFolder = getFilesFromContentDir(
      join('components-docs', lang, folder),
    );

    for (const file of filesInFolder) {
      const fileContent = getFileFromContentDir(
        join('components-docs', lang, folder, `${file.relativePath}`),
      );
      const result = await generateFromMdx(fileContent);

      cats[categoryKey].push({
        title:
          result.frontmatter.sidebar_title ||
          file.relativePath.replace('.mdx', ''),
        url: `/${lang}/components/${folder}/${file.relativePath.replace('.mdx', '')}`,
        order: parseInt(result.frontmatter.order, 10) || 9999,
      });
    }

    // Sort items within the category by order
    cats[categoryKey].sort((a, b) => (a.order || 9999) - (b.order || 9999));
  }

  // Add changelog to get-started if it exists
  if (cats.getStarted) {
    cats.getStarted.unshift(changelogItem);
  }

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
  const componentCats: typeof cats = {};

  for (const component of components) {
    const { category, ...item } = component;
    componentCategories.add(category);
    if (!componentCats[category]) {
      componentCats[category] = [];
    }
    componentCats[category].push(item);
  }

  // Sort component categories
  for (const category in componentCats) {
    componentCats[category].sort((a, b) => a.title.localeCompare(b.title));
  }

  // Reorder cats: getStarted first, then component categories, then other doc categories
  const orderedCats: typeof cats = {};

  // 1. Add getStarted first
  if (cats.getStarted) {
    orderedCats.getStarted = cats.getStarted;
  }

  // 2. Add component categories
  Object.entries(componentCats).forEach(([key, value]) => {
    orderedCats[key] = value;
  });

  // 3. Add other doc categories (from components-docs, excluding getStarted)
  Object.entries(cats).forEach(([key, value]) => {
    if (key !== 'getStarted') {
      orderedCats[key] = value;
    }
  });

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
    cats: orderedCats,
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
      className={'l-content-container'}
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
