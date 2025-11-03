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
import type { Route } from './+types/layout';
import classes from './layout.module.css';

export { ErrorBoundary } from '~/root';

// Maps to store unique entries
const componentsMap = new Map<string, { title: string; url: string }>();
const changelogsMap = new Map<string, { title: string; url: string }>();

const cats: {
  [key: string]: {
    title: string;
    url: string;
  }[];
} = {
  changelogs: [],
  components: [],
};

export const loader = async ({
  params: { lang },
  request,
}: Route.LoaderArgs) => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  if (!cats.components.length) {
    componentsMap.clear();
    changelogsMap.clear();

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

    const packages = getFilesFromContentDir('/changelogs');
    for (const pkg of packages) {
      const fileContent = getFileFromContentDir(
        join('changelogs', `${pkg.relativePath}`),
      );
      const result = await generateFromMdx(fileContent);

      const changelog = {
        title: result.frontmatter.sidebarTitle,
        url: `/${lang}/changelog/${result.frontmatter.url}`,
      };
      changelogsMap.set(changelog.url, changelog);
    }

    cats.components = Array.from(componentsMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title),
    );
    cats.changelogs = Array.from(changelogsMap.values());
  }

  const trimmedUrl = request.url.endsWith('/')
    ? request.url.slice(0, -1)
    : request.url;
  const compPage = trimmedUrl.split('/').pop();

  return {
    lang,
    cats,
    sidebarSuffix: { components: '/' + compPage },
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
