import path from 'path';

import directoryTree from 'directory-tree';

import { SiteConfig } from '../../siteConfig';

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

  let menu = {
    title: parentPageTitle,
    children: menuTree.children,
  };

  menu = sortMenu(menu);

  return {
    props: {
      menu,
    },
  };
};

type PageMenuDataType = {
  title: string;
  children: PageMenuItemType[];
};

type PageMenuItemType = {
  name: string;
  url: string;
  children?: PageMenuItemType[];
};

const sortMenu = (menu: any) => {
  console.log(menu.title);
  menu.children.forEach((item) => {});
  return menu;
};

export type { PageMenuDataType, PageMenuItemType };
export { getServerSideProps };
