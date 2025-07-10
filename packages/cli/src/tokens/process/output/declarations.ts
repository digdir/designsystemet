import chalk from 'chalk';
import pkg from '../../../../package.json' with { type: 'json' };
import type { OutputFile } from '../../types.js';
import { buildOptions } from '../platform.js';
import { getCustomColors, type ProcessedThemeObject } from '../utils/getMultidimensionalThemes.js';

export const defaultFileHeader = `build: v${pkg.version}`;

export const createTypeDeclarationFiles = (processed$themes: ProcessedThemeObject[]): OutputFile[] => {
  const colorGroups = buildOptions?.colorGroups || [];
  const customColors = getCustomColors(processed$themes, colorGroups);

  const typeDeclaration = createColorTypeDeclaration([...customColors, 'neutral']);
  return [
    {
      output: typeDeclaration,
      destination: 'colors.d.ts',
    },
  ];
};

function createColorTypeDeclaration(colors: string[]) {
  console.log(`\n🍱 Building ${chalk.green('type declarations')}`);

  const typeDeclaration = `
/* ${defaultFileHeader} */
// @ts-ignore: Ignore invalid module name for augmentation
import type {} from '@digdir/designsystemet-react/colors';
interface Colors_ {
${colors.map((color) => `    ${color.includes('-') ? `'${color}'` : color}: never;`).join('\n')}
}
interface SeverityColors_ {
  info: never;
  success: never;
  warning: never;
  danger: never;
}

// Types for esm module import
export type Colors = keyof Colors_;
export type SeverityColors = keyof SeverityColors_;
export type Color = Colors | SeverityColors;

// Augment types in react package based on theme
// @ts-ignore: Ignore invalid module name for augmentation
declare module '@digdir/designsystemet-react/colors' {
  export interface ReactSeverityColors extends SeverityColors_ {}
  export interface ReactColors extends Colors_ {}
}
`.trimStart();

  return typeDeclaration;
}
