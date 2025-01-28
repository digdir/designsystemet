import { Field as FieldParent } from './Field';
import { FieldAffix, FieldAffixes } from './FieldAffix';
import { FieldCounter } from './FieldCounter';
import { FieldDescription } from './FieldDescription';

/**
 * Field component, used to wrap a form field.
 *
 * @example
 * <Field data-my-field>
 *   <Label>Kort beskrivelse</Label>
 *   <Field.Description>Beskrivelse</Field.Description>
 *   <Input />
 *   <ValidationMessage>Feilmelding</ValidationMessage>
 * </Field>
 */
const Field = Object.assign(FieldParent, {
  Description: FieldDescription,
  Affixes: FieldAffixes,
  Affix: FieldAffix,
  Counter: FieldCounter,
});

Field.Description.displayName = 'Field.Description';
Field.Affixes.displayName = 'Field.Affixes';
Field.Affix.displayName = 'Field.Affix';
Field.Counter.displayName = 'Field.Counter';

export type { FieldCounterProps } from './FieldCounter';
export type {
  FieldAffixProps,
  FieldAffixesProps,
} from './FieldAffix';
export type { FieldProps } from './Field';
export type { FieldDescriptionProps } from './FieldDescription';
export { Field, FieldDescription, FieldAffix, FieldAffixes, FieldCounter };
