import { Field as FieldParent } from './field';
import { FieldAffix, FieldAffixes } from './field-affix';
import { FieldCounter } from './field-counter';
import { FieldDescription } from './field-description';

/**
 * Field component, used to wrap a form field.
 *
 * @example
 * <Field>
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

export type { FieldProps } from './field';
export type {
  FieldAffixesProps,
  FieldAffixProps,
} from './field-affix';
export type { FieldCounterProps } from './field-counter';
export type { FieldDescriptionProps } from './field-description';
export { Field, FieldDescription, FieldAffix, FieldAffixes, FieldCounter };
