import path from 'path';

import directoryTree from 'directory-tree';

/*
 * Creates menu tree with siblings based on current route
 */
const getServerSideProps = async (context: any) => {
  const { resolvedUrl } = context;
  const urlArray = resolvedUrl.split('/');
  const parentPage = urlArray[1];
  const parentDirectory = path.join(process.cwd(), 'pages');
  const title = parentPage;

  const pot = directoryTree(parentDirectory, { exclude: /index.mdx|_app.tsx/ });
  return {
    props: {
      menu: {
        title: title,
        items: pot.children,
      },
    },
  };
};

export { getServerSideProps };
