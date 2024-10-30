import { Fieldset as FieldsetParent } from './Fieldset';
import { FieldsetDescription } from './FieldsetDescription';
import { FieldsetLegend } from './FieldsetLegend';

/**
 * @example
 * <Fieldset>
 *  <Fieldset.Legend>Legend text</Fieldset.Legend>
 *  <Fieldset.Description>Description text</Fieldset.Description>
 *  ...input components
 * </Fieldset>
 */
const Fieldset = Object.assign(FieldsetParent, {
  Legend: FieldsetLegend,
  Description: FieldsetDescription,
});

Fieldset.Legend.displayName = 'Fieldset.Legend';
Fieldset.Description.displayName = 'Fieldset.Description';

export type { FieldsetLegendProps } from './FieldsetLegend';
export type { FieldsetDescriptionProps } from './FieldsetDescription';
export type { FieldsetProps } from './Fieldset';
export { Fieldset, FieldsetLegend, FieldsetDescription };
