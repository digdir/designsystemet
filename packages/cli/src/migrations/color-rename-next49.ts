import * as R from 'ramda';
import { cssVarRename } from './codemods/css/plugins.js';
import { runCssCodemod } from './codemods/css/run.js';

/**
 * Replaces placeholders [color] in the given templates with the provided colors.
 *
 * @param {string} oldTemplate - The template string containing the placeholder to be replaced.
 * @param {string} newTemplate - The template string containing the placeholder to be replaced.
 * @param {string[]} colors - An array of color strings to replace the placeholder in the templates.
 * @returns {Record<string, string>} An object mapping the old template with replaced colors to the new template with replaced colors.
 */
const replace = (
  oldTemplate: string,
  newTemplate: string,
  colors: string[],
  placeholder = '[color]',
): Record<string, string> =>
  R.reduce(
    (acc: Record<string, string>, color) => {
      acc[oldTemplate.replace(placeholder, color)] = newTemplate.replace(placeholder, color);
      return acc;
    },
    {} as Record<string, string>,
    colors,
  );

const colors = ['neutral', 'accent', 'brand1', 'brand2', 'brand3', 'danger', 'warning', 'success', 'info'];

export default (glob?: string) => {
  const renames = {
    // Background
    '--ds-color-background-subtle': '--ds-color-background-tinted',
    ...replace('--ds-color-[color]-background-subtle', '--ds-color-[color]-background-tinted', colors),
    // Surface
    '--ds-color-surface-default': '--ds-color-surface-tinted',
    ...replace('--ds-color-[color]-surface-default', '--ds-color-[color]-surface-tinted', colors),
    // Contrast
    '--ds-color-contrast-default': '--ds-color-base-contrast-default',
    '--ds-color-contrast-subtle': '--ds-color-base-contrast-subtle',
    ...replace('--ds-color-[color]-contrast-default', '--ds-color-[color]-base-contrast-default', colors),
    ...replace('--ds-color-[color]-contrast-subtle', '--ds-color-[color]-base-contrast-subtle', colors),
  };

  console.log(`Renaming ${Object.keys(renames).length} variables`, renames);

  return runCssCodemod({
    globPattern: glob,
    plugins: [
      // https://github.com/digdir/designsystemet/issues/3046
      cssVarRename(renames),
    ],
  });
};
