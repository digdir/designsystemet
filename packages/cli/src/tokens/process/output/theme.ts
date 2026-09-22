import pc from 'picocolors';
import * as R from 'ramda';
import pkg from '../../../../package.json' with { type: 'json' };
import type { SemanticColorNames } from '../../../colors/types.ts';
import type { OutputFile } from '../../types.ts';
import { sizeComparator } from '../../utils.ts';
import { buildOptions, type ProcessReturn } from '../platform.ts';

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

type SystemColorVariables =
  | 'Canvas'
  | 'ButtonFace'
  | 'ButtonBorder'
  | 'CanvasText'
  | 'GrayText'
  | 'Highlight'
  | 'HighlightText';

/** Snippet with forced colors support for high contrast mode using system color variables
 * @link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors
 * @link https://blogs.windows.com/msedgedev/2020/09/17/styling-for-windows-high-contrast-with-new-standards-for-forced-colors/*/
function forcedColors() {
  const forcedColorsVariables: Record<SemanticColorNames | 'focus-inner' | 'focus-outer', SystemColorVariables> = {
    'background-default': 'Canvas',
    'background-tinted': 'Canvas',
    'surface-default': 'Canvas',
    'surface-tinted': 'ButtonFace',
    'surface-hover': 'ButtonFace',
    'surface-active': 'ButtonFace',
    'border-subtle': 'ButtonBorder',
    'border-default': 'ButtonBorder',
    'border-strong': 'ButtonBorder',
    'text-subtle': 'CanvasText',
    'text-default': 'CanvasText',
    'base-default':
      'Highlight' /* Using Highlight instead of Accent as Windows contrast mode uses same color for Canvas and Accent */,
    'base-hover': 'Highlight',
    'base-active': 'Highlight',
    'base-contrast-subtle': 'HighlightText',
    'base-contrast-default': 'HighlightText',
    /* Ensure focus ring colors have high contrast too */
    'focus-inner': 'Canvas',
    'focus-outer': 'CanvasText',
  };

  return `
@layer ds.theme.forced-colors {
  @media (forced-colors: active) {
    :root,
    [data-color],
    [data-color-scheme] {
      ${Object.entries(forcedColorsVariables)
        .map(([key, value]) => `--ds-color-${key}: ${value};`)
        .join('\n    ')}
    }
    }
}
`;
}

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
    'color-scheme/light',
    'typography/other',
    'size',
    'semantic',
    'color-scheme/dark',
    'color-scheme/contrast',
    'typography/default',
    'color/',
  ];

  // Typography sets can have any name, so they are sorted by whether they are the default set
  // (which also applies to :root) rather than by name.
  const toSortPath = (filePath: string) => {
    // Destinations are prefixed with the theme name, e.g. "some-org/typography/primary.css"
    const typographySet = /(?:^|\/)typography\/([^/]+)\.css$/.exec(filePath)?.[1];
    if (typographySet === undefined) return filePath;
    return typographySet === buildOptions?.defaultTypography ? 'typography/default.css' : 'typography/other.css';
  };

  const sortByDefinedOrder = R.sortBy<OutputFile>((file) => {
    const filePath = toSortPath(file.destination || '');
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
    (content) => header + content + forcedColors(), // make sure forced colors are appended at the end
  );

  const themeCSSFiles: OutputFile[] = Object.entries(groupedByTheme).map(([theme, files]) => ({
    destination: `${theme}.css`,
    output: themeCSSFile(files),
  }));

  return themeCSSFiles;
};
