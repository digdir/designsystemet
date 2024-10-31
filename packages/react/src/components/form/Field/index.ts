import { FieldAffix, FieldAffixWrapper } from '../Field/InputAffix';
import { Field as FieldParent } from './Field';
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
  AffixWrapper: FieldAffixWrapper,
  Affix: FieldAffix,
});

Field.Description.displayName = 'Field.Description';
Field.AffixWrapper.displayName = 'Field.AffixWrapper';
Field.Affix.displayName = 'Field.Affix';

export type {
  FieldAffixProps,
  FieldAffixWrapperProps,
} from '../Field/InputAffix';
export type { FieldProps } from './Field';
export type { FieldDescriptionProps } from './FieldDescription';
export { Field, FieldDescription, FieldAffix, FieldAffixWrapper };
