const componentName = process.argv[2];
const componentPath = './';
import { mkdir, writeFile } from 'fs/promises';

import { mainContent, exportContent, cssContent } from './fileTemplates';

(async () => {
  // Component folder
  await mkdir(`${componentPath}/${componentName}`).catch(console.error);

  // Component file
  await writeFile(
    `${componentPath}/${componentName}/${componentName}.tsx`,
    mainContent(componentName),
  );

  // Css file
  await writeFile(
    `${componentPath}/${componentName}/${componentName}.module.css`,
    cssContent(componentName),
  );

  // Export file
  await writeFile(
    `${componentPath}/${componentName}/index.ts`,
    exportContent(componentName),
  );
})().catch((e) => {
  console.log(e);
});
