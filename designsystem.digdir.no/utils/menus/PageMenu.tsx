import fs from 'fs';
import path from 'path';

/*
 * Scans the components directory and generates list og Meta data used in menus and lists of components
 */
const getServerSideProps = async (context: any) => {
  const { params, resolvedUrl } = context;
  const parent = resolvedUrl.split('/')[1];
  const postsDirectory = path.join(process.cwd(), 'pages/' + parent);
  const fileNames = fs.readdirSync(postsDirectory);

  const test = fileNames.map((fileName) => {
    // Remove ".mdx" from file name to get id
    const pageName = fileName.replace(/\.mdx$/, '');

    return {
      title: pageName,
      url: parent + '/' + pageName,
    };
  });

  return {
    props: {
      menu: test,
    },
  };
};

export { getServerSideProps };
