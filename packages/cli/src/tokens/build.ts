import type { ThemeObject } from '@tokens-studio/types';
import pc from 'picocolors';
import * as R from 'ramda';
import { dsfs } from '../utils/filesystem.ts';
import { createTypes } from './process/output/declarations.ts';
import { createTailwindCSSFiles } from './process/output/tailwind.ts';
import { createThemeCSSFiles, defaultFileHeader } from './process/output/theme.ts';
import { type BuildOptions, processPlatform } from './process/platform.ts';
import { getThemeColors, processThemeObject } from './process/utils/getMultidimensionalThemes.ts';
import type { DesignsystemetObject, OutputFile } from './types.ts';

type BuildTokensOptions = Omit<BuildOptions, 'type' | 'processed$themes' | 'buildTokenFormats'> & {
  /** Whether to include type declarations. Defaults to `true`. */
  types?: boolean;
};

export const buildTokens = async (options: BuildTokensOptions) => {
  const tokensDir = options.tokensDir;
  const $themes = JSON.parse(await dsfs.readFile(`${tokensDir}/$themes.json`)) as ThemeObject[];
  const processed$themes = $themes.map(processThemeObject);
  let $designsystemet: DesignsystemetObject | undefined;

  try {
    const $designsystemetContent = await dsfs.readFile(`${tokensDir}/$designsystemet.jsonc`);
    $designsystemet = JSON.parse($designsystemetContent) as DesignsystemetObject;
  } catch (_error) {}

  console.log(`\n🏗️  Start building tokens in ${pc.green(tokensDir)}`);

  const processedBuilds = await processPlatform({
    ...options,
    tokensDir: tokensDir,
    type: 'build',
    processed$themes,
    buildTokenFormats: {},
  });

  const fileHeader = R.join('')([
    defaultFileHeader,
    $designsystemet ? `\ndesign-tokens: v${$designsystemet.version}` : '',
  ]);

  const cssFiles = createThemeCSSFiles({ processedBuilds, fileHeader });
  let files: OutputFile[] = [...cssFiles];

  // Here for backwards compatibility with the previous behavior of always generating type declarations when running `tokens build`.
  if (options.types ?? true) {
    files = [...createTypes(getThemeColors(processed$themes)), ...files];
  }

  if (options.tailwind) {
    const tailwindFiles = createTailwindCSSFiles(cssFiles, options.tailwind);
    files = files.concat(tailwindFiles.filter(Boolean) as OutputFile[]);
  }

  return files;
};

/** Builds type declarations from the design tokens in `tokensDir`.
 * We do this to generate TypeScript type declarations for manually added color design tokens.
 */
export const createTypesFromTokens = async (tokensDir: string) => {
  const $themes = JSON.parse(await dsfs.readFile(`${tokensDir}/$themes.json`)) as ThemeObject[];
  const colors = getThemeColors($themes.map(processThemeObject));

  return createTypes(colors);
};
