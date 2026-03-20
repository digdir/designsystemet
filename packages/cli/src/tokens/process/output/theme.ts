import pc from 'picocolors';
import * as R from 'ramda';
import pkg from '../../../../package.json' with { type: 'json' };
import type { OutputFile } from '../../types.js';
import { sizeComparator } from '../../utils.js';
import type { ProcessReturn } from '../platform.js';

export const defaultFileHeader = `build: v${pkg.version}`;

type CreateThemeCSSFiles = {
  /** The processed build results containing formatted CSS outputs grouped by themes and other permutations. */
  processedBuilds: ProcessReturn;
  /** Optional header to be included in the generated CSS files. */
  fileHeader?: string;
};

const getFileNameWithoutExtension = (path: string) => {
  const pathSegments = path.split('/');
  return pathSegments[pathSegments.length - 1].split('.').slice(0, -1).join('.');
};

/**
 * Generates theme-specific CSS files from Style Dictionary build results.
 *
 * @param processedBuilds - The processed build results containing formatted CSS outputs
 *                          grouped by themes and other permutations.
 * @param fileHeader - Optional header to be included in the generated CSS files.
 * @returns An array of `OutputFile` objects, each representing a theme-specific CSS file
 *          with its destination and content.
 *
 * @remarks
 * - The function groups the build results by theme and ensures a deterministic order
 *   for the sections of the entry CSS file using a predefined sort order.
 * - If a CSS section does not have a defined sort order the section is added to the end of the entry file.
 * - The generated CSS files include a header with metadata and layer definitions.
 */
export const createThemeCSSFiles = ({
  processedBuilds,
  fileHeader = defaultFileHeader,
}: CreateThemeCSSFiles): OutputFile[] => {
  const groupedByTheme: Record<string, OutputFile[]> = {};

  for (const [_, buildResults] of Object.entries(processedBuilds)) {
    for (const buildResult of buildResults) {
      const themeName = buildResult.permutation.theme;
      const newOutputs = buildResult.formatted;
      if (R.isNotEmpty(newOutputs)) {
        const currentOutputs = groupedByTheme[themeName] ?? [];
        groupedByTheme[themeName] = R.concat(currentOutputs, newOutputs);
      }
    }
  }

  /**
   * Defines a sort order for the sections of the entry CSS file.
   * This ensures a deterministic order, whereas earlier this was nondeterministic
   */
  const sortOrder = [
    'size-mode/',
    'type-scale',
    'type-scale/',
    'color-scheme/light',
    'typography/secondary',
    'size',
    'semantic',
    'color-scheme/dark',
    'color-scheme/contrast',
    'typography/primary',
    'color/',
  ];

  const sortByDefinedOrder = R.sortBy<OutputFile>((file) => {
    const filePath = file.destination || '';
    const sortIndex = sortOrder.findIndex((sortElement) => {
      if (sortElement.endsWith('/')) {
        return filePath.includes(sortElement);
      }
      return filePath.includes(`${sortElement}.css`);
    });
    if (sortIndex === -1) {
      // Ensure file names that don't have a specified sort order appear last
      console.error(
        pc.yellow(`WARNING: CSS section does not have a defined sort order: ${filePath.replace('.css', '')}`),
      );
      console.log(
        pc.dim(
          `
The section will currently be added to the end of the entry file, but the exact
order may change due to nondeterminism.`.trim(),
        ),
      );

      return Infinity;
    }
    return sortIndex;
  });

  const header = `@charset "UTF-8";
/*
${fileHeader}
*/

`;

  const sortAlphabetically = R.sort<OutputFile>(R.ascend((x) => x.destination || ''));
  const sortBySize = R.sortBy<OutputFile>(
    R.pipe((s) => getFileNameWithoutExtension(s.destination ?? ''), sizeComparator),
  );
  const pickOutputs = R.map<OutputFile, string>(R.view(R.lensProp('output')));

  const themeCSSFile = R.pipe(
    sortAlphabetically,
    sortBySize,
    sortByDefinedOrder,
    pickOutputs,
    R.join('\n'),
    (content) => header + content,
  );

  const themeCSSFiles: OutputFile[] = Object.entries(groupedByTheme).map(([theme, files]) => ({
    destination: `${theme}.css`,
    output: themeCSSFile(files),
  }));

  return themeCSSFiles;
};
