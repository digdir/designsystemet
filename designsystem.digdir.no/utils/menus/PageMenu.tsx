import fs from 'fs';
import path from 'path';

/*
 * Scans the components directory and generates list og Meta data used in menus and lists of components
 */
const getStaticProps = async (context) => {
  const postsDirectory = path.join(process.cwd(), 'pages/god-praksis');
  const fileNames = fs.readdirSync(postsDirectory);
  const { params } = context;

  console.log(params);

  const test = fileNames.map((fileName) => {
    // Remove ".mdx" from file name to get id
    const pageName = fileName.replace(/\.mdx$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);

    return {
      title: pageName,
      url: 'god-praksis/' + pageName,
    };
  });

  return {
    props: {
      menu: test,
    },
  };
};

export { getStaticProps };
