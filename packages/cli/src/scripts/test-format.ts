import path from 'node:path';
import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary/types';
import { type File, formatTheme } from '../tokens/format.js';
import type { Theme } from '../tokens/types.js';
import { pathStartsWithOneOf, typeEquals } from '../tokens/utils.js';
import { mkdir, writeFile } from '../utils.js';

const filterStorefront = (token: TransformedToken) => {
  if (
    pathStartsWithOneOf(['border-width', 'letter-spacing', 'border-radius'], token) &&
    !R.includes('semantic', token.filePath)
  )
    return false;

  const isSemanticColor = R.includes('semantic', token.filePath) && typeEquals(['color'], token);
  const wantedTypes = typeEquals(['shadow', 'dimension', 'typography', 'opacity'], token);

  return isSemanticColor || wantedTypes;
};

async function format() {
  const theme: Theme = {
    name: 'digdir',
    colors: {
      main: {
        accent: '#0062BA',
      },
      support: {
        brand1: '#F45F63',
        brand2: '#E5AA20',
        brand3: '#1E98F5',
      },
      neutral: '#1E2B3C',
    },
    typography: {
      fontFamily: 'Inter',
    },
    borderRadius: 99,
  };

  const processedBuilds = await formatTheme(theme);

  let files: File[] = [];
  for (const [_, buildResults] of Object.entries(R.dissoc('types', processedBuilds))) {
    for (const buildResult of buildResults) {
      files = R.concat(files, buildResult.formatted);
    }
  }

  const concatenated = files.map(R.view(R.lensProp('output'))).join('\n');

  await writeFile(`internal/design-tokens-build/files.css`, concatenated);

  for (const file of files) {
    if (file.destination) {
      // Remove last part of the path to get the directory
      const dirPath = path.join('internal/design-tokens-build', R.init(R.split('/', file.destination)).join('/'));
      await mkdir(dirPath);
      await writeFile(`internal/design-tokens-build${file.destination}`, file.output);
    }
  }
}

format();
