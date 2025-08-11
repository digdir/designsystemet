import { Fieldset as FieldsetParent } from './fieldset';
import { FieldsetDescription } from './fieldset-description';
import { FieldsetLegend } from './fieldset-legend';

type Fieldset = typeof FieldsetParent & {
  /**
   * Fieldset.Legend component, used to display a legend for a fieldset.
   *
   * @example
   * <Fieldset.Legend>Skriv inn dine svar</Fieldset.Legend>
   */
  Legend: typeof FieldsetLegend;
  /**
   * Fieldset.Description component, used to display a description for a fieldset.
   *
   * @example
   * <Fieldset.Description>
   *   Gi en kort beskrivelse i begge feltene
   * </Fieldset.Description>
   */
  Description: typeof FieldsetDescription;
};

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
const FieldsetComponent: Fieldset = Object.assign(FieldsetParent, {
  Legend: FieldsetLegend,
  Description: FieldsetDescription,
});

FieldsetComponent.Legend.displayName = 'Fieldset.Legend';
FieldsetComponent.Description.displayName = 'Fieldset.Description';

export type { FieldsetProps } from './fieldset';
export type { FieldsetDescriptionProps } from './fieldset-description';
export type { FieldsetLegendProps } from './fieldset-legend';
export { FieldsetComponent as Fieldset, FieldsetLegend, FieldsetDescription };
