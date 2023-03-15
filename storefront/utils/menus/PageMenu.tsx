import path from 'path';

import directoryTree from 'directory-tree';

/*
 * Creates menu tree with siblings based on current route
 */
const getServerSideProps = async (context: { resolvedUrl: string }) => {
  const { resolvedUrl } = context;
  const urlArray = resolvedUrl.split('/');
  const parentPage = urlArray[1];
  const parentDirectory = path.join(process.cwd(), 'pages/' + parentPage);
  const title = parentPage;

  const menuTree = directoryTree(parentDirectory, {
    exclude: /index.mdx|_app.tsx/,
  });

  return {
    props: {
      menu: {
        title: title,
        children: menuTree.children,
      },
    },
  };
};

export { getServerSideProps };
