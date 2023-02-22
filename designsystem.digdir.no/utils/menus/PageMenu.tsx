import fs from 'fs';
import path from 'path';

/*
 * Creates menu tree with siblings based on current route
 */
const getServerSideProps = async (context: any) => {
  const { resolvedUrl } = context;
  const urlArray = resolvedUrl.split('/');
  let showMenu = true;

  // Don't show menu if root level page
  if (urlArray.length === 2) {
    return {
      props: {
        menu: { showMenu: false, items: [] },
      },
    };
  }

  const parentPage = urlArray[1];
  const parentDirectory = path.join(process.cwd(), 'pages/' + parentPage);
  const fileNames = fs.readdirSync(parentDirectory);
  const title = parentPage;

  // Don't show menu if only child
  if (fileNames.length === 1) {
    showMenu = false;
  }

  const items = fileNames.map((fileName) => {
    // Remove ".mdx" from file name to get id
    const pageName = fileName.replace(/\.mdx$/, '');

    return {
      title: pageName,
      url: parentPage + '/' + pageName,
    };
  });

  return {
    props: {
      menu: {
        title: title,
        items: items,
        showMenu: showMenu,
      },
    },
  };
};

export { getServerSideProps };
