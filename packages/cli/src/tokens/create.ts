import path from 'node:path';
import type { ColorScheme } from '../colors/types.js';
import {
  generateColorScheme,
  generateGlobal,
  generateSemantic,
  generateTheme,
  generateTypography,
} from './create/generators.js';
import type { Theme, TokensSet } from './types.js';

const DIRNAME: string = import.meta.dirname || __dirname;

const getToken = async (tokenSet: string): Promise<TokensSet> => {
  const joinedPath = path.join(DIRNAME, '/template/design-tokens/', `${tokenSet}.json`);
  return (await import(joinedPath)).default;
};

export const cliOptions = {
  outDir: 'out-dir',
  clean: 'clean',
  theme: {
    colors: {
      main: 'main-colors',
      support: 'support-colors',
      neutral: 'neutral-color',
    },
    typography: {
      fontFamily: 'font-family',
    },
    borderRadius: 'border-radius',
  },
} as const;

export const createTokens = async (opts: Theme) => {
  const { colors, typography, name, borderRadius } = opts;
  const colorSchemes: ColorScheme[] = ['light', 'dark'];

  const semantic = generateSemantic(colors);

  const tokenSets = new Map<string, TokensSet>([
    ['primitives/globals', await getToken('primitives/globals')],
    ['primitives/modes/size/small', await getToken('primitives/modes/size/small')],
    ['primitives/modes/size/medium', await getToken('primitives/modes/size/medium')],
    ['primitives/modes/size/large', await getToken('primitives/modes/size/large')],
    ['primitives/modes/size/global', await getToken('primitives/modes/size/global')],
    ['primitives/modes/typography/size/small', await getToken('primitives/modes/typography/size/small')],
    ['primitives/modes/typography/size/medium', await getToken('primitives/modes/typography/size/medium')],
    ['primitives/modes/typography/size/large', await getToken('primitives/modes/typography/size/large')],
    [`primitives/modes/typography/primary/${name}`, generateTypography(name, typography)],
    [`primitives/modes/typography/secondary/${name}`, generateTypography(name, typography)],
    ...colorSchemes.flatMap((scheme): [string, TokensSet][] => [
      [`primitives/modes/color-scheme/${scheme}/global`, generateGlobal(scheme)],
      [`primitives/modes/color-scheme/${scheme}/${name}`, generateColorScheme(name, scheme, colors)],
    ]),
    [`themes/${name}`, generateTheme(colors, name, borderRadius)],
    ['semantic/color', semantic.color],
    ['semantic/style', await getToken('semantic/style')],
    // maps out semantic modes, ieg 'semantic/modes/main-color/accent', and 'semantic/modes/support-color/brand1'
    ...Object.entries(semantic.modes).flatMap(([mode, colors]): [string, TokensSet][] =>
      Object.entries(colors).map(([key, colorSet]): [string, TokensSet] => [`semantic/modes/${mode}/${key}`, colorSet]),
    ),
  ]);

  return { tokenSets };
};
