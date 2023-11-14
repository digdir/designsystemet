import path from 'path';

import postcss from 'postcss';
import cssnano from 'cssnano';
import postcssModules from 'postcss-modules';
import glob from 'fast-glob';
import fs from 'fs-extra';
import * as R from 'ramda';

import { generateScopedName } from './name';

console.log('Generating css files');

console.log({
  dirPath: path.resolve(__dirname, '../src/**/*.css').replace(/\\/g, '/'),
});

const files = glob.sync(
  path.resolve(__dirname, '../src/**/*.css').replace(/\\/g, '/'),
);
const modules = files.filter((file) => file.endsWith('.module.css'));

console.log({
  allCssFiles: files,
  allCssModules: modules,
});

const outputFolder = path.resolve(__dirname, '../../css');
fs.ensureDirSync(outputFolder);

async function createFiles() {
  // group files that are under src/components/{THIS IS THE NAME}
  const components: { [key: string]: string[] } = {};

  modules.forEach((file) => {
    let componentName = file.split('/src/')[1];

    if (file.includes('utilities/')) {
      componentName = componentName.split('utilities/')[1].split('/')[0];
    }

    if (componentName.includes('legacy/')) {
      componentName = componentName.split('legacy/')[1].split('/')[0];
    }

    // find first uppercase letter
    const name = componentName
      .split('/')
      .find(
        (part) =>
          part[0] === part[0].toUpperCase() || part === 'utility.module.css',
      );

    if (!name) {
      throw new Error(
        `Could not find uppercase part in ${componentName} from ${file}`,
      );
    }

    if (!components[name]) {
      components[name] = [];
    }
    components[name].push(file);
  });

  console.log({ components });

  const generatedComponents: string[] = [];

  // go over the components, and create a file that contains all the css for that component
  await Promise.all(
    Object.entries(components).map(async ([componentName, files]) => {
      componentName = componentName.toLowerCase().split('.')[0];
      const result = await postcss([
        postcssModules({
          generateScopedName,
          getJSON: () => {
            return;
          },
          scopeBehaviour: 'local',
        }),
        cssnano({ preset: 'default' }),
      ]).process(
        files.map((file) => fs.readFileSync(file, 'utf-8')).join('\n'),
        {
          from: path.basename(files[0]),
        },
      );

      if (files[0].includes('legacy')) {
        // if legacy folder does not exist, create it
        if (!fs.existsSync(path.join(outputFolder, 'legacy'))) {
          fs.mkdirSync(path.join(outputFolder, 'legacy'));
        }

        generatedComponents.push(
          path
            .join(outputFolder, 'legacy', `${componentName}.css`)
            .replace(/\\/g, '/')
            .split('/css/')[1],
        );

        return fs.writeFile(
          path.join(outputFolder, 'legacy', `${componentName}.css`),
          result.css,
        );
      }

      if (files[0].includes('utilities')) {
        // if utilities folder does not exist, create it
        if (!fs.existsSync(path.join(outputFolder, 'utilities'))) {
          fs.mkdirSync(path.join(outputFolder, 'utilities'));
        }

        generatedComponents.push(
          path
            .join(outputFolder, 'utilities', `${componentName}.css`)
            .replace(/\\/g, '/')
            .split('/css/')[1],
        );

        return fs.writeFile(
          path.join(outputFolder, 'utilities', `${componentName}.css`),
          result.css,
        );
      }

      generatedComponents.push(
        path
          .join(outputFolder, `${componentName}.css`)
          .replace(/\\/g, '/')
          .split('/css/')[1],
      );

      return fs.writeFile(
        path.join(outputFolder, `${componentName}.css`),
        result.css,
      );
    }),
  ).then(() => {
    const [utilityFiles, componentFiles] = R.partition(
      R.includes('utilities/'),
      generatedComponents,
    );

    createUtilities(utilityFiles);
    createIndex(['utilities.css', ...componentFiles]);
  });

  console.log('Done generating css files');
}

function createUtilities(utlityFiles: string[]) {
  const cssFilesContent = utlityFiles.map((file) => `@import url('${file}');`);
  fs.writeFileSync(
    path.join(outputFolder, 'utilities.css'),
    cssFilesContent.join('\n'),
  );
}

function createIndex(cssFiles: string[]) {
  // fs.writeJsonSync(
  //   path.join(__dirname, '../../css/css-exports.json'),
  //   {
  //     modules: cssFiles.filter((file) => !file.includes('global.css')),
  //     index: prepareFileName('index.css'),
  //   },
  //   { spaces: 2 },
  // );

  console.log({ generatedCssFiles: cssFiles });
  const cssFilesContent = cssFiles.map((file) => `@import url('${file}');`);
  fs.writeFileSync(
    path.join(outputFolder, 'index.css'),
    cssFilesContent.join('\n'),
  );
}

void createFiles();
