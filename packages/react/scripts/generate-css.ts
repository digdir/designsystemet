import path from 'path';

import postcss from 'postcss';
import cssnano from 'cssnano';
import postcssModules from 'postcss-modules';
import glob from 'fast-glob';
import fs from 'fs-extra';

import { generateScopedName } from './rollup/hash-name.mjs';

console.log('Generating css files');

console.log({
  dirPath: path.resolve(__dirname, '../src/**/*.css').replace(/\\/g, '/'),
});

const files = glob.sync(
  path.resolve(__dirname, '../src/**/*.css').replace(/\\/g, '/'),
);
const modules = files.filter((file) => file.endsWith('.module.css'));
const global = files.find((file) => file.endsWith('global.css'));

if (typeof global !== 'string') {
  throw new Error('Could not find global.css file');
}

console.log({
  allCssFiles: files,
  allCssModules: modules,
  globalCssFile: global,
});

function prepareFileName(filePath: string) {
  return path.basename(filePath).replace('.module.css', '.css');
}

const outputFolder = path.resolve(__dirname, '../../css');
fs.ensureDirSync(outputFolder);

async function processFile(
  filePath: string,
  scopeBehaviour: 'local' | 'global',
) {
  const result = await postcss([
    postcssModules({
      generateScopedName,
      getJSON: () => {
        return;
      },
      scopeBehaviour,
    }),
    cssnano({ preset: 'default' }),
  ]).process(fs.readFileSync(filePath, 'utf-8'), {
    from: path.basename(filePath),
  });

  const fileName = prepareFileName(filePath);

  // if file comes from ./legacy folder, add it to the legacy folder
  if (filePath.includes('legacy')) {
    // if legacy folder does not exist, create it
    if (!fs.existsSync(path.join(outputFolder, 'legacy'))) {
      fs.mkdirSync(path.join(outputFolder, 'legacy'));
    }

    return fs.writeFile(
      path.join(outputFolder, 'legacy', fileName),
      result.css,
    );
  }

  return fs.writeFile(path.join(outputFolder, fileName), result.css);
}

async function createFiles() {
  if (typeof global !== 'string') {
    throw new Error('Could not find global.css file');
  }

  // group files that are under src/components/{THIS IS THE NAME}
  const components: { [key: string]: string[] } = {};
  modules.forEach((file) => {
    if (file.includes('/components')) {
      let componentName = file.split('/components/')[1];

      /* if (componentName.includes('form/')) {
        componentName = componentName.split('form/')[1].split('/')[0];
      } else  */
      if (componentName.includes('legacy/')) {
        componentName = componentName.split('legacy/')[1].split('/')[0];
      } else {
        // find first uppercase letter
        const filenameParts = componentName.split('/');
        const uppercasePart = filenameParts.find(
          (part) => part[0] === part[0].toUpperCase(),
        );

        if (!uppercasePart) {
          throw new Error(
            `Could not find uppercase part in ${componentName} from ${file}`,
          );
        }

        componentName = uppercasePart;
      }

      if (!components[componentName]) {
        components[componentName] = [];
      }
      components[componentName].push(file);
    }
  });

  console.log({ components });

  const generatedComponents: string[] = [];

  // go over the components, and create a file that contains all the css for that component
  await Promise.all(
    Object.entries(components).map(async ([componentName, files]) => {
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

      generatedComponents.push(
        path
          .join(outputFolder, `${componentName.toLowerCase()}.css`)
          .replace(/\\/g, '/')
          .split('/css/')[1],
      );

      return fs.writeFile(
        path.join(outputFolder, `${componentName.toLowerCase()}.css`),
        result.css,
      );
    }),
  ).then(async () => {
    await concatIntoGlobal(generatedComponents);
  });

  console.log('Done generating css files');
}

async function concatIntoGlobal(cssFiles: string[]) {
  await new Promise<void>((resolve) => {
    fs.writeJsonSync(
      path.join(__dirname, '../../css/css-exports.json'),
      {
        modules: cssFiles.filter((file) => !file.includes('global.css')),
        index: prepareFileName('index.css'),
      },
      { spaces: 2 },
    );

    console.log({ generatedCssFiles: cssFiles });
    const cssFilesContent = cssFiles.map((file) => `@import url('${file}');`);
    fs.writeFileSync(
      path.join(outputFolder, 'index.css'),
      cssFilesContent.join('\n'),
    );

    resolve();
  });
}

void createFiles();
