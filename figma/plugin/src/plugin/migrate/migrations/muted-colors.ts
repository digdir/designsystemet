// Muted colors (issue #5351, PR #5527): components no longer use the neutral color. Borders, read-only fields
// and secondary text use the new muted steps of the component's own color instead, and the rest use the same
// step of the component's color. This is what the CSS changed; the UI kit's manual guide is
// https://github.com/digdir/designsystemet/issues/5351#issuecomment-6492795254.

import {
  type ComponentTarget,
  type PaintContext,
  type PaintTarget,
  rebindComponents,
} from '../rebind';
import type { Migration, VariableRef } from '../types';

const color = (name: string): VariableRef => ({ collection: 'Color', name });

/** The components in the UI kit whose colors changed, by page. */
export const MUTED_COLOR_COMPONENTS: ComponentTarget[] = [
  ...['_Header', '_Content', '_Footer', 'Dialog'].map((name) => ({
    page: 'Dialog',
    name,
  })),
  { page: 'Divider', name: 'Divider' },
  ...['_Heading', '.Groups/Default', '.Group 1', 'Dropdown'].map((name) => ({
    page: 'Dropdown',
    name,
  })),
  { page: 'Error summary', name: 'Error summary' },
  { page: 'File upload', name: 'File upload' },
  { page: 'Skeleton', name: 'Skeleton' },
  ...[
    '.Item in multiselect',
    '.multiselect - contentlist',
    '.Clearable',
    'Multi suggestion',
    '.Item in suggestion',
    '.suggestion - contentlist',
    'Suggestion',
  ].map((name) => ({ page: 'Suggestion', name })),
  { page: 'Textfield', name: 'Textfield' },
  { page: 'Textarea', name: 'Textarea' },
  { page: 'Select', name: 'Select' },
  { page: 'Search', name: 'Search - ⚠️Deprecated' },
  { page: 'Tabs', name: '_tab elements base' },
  { page: 'Tabs', name: 'Tabs' },
  { page: 'Tooltip', name: 'Tooltip' },
  // Checkbox, Radio and Switch are styled by input.css and field.css, so they changed with the other fields.
  ...['.input checkbox', '.input and label', 'Checkbox'].map((name) => ({
    page: 'Checkbox',
    name,
  })),
  ...['.input radio', '.input and label', 'Radio'].map((name) => ({
    page: 'Radio',
    name,
  })),
  ...['.switch base component', 'Switch'].map((name) => ({
    page: 'Switch',
    name,
  })),
];

/** The step of a neutral variable in the Semantic collection, e.g. `border-subtle`, or null for other variables. */
function neutralStep(variable: VariableRef): string | null {
  const prefix = 'color/neutral/';
  return variable.collection === 'Semantic' && variable.name.startsWith(prefix)
    ? variable.name.slice(prefix.length)
    : null;
}

/** Whether a layer is a checkbox's checkmark, a radio's dot or a switch's thumb, which CSS draws in the text color. */
function isToggleIndicator(path: string): boolean {
  return (
    /\/(intermediate|indicator|sirkel)$/.test(path) ||
    /\/\.Scalable checkmark\//.test(path)
  );
}

/** The variable a paint in a UI kit component should use with muted colors. */
export function mutedColorRule(context: PaintContext): PaintTarget {
  const { component, variant, path, property, variable } = context;
  const readOnly = /read-?only/i.test(variant);
  const isDescription = /^\/label and description\/description$/i.test(path);
  const isOptionDescription =
    /^\.Item in (suggestion|multiselect)$/.test(component) &&
    /\/label and description\/description$/i.test(path);

  // File upload changed more than its neutral colors: the drop zone has no background unless hovered, and
  // the read-only drop zone is muted.
  if (component === 'File upload') {
    const disabled = /disabled/i.test(variant);
    if (path === '/Dropzone' && property === 'fill' && !/hover/i.test(variant))
      return 'remove';
    if (/Dropzone-description$/.test(path))
      return color(disabled ? 'text-muted' : 'text-default');
    if (disabled && (/CircleSlash/.test(path) || /Dropzone-label$/.test(path)))
      return color('text-muted');
    if (disabled && path === '/Dropzone' && property === 'stroke')
      return color('border-muted');
    if (isDescription) return color('text-default');
  }

  const step = neutralStep(variable);
  if (!step) return null;

  if (component === 'Error summary' && step === 'text-default') {
    return { collection: 'Semantic', name: 'color/danger/text-default' };
  }

  switch (step) {
    case 'border-subtle':
      return color('border-muted');
    case 'border-default':
      // Textarea's resize handle isn't a border.
      return color(
        /Utvid feltet/.test(path) ? 'border-default' : 'border-muted',
      );
    case 'surface-tinted':
      return color('surface-muted');
    case 'text-subtle':
      // Field descriptions, and option descriptions in Suggestion, use the text color, as in the CSS.
      if (isDescription || isOptionDescription) return color('text-default');
      if (
        /\/(prefix|suffix)\//.test(path) ||
        /^(_tab elements base|Tabs)$/.test(component) ||
        readOnly
      ) {
        return color('text-muted');
      }
      return color('text-subtle');
    case 'text-default':
      // The value of a read-only field: its text, or the checkmark, radio dot or switch thumb.
      if (
        readOnly &&
        (/input te(xt|kst)$/i.test(path) || isToggleIndicator(path))
      )
        return color('text-muted');
      return color('text-default');
    default:
      return color(step);
  }
}

export const mutedColors: Migration = {
  id: 'muted-colors',
  title: 'Muted colors',
  description:
    'Components no longer use the neutral color. Borders, read-only fields and secondary text use the new muted colors, and the rest use the component’s own color. Import a config with muted colors first.',
  requires: [
    color('surface-muted'),
    color('border-muted'),
    color('text-muted'),
  ],
  run: (context) =>
    rebindComponents(
      MUTED_COLOR_COMPONENTS,
      {
        paint: mutedColorRule,
        // The close button in Dialog's header was neutral.
        clearMode: ({ component, path, collection, mode }) =>
          component === '_Header' &&
          /\/Icon button$/.test(path) &&
          collection === 'Color' &&
          mode === 'neutral',
        // Placeholder content, and Spinner, which is its own component.
        skip: (node) =>
          node.name === '.Slot component' ||
          (node.type === 'INSTANCE' && node.name === 'Spinner'),
      },
      context,
    ),
};
