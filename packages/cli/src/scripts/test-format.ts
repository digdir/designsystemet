import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary/types';
import { createTokens } from '../tokens/create.js';
import { processPlatform } from '../tokens/process/platform.js';
import type { Theme } from '../tokens/types.js';
import { generateThemesJson } from '../tokens/write/generate$themes.js';
import { writeFile } from '../utils.js';

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
  const { tokenSets } = await createTokens(theme);

  const $themes = generateThemesJson(['dark', 'light'], [theme.name], theme.colors);
  const tokens = await processPlatform({
    process: 'get',
    verbose: false,
    preview: false,
    tokenSets,
    $themes,
    // tokensDir: './../../design-tokens',
    // outDir: './design-tokens-build',
  });

  const filtered = R.omit([theme.name, '_size'], R.head(tokens.semantic) as TransformedToken);

  await writeFile('internal/formatted-tokens.json', JSON.stringify(filtered, null, 2));
}

format();
