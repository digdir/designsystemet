const componentName = process.argv[2];
const componentPath = './packages/react/src/components/';
import { mkdir, writeFile } from 'fs/promises';

import { consoleMessage } from './message';
import {
  mainContent,
  exportContent,
  cssContent,
  storyContent,
  mdxContent,
  testContent,
} from './fileTemplates';

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

  // Creates the story file
  await writeFile(
    `${componentPath}/${componentName}/${componentName}.stories.tsx`,
    storyContent(componentName),
  );

  // Creates the mdx file
  await writeFile(
    `${componentPath}/${componentName}/${componentName}.mdx`,
    mdxContent(componentName),
  );

  // Creates the mdx file
  await writeFile(
    `${componentPath}/${componentName}/${componentName}.test.tsx`,
    testContent(componentName),
  );

  // Creates the export file
  await writeFile(
    `${componentPath}/${componentName}/index.ts`,
    exportContent(componentName),
  );

  consoleMessage(
    'The ' +
      componentName +
      ' component for Storybook was successfully created.',
  );
})().catch((e) => {
  console.log(e);
});
