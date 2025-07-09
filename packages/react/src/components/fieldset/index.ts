import { Fieldset as FieldsetParent } from './fieldset';
import { FieldsetDescription } from './fieldset-description';
import { FieldsetLegend } from './fieldset-legend';

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

export type { FieldsetProps } from './fieldset';
export type { FieldsetDescriptionProps } from './fieldset-description';
export type { FieldsetLegendProps } from './fieldset-legend';
export { Fieldset, FieldsetLegend, FieldsetDescription };
