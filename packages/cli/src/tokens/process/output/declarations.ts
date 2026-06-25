import pc from 'picocolors';
import pkg from '../../../../package.json' with { type: 'json' };
import { baseColors } from '../../../colors/colorMetadata.js';
import type { OutputFile } from '../../types.js';
import { getThemeColors, type ProcessedThemeObject } from '../utils/getMultidimensionalThemes.js';

export const defaultFileHeader = `build: v${pkg.version}`;

export const createTypeDeclarationFiles = (processed$themes: ProcessedThemeObject[]): OutputFile[] => {
  const colors = getThemeColors(processed$themes);
  const typeDeclaration = createColorTypeDeclaration(colors);
  return [
    {
      output: `/* This file is deprecated and will be removed in a future release. Use types.d.ts instead */\n${typeDeclaration}`,
      destination: 'colors.d.ts',
    },
    {
      output: typeDeclaration,
      destination: 'types.d.ts',
    },
  ];
};

function createColorTypeDeclaration(colors: string[]) {
  console.log(`\n🍱 Building ${pc.green('type declarations')}`);

  const severityColors = Object.keys(baseColors);
  const colorsWithoutSeverity = colors.filter((color) => !severityColors.includes(color));

  const typeDeclaration = `
/* ${defaultFileHeader} */
import type {} from '@digdir/designsystemet-types';

// Augment types based on theme
declare module '@digdir/designsystemet-types' {
  export interface ColorDefinitions {
${colorsWithoutSeverity.map((color) => `    ${color.includes('-') ? `'${color}'` : color}: never;`).join('\n')}
  }
  export interface SeverityColorDefinitions {
${severityColors.map((color) => `    ${color}: never;`).join('\n')}
  }
}
`.trimStart();

  return typeDeclaration;
}
