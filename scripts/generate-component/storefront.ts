const componentName = process.argv[2];
const componentPath = './storefront/components/';
import { mkdir, writeFile } from 'fs/promises';

import { mainContent, exportContent, cssContent } from './fileTemplates';
import { consoleMessage } from './message';

(async () => {
  if (componentName === undefined) {
    consoleMessage('Missing argument: Name of component');
    return;
  }

  // Creates the component folder
  await mkdir(`${componentPath}/${componentName}`).catch(console.error);

  // Creates the main logic file
  await writeFile(
    `${componentPath}/${componentName}/${componentName}.tsx`,
    mainContent(componentName),
  );

  // Creates the CSS file
  await writeFile(
    `${componentPath}/${componentName}/${componentName}.module.css`,
    cssContent(),
  );

  // Creates the export file
  await writeFile(
    `${componentPath}/${componentName}/index.ts`,
    exportContent(componentName),
  );

  consoleMessage(
    'The ' +
      componentName +
      ' component for the Storefront was successfully created.',
  );
})().catch((e) => {
  console.log(e);
});
