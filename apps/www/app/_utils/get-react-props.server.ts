import { existsSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path, { join } from 'node:path';
import {
  type ComponentDoc,
  type PropItem,
  withCustomConfig,
} from 'react-docgen-typescript';

const require = createRequire(import.meta.url);

const getParser = () => {
  return withCustomConfig(
    require.resolve(
      path.join(process.cwd(), '../../packages/react/tsconfig.json'),
    ),
    {
      savePropValueAsString: true,
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop: PropItem) => {
        const defaultLogicFromStorybook = prop.parent
          ? !/node_modules/.test(prop.parent.fileName)
          : true;
        return defaultLogicFromStorybook && prop.name !== 'popovertarget';
      },
    },
  );
};

// Get the absolute path to the component directory using require.resolve
const getReactDir = (component: string) => {
  try {
    // First, resolve the path to the main component file
    const mainFilePath = require.resolve(
      path.join(
        process.cwd(),
        `../../packages/react/src/components/${component}/${component}.tsx`,
      ),
    );
    // Then get its directory
    return join(mainFilePath, '..');
  } catch (error) {
    console.error('Error resolving component path:', error);
    return '';
  }
};

export const getComponentDocs = (component: string): ComponentDoc[] => {
  const reactDir = getReactDir(component);
  try {
    if (!reactDir || !existsSync(reactDir)) {
      console.error('Component directory not found:', reactDir);
      return [];
    }

    const files = readdirSync(reactDir)
      .filter((f) => f.endsWith('.tsx'))
      .filter((f) => !f.includes('.chromatic'))
      .filter((f) => !f.includes('.stories'))
      .filter((f) => !f.includes('.test'));

    const allDocs: ComponentDoc[] = [];

    // First, find and parse the main component file
    const mainComponentFile = files.find((f) => f === `${component}.tsx`);
    if (mainComponentFile) {
      const mainComponentPath = join(reactDir, mainComponentFile);
      const mainDocs = getParser().parse(mainComponentPath);
      allDocs.push(...mainDocs);
    }

    // Then parse all other tsx files
    const otherFiles = files.filter((f) => f !== `${component}.tsx`);
    for (const file of otherFiles) {
      const filePath = join(reactDir, file);
      const docs = getParser().parse(filePath);
      allDocs.push(...docs);
    }

    return allDocs;
  } catch (error) {
    console.error('Error parsing component docs:', error);
    return [];
  }
};
