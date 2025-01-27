import { cssVarRename } from './codemods/css/plugins.js';
import { runCssCodemod } from './codemods/css/run.js';

/**
 * Replaces placeholders %color in the given templates with the provided colors.
 *
 * @param {string} oldTemplate - The template string containing the placeholder to be replaced.
 * @param {string} newTemplate - The template string containing the placeholder to be replaced.
 * @param {string[]} colors - An array of color strings to replace the placeholder in the templates.
 * @returns {Record<string, string>} An object mapping the old template with replaced colors to the new template with replaced colors.
 */
const templateReplace = (oldTemplate: string, newTemplate: string, colors: string[]): Record<string, string> => {
  return colors.reduce(
    (acc: Record<string, string>, color) => {
      acc[oldTemplate.replace('%color', color)] = newTemplate.replace('%color', color);
      return acc;
    },
    {} as Record<string, string>,
  );
};

const colors = ['neutral', 'accent', 'brand1', 'brand2', 'brand3', 'danger', 'warning', 'success', 'info'];

export default (glob?: string) =>
  runCssCodemod({
    globPattern: glob,
    plugins: [
      // https://github.com/digdir/designsystemet/issues/3046
      cssVarRename({
        // Background
        '--ds-color-background-subtle': '--ds-color-background-tinted',
        ...templateReplace('--ds-color-%color-background-subtle', '--ds-color-%color-background-tinted', colors),
        // Surface
        '--ds-color-surface-default': '--ds-color-surface-tinted',
        ...templateReplace('--ds-color-%color-surface-default', '--ds-color-%color-surface-tinted', colors),
        // Contrast
        '--ds-color-contrast-default': '--ds-color-base-contrast-default',
        '--ds-color-contrast-subtle': '--ds-color-base-contrast-subtle',
        ...templateReplace('--ds-color-%color-contrast-default', '--ds-color-%color-base-contrast-default', colors),
        ...templateReplace('--ds-color-%color-contrast-subtle', '--ds-color-%color-base-contrast-subtle', colors),
      }),
    ],
  });
