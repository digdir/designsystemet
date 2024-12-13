import { Field as FieldParent } from './Field';
import { FieldAffix, FieldAffixes } from './FieldAffix';
import { FieldCounter } from './FieldCounter';
import { FieldDescription } from './FieldDescription';

/**
 * @example
 * <Field>
 *  <Label>Label text</Label>
 *  <Field.Description>Description</Field.Description>
 *  <Input />
 *  <ValidationMessage>Validation message</ValidationMessage>
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
