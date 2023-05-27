const componentName = process.argv[2];
const componentPath = './';
import { mkdir, writeFile } from 'fs/promises';
import { mainContent, exportContent, cssContent } from './fileTemplates.mjs';

(async () => {
  // Component folder
  mkdir(`${componentPath}/${componentName}`).catch(console.error);

  // Component file
  writeFile(
    `${componentPath}/${componentName}/${componentName}.tsx`,
    mainContent(componentName),
  );

  // Css file
  writeFile(
    `${componentPath}/${componentName}/${componentName}.module.css`,
    cssContent(componentName),
  );

  // Export file
  writeFile(
    `${componentPath}/${componentName}/index.ts`,
    exportContent(componentName),
  );
})();
