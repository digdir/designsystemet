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
import type {} from '@digdir/designsystemet/types';

// Augment types based on theme
declare module '@digdir/designsystemet/types' {
  export interface ColorDefinitions {
${colors.map((color) => `    ${color.includes('-') ? `'${color}'` : color}: never;`).join('\n')}
  }
  export interface SeverityColorDefinitions {
    info: never;
    success: never;
    warning: never;
    danger: never;
  }
}
`.trimStart();

  return typeDeclaration;
}
