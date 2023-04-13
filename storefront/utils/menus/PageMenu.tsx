import path from 'path';

import directoryTree from 'directory-tree';

/**
 * Create menu tree based on current route
 */
const getServerSideProps = (context: { resolvedUrl: string }) => {
  const { resolvedUrl } = context;
  const urlArray = resolvedUrl.split('/');
  const parentPageTitle = urlArray[1];
  const parentDirectory = path.join(process.cwd(), 'pages/' + parentPageTitle);

  const menuTree = directoryTree(parentDirectory, {
    exclude: /index.mdx|_app.tsx/,
  });

  return {
    props: {
      menu: {
        title: parentPageTitle,
        children: menuTree.children,
      },
    },
  };
};

type PageMenuDataType = {
  title: string;
  children: PageMenuItemType[];
};

type PageMenuItemType = {
  name: string;
  path: string;
  children: PageMenuItemType[];
};

export type { PageMenuDataType, PageMenuItemType };
export { getServerSideProps };
