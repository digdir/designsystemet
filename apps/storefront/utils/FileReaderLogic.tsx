import fs from 'fs';
import path from 'path';

/*
 * Scans the components directory and generates list og Meta data used in menus and lists of components
 */
const getStaticProps = () => {
  const postsDirectory = path.join(process.cwd(), 'pages/komponenter');
  const fileNames = fs.readdirSync(postsDirectory);

  const test = fileNames.map((fileName) => {
    // Remove ".mdx" from file name to get id
    const pageName = fileName.replace(/\.mdx$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Check if component is beta by finding string pattern
    const beta = fileContents.indexOf("status='beta'") !== -1;
    const deprecated = fileContents.indexOf("status='deprecated'") !== -1;
    const status = beta ? 'beta' : deprecated ? 'deprecated' : 'stable';

    return {
      title: pageName,
      status: status,
      url: 'komponenter/' + pageName,
    };
  });

  return {
    props: {
      menu: test,
    },
  };
};

export { getStaticProps };
