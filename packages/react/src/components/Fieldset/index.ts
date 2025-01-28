import { Fieldset as FieldsetParent } from './Fieldset';
import { FieldsetDescription } from './FieldsetDescription';
import { FieldsetLegend } from './FieldsetLegend';

/**
 * Fieldset component, used to wrap a form field.
 *
 * @example
 * <Fieldset>
 *   <Fieldset.Legend>Skriv inn dine svar</Fieldset.Legend>
 *   <Fieldset.Description>
 *     Gi en kort beskrivelse i begge feltene
 *   </Fieldset.Description>
 *   <Field>
 *     <Label>Kort beskrivelse</Label>
 *     <Input />
 *   </Field>
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
